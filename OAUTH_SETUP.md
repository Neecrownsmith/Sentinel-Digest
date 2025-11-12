# OAuth Social Authentication Setup Guide

This guide will help you set up Google, Facebook, and Twitter OAuth authentication for Sentinel Digest.

## Prerequisites

- Backend server running on `http://localhost:8000`
- Frontend running on `http://localhost:5173`
- Developer accounts with Google, Facebook, and Twitter

---

## 1. Google OAuth Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**

### Step 2: Configure OAuth Consent Screen

1. Navigate to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type
3. Fill in:
   - App name: `Sentinel Digest`
   - User support email: Your email
   - Developer contact email: Your email
4. Add scopes:
   - `userinfo.email`
   - `userinfo.profile`
5. Save and continue

### Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Application type: **Web application**
4. Name: `Sentinel Digest Web Client`
5. Add Authorized JavaScript origins:
   ```
   http://localhost:5173
   http://127.0.0.1:5173
   ```
6. Add Authorized redirect URIs:
   ```
   http://localhost:8000/accounts/google/login/callback/
   http://localhost:5173/auth/callback
   ```
7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

### Step 4: Configure Environment Variables

**Backend** (`.env` file in `backend/backend/`):
```bash
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

**Frontend** (`.env` file in `frontend/`):
```bash
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

---

## 2. Facebook OAuth Setup

### Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** > **Create App**
3. Choose **Consumer** as the app type
4. Fill in:
   - App Name: `Sentinel Digest`
   - App Contact Email: Your email
5. Click **Create App**

### Step 2: Add Facebook Login Product

1. In the app dashboard, find **Facebook Login** and click **Set Up**
2. Choose **Web** platform
3. Enter site URL: `http://localhost:5173`
4. Save and continue

### Step 3: Configure OAuth Settings

1. Go to **Facebook Login** > **Settings**
2. Add Valid OAuth Redirect URIs:
   ```
   http://localhost:8000/accounts/facebook/login/callback/
   http://localhost:5173/auth/callback
   ```
3. Enable **Client OAuth Login**: Yes
4. Enable **Web OAuth Login**: Yes
5. Save changes

### Step 4: Get App Credentials

1. Go to **Settings** > **Basic**
2. Copy the **App ID** and **App Secret**
3. Add `localhost` to **App Domains**
4. Set **Privacy Policy URL** and **Terms of Service URL** (can be placeholder URLs for development)

### Step 5: Configure Environment Variables

**Backend** (`.env` file):
```bash
FACEBOOK_APP_ID=your-facebook-app-id-here
FACEBOOK_APP_SECRET=your-facebook-app-secret-here
```

**Frontend** (`.env` file):
```bash
VITE_FACEBOOK_APP_ID=your-facebook-app-id-here
```

### Step 6: Make App Live (Important!)

1. In the app dashboard, toggle the app from **Development** to **Live** mode
2. Or add test users in **Roles** > **Test Users** for development

---

## 3. Twitter (X) OAuth Setup

### Step 1: Create a Twitter Developer Account

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Apply for a developer account if you don't have one
3. Create a new project and app

### Step 2: Configure App Settings

1. In your app dashboard, go to **Settings**
2. Enable **OAuth 2.0**
3. Set **Type of App**: Web App
4. Add **Callback URI / Redirect URL**:
   ```
   http://localhost:8000/accounts/twitter/login/callback/
   http://localhost:5173/auth/twitter/callback
   ```
5. Add **Website URL**: `http://localhost:5173`

### Step 3: Get API Credentials

1. Go to **Keys and tokens** tab
2. Generate **OAuth 2.0 Client ID and Client Secret**
3. Copy both values

### Step 4: Configure Environment Variables

**Backend** (`.env` file):
```bash
TWITTER_CLIENT_ID=your-twitter-client-id-here
TWITTER_CLIENT_SECRET=your-twitter-client-secret-here
```

**Frontend** (`.env` file):
```bash
VITE_TWITTER_CLIENT_ID=your-twitter-client-id-here
```

---

## 4. Django Configuration

### Step 1: Run Migrations

After configuring settings.py, run:
```bash
cd backend/backend
python manage.py migrate
```

### Step 2: Create a Site Object

Django allauth requires a Site object. Run in Django shell:
```bash
python manage.py shell
```

Then execute:
```python
from django.contrib.sites.models import Site
site = Site.objects.get(id=1)
site.domain = 'localhost:8000'
site.name = 'Sentinel Digest'
site.save()
exit()
```

Or use this management command:
```bash
python manage.py shell -c "from django.contrib.sites.models import Site; site = Site.objects.get_or_create(id=1)[0]; site.domain = 'localhost:8000'; site.name = 'Sentinel Digest'; site.save(); print('Site configured')"
```

### Step 3: Add Social Applications (Alternative Method)

You can also configure social apps via Django admin:

1. Start the server: `python manage.py runserver`
2. Go to `http://localhost:8000/admin/`
3. Navigate to **Social applications**
4. Add applications for each provider:
   - **Provider**: Google / Facebook / Twitter OAuth2
   - **Name**: Google / Facebook / Twitter
   - **Client ID**: Your client ID
   - **Secret key**: Your client secret
   - **Sites**: Select your site

---

## 5. Frontend Configuration

### Step 1: Create `.env` File

Copy `.env.example` to `.env`:
```bash
cd frontend
cp .env.example .env
```

### Step 2: Add Your Credentials

Edit the `.env` file with your actual OAuth credentials.

### Step 3: Test the Configuration

1. Start the backend: `python manage.py runserver`
2. Start the frontend: `npm run dev`
3. Go to `http://localhost:5173/signup` or `/login`
4. Click on any social login button to test

---

## 6. Troubleshooting

### Common Issues

**1. "Redirect URI mismatch" error**
- Ensure the redirect URI in your OAuth app settings exactly matches the callback URL
- Check for trailing slashes
- Verify the protocol (http vs https)

**2. "Invalid client ID" error**
- Verify your environment variables are loaded correctly
- Restart the development server after changing `.env` files
- Check that the client ID matches the one in the developer console

**3. Google One Tap not showing**
- Ensure your site is served over HTTPS in production
- Check browser console for errors
- Verify the client ID is correct

**4. Facebook login fails in development**
- Make sure your app is in "Development" mode or you're added as a test user
- Check that `localhost` is in App Domains
- Verify OAuth redirect URIs include localhost

**5. Twitter OAuth 2.0 issues**
- Ensure OAuth 2.0 is enabled (not OAuth 1.0a)
- Verify PKCE is properly implemented
- Check callback URLs match exactly

### Testing OAuth Flow

1. **Google**: Should show One Tap prompt or redirect to Google sign-in
2. **Facebook**: Should open Facebook login popup
3. **Twitter**: Should redirect to Twitter authorization page

### Security Notes

- Never commit `.env` files to version control
- Use environment-specific credentials
- In production:
  - Use HTTPS for all redirect URIs
  - Set proper CORS origins
  - Enable email verification
  - Use secure cookie settings

---

## 7. Production Deployment

### Update Settings for Production

**Backend** (`settings.py`):
```python
# Change to your production domain
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']

# Update CORS origins
CORS_ALLOWED_ORIGINS = [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
]

# Enable email verification
ACCOUNT_EMAIL_VERIFICATION = 'mandatory'
```

**OAuth Apps**: Update all redirect URIs to use your production domain:
```
https://yourdomain.com/accounts/google/login/callback/
https://yourdomain.com/accounts/facebook/login/callback/
https://yourdomain.com/accounts/twitter/login/callback/
```

---

## 8. Testing Checklist

- [ ] Google sign-in works on signup page
- [ ] Google sign-in works on login page
- [ ] Facebook sign-in works on both pages
- [ ] Twitter sign-in works on both pages
- [ ] User is redirected to correct page after social login
- [ ] JWT tokens are stored correctly
- [ ] User profile is created/updated from social data
- [ ] Email from social account is stored
- [ ] Multiple social accounts can link to same email
- [ ] Social login buttons show loading state
- [ ] Error messages display correctly

---

## Need Help?

- **Django Allauth Docs**: https://django-allauth.readthedocs.io/
- **Google OAuth2**: https://developers.google.com/identity/protocols/oauth2
- **Facebook Login**: https://developers.facebook.com/docs/facebook-login/
- **Twitter OAuth2**: https://developer.twitter.com/en/docs/authentication/oauth-2-0

---

**Last Updated**: November 11, 2025
