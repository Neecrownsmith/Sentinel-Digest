# Sentinel Digest API Documentation

## Overview

This document describes the REST API endpoints for the Sentinel Digest application. The API is built with Django REST Framework and provides comprehensive article management with tracking, caching, and filtering capabilities.

## Base URL

```
Development: http://localhost:8000/api/
Production: [Your production URL]/api/
```

## Authentication

Most endpoints are read-only and do not require authentication. User-specific endpoints require JWT authentication.

### Get JWT Token
```http
POST /api/token/
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_password"
}
```

Response:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

Use the access token in subsequent requests:
```http
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

## Articles API

### List Articles
```http
GET /api/articles/
```

Query Parameters:
- `page` - Page number (default: 1)
- `category` - Filter by category slug
- `tag` - Filter by tag slug
- `date_from` - Filter articles from date (YYYY-MM-DD)
- `date_to` - Filter articles to date (YYYY-MM-DD)
- `is_featured` - Filter featured articles (true/false)
- `status` - Filter by status (published/draft/archived)
- `min_views` - Minimum view count
- `search` - Search in title, excerpt, content
- `ordering` - Sort by field (created_at, view_count, trending_score)

Example:
```http
GET /api/articles/?category=politics&ordering=-view_count&page=1
```

Response:
```json
{
  "count": 150,
  "total_pages": 8,
  "current_page": 1,
  "next": "http://localhost:8000/api/articles/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Article Title",
      "slug": "article-title",
      "excerpt": "Brief summary...",
      "featured_image": "http://example.com/image.jpg",
      "category": {
        "id": 1,
        "name": "Politics",
        "slug": "politics"
      },
      "tags": [
        {"id": 1, "name": "Election", "slug": "election"}
      ],
      "view_count": 1250,
      "reading_time": "5 min",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T12:00:00Z"
    }
  ]
}
```

### Get Single Article
```http
GET /api/articles/{slug}/
```

Example:
```http
GET /api/articles/breaking-news-story/
```

Response includes full content and related metadata:
```json
{
  "id": 1,
  "title": "Breaking News Story",
  "slug": "breaking-news-story",
  "excerpt": "Brief summary...",
  "content": "Full article content...",
  "featured_image": "http://example.com/image.jpg",
  "category": {
    "id": 1,
    "name": "Politics",
    "slug": "politics"
  },
  "tags": [
    {"id": 1, "name": "Election", "slug": "election"},
    {"id": 2, "name": "Campaign", "slug": "campaign"}
  ],
  "images": [
    {
      "id": 1,
      "image": "http://example.com/img1.jpg",
      "caption": "Image caption",
      "credit": "Photo credit"
    }
  ],
  "view_count": 1250,
  "unique_views": 890,
  "views_last_24h": 145,
  "views_last_7d": 678,
  "trending_score": 23.45,
  "reading_time": "5 min",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T12:00:00Z"
}
```

**Note:** Viewing an article automatically tracks the view with session ID, IP address, and user agent.

### Top Stories
```http
GET /api/articles/top-stories/
```

Returns editorially curated top stories (is_top_story = true).

Response: Array of articles (no pagination)
```json
[
  {
    "id": 1,
    "title": "Top Story Title",
    ...
  }
]
```

**Cache:** 15 minutes

### Most Read Articles
```http
GET /api/articles/most-read/
```

Query Parameters:
- `period` - Time period (all, today, week, month). Default: all
- `limit` - Number of articles to return (default: 10)

Example:
```http
GET /api/articles/most-read/?period=week&limit=5
```

Response: Array of articles sorted by views
```json
[
  {
    "id": 1,
    "title": "Most Read Article",
    "view_count": 5420,
    ...
  }
]
```

**Cache:** 10 minutes

### Trending Articles
```http
GET /api/articles/trending/
```

Query Parameters:
- `hours` - Time window in hours (default: 24)
- `limit` - Number of articles (default: 10)

Example:
```http
GET /api/articles/trending/?hours=24&limit=10
```

Returns articles with highest trending score (calculated by Celery task every 15 minutes).

Response: Array of articles sorted by trending_score
```json
[
  {
    "id": 1,
    "title": "Trending Article",
    "trending_score": 45.67,
    "views_last_24h": 234,
    ...
  }
]
```

**Cache:** 5 minutes

### Related Articles
```http
GET /api/articles/related/
```

Query Parameters:
- `article_id` - Article ID to find related articles for (required)
- `limit` - Number of related articles (default: 5)

Example:
```http
GET /api/articles/related/?article_id=123&limit=5
```

Returns articles from the same category (can be enhanced with FAISS similarity).

## Categories API

### List Categories
```http
GET /api/categories/
```

Response:
```json
[
  {
    "id": 1,
    "name": "Politics",
    "slug": "politics",
    "description": "Political news and analysis",
    "article_count": 145
  }
]
```

### Get Category
```http
GET /api/categories/{slug}/
```

## Tags API

### List Tags
```http
GET /api/tags/
```

Response:
```json
[
  {
    "id": 1,
    "name": "Election",
    "slug": "election",
    "article_count": 78
  }
]
```

### Popular Tags
```http
GET /api/tags/popular/
```

Query Parameters:
- `limit` - Number of tags (default: 20)

Returns tags sorted by article count.

**Cache:** 30 minutes

## Search API

### Unified Search
```http
GET /api/search/?q=keyword
```

Query Parameters:
- `q` - Search query (required)
- `type` - Search type (articles, categories, tags, all). Default: articles

Example:
```http
GET /api/search/?q=election&type=all
```

Response:
```json
{
  "articles": [...],
  "categories": [...],
  "tags": [...]
}
```

## User API

### Register User
```http
POST /api/user/register/
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Get User Profile
```http
GET /api/user/profile/
Authorization: Bearer {token}
```

### Update User Profile
```http
PUT /api/user/profile/update/
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "newemail@example.com",
  "first_name": "John"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Description of the error"
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting in production using:
- Django REST Framework throttling
- Redis-based rate limiting
- API gateway rate limiting

## Caching Strategy

- **Top Stories:** 15 minutes
- **Most Read:** 10 minutes
- **Trending:** 5 minutes
- **Popular Tags:** 30 minutes

All caches use Redis with the key prefix `sentinel_digest:`.

## Background Tasks

The following Celery tasks run automatically:

1. **Update Trending Scores** - Every 15 minutes
   - Calculates trending score using views and time decay
   
2. **Update View Counts** - Every hour
   - Updates 24-hour and 7-day view counts
   
3. **Cleanup Old Views** - Daily at 2 AM
   - Removes view records older than 30 days

## Running the Application

### Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Create Superuser
```bash
python manage.py createsuperuser
```

### Start Django Server
```bash
python manage.py runserver
```

### Start Redis (Required for caching and Celery)
```bash
redis-server
```

### Start Celery Worker
```bash
celery -A backend worker -l info
```

### Start Celery Beat (for scheduled tasks)
```bash
celery -A backend beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
```

## Example Frontend Integration

### Fetch Top Stories
```javascript
async function fetchTopStories() {
  const response = await fetch('http://localhost:8000/api/articles/top-stories/');
  const data = await response.json();
  return data;
}
```

### Fetch Most Read (Last Week)
```javascript
async function fetchMostRead() {
  const response = await fetch('http://localhost:8000/api/articles/most-read/?period=week&limit=10');
  const data = await response.json();
  return data;
}
```

### Fetch Trending
```javascript
async function fetchTrending() {
  const response = await fetch('http://localhost:8000/api/articles/trending/?hours=24&limit=10');
  const data = await response.json();
  return data;
}
```

### Search Articles
```javascript
async function searchArticles(query) {
  const response = await fetch(`http://localhost:8000/api/articles/?search=${encodeURIComponent(query)}`);
  const data = await response.json();
  return data;
}
```

### Filter by Category
```javascript
async function fetchByCategory(categorySlug) {
  const response = await fetch(`http://localhost:8000/api/articles/?category=${categorySlug}`);
  const data = await response.json();
  return data;
}
```

## Next Steps

1. **Run Migrations:** `python manage.py makemigrations && python manage.py migrate`
2. **Install Redis:** Required for caching and Celery
3. **Install Dependencies:** `pip install -r requirements.txt`
4. **Create Sample Data:** Use Django admin to create categories, tags, and articles
5. **Test Endpoints:** Use Postman, curl, or the DRF browsable API
6. **Frontend Integration:** Update your React frontend to use these endpoints
7. **Production Setup:** Configure proper Redis, PostgreSQL, and Celery in production

## Admin Interface

Access the Django admin at `http://localhost:8000/admin/` to:
- Create and edit articles
- Manage categories and tags
- Mark articles as top stories
- View article analytics
- Monitor Celery periodic tasks
- Manage user roles (staff, superuser, social manager)

---

## Social Media Posts API

### Get Pending Posts
```http
GET /api/social-posts/pending/
```

**Authentication:** Required (JWT token)  
**Permission:** Staff members, social managers, or superusers only

Returns all pending social media posts grouped by platform.

Example:
```http
GET /api/social-posts/pending/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

Response:
```json
[
  {
    "id": 1,
    "article": {
      "id": 45,
      "title": "Breaking News Story",
      "slug": "breaking-news-story",
      "featured_image": "http://example.com/image.jpg"
    },
    "caption": "🚨 Breaking News! Check out our latest article on... #News #Breaking",
    "platforms": ["facebook", "twitter", "linkedin"],
    "hashtags": ["News", "Breaking", "Politics"],
    "scheduled_for": "2025-11-10T15:00:00Z",
    "status": "pending",
    "created_at": "2025-11-10T10:00:00Z",
    "updated_at": "2025-11-10T10:00:00Z"
  }
]
```

**Cache:** No caching (real-time data)

### Mark Post as Posted
```http
POST /api/social-posts/{id}/mark-posted/
```

**Authentication:** Required (JWT token)  
**Permission:** Staff members, social managers, or superusers only

Request Body:
```json
{
  "platform": "facebook"
}
```

Example:
```http
POST /api/social-posts/5/mark-posted/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
Content-Type: application/json

{
  "platform": "facebook"
}
```

Response:
```json
{
  "success": true,
  "message": "Post marked as posted on facebook",
  "post": {
    "id": 5,
    "status": "posted",
    "platforms": ["twitter", "linkedin"],
    "updated_at": "2025-11-10T16:30:00Z"
  }
}
```

**Notes:**
- Removes the specified platform from the post's platforms list
- If all platforms are removed, changes status to "posted"
- Returns updated post data

---

## User Roles

The API supports three levels of user access:

### Regular Users
- View articles
- Like/comment on articles
- Bookmark articles
- No admin panel access

### Staff Members (`is_staff=True`)
- All regular user permissions
- Access to admin panel
- Cannot manage social media posts

### Social Managers (`is_social_manager=True`)
- All staff permissions
- Access to Social Posts management
- Can share posts to social platforms
- Platform-specific post queues

### Superusers (`is_superuser=True`)
- Full system access
- User management
- Can assign social manager roles
- Complete admin capabilities

**Note:** Only superusers can assign the `is_social_manager` role via Django admin.

