from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, Boolean, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import enum

SQLALCHEMY_DATABASE_URL = "sqlite:///./appointment_system.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class LeadStatus(str, enum.Enum):
    NEW_LEAD = "New Lead"
    FOLLOW_UP = "Follow-Up"
    APPOINTMENT_SCHEDULED = "Appointment Scheduled"
    RESCHEDULED = "Rescheduled"
    CLOSED = "Closed"

class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    phone_number = Column(String(20), nullable=False)
    email = Column(String(255))
    vehicle_make = Column(String(100))
    vehicle_model = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Lead(Base):
    __tablename__ = "leads"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, nullable=False)
    reason_for_contact = Column(Text, nullable=False)
    status = Column(Enum(LeadStatus), default=LeadStatus.NEW_LEAD)
    service_requested = Column(String(255))
    vehicle_of_interest = Column(String(255))
    budget_expectation = Column(String(100))
    urgency = Column(String(50))
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    follow_up_date = Column(DateTime)

class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, nullable=False)
    lead_id = Column(Integer)
    service_type = Column(String(255), nullable=False)
    appointment_date = Column(DateTime, nullable=False)
    appointment_time = Column(String(10), nullable=False)
    status = Column(String(50), default="Scheduled")
    confirmation_sent = Column(Boolean, default=False)
    reminder_24h_sent = Column(Boolean, default=False)
    reminder_2h_sent = Column(Boolean, default=False)
    no_show = Column(Boolean, default=False)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Communication(Base):
    __tablename__ = "communications"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, nullable=False)
    lead_id = Column(Integer)
    appointment_id = Column(Integer)
    communication_type = Column(String(50))  # email, sms, phone
    subject = Column(String(255))
    message = Column(Text, nullable=False)
    sent_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(50), default="sent")

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
