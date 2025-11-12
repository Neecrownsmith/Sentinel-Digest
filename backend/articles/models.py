from django.db import models
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from scraper.models import ScrapedArticle

User = get_user_model()

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

    
class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=60)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']


class ArticleManager(models.Manager):
    """Custom manager for Article queries"""
    
    def published(self):
        """Get published articles"""
        return self.filter(status='published')
    
    def top_stories(self, limit=5):
        """Get manually curated top stories"""
        return self.filter(
            is_top_story=True,
            status='published'
        ).order_by('featured_order', '-created_at')[:limit]
    
    def most_read(self, limit=10, days=None):
        """Get most read articles"""
        from django.utils import timezone
        from datetime import timedelta
        
        queryset = self.filter(status='published')
        
        if days:
            start_date = timezone.now() - timedelta(days=days)
            queryset = queryset.filter(created_at__gte=start_date)
            return queryset.order_by('-views_last_7d' if days <= 7 else '-view_count')[:limit]
        
        return queryset.order_by('-view_count', '-created_at')[:limit]
    
    def trending(self, limit=10, hours=24):
        """Get trending articles"""
        from django.utils import timezone
        from datetime import timedelta
        
        cutoff_time = timezone.now() - timedelta(hours=hours)
        return self.filter(
            status='published',
            created_at__gte=cutoff_time
        ).order_by('-trending_score')[:limit]


class Article(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=280)
    excerpt = models.TextField()
    content = models.TextField()
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='articles'
    )
    tags = models.ManyToManyField(Tag, related_name='articles', blank=True)
    reading_time_seconds = models.PositiveIntegerField(default=0)
    original_from = models.ForeignKey(
        ScrapedArticle,
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='articles'
    )
    
    # Tracking fields
    view_count = models.PositiveIntegerField(default=0, db_index=True)
    unique_views = models.PositiveIntegerField(default=0, db_index=True)
    views_last_24h = models.PositiveIntegerField(default=0)
    views_last_7d = models.PositiveIntegerField(default=0)
    
    # Editorial flags
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='published', db_index=True)
    is_featured = models.BooleanField(default=False, db_index=True)
    is_top_story = models.BooleanField(default=False, db_index=True)
    featured_order = models.PositiveIntegerField(default=0, help_text="Lower numbers appear first")
    
    # Trending calculation
    trending_score = models.FloatField(default=0.0, db_index=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Legacy fields
    is_published = models.BooleanField(default=True)  # Keep for backward compatibility
    publication_count = models.PositiveIntegerField(default=0)
    
    objects = ArticleManager()

    def save(self, *args, **kwargs):
        # Fixed: Use 'slug' instead of 'content_url'
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            # Fixed: Exclude current instance during update
            queryset = Article.objects.filter(slug=slug)
            if self.pk:
                queryset = queryset.exclude(pk=self.pk)
            while queryset.exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
                queryset = Article.objects.filter(slug=slug)
                if self.pk:
                    queryset = queryset.exclude(pk=self.pk)
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Article'
        verbose_name_plural = 'Articles'
        indexes = [
            models.Index(fields=['-view_count', '-created_at']),
            models.Index(fields=['-trending_score', '-created_at']),
            models.Index(fields=['is_top_story', '-featured_order']),
        ]
    

class ArticleView(models.Model):
    """Track individual article views for analytics"""
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='article_views')
    session_id = models.CharField(max_length=255, db_index=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.CharField(max_length=500, blank=True)
    referrer = models.URLField(blank=True, null=True, max_length=500)
    viewed_at = models.DateTimeField(auto_now_add=True, db_index=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['article', '-viewed_at']),
            models.Index(fields=['session_id', 'article']),
        ]
        verbose_name = 'Article View'
        verbose_name_plural = 'Article Views'
        
    def __str__(self):
        return f"{self.article.title} - {self.viewed_at}"
    

class Image(models.Model):
    article = models.ForeignKey(
        Article, 
        on_delete=models.CASCADE, 
        related_name='images'
    )
    url = models.URLField(max_length=500)
    alt_text = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.alt_text or f"Image for {self.article.title}"
    
    class Meta:
        ordering = ['order', 'id']


class Like(models.Model):
    """Track article likes from authenticated users"""
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='liked_articles')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('article', 'user')  # One like per user per article
        ordering = ['-created_at']
        verbose_name = 'Like'
        verbose_name_plural = 'Likes'
    
    def __str__(self):
        return f"{self.user.username} likes {self.article.title}"


class Comment(models.Model):
    """Comments on articles from authenticated users"""
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    is_anonymous = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Comment'
        verbose_name_plural = 'Comments'
    
    def __str__(self):
        author = "Anonymous" if self.is_anonymous else self.user.username
        return f"{author} on {self.article.title}"


class Bookmark(models.Model):
    """Track article bookmarks from authenticated users"""
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='bookmarks')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarked_articles')
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    
    class Meta:
        unique_together = ('article', 'user')  # One bookmark per user per article
        ordering = ['-created_at']
        verbose_name = 'Bookmark'
        verbose_name_plural = 'Bookmarks'
    
    def __str__(self):
        return f"{self.user.username} bookmarked {self.article.title}"
