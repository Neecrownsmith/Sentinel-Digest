# Sentinel Digest - Complete Setup Guide

This guide will help you set up and run the complete Sentinel Digest application with both backend (Django) and frontend (React).

## Prerequisites

- Python 3.8+ (Python 3.11 recommended)
- Node.js 16+ and npm
- Redis (for caching and Celery)
- Git

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd "c:\Users\Welcome Sir\Sentinel Digest\backend\backend"
```

### 2. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

**Important Migrations:**
- Initial migration creates core models (User, Article, Category, etc.)
- `0002_user_is_social_manager` adds social manager role field
- If you see "No migrations to apply," all migrations are up to date

### 4. Create Superuser (Admin)

```bash
python manage.py createsuperuser
```

Follow prompts to create admin credentials.

### 5. Create Sample Data

Open Django shell:
```bash
python manage.py shell
```

Then run:
```python
from articles.models import Category, Tag, Article
from django.utils.text import slugify

# Create categories
categories = ['News', 'Politics', 'Business', 'Technology', 'Health', 
              'Education', 'Entertainment', 'Sports', 'International', 'Opinion']

for cat_name in categories:
    Category.objects.get_or_create(name=cat_name, slug=slugify(cat_name))

# Create tags
tags = ['Breaking', 'Featured', 'Trending', 'Analysis', 'Opinion', 
        'Local', 'National', 'Global', 'Investigation', 'Exclusive']

for tag_name in tags:
    Tag.objects.get_or_create(name=tag_name, slug=slugify(tag_name))

print("Categories and tags created!")
exit()
```

### 6. Start Redis (Required for Caching and Celery)

**Windows (with Redis installed):**
```bash
redis-server
```

**Or use Docker:**
```bash
docker run -d -p 6379:6379 redis
```

### 7. Start Django Development Server

```bash
python manage.py runserver
```

Backend will be available at: `http://localhost:8000`

### 8. Start Celery Worker (Optional but Recommended)

Open a new terminal:
```bash
cd "c:\Users\Welcome Sir\Sentinel Digest\backend\backend"
celery -A backend worker -l info
```

### 9. Start Celery Beat (Optional - for scheduled tasks)

Open another terminal:
```bash
cd "c:\Users\Welcome Sir\Sentinel Digest\backend\backend"
celery -A backend beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
```

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd "c:\Users\Welcome Sir\Sentinel Digest\backend\frontend"
```

### 2. Install Node Dependencies

```bash
npm install
```

If you encounter issues, try:
```bash
npm install --legacy-peer-deps
```

### 3. Configure Environment

The `.env` file should already exist with:
```
VITE_API_URL=http://localhost:8000/api

```

If not, create it in `frontend/` directory with the above content.

**Environment Variables Explained:**
- `VITE_API_URL`: Base URL for API requests (Django REST endpoints)


### 4. Start Frontend Development Server

```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## Accessing the Application

### User-Facing Frontend
- URL: http://localhost:5173
- Browse articles, search, view by category

### Django Admin Panel
- URL: http://localhost:8000/admin
- Login with superuser credentials
- Create articles, manage categories, mark top stories
- Manage user roles: Assign `is_social_manager` to users for social media management
- Access social posts (if you're a social manager or superuser)

### API Browsable Interface
- URL: http://localhost:8000/api/articles/
- Browse API endpoints directly
- Test API responses

## Quick Test

1. **Access Admin Panel**: http://localhost:8000/admin
2. **Create a Category**: Add "Technology" category
3. **Create an Article**: 
   - Title: "Breaking Tech News"
   - Category: Technology
   - Status: Published
   - Add some content and excerpt
   - Mark as "Is Top Story" or "Is Featured"
4. **View on Frontend**: Go to http://localhost:5173
5. **Test Search**: Use search bar in header
6. **Test Category**: Click "Technology" in navigation

## API Endpoints

### Articles
- `GET /api/articles/` - List articles
- `GET /api/articles/{slug}/` - Article detail
- `GET /api/articles/top-stories/` - Top stories
- `GET /api/articles/most-read/` - Most read
- `GET /api/articles/trending/` - Trending articles
- `GET /api/articles/related/?article_id=1` - Related articles

### Categories
- `GET /api/categories/` - List categories
- `GET /api/categories/{slug}/` - Category detail

### Tags
- `GET /api/tags/` - List tags
- `GET /api/tags/popular/` - Popular tags

### Social Media Posts (Auth Required)
- `GET /api/social-posts/pending/` - Get pending posts (staff/social manager/superuser)
- `POST /api/social-posts/{id}/mark-posted/` - Mark post as posted on platform (staff/social manager/superuser)

### Search
- `GET /api/search/?q=keyword` - Search all

### Auth
- `POST /api/token/` - Get JWT token
- `POST /api/token/refresh/` - Refresh token
- `POST /api/user/register/` - Register user
- `GET /api/user/profile/` - Get profile (authenticated)

## Troubleshooting

### Backend Issues

**ModuleNotFoundError: No module named 'celery'**
```bash
pip install -r requirements.txt
```

**Migration errors**
```bash
python manage.py migrate --run-syncdb
```

**Port 8000 already in use**
```bash
python manage.py runserver 8001
```
Then update frontend `.env` to use port 8001.

### Frontend Issues

**npm install fails**
```bash
npm install --legacy-peer-deps
```

**CORS errors**
- Verify backend is running
- Check `CORS_ALLOWED_ORIGINS` in `backend/settings.py`
- Should include `http://localhost:5173`

**Cannot connect to API**
- Verify `VITE_API_URL` in frontend `.env`
- Check backend server is running
- Ensure both environment variables are set correctly:
  - `VITE_API_URL=http://localhost:8000/api`
- Test API directly: http://localhost:8000/api/articles/

**Page not found (404)**
- Verify React Router is configured in `App.jsx`
- Check route paths match navigation links

### Redis Issues

**Connection refused**
- Install Redis: https://redis.io/download
- Or use Docker: `docker run -d -p 6379:6379 redis`
- Verify Redis is running: `redis-cli ping` (should return PONG)

## Development Workflow

1. **Backend changes**: Django auto-reloads on file changes
2. **Frontend changes**: Vite auto-reloads with HMR
3. **Model changes**: Run `makemigrations` and `migrate`
4. **New API endpoint**: Add to ViewSet, update `api.js` frontend
5. **New page**: Create in `pages/`, add route in `App.jsx`

## Production Deployment

### Backend
1. Set `DEBUG = False` in settings.py
2. Configure proper database (PostgreSQL)
3. Set up Gunicorn/uWSGI
4. Configure nginx
5. Set up proper Redis instance
6. Use Celery with supervisor/systemd
7. Collect static files: `python manage.py collectstatic`

### Frontend
1. Build: `npm run build`
2. Serve `dist/` folder with nginx/Apache
3. Update `VITE_API_URL` to production API URL

## Folder Structure

```
backend/
├── backend/              # Django project
│   ├── articles/         # Articles app (models, views)
│   ├── api/              # API app (ViewSets, serializers)
│   ├── backend/          # Project settings
│   ├── manage.py
│   └── requirements.txt
└── frontend/             # React app
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── App.jsx
    └── package.json
```

## Features Implemented

✅ Article ViewSets with custom actions (top stories, most read, trending)
✅ Category and Tag management
✅ Search functionality
✅ View tracking and analytics
✅ Trending score algorithm
✅ Redis caching (15, 10, 5 minute intervals)
✅ Celery tasks for async processing
✅ JWT authentication and Google OAuth
✅ Role-based access control (regular, staff, social manager, superuser)
✅ Social media post management with platform-specific queues
✅ React Router navigation
✅ Responsive grid layouts (LA Times/NY Times inspired)
✅ Article cards (Hero, Standard, Compact)
✅ Search page
✅ Category pages with pagination
✅ Article detail pages with related articles
✅ User engagement (likes, comments, bookmarks)
✅ Admin panel with role-based cards

## Next Steps

- [ ] Add more sample articles via admin
- [ ] Configure periodic Celery tasks for trending scores
- [ ] Assign social manager roles to users in Django admin
- [ ] Create social media posts and test sharing workflow
- [ ] Add article comments with reply threads
- [ ] Create newsletter signup
- [ ] Implement infinite scroll
- [ ] Add loading skeletons
- [ ] Create custom 404 page
- [ ] Email notifications for replies/mentions

## Support

For issues:
1. Check console logs (both frontend and backend)
2. Verify all services are running (Django, Redis, Celery)
3. Test API endpoints directly in browser
4. Check Django admin for data
5. Review this setup guide

## Quick Start Script

Create a file `start.bat` (Windows) or `start.sh` (Mac/Linux):

**Windows (start.bat):**
```batch
@echo off
start "Redis" redis-server
timeout /t 2
start "Django" cmd /k "cd backend\backend && python manage.py runserver"
timeout /t 3
start "Celery Worker" cmd /k "cd backend\backend && celery -A backend worker -l info"
start "Frontend" cmd /k "cd frontend && npm run dev"
echo All services started!
```

**Mac/Linux (start.sh):**
```bash
#!/bin/bash
redis-server &
cd backend/backend && python manage.py runserver &
cd backend/backend && celery -A backend worker -l info &
cd frontend && npm run dev
```

Run with: `./start.bat` or `./start.sh`
