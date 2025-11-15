# Layout Components

A collection of reusable layout components for displaying articles in various configurations.

## Available Layouts

### 1. LShapedHeroLayout
**File:** `LShapedHeroLayout.jsx`

A sophisticated L-shaped layout with a hero section in the center, perfect for category pages.

**Features:**
- Top horizontal bar: 2 compact cards
- Left vertical bar: 5 compact cards
- Center hero: 4 vertical cards in 2×2 grid
- Bottom grid: Additional articles in 2-column grid
- Right sidebar: "Latest" and "More Stories" sections

**Usage:**
```jsx
import { LShapedHeroLayout } from '../../layout';

<LShapedHeroLayout articles={articles} />
```

**Best for:** Category pages, topic hubs, curated content sections

---

### 2. GridLayout
**File:** `GridLayout.jsx`

Simple responsive grid layout for displaying articles uniformly.

**Props:**
- `articles` (required): Array of article objects
- `columns` (optional): Number of columns (2, 3, or 4). Default: 3
- `gap` (optional): Gap between items. Default: '24px'

**Usage:**
```jsx
import { GridLayout } from '../../layout';

<GridLayout articles={articles} columns={3} gap="24px" />
```

**Best for:** Archive pages, search results, simple article listings

---

### 3. ListLayout
**File:** `ListLayout.jsx`

Vertical list layout displaying articles in compact form.

**Props:**
- `articles` (required): Array of article objects
- `title` (optional): Section title
- `showImage` (optional): Show article images. Default: true
- `showCategory` (optional): Show article category. Default: false

**Usage:**
```jsx
import { ListLayout } from '../../layout';

<ListLayout 
  articles={articles} 
  title="Latest Articles"
  showImage={true}
  showCategory={false}
/>
```

**Best for:** Sidebars, recent posts, simple article lists

---

### 4. FeaturedGridLayout
**File:** `FeaturedGridLayout.jsx`

Layout with one large featured article at the top followed by a grid of regular articles.

**Props:**
- `articles` (required): Array of article objects
- `gridColumns` (optional): Number of columns for grid (2, 3, or 4). Default: 3

**Usage:**
```jsx
import { FeaturedGridLayout } from '../../layout';

<FeaturedGridLayout articles={articles} gridColumns={3} />
```

**Best for:** Homepage, featured collections, editorial picks

---

### 5. MasonryLayout
**File:** `MasonryLayout.jsx`

Layout with a main content grid and a sticky sidebar.

**Props:**
- `articles` (required): Array of article objects for main area
- `mainColumns` (optional): Number of columns in main grid (2 or 3). Default: 2
- `sidebarArticles` (optional): Array of articles for sidebar. Defaults to first 10 articles
- `sidebarTitle` (optional): Sidebar section title. Default: 'Latest'

**Usage:**
```jsx
import { MasonryLayout } from '../../layout';

<MasonryLayout 
  articles={articles} 
  mainColumns={2}
  sidebarTitle="Trending"
/>
```

**Best for:** Blog archives, multi-section pages, content-heavy pages

---

## Import Methods

### Individual Import
```jsx
import { LShapedHeroLayout } from '../../layout';
import { GridLayout } from '../../layout';
```

### Multiple Imports
```jsx
import { 
  LShapedHeroLayout, 
  GridLayout, 
  ListLayout,
  FeaturedGridLayout,
  MasonryLayout 
} from '../../layout';
```

---

## Article Object Structure

All layouts expect articles to have the following structure:

```javascript
{
  id: number,              // Required - Unique identifier
  title: string,           // Required - Article title
  slug: string,            // Required - URL slug
  excerpt: string,         // Optional - Short description
  featured_image: string,  // Optional - Image URL
  category: object,        // Optional - Category object
  published_date: string,  // Optional - Publication date
  reading_time: number,    // Optional - Reading time in minutes
}
```

---

## Responsive Design

All layouts are fully responsive with breakpoints at:
- **Desktop:** > 1024px - Full layout
- **Tablet:** 768px - 1024px - Adjusted columns
- **Mobile:** < 768px - Single column

---

## Customization

Each layout component has its own CSS file that can be customized:
- `LShapedHeroLayout.css`
- `GridLayout.css`
- `ListLayout.css`
- `FeaturedGridLayout.css`
- `MasonryLayout.css`

---

## Example: Category Page Implementation

```jsx
import { useState, useEffect } from 'react';
import { LShapedHeroLayout } from '../../layout';

function Category() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Load articles
    loadArticles();
  }, []);

  return (
    <div className="category-page">
      <header className="category-header">
        <h1>Category Name</h1>
      </header>
      
      <section className="category-content">
        <LShapedHeroLayout articles={articles} />
      </section>
    </div>
  );
}
```

---

## Notes

- All layouts include empty state handling
- Layouts are optimized for performance with React.memo where beneficial
- PropTypes validation is included for type safety
- All layouts support dark mode through CSS variables (if implemented)
