#  Advanced AI Ticketing System

An AI-powered internal ticketing platform where AI reads incoming tickets, auto-resolves simple ones, and intelligently routes complex ones to the right department and employee.

##  Tech Stack

- **Frontend:** React.js, TailwindCSS, Recharts, Axios
- **Backend:** Python, FastAPI, SQLite, SQLAlchemy
- **AI:** Groq API (LLaMA 3.3 70B)

##  Setup Instructions

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy groq python-dotenv
```
Create a `.env` file in backend folder:
GROQ_API_KEY=your_groq_api_key_here
Run the backend:
```bash
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
```

##  Features

### Module 1 — Ticket Intake & AI Analysis
- Submit tickets via a clean form
- AI automatically analyzes every ticket
- Returns: category, severity, sentiment, confidence score, AI summary

### Module 2 — Auto Resolution Engine
- AI auto-resolves simple tickets (FAQs, password resets, policy questions)
- Professional auto-response generated
- Yes/No feedback to track success rate

### Module 3 — Intelligent Department Routing
- AI routes complex tickets to correct department
- Based on ticket category and content

### Module 4 — Employee Directory & Assignee Suggestion
- Full employee directory with skill tags
- AI suggests best employee based on skills, load, availability
- Admin can add, edit, deactivate employees

### Module 5 — Ticket Lifecycle Management
- Full status flow: New → Assigned → In Progress → Pending Info → Resolved → Closed
- Timeline view of every action taken
- Notes can be added on every update

### Module 6 — Analytics Dashboard
- Total, open, resolved, auto-resolved, escalated counts
- Department load bar chart
- Top ticket categories pie chart
- Auto-resolution success rate

##  Known Limitations

- Email notifications are simulated (not actually sent)
- Escalation timer runs on page refresh not real-time
- No user authentication system yet

##  What I Would Improve With More Time

- Add real email notifications using SMTP
- Add user login and role-based access (Admin, Agent, User)
- Add real-time updates using WebSockets
- Add more AI models as fallback options
- Mobile responsive improvements