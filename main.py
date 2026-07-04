from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Optional
import os
from dotenv import load_dotenv

from database import get_db, init_db, Customer, Lead, Appointment, Communication, LeadStatus
from schemas import (
    CustomerCreate, CustomerUpdate, Customer,
    LeadCreate, LeadUpdate, Lead,
    AppointmentCreate, AppointmentUpdate, Appointment,
    CommunicationCreate, Communication,
    InteractionResponse
)
from email_service import EmailService
from scheduler import AppointmentScheduler

load_dotenv()

app = FastAPI(title="Automotive Appointment System", version="1.0.0")

# CORS configuration
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
email_service = EmailService()
scheduler = AppointmentScheduler()

@app.on_event("startup")
async def startup_event():
    """Initialize database and start scheduler on startup."""
    init_db()
    scheduler.start()

@app.on_event("shutdown")
async def shutdown_event():
    """Stop scheduler on shutdown."""
    scheduler.stop()

# Health check
@app.get("/")
async def root():
    return {"message": "Automotive Appointment System API", "status": "running"}

# Customer Endpoints
@app.post("/api/customers", response_model=Customer, status_code=status.HTTP_201_CREATED)
async def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    """Create a new customer."""
    db_customer = Customer(**customer.dict())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

@app.get("/api/customers", response_model=List[Customer])
async def get_customers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all customers."""
    customers = db.query(Customer).offset(skip).limit(limit).all()
    return customers

@app.get("/api/customers/{customer_id}", response_model=Customer)
async def get_customer(customer_id: int, db: Session = Depends(get_db)):
    """Get a specific customer by ID."""
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@app.put("/api/customers/{customer_id}", response_model=Customer)
async def update_customer(customer_id: int, customer_update: CustomerUpdate, db: Session = Depends(get_db)):
    """Update customer information."""
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    for field, value in customer_update.dict(exclude_unset=True).items():
        setattr(customer, field, value)
    
    db.commit()
    db.refresh(customer)
    return customer

# Lead Endpoints
@app.post("/api/leads", response_model=Lead, status_code=status.HTTP_201_CREATED)
async def create_lead(lead: LeadCreate, db: Session = Depends(get_db)):
    """Create a new lead."""
    customer = db.query(Customer).filter(Customer.id == lead.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    db_lead = Lead(**lead.dict())
    db_lead.status = LeadStatus.NEW_LEAD
    db_lead.follow_up_date = datetime.utcnow() + timedelta(days=1)
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead

@app.get("/api/leads", response_model=List[Lead])
async def get_leads(skip: int = 0, limit: int = 100, status: Optional[str] = None, db: Session = Depends(get_db)):
    """Get all leads, optionally filtered by status."""
    query = db.query(Lead)
    if status:
        query = query.filter(Lead.status == status)
    leads = query.offset(skip).limit(limit).all()
    return leads

@app.get("/api/leads/{lead_id}", response_model=Lead)
async def get_lead(lead_id: int, db: Session = Depends(get_db)):
    """Get a specific lead by ID."""
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead

@app.put("/api/leads/{lead_id}", response_model=Lead)
async def update_lead(lead_id: int, lead_update: LeadUpdate, db: Session = Depends(get_db)):
    """Update lead information."""
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    for field, value in lead_update.dict(exclude_unset=True).items():
        setattr(lead, field, value)
    
    db.commit()
    db.refresh(lead)
    return lead

# Appointment Endpoints
@app.post("/api/appointments", response_model=Appointment, status_code=status.HTTP_201_CREATED)
async def create_appointment(appointment: AppointmentCreate, db: Session = Depends(get_db)):
    """Create a new appointment and send confirmation."""
    customer = db.query(Customer).filter(Customer.id == appointment.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    db_appointment = Appointment(**appointment.dict())
    db_appointment.status = "Scheduled"
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    
    # Send confirmation email if customer has email
    if customer.email:
        date_str = db_appointment.appointment_date.strftime("%B %d, %Y")
        email_service.send_appointment_confirmation(
            customer.full_name,
            customer.email,
            date_str,
            db_appointment.appointment_time
        )
        db_appointment.confirmation_sent = True
        
        # Log communication
        comm = Communication(
            customer_id=customer.id,
            appointment_id=db_appointment.id,
            communication_type="email",
            subject="Appointment Confirmation",
            message=f"Appointment confirmation sent for {date_str} at {db_appointment.appointment_time}"
        )
        db.add(comm)
        db.commit()
        db.refresh(db_appointment)
    
    # Update lead status if associated
    if appointment.lead_id:
        lead = db.query(Lead).filter(Lead.id == appointment.lead_id).first()
        if lead:
            lead.status = LeadStatus.APPOINTMENT_SCHEDULED
            db.commit()
    
    return db_appointment

@app.get("/api/appointments", response_model=List[Appointment])
async def get_appointments(skip: int = 0, limit: int = 100, status: Optional[str] = None, db: Session = Depends(get_db)):
    """Get all appointments, optionally filtered by status."""
    query = db.query(Appointment)
    if status:
        query = query.filter(Appointment.status == status)
    appointments = query.order_by(Appointment.appointment_date).offset(skip).limit(limit).all()
    return appointments

@app.get("/api/appointments/{appointment_id}", response_model=Appointment)
async def get_appointment(appointment_id: int, db: Session = Depends(get_db)):
    """Get a specific appointment by ID."""
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

@app.put("/api/appointments/{appointment_id}", response_model=Appointment)
async def update_appointment(appointment_id: int, appointment_update: AppointmentUpdate, db: Session = Depends(get_db)):
    """Update appointment information."""
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    for field, value in appointment_update.dict(exclude_unset=True).items():
        setattr(appointment, field, value)
    
    db.commit()
    db.refresh(appointment)
    return appointment

@app.delete("/api/appointments/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    """Delete an appointment."""
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    db.delete(appointment)
    db.commit()
    return None

# Communication Endpoints
@app.post("/api/communications", response_model=Communication, status_code=status.HTTP_201_CREATED)
async def create_communication(communication: CommunicationCreate, db: Session = Depends(get_db)):
    """Create a new communication log."""
    db_communication = Communication(**communication.dict())
    db.add(db_communication)
    db.commit()
    db.refresh(db_communication)
    return db_communication

@app.get("/api/communications", response_model=List[Communication])
async def get_communications(skip: int = 0, limit: int = 100, customer_id: Optional[int] = None, db: Session = Depends(get_db)):
    """Get all communications, optionally filtered by customer."""
    query = db.query(Communication)
    if customer_id:
        query = query.filter(Communication.customer_id == customer_id)
    communications = query.order_by(Communication.sent_at.desc()).offset(skip).limit(limit).all()
    return communications

# Dashboard Endpoints
@app.get("/api/dashboard/stats")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics."""
    total_customers = db.query(Customer).count()
    total_leads = db.query(Lead).count()
    new_leads = db.query(Lead).filter(Lead.status == LeadStatus.NEW_LEAD).count()
    scheduled_appointments = db.query(Appointment).filter(Appointment.status == "Scheduled").count()
    today_appointments = db.query(Appointment).filter(
        Appointment.status == "Scheduled",
        Appointment.appointment_date >= datetime.utcnow().replace(hour=0, minute=0, second=0),
        Appointment.appointment_date <= datetime.utcnow().replace(hour=23, minute=59, second=59)
    ).count()
    
    return {
        "total_customers": total_customers,
        "total_leads": total_leads,
        "new_leads": new_leads,
        "scheduled_appointments": scheduled_appointments,
        "today_appointments": today_appointments
    }

@app.get("/api/dashboard/upcoming-appointments", response_model=List[Appointment])
async def get_upcoming_appointments(db: Session = Depends(get_db)):
    """Get upcoming appointments for the next 7 days."""
    now = datetime.utcnow()
    week_later = now + timedelta(days=7)
    
    appointments = db.query(Appointment).filter(
        Appointment.status == "Scheduled",
        Appointment.appointment_date >= now,
        Appointment.appointment_date <= week_later
    ).order_by(Appointment.appointment_date).limit(10).all()
    
    return appointments

@app.get("/api/dashboard/recent-leads", response_model=List[Lead])
async def get_recent_leads(db: Session = Depends(get_db)):
    """Get recent leads."""
    leads = db.query(Lead).order_by(Lead.created_at.desc()).limit(10).all()
    return leads

# Interaction Processing Endpoint
@app.post("/api/process-interaction", response_model=InteractionResponse)
async def process_interaction(
    customer_name: str,
    phone_number: str,
    reason_for_contact: str,
    service_requested: Optional[str] = None,
    vehicle_of_interest: Optional[str] = None,
    preferred_date: Optional[str] = None,
    preferred_time: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Process a customer interaction and determine next actions."""
    # Check if customer exists
    customer = db.query(Customer).filter(Customer.phone_number == phone_number).first()
    
    if not customer:
        # Create new customer
        customer = Customer(
            full_name=customer_name,
            phone_number=phone_number
        )
        db.add(customer)
        db.commit()
        db.refresh(customer)
    
    # Create or update lead
    lead = db.query(Lead).filter(
        Lead.customer_id == customer.id,
        Lead.status.in_([LeadStatus.NEW_LEAD, LeadStatus.FOLLOW_UP])
    ).first()
    
    if not lead:
        lead = Lead(
            customer_id=customer.id,
            reason_for_contact=reason_for_contact,
            service_requested=service_requested,
            vehicle_of_interest=vehicle_of_interest,
            status=LeadStatus.NEW_LEAD,
            follow_up_date=datetime.utcnow() + timedelta(days=1)
        )
        db.add(lead)
        db.commit()
        db.refresh(customer)
    else:
        lead.reason_for_contact = reason_for_contact
        lead.service_requested = service_requested
        lead.vehicle_of_interest = vehicle_of_interest
        lead.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(lead)
    
    # Determine next action
    next_action = "Follow up with customer in 24 hours"
    appointment_details = None
    
    if preferred_date and preferred_time:
        next_action = "Schedule appointment for requested date/time"
        appointment_details = {
            "preferred_date": preferred_date,
            "preferred_time": preferred_time
        }
    elif service_requested or vehicle_of_interest:
        next_action = "Qualify lead and schedule appointment"
    
    return InteractionResponse(
        customer_name=customer.full_name,
        phone_number=customer.phone_number,
        reason_for_contact=reason_for_contact,
        lead_status=lead.status,
        appointment_details=appointment_details,
        next_action_required=next_action
    )
