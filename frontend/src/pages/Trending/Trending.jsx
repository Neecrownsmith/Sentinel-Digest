import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { articlesAPI, getProxiedImageUrl } from '../../services/api';
import { formatRelativeTime } from '../../utils/dateUtils';
import { ArticleCard } from '../../components/ArticleCard/ArticleCard';
import { getDailyLayoutsForCategory, getLayoutRequirements } from '../../utils/layoutUtils';
import './Trending.css';
import '../Category/Category.css';

function allocateArticles(all, primarySize, secondarySize) {
  const buffer = Array.isArray(all) ? [...all] : [];
  const output = { primary: [], secondary: [], more: [] };

  if (buffer.length === 0) {
    return output;
  }

  output.primary = buffer.splice(0, Math.min(primarySize, buffer.length));
  output.secondary = buffer.splice(0, Math.min(secondarySize, buffer.length));
  output.more = buffer;

  while (output.primary.length < primarySize && output.more.length) {
    output.primary.push(output.more.shift());
  }

  while (output.secondary.length < secondarySize && output.more.length) {
    output.secondary.push(output.more.shift());
  }

  return output;
}

const TRENDING_LAYOUT_KEY = 'trending';
const MORE_TRENDING_COUNT = 12;

function Trending() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [PrimaryLayout, SecondaryLayout, primaryLayoutName, secondaryLayoutName] = useMemo(() => {
    return getDailyLayoutsForCategory(TRENDING_LAYOUT_KEY);
  }, []);

  const primaryCount = useMemo(() => getLayoutRequirements(primaryLayoutName), [primaryLayoutName]);
  const secondaryCount = useMemo(() => getLayoutRequirements(secondaryLayoutName), [secondaryLayoutName]);

  useEffect(() => {
    loadTrendingArticles();
  }, [primaryCount, secondaryCount]);

  async function loadTrendingArticles() {
    try {
      setLoading(true);
      setError(null);

      const totalNeeded = Math.max(primaryCount + secondaryCount + MORE_TRENDING_COUNT, 24);
      const response = await articlesAPI.getTrending({ limit: totalNeeded });
      const payload = response?.data ?? [];
      const results = Array.isArray(payload?.results) ? payload.results : Array.isArray(payload) ? payload : [];

      setArticles(results);
      setLastUpdated(payload?.generated_at || payload?.updated_at || new Date().toISOString());
    } catch (err) {
      console.error('Error loading trending articles:', err);
      setError('Failed to load trending articles. Please try again later.');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }

  const allocation = useMemo(() => {
    return allocateArticles(articles, primaryCount, secondaryCount);
  }, [articles, primaryCount, secondaryCount]);

  const primaryArticles = allocation.primary;
  const secondaryArticles = allocation.secondary;
  const overflowArticles = allocation.more;
  const sidebarTrending = overflowArticles.slice(0, MORE_TRENDING_COUNT);
  const extraArticles = overflowArticles.slice(MORE_TRENDING_COUNT);
  const updatedDate = useMemo(() => {
    if (!lastUpdated) {
      return null;
    }
    const parsed = new Date(lastUpdated);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [lastUpdated]);

  if (loading) {
    return (
      <div className="trending-loading">
        <div className="spinner"></div>
        <p>Gathering what everyone is reading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trending-error">
        <p>{error}</p>
        <button onClick={loadTrendingArticles} className="trending-retry-button">Retry</button>
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="trending-empty">
        <p>No trending stories available at the moment.</p>
        <Link to="/" className="trending-home-link">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="trending-page category-page">
      <header className="trending-header category-header">
        <div className="category-header__container">
          <h1 className="category-header__title">Trending Stories</h1>
          <p className="category-header__description">
            Real-time highlights from across the Sentinel, updated daily.
          </p>
          <div className="category-header__meta trending-header__meta">
            <span>{articles.length} stories today</span>
            {updatedDate && (
              <time dateTime={updatedDate.toISOString()}>
                Updated {updatedDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </time>
            )}
          </div>
        </div>
      </header>

      <section className="trending-content category-content">
        <div className="trending-content__container category-content__container">
          <div className="trending-layout category-layout">
            <div className="trending-main category-main">
              <div
                className="layout-section"
                data-section="trending-primary"
                data-layout="primary"
                data-layout-name={primaryLayoutName}
              >
                {primaryArticles.length > 0 ? (
                  <PrimaryLayout articles={primaryArticles} />
                ) : (
                  <div className="trending-empty-block">
                    <p>No primary stories right now.</p>
                  </div>
                )}
              </div>

              {secondaryArticles.length > 0 && (
                <div
                  className="layout-section"
                  data-section="trending-secondary"
                  data-layout="secondary"
                  data-layout-name={secondaryLayoutName}
                >
                  <SecondaryLayout articles={secondaryArticles} />
                </div>
              )}

              {extraArticles.length > 0 && (
                <div className="layout-section" data-section="trending-extra">
                  <h2 className="category-section-title">More Trending Coverage</h2>
                  <div className="trending-extra-grid">
                    {extraArticles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="trending-sidebar category-sidebar">
              <div className="trending-sidebar-section category-sidebar-section">
                <h3 className="category-section-title">More Trending</h3>
                <div className="category-sidebar-list">
                  {sidebarTrending.length > 0 ? (
                    sidebarTrending.map((article) => {
                      const featuredImageUrl = article.featured_image?.url || article.featured_image;
                      const imageAlt = article.featured_image?.alt_text || article.title;
                      return (
                        <div key={article.id} className="category-sidebar-item">
                          <Link to={`/article/${article.slug}`} className="category-sidebar-link">
                            {featuredImageUrl && (
                              <img
                                src={featuredImageUrl}
                                alt={imageAlt}
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
                          </Link>
                        </div>
                      );
                    })
                  ) : (
                    <p className="trending-sidebar-empty">Stay tuned for more trending stories.</p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Trending;
