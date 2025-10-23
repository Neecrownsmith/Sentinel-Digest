from django.contrib import admin
from .models import SocialMediaPlatform, SocialMediaPost, ShareClick

# Register your models here.
@admin.register(SocialMediaPlatform)
class SocialMediaPlatformAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active')
    search_fields = ('name',)


@admin.register(SocialMediaPost)
class SocialMediaPostAdmin(admin.ModelAdmin):
    list_display = ('article', 'platform', 'status', 'posted_time')
    search_fields = ('article__title', 'platform__name')
    list_filter = ('platform', 'status')


@admin.register(ShareClick)
class ShareClickAdmin(admin.ModelAdmin):
    list_display = ('social_post', 'clicked_at')
    search_fields = ('social_post__article__title', 'social_post__platform__name')
    list_filter = ('clicked_at',)
