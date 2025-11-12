"""
Celery configuration for asynchronous task processing
"""
import os
from celery import Celery
from celery.schedules import crontab

# Set default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Create Celery app
app = Celery('backend')

# Load config from Django settings with 'CELERY_' prefix
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks from all registered Django apps
app.autodiscover_tasks()

# Periodic tasks configuration
app.conf.beat_schedule = {
    'update-trending-scores': {
        'task': 'articles.tasks.update_trending_scores',
        'schedule': crontab(minute='*/15'),  # Every 15 minutes
    },
    'update-view-counts': {
        'task': 'articles.tasks.update_view_counts',
        'schedule': crontab(minute=0),  # Every hour
    },
    'cleanup-old-views': {
        'task': 'articles.tasks.cleanup_old_view_records',
        'schedule': crontab(hour=2, minute=0),  # Daily at 2 AM
    },
}

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
