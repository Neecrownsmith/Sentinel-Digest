import PropTypes from 'prop-types';
import { ArticleCard, ArticleCardCompact, ArticleCardHero } from '../components/ArticleCard/ArticleCard';
import './OShapedHeroLayout.css';

/**
 * O-Shaped Hero Layout Component
 * 
 * Features:
 * - Center hero: 4 vertical cards in 2x2 grid
 * - Surrounding border of compact cards (top, right, bottom, left)
 * - Additional grid below
 */
function OShapedHeroLayout({ articles }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="layout-empty">
        <p>No articles available</p>
      </div>
    );
  }


  const middleArticles = articles.slice(0, 2);
  const topArticles = articles.slice(2, 6)
  const leftArticles = articles.slice(6, 10);
  const rightArticles = articles.slice(10, 14);
  const bottomArticles = articles.slice(14, 18);

  return (
    <div className="o-shaped-layout">
      <div className="o-shaped-layout__main">
        {/* O-shaped container */}
        <div className="o-shaped-container">
          {/* Top bar */}
          <div className="o-shaped-top">
            {topArticles.map((article) => (
              <ArticleCardCompact
                key={article.id}
                article={article}
                showImage={true}
                showCategory={false}
              />
            ))}
          </div>

          {/* Middle section with left bar, hero, and right bar */}
          <div className="o-shaped-middle">
            {/* Left bar */}
            <div className="o-shaped-left">
              {leftArticles.map((article) => (
                <ArticleCardCompact
                  key={article.id}
                  article={article}
                  showImage={true}
                  showCategory={false}
                />
              ))}
            </div>

            {/* Center hero - 2 cards (1x2) */}
            <div className="o-shaped-hero">
              {middleArticles.map((article) => (
                <ArticleCardHero
                  key={article.id}
                  article={article}
                  showCategory={true}
                />
              ))}
            </div>

            {/* Right bar */}
            <div className="o-shaped-right">
              {rightArticles.slice(12, 16).map((article) => (
                <ArticleCardCompact
                  key={article.id}
                  article={article}
                  showImage={true}
                  showCategory={false}
                />
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="o-shaped-bottom">
            {bottomArticles.map((article) => (
              <ArticleCardCompact
                key={article.id}
                article={article}
                showImage={true}
                showCategory={false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

OShapedHeroLayout.propTypes = {
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

export default OShapedHeroLayout;
