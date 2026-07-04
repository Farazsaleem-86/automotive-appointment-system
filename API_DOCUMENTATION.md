# API Documentation

## Base URL
```
http://localhost:8000
```

## Authentication
Currently, the API does not require authentication. For production use, implement authentication using JWT or OAuth.

## Response Format
All responses return JSON with the following structure:

### Success Response
```json
{
  "data": { ... },
  "status": "success"
}
```

### Error Response
```json
{
  "detail": "Error message",
  "status": "error"
}
```

## Endpoints

### Customers

#### Create Customer
```http
POST /api/customers
Content-Type: application/json

{
  "full_name": "John Doe",
  "phone_number": "555-123-4567",
  "email": "john@example.com",
  "vehicle_make": "Toyota",
  "vehicle_model": "Camry"
}
```

**Response (201)**
```json
{
  "id": 1,
  "full_name": "John Doe",
  "phone_number": "555-123-4567",
  "email": "john@example.com",
  "vehicle_make": "Toyota",
  "vehicle_model": "Camry",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

#### Get All Customers
```http
GET /api/customers?skip=0&limit=100
```

**Response (200)**
```json
[
  {
    "id": 1,
    "full_name": "John Doe",
    "phone_number": "555-123-4567",
    "email": "john@example.com",
    "vehicle_make": "Toyota",
    "vehicle_model": "Camry",
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00"
  }
]
```

#### Get Customer by ID
```http
GET /api/customers/{customer_id}
```

**Response (200)**
```json
{
  "id": 1,
  "full_name": "John Doe",
  "phone_number": "555-123-4567",
  "email": "john@example.com",
  "vehicle_make": "Toyota",
  "vehicle_model": "Camry",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

#### Update Customer
```http
PUT /api/customers/{customer_id}
Content-Type: application/json

{
  "email": "newemail@example.com",
  "vehicle_make": "Honda"
}
```

**Response (200)**
```json
{
  "id": 1,
  "full_name": "John Doe",
  "phone_number": "555-123-4567",
  "email": "newemail@example.com",
  "vehicle_make": "Honda",
  "vehicle_model": "Camry",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T12:00:00"
}
```

### Leads

#### Create Lead
```http
POST /api/leads
Content-Type: application/json

{
  "customer_id": 1,
  "reason_for_contact": "Interested in buying a car",
  "service_requested": "Test Drive",
  "vehicle_of_interest": "Toyota Camry",
  "budget_expectation": "$20,000 - $25,000",
  "urgency": "High",
  "notes": "Looking for red color"
}
```

**Response (201)**
```json
{
  "id": 1,
  "customer_id": 1,
  "reason_for_contact": "Interested in buying a car",
  "service_requested": "Test Drive",
  "vehicle_of_interest": "Toyota Camry",
  "budget_expectation": "$20,000 - $25,000",
  "urgency": "High",
  "notes": "Looking for red color",
  "status": "New Lead",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00",
  "follow_up_date": "2024-01-02T00:00:00"
}
```

#### Get All Leads
```http
GET /api/leads?skip=0&limit=100&status=New Lead
```

**Response (200)**
```json
[
  {
    "id": 1,
    "customer_id": 1,
    "reason_for_contact": "Interested in buying a car",
    "service_requested": "Test Drive",
    "vehicle_of_interest": "Toyota Camry",
    "budget_expectation": "$20,000 - $25,000",
    "urgency": "High",
    "notes": "Looking for red color",
    "status": "New Lead",
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00",
    "follow_up_date": "2024-01-02T00:00:00"
  }
]
```

#### Get Lead by ID
```http
GET /api/leads/{lead_id}
```

**Response (200)**
```json
{
  "id": 1,
  "customer_id": 1,
  "reason_for_contact": "Interested in buying a car",
  "service_requested": "Test Drive",
  "vehicle_of_interest": "Toyota Camry",
  "budget_expectation": "$20,000 - $25,000",
  "urgency": "High",
  "notes": "Looking for red color",
  "status": "New Lead",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00",
  "follow_up_date": "2024-01-02T00:00:00"
}
```

#### Update Lead
```http
PUT /api/leads/{lead_id}
Content-Type: application/json

{
  "status": "Appointment Scheduled",
  "follow_up_date": "2024-01-05T00:00:00"
}
```

**Response (200)**
```json
{
  "id": 1,
  "customer_id": 1,
  "reason_for_contact": "Interested in buying a car",
  "service_requested": "Test Drive",
  "vehicle_of_interest": "Toyota Camry",
  "budget_expectation": "$20,000 - $25,000",
  "urgency": "High",
  "notes": "Looking for red color",
  "status": "Appointment Scheduled",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T12:00:00",
  "follow_up_date": "2024-01-05T00:00:00"
}
```

### Appointments

#### Create Appointment
```http
POST /api/appointments
Content-Type: application/json

{
  "customer_id": 1,
  "lead_id": 1,
  "service_type": "Test Drive",
  "appointment_date": "2024-01-15T00:00:00",
  "appointment_time": "14:00",
  "notes": "Customer wants to test drive red Camry"
}
```

**Response (201)**
```json
{
  "id": 1,
  "customer_id": 1,
  "lead_id": 1,
  "service_type": "Test Drive",
  "appointment_date": "2024-01-15T00:00:00",
  "appointment_time": "14:00",
  "status": "Scheduled",
  "confirmation_sent": true,
  "reminder_24h_sent": false,
  "reminder_2h_sent": false,
  "no_show": false,
  "notes": "Customer wants to test drive red Camry",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

#### Get All Appointments
```http
GET /api/appointments?skip=0&limit=100&status=Scheduled
```

**Response (200)**
```json
[
  {
    "id": 1,
    "customer_id": 1,
    "lead_id": 1,
    "service_type": "Test Drive",
    "appointment_date": "2024-01-15T00:00:00",
    "appointment_time": "14:00",
    "status": "Scheduled",
    "confirmation_sent": true,
    "reminder_24h_sent": false,
    "reminder_2h_sent": false,
    "no_show": false,
    "notes": "Customer wants to test drive red Camry",
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00"
  }
]
```

#### Get Appointment by ID
```http
GET /api/appointments/{appointment_id}
```

**Response (200)**
```json
{
  "id": 1,
  "customer_id": 1,
  "lead_id": 1,
  "service_type": "Test Drive",
  "appointment_date": "2024-01-15T00:00:00",
  "appointment_time": "14:00",
  "status": "Scheduled",
  "confirmation_sent": true,
  "reminder_24h_sent": false,
  "reminder_2h_sent": false,
  "no_show": false,
  "notes": "Customer wants to test drive red Camry",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

#### Update Appointment
```http
PUT /api/appointments/{appointment_id}
Content-Type: application/json

{
  "status": "Completed",
  "notes": "Test drive completed successfully"
}
```

**Response (200)**
```json
{
  "id": 1,
  "customer_id": 1,
  "lead_id": 1,
  "service_type": "Test Drive",
  "appointment_date": "2024-01-15T00:00:00",
  "appointment_time": "14:00",
  "status": "Completed",
  "confirmation_sent": true,
  "reminder_24h_sent": true,
  "reminder_2h_sent": true,
  "no_show": false,
  "notes": "Test drive completed successfully",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-15T15:00:00"
}
```

#### Delete Appointment
```http
DELETE /api/appointments/{appointment_id}
```

**Response (204)**

### Communications

#### Create Communication
```http
POST /api/communications
Content-Type: application/json

{
  "customer_id": 1,
  "lead_id": 1,
  "appointment_id": 1,
  "communication_type": "email",
  "subject": "Appointment Confirmation",
  "message": "Your appointment has been confirmed"
}
```

**Response (201)**
```json
{
  "id": 1,
  "customer_id": 1,
  "lead_id": 1,
  "appointment_id": 1,
  "communication_type": "email",
  "subject": "Appointment Confirmation",
  "message": "Your appointment has been confirmed",
  "sent_at": "2024-01-01T00:00:00",
  "status": "sent"
}
```

#### Get All Communications
```http
GET /api/communications?skip=0&limit=100&customer_id=1
```

**Response (200)**
```json
[
  {
    "id": 1,
    "customer_id": 1,
    "lead_id": 1,
    "appointment_id": 1,
    "communication_type": "email",
    "subject": "Appointment Confirmation",
    "message": "Your appointment has been confirmed",
    "sent_at": "2024-01-01T00:00:00",
    "status": "sent"
  }
]
```

### Dashboard

#### Get Dashboard Stats
```http
GET /api/dashboard/stats
```

**Response (200)**
```json
{
  "total_customers": 150,
  "total_leads": 75,
  "new_leads": 12,
  "scheduled_appointments": 25,
  "today_appointments": 5
}
```

#### Get Upcoming Appointments
```http
GET /api/dashboard/upcoming-appointments
```

**Response (200)**
```json
[
  {
    "id": 1,
    "customer_id": 1,
    "lead_id": 1,
    "service_type": "Test Drive",
    "appointment_date": "2024-01-15T00:00:00",
    "appointment_time": "14:00",
    "status": "Scheduled",
    "confirmation_sent": true,
    "reminder_24h_sent": false,
    "reminder_2h_sent": false,
    "no_show": false,
    "notes": "Customer wants to test drive red Camry",
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00"
  }
]
```

#### Get Recent Leads
```http
GET /api/dashboard/recent-leads
```

**Response (200)**
```json
[
  {
    "id": 1,
    "customer_id": 1,
    "reason_for_contact": "Interested in buying a car",
    "service_requested": "Test Drive",
    "vehicle_of_interest": "Toyota Camry",
    "budget_expectation": "$20,000 - $25,000",
    "urgency": "High",
    "notes": "Looking for red color",
    "status": "New Lead",
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00",
    "follow_up_date": "2024-01-02T00:00:00"
  }
]
```

### Interaction Processing

#### Process Interaction
```http
POST /api/process-interaction?customer_name=John+Doe&phone_number=555-123-4567&reason_for_contact=Interested+in+buying+a+car&service_requested=Test+Drive&vehicle_of_interest=Toyota+Camry&preferred_date=2024-01-15&preferred_time=14:00
```

**Response (200)**
```json
{
  "customer_name": "John Doe",
  "phone_number": "555-123-4567",
  "reason_for_contact": "Interested in buying a car",
  "lead_status": "New Lead",
  "appointment_details": {
    "preferred_date": "2024-01-15",
    "preferred_time": "14:00"
  },
  "next_action_required": "Schedule appointment for requested date/time"
}
```

## Error Codes

- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Interactive API Documentation

When the server is running, visit:
```
http://localhost:8000/docs
```

This provides an interactive Swagger UI for testing all endpoints.
