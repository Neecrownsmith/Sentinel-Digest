# Sentinel Digest

> **Automated News Aggregation and Publishing Platform**

Sentinel Digest is an intelligent news platform that automatically scrapes, rewrites, and publishes articles from multiple sources. It features an AI-powered rewriting engine, duplicate detection, trending algorithms, and a modern newspaper-style frontend inspired by LA Times and NY Times.

[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.2.8-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Architecture Overview](#architecture-overview)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### **Core Functionality**
- 🤖 **Automated Article Scraping** - Collects news from configured sources
- ✍️ **AI-Powered Rewriting** - Uses OpenAI GPT to rewrite articles while maintaining facts
- 🔍 **Duplicate Detection** - FAISS-based semantic similarity to prevent duplicate content
- 📊 **Analytics & Tracking** - Real-time view tracking, unique visitor counts
- 🔥 **Trending Algorithm** - Time-decayed scoring system for trending content
- 📰 **Editorial Curation** - Manual top stories selection via admin panel

### **User Features**
- 🔐 **User Authentication** - JWT-based login/signup with email or username, Google OAuth integration
- 👤 **User Profiles** - Personal account management with profile editing
- 💖 **Article Engagement** - Like, comment, and bookmark articles
- 💬 **Anonymous Comments** - Optional anonymous commenting for privacy
- 📚 **Personal Collections** - View liked and bookmarked articles in dedicated tabs
- 🎨 **Modern UI/UX** - LA Times/NY Times-inspired responsive design with elegant, demure aesthetics
- 🎨 **Refined Typography** - Poppins font with carefully balanced weights and spacing
- 🏷️ **Elegant Tag System** - Soft, pill-shaped tags with subtle hover effects throughout articles
- 🔎 **Full-Text Search** - Search across titles, content, categories, and tags
- 🏷️ **Category & Tag Filtering** - Browse by topic and tags with refined navigation
- 📱 **Mobile-Responsive** - Optimized for all screen sizes with adaptive layouts
- 🚀 **Fast Performance** - Redis caching, pagination, lazy loading, optimized images
- 🔗 **Related Articles** - AI-powered content recommendations based on similarity
- 🔔 **Social Sharing** - Share articles on Twitter/X, Facebook, LinkedIn, WhatsApp, Instagram
- 📖 **Enhanced Reading Experience** - Strategic image placement, formatted inline content (markdown, URLs, bold, italic)
- 🏢 **Company Pages** - About, Contact, Careers (Volunteer), Advertise, Services with consistent design language

### **Planned Features** 🚧
- 💭 **Quote of the Day** - Daily inspirational or thought-provoking quotes
- 📅 **On This Day in History** - Historical events that happened on the current date
- 📖 **Proverb of the Day** - Daily wisdom from various cultures
- 🧠 **Daily Did You Know?** - Interesting facts and trivia updated daily
- 🎯 **Potential Future Additions**:
  - Weather Widget (Location-based forecasts)
  - Word of the Day (Vocabulary expansion)
  - This Day in News History (Historical news archives)
  - Daily Puzzle/Brain Teaser
  - Horoscope Section
  - Market/Stock Ticker
  - Countdown to Major Events
  - Today's Birthdays (Notable figures)

### **Admin Features**
- 👨‍💼 **Django Admin Panel** - Full content management system with custom admin views
- 📊 **Admin Dashboard** - Role-based admin panel with quick actions and permissions overview
- 🎭 **Role-Based Access Control** - Superuser, Staff, and Social Manager roles with granular permissions
- 📱 **Social Media Management** - Dedicated social posts dashboard for social managers
  - Platform-specific post queues (Facebook, Twitter/X, LinkedIn, Instagram, WhatsApp)
  - One-click sharing to platforms with pre-filled captions
  - Post status tracking (pending/posted)
  - Platform dashboard with post counts
  - Automatic navigation and empty state handling
- 📈 **Analytics Dashboard** - View counts, engagement metrics, trending scores
- 🎯 **Content Curation** - Mark articles as featured or top stories, set featured order
- 🔄 **Celery Task Management** - Background job monitoring and management
- 📧 **Email Notifications** - Alerts for failed rewrites or system issues
- 🎨 **Admin Badge System** - Visual indicators for Superuser and Staff roles
- 📝 **Content Management** - Simplified contact system (single contact email)
- 🔗 **Social Links Management** - Centralized social media links across Header, Footer, and Company pages

---

## 📁 Project Structure

```
Sentinel-Digest/
├── backend/
│   ├── backend/                    # Django project settings
│   │   ├── __init__.py
│   │   ├── settings.py            # Main configuration
│   │   ├── urls.py                # URL routing
│   │   ├── celery.py              # Celery configuration
│   │   ├── wsgi.py                # WSGI entry point
│   │   └── asgi.py                # ASGI entry point
│   │
│   ├── api/                        # REST API application
│   │   ├── models.py              # User model with role fields (is_staff, is_superuser, is_social_manager)
│   │   ├── views.py               # API ViewSets (Article, Category, Tag, Search, Social Posts)
│   │   ├── serializers.py         # DRF serializers with user roles and social posts
│   │   ├── filters.py             # Django-filters configuration
│   │   ├── pagination.py          # Custom pagination
│   │   ├── oauth_views.py         # Google OAuth authentication
│   │   └── admin.py               # Admin configuration with social manager field
│   │
│   ├── articles/                   # Articles management
│   │   ├── models.py              # Article, Category, Tag, Image, ArticleView, Like, Comment, Bookmark
│   │   ├── tasks.py               # Celery tasks (trending, view tracking)
│   │   ├── views.py               # Article views with engagement endpoints
│   │   ├── serializers.py         # Article serializers with engagement data
│   │   └── admin.py               # Article admin with featured controls
│   │
│   ├── scraper/                    # Web scraping module
│   │   ├── models.py              # ScrapedArticle, Source
│   │   ├── services.py            # Scraping logic
│   │   └── load_sources.py        # Source configuration loader
│   │
│   ├── rewriter/                   # AI rewriting engine
│   │   ├── models.py              # RewriteLog
│   │   ├── services.py            # OpenAI integration, article processing
│   │   └── admin.py               # Rewrite log admin
│   │
│   ├── similarity/                 # Duplicate detection
│   │   ├── models.py              # ArticleEmbedding
│   │   ├── checker.py             # FAISS similarity search
│   │   └── services.py            # Embedding generation
│   │
│   ├── social_media/               # Social media integration
│   │   ├── models.py              # SocialMediaPost
│   │   ├── services.py            # Social media posting logic
│   │   └── admin.py               # Social media admin
│   │
│   ├── core/                       # Shared utilities
│   │   ├── utils.py               # Email service, helpers
│   │   └── template.py            # Email templates
│   │
│   ├── manage.py                   # Django management script
│   ├── requirements.txt            # Python dependencies
│   ├── db.sqlite3                  # SQLite database (dev)
│   └── .env                        # Environment variables
│
├── frontend/                       # React frontend
│   ├── public/                     # Static assets
│   │   ├── logo.svg
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── components/            # Reusable components
│   │   │   ├── ArticleCard/       # Article card variants
│   │   │   │   ├── ArticleCard.jsx
│   │   │   │   └── ArticleCard.css
│   │   │   ├── Header/            # Site header
│   │   │   ├── Footer/            # Site footer
│   │   │   └── common/            # Shared components
│   │   │
│   │   ├── pages/                 # Page components
│   │   │   ├── Home/              # Homepage
│   │   │   ├── Article/           # Article detail with engagement
│   │   │   ├── Category/          # Category listing
│   │   │   ├── Search/            # Search results
│   │   │   ├── Login/             # User login
│   │   │   ├── Signup/            # User registration
│   │   │   ├── ForgotPassword/    # Password recovery
│   │   │   └── Account/           # User account management
│   │   │
│   │   ├── services/              # API integration
│   │   │   └── api.js             # Axios API client
│   │   │
│   │   ├── context/               # React Context
│   │   │   └── AuthContext.jsx    # Authentication state
│   │   │
│   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── useToggle.js
│   │   │   ├── useFormInput.js
│   │   │   └── useScrollToTop.js
│   │   │
│   │   ├── config/                # Configuration
│   │   │   ├── navigation.js      # Menu items
│   │   │   └── footer.js          # Footer links
│   │   │
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Global styles
│   │
│   ├── package.json               # npm dependencies
│   ├── vite.config.js             # Vite configuration
│   └── .env                       # Frontend environment variables
│
├── API_DOCUMENTATION.md           # API endpoint reference
├── README.md                      # This file
└── .gitignore                     # Git ignore rules
```

---

## 🛠️ Technology Stack

### **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.12 | Programming language |
| Django | 5.2.8 | Web framework |
| Django REST Framework | 3.15+ | API development |
| djangorestframework-simplejwt | Latest | JWT authentication |
| Celery | 5.5.3 | Async task queue |
| Redis | Latest | Cache & message broker |
| PostgreSQL/SQLite | Latest | Database |
| OpenAI API | GPT-4 | Article rewriting |
| FAISS | Latest | Vector similarity search |
| BeautifulSoup4 | Latest | Web scraping |
| Newspaper3k | Latest | Article extraction |

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.1.1 | UI framework |
| React Router | 7.9.5 | Client-side routing |
| Axios | 1.13.2 | HTTP client |
| Vite | 7.1.7 | Build tool |
| CSS3 | - | Styling |

### **DevOps**
| Technology | Purpose |
|------------|---------|
| Git | Version control |
| Docker | Containerization (optional) |
| Nginx | Reverse proxy (production) |
| Gunicorn | WSGI server (production) |

---

## 🏗️ Architecture Overview

### **System Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                            │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   Home   │  │ Article  │  │ Category │  │  Search  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Login   │  │  Signup  │  │ Account  │  │  Auth    │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                         │                                        │
│                    API Service (Axios + JWT)                    │
└─────────────────────────────────┬───────────────────────────────┘
                                  │ HTTP/REST + JWT Auth
                                  ↓
┌─────────────────────────────────────────────────────────────────┐
│              Django REST Framework (Backend)                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    API ViewSets                          │  │
│  │  • ArticleViewSet    • CategoryViewSet                   │  │
│  │  • TagViewSet        • SearchViewSet                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         │                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Business Logic                         │  │
│  │  • Scraper        • Rewriter       • Similarity          │  │
│  │  • Social Media   • Analytics      • Email               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         │                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Data Models                            │  │
│  │  • Article        • Category        • Tag                │  │
│  │  • User           • ArticleView     • Source             │  │
│  │  • Like           • Comment         • Bookmark           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ↓             ↓             ↓
          ┌────────────┐  ┌────────────┐  ┌──────────┐
          │ PostgreSQL │  │   Redis    │  │  FAISS   │
          │  Database  │  │   Cache    │  │  Index   │
          └────────────┘  └────────────┘  └──────────┘
                                  │
                                  ↓
                          ┌────────────────┐
                          │     Celery     │
                          │  Worker Queue  │
                          └────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ↓             ↓             ↓
              [Scraping]    [Rewriting]   [Analytics]
                Tasks         Tasks          Tasks
```

### **Data Flow: Article Creation**

1. **Scraping (Celery Task)**
   ```
   Sources → Scraper Service → ScrapedArticle Model
   ```

2. **Rewriting (Celery Task)**
   ```
   ScrapedArticle → OpenAI API → Rewriter Service → Article Model
   ```

3. **Duplicate Check**
   ```
   Article Content → Generate Embedding → FAISS Search → 
   If Similar: Increment publication_count
   If Unique: Create new Article
   ```

4. **Publishing**
   ```
   Article Model → API Serializer → REST Endpoint → Frontend Display
   ```

5. **View Tracking (Celery Task)**
   ```
   User View → ArticleView Record → Update Counters → 
   Trending Score Calculation
   ```

### **Caching Strategy**

| Data Type | Cache Duration | Update Frequency |
|-----------|----------------|------------------|
| Top Stories | 15 minutes | Manual (editor updates) |
| Most Read | 10 minutes | Hourly aggregation |
| Trending | 5 minutes | 15-minute calculation |
| Categories/Tags | 30 minutes | Rarely changes |
| Article List | No cache | Real-time content |
| Article Detail | No cache | View tracking required |

---

## 🚀 Installation

### **Prerequisites**

- Python 3.12+
- Node.js 18+
- Redis Server
- PostgreSQL (production) or SQLite (development)
- OpenAI API Key

### **Backend Setup**

1. **Clone Repository**
   ```bash
   git clone https://github.com/Neecrownsmith/Sentinel-Digest.git
   cd Sentinel-Digest/backend
   ```

2. **Create Virtual Environment**
   ```bash
   python -m venv .venv
   
   # Windows
   .venv\Scripts\activate
   
   # Linux/Mac
   source .venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**
   
   Create `.env` file in `backend/` directory:
   ```env
   # Django Settings
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   
   # Database (SQLite for dev, PostgreSQL for prod)
   DATABASE_URL=sqlite:///db.sqlite3
   # DATABASE_URL=postgresql://user:password@localhost:5432/sentinel_digest
   
   # JWT Configuration
   JWT_SECRET_KEY=your-jwt-secret-key
   ACCESS_TOKEN_LIFETIME_MINUTES=60
   REFRESH_TOKEN_LIFETIME_DAYS=7
   
   # OpenAI Configuration
   OPENAI_API_KEY=sk-your-openai-api-key
   OPENAI_MODEL=gpt-4
   
   # Redis Configuration
   REDIS_URL=redis://localhost:6379/0
   CELERY_BROKER_URL=redis://localhost:6379/0
   CELERY_RESULT_BACKEND=redis://localhost:6379/0
   
   # Email Configuration (for notifications)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-app-password
   DEFAULT_FROM_EMAIL=noreply@sentineldigest.com
   
   # Social Media (optional)
   TWITTER_API_KEY=your-twitter-key
   FACEBOOK_ACCESS_TOKEN=your-facebook-token
   ```

5. **Database Migration**
   ```bash
   cd backend
   python manage.py makemigrations
   python manage.py migrate
   ```
   
   **Important Migrations:**
   - `0001_initial.py` - Core User, Article, Category models
   - `0002_user_is_social_manager.py` - Social manager role field

6. **Create Superuser**
   ```bash
   python manage.py createsuperuser
   ```
   
   After creating the superuser, you can assign social manager roles via Django admin.

7. **Load Sample Data (optional)**
   ```bash
   python manage.py loaddata fixtures/categories.json
   python manage.py loaddata fixtures/tags.json
   ```

### **Frontend Setup**

1. **Navigate to Frontend Directory**
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create `.env` file in `frontend/` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

### **Redis Setup**

**Windows:**
```bash
# Using Chocolatey
choco install redis-64

# Or download from: https://github.com/microsoftarchive/redis/releases
```

**Linux:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

**Mac:**
```bash
brew install redis
brew services start redis
```

---

## ⚙️ Configuration

### **Django Settings** (`backend/settings.py`)

Key configurations you may want to customize:

```python
# API Configuration
REST_FRAMEWORK = {
    'PAGE_SIZE': 20,  # Articles per page
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/day',
        'user': '1000/day'
    }
}

# Cache Timeouts (seconds)
CACHE_TIMEOUTS = {
    'TOP_STORIES': 900,    # 15 minutes
    'MOST_READ': 600,      # 10 minutes
    'TRENDING': 300,       # 5 minutes
}

# Celery Beat Schedule
CELERY_BEAT_SCHEDULE = {
    'scrape-articles': {
        'task': 'scraper.tasks.scrape_all_sources',
        'schedule': crontab(minute='*/30'),  # Every 30 minutes
    },
    'update-trending-scores': {
        'task': 'articles.tasks.update_trending_scores',
        'schedule': crontab(minute='*/15'),  # Every 15 minutes
    },
}
```

### **Scraper Sources** (`scraper/sources.json`)

Configure news sources to scrape:

```json
[
  {
    "name": "Example News",
    "url": "https://example.com",
    "category": "General",
    "scrape_enabled": true,
    "selectors": {
      "article_links": ".article-link",
      "title": "h1.article-title",
      "content": "div.article-body"
    }
  }
]
```

---

## 🎯 Usage

### **Starting the Application**

1. **Start Redis**
   ```bash
   # Windows
   redis-server
   
   # Linux/Mac
   sudo systemctl start redis
   ```

2. **Start Django Development Server**
   ```bash
   cd backend/backend
   python manage.py runserver
   ```
   Access admin panel at: http://localhost:8000/admin

3. **Start Celery Worker**
   ```bash
   # In a new terminal
   cd backend/backend
   celery -A backend worker --loglevel=info
   ```

4. **Start Celery Beat (Scheduler)**
   ```bash
   # In a new terminal
   cd backend/backend
   celery -A backend beat --loglevel=info
   ```

5. **Start React Frontend**
   ```bash
   # In a new terminal
   cd frontend
   npm run dev
   ```
   Access frontend at: http://localhost:5173

### **Running Background Tasks Manually**

```bash
# Scrape articles from all sources
python manage.py shell -c "from scraper.services import scrape_all_sources; scrape_all_sources()"

# Rewrite scraped articles
python manage.py shell -c "from rewriter.services import process_scraped_articles; process_scraped_articles()"

# Update trending scores
python manage.py shell -c "from articles.tasks import update_trending_scores; update_trending_scores()"
```

### **Using the Admin Panel**

1. Navigate to http://localhost:8000/admin
2. Login with superuser credentials
3. Manage content:
   - **Articles**: Create, edit, mark as featured/top story
   - **Categories**: Organize content by topics
   - **Tags**: Add tags for filtering
   - **Sources**: Configure scraping sources
   - **Users**: Manage user accounts
   - **Analytics**: View article performance

---

## 📚 API Documentation

### **Base URL**
```
http://localhost:8000/api
```

### **Key Endpoints**

#### **Articles**

| Method | Endpoint | Description | Params |
|--------|----------|-------------|--------|
| GET | `/articles/` | List articles | page, category, tag, search, ordering |
| GET | `/articles/{id}/` | Get article detail | - |
| GET | `/articles/top-stories/` | Editorial top stories | - |
| GET | `/articles/most-read/` | Most viewed articles | period, limit |
| GET | `/articles/trending/` | Trending articles | hours, limit |
| GET | `/articles/related/` | Similar articles | article_id, limit |

#### **Categories**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories/` | List all categories |
| GET | `/categories/{slug}/` | Get category details |

#### **Tags**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tags/` | List all tags |
| GET | `/tags/popular/` | Get most-used tags |

#### **Authentication**

| Method | Endpoint | Description | Params |
|--------|----------|-------------|--------|
| POST | `/auth/login/` | User login | email/username, password |
| POST | `/auth/signup/` | User registration | username, email, password |
| POST | `/auth/token/refresh/` | Refresh JWT token | refresh |

#### **User Engagement**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/articles/{id}/like/` | Like/unlike article | Yes |
| POST | `/articles/{id}/add_comment/` | Add comment | Yes |
| DELETE | `/articles/{id}/delete_comment/` | Delete comment | Yes |
| POST | `/articles/{id}/bookmark/` | Bookmark/unbookmark | Yes |
| GET | `/articles/my_bookmarks/` | User's bookmarks | Yes |
| GET | `/articles/my_liked/` | User's liked articles | Yes |

#### **Search**

| Method | Endpoint | Description | Params |
|--------|----------|-------------|--------|
| GET | `/search/` | Unified search | q (query), type |

### **Example Requests**

```bash
# Get latest articles
curl http://localhost:8000/api/articles/

# Get trending articles
curl http://localhost:8000/api/articles/trending/?hours=24&limit=10

# Search articles
curl http://localhost:8000/api/articles/?search=election

# Filter by category
curl http://localhost:8000/api/articles/?category=politics

# Get article detail with comments
curl http://localhost:8000/api/articles/123/

# User login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Like an article (requires authentication)
curl -X POST http://localhost:8000/api/articles/123/like/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Add a comment
curl -X POST http://localhost:8000/api/articles/123/add_comment/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Great article!", "is_anonymous": false}'

# Get user's bookmarked articles
curl http://localhost:8000/api/articles/my_bookmarks/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Response Format**

```json
{
  "count": 487,
  "next": "http://localhost:8000/api/articles/?page=2",
  "previous": null,
  "total_pages": 25,
  "current_page": 1,
  "results": [
    {
      "id": 123,
      "title": "Article Title",
      "excerpt": "Brief summary...",
      "category": {
        "id": 5,
        "name": "Politics",
        "slug": "politics"
      },
      "tags": ["election", "nigeria"],
      "featured_image": {
        "url": "https://example.com/image.jpg",
        "alt_text": "Image description"
      },
      "created_at": "2025-11-09T12:00:00Z",
      "reading_time": "5 min read",
      "view_count": 1523,
      "is_featured": true,
      "like_count": 42,
      "comment_count": 15,
      "is_liked": false,
      "is_bookmarked": false,
      "comments": [
        {
          "id": 1,
          "user": {
            "id": 5,
            "username": "johndoe"
          },
          "content": "Great article!",
          "display_name": "johndoe",
          "is_anonymous": false,
          "created_at": "2025-11-09T13:30:00Z"
        }
      ]
    }
  ]
}
```

Full API documentation available in [`API_DOCUMENTATION.md`](API_DOCUMENTATION.md)

---

## 👨‍💻 Development

### **Project Workflow**

1. **Scraping Phase**
   - Celery task runs every 30 minutes
   - Scrapes configured news sources
   - Stores raw content in `ScrapedArticle` model

2. **Rewriting Phase**
   - Celery task processes `ScrapedArticle` records
   - Sends content to OpenAI API for rewriting
   - Checks for duplicates using FAISS
   - Creates `Article` if unique or updates `publication_count`

3. **Publishing Phase**
   - Published articles appear in API endpoints
   - Frontend fetches and displays content
   - View tracking begins on article access

4. **Analytics Phase**
   - Celery tasks update trending scores
   - Aggregate view counts
   - Generate engagement metrics

### **Adding New Features**

#### **1. Add a New API Endpoint**

```python
# In api/views.py
from rest_framework.decorators import action

class ArticleViewSet(viewsets.ModelViewSet):
    @action(detail=False, methods=['get'], url_path='featured')
    def featured(self, request):
        articles = Article.objects.filter(is_featured=True)[:5]
        serializer = self.get_serializer(articles, many=True)
        return Response(serializer.data)
```

#### **2. Add a New Celery Task**

```python
# In articles/tasks.py
from celery import shared_task

@shared_task
def send_daily_digest():
    """Send daily email digest of top articles"""
    articles = Article.objects.filter(
        created_at__gte=timezone.now() - timedelta(days=1)
    ).order_by('-view_count')[:10]
    
    # Send email logic here
    EmailService.send_digest(articles)
```

#### **3. Add a New Frontend Page**

```jsx
// In src/pages/Trending/Trending.jsx
import { useState, useEffect } from 'react';
import { articleAPI } from '../../services/api';
import ArticleCard from '../../components/ArticleCard/ArticleCard';

function Trending() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    articleAPI.getTrending(24, 20)
      .then(res => setArticles(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="trending-page">
      <h1>Trending Now</h1>
      <div className="articles-grid">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

export default Trending;
```

### **Code Style**

**Backend (Python):**
- Follow PEP 8 guidelines
- Use type hints where appropriate
- Write docstrings for all functions/classes
- Maximum line length: 100 characters

**Frontend (JavaScript/React):**
- Use ESLint configuration
- Follow Airbnb style guide
- Use functional components with hooks
- PropTypes for type checking

### **Testing**

```bash
# Backend tests
cd backend/backend
python manage.py test

# Frontend tests
cd frontend
npm run test

# Run specific test
python manage.py test articles.tests.ArticleModelTest
```

---

## 🚢 Deployment

### **Production Checklist**

- [ ] Set `DEBUG=False` in settings.py
- [ ] Configure PostgreSQL database
- [ ] Set up SSL certificate
- [ ] Configure static file serving
- [ ] Set up logging
- [ ] Enable HTTPS
- [ ] Configure firewall rules
- [ ] Set up backup system
- [ ] Configure monitoring (Sentry, etc.)
- [ ] Set up CDN for media files

### **Docker Deployment**

```dockerfile
# Example Dockerfile for backend
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
```

### **Environment-Specific Settings**

```python
# backend/settings.py
import os

if os.getenv('ENVIRONMENT') == 'production':
    DEBUG = False
    ALLOWED_HOSTS = ['sentineldigest.com', 'www.sentineldigest.com']
    
    # Use PostgreSQL
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('DB_NAME'),
            'USER': os.getenv('DB_USER'),
            'PASSWORD': os.getenv('DB_PASSWORD'),
            'HOST': os.getenv('DB_HOST'),
            'PORT': os.getenv('DB_PORT', '5432'),
        }
    }
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**
   ```bash
   git clone https://github.com/Neecrownsmith/Sentinel-Digest.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Changes**
   - Write clean, documented code
   - Add tests for new features
   - Update documentation

4. **Commit Changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

5. **Push to Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open Pull Request**
   - Describe changes in detail
   - Reference related issues
   - Wait for review

### **Reporting Issues**

When reporting bugs, please include:
- Operating system and version
- Python/Node.js version
- Steps to reproduce
- Expected vs. actual behavior
- Error messages/logs

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Neecrownsmith** - *Initial work* - [GitHub](https://github.com/Neecrownsmith)

---

## 🙏 Acknowledgments

- OpenAI for GPT API
- Django & DRF communities
- React ecosystem contributors
- FAISS for similarity search
- All open-source contributors

---

## 📞 Support

For support, email support@sentineldigest.com or open an issue on GitHub.

---

## 🗺️ Roadmap

### **Version 2.0 (Completed ✅)**
- [x] User authentication and profiles - JWT-based auth with email/username login
- [x] Commenting system - With anonymous commenting option
- [x] Bookmarking/favorites - Personal article collections
- [x] User account management - Profile editing, liked/bookmarked article views

### **Version 2.5 (Completed ✅)**
- [x] OAuth social login (Google) - Seamless authentication with Google accounts
- [x] Role-based access control - Three-tier system (regular users, staff, social managers, superusers)
- [x] Social media management - Platform-specific post queues with one-click sharing
- [x] Admin panel enhancements - Role-based admin cards, user management interface

### **Version 3.0 (In Progress 🚧)**
- [ ] Profile update backend API
- [ ] Email notifications for replies/mentions
- [ ] User followers/following system
- [ ] Comment reply threads
- [ ] Email newsletters
- [ ] OAuth providers (Facebook, Twitter)

### **Version 3.5**
- [ ] Mobile apps (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] A/B testing framework
- [ ] GraphQL API option
- [ ] WebSocket real-time updates
- [ ] Machine learning recommendations
- [ ] Automated fact-checking
- [ ] Video content support
- [ ] Podcast integration
- [ ] Premium subscription tiers
- [ ] Native advertising platform

---

## 📊 Performance Metrics

Current benchmarks (on development machine):

| Metric | Value |
|--------|-------|
| API Response Time | < 100ms |
| Page Load Time | < 2s |
| Time to Interactive | < 3s |
| Lighthouse Score | 95+ |
| Database Queries/Page | < 10 |
| Cache Hit Rate | 85% |

---

## 🔐 Security

- HTTPS enforced in production
- CSRF protection enabled
- XSS prevention via React's escaping
- SQL injection protection via ORM
- Rate limiting on API endpoints
- Secure password hashing (Django's PBKDF2)
- JWT authentication for API
- Regular dependency updates

Report security vulnerabilities to: security@sentineldigest.com

---

## 📈 Analytics

Track these KPIs:

- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Average Session Duration
- Pages per Session
- Bounce Rate
- Article Engagement Rate
- Social Shares
- API Usage Statistics

---

**Built with ❤️ by the Sentinel Digest Team**

*Last Updated: November 10, 2025*
