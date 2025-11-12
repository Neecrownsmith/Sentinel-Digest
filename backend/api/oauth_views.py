"""
OAuth Social Authentication Views for Google, Facebook, and Twitter
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from allauth.socialaccount.models import SocialAccount
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.twitter_oauth2.views import TwitterOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView, SocialConnectView
from rest_framework_simplejwt.tokens import RefreshToken


class GoogleLogin(SocialLoginView):
    """Google OAuth2 Login"""
    adapter_class = GoogleOAuth2Adapter
    

class FacebookLogin(SocialLoginView):
    """Facebook OAuth2 Login"""
    adapter_class = FacebookOAuth2Adapter


class TwitterLogin(SocialLoginView):
    """Twitter OAuth2 Login"""
    adapter_class = TwitterOAuth2Adapter


@api_view(['POST'])
@permission_classes([AllowAny])
def social_login(request):
    """
    Handle social login from frontend
    Expected payload:
    {
        "provider": "google" | "facebook" | "twitter",
        "access_token": "token_from_provider"
    }
    """
    provider = request.data.get('provider')
    access_token = request.data.get('access_token')
    
    if not provider or not access_token:
        return Response(
            {"error": "Provider and access_token are required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Map provider to login view
    provider_map = {
        'google': GoogleLogin,
        'facebook': FacebookLogin,
        'twitter': TwitterLogin
    }
    
    if provider not in provider_map:
        return Response(
            {"error": f"Provider '{provider}' is not supported"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Create login view instance and process
    login_view = provider_map[provider].as_view()
    
    # Forward the request with the access token
    request.data._mutable = True
    request.data['access_token'] = access_token
    
    return login_view(request._request)


@api_view(['GET'])
def oauth_redirect(request):
    """
    OAuth callback handler
    This handles the redirect after successful OAuth authentication
    """
    code = request.GET.get('code')
    state = request.GET.get('state')
    
    if not code:
        return Response(
            {"error": "No authorization code provided"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # The actual OAuth flow is handled by allauth
    # This is just a placeholder for custom handling if needed
    return Response({
        "message": "OAuth callback received",
        "code": code,
        "state": state
    })
