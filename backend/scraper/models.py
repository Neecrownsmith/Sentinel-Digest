from django.db import models

# Create your models here.
class NewsSource(models.Model):
    """Model representing a news source"""
    name = models.CharField(max_length=255, unique=True)
    base_url = models.URLField(unique=True)
    feed_url = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
    

class ScrapedArticle(models.Model):
    """Model representing a scraped news article"""
    source = models.ForeignKey(NewsSource, on_delete=models.CASCADE, related_name='articles')
    url = models.URLField(unique=True)
    scraped_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.url
