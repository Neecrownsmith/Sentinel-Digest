# OAuth Authentication - Quick Start Guide

## ✅ What's Been Implemented

### Backend
- ✅ Django Allauth installed and configured
- ✅ OAuth providers enabled (Google, Facebook, Twitter OAuth2)
- ✅ JWT + Allauth integration
- ✅ Social login API endpoints created
- ✅ Custom OAuth views in `api/oauth_views.py`
- ✅ URL routing configured

### Frontend
- ✅ OAuth utility functions in `utils/oauth.js`
- ✅ Social login buttons enabled on Login and Signup pages
- ✅ Twitter callback handler component
- ✅ Loading states and error handling
- ✅ Environment variable configuration

---

## 🚀 Quick Setup (5 Minutes)

### 1. Backend Setup

```bash
cd backend/backend

# Run migrations (if you haven't already)
python manage.py migrate

# Create Site object
python manage.py shell -c "from django.contrib.sites.models import Site; site = Site.objects.get_or_create(id=1)[0]; site.domain = 'localhost:8000'; site.name = 'Sentinel Digest'; site.save(); print('✓ Site configured')"
```

### 2. Get OAuth Credentials

You need to get credentials from each provider:

**Google** (5 min): [console.cloud.google.com](https://console.cloud.google.com/)
- Create project → Enable Google+ API → Create OAuth credentials
- Redirect URI: `http://localhost:8000/accounts/google/login/callback/`

**Facebook** (5 min): [developers.facebook.com](https://developers.facebook.com/)
- Create app → Add Facebook Login → Configure OAuth settings
- Redirect URI: `http://localhost:8000/accounts/facebook/login/callback/`

**Twitter** (5 min): [developer.twitter.com](https://developer.twitter.com/)
- Create app → Enable OAuth 2.0 → Get Client ID & Secret
- Redirect URI: `http://localhost:8000/accounts/twitter/login/callback/`

📖 **Detailed instructions**: See `OAUTH_SETUP.md`

### 3. Configure Environment Variables

**Backend** (`backend/backend/.env`):
```bash
# Add these lines
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
TWITTER_CLIENT_ID=your-twitter-client-id
TWITTER_CLIENT_SECRET=your-twitter-client-secret
```

**Frontend** (`frontend/.env`):
```bash
# Add these lines
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_FACEBOOK_APP_ID=your-facebook-app-id
VITE_TWITTER_CLIENT_ID=your-twitter-client-id
```

### 4. Restart Servers

```bash
# Backend
cd backend/backend
python manage.py runserver

# Frontend (new terminal)
cd frontend
npm run dev
```

---

## 🧪 Test It Out

1. Go to `http://localhost:5173/signup` or `/login`
2. Click on any social login button
3. Complete the OAuth flow
4. You should be redirected back and logged in!

---

## 📁 Files Modified/Created

### Backend
- `backend/settings.py` - OAuth configuration added
- `backend/urls.py` - OAuth routes added
- `api/oauth_views.py` - **NEW** OAuth login views
- `.env.example` - OAuth variables documented

### Frontend
- `src/utils/oauth.js` - **NEW** OAuth utility functions
- `src/pages/Auth/Signup.jsx` - Social buttons enabled
- `src/pages/Auth/Login.jsx` - Social buttons enabled
- `src/pages/Auth/TwitterCallback.jsx` - **NEW** Twitter callback handler
- `src/pages/Auth/Auth.css` - Loading spinner added
- `src/App.jsx` - Twitter callback route added
- `.env.example` - OAuth variables documented

### Documentation
- `OAUTH_SETUP.md` - **NEW** Complete setup guide
- `OAUTH_QUICKSTART.md` - **NEW** This file

---

## 🔧 Troubleshooting

### Buttons Still Disabled?
- Check that `.env` files are created (not just `.env.example`)
- Restart both frontend and backend servers after adding env variables

### "Client ID not found" Error?
- Verify environment variables are loaded: `console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID)` in browser console
- Check `.env` file location (should be in `frontend/` root, not `src/`)

### Redirect URI Mismatch?
- Ensure OAuth app settings match exactly: `http://localhost:8000/accounts/google/login/callback/`
- No trailing slashes unless specified in settings

### Still Having Issues?
1. Check browser console for errors
2. Check Django server logs
3. Verify credentials are correct in developer consoles
4. See `OAUTH_SETUP.md` for detailed troubleshooting

---

## 🎉 Next Steps

Once OAuth is working:
- [ ] Test all three providers (Google, Facebook, Twitter)
- [ ] Verify user profile is created correctly
- [ ] Test linking multiple social accounts
- [ ] Add production domains to OAuth apps
- [ ] Enable email verification for production
- [ ] Set up proper error logging

---

## 📚 Additional Resources

- Full setup guide: `OAUTH_SETUP.md`
- Django Allauth docs: https://django-allauth.readthedocs.io/
- Example `.env` files: `.env.example` (both frontend and backend)

---

**Need help?** Open an issue or check the troubleshooting section in `OAUTH_SETUP.md`

**Last Updated**: November 11, 2025
