import PropTypes from 'prop-types';
import { ArticleCard, ArticleCardCompact, ArticleCardHero } from '../components/ArticleCard/ArticleCard';
import './CShapedHeroLayout.css';

/**
 * C-Shaped Hero Layout Component
 * 
 * Features:
 * - C-shaped frame made of compact cards
 * - Left vertical bar: compact cards
 * - Top bar: compact cards  
 * - Bottom bar: compact cards
 * - Center area: filled with vertical article cards
 */
function CShapedHeroLayout({ articles }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="layout-empty">
        <p>No articles available</p>
      </div>
    );
  }

  const centerArticles = articles.slice(0, 2);
  const topArticles = articles.slice(2, 4);
  const leftArticles = articles.slice(4, 9);
  const bottomArticles = articles.slice(9, 11);
  


  return (
    <div className="c-shaped-layout">
      <div className="c-shaped-layout__main">
        {/* C-shaped container */}
        <div className="c-shaped-container">
          {/* Top section - Compact cards */}
          <div className="c-shaped-top-wrapper">
            <div className="c-shaped-top">
              {topArticles.map((article) => (
                <ArticleCardCompact
                  key={article.id}
                  article={article}
                  showImage={true}
                  showCategory={false}
                />
              ))}
            </div>
          </div>

          {/* Middle section */}
          <div className="c-shaped-middle">
            {/* Left vertical bar - Compact cards */}
            <div className="c-shaped-left">
              {leftArticles.map((article) => (
                <ArticleCardCompact
                  key={article.id}
                  article={article}
                  showImage={true}
                  showCategory={false}
                />
              ))}
            </div>

            {/* Center hero - Vertical cards fill the space */}
            <div className="c-shaped-hero">
              {centerArticles.map((article) => (
                <ArticleCardHero
                  key={article.id}
                  article={article}
                  showCategory={true}
                  showExcerpt={false}
                />
              ))}
            </div>
          </div>

          {/* Bottom section - Compact cards */}
          <div className="c-shaped-bottom-wrapper">
            <div className="c-shaped-bottom">
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
    </div>
  );
}

CShapedHeroLayout.propTypes = {
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

export default CShapedHeroLayout;
