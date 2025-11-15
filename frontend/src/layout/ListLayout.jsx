import PropTypes from 'prop-types';
import { ArticleCardCompact } from '../components/ArticleCard/ArticleCard';
import './ListLayout.css';

/**
 * List Layout Component
 * 
 * Vertical list layout for displaying articles in compact form
 * Great for sidebars, archive pages, or simple article lists
 */
function ListLayout({ articles, title, showImage = true, showCategory = false }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="layout-empty">
        <p>No articles available</p>
      </div>
    );
  }

  const selectedArticles = articles.slice(0, 5);
  return (
    <div className="list-layout">
      {title && <h3 className="list-layout__title">{title}</h3>}
      <div className="list-layout__items">
        {selectedArticles.map((article) => (
          <ArticleCardCompact
            key={article.id}
            article={article}
            showImage={showImage}
            showCategory={showCategory}
          />
        ))}
      </div>
    </div>
  );
}

ListLayout.propTypes = {
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
  title: PropTypes.string,
  showImage: PropTypes.bool,
  showCategory: PropTypes.bool,
};

export default ListLayout;
