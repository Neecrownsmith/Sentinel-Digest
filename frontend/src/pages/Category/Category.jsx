import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { articlesAPI, categoriesAPI, getProxiedImageUrl } from '../../services/api';
import { formatRelativeTime } from '../../utils/dateUtils';
import { getDailyLayoutsForCategory, getLayoutRequirements } from '../../utils/layoutUtils';
import Seo from '../../components/common/Seo';
import { SITE_URL } from '../../utils/env';
import './Category.css';

// Allocate articles deterministically: fill primary, then secondary, then more
function allocateArticles(all, p, s) {
  const buf = Array.isArray(all) ? [...all] : [];
  const out = { primary: [], secondary: [], more: [] };
  if (buf.length === 0) return out;

  // Fill primary and secondary first from the head of the list
  out.primary = buf.splice(0, Math.min(p, buf.length));
  out.secondary = buf.splice(0, Math.min(s, buf.length));
  out.more = buf;

  // If primary/secondary are short and there is overflow in more, borrow forward
  while (out.primary.length < p && out.more.length) out.primary.push(out.more.shift());
  while (out.secondary.length < s && out.more.length) out.secondary.push(out.more.shift());

  return out;
}

function Category() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [mostReadArticles, setMostReadArticles] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get daily layouts for this category - memoized to ensure consistency
  const [PrimaryLayout, SecondaryLayout, primaryName, secondaryName] = useMemo(() => {
    return getDailyLayoutsForCategory(slug);
  }, [slug]);

  // Calculate required articles based on layout requirements
  const primaryCount = useMemo(() => getLayoutRequirements(primaryName), [primaryName]);
  const secondaryCount = useMemo(() => getLayoutRequirements(secondaryName), [secondaryName]);
  const moreStoriesCount = 10; // Articles to show in More Stories sidebar

  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    loadCategoryData();
  }, [slug, currentPage]);

  async function loadCategoryData() {
    try {
      setLoading(true);
      setError(null);

      // Calculate articles per page (for pagination step)
      // This is the "real" page size for pagination navigation
      const articlesPerPage = primaryCount + secondaryCount;
      
      // Calculate total articles to fetch (including More Stories preview)
      // We fetch extra articles to show in "More Stories" sidebar
      const totalNeeded = articlesPerPage + moreStoriesCount;

      // Debug: Log the calculation
      console.log('Fetch Calculation:', {
        primaryCount,
        secondaryCount,
        moreStoriesCount,
        articlesPerPage,
        totalNeeded,
        currentPage
      });

      /**
       * Overlapping Pagination Strategy:
       * - Page 1: Fetch articles 0-23 (if articlesPerPage=14, moreStoriesCount=10)
       *   - Primary: 0-5, Secondary: 6-13, More Stories: 14-23
       * - Page 2: Fetch articles 14-37 (offset by articlesPerPage, not totalNeeded)
       *   - Primary: 14-19, Secondary: 20-27, More Stories: 28-37
       * 
       * Backend receives: limit=24, offset=14, step=14
       * This creates a seamless flow where More Stories becomes the next page's content
       */
      const [categoryRes, articlesRes, mostReadRes] = await Promise.all([
        categoriesAPI.getCategory(slug),
        // Use standard page-based pagination to guarantee fresh page data
        // Pass page_size = totalNeeded and disable step/offset mode
        articlesAPI.getByCategory(slug, currentPage, totalNeeded, null),
        articlesAPI.getMostRead({ category: slug, limit: 10 }),
      ]);

      setCategory(categoryRes.data);
      let fetched = articlesRes.data.results || [];
      const backendCount = articlesRes.data.count ?? fetched.length;

      // If category does not have enough to fully populate layouts + more stories,
      // top up with trending articles (non-duplicates) as a graceful fallback.
      const deficit = Math.max(0, totalNeeded - fetched.length);
      if (deficit > 0) {
        try {
          const trendingRes = await articlesAPI.getTrending({ limit: deficit });
          const trending = (trendingRes.data.results || trendingRes.data || []).filter(Boolean);
          const seen = new Set(fetched.map(a => a.id));
          const fillers = [];
          for (const a of trending) {
            if (a && !seen.has(a.id)) {
              fillers.push(a);
              seen.add(a.id);
              if (fillers.length >= deficit) break;
            }
          }
          fetched = fetched.concat(fillers);
        } catch (e) {
          console.warn('Trending fallback fetch failed', e);
        }
      }

      // Trim to totalNeeded in case fallback added extra
      if (fetched.length > totalNeeded) {
        fetched = fetched.slice(0, totalNeeded);
      }

      // Debug: log backend count vs fetched
      console.log('Backend vs Fetched:', { backendCount, fetched: fetched.length, totalNeeded, deficit });

      setArticles(fetched);
      setMostReadArticles(mostReadRes.data.results || mostReadRes.data || []);

      // Compute robust pagination values even when backend doesn't provide total/current
      const totalCount = Number(articlesRes.data.count ?? fetched.length ?? 0);
      const serverTotalPages = Number(articlesRes.data.total_pages ?? NaN);
      const serverCurrentPage = Number(articlesRes.data.current_page ?? NaN);

      const computedTotalPages = Number.isFinite(serverTotalPages)
        ? serverTotalPages
        : Math.max(1, Math.ceil(totalCount / (primaryCount + secondaryCount || 1)));

      const computedCurrentPage = Number.isFinite(serverCurrentPage)
        ? serverCurrentPage
        : Math.min(Math.max(currentPage, 1), computedTotalPages);

      const hasPrevious = typeof articlesRes.data.previous !== 'undefined'
        ? Boolean(articlesRes.data.previous)
        : computedCurrentPage > 1;

      const hasNext = typeof articlesRes.data.next !== 'undefined'
        ? Boolean(articlesRes.data.next)
        : computedCurrentPage < computedTotalPages;

      setPagination({
        count: totalCount,
        totalPages: computedTotalPages,
        currentPage: computedCurrentPage,
        next: hasNext,
        previous: hasPrevious,
      });
    } catch (err) {
      console.error('Error loading category:', err);
      setError(err.response?.status === 404 ? 'Category not found' : 'Failed to load category');
    } finally {
      setLoading(false);
    }
  }

  function handlePageChange(page) {
    const target = Math.max(1, Math.min(Number(page) || 1, pagination?.totalPages || Infinity));
    if (target === pagination?.currentPage) return;
    setSearchParams({ page: target.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Deterministically allocate fetched items to primary/secondary/more buffers
  const { primary: primaryArticles, secondary: secondaryArticles, more: moreStoriesArticles } = useMemo(
    () => allocateArticles(articles, primaryCount, secondaryCount),
    [articles, primaryCount, secondaryCount]
  );

  // Debug: Log layout distribution
  useEffect(() => {
    if (articles.length > 0) {
      console.log('Layout Distribution:', {
        primaryName,
        secondaryName,
        primaryCount,
        secondaryCount,
        primaryArticles: primaryArticles.length,
        secondaryArticles: secondaryArticles.length,
        moreStories: moreStoriesArticles.length,
        totalArticles: articles.length,
        expectedTotal: primaryCount + secondaryCount + moreStoriesCount,
        shortage: (primaryCount + secondaryCount + moreStoriesCount) - articles.length
      });
      
      // Warn if we don't have enough articles
      if (articles.length < primaryCount + secondaryCount) {
        console.warn(`Not enough articles: Need ${primaryCount + secondaryCount}, but only have ${articles.length}`);
      }
    }
  }, [articles, primaryName, secondaryName, primaryCount, secondaryCount]);

  if (loading) {
    return (
      <div className="category-loading">
        <div className="spinner"></div>
        <p>Loading category...</p>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="category-error">
        <h2>{error || 'Category not found'}</h2>
      </div>
    );
  }

  const canonicalPath = `/category/${slug}`;
  const categoryJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} News | Sentinel Digest`,
    description: category.description || `Latest insights and articles in the ${category.name} category from Sentinel Digest.`,
    url: SITE_URL ? `${SITE_URL}${canonicalPath}` : undefined,
    mainEntity: articles.slice(0, 12)
      .map((item) => {
        if (!item || !item.slug) {
          return null;
        }
        return {
          '@type': 'NewsArticle',
          headline: item.title,
          url: SITE_URL ? `${SITE_URL}/article/${item.slug}` : undefined,
          datePublished: item.created_at,
        };
      })
      .filter(Boolean),
  };

  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL || undefined,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: category.name,
        item: SITE_URL ? `${SITE_URL}${canonicalPath}` : undefined,
      },
    ],
  };

  return (
    <div className="category-page">
      <Seo
        title={category.name}
        description={category.description || `Discover the latest stories, analysis, and updates about ${category.name} from Sentinel Digest.`}
        canonicalPath={canonicalPath}
        jsonLd={[categoryJsonLd, breadcrumbsJsonLd]}
      />
      {/* Category Header */}
      <header className="category-header">
        <div className="category-header__container">
          <h1 className="category-header__title">{category.name}</h1>
          {category.description && (
            <p className="category-header__description">{category.description}</p>
          )}
          <div className="category-header__meta">
            <span>{pagination?.count || 0} articles</span>
          </div>
        </div>
      </header>

      {/* Articles Grid */}
      <section className="category-content">
        <div className="category-content__container">
          {articles.length > 0 ? (
            <div className="category-layout">
              {/* Main content area */}
              <div className="category-main">
                {/* Primary layout with exact article count */}
                <div className="layout-section" data-layout="primary" data-layout-name={primaryName}>
                  <PrimaryLayout articles={primaryArticles} />
                </div>

                {/* Secondary layout with exact article count */}
                <div className="layout-section" data-layout="secondary" data-layout-name={secondaryName}>
                  <SecondaryLayout articles={secondaryArticles} />
                </div>
              </div>

              {/* Sidebar */}
              <aside className="category-sidebar">
                {/* Most Read section */}
                <div className="category-sidebar-section">
                  <h3 className="category-section-title">Most Read</h3>
                  <div className="category-sidebar-list">
                    {mostReadArticles.slice(0, 10).map((article) => {
                      const featuredImageUrl = article.featured_image?.url || article.featured_image;
                      return (
                        <div key={article.id} className="category-sidebar-item">
                          <a href={`/article/${article.slug}`} className="category-sidebar-link">
                            {featuredImageUrl && (
                              <img 
                                loading="lazy"
                                decoding="async"
                                src={featuredImageUrl} 
                                alt={article.featured_image?.alt_text || article.title}
                                className="category-sidebar-image"
                                onError={(e) => {
                                  const proxiedUrl = getProxiedImageUrl(featuredImageUrl);
                                  if (proxiedUrl && e.target.src !== proxiedUrl) {
                                    e.target.src = proxiedUrl;
                                  } else {
                                    e.target.style.display = 'none';
                                  }
                                }}
                              />
                            )}
                            <div className="category-sidebar-content">
                              <h4 className="category-sidebar-title">{article.title}</h4>
                              <time className="category-sidebar-date" dateTime={article.created_at}>
                                {formatRelativeTime(article.created_at)}
                              </time>
                            </div>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* More Stories section - continuation of main articles */}
                <div className="category-sidebar-section">
                  <h3 className="category-section-title">More Stories</h3>
                  <div className="category-sidebar-list">
                    {moreStoriesArticles.map((article) => {
                      const featuredImageUrl = article.featured_image?.url || article.featured_image;
                      return (
                        <div key={article.id} className="category-sidebar-item">
                          <a href={`/article/${article.slug}`} className="category-sidebar-link">
                            {featuredImageUrl && (
                              <img 
                                loading="lazy"
                                decoding="async"
                                src={featuredImageUrl} 
                                alt={article.featured_image?.alt_text || article.title}
                                className="category-sidebar-image"
                                onError={(e) => {
                                  const proxiedUrl = getProxiedImageUrl(featuredImageUrl);
                                  if (proxiedUrl && e.target.src !== proxiedUrl) {
                                    e.target.src = proxiedUrl;
                                  } else {
                                    e.target.style.display = 'none';
                                  }
                                }}
                              />
                            )}
                            <div className="category-sidebar-content">
                              <h4 className="category-sidebar-title">{article.title}</h4>
                              <time className="category-sidebar-date" dateTime={article.created_at}>
                                {formatRelativeTime(article.created_at)}
                              </time>
                            </div>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </aside>

            
                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.previous}
                      className="pagination__nav"
                      aria-label="Previous page"
                    >
                      ←
                    </button>

                    {/* Numeric windowed pages: 1-3 on page 1, 1-4 on page 2, then sliding window of 5 */}
                    <div className="pagination__pages" role="list">
                      {(() => {
                        const total = pagination.totalPages;
                        const current = pagination.currentPage;

                        function getPages(cur, tot) {
                          // If total pages small, just show all
                          if (tot <= 5) return Array.from({ length: tot }, (_, i) => i + 1);
                          if (cur === 1) return [1, 2, 3].filter(p => p <= tot);
                          if (cur === 2) return [1, 2, 3, 4].filter(p => p <= tot);
                          // From page 3, use centered sliding window of max 5
                          let start = cur - 2;
                          let end = cur + 2;
                          if (end > tot) {
                            end = tot;
                            start = Math.max(1, tot - 4);
                          }
                          if (start < 1) start = 1;
                          const out = [];
                          for (let p = start; p <= end; p++) out.push(p);
                          return out;
                        }

                        const pages = getPages(current, total);

                        return pages.map((p) => {
                          const isActive = p === current;
                          return (
                            <button
                              key={p}
                              onClick={() => handlePageChange(p)}
                              className={`pagination__page ${isActive ? 'is-active' : ''}`}
                              aria-current={isActive ? 'page' : undefined}
                            >
                              {p}
                            </button>
                          );
                        });
                      })()}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.next}
                      className="pagination__nav"
                      aria-label="Next page"
                    >
                      →
                    </button>
                  </div>
                )} 
            </div>
          ) : (
            <div className="category-empty">
              <p>No articles found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Category;
