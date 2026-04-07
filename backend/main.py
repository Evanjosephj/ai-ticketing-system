from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from groq import Groq
from datetime import datetime, timedelta
import os
import json
from dotenv import load_dotenv
from database import get_db, engine
import models
from auth import (
    hash_password, verify_password, create_access_token,
    get_current_user, get_admin_user, get_employee_user
)

load_dotenv()
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise Exception("GROQ_API_KEY not found")

client = Groq(api_key=api_key)

# ==================== SCHEMAS ====================

class TicketCreate(BaseModel):
    title: str
    description: str
    submitted_by: str
    submitted_email: Optional[str] = None

class TicketUpdate(BaseModel):
    status: Optional[str] = None
    note: Optional[str] = None
    helpful: Optional[str] = None
    internal_note: Optional[str] = None

class EmployeeCreate(BaseModel):
    name: str
    email: str
    password: str
    department: str
    role: str
    skill_tags: str
    availability: Optional[str] = "Available"

class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    department: Optional[str] = None
    role: Optional[str] = None
    skill_tags: Optional[str] = None
    availability: Optional[str] = None
    is_active: Optional[int] = None

class AdminCreate(BaseModel):
    name: str
    email: str
    password: str

# ==================== AI ANALYSIS ====================

def analyze_ticket_with_ai(title: str, description: str, employees: list):
    employee_list = "\n".join([
        f"- {e.name} | {e.department} | Skills: {e.skill_tags} | Load: {e.current_load} tickets | Status: {e.availability}"
        for e in employees
    ]) if employees else "No employees available"

    prompt = f"""
You are an AI ticket analysis engine. Analyze the following support ticket and return a JSON response only. No extra text. No markdown. Just pure JSON.

TICKET TITLE: {title}
TICKET DESCRIPTION: {description}

AVAILABLE EMPLOYEES:
{employee_list}

ROUTING RULES:
- Database issue / data corruption → Engineering (Critical)
- Server down / performance issue → Engineering (Critical)
- Payroll / salary / reimbursement → Finance
- Leave / HR policy / onboarding → HR
- Access permissions / account lock → IT (High)
- Product bug / feature request → Engineering
- Marketing / content / branding → Marketing
- Legal / compliance query → Legal (High)

RESOLUTION PATH RULES:
- Choose "Auto-resolve" for: password reset steps, how-to questions, FAQ, policy questions, leave process, tool usage, general info, simple billing clarifications.
- Choose "Assign to department" for: fixing bugs, processing refunds, granting access, investigating outages, payroll corrections, server issues.

Return this exact JSON:
{{
  "category": "one of: Billing, Bug, Access, HR, Server, DB, Feature, Other",
  "ai_summary": "2-3 sentence summary",
  "severity": "one of: Critical, High, Medium, Low",
  "sentiment": "one of: Frustrated, Neutral, Polite",
  "resolution_path": "one of: Auto-resolve, Assign to department",
  "confidence_score": 92,
  "estimated_time": "e.g. 2 hours or 1 day",
  "suggested_department": "department name or null if auto-resolve",
  "suggested_employee": "employee name or null if auto-resolve",
  "auto_response": "if Auto-resolve: write detailed professional response. Otherwise: null"
}}
"""

    message = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=1200,
        messages=[{"role": "user", "content": prompt}]
    )

    response_text = message.choices[0].message.content
    clean = response_text.strip()
    if "```" in clean:
        parts = clean.split("```")
        for part in parts:
            part = part.strip()
            if part.startswith("json"):
                part = part[4:].strip()
            if part.startswith("{"):
                clean = part
                break
    return json.loads(clean.strip())


# ==================== ROOT ====================

@app.get("/")
def read_root():
    return {"message": "AI Ticketing System Backend is running!"}


# ==================== AUTH ROUTES ====================

@app.post("/auth/setup-admin")
def setup_admin(admin: AdminCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.role == "admin").first()
    if existing:
        raise HTTPException(status_code=400, detail="Admin already exists")
    user = models.User(
        name=admin.name,
        email=admin.email,
        password=hash_password(admin.password),
        role="admin"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "Admin created successfully"}


@app.post("/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=401, detail="Account is deactivated")
    token = create_access_token({
        "sub": user.email,
        "role": user.role,
        "name": user.name
    })
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role,
        "name": user.name,
        "email": user.email
    }


@app.get("/auth/me")
def get_me(current_user: models.User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }


# ==================== PUBLIC TICKET ROUTES ====================

@app.post("/tickets/")
def create_ticket(ticket: TicketCreate, db: Session = Depends(get_db)):
    employees = db.query(models.Employee).filter(
        models.Employee.is_active == 1,
        models.Employee.availability != "On Leave"
    ).all()

    ai_result = analyze_ticket_with_ai(ticket.title, ticket.description, employees)

    assigned_employee_id = None
    suggested_name = ai_result.get("suggested_employee")
    if suggested_name:
        emp = db.query(models.Employee).filter(
            models.Employee.name == suggested_name
        ).first()
        if emp:
            assigned_employee_id = emp.id
            emp.current_load += 1
            db.commit()

    is_auto = ai_result.get("resolution_path") == "Auto-resolve"
    suggested_dept = ai_result.get("suggested_department")

    if is_auto:
        notification_msg = "Ticket received. Auto-resolved by AI."
    else:
        notification_msg = f"Ticket received. Assigned to {suggested_name} in {suggested_dept} department."

    new_ticket = models.Ticket(
        title=ticket.title,
        description=ticket.description,
        submitted_by=ticket.submitted_by,
        submitted_email=ticket.submitted_email,
        category=ai_result.get("category"),
        severity=ai_result.get("severity"),
        sentiment=ai_result.get("sentiment"),
        ai_summary=ai_result.get("ai_summary"),
        resolution_path=ai_result.get("resolution_path"),
        confidence_score=ai_result.get("confidence_score"),
        estimated_time=ai_result.get("estimated_time"),
        department=suggested_dept,
        assigned_to=suggested_name,
        assigned_employee_id=assigned_employee_id,
        auto_response=ai_result.get("auto_response"),
        status="Auto-Resolved" if is_auto else "New",
        notification=notification_msg
    )

    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    try:
        timeline = models.TicketTimeline(
            ticket_id=new_ticket.id,
            action="Ticket Created",
            note=f"AI analyzed. Resolution: {ai_result.get('resolution_path')}. Confidence: {ai_result.get('confidence_score')}%",
            done_by="AI System"
        )
        db.add(timeline)
        db.commit()
    except Exception as e:
        print(f"Timeline error: {e}")

    return {
        "id": new_ticket.id,
        "title": new_ticket.title,
        "status": new_ticket.status,
        "category": new_ticket.category,
        "severity": new_ticket.severity,
        "sentiment": new_ticket.sentiment,
        "ai_summary": new_ticket.ai_summary,
        "resolution_path": new_ticket.resolution_path,
        "confidence_score": new_ticket.confidence_score,
        "estimated_time": new_ticket.estimated_time,
        "department": new_ticket.department,
        "assigned_to": new_ticket.assigned_to,
        "auto_response": new_ticket.auto_response,
        "submitted_by": new_ticket.submitted_by,
        "notification": new_ticket.notification,
        "created_at": str(new_ticket.created_at),
    }


# ==================== TRACK TICKET (PUBLIC) ====================

@app.get("/tickets/track/{ticket_id}")
def track_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    # ── Fetch timeline entries for this ticket ──
    timeline_entries = (
        db.query(models.TicketTimeline)
        .filter(models.TicketTimeline.ticket_id == ticket_id)
        .order_by(models.TicketTimeline.created_at.asc())
        .all()
    )

    # ── Only include status-change entries (skip internal notes) ──
    status_history = [
        {
            "status": entry.action.replace("Status changed to ", "").strip()
                      if entry.action.startswith("Status changed to")
                      else entry.action,
            "note": entry.note,
            "updated_by": entry.done_by,
            "updated_at": str(entry.created_at),
        }
        for entry in timeline_entries
        if entry.action != "Internal note added"   # hide internal notes from user
    ]

    return {
        "id": ticket.id,
        "title": ticket.title,
        "status": ticket.status,
        "category": ticket.category,
        "severity": ticket.severity,
        "ai_summary": ticket.ai_summary,
        "auto_response": ticket.auto_response,
        "assigned_to": ticket.assigned_to,
        "department": ticket.department,
        "notification": ticket.notification,
        "created_at": ticket.created_at,
        "helpful": ticket.helpful,
        "status_history": status_history,   # ← NEW: timeline visible to user
    }


@app.patch("/tickets/{ticket_id}/feedback")
def submit_feedback(ticket_id: int, update: TicketUpdate, db: Session = Depends(get_db)):
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if update.helpful:
        ticket.helpful = update.helpful
    db.commit()
    db.refresh(ticket)
    return ticket


# ==================== ADMIN TICKET ROUTES ====================

@app.get("/admin/tickets/")
def admin_get_tickets(
    status: Optional[str] = None,
    department: Optional[str] = None,
    severity: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_admin_user)
):
    query = db.query(models.Ticket)
    if status and status != "All":
        query = query.filter(models.Ticket.status == status)
    if department and department != "All":
        query = query.filter(models.Ticket.department == department)
    if severity and severity != "All":
        query = query.filter(models.Ticket.severity == severity)
    if search:
        query = query.filter(models.Ticket.title.contains(search))
    return query.order_by(models.Ticket.created_at.desc()).all()


@app.get("/admin/tickets/{ticket_id}")
def admin_get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_admin_user)
):
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


@app.get("/admin/tickets/{ticket_id}/timeline")
def admin_get_timeline(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_admin_user)
):
    return db.query(models.TicketTimeline).filter(
        models.TicketTimeline.ticket_id == ticket_id
    ).order_by(models.TicketTimeline.created_at.asc()).all()


# ==================== EMPLOYEE TICKET ROUTES ====================

@app.get("/employee/tickets/")
def employee_get_tickets(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_employee_user)
):
    employee = db.query(models.Employee).filter(
        models.Employee.email == current_user.email
    ).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee profile not found")
    return db.query(models.Ticket).filter(
        models.Ticket.assigned_employee_id == employee.id
    ).order_by(models.Ticket.created_at.desc()).all()


@app.patch("/employee/tickets/{ticket_id}")
def employee_update_ticket(
    ticket_id: int,
    update: TicketUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_employee_user)
):
    employee = db.query(models.Employee).filter(
        models.Employee.email == current_user.email
    ).first()

    ticket = db.query(models.Ticket).filter(
        models.Ticket.id == ticket_id,
        models.Ticket.assigned_employee_id == employee.id
    ).first()

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found or not assigned to you")

    if update.status:
        old_status = ticket.status
        ticket.status = update.status
        ticket.updated_at = datetime.utcnow()
        ticket.notification = f"Your ticket status updated from {old_status} to {update.status} by {current_user.name}."

        if update.status in ["Resolved", "Closed"]:
            ticket.resolved_at = datetime.utcnow()
            if ticket.created_at:
                diff = datetime.utcnow() - ticket.created_at
                hours = diff.total_seconds() / 3600
                if employee.avg_resolution_time == 0:
                    employee.avg_resolution_time = hours
                else:
                    employee.avg_resolution_time = (employee.avg_resolution_time + hours) / 2
                if employee.current_load > 0:
                    employee.current_load -= 1

        timeline = models.TicketTimeline(
            ticket_id=ticket_id,
            action=f"Status changed to {update.status}",
            note=update.note,          # ← the "Status Note (visible to user)" text
            done_by=current_user.name
        )
        db.add(timeline)

    if update.internal_note:
        ticket.internal_note = update.internal_note
        timeline = models.TicketTimeline(
            ticket_id=ticket_id,
            action="Internal note added",
            note=update.internal_note,
            done_by=current_user.name
        )
        db.add(timeline)

    if update.helpful:
        ticket.helpful = update.helpful

    db.commit()
    db.refresh(ticket)
    return ticket


@app.get("/employee/tickets/{ticket_id}/timeline")
def employee_get_timeline(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_employee_user)
):
    return db.query(models.TicketTimeline).filter(
        models.TicketTimeline.ticket_id == ticket_id
    ).order_by(models.TicketTimeline.created_at.asc()).all()


# ==================== ADMIN EMPLOYEE ROUTES ====================

@app.post("/admin/employees/")
def create_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_admin_user)
):
    existing = db.query(models.User).filter(models.User.email == employee.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    user = models.User(
        name=employee.name,
        email=employee.email,
        password=hash_password(employee.password),
        role="employee"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    new_employee = models.Employee(
        user_id=user.id,
        name=employee.name,
        email=employee.email,
        department=employee.department,
        role=employee.role,
        skill_tags=employee.skill_tags,
        availability=employee.availability
    )
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    return new_employee


@app.get("/admin/employees/")
def get_employees(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_admin_user)
):
    return db.query(models.Employee).filter(models.Employee.is_active == 1).all()


@app.patch("/admin/employees/{employee_id}")
def update_employee(
    employee_id: int,
    update: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_admin_user)
):
    employee = db.query(models.Employee).filter(
        models.Employee.id == employee_id
    ).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    if update.name: employee.name = update.name
    if update.email: employee.email = update.email
    if update.department: employee.department = update.department
    if update.role: employee.role = update.role
    if update.skill_tags: employee.skill_tags = update.skill_tags
    if update.availability: employee.availability = update.availability
    if update.is_active is not None: employee.is_active = update.is_active

    db.commit()
    db.refresh(employee)
    return employee


@app.delete("/admin/employees/{employee_id}")
def deactivate_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_admin_user)
):
    employee = db.query(models.Employee).filter(
        models.Employee.id == employee_id
    ).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    employee.is_active = 0
    user = db.query(models.User).filter(models.User.email == employee.email).first()
    if user:
        user.is_active = False

    db.commit()
    return {"message": "Employee deactivated successfully"}


# ==================== ANALYTICS ====================

@app.get("/admin/analytics/")
def get_analytics(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_admin_user)
):
    tickets = db.query(models.Ticket).all()
    total = len(tickets)
    open_tickets = len([t for t in tickets if t.status not in ["Resolved", "Closed", "Auto-Resolved"]])
    resolved = len([t for t in tickets if t.status in ["Resolved", "Closed"]])
    auto_resolved = len([t for t in tickets if t.status == "Auto-Resolved"])
    escalated = len([t for t in tickets if t.escalated == True])

    helpful_count = len([t for t in tickets if t.helpful == "yes"])
    auto_resolved_with_feedback = len([t for t in tickets if t.helpful in ["yes", "no"]])
    success_rate = (helpful_count / auto_resolved_with_feedback * 100) if auto_resolved_with_feedback > 0 else 0

    department_load = {}
    for t in tickets:
        if t.department:
            department_load[t.department] = department_load.get(t.department, 0) + 1

    one_week_ago = datetime.utcnow() - timedelta(days=7)
    week_tickets = [t for t in tickets if t.created_at and t.created_at >= one_week_ago]
    category_count = {}
    for t in week_tickets:
        if t.category:
            category_count[t.category] = category_count.get(t.category, 0) + 1
    top_categories = sorted(category_count.items(), key=lambda x: x[1], reverse=True)[:5]

    dept_times = {}
    dept_counts = {}
    for t in tickets:
        if t.department and t.resolved_at and t.created_at:
            diff = (t.resolved_at - t.created_at).total_seconds() / 3600
            dept_times[t.department] = dept_times.get(t.department, 0) + diff
            dept_counts[t.department] = dept_counts.get(t.department, 0) + 1

    avg_resolution = [
        {"department": dept, "avg_hours": round(dept_times[dept] / dept_counts[dept], 1)}
        for dept in dept_times
    ]

    return {
        "total": total,
        "open": open_tickets,
        "resolved": resolved,
        "auto_resolved": auto_resolved,
        "escalated": escalated,
        "auto_resolution_success_rate": round(success_rate, 1),
        "department_load": [{"department": k, "count": v} for k, v in department_load.items()],
        "top_categories": [{"category": k, "count": v} for k, v in top_categories],
        "avg_resolution_by_dept": avg_resolution
    }


# ==================== ESCALATION ====================

@app.post("/admin/check-escalation/")
def check_escalation(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_admin_user)
):
    two_hours_ago = datetime.utcnow() - timedelta(hours=2)
    tickets = db.query(models.Ticket).filter(
        models.Ticket.status == "New",
        models.Ticket.severity.in_(["Critical", "High"]),
        models.Ticket.created_at <= two_hours_ago,
        models.Ticket.escalated == False
    ).all()

    escalated_count = 0
    for ticket in tickets:
        ticket.escalated = True
        ticket.status = "Escalated"
        ticket.notification = "Your ticket was escalated because it was not picked up within 2 hours."
        timeline = models.TicketTimeline(
            ticket_id=ticket.id,
            action="Ticket Escalated",
            note="Not picked up within 2 hours. Auto-escalated by system.",
            done_by="AI System"
        )
        db.add(timeline)
        escalated_count += 1

    db.commit()
    return {"escalated": escalated_count}