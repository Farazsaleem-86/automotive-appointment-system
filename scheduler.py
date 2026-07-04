from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database import SessionLocal, Appointment, Lead, Communication
from email_service import EmailService
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AppointmentScheduler:
    def __init__(self):
        self.scheduler = BackgroundScheduler()
        self.email_service = EmailService()
    
    def start(self):
        """Start the scheduler with all jobs."""
        # Schedule 24-hour reminder check (runs every hour)
        self.scheduler.add_job(
            self.send_24h_reminders,
            'interval',
            hours=1,
            id='24h_reminders'
        )
        
        # Schedule 2-hour reminder check (runs every 30 minutes)
        self.scheduler.add_job(
            self.send_2h_reminders,
            'interval',
            minutes=30,
            id='2h_reminders'
        )
        
        # Schedule lead follow-ups (runs daily at 9 AM)
        self.scheduler.add_job(
            self.process_lead_followups,
            'cron',
            hour=9,
            minute=0,
            id='lead_followups'
        )
        
        # Schedule missed appointment check (runs daily at 6 PM)
        self.scheduler.add_job(
            self.check_missed_appointments,
            'cron',
            hour=18,
            minute=0,
            id='missed_appointments'
        )
        
        self.scheduler.start()
        logger.info("Scheduler started successfully")
    
    def stop(self):
        """Stop the scheduler."""
        self.scheduler.shutdown()
        logger.info("Scheduler stopped")
    
    def send_24h_reminders(self):
        """Send reminders for appointments in 24 hours."""
        db = SessionLocal()
        try:
            now = datetime.utcnow()
            tomorrow = now + timedelta(days=1)
            
            appointments = db.query(Appointment).filter(
                Appointment.status == "Scheduled",
                Appointment.reminder_24h_sent == False,
                Appointment.appointment_date >= tomorrow,
                Appointment.appointment_date <= tomorrow + timedelta(hours=1)
            ).all()
            
            for appointment in appointments:
                # Get customer email
                from database import Customer
                customer = db.query(Customer).filter(Customer.id == appointment.customer_id).first()
                
                if customer and customer.email:
                    date_str = appointment.appointment_date.strftime("%B %d, %Y")
                    success = self.email_service.send_reminder(
                        customer.full_name,
                        customer.email,
                        date_str,
                        appointment.appointment_time
                    )
                    
                    if success:
                        appointment.reminder_24h_sent = True
                        
                        # Log communication
                        comm = Communication(
                            customer_id=customer.id,
                            appointment_id=appointment.id,
                            communication_type="email",
                            subject=f"24h Reminder - {date_str}",
                            message=f"24-hour reminder sent for appointment on {date_str} at {appointment.appointment_time}"
                        )
                        db.add(comm)
                        db.commit()
                        logger.info(f"24h reminder sent for appointment {appointment.id}")
        
        except Exception as e:
            logger.error(f"Error sending 24h reminders: {e}")
            db.rollback()
        finally:
            db.close()
    
    def send_2h_reminders(self):
        """Send reminders for appointments in 2 hours."""
        db = SessionLocal()
        try:
            now = datetime.utcnow()
            two_hours_later = now + timedelta(hours=2)
            
            appointments = db.query(Appointment).filter(
                Appointment.status == "Scheduled",
                Appointment.reminder_2h_sent == False,
                Appointment.appointment_date >= two_hours_later,
                Appointment.appointment_date <= two_hours_later + timedelta(minutes=30)
            ).all()
            
            for appointment in appointments:
                from database import Customer
                customer = db.query(Customer).filter(Customer.id == appointment.customer_id).first()
                
                if customer and customer.email:
                    date_str = appointment.appointment_date.strftime("%B %d, %Y")
                    success = self.email_service.send_reminder(
                        customer.full_name,
                        customer.email,
                        date_str,
                        appointment.appointment_time
                    )
                    
                    if success:
                        appointment.reminder_2h_sent = True
                        
                        comm = Communication(
                            customer_id=customer.id,
                            appointment_id=appointment.id,
                            communication_type="email",
                            subject=f"2h Reminder - {date_str}",
                            message=f"2-hour reminder sent for appointment on {date_str} at {appointment.appointment_time}"
                        )
                        db.add(comm)
                        db.commit()
                        logger.info(f"2h reminder sent for appointment {appointment.id}")
        
        except Exception as e:
            logger.error(f"Error sending 2h reminders: {e}")
            db.rollback()
        finally:
            db.close()
    
    def process_lead_followups(self):
        """Process lead follow-up sequence (Day 1, 3, 7)."""
        db = SessionLocal()
        try:
            now = datetime.utcnow()
            
            # Get leads that need follow-up
            leads = db.query(Lead).filter(
                Lead.status.in_(["New Lead", "Follow-Up"]),
                Lead.follow_up_date <= now
            ).all()
            
            for lead in leads:
                from database import Customer
                customer = db.query(Customer).filter(Customer.id == lead.customer_id).first()
                
                if customer and customer.email:
                    # Calculate which day of follow-up
                    days_since_creation = (now - lead.created_at).days
                    
                    if days_since_creation in [1, 3, 7]:
                        success = self.email_service.send_lead_followup(
                            customer.full_name,
                            customer.email,
                            days_since_creation
                        )
                        
                        if success:
                            # Schedule next follow-up or close
                            if days_since_creation == 1:
                                lead.follow_up_date = now + timedelta(days=2)
                            elif days_since_creation == 3:
                                lead.follow_up_date = now + timedelta(days=4)
                            elif days_since_creation == 7:
                                lead.status = "Closed"
                            
                            comm = Communication(
                                customer_id=customer.id,
                                lead_id=lead.id,
                                communication_type="email",
                                subject=f"Day {days_since_creation} Follow-Up",
                                message=f"Day {days_since_creation} follow-up sent"
                            )
                            db.add(comm)
                            db.commit()
                            logger.info(f"Day {days_since_creation} follow-up sent for lead {lead.id}")
        
        except Exception as e:
            logger.error(f"Error processing lead follow-ups: {e}")
            db.rollback()
        finally:
            db.close()
    
    def check_missed_appointments(self):
        """Check for missed appointments and send follow-ups."""
        db = SessionLocal()
        try:
            now = datetime.utcnow()
            today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
            today_end = now.replace(hour=23, minute=59, second=59, microsecond=999999)
            
            # Get appointments from today that are still scheduled
            appointments = db.query(Appointment).filter(
                Appointment.status == "Scheduled",
                Appointment.appointment_date >= today_start,
                Appointment.appointment_date <= today_end
            ).all()
            
            for appointment in appointments:
                # Mark as no-show if appointment time has passed
                appointment_time = datetime.strptime(appointment.appointment_time, "%H:%M").time()
                appointment_datetime = datetime.combine(appointment.appointment_date, appointment_time)
                
                if now > appointment_datetime:
                    appointment.no_show = True
                    appointment.status = "Missed"
                    
                    from database import Customer
                    customer = db.query(Customer).filter(Customer.id == appointment.customer_id).first()
                    
                    if customer and customer.email:
                        self.email_service.send_missed_appointment_followup(
                            customer.full_name,
                            customer.email
                        )
                        
                        comm = Communication(
                            customer_id=customer.id,
                            appointment_id=appointment.id,
                            communication_type="email",
                            subject="Missed Appointment Follow-Up",
                            message="Missed appointment follow-up sent"
                        )
                        db.add(comm)
                    
                    db.commit()
                    logger.info(f"Missed appointment detected: {appointment.id}")
        
        except Exception as e:
            logger.error(f"Error checking missed appointments: {e}")
            db.rollback()
        finally:
            db.close()
