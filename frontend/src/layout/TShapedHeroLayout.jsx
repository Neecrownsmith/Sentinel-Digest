import PropTypes from 'prop-types';
import { ArticleCardHero, ArticleCardCompact, ArticleCardVertical } from '../components/ArticleCard/ArticleCard';
import './TShapedHeroLayout.css';

/**
 * T-Shaped Hero Layout Component
 * 
 * Features:
 * - Top horizontal bar: 4 compact cards (full width)
 * - Center hero: 4 vertical cards in 2x2 grid
 * - Two side sections flanking the hero
 * - Additional grid below
 */
function TShapedHeroLayout({ articles }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="layout-empty">
        <p>No articles available</p>
      </div>
    );
  }


  const firstArticle = articles[0];
  const heroArticles = articles.slice(1, 3);
  const topArticles = articles.slice(3, 7);
  const leftArticles = articles.slice(7, 10);
  const rightArticles = articles.slice(10, 13);

  return (
    <div className="t-shaped-layout">
      <div className="t-shaped-layout__main">
        {/* T-shaped container */}
        <div className="t-shaped-container">
          {/* Top horizontal bar (the top of T) */}
          <div className="t-shaped-top">
            {topArticles.map((article) => (
              <ArticleCardCompact
                key={article.id}
                article={article}
                showImage={true}
                showCategory={false}
              />
            ))}
          </div>

          {/* Middle section - center stem of T */}
          <div className="t-shaped-middle">
            {/* Left spacer */}
            <div className="t-shaped-side-left">
              {leftArticles.map((article) => (
                <ArticleCardCompact
                  key={article.id}
                  article={article}
                  showImage={true}
                  showCategory={false}
                />
              ))}
            </div>
            <div className="t-shaped-hero-wrapper">
              <div className="t-shaped-hero-1">
                <ArticleCardHero article={firstArticle} />
              </div>
              {/* Center hero - 2 cards (2x1) side by side */}
              <div className="t-shaped-hero">
                {heroArticles.map((article) => (
                  <ArticleCardVertical
                    key={article.id}
                    article={article}
                    showCategory={true}
                  />
                ))}
              </div>
            </div>

            {/* Right spacer */}
            <div className="t-shaped-side-right">
              {rightArticles.map((article) => (
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

TShapedHeroLayout.propTypes = {
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

export default TShapedHeroLayout;
