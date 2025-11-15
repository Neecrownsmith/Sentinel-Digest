from django.db import models
from django.utils.text import slugify
from scraper.models import ScrapedJob


# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, max_length=120)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']


class Job(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    role = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=280)
    description = models.TextField()
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='jobs'
    )
    apply_link = models.URLField(max_length=500, null=True, blank=True)
   
    source_url = models.ForeignKey(
        ScrapedJob,
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='jobs'
    )
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='published', db_index=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Legacy fields
    is_published = models.BooleanField(default=True)  # Keep for backward compatibility
    publication_count = models.PositiveIntegerField(default=0)
    
    def save(self, *args, **kwargs):
        # Generate slug if not exists
        if not self.slug:
            base_slug = slugify(self.role)
            slug = base_slug
            counter = 1
            
            # Ensure unique slug
            while Job.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            
            self.slug = slug
        
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.role
    
    class Meta:
        ordering = ['-created_at']


# Create your models here.
class Log(models.Model):
    STATUS_CHOICES = [
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('partial', 'Partial Success'),
    ]

    log_id = models.CharField(max_length=100, unique=True, primary_key=True)
    
    # Time tracking
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    time_taken = models.DurationField(null=True, blank=True)
    
    # URL/Job tracking
    new_job_count = models.IntegerField(default=0)
    total_jobs_processed = models.IntegerField(default=0)
    successful_jobs = models.IntegerField(default=0)
    failed_jobs = models.IntegerField(default=0)
    skipped_jobs = models.IntegerField(default=0)
    
    # Status and errors
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='running')
    error_message = models.TextField(null=True, blank=True)
    

    def __str__(self):
        return f"Log {self.log_id} - {self.status} at {self.start_time}"
    
    def calculate_duration(self):
        """Calculate time taken between start and end"""
        if self.start_time and self.end_time:
            self.time_taken = self.end_time - self.start_time
            self.save()
    
    class Meta:
        ordering = ['-start_time']
        verbose_name = 'Job Log'
        verbose_name_plural = 'Job Logs'