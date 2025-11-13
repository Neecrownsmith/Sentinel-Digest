from django.contrib import admin
from .models import NewsSource, ScrapedArticle, JobSource, ScrapedJob   

# Register your models here.
@admin.register(NewsSource)
class NewsSourceAdmin(admin.ModelAdmin):
    list_display = ('name', 'base_url', 'feed_url', 'is_active')
    search_fields = ('name', 'base_url')
    list_filter = ('is_active',)


@admin.register(ScrapedArticle)
class ScrapedArticleAdmin(admin.ModelAdmin):
    list_display = ('source', 'url', 'scraped_at')
    search_fields = ('source__name', 'url')
    list_filter = ('scraped_at',)


@admin.register(JobSource)
class JobSourceAdmin(admin.ModelAdmin):
    list_display = ('name', 'base_url', 'is_active')
    search_fields = ('name', 'base_url')
    list_filter = ('is_active',)

@admin.register(ScrapedJob)
class ScrapedJobAdmin(admin.ModelAdmin):
    list_display = ('source', 'url', 'scraped_at')
    search_fields = ('url', 'source__name')
    list_filter = ('scraped_at',)