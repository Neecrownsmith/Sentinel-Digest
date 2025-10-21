from django.db import models

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
    
    # URL/Article tracking
    new_url_count = models.IntegerField(default=0)
    total_urls_processed = models.IntegerField(default=0)
    successful_articles = models.IntegerField(default=0)
    failed_articles = models.IntegerField(default=0)
    skipped_articles = models.IntegerField(default=0)
    
    # Status and errors
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='running')
    error_message = models.TextField(null=True, blank=True)
    
    # Token usage (for OpenAI API)
    total_tokens_used = models.IntegerField(default=0)
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    
    # Categories and tags created
    new_categories_created = models.IntegerField(default=0)
    new_tags_created = models.IntegerField(default=0)
    total_images_saved = models.IntegerField(default=0)

    def __str__(self):
        return f"Log {self.log_id} - {self.status} at {self.start_time}"
    
    def calculate_duration(self):
        """Calculate time taken between start and end"""
        if self.start_time and self.end_time:
            self.time_taken = self.end_time - self.start_time
            self.save()
    
    class Meta:
        ordering = ['-start_time']
        verbose_name = 'Rewriter Log'
        verbose_name_plural = 'Rewriter Logs'