import PropTypes from 'prop-types';
import { ArticleCard, ArticleCardCompact } from '../components/ArticleCard/ArticleCard';
import './MasonryLayout.css';

/**
 * Masonry Layout Component
 * 
 * Layout with a main content area and a sidebar
 * Main area: Grid of articles
 * Sidebar: List of compact articles
 */
function MasonryLayout({ 
  articles, 
  mainColumns = 3, 
}) {
  if (!articles || articles.length === 0) {
    return (
      <div className="layout-empty">
        <p>No articles available</p>
      </div>
    );
  }

  const selectedArticls = articles.slice(0, 6);

  return (
    <div className="masonry-layout">
      {/* Main content area */}
      <div className="masonry-layout__main">
        <div className={`masonry-layout__grid masonry-layout__grid--${mainColumns}-col`}>
          {selectedArticls.map((article) => (
            <ArticleCard key={article.id} article={article} showExcerpt={false} />
          ))}
        </div>
      </div>

      
    </div>
  );
}

MasonryLayout.propTypes = {
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
  mainColumns: PropTypes.oneOf([2, 3]),
};

export default MasonryLayout;
