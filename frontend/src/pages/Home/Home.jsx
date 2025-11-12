import { useState, useEffect } from 'react';
import { articlesAPI } from '../../services/api';
import { ArticleCard, ArticleCardCompact, ArticleCardHero } from '../../components/ArticleCard/ArticleCard';
import './Home.css';

function Home() {
  const [topStories, setTopStories] = useState([]);
  const [trending, setTrending] = useState([]);
  const [mostRead, setMostRead] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHomeData();
  }, []);

  async function loadHomeData() {
    try {
      setLoading(true);
      setError(null);

      const [topStoriesRes, trendingRes, mostReadRes, latestRes] = await Promise.all([
        articlesAPI.getTopStories(),
        articlesAPI.getTrending({ limit: 5 }),
        articlesAPI.getMostRead({ period: 'week', limit: 10 }),
        articlesAPI.getArticles({ page: 1 }),
      ]);

      setTopStories(topStoriesRes.data);
      setTrending(trendingRes.data);
      setMostRead(mostReadRes.data);
      setLatestArticles(latestRes.data.results || []);
    } catch (err) {
      console.error('Error loading home data:', err);
      setError('Failed to load articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

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
    <div className="home">
      {/* Hero Section */}
      {topStories.length > 0 && (
        <section className="home__hero">
          <ArticleCardHero article={topStories[0]} />
        </section>
      )}

      {/* Top Stories Grid */}
      {topStories.length > 1 && (
        <section className="home__top-stories">
          <div className="container">
            <h2 className="section-title">Top Stories</h2>
            <div className="top-stories-grid">
              {topStories.slice(1, 5).map(article => (
                <ArticleCard key={article.id} article={article} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content Grid */}
      <section className="home__main-content">
        <div className="container">
          <div className="main-content-grid">
            {/* Left Column - Latest Articles */}
            <div className="main-content__left">
              <h2 className="section-title">Latest News</h2>
              <div className="articles-grid">
                {latestArticles.slice(0, 6).map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>

            {/* Right Sidebar */}
            <aside className="main-content__sidebar">
              {/* Trending Now */}
              {trending.length > 0 && (
                <div className="sidebar-section">
                  <h3 className="sidebar-title">Trending Now</h3>
                  <div className="sidebar-list">
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

              {/* Most Read */}
              {mostRead.length > 0 && (
                <div className="sidebar-section">
                  <h3 className="sidebar-title">Most Read This Week</h3>
                  <div className="sidebar-list">
                    {mostRead.slice(0, 5).map(article => (
                      <ArticleCardCompact 
                        key={article.id} 
                        article={article}
                        showImage={true}
                        showCategory={true}
                      />
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* More Latest Articles */}
      {latestArticles.length > 6 && (
        <section className="home__more-articles">
          <div className="container">
            <div className="articles-grid">
              {latestArticles.slice(6, 12).map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
