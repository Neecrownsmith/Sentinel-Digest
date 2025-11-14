# Sentinel Digest - Frontend

Modern React + Vite frontend for the Sentinel Digest news platform with advanced features including role-based access, social media management, and real-time engagement tracking.

## Tech Stack

- **React 19.1.1** - UI framework
- **Vite 7.1.7** - Build tool with HMR
- **React Router 7.9.5** - Client-side routing
- **Axios 1.13.2** - HTTP client for API calls
- **CSS3** - Custom styling

## Features

### User Features
- Browse articles by category and tags
- Search functionality with real-time results
- Article engagement (likes, comments, bookmarks)
- User authentication (JWT + Google OAuth)
- Personal profile with liked/bookmarked articles
- Anonymous commenting option

### Admin Features (Role-Based)
- **Regular Users**: Profile, liked articles, bookmarks
- **Staff Members**: Access to admin panel
- **Social Managers**: Admin panel + Social media post management
- **Superusers**: Full access + user role management

### Social Media Management
- Platform-specific post queues (Facebook, Twitter, LinkedIn, Instagram, WhatsApp)
- Dashboard view with post counts per platform
- Detail view for platform-specific posts
- One-click sharing with platform-specific URLs
- Automatic post marking and queue updates
- Empty state handling and navigation

## Project Structure

```
frontend/
├── src/
│   ├── assets/          # Images, icons
│   ├── components/      # Reusable components
│   │   ├── ArticleCard/
│   │   ├── CategoryNav/
│   │   ├── Footer/
│   │   ├── Header/
│   │   └── ...
│   ├── config/          # Configuration files
│   │   └── api.config.js
│   ├── context/         # React Context providers
│   │   └── AuthContext.jsx
│   ├── hooks/           # Custom React hooks
│   ├── layout/          # Layout components
│   │   └── Layout.jsx
│   ├── pages/           # Page components
│   │   ├── Account/     # User account & admin panel
│   │   ├── Article/     # Article detail
│   │   ├── Category/    # Category listing
│   │   ├── Home/        # Homepage
│   │   ├── Login/       # Authentication
│   │   ├── Search/      # Search results
│   │   └── ...
│   ├── services/        # API services
│   │   └── api.js
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component
│   ├── App.css          # Global styles
│   ├── main.jsx         # Entry point
│   └── index.css        # Base CSS
├── .env                 # Environment variables
├── index.html           # HTML template
├── package.json         # Dependencies
└── vite.config.js       # Vite configuration
```

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   
   Create `.env` file in root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api

   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Frontend will be available at: `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | API endpoint base URL | `http://localhost:8000/api` |


## Key Components

### Pages

#### Account Page (`pages/Account/Account.jsx`)
- User profile management
- Liked articles and bookmarks
- **Admin Panel** (staff/social managers/superusers):
  - User management
  - Content moderation
  - **Social Posts** (social managers/superusers only):
    - Platform dashboard with post counts
    - Platform detail views with share buttons
    - One-click sharing to social platforms
    - Real-time queue updates

#### Article Page (`pages/Article/Article.jsx`)
- Full article content with images
- Reading time and metadata
- Like, comment, bookmark functionality
- Related articles section
- Social sharing buttons

#### Home Page (`pages/Home/Home.jsx`)
- Hero section with featured articles
- Top stories grid
- Most read articles
- Category navigation

#### Search Page (`pages/Search/Search.jsx`)
- Real-time search results
- Filter by category and tags
- Pagination

### Components

#### ArticleCard (`components/ArticleCard/ArticleCard.jsx`)
- Display article preview
- Multiple variants (hero, standard, compact)
- Engagement indicators (views, likes, comments)

#### Header (`components/Header/Header.jsx`)
- Navigation bar with category links
- Search functionality
- User authentication state
- Responsive mobile menu

#### CategoryNav (`components/CategoryNav/CategoryNav.jsx`)
- Dynamic category navigation
- Active state highlighting
- Responsive design

## Authentication

### JWT Authentication
```javascript
// Login
const response = await authAPI.login(email, password);
// Access token stored in localStorage
localStorage.setItem('token', response.data.access);
```

### Google OAuth
```javascript
// Google OAuth flow handled in oauth_views.py (backend)
// Frontend redirects to /api/auth/google/ for OAuth initiation
```

### Protected Routes
```jsx
// Using AuthContext
const { user, isAuthenticated } = useAuth();

// Conditional rendering based on user roles
{user?.is_social_manager && <SocialPostsCard />}
{user?.is_staff && <AdminPanel />}
```

## API Integration

### Service Layer (`services/api.js`)

```javascript
// Article API
articleAPI.getAll(params)
articleAPI.getBySlug(slug)
articleAPI.getTopStories()
articleAPI.getMostRead(period, limit)
articleAPI.getTrending(hours, limit)
articleAPI.like(id)
articleAPI.bookmark(id)
articleAPI.addComment(id, content, isAnonymous)

// Social Posts API (auth required)
socialPostsAPI.getPendingPosts()
socialPostsAPI.markAsPosted(id, platform)

// Auth API
authAPI.login(email, password)
authAPI.signup(userData)
authAPI.getProfile()
```

## Styling

### CSS Architecture
- Component-scoped CSS files
- Global styles in `index.css` and `App.css`
- CSS variables for theming
- Responsive design with media queries

### Responsive Breakpoints
```css
/* Mobile */
@media (max-width: 768px) { }

/* Tablet */
@media (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }
```

## Social Media Platform Integration

### Supported Platforms
1. **Facebook** - Facebook Sharer
2. **Twitter/X** - Twitter Intent URL
3. **LinkedIn** - LinkedIn Share
4. **WhatsApp** - WhatsApp Web API
5. **Instagram** - Manual share (opens browser alert)

### Platform-Specific URLs
```javascript
// Twitter
https://twitter.com/intent/tweet?text=${caption}

// Facebook
https://www.facebook.com/sharer/sharer.php?u=${articleUrl}

// LinkedIn
https://www.linkedin.com/sharing/share-offsite/?url=${articleUrl}

// WhatsApp
https://wa.me/?text=${caption}
```

## Development Workflow

### Adding a New Page
1. Create page component in `src/pages/PageName/`
2. Add route in `App.jsx`
3. Add navigation link in Header/CategoryNav
4. Style with `PageName.css`

### Adding API Endpoint
1. Add method in `services/api.js`
2. Use in component with async/await
3. Handle loading and error states

### State Management
- **Local State**: `useState` for component-specific data
- **Context**: AuthContext for user authentication
- **API State**: Direct API calls with loading states

## Production Build

### Build for Production
```bash
npm run build
```

Output: `dist/` folder

### Preview Build
```bash
npm run preview
```

### Deployment Checklist
- [ ] Update `VITE_API_BASE_URL` to production URL
- [ ] Test all routes and API endpoints
- [ ] Verify authentication flow
- [ ] Check responsive design
- [ ] Test social sharing functionality
- [ ] Optimize images and assets
- [ ] Enable HTTPS in production

## Troubleshooting

### CORS Errors
- Verify backend CORS configuration
- Check `CORS_ALLOWED_ORIGINS` includes frontend URL
- Ensure backend is running

### API Connection Issues
- Verify `VITE_API_BASE_URL` in `.env`
- Check backend server is running
- Test API directly in browser

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use legacy peer deps
npm install --legacy-peer-deps
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Vite HMR for instant updates
- Code splitting with React Router
- Lazy loading for images
- API response caching
- Optimized build with minification

## Contributing

1. Create feature branch
2. Follow existing code style
3. Test all changes
4. Update documentation
5. Submit pull request

## Support

For issues and questions:
- Check console logs for errors
- Verify environment variables
- Review API responses in Network tab
- Test backend endpoints directly

---

**Built with ❤️ using React + Vite**
