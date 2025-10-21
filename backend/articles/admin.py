from django.contrib import admin
from .models import Article, Category, Tag, Image

# Register your models here.
@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'reading_time_seconds', 'original_from')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'excerpt', 'content')
    list_filter = ('category', 'tags')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)

@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('article', 'order')
    search_fields = ('article__title',)