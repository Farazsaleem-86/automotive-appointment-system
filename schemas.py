from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional
from enum import Enum

class LeadStatus(str, Enum):
    NEW_LEAD = "New Lead"
    FOLLOW_UP = "Follow-Up"
    APPOINTMENT_SCHEDULED = "Appointment Scheduled"
    RESCHEDULED = "Rescheduled"
    CLOSED = "Closed"

# Customer Schemas
class CustomerBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=255)
    phone_number: str = Field(..., min_length=10, max_length=20)
    email: Optional[EmailStr] = None
    vehicle_make: Optional[str] = None
    vehicle_model: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[EmailStr] = None
    vehicle_make: Optional[str] = None
    vehicle_model: Optional[str] = None

class Customer(CustomerBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Lead Schemas
class LeadBase(BaseModel):
    reason_for_contact: str
    service_requested: Optional[str] = None
    vehicle_of_interest: Optional[str] = None
    budget_expectation: Optional[str] = None
    urgency: Optional[str] = None
    notes: Optional[str] = None

class LeadCreate(LeadBase):
    customer_id: int

class LeadUpdate(BaseModel):
    status: Optional[LeadStatus] = None
    service_requested: Optional[str] = None
    vehicle_of_interest: Optional[str] = None
    budget_expectation: Optional[str] = None
    urgency: Optional[str] = None
    notes: Optional[str] = None
    follow_up_date: Optional[datetime] = None

class Lead(LeadBase):
    id: int
    customer_id: int
    status: LeadStatus
    created_at: datetime
    updated_at: datetime
    follow_up_date: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Appointment Schemas
class AppointmentBase(BaseModel):
    service_type: str
    appointment_date: datetime
    appointment_time: str
    notes: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    customer_id: int
    lead_id: Optional[int] = None

class AppointmentUpdate(BaseModel):
    service_type: Optional[str] = None
    appointment_date: Optional[datetime] = None
    appointment_time: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class Appointment(AppointmentBase):
    id: int
    customer_id: int
    lead_id: Optional[int] = None
    status: str
    confirmation_sent: bool
    reminder_24h_sent: bool
    reminder_2h_sent: bool
    no_show: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Communication Schemas
class CommunicationBase(BaseModel):
    communication_type: str
    subject: Optional[str] = None
    message: str

class CommunicationCreate(CommunicationBase):
    customer_id: int
    lead_id: Optional[int] = None
    appointment_id: Optional[int] = None

class Communication(CommunicationBase):
    id: int
    customer_id: int
    lead_id: Optional[int] = None
    appointment_id: Optional[int] = None
    sent_at: datetime
    status: str
    
    class Config:
        from_attributes = True

# Response Schemas
class InteractionResponse(BaseModel):
    customer_name: str
    phone_number: str
    reason_for_contact: str
    lead_status: LeadStatus
    appointment_details: Optional[dict] = None
    next_action_required: str
