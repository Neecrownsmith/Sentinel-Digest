"""
Celery tasks for article analytics and background processing
"""
from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import Article, ArticleView
import logging

logger = logging.getLogger(__name__)


@shared_task
def track_article_view(article_id, session_id, ip_address, user_agent, referrer=None):
    """
    Async task to track article view
    
    Args:
        article_id: Article ID
        session_id: Session ID
        ip_address: Client IP address
        user_agent: User agent string
        referrer: HTTP referrer (optional)
    """
    try:
        article = Article.objects.get(id=article_id)
        
        # Check if unique view (within last 24 hours)
        is_unique = not ArticleView.objects.filter(
            article=article,
            session_id=session_id,
            viewed_at__gte=timezone.now() - timedelta(hours=24)
        ).exists()
        
        # Create view record
        ArticleView.objects.create(
            article=article,
            session_id=session_id,
            ip_address=ip_address,
            user_agent=user_agent[:500],
            referrer=referrer[:500] if referrer else None
        )
        
        # Update article counts
        article.view_count += 1
        if is_unique:
            article.unique_views += 1
        
        article.save(update_fields=['view_count', 'unique_views'])
        
        logger.info(f"Tracked view for article {article_id} from session {session_id}")
        
    except Article.DoesNotExist:
        logger.error(f"Article {article_id} not found for view tracking")
    except Exception as e:
        logger.error(f"Error tracking view for article {article_id}: {str(e)}")


@shared_task
def update_view_counts():
    """
    Update 24-hour and 7-day view counts for all articles
    Should run every hour
    """
    try:
        now = timezone.now()
        articles = Article.objects.filter(status='published')
        
        for article in articles:
            # Count views in last 24 hours
            views_24h = ArticleView.objects.filter(
                article=article,
                viewed_at__gte=now - timedelta(hours=24)
            ).count()
            
            # Count views in last 7 days
            views_7d = ArticleView.objects.filter(
                article=article,
                viewed_at__gte=now - timedelta(days=7)
            ).count()
            
            # Update article
            article.views_last_24h = views_24h
            article.views_last_7d = views_7d
            article.save(update_fields=['views_last_24h', 'views_last_7d'])
        
        logger.info(f"Updated view counts for {articles.count()} articles")
        
    except Exception as e:
        logger.error(f"Error updating view counts: {str(e)}")


@shared_task
def update_trending_scores():
    """
    Calculate and update trending scores for articles
    Should run every 15 minutes
    
    Trending score = (views_last_24h * 2 + views_last_7d) / age_in_hours^1.5
    This gives more weight to recent views and decays older articles
    """
    try:
        now = timezone.now()
        articles = Article.objects.filter(status='published')
        
        for article in articles:
            # Calculate age in hours
            age_hours = (now - article.created_at).total_seconds() / 3600
            age_hours = max(age_hours, 1)  # Minimum 1 hour to avoid division issues
            
            # Calculate trending score with time decay
            # Formula: (recent_views * 2 + weekly_views) / age^1.5
            views_24h = article.views_last_24h or 0
            views_7d = article.views_last_7d or 0
            
            score = (views_24h * 2 + views_7d) / (age_hours ** 1.5)
            
            # Update article
            article.trending_score = round(score, 4)
            article.save(update_fields=['trending_score'])
        
        logger.info(f"Updated trending scores for {articles.count()} articles")
        
    except Exception as e:
        logger.error(f"Error updating trending scores: {str(e)}")


@shared_task
def cleanup_old_view_records():
    """
    Delete view records older than 30 days
    Should run daily
    """
    try:
        cutoff_date = timezone.now() - timedelta(days=30)
        deleted_count = ArticleView.objects.filter(
            viewed_at__lt=cutoff_date
        ).delete()[0]
        
        logger.info(f"Deleted {deleted_count} old view records")
        
    except Exception as e:
        logger.error(f"Error cleaning up old view records: {str(e)}")
