import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { articlesAPI, categoriesAPI } from '../../services/api';
import { ArticleCard, ArticleCardCompact, ArticleCardHero } from '../../components/ArticleCard/ArticleCard';
import { getDailyLayoutsForCategory, getLayoutRequirements } from '../../utils/layoutUtils';
import './Home.css';

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

function getCategoryArticleCount(category) {
  if (!category) {
    return 0;
  }

  if (typeof category.article_count === 'number') {
    return category.article_count;
  }

  if (typeof category.articles_count === 'number') {
    return category.articles_count;
  }

  if (typeof category.articleCount === 'number') {
    return category.articleCount;
  }

  return 0;
}

const HOME_LAYOUT_KEY = 'home';
const HOME_MORE_HEADLINES_COUNT = 8;
const CATEGORY_CARD_VARIANTS = [
  'home-category-variant-aurora',
  'home-category-variant-crimson',
  'home-category-variant-amethyst',
  'home-category-variant-dusk',
  'home-category-variant-ocean',
];

function getDailyDateKey() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

function getCategoryCardVariantClass(identifier, ordinal, dateKey) {
  const base = `${dateKey}-${identifier}-${ordinal}`;
  const hash = hashString(base);
  const index = Math.abs(hash) % CATEGORY_CARD_VARIANTS.length;
  return CATEGORY_CARD_VARIANTS[index];
}

function hashString(value) {
  if (!value) {
    return 0;
  }
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function shuffleArrayWithSeed(items, seedKey) {
  if (!Array.isArray(items)) {
    return [];
  }
  const shuffled = [...items];
  let seed = hashString(seedKey) || 123456789;

  function nextRandom() {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  }

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(nextRandom() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function Home() {
  const [topStories, setTopStories] = useState([]);
  const [trending, setTrending] = useState([]);
  const [mostRead, setMostRead] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryHighlights, setCategoryHighlights] = useState([]);
  const categoryVariantDateKey = useMemo(() => getDailyDateKey(), []);

  const [PrimaryLayout, SecondaryLayout, primaryLayoutName, secondaryLayoutName] = useMemo(() => {
    return getDailyLayoutsForCategory(HOME_LAYOUT_KEY);
  }, []);

  const primaryCount = useMemo(() => getLayoutRequirements(primaryLayoutName), [primaryLayoutName]);
  const secondaryCount = useMemo(() => getLayoutRequirements(secondaryLayoutName), [secondaryLayoutName]);

  useEffect(() => {
    loadHomeData();
  }, [primaryCount, secondaryCount]);

  async function loadHomeData() {
    try {
      setLoading(true);
      setError(null);
      setCategoryHighlights([]);

      const layoutArticleCount = Math.max(primaryCount + secondaryCount, 0);
      const totalLatestNeeded = Math.max(layoutArticleCount + HOME_MORE_HEADLINES_COUNT, HOME_MORE_HEADLINES_COUNT);

      const [topStoriesRes, trendingRes, mostReadRes, latestRes] = await Promise.all([
        articlesAPI.getTopStories(),
        articlesAPI.getTrending({ limit: 5 }),
        articlesAPI.getMostRead({ period: 'week', limit: 10 }),
        articlesAPI.getArticles({ page: 1, page_size: totalLatestNeeded }),
      ]);

      const topStoriesData = Array.isArray(topStoriesRes?.data?.results)
        ? topStoriesRes.data.results
        : Array.isArray(topStoriesRes?.data)
          ? topStoriesRes.data
          : [];

      const trendingData = Array.isArray(trendingRes?.data?.results)
        ? trendingRes.data.results
        : Array.isArray(trendingRes?.data)
          ? trendingRes.data
          : [];

      const mostReadData = Array.isArray(mostReadRes?.data?.results)
        ? mostReadRes.data.results
        : Array.isArray(mostReadRes?.data)
          ? mostReadRes.data
          : [];

      let latestData = Array.isArray(latestRes?.data?.results)
        ? [...latestRes.data.results]
        : Array.isArray(latestRes?.data)
          ? [...latestRes.data]
          : [];

      if (latestData.length < totalLatestNeeded) {
        const fallbackPool = [...topStoriesData, ...trendingData, ...mostReadData];
        const seenIds = new Set(latestData.map((article) => article?.id).filter(Boolean));

        for (const article of fallbackPool) {
          if (!article || !article.id || seenIds.has(article.id)) {
            continue;
          }
          latestData.push(article);
          seenIds.add(article.id);
          if (latestData.length >= totalLatestNeeded) {
            break;
          }
        }
      }

      if (latestData.length > totalLatestNeeded) {
        latestData = latestData.slice(0, totalLatestNeeded);
      }

      setTopStories(topStoriesData);
      setTrending(trendingData);
      setMostRead(mostReadData);
      setLatestArticles(latestData);

      await loadCategoryHighlights();
    } catch (err) {
      console.error('Error loading home data:', err);
      setError('Failed to load articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  async function loadCategoryHighlights() {
    try {
      const categoriesRes = await categoriesAPI.getCategories();
      const categoriesRaw = categoriesRes?.data?.results ?? categoriesRes?.data ?? [];
      const categoriesList = Array.isArray(categoriesRaw) ? categoriesRaw : [];

      const sortedCategories = [...categoriesList].sort((a, b) => {
        return getCategoryArticleCount(b) - getCategoryArticleCount(a);
      });

      const shuffledCategories = shuffleArrayWithSeed(
        sortedCategories,
        `home-highlights-${categoryVariantDateKey}`
      );

      const highlightCandidates = shuffledCategories
        .filter((category) => category && category.slug && category.name)
        .slice(0, 4);

      if (highlightCandidates.length === 0) {
        setCategoryHighlights([]);
        return;
      }

      const highlightResponses = await Promise.allSettled(
        highlightCandidates.map((category) => articlesAPI.getByCategory(category.slug, 1, 4))
      );

      const highlights = highlightResponses
        .map((result, index) => {
          if (result.status !== 'fulfilled') {
            return null;
          }

          const payload = result.value?.data;
          const articles = payload?.results ?? payload ?? [];

          if (!Array.isArray(articles) || articles.length === 0) {
            return null;
          }

          return {
            ...highlightCandidates[index],
            articles: articles.slice(0, 4),
          };
        })
        .filter(Boolean);

      setCategoryHighlights(highlights);
    } catch (err) {
      console.warn('Failed to load category highlights', err);
      setCategoryHighlights([]);
    }
  }

  const layoutAllocation = useMemo(() => {
    return allocateArticles(latestArticles, primaryCount, secondaryCount);
  }, [latestArticles, primaryCount, secondaryCount]);

  const primaryArticles = layoutAllocation.primary;
  const secondaryArticles = layoutAllocation.secondary;
  const additionalArticles = layoutAllocation.more;
  const moreHeadlineArticles = additionalArticles.slice(0, HOME_MORE_HEADLINES_COUNT);

  if (loading) {
    return (
      <div className="home-loading">
        <div className="spinner"></div>
        <p>Loading stories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-error">
        <p>{error}</p>
        <button onClick={loadHomeData} className="retry-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="home-page">
      {topStories.length > 0 && (
        <section className="home-hero">
          <div className="home-hero__container">
            <ArticleCardHero article={topStories[0]} />
          </div>
        </section>
      )}

      {topStories.length > 1 && (
        <section className="home-featured">
          <div className="home-featured__container">
            <div className="layout-section" data-section="top-stories">
              <h2 className="home-lead-heading">Top Stories</h2>
              <div className="home-top-stories">
                {topStories.slice(1, 5).map((article) => (
                  <ArticleCard key={article.id} article={article} featured />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="home-content">
        <div className="home-content__container">
          <div className="home-layout">
            <div className="home-main">
              <div
                className="layout-section"
                data-section="latest-primary"
                data-layout="primary"
                data-layout-name={primaryLayoutName}
              >
                <h2 className="home-lead-heading">Latest News</h2>
                {primaryArticles.length > 0 ? (
                  <PrimaryLayout articles={primaryArticles} />
                ) : (
                  <div className="home-empty">
                    <p>No stories available right now.</p>
                  </div>
                )}
              </div>

              {secondaryArticles.length > 0 && (
                <div
                  className="layout-section"
                  data-section="latest-secondary"
                  data-layout="secondary"
                  data-layout-name={secondaryLayoutName}
                >
                  <SecondaryLayout articles={secondaryArticles} />
                </div>
              )}

            </div>

            <aside className="home-sidebar">
              {trending.length > 0 && (
                <div className="home-sidebar-section">
                  <h3 className="home-section-title">Trending Now</h3>
                  <div className="home-sidebar-list">
                    {trending.map((article, index) => (
                      <div key={article.id} className="trending-item">
                        <span className="trending-number">{index + 1}</span>
                        <ArticleCardCompact
                          article={article}
                          showImage={false}
                          showCategory={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {mostRead.length > 0 && (
                <div className="home-sidebar-section">
                  <h3 className="home-section-title">Most Read This Week</h3>
                  <div className="home-sidebar-list home-sidebar-list--most-read">
                    {mostRead.slice(0, 10).map((article) => (
                      <ArticleCardCompact
                        key={article.id}
                        article={article}
                        showImage={true}
                        showCategory={false}
                      />
                    ))}
                  </div>
                </div>
              )}
            </aside>

            {categoryHighlights.length > 0 && (
              <div
                className="layout-section home-category-full"
                data-section="category-highlights"
              >
                <h3 className="home-section-title">Browse by Category</h3>
                <div className="home-category-grid">
                  {categoryHighlights.map((category, index) => {
                    const count = getCategoryArticleCount(category);
                    const variantIdentifier = category.slug || category.id || `category-${index}`;
                    const variantClass = getCategoryCardVariantClass(variantIdentifier, index, categoryVariantDateKey);
                    return (
                      <div
                        key={category.slug || category.id || index}
                        className={`home-category-column ${variantClass}`}
                      >
                        <div className="home-category-header">
                          <Link to={`/category/${category.slug}`} className="home-category-title">
                            {category.name}
                          </Link>
                          {count > 0 && (
                            <span className="home-category-count">{count} stories</span>
                          )}
                        </div>
                        <div className="home-category-stories">
                          {category.articles.map((article) => (
                            <div key={article.id} className="home-category-story">
                              <ArticleCardCompact
                                article={article}
                                showImage={false}
                                showCategory={false}
                              />
                            </div>
                          ))}
                        </div>
                        <Link to={`/category/${category.slug}`} className="home-category-link">
                          View all
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {moreHeadlineArticles.length > 0 && (
        <section className="home-more">
          <div className="home-content__container">
            <div className="layout-section" data-section="more-stories">
              <h3 className="home-section-title">More Headlines</h3>
              <div className="home-articles-grid home-articles-grid--compact">
                {moreHeadlineArticles.slice(0,6).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
