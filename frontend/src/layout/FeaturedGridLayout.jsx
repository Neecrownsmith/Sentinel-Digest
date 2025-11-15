import PropTypes from 'prop-types';
import { ArticleCardHero, ArticleCardVertical } from '../components/ArticleCard/ArticleCard';
import './FeaturedGridLayout.css';

/**
 * Featured Grid Layout Component
 * 
 * Layout with one large featured article at the top
 * followed by a grid of regular articles below
 */
function FeaturedGridLayout({ articles, gridColumns = 3 }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="layout-empty">
        <p>No articles available</p>
      </div>
    );
  }

  const featuredArticle = articles[0];
  const remainingArticles = articles.slice(1,7);

  return (
    <div className="featured-grid-layout">
      {/* Featured Article */}
      <div className="featured-grid-layout__hero">
        <ArticleCardHero article={featuredArticle} />
      </div>

      {/* Grid of remaining articles */}
      {remainingArticles.length > 0 && (
        <div className={`featured-grid-layout__grid featured-grid-layout__grid--${gridColumns}-col`}>
          {remainingArticles.map((article) => (
            <ArticleCardVertical key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

FeaturedGridLayout.propTypes = {
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
  gridColumns: PropTypes.oneOf([2, 3, 4]),
};

export default FeaturedGridLayout;
