from django.shortcuts import render
from django.db import models
from .models import User
from rest_framework import generics, status, viewsets, filters, serializers
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.core.cache import cache
from datetime import timedelta
import hashlib
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from articles.models import Article, Category, Tag, ArticleView, Like, Comment, Bookmark
from social_media.models import SocialMediaPost
from .serializers import (
    UserSerializer,
    ArticleListSerializer,
    ArticleDetailSerializer,
    CategorySerializer,
    TagSerializer,
    LikeSerializer,
    CommentSerializer,
    BookmarkSerializer,
    SocialMediaPostSerializer,
)
from .filters import ArticleFilter
from .pagination import ArticlePagination


# Custom Token Serializer that accepts both email and username
class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'
    
    def validate(self, attrs):
        # Get the email or username from the request
        email_or_username = attrs.get('email')
        password = attrs.get('password')
        
        # Try to find user by email or username
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        user = None
        try:
            # Try email first
            if '@' in email_or_username:
                user = User.objects.get(email=email_or_username)
            else:
                # Try username
                user = User.objects.get(username=email_or_username)
        except User.DoesNotExist:
            pass
        
        if user:
            # Validate password
            if user.check_password(password):
                refresh = self.get_token(user)
                data = {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
                return data
        
        raise serializers.ValidationError('Invalid credentials')


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer


# User Views
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """Get current user's profile"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    """Update current user's profile"""
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Article Views
class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public API for articles
    
    List: GET /api/articles/
    Detail: GET /api/articles/{id}/ or /api/articles/{slug}/
    Top Stories: GET /api/articles/top-stories/
    Most Read: GET /api/articles/most-read/
    Trending: GET /api/articles/trending/
    By Category: GET /api/articles/?category=politics
    Search: GET /api/articles/?search=keyword
    """
    queryset = Article.objects.filter(status='published').select_related(
        'category', 'original_from'
    ).prefetch_related('tags', 'images', 'comments', 'comments__user')
    
    permission_classes = [AllowAny]
    pagination_class = ArticlePagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ArticleFilter
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['created_at', 'view_count', 'trending_score']
    ordering = ['-created_at']
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        """Use detailed serializer for single article, list serializer for multiple"""
        if self.action == 'retrieve':
            return ArticleDetailSerializer
        return ArticleListSerializer
    
    def retrieve(self, request, *args, **kwargs):
        """Get single article and track view"""
        instance = self.get_object()
        
        # Track view synchronously (for simplicity, can be made async with Celery)
        self.track_view(request, instance)
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def track_view(self, request, article):
        """Track article view"""
        session_key = request.session.session_key
        if not session_key:
            # Create session if it doesn't exist
            if not request.session.exists(request.session.session_key):
                request.session.create()
            session_key = request.session.session_key
        
        if not session_key:
            session_key = hashlib.md5(
                f"{self.get_client_ip(request)}{request.META.get('HTTP_USER_AGENT', '')}".encode()
            ).hexdigest()
        
        ip_address = self.get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')[:500]
        referrer = request.META.get('HTTP_REFERER', '')
        
        # Check if unique view (within last 24 hours)
        is_unique = not ArticleView.objects.filter(
            article=article,
            session_id=session_key,
            viewed_at__gte=timezone.now() - timedelta(hours=24)
        ).exists()
        
        # Create view record
        ArticleView.objects.create(
            article=article,
            session_id=session_key,
            ip_address=ip_address,
            user_agent=user_agent,
            referrer=referrer if referrer else None
        )
        
        # Update article counts
        article.view_count += 1
        if is_unique:
            article.unique_views += 1
        
        article.save(update_fields=['view_count', 'unique_views'])
    
    @action(detail=False, methods=['get'], url_path='top-stories')
    def top_stories(self, request):
        """Get editorially curated top stories"""
        cache_key = 'api:top_stories'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)
        
        articles = Article.objects.top_stories(limit=5)
        serializer = ArticleListSerializer(articles, many=True, context={'request': request})
        data = serializer.data
        
        cache.set(cache_key, data, 60 * 15)  # Cache 15 minutes
        return Response(data)
    
    @action(detail=False, methods=['get'], url_path='most-read')
    def most_read(self, request):
        """Get most read articles"""
        period = request.query_params.get('period', 'all')  # all, today, week, month
        limit = int(request.query_params.get('limit', 10))
        
        cache_key = f'api:most_read:{period}:{limit}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)
        
        if period == 'today':
            articles = Article.objects.filter(
                status='published',
                created_at__date=timezone.now().date()
            ).order_by('-views_last_24h')[:limit]
        elif period == 'week':
            articles = Article.objects.most_read(limit=limit, days=7)
        elif period == 'month':
            articles = Article.objects.most_read(limit=limit, days=30)
        else:
            articles = Article.objects.most_read(limit=limit)
        
        serializer = ArticleListSerializer(articles, many=True, context={'request': request})
        data = serializer.data
        
        cache.set(cache_key, data, 60 * 10)  # Cache 10 minutes
        return Response(data)
    
    @action(detail=False, methods=['get'])
    def trending(self, request):
        """Get trending articles"""
        hours = int(request.query_params.get('hours', 24))
        limit = int(request.query_params.get('limit', 10))
        
        cache_key = f'api:trending:{hours}:{limit}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)
        
        articles = Article.objects.trending(limit=limit, hours=hours)
        serializer = ArticleListSerializer(articles, many=True, context={'request': request})
        data = serializer.data
        
        cache.set(cache_key, data, 60 * 5)  # Cache 5 minutes
        return Response(data)
    
    @action(detail=False, methods=['get'])
    def related(self, request):
        """Get related articles based on similarity"""
        article_id = request.query_params.get('article_id')
        limit = int(request.query_params.get('limit', 5))
        
        if not article_id:
            return Response(
                {'error': 'article_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            article = Article.objects.get(id=article_id, status='published')
        except Article.DoesNotExist:
            return Response(
                {'error': 'Article not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get similar articles - simple approach based on category and tags
        # You can enhance this with your FAISS similarity checker
        similar_articles = Article.objects.filter(
            status='published',
            category=article.category
        ).exclude(id=article.id).order_by('-created_at')[:limit]
        
        serializer = ArticleListSerializer(similar_articles, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, slug=None):
        """Like an article (toggle)"""
        article = self.get_object()
        like, created = Like.objects.get_or_create(article=article, user=request.user)
        
        if not created:
            # Unlike if already liked
            like.delete()
            return Response({
                'liked': False,
                'like_count': article.likes.count()
            })
        
        return Response({
            'liked': True,
            'like_count': article.likes.count()
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def comments(self, request, slug=None):
        """Get all comments for an article"""
        article = self.get_object()
        comments = article.comments.all()
        serializer = CommentSerializer(comments, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_comment(self, request, slug=None):
        """Add a comment to an article"""
        article = self.get_object()
        serializer = CommentSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save(user=request.user, article=article)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['delete'], permission_classes=[IsAuthenticated], url_path='comments/(?P<comment_id>[^/.]+)')
    def delete_comment(self, request, slug=None, comment_id=None):
        """Delete a comment (only own comments)"""
        article = self.get_object()
        
        try:
            comment = Comment.objects.get(id=comment_id, article=article, user=request.user)
            comment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Comment.DoesNotExist:
            return Response(
                {'error': 'Comment not found or you do not have permission to delete it'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def bookmark(self, request, slug=None):
        """Bookmark an article (toggle)"""
        article = self.get_object()
        bookmark, created = Bookmark.objects.get_or_create(article=article, user=request.user)
        
        if not created:
            # Remove bookmark if already bookmarked
            bookmark.delete()
            return Response({
                'bookmarked': False
            })
        
        return Response({
            'bookmarked': True
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_bookmarks(self, request):
        """Get user's bookmarked articles"""
        bookmarks = Bookmark.objects.filter(user=request.user).select_related(
            'article', 'article__category'
        ).prefetch_related('article__images')
        serializer = BookmarkSerializer(bookmarks, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_liked(self, request):
        """Get user's liked articles"""
        likes = Like.objects.filter(user=request.user).select_related(
            'article', 'article__category'
        ).prefetch_related('article__images')
        serializer = LikeSerializer(likes, many=True, context={'request': request})
        return Response(serializer.data)
    
    @staticmethod
    def get_client_ip(request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public API for categories
    
    List: GET /api/categories/
    Detail: GET /api/categories/{slug}/
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public API for tags
    
    List: GET /api/tags/
    Popular: GET /api/tags/popular/
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get most popular tags"""
        limit = int(request.query_params.get('limit', 20))
        
        cache_key = f'api:popular_tags:{limit}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)
        
        tags = Tag.objects.annotate(
            article_count=models.Count('articles', filter=models.Q(articles__status='published'))
        ).order_by('-article_count')[:limit]
        
        serializer = TagSerializer(tags, many=True, context={'request': request})
        data = serializer.data
        
        cache.set(cache_key, data, 60 * 30)  # Cache 30 minutes
        return Response(data)


class SearchViewSet(viewsets.ViewSet):
    """
    Search API
    
    Search: GET /api/search/?q=keyword&type=articles
    """
    permission_classes = [AllowAny]
    
    def list(self, request):
        """Unified search endpoint"""
        query = request.query_params.get('q', '')
        search_type = request.query_params.get('type', 'articles')  # articles, categories, tags, all
        
        if not query:
            return Response(
                {'error': 'Search query parameter "q" is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        results = {}
        
        if search_type in ['articles', 'all']:
            articles = Article.objects.filter(
                status='published'
            ).filter(
                models.Q(title__icontains=query) |
                models.Q(excerpt__icontains=query) |
                models.Q(content__icontains=query)
            ).order_by('-created_at')[:10]
            
            results['articles'] = ArticleListSerializer(
                articles, many=True, context={'request': request}
            ).data
        
        if search_type in ['categories', 'all']:
            categories = Category.objects.filter(name__icontains=query)[:5]
            results['categories'] = CategorySerializer(
                categories, many=True, context={'request': request}
            ).data
        
        if search_type in ['tags', 'all']:
            tags = Tag.objects.filter(name__icontains=query)[:10]
            results['tags'] = TagSerializer(
                tags, many=True, context={'request': request}
            ).data
        
        return Response(results)


# Social Media Posts Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pending_social_posts(request):
    """Get all pending social posts grouped by platform for admin"""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response(
            {'detail': 'You do not have permission to access this resource.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Get all posts where status is not 'posted'
    posts = SocialMediaPost.objects.exclude(status='posted').select_related(
        'article', 'platform'
    ).order_by('platform__name', '-created_at')
    
    serializer = SocialMediaPostSerializer(posts, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_social_post_posted(request, post_id):
    """Mark a social post as posted"""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response(
            {'detail': 'You do not have permission to perform this action.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        post = SocialMediaPost.objects.get(id=post_id)
        post.status = 'posted'
        post.posted_time = timezone.now()
        post.save()
        
        serializer = SocialMediaPostSerializer(post)
        return Response(serializer.data)
    except SocialMediaPost.DoesNotExist:
        return Response(
            {'detail': 'Social post not found.'},
            status=status.HTTP_404_NOT_FOUND
        )
