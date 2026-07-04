# Automotive Appointment System

A comprehensive Customer Service and Appointment Coordinator system for automotive businesses. This system helps manage customer inquiries, qualify leads, schedule appointments, send automated confirmations and reminders, and maintain professional customer communication.

## Features

### Core Functionality
- **Customer Management**: Collect and manage customer information including name, phone, email, and vehicle details
- **Lead Qualification**: Track and qualify leads with status management (New Lead, Follow-Up, Appointment Scheduled, Rescheduled, Closed)
- **Appointment Scheduling**: Schedule appointments with automatic confirmation emails
- **Automated Reminders**: 
  - 24-hour reminder before appointments
  - 2-hour reminder before appointments
- **Lead Follow-Up Sequence**: Automated follow-ups on Day 1, Day 3, and Day 7
- **Missed Appointment Detection**: Automatic detection and follow-up for missed appointments
- **Dashboard**: Real-time statistics and overview of customers, leads, and appointments
- **Communication Tracking**: Log all customer communications

### Customer Service Workflow
1. **Customer Information Collection**: Always collect and verify customer details
2. **Lead Qualification**: Determine needs, urgency, and budget expectations
3. **Appointment Scheduling**: Confirm service, date/time, and send confirmation
4. **Automated Reminders**: Send reminders at 24 hours and 2 hours before appointments
5. **Follow-Up Sequence**: Automated follow-ups for leads who haven't booked
6. **Missed Appointment Handling**: Automatic follow-up for no-shows

## Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM for database operations
- **SQLite**: Lightweight database for data storage
- **APScheduler**: Python library for scheduled tasks
- **Pydantic**: Data validation using Python type annotations

### Frontend
- **React**: User interface library
- **Vite**: Build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Axios**: HTTP client for API requests
- **React Router**: Client-side routing

## Installation

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. Navigate to the project directory:
```bash
cd appointment-system
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL=sqlite:///./appointment_system.db
BUSINESS_NAME=Your Automotive Dealership
BUSINESS_ADDRESS=123 Main Street, City, State 12345
BUSINESS_PHONE=(555) 123-4567
BUSINESS_EMAIL=contact@dealership.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
SECRET_KEY=your-secret-key-here
FRONTEND_URL=http://localhost:3000
```

6. Start the backend server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

### API Endpoints

#### Customers
- `POST /api/customers` - Create a new customer
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get a specific customer
- `PUT /api/customers/{id}` - Update customer information

#### Leads
- `POST /api/leads` - Create a new lead
- `GET /api/leads` - Get all leads (optional filter by status)
- `GET /api/leads/{id}` - Get a specific lead
- `PUT /api/leads/{id}` - Update lead information

#### Appointments
- `POST /api/appointments` - Create a new appointment
- `GET /api/appointments` - Get all appointments (optional filter by status)
- `GET /api/appointments/{id}` - Get a specific appointment
- `PUT /api/appointments/{id}` - Update appointment information
- `DELETE /api/appointments/{id}` - Delete an appointment

#### Communications
- `POST /api/communications` - Log a communication
- `GET /api/communications` - Get all communications (optional filter by customer)

#### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/upcoming-appointments` - Get upcoming appointments
- `GET /api/dashboard/recent-leads` - Get recent leads

#### Interaction Processing
- `POST /api/process-interaction` - Process customer interaction and determine next actions

### Frontend Pages

- **Dashboard** (`/`): Overview with statistics, upcoming appointments, and recent leads
- **New Customer** (`/customers/new`): Form to add new customers
- **New Appointment** (`/appointments/new`): Form to schedule appointments
- **Leads** (`/leads`): List and manage leads with status filtering
- **Appointments** (`/appointments`): List and manage appointments with status filtering

## Email Templates

### Appointment Confirmation
```
Thank you, [Customer Name]. Your appointment has been scheduled for [Date] at [Time].

Location: [Business Address]
Phone: [Business Phone]

If you need to reschedule, please contact us. We look forward to serving you.
```

### Reminder (24h and 2h)
```
Hello [Customer Name], this is a friendly reminder about your appointment on [Date] at [Time].

Please reply CONFIRM to confirm your attendance or contact us if you need to reschedule.

Location: [Business Address]
Phone: [Business Phone]
```

### Missed Appointment Follow-Up
```
Hello [Customer Name], we noticed you were unable to attend your appointment today.

We'd be happy to help you reschedule at a convenient time. Please let us know your preferred date and time.
```

### Lead Follow-Up
- **Day 1**: "Just checking in to see if you had any questions. We'd be happy to assist you."
- **Day 3**: "We wanted to follow up regarding your inquiry. Let us know if you'd like to schedule an appointment."
- **Day 7**: "We're reaching out one last time regarding your inquiry. If you're still interested, we'd be happy to assist."

## Automated Processes

The system includes several automated processes that run in the background:

1. **24-Hour Reminders**: Checks every hour for appointments in the next 24 hours
2. **2-Hour Reminders**: Checks every 30 minutes for appointments in the next 2 hours
3. **Lead Follow-Ups**: Runs daily at 9 AM to process lead follow-up sequences
4. **Missed Appointments**: Runs daily at 6 PM to detect and follow up on missed appointments

## Database Schema

### Customers
- id, full_name, phone_number, email, vehicle_make, vehicle_model, created_at, updated_at

### Leads
- id, customer_id, reason_for_contact, status, service_requested, vehicle_of_interest, budget_expectation, urgency, notes, created_at, updated_at, follow_up_date

### Appointments
- id, customer_id, lead_id, service_type, appointment_date, appointment_time, status, confirmation_sent, reminder_24h_sent, reminder_2h_sent, no_show, notes, created_at, updated_at

### Communications
- id, customer_id, lead_id, appointment_id, communication_type, subject, message, sent_at, status

## Development

### Running Tests
```bash
# Backend
pytest

# Frontend
npm test
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build
```

## Deployment

### Backend Deployment
1. Set environment variables in production
2. Use a production database (PostgreSQL recommended)
3. Run with a production ASGI server:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend Deployment
1. Build the frontend:
```bash
cd frontend
npm run build
```
2. Deploy the `dist` folder to your hosting service

## Security Considerations

- Change the `SECRET_KEY` in production
- Use environment variables for sensitive configuration
- Implement authentication/authorization for production use
- Use HTTPS for all communications
- Validate and sanitize all user inputs
- Keep dependencies updated

## License

This project is provided as-is for automotive business appointment management.

## Support

For issues or questions, please contact the development team.
