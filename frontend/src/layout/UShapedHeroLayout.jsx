import PropTypes from 'prop-types';
import { ArticleCard, ArticleCardCompact, ArticleCardHero } from '../components/ArticleCard/ArticleCard';
import './UShapedHeroLayout.css';

/**
 * U-Shaped Hero Layout Component
 * 
 * Features:
 * - Left vertical bar: 4 compact cards
 * - Bottom horizontal bar: 4 compact cards
 * - Right vertical bar: 4 compact cards
 * - Center hero: 4 vertical cards in 2x2 grid (top section)
 * - Additional grid below
 */
function UShapedHeroLayout({ articles }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="layout-empty">
        <p>No articles available</p>
      </div>
    );
  }

  return (
    <div className="u-shaped-layout">
      <div className="u-shaped-layout__main">
        {/* U-shaped container */}
        <div className="u-shaped-container">
          {/* Top section with hero */}
          <div className="u-shaped-top">
            {/* Left vertical bar */}
            <div className="u-shaped-left">
              {articles.slice(4, 8).map((article) => (
                <ArticleCardCompact
                  key={article.id}
                  article={article}
                  showImage={true}
                  showCategory={false}
                />
              ))}
            </div>

            {/* Center hero - 3 cards (1x3) stacked vertically */}
            <div className="u-shaped-hero">
              {articles.slice(0, 3).map((article) => (
                <ArticleCardHero
                  key={article.id}
                  article={article}
                  showCategory={true}
                />
              ))}
            </div>

            {/* Right vertical bar */}
            <div className="u-shaped-right">
              {articles.slice(8, 12).map((article) => (
                <ArticleCardCompact
                  key={article.id}
                  article={article}
                  showImage={true}
                  showCategory={false}
                />
              ))}
            </div>
          </div>

          {/* Bottom horizontal bar (base of U) */}
          <div className="u-shaped-bottom">
            {articles.slice(12, 16).map((article) => (
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

UShapedHeroLayout.propTypes = {
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

export default UShapedHeroLayout;
