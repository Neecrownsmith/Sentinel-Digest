from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    """Custom User model with unique email field"""
    email = models.EmailField(unique=True)
    is_social_manager = models.BooleanField(default=False, help_text="Designates whether the user can manage social media posts.")
    
    # Optional: Use email as the username field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
