from sqlalchemy import Column, Integer, String, DateTime, Text, Float, Boolean
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, default="employee")  # admin or employee
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    department = Column(String, nullable=False)
    role = Column(String, nullable=False)
    skill_tags = Column(String, nullable=False)
    availability = Column(String, default="Available")
    is_active = Column(Integer, default=1)
    current_load = Column(Integer, default=0)
    avg_resolution_time = Column(Float, default=0.0)
    created_at = Column(DateTime, default=func.now())

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    submitted_by = Column(String, nullable=False)
    submitted_email = Column(String, nullable=True)
    category = Column(String)
    severity = Column(String)
    sentiment = Column(String)
    ai_summary = Column(Text)
    resolution_path = Column(String)
    confidence_score = Column(Float)
    estimated_time = Column(String)
    status = Column(String, default="New")
    assigned_to = Column(String)
    assigned_employee_id = Column(Integer, nullable=True)
    department = Column(String)
    auto_response = Column(Text)
    helpful = Column(String)
    internal_note = Column(Text)
    notification = Column(Text)
    resolved_at = Column(DateTime, nullable=True)
    escalated = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now())

class TicketTimeline(Base):
    __tablename__ = "ticket_timeline"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, nullable=False)
    action = Column(String, nullable=False)
    note = Column(Text)
    done_by = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())