import PropTypes from 'prop-types';
import { ArticleCardHero } from '../components/ArticleCard/ArticleCard';
import './HeroGridLayout.css';

/**
 * Grid Layout Component
 * 
 * Simple responsive grid layout for displaying articles
 * Configurable columns: 2, 3, or 4
 */
function HeroGridLayout({ articles, columns = 3, gap = '24px' }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="layout-empty">
        <p>No articles available</p>
      </div>
    );
  }

  const selectedArticles = articles.slice(0, 6); // Limit to first 12 articles for performance

  return (
    <div 
      className={`grid-layout grid-layout--${columns}-col`}
      style={{ gap }}
    >
      {selectedArticles.map((article) => (
        <ArticleCardHero key={article.id} article={article} />
      ))}
    </div>
  );
}

HeroGridLayout.propTypes = {
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
  columns: PropTypes.oneOf([2, 3, 4]),
  gap: PropTypes.string,
};

export default HeroGridLayout;
