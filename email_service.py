import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class EmailService:
    def __init__(self):
        self.host = os.getenv("EMAIL_HOST", "smtp.gmail.com")
        self.port = int(os.getenv("EMAIL_PORT", "587"))
        self.username = os.getenv("EMAIL_USERNAME")
        self.password = os.getenv("EMAIL_PASSWORD")
        self.from_email = os.getenv("EMAIL_FROM", self.username)
        self.business_name = os.getenv("BUSINESS_NAME", "Your Automotive Dealership")
        self.business_address = os.getenv("BUSINESS_ADDRESS", "123 Main Street")
        self.business_phone = os.getenv("BUSINESS_PHONE", "(555) 123-4567")
    
    def send_email(self, to_email: str, subject: str, body: str) -> bool:
        """Send an email to the specified recipient."""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.from_email
            msg['To'] = to_email
            msg['Subject'] = subject
            
            msg.attach(MIMEText(body, 'plain'))
            
            server = smtplib.SMTP(self.host, self.port)
            server.starttls()
            server.login(self.username, self.password)
            server.send_message(msg)
            server.quit()
            return True
        except Exception as e:
            print(f"Failed to send email: {e}")
            return False
    
    def send_appointment_confirmation(self, customer_name: str, customer_email: str, 
                                     appointment_date: str, appointment_time: str) -> bool:
        """Send appointment confirmation email."""
        subject = f"Appointment Confirmation - {self.business_name}"
        body = f"""Thank you, {customer_name}. Your appointment has been scheduled for {appointment_date} at {appointment_time}.

Location: {self.business_address}
Phone: {self.business_phone}

If you need to reschedule, please contact us. We look forward to serving you.

Best regards,
{self.business_name} Team"""
        
        return self.send_email(customer_email, subject, body)
    
    def send_reminder(self, customer_name: str, customer_email: str, 
                     appointment_date: str, appointment_time: str) -> bool:
        """Send appointment reminder email."""
        subject = f"Appointment Reminder - {self.business_name}"
        body = f"""Hello {customer_name}, this is a friendly reminder about your appointment on {appointment_date} at {appointment_time}.

Please reply CONFIRM to confirm your attendance or contact us if you need to reschedule.

Location: {self.business_address}
Phone: {self.business_phone}

Best regards,
{self.business_name} Team"""
        
        return self.send_email(customer_email, subject, body)
    
    def send_missed_appointment_followup(self, customer_name: str, customer_email: str) -> bool:
        """Send follow-up email for missed appointment."""
        subject = f"Missed Appointment - {self.business_name}"
        body = f"""Hello {customer_name}, we noticed you were unable to attend your appointment today.

We'd be happy to help you reschedule at a convenient time. Please let us know your preferred date and time.

You can reach us at {self.business_phone} or reply to this email.

Best regards,
{self.business_name} Team"""
        
        return self.send_email(customer_email, subject, body)
    
    def send_lead_followup(self, customer_name: str, customer_email: str, day: int) -> bool:
        """Send lead follow-up email based on day sequence."""
        if day == 1:
            subject = f"Checking In - {self.business_name}"
            body = f"""Hello {customer_name},

Just checking in to see if you had any questions. We'd be happy to assist you.

Feel free to reach out to us at {self.business_phone}.

Best regards,
{self.business_name} Team"""
        elif day == 3:
            subject = f"Following Up - {self.business_name}"
            body = f"""Hello {customer_name},

We wanted to follow up regarding your inquiry. Let us know if you'd like to schedule an appointment.

You can reach us at {self.business_phone}.

Best regards,
{self.business_name} Team"""
        elif day == 7:
            subject = f"Final Follow-Up - {self.business_name}"
            body = f"""Hello {customer_name},

We're reaching out one last time regarding your inquiry. If you're still interested, we'd be happy to assist.

Please contact us at {self.business_phone} to schedule an appointment.

Best regards,
{self.business_name} Team"""
        else:
            return False
        
        return self.send_email(customer_email, subject, body)
