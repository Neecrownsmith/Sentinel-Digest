"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    CreateUserView, get_user_profile, update_user_profile,
    ArticleViewSet, CategoryViewSet, TagViewSet, SearchViewSet,
    EmailTokenObtainPairView, get_pending_social_posts, mark_social_post_posted
)
from api.oauth_views import GoogleLogin, FacebookLogin, TwitterLogin, social_login, oauth_redirect
from rest_framework_simplejwt.views import TokenRefreshView

# DRF Router for ViewSets
router = DefaultRouter()
router.register(r'articles', ArticleViewSet, basename='article')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'search', SearchViewSet, basename='search')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # User endpoints
    path('api/user/register/', CreateUserView.as_view(), name='register'),
    path('api/user/profile/', get_user_profile, name='user_profile'),
    path('api/user/profile/update/', update_user_profile, name='update_profile'),
    
    # JWT Token endpoints
    path('api/token/', EmailTokenObtainPairView.as_view(), name='obtain_token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    
    # DRF Auth (browsable API)
    path('api-auth/', include('rest_framework.urls')),
    
    # Django Allauth (social authentication)
    path('accounts/', include('allauth.urls')),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    
    # Social OAuth endpoints
    path('api/auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('api/auth/facebook/', FacebookLogin.as_view(), name='facebook_login'),
    path('api/auth/twitter/', TwitterLogin.as_view(), name='twitter_login'),
    path('api/auth/social/login/', social_login, name='social_login'),
    path('api/auth/oauth/callback/', oauth_redirect, name='oauth_redirect'),
    
    # API Router (articles, categories, tags, search)
    path('api/', include(router.urls)),
    
    # Social Media Posts endpoints (must be after router to avoid conflicts)
    path('api/social-posts/pending/', get_pending_social_posts, name='pending_social_posts'),
    path('api/social-posts/<int:post_id>/mark-posted/', mark_social_post_posted, name='mark_social_post_posted'),
]