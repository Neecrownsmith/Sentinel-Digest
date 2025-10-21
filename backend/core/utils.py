import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.image import MIMEImage
from email import encoders
from pathlib import Path
from django.conf import settings

from dotenv import load_dotenv
load_dotenv()

from .template import get_welcome_email_template, get_password_reset_email_template


class EmailService:
    """Email service for sending emails via SMTP"""

    @staticmethod
    def send_email_to_admins(message_body, subject="Alert from Sentinel Digest", is_html=False):
        """Send email to site admins"""
        from api.models import User

        admin_emails = list(User.objects.filter(is_staff=True).values_list('email', flat=True))
        return EmailService._send_email(
            to_email=", ".join(admin_emails),
            subject=subject,
            body=message_body,
            is_html=is_html
        )
    
    @staticmethod
    def send_welcome_email(user_email, username):
        """Send welcome email to new users"""
        subject = "Welcome to Sentinel Digest!"
        body = get_welcome_email_template(username)
        return EmailService._send_email(user_email, subject, body, is_html=True)
    
    @staticmethod
    def send_password_reset_email(user_email, reset_link):
        """Send password reset email"""
        subject = "Reset Your Password - Sentinel Digest"
        body = get_password_reset_email_template(reset_link)
        return EmailService._send_email(user_email, subject, body, is_html=True)
    
    @staticmethod
    def send_bulk_email(to_emails, subject, body, is_html=False, attachments=None, images=None):
        """
        Send email to multiple recipients
        
        Args:
            to_emails (list): List of recipient email addresses
            subject (str): Email subject
            body (str): Email body content
            is_html (bool): Whether the body is HTML content
            attachments (list): List of file paths to attach
            images (list): List of tuples (file_path, cid) for embedded images
        
        Returns:
            dict: Results with success and failed emails
        """
        results = {
            'success': [],
            'failed': []
        }
        
        for email in to_emails:
            success = EmailService._send_email(email, subject, body, is_html, attachments, images)
            if success:
                results['success'].append(email)
            else:
                results['failed'].append(email)
        
        return results
    
    @staticmethod
    def send_newsletter(subject, body, attachments=None, images=None):
        """
        Send newsletter to all active users
        
        Args:
            subject (str): Email subject
            body (str): HTML email body
            attachments (list): List of file paths to attach
            images (list): List of tuples (file_path, cid) for embedded images
        
        Returns:
            dict: Results with success and failed emails
        """
        from api.models import User
        
        # Get all active user emails
        active_users = User.objects.filter(is_active=True).values_list('email', flat=True)
        email_list = list(active_users)
        
        return EmailService.send_bulk_email(email_list, subject, body, is_html=True, attachments=attachments, images=images)
    
    @staticmethod
    def _send_email(to_email, subject, body, is_html=False, attachments=None):
        """
        Internal method to send email with optional attachments and embedded images
        
        Args:
            to_email (str): Recipient email address
            subject (str): Email subject
            body (str): Email body content
            is_html (bool): Whether the body is HTML content
            attachments (list): List of file paths to attach
            images (list): List of tuples (file_path, cid) for embedded images
                          Example: [('/path/to/logo.png', 'logo')]
                          Then use in HTML: <img src="cid:logo">
        
        Returns:
            bool: True if successful, False otherwise
        """
        smtp_email = os.getenv('SMTP_EMAIL')
        smtp_password = os.getenv('SMTP_PASSWORD')
        smtp_server = os.getenv('SMTP_SERVER')
        smtp_port = int(os.getenv('SMTP_PORT'))
        
        message = MIMEMultipart('alternative')
        message['From'] = smtp_email
        message['To'] = to_email
        message['Subject'] = subject
        
        # Attach body
        mime_type = 'html' if is_html else 'plain'
        message.attach(MIMEText(body, mime_type))
        
        # Attach files
        if attachments:
            for file_path in attachments:
                try:
                    with open(file_path, 'rb') as attachment_file:
                        part = MIMEBase('application', 'octet-stream')
                        part.set_payload(attachment_file.read())
                        encoders.encode_base64(part)
                        part.add_header(
                            'Content-Disposition',
                            f'attachment; filename= {Path(file_path).name}'
                        )
                        message.attach(part)
                except Exception as e:
                    print(f"Failed to attach file {file_path}: {str(e)}")
        
        try:
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(smtp_email, smtp_password)
            server.send_message(message)
            server.quit()
            
            print(f"Email sent to {to_email}")
            return True
            
        except Exception as e:
            print(f"Email failed: {str(e)}")
            return False