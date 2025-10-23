from django.db import models
from articles.models import Article
from django.utils import timezone
# Create your models here


class SocialMediaPlatform(models.Model):
    """Supported social media platforms"""
    PLATFORM_CHOICES = [
        ('twitter', 'Twitter/X'),
        ('facebook', 'Facebook'),
        ('linkedin', 'LinkedIn'),
        ('instagram', 'Instagram'),
        ('whatsapp', 'WhatsApp'),
    ]
    
    name = models.CharField(max_length=50, choices=PLATFORM_CHOICES, unique=True)
    is_active = models.BooleanField(default=True)
    api_key = models.CharField(max_length=255, blank=True)
    api_secret = models.CharField(max_length=255, blank=True)
    access_token = models.TextField(blank=True)
    
    def __str__(self):
        return self.get_name_display()
    
    class Meta:
        ordering = ['name']


class SocialMediaPost(models.Model):
    """Track social media posts for articles"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('posted', 'Posted'),
        ('failed', 'Failed'),
        ('scheduled', 'Scheduled'),
    ]
    
    article = models.ForeignKey(
        Article, 
        on_delete=models.CASCADE, 
        related_name='social_posts'
    )
    platform = models.ForeignKey(
        SocialMediaPlatform, 
        on_delete=models.CASCADE,
        related_name='posts'
    )
    
    # Caption/Hook for this specific platform
    caption = models.TextField(help_text="Generated caption/hook for social media")
    hashtags = models.CharField(max_length=255, blank=True)
    
    # Posting details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    scheduled_time = models.DateTimeField(null=True, blank=True)
    posted_time = models.DateTimeField(null=True, blank=True)
    
    # Social media response
    post_id = models.CharField(max_length=255, blank=True, help_text="ID from social media platform")
    post_url = models.URLField(max_length=500, blank=True)
    error_message = models.TextField(blank=True)
    
    # Engagement metrics (optional)
    likes_count = models.IntegerField(default=0)
    shares_count = models.IntegerField(default=0)
    comments_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.article.title[:50]} - {self.platform.name}"
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['article', 'platform']


class ShareClick(models.Model):
    """Track when users share articles"""
    social_post = models.ForeignKey(
        SocialMediaPost,
        on_delete=models.CASCADE,
        related_name='share_clicks'
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=255, blank=True)
    clicked_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Share click for {self.social_post.article.title[:30]}"
    
    class Meta:
        ordering = ['-clicked_at']