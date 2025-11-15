import PropTypes from 'prop-types';
import { ArticleCard, ArticleCardCompact, ArticleCardVertical } from '../components/ArticleCard/ArticleCard';
import './LShapedHeroLayout.css';

/**
 * L-Shaped Hero Layout Component
 * 
 * Features:
 * - Top horizontal bar: 2 compact cards
 * - Left vertical bar: 5 compact cards
 * - Center hero: 4 vertical cards in 2x2 grid
 * - Bottom grid: Additional articles
 * - Right sidebar: Latest and More Stories sections
 */
function LShapedHeroLayout({ articles }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="layout-empty">
        <p>No articles available</p>
      </div>
    );
  }
  const heroArticles = articles.slice(0, 4);
  const topArticle = articles.slice(4, 6);
  const leftArticles = articles.slice(6, 12);
  

  return (
    <div className="l-shaped-layout">
      {/* L-shaped container */}
      <div className="l-shaped-container">
        {/* Top horizontal bar of L */}
        <div className="l-shaped-top">
          {topArticle.map((article) => (
            <ArticleCardCompact
              key={article.id}
              article={article}
              showImage={true}
              showCategory={false}
            />
          ))}
        </div>

        {/* Bottom section with vertical bar (left) and hero (center) */}
        <div className="l-shaped-bottom">
          {/* Left vertical bar of L */}
          <div className="l-shaped-left">
            {leftArticles.map((article) => (
              <ArticleCardCompact
                key={article.id}
                article={article}
                showImage={true}
                showCategory={false}
              />
            ))}
          </div>

          {/* Center grid - 4 cards (2x2) */}
          <div className="l-shaped-hero">
            {heroArticles.map((article) => (
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
  );
}

LShapedHeroLayout.propTypes = {
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

export default LShapedHeroLayout;
