from django.db import models
from django.utils.text import slugify
from scraper.models import ScrapedArticle


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


class Article(models.Model):
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
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=True)
    publication_count = models.PositiveIntegerField(default=0)

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