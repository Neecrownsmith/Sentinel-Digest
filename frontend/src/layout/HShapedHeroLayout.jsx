import PropTypes from 'prop-types';
import { ArticleCard, ArticleCardCompact, ArticleCardVertical } from '../components/ArticleCard/ArticleCard';
import './HShapedHeroLayout.css';

/**
 * H-Shaped Hero Layout Component
 * 
 * Features:
 * - Left vertical bar: 5 compact cards
 * - Center hero: 4 vertical cards in 2x2 grid
 * - Right vertical bar: 5 compact cards
 * - Bottom grid: Additional articles
 * - Two sidebar sections below
 */
function HShapedHeroLayout({ articles }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="layout-empty">
        <p>No articles available</p>
      </div>
    );
  }

  const topArticle = articles[0];
  const leftArticles = articles.slice(1, 6);
  const centerArticles = articles.slice(6, 11);
  const rightArticles = articles.slice(11, 16);  
  const bottomArticle = articles[16];

  return (
    <div className="h-shaped-layout">
      <div className="h-shaped-layout__main">
        {/* H-shaped container */}
        <div className="h-shaped-container">
          {/* H body - left vertical, center section, right vertical */}
          <div className="h-shaped-body">
            {/* Left vertical bar - 3 vertical cards */}
            <div className="h-shaped-left">
              {leftArticles.map((article) => (
                <ArticleCardVertical
                  key={article.id}
                  article={article}
                  showCategory={true}
                />
              ))}
            </div>

            {/* Center section - top card, connecting compact cards, bottom card */}
            <div className="h-shaped-center-container">
              {/* Top hero card */}
              <div className="h-shaped-hero-top">
                <ArticleCard
                  article={topArticle}
                  showCategory={true}
                />
              </div>

              {/* Center connecting bar - compact cards forming the bridge */}
              <div className="h-shaped-center">
                {centerArticles.map((article) => (
                  <ArticleCardCompact
                    key={article.id}
                    article={article}
                    showImage={true}
                    showCategory={false}
                  />
                ))}
              </div>

              {/* Bottom hero card */}
              <div className="h-shaped-hero-bottom">
                <ArticleCard
                  article={bottomArticle}
                  showCategory={true}
                />
              </div>
            </div>

            {/* Right vertical bar - 3 vertical cards */}
            <div className="h-shaped-right">
              {rightArticles.map((article) => (
                <ArticleCardVertical
                  key={article.id}
                  article={article}
                  showCategory={true}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

HShapedHeroLayout.propTypes = {
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      featured_image: PropTypes.string,
      category: PropTypes.object,
      published_date: PropTypes.string,
      reading_time: PropTypes.number,
    })
  ).isRequired,
};

export default HShapedHeroLayout;
