# Frontend Best Practices - Implementation Guide

## ✅ Implemented Best Practices

### 1. **PropTypes Validation** ✅
**Status**: Implemented
**Files Updated**: 
- `src/components/common/Icon.jsx`
- `src/components/ArticleCard/ArticleCard.jsx`

**What Was Done**:
- Installed `prop-types` package
- Added comprehensive PropTypes validation to reusable components
- Defined shared `articlePropType` for consistency across components

**Usage Example**:
```jsx
import PropTypes from 'prop-types';

function MyComponent({ title, count, onClick }) {
  return <div>{title}</div>;
}

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number,
  onClick: PropTypes.func
};
```

**Next Steps**:
- Add PropTypes to remaining components (Button, Header, Footer)
- Add PropTypes to all page components
- Consider TypeScript migration for static type checking

---

### 2. **Error Handling & Error Boundaries** ✅
**Status**: Implemented
**Files Created**:
- `src/utils/logger.js` - Centralized error logging utility
- `src/components/common/ErrorBoundary.jsx` - React Error Boundary component
- `src/components/common/ErrorBoundary.css` - Error boundary styles

**What Was Done**:
- Created robust error logging utility with support for external services (Sentry, LogRocket)
- Implemented Error Boundary component to catch React errors
- Added error boundaries at App and Routes level
- Updated API service to use logger for API errors
- Updated AuthContext to use logger instead of console.error

**Features**:
- Development vs Production logging
- Structured error context
- API error logging with request details
- User-friendly error UI
- Error recovery functionality

**Usage Example**:
```jsx
import ErrorBoundary from './components/common/ErrorBoundary';
import logger from './utils/logger';

// Wrap components
<ErrorBoundary name="MyComponent">
  <MyComponent />
</ErrorBoundary>

// Log errors
try {
  await someAsyncOperation();
} catch (error) {
  logger.error('Operation failed', { operation: 'someAsyncOperation' });
}
```

---

### 3. **Environment Variable Validation** ✅
**Status**: Implemented
**Files Created**:
- `src/utils/env.js` - Environment configuration validation

**What Was Done**:
- Created environment validation utility
- Validates required environment variables on app startup
- Provides helpful error messages for missing configuration
- Centralizes environment variable access
- Added OAuth provider status checking

**Features**:
- Required vs optional variable checking
- Helpful development error messages
- Centralized API configuration
- OAuth status checking

**Usage Example**:
```jsx
import { initEnv, getApiConfig, getEnv } from './utils/env';

// Initialize on app startup
useEffect(() => {
  initEnv();
}, []);

// Get configuration
const { apiUrl, backendUrl } = getApiConfig();
const googleClientId = getEnv('VITE_GOOGLE_CLIENT_ID');
```

---

### 4. **Consistent Logger Usage** ✅
**Status**: Implemented
**Files Updated**:
- `src/services/api.js`
- `src/context/AuthContext.jsx`
- All error handling replaced with logger

**What Was Done**:
- Created centralized logger utility
- Replaced console.error/warn with logger calls
- Added structured logging with context
- Support for external monitoring services

**Logger API**:
```jsx
import logger from './utils/logger';

// Error logging
logger.error(error, { userId, action: 'login' });

// Warning logging
logger.warn('Feature not configured', { feature: 'oauth' });

// Info logging (dev only)
logger.info('User action', { action: 'signup' });

// API error logging
logger.apiError(error, { url: '/api/articles', method: 'GET' });
```

---

## 🚧 Recommended Best Practices to Implement

### 5. **Loading States & Skeleton Loaders**
**Status**: Not implemented
**Priority**: High

**What to Do**:
- Replace basic spinners with skeleton loaders
- Create reusable skeleton components
- Add loading states to all data-fetching components

**Implementation**:
```jsx
// Create Skeleton components
// src/components/common/Skeleton.jsx
export function ArticleCardSkeleton() {
  return (
    <div className="article-card-skeleton">
      <div className="skeleton skeleton-image"></div>
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text"></div>
    </div>
  );
}

// Use in components
{loading ? (
  <>
    <ArticleCardSkeleton />
    <ArticleCardSkeleton />
    <ArticleCardSkeleton />
  </>
) : (
  articles.map(article => <ArticleCard key={article.id} article={article} />)
)}
```

**CSS Example**:
```css
.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s ease-in-out infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

### 6. **Accessibility Improvements**
**Status**: Partially implemented
**Priority**: High

**What to Do**:
- Add comprehensive ARIA labels
- Ensure keyboard navigation works everywhere
- Add focus management for modals/dropdowns
- Use semantic HTML consistently
- Add skip-to-content links
- Ensure proper heading hierarchy
- Test with screen readers

**Checklist**:
```jsx
// ✅ Good Examples
<button aria-label="Close menu" onClick={closeMenu}>
  <Icon name="close" />
</button>

<nav aria-label="Main navigation">
  {/* navigation items */}
</nav>

<img src={image} alt="Descriptive alt text" />

// ❌ Bad Examples
<div onClick={handleClick}>Click me</div> // Use button instead
<img src={image} alt="" /> // Missing alt text
```

**Focus Management**:
```jsx
import { useEffect, useRef } from 'react';

function Modal({ isOpen, onClose }) {
  const firstFocusableRef = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
      firstFocusableRef.current?.focus();
    }
  }, [isOpen]);
  
  return (
    <div role="dialog" aria-modal="true">
      <button ref={firstFocusableRef} onClick={onClose}>
        Close
      </button>
    </div>
  );
}
```

---

### 7. **Performance Optimization**
**Status**: Not implemented
**Priority**: Medium

**What to Do**:
- Use React.memo for expensive components
- Memoize callbacks with useCallback
- Memoize computed values with useMemo
- Implement virtualization for long lists
- Lazy load images
- Optimize bundle size

**Implementation Examples**:
```jsx
import { memo, useCallback, useMemo } from 'react';

// Memoize components
const ArticleCard = memo(function ArticleCard({ article }) {
  return <div>{article.title}</div>;
});

// Memoize callbacks
function Parent() {
  const handleClick = useCallback((id) => {
    console.log('Clicked:', id);
  }, []); // Dependencies array
  
  return <Child onClick={handleClick} />;
}

// Memoize expensive computations
function Component({ items }) {
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.value - b.value);
  }, [items]);
  
  return <List items={sortedItems} />;
}
```

---

### 8. **SEO & Meta Tags**
**Status**: Not implemented
**Priority**: High

**What to Do**:
- Install react-helmet-async
- Add dynamic meta tags to each page
- Implement OpenGraph tags for social sharing
- Add Twitter Card meta tags
- Create SEO component for reusability

**Installation**:
```bash
npm install react-helmet-async
```

**Implementation**:
```jsx
// src/components/common/SEO.jsx
import { Helmet } from 'react-helmet-async';

export function SEO({ 
  title, 
  description, 
  image, 
  url,
  type = 'website'
}) {
  const siteTitle = 'Sentinel Digest';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* OpenGraph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}

// Use in pages
function Article({ article }) {
  return (
    <>
      <SEO 
        title={article.title}
        description={article.excerpt}
        image={article.featured_image}
        url={window.location.href}
        type="article"
      />
      {/* Article content */}
    </>
  );
}
```

---

### 9. **Form Validation Library**
**Status**: Not implemented
**Priority**: Medium

**What to Do**:
- Install react-hook-form
- Create reusable form components
- Add consistent validation across forms
- Improve error messages

**Installation**:
```bash
npm install react-hook-form
```

**Implementation**:
```jsx
import { useForm } from 'react-hook-form';

function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();
  
  const onSubmit = async (data) => {
    try {
      await api.submitContact(data);
      reset();
    } catch (error) {
      logger.error('Form submission failed', { error });
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        })}
      />
      {errors.email && <span>{errors.email.message}</span>}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

### 10. **Code Splitting & Lazy Loading**
**Status**: Not implemented
**Priority**: High

**What to Do**:
- Implement route-based code splitting
- Lazy load heavy components
- Add loading fallbacks with Suspense

**Implementation**:
```jsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load pages
const Home = lazy(() => import('./pages/Home/Home'));
const Article = lazy(() => import('./pages/Article/Article'));
const Category = lazy(() => import('./pages/Category/Category'));
const About = lazy(() => import('./pages/Company/About'));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article/:slug" element={<Article />} />
        <Route path="/category/:slug" element={<Category />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  );
}

// Page loader component
function PageLoader() {
  return (
    <div className="page-loader">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}
```

---

## 📚 Additional Best Practices

### 11. **Custom Hooks**
**Status**: Partially implemented
**Current Hooks**: useToggle, useFormInput, useScrollToTop, useAccordion

**Recommended Additional Hooks**:
```jsx
// useDebounce - Debounce values (e.g., search)
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}

// useLocalStorage - Persist state in localStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  
  const setStoredValue = (newValue) => {
    try {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      logger.error('localStorage set failed', { key, error });
    }
  };
  
  return [value, setStoredValue];
}

// useOnClickOutside - Detect clicks outside element
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
```

---

### 12. **Testing**
**Status**: Not implemented
**Priority**: High

**What to Do**:
- Set up Jest and React Testing Library
- Add unit tests for utilities and hooks
- Add integration tests for key user flows
- Add component tests

**Installation**:
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest
```

**Example Tests**:
```jsx
// dateUtils.test.js
import { formatRelativeTime } from './dateUtils';

describe('formatRelativeTime', () => {
  it('should return "Just now" for recent dates', () => {
    const now = new Date();
    expect(formatRelativeTime(now.toISOString())).toBe('Just now');
  });
  
  it('should return hours ago for older dates', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    expect(formatRelativeTime(twoHoursAgo.toISOString())).toBe('2 hours ago');
  });
});

// ArticleCard.test.jsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ArticleCard } from './ArticleCard';

const mockArticle = {
  id: 1,
  slug: 'test-article',
  title: 'Test Article',
  excerpt: 'Test excerpt',
  created_at: new Date().toISOString(),
};

describe('ArticleCard', () => {
  it('renders article title', () => {
    render(
      <BrowserRouter>
        <ArticleCard article={mockArticle} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Test Article')).toBeInTheDocument();
  });
});
```

---

### 13. **TypeScript Migration** (Future Consideration)
**Status**: Not implemented
**Priority**: Low (but high value long-term)

**Benefits**:
- Compile-time type checking
- Better IDE intellisense
- Fewer runtime errors
- Self-documenting code

**Migration Strategy**:
1. Install TypeScript: `npm install --save-dev typescript @types/react @types/react-dom`
2. Rename `.jsx` files to `.tsx` gradually
3. Start with utility files and hooks
4. Move to components
5. Add types for API responses

---

## 🔍 Code Review Checklist

Use this checklist when reviewing or writing code:

### Component Checklist
- [ ] PropTypes defined for all props
- [ ] Default props documented
- [ ] Accessibility attributes added (aria-label, role, etc.)
- [ ] Error states handled
- [ ] Loading states handled
- [ ] Memoized if expensive
- [ ] Key props on list items
- [ ] No inline function definitions in JSX
- [ ] CSS follows BEM naming convention

### Hook Checklist
- [ ] Dependencies array correct
- [ ] Cleanup functions added
- [ ] No missing dependencies (ESLint warning)
- [ ] useCallback for callbacks passed to children
- [ ] useMemo for expensive computations

### API Call Checklist
- [ ] Error handling with logger
- [ ] Loading state managed
- [ ] Success/error feedback to user
- [ ] Request cancellation on unmount
- [ ] Retry logic for failed requests

### Styling Checklist
- [ ] Mobile-responsive
- [ ] Demure aesthetic maintained
- [ ] Consistent spacing
- [ ] Accessible color contrast
- [ ] Hover/focus states defined
- [ ] Transitions smooth

---

## 📖 Resources

- [React Best Practices](https://react.dev/learn)
- [PropTypes Documentation](https://reactjs.org/docs/typechecking-with-proptypes.html)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Web Accessibility (WAI-ARIA)](https://www.w3.org/WAI/ARIA/apg/)
- [React Testing Library](https://testing-library.com/react)
- [React Performance](https://react.dev/learn/render-and-commit)

---

## 🎯 Priority Implementation Order

1. **Immediate (Week 1)**:
   - ✅ PropTypes validation (DONE)
   - ✅ Error boundaries (DONE)
   - ✅ Environment validation (DONE)
   - ✅ Logger utility (DONE)

2. **High Priority (Week 2-3)**:
   - [ ] Loading states & skeletons
   - [ ] Accessibility improvements
   - [ ] SEO & meta tags
   - [ ] Code splitting

3. **Medium Priority (Week 4-5)**:
   - [ ] Performance optimization (memo, useCallback)
   - [ ] Form validation library
   - [ ] Additional custom hooks

4. **Lower Priority (Ongoing)**:
   - [ ] Testing setup and tests
   - [ ] TypeScript migration (if desired)
   - [ ] Advanced optimizations

---

*Last Updated: November 12, 2025*
