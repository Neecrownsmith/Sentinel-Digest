from .models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from articles.models import Article, Category, Tag, Image, Like, Comment, Bookmark
from social_media.models import SocialMediaPost, SocialMediaPlatform


# User Serializers
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    is_staff = serializers.BooleanField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)
    is_social_manager = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'is_social_manager']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
        }

    def validate_email(self, value):
        """
        Check that the email is unique (except for current user during updates)
        """
        # If this is an update, exclude the current user from the uniqueness check
        if self.instance:
            if User.objects.filter(email=value).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("A user with this email already exists.")
        else:
            # This is a creation, check if email exists at all
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate(self, attrs):
        # Check if password fields are provided
        password = attrs.get('password')
        password_confirm = attrs.get('password_confirm')
        
        # If one password field is provided, both must be provided
        if password or password_confirm:
            if not password:
                raise serializers.ValidationError("Password is required when password_confirm is provided.")
            if not password_confirm:
                raise serializers.ValidationError("Password confirmation is required when password is provided.")
            if password != password_confirm:
                raise serializers.ValidationError("Password fields didn't match.")
        
        # For user creation, password is required
        if not self.instance and not password:
            raise serializers.ValidationError("Password is required for user creation.")
            
        return attrs
    
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


# Article Serializers
class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'url', 'alt_text', 'order']


class TagSerializer(serializers.ModelSerializer):
    article_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug', 'article_count']
    
    def get_article_count(self, obj):
        return obj.articles.filter(status='published').count()


class CategorySerializer(serializers.ModelSerializer):
    article_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'article_count']
    
    def get_article_count(self, obj):
        return obj.articles.filter(status='published').count()


class ArticleListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for article lists"""
    category = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    featured_image = serializers.SerializerMethodField()
    reading_time = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'excerpt', 'category', 'category_slug',
            'tags', 'featured_image', 'created_at', 'updated_at',
            'reading_time', 'view_count', 'is_featured', 'is_top_story',
            'trending_score'
        ]
    
    def get_featured_image(self, obj):
        first_image = obj.images.first()
        if first_image:
            return {
                'url': first_image.url,
                'alt_text': first_image.alt_text
            }
        return None
    
    def get_reading_time(self, obj):
        """Convert seconds to minutes"""
        minutes = obj.reading_time_seconds // 60
        return f"{minutes} min read" if minutes > 0 else "1 min read"


class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    display_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ['id', 'article', 'user', 'username', 'display_name', 'text', 'is_anonymous', 'created_at', 'updated_at']
        read_only_fields = ['user', 'article']
    
    def get_display_name(self, obj):
        return "Anonymous" if obj.is_anonymous else obj.user.username


class ArticleDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for single article view"""
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    images = ImageSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    source_url = serializers.CharField(source='original_from.url', allow_null=True, read_only=True)
    reading_time = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    user_has_liked = serializers.SerializerMethodField()
    user_has_bookmarked = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content', 'category', 'tags',
            'images', 'comments', 'created_at', 'updated_at', 'reading_time',
            'view_count', 'unique_views', 'publication_count',
            'is_featured', 'is_top_story', 'source_url', 'trending_score',
            'like_count', 'comment_count', 'user_has_liked', 'user_has_bookmarked'
        ]
    
    def get_reading_time(self, obj):
        minutes = obj.reading_time_seconds // 60
        return f"{minutes} min read" if minutes > 0 else "1 min read"
    
    def get_like_count(self, obj):
        return obj.likes.count()
    
    def get_comment_count(self, obj):
        return obj.comments.count()
    
    def get_user_has_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False
    
    def get_user_has_bookmarked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.bookmarks.filter(user=request.user).exists()
        return False


# Like & Comment Serializers
class LikeSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    article_title = serializers.CharField(source='article.title', read_only=True)
    article_slug = serializers.CharField(source='article.slug', read_only=True)
    article_excerpt = serializers.CharField(source='article.excerpt', read_only=True)
    article_image = serializers.SerializerMethodField()
    article_category = serializers.CharField(source='article.category.name', read_only=True)
    
    class Meta:
        model = Like
        fields = ['id', 'article', 'article_title', 'article_slug', 'article_excerpt', 'article_image', 'article_category', 'user', 'username', 'created_at']
        read_only_fields = ['user']
    
    def get_article_image(self, obj):
        first_image = obj.article.images.first()
        if first_image:
            return {
                'url': first_image.url,
                'alt_text': first_image.alt_text
            }
        return None


class BookmarkSerializer(serializers.ModelSerializer):
    article_title = serializers.CharField(source='article.title', read_only=True)
    article_slug = serializers.CharField(source='article.slug', read_only=True)
    article_excerpt = serializers.CharField(source='article.excerpt', read_only=True)
    article_image = serializers.SerializerMethodField()
    article_category = serializers.CharField(source='article.category.name', read_only=True)
    
    class Meta:
        model = Bookmark
        fields = ['id', 'article', 'article_title', 'article_slug', 'article_excerpt', 'article_image', 'article_category', 'created_at']
        read_only_fields = ['user']
    
    def get_article_image(self, obj):
        first_image = obj.article.images.first()
        if first_image:
            return {
                'url': first_image.url,
                'alt_text': first_image.alt_text
            }
        return None


class SocialMediaPostSerializer(serializers.ModelSerializer):
    article_title = serializers.CharField(source='article.title', read_only=True)
    article_slug = serializers.CharField(source='article.slug', read_only=True)
    article_excerpt = serializers.CharField(source='article.excerpt', read_only=True)
    article_image = serializers.SerializerMethodField()
    platform_name = serializers.CharField(source='platform.get_name_display', read_only=True)
    platform_key = serializers.CharField(source='platform.name', read_only=True)
    
    class Meta:
        model = SocialMediaPost
        fields = [
            'id', 'article', 'article_title', 'article_slug', 'article_excerpt', 
            'article_image', 'platform', 'platform_name', 'platform_key',
            'caption', 'hashtags', 'status', 'scheduled_time', 'posted_time',
            'post_url', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_article_image(self, obj):
        # Get the first image from the article's images
        first_image = obj.article.images.first()
        if first_image:
            return first_image.url
        return None
