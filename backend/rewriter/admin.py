from django.contrib import admin
from .models import Log

# Register your models here.
@admin.register(Log)
class LogAdmin(admin.ModelAdmin):
    list_display = ('start_time', 'end_time', 'time_taken', 'new_url_count', 'total_urls_processed')
    ordering = ('-start_time',)