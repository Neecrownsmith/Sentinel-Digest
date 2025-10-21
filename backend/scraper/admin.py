from django.contrib import admin
from .models import NewsSource, ScrapedArticle

# Register your models here.
@admin.register(NewsSource)
class NewsSourceAdmin(admin.ModelAdmin):
    list_display = ('name', 'base_url', 'feed_url', 'is_active')
    search_fields = ('name', 'base_url')


@admin.register(ScrapedArticle)
class ScrapedArticleAdmin(admin.ModelAdmin):
    list_display = ('source', 'url', 'scraped_at')
    search_fields = ('source__name', 'url')
