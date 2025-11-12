# Sentinel Digest Frontend

A modern, responsive news digest application built with React, Vite, and React Router. Features LA Times and NY Times-inspired layouts with elegant, demure design aesthetics, comprehensive article browsing, searching, categorization, user authentication, and role-based social media management.

## Features

### User Features
- **Home Page**: Hero sections, top stories, trending articles, and most-read lists
- **Article Pages**: Full article view with engagement features and related articles sidebar
- **Category Pages**: Browse articles by category with pagination
- **Tag Pages**: Browse articles by tags with elegant pill-shaped tag design
- **Search Functionality**: Full-text search across articles, categories, and tags
- **User Authentication**: JWT-based auth + Google OAuth integration
- **Article Engagement**: Like, comment (including anonymous), and bookmark articles
- **User Profile**: View liked articles and bookmarks in organized tabs
- **Company Pages**: About, Contact, Careers (Volunteer), Advertise, Services
- **Elegant Design**: Demure, refined aesthetics with soft colors, subtle shadows, and sophisticated typography
- **Refined Tag System**: Soft pill-shaped tags throughout with elegant hover effects
- **Social Sharing**: Share articles on Twitter/X, Facebook, LinkedIn, WhatsApp, Instagram
- **Responsive Design**: Mobile-first design optimized for all screen sizes

### Planned Features 🚧
- **Quote of the Day**: Daily inspirational or thought-provoking quotes
- **On This Day in History**: Historical events that happened on the current date
- **Proverb of the Day**: Daily wisdom from various cultures
- **Daily Did You Know?**: Interesting facts and trivia updated daily

### Potential Future Additions
Consider implementing:
- Weather Widget (location-based)
- Word of the Day (vocabulary)
- This Day in News History
- Daily Puzzle/Brain Teaser
- Horoscope Section
- Market/Stock Ticker
- Countdown to Major Events
- Today's Birthdays (notable figures)

### Admin Features (Role-Based Access)
- **Staff Panel**: Admin dashboard for content management with role badges
- **Social Media Management** (Social Managers/Superusers):
  - Platform-specific post queues (Facebook, Twitter/X, LinkedIn, Instagram, WhatsApp)
  - Dashboard view with post counts per platform
  - Detail view for each platform's posts
  - One-click sharing with platform URLs
  - Real-time queue updates
  - Automatic navigation on empty platforms
  - Empty state handling with helpful messaging
- **Content Curation**: Direct links to Django admin for article management
- **User Management**: View and manage user roles and permissions

## Tech Stack

- **React 19.1.1** - UI library
- **React Router DOM 7.9.5** - Client-side routing
- **Axios 1.13.2** - HTTP client for API requests
- **Vite 7.1.7** - Build tool and dev server
- **Custom Hooks** - Reusable logic (useToggle, useFormInput, useScrollToTop, useAccordion)
- **Context API** - AuthContext for global user state

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ArticleCard/          # Article card components (Hero, Standard, Compact)
│   │   ├── Header/                # Site header with search and navigation
│   │   ├── Footer/                # Site footer with social links
│   │   └── common/                # Reusable components (Icon with X and WhatsApp support)
│   ├── context/
│   │   └── AuthContext.jsx        # Authentication context provider
│   ├── pages/
│   │   ├── Home/                  # Home page with grid layout
│   │   ├── Article/               # Article detail with engagement (likes, comments, bookmarks)
│   │   ├── Category/              # Category listing page
│   │   ├── Tag/                   # Tag listing page
│   │   ├── Search/                # Search results page
│   │   ├── Account/               # User profile + admin panel + social posts
│   │   ├── Login/                 # Login page (JWT + OAuth)
│   │   ├── Signup/                # User registration
│   │   └── Company/               # Company pages (About, Contact, Careers, Advertise, Services)
│   │       ├── About.jsx          # About page with mission, values, team
│   │       ├── Contact.jsx        # Contact form with social links
│   │       ├── Careers.jsx        # Volunteer opportunities
│   │       ├── Advertise.jsx      # Advertising information and form
│   │       ├── Company.css        # Shared demure styling for all company pages
│   │       └── Services.jsx       # Services offered
│   ├── services/
│   │   └── api.js                 # API service layer with all endpoints
│   ├── hooks/                     # Custom React hooks (useToggle, useFormInput, useAccordion)
│   ├── utils/                     # Utility functions (date formatting)
│   ├── config/                    # Configuration files (navigation, footer)
│   ├── App.jsx                    # Main app component with routing
│   └── main.jsx                   # App entry point
├── public/                        # Static assets
├── .env                           # Environment variables
└── package.json                   # Dependencies and scripts
```

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
Create a `.env` file in the frontend directory:
```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_BACKEND_URL=http://localhost:8000
```

**Environment Variables:**
- `VITE_API_BASE_URL`: API endpoint base URL for REST calls
- `VITE_BACKEND_URL`: Backend base URL for admin panel links

## Development

**Start the development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

## API Integration

The frontend communicates with the Django backend through the API service layer (`src/services/api.js`).

### Available API Methods:

**Articles:**
- `articlesAPI.getArticles()` - List all articles with filters
- `articlesAPI.getArticle(slug)` - Get single article
- `articlesAPI.getTopStories()` - Get editorially curated stories
- `articlesAPI.getMostRead()` - Get most-read articles
- `articlesAPI.getTrending()` - Get trending articles
- `articlesAPI.getRelated(articleId)` - Get related articles
- `articlesAPI.getByCategory(slug)` - Get articles by category
- `articlesAPI.search(query)` - Search articles

**Categories:**
- `categoriesAPI.getCategories()` - List all categories
- `categoriesAPI.getCategory(slug)` - Get single category

**Tags:**
- `tagsAPI.getTags()` - List all tags
- `tagsAPI.getPopular()` - Get popular tags

**Search:**
- `searchAPI.search(query, type)` - Unified search

**Authentication:**
- `authAPI.login(credentials)` - User login
- `authAPI.register(userData)` - User registration
- `authAPI.getProfile()` - Get user profile
- `authAPI.logout()` - User logout

## Components

### ArticleCard Components

**ArticleCard** - Standard article card for grids
```jsx
<ArticleCard article={article} featured={false} />
```

**ArticleCardCompact** - Compact card for sidebars
```jsx
<ArticleCardCompact article={article} showImage={true} showCategory={true} />
```

**ArticleCardHero** - Large hero card for featured articles
```jsx
<ArticleCardHero article={article} />
```

### Custom Hooks

**useToggle** - Manage boolean state
```jsx
const [isOpen, toggle, setTrue, setFalse] = useToggle(false);
```

**useFormInput** - Manage form input state
```jsx
const [value, handleChange, reset] = useFormInput('');
```

**useScrollToTop** - Scroll to top on route change
```jsx
useScrollToTop();
```

**useAccordion** - Manage accordion state
```jsx
const [activeIndex, handleClick] = useAccordion();
```

## Routes

- `/` - Home page
- `/article/:slug` - Article detail page
- `/category/:slug` - Category listing page
- `/tag/:slug` - Tag listing page
- `/search?q=query` - Search results page

## Styling

All components include dedicated CSS files with:
- Mobile-first responsive design
- Breakpoints at 480px, 768px, and 1024px
- LA Times/NY Times-inspired typography and layouts
- Smooth animations and transitions
- Hover effects and interactive states

## Backend Requirements

The frontend expects the Django backend to be running at `http://localhost:8000` with the following endpoints:

- `GET /api/articles/` - List articles
- `GET /api/articles/{slug}/` - Get article
- `GET /api/articles/top-stories/` - Top stories
- `GET /api/articles/most-read/` - Most read
- `GET /api/articles/trending/` - Trending
- `GET /api/articles/related/` - Related articles
- `GET /api/categories/` - List categories
- `GET /api/tags/` - List tags
- `GET /api/search/` - Search

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000/api` |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Code splitting with React Router
- Lazy loading of images
- Optimized bundle size with Vite
- Caching of API responses (backend)
- Debounced search inputs

## Contributing

1. Follow the existing code structure
2. Use functional components with hooks
3. Keep components small and focused
4. Write descriptive commit messages
5. Test on multiple screen sizes

## Troubleshooting

**CORS errors:**
Make sure the Django backend has the correct CORS settings for `http://localhost:5173`

**API connection issues:**
Verify the backend is running and the `VITE_API_URL` environment variable is correct

**Route not found:**
Check that React Router is properly configured in `App.jsx`

## Next Steps

- [ ] Add user authentication UI
- [ ] Implement article bookmarking
- [ ] Add social sharing buttons
- [ ] Create user profile pages
- [ ] Add comments section
- [ ] Implement infinite scroll
- [ ] Add dark mode support
- [ ] Create admin dashboard

## License

This project is part of the Sentinel Digest application.
