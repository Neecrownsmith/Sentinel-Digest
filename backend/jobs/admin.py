from django.contrib import admin
from .models import Job, Category
# Register your models here.    
@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('role', 'category', 'created_at', 'updated_at')
    prepopulated_fields = {'slug': ('role',)}
    search_fields = ('role', 'content')
    list_filter = ('category', 'created_at', 'status')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)