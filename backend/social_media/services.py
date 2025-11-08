import os
import json
from openai import OpenAI
from django.conf import settings
import sys
import django
# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from social_media.models import SocialMediaPost, SocialMediaPlatform
from django.utils import timezone
from core.utils import EmailService
from core.template import get_unimplemented_social_post_platform_template, get_failed_social_post_template

MODEL = os.getenv("OPENAI_MODEL")
class SocialMediaService:
    """Service for generating and posting social media content"""
    
    @staticmethod
    def generate_social_captions(article):
        """
        Generate platform-specific captions for an article using AI
        
        Args:
            article: Article instance
            
        Returns:
            dict: Platform-specific captions
        """
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        system_prompt = "You are a social media expert creating engaging captions/hooks."

        user_prompt = f"""
        Generate engaging social media captions for this article:
        
        Title: {article.title}
        Excerpt: {article.excerpt}
        Category: {article.category.name if article.category else 'News'}
        Tags: {', '.join([tag.name for tag in article.tags.all()])}

        Create captions/hooks for:
        1. Twitter/X (250 characters max, include 2-3 hashtags)
        2. Facebook (engaging, can be longer, include call-to-action)
        3. LinkedIn (professional tone, industry-focused)
        4. WhatsApp (conversational, brief with emoji)
        5. Instagram (visual description, emoji-heavy, hashtags)
        
        Return as JSON with this format:
        {{
            "twitter": "caption/hook here",
            "facebook": "caption/hook here",
            "linkedin": "caption/hook here",
            "whatsapp": "caption/hook here",
            "instagram": "caption/hook here"
        }}
        """
        
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        captions = json.loads(response.choices[0].message.content)
        return captions
    
    @staticmethod
    def create_social_posts(article, auto_post=True):
        """
        Create social media posts for an article
        
        Args:
            article: Article instance
            auto_post: Whether to immediately post to platforms
            
        Returns:
            list: Created SocialMediaPost instances
        """
        # Generate captions
        captions = SocialMediaService.generate_social_captions(article)
        
        # Get article URL (you'll need to implement this based on your frontend)
        article_url = f"https://sentineldigest.com/articles/{article.slug}"
        
        # Extract hashtags from tags
        hashtags = ' '.join([f'#{tag.name.replace(" ", "")}' for tag in article.tags.all()[:5]])
        
        created_posts = []
        
        # Create posts for each active platform
        active_platforms = SocialMediaPlatform.objects.filter(is_active=True)
        
        for platform in active_platforms:
            platform_name = platform.name
            caption = captions.get(platform_name, captions.get('twitter', ''))
            
            # Add article URL to caption
            full_caption = f"{caption}\n\nRead more: {article_url}"
            print(f"Full caption for {platform_name}:\n{full_caption}\nLength: {len(full_caption)} characters\n")
            
            # Create social media post
            social_post = SocialMediaPost.objects.create(
                article=article,
                platform=platform,
                caption=full_caption,
                hashtags=hashtags,
                status='pending'
            )
            
            # Auto-post if enabled
            if auto_post and platform.access_token:
                SocialMediaService.post_to_platform(social_post)
            
            created_posts.append(social_post)
        
        return created_posts
    
    @staticmethod
    def post_to_platform(social_post):
        """
        Post content to specific social media platform
        
        Args:
            social_post: SocialMediaPost instance
        """
        platform_name = social_post.platform.name
        
        try:
            if platform_name == 'twitter':
                result = SocialMediaService._post_to_twitter(social_post)
            elif platform_name == 'facebook':
                result = SocialMediaService._post_to_facebook(social_post)
            elif platform_name == 'linkedin':
                result = SocialMediaService._post_to_linkedin(social_post)
            # Add more platforms as needed
            else:
                message = get_unimplemented_social_post_platform_template(platform_name)
                EmailService.send_email_to_admins(message, subject=f"Social Media Posting Unimplemented: {platform_name}", is_html=True)

                raise NotImplementedError(f"Posting to {platform_name} not implemented yet")
            
            # Update post status
            social_post.status = 'posted'
            social_post.posted_time = timezone.now()
            social_post.post_id = result.get('post_id', '')
            social_post.post_url = result.get('post_url', '')
            social_post.save()
            
            print(f"Successfully posted to {platform_name}: {social_post.post_url}")
            
        except Exception as e:
            social_post.status = 'failed'
            social_post.error_message = str(e)
            social_post.save()
            print(f"Failed to post to {platform_name}: {str(e)}")
            message = get_failed_social_post_template(platform_name, e)
            EmailService.send_email_to_admins(message, subject=f"Social Media Posting Failed: {platform_name}", is_html=True)
    
    @staticmethod
    def _post_to_twitter(social_post):
        """Post to Twitter/X using tweepy"""
        # You'll need to install: pip install tweepy
        import tweepy
        
        platform = social_post.platform
        
        client = tweepy.Client(
            bearer_token=platform.access_token,
            consumer_key=platform.api_key,
            consumer_secret=platform.api_secret,
        )
        
        response = client.create_tweet(text=social_post.caption)
        
        return {
            'post_id': response.data['id'],
            'post_url': f"https://twitter.com/user/status/{response.data['id']}"
        }
    
    @staticmethod
    def _post_to_facebook(social_post):
        """Post to Facebook using facebook-sdk"""
        # You'll need to install: pip install facebook-sdk
        import facebook
        
        platform = social_post.platform
        graph = facebook.GraphAPI(access_token=platform.access_token)
        
        response = graph.put_object(
            parent_object='me',
            connection_name='feed',
            message=social_post.caption
        )
        
        return {
            'post_id': response['id'],
            'post_url': f"https://facebook.com/{response['id']}"
        }
    
    @staticmethod
    def _post_to_linkedin(social_post):
        """Post to LinkedIn"""
        # Implementation for LinkedIn API
        # You'll need to use LinkedIn's API
        pass

if __name__ == '__main__':
    from articles.models import Article, Category, Tag
    
    try:
        # Get the latest article from database
        real_article = Article.objects.filter(is_published=True).first()
        
        if real_article:
            print(f"\nFound article: {real_article.title}")
            
            # Generate captions for real article
            real_captions = SocialMediaService.create_social_posts(real_article)
            
        else:
            print("\nNo published articles found in database.")
            
    except Exception as e:
        print(f"\nCould not test with real article: {str(e)}")