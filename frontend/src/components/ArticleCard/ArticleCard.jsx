import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatRelativeTime } from '../../utils/dateUtils';
import './ArticleCard.css';

// Full-featured article card
function ArticleCard({ article, featured = false }) {
  // Handle featured_image which can be an object or null
  const featuredImageUrl = article.featured_image?.url || article.featured_image;
  const imageAlt = article.featured_image?.alt_text || article.title;
  
  return (
    <article className={`article-card ${featured ? 'article-card--featured' : ''}`}>
      {featuredImageUrl && (
        <Link to={`/article/${article.slug}`} className="article-card__image-link">
          <img 
            src={featuredImageUrl} 
            alt={imageAlt}
            className="article-card__image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </Link>
      )}
      
      <div className="article-card__content">
        {article.category && (
          <Link 
            to={`/category/${article.category.slug || article.category_slug}`} 
            className="article-card__category"
          >
            {article.category.name || article.category}
          </Link>
        )}
        
        <h3 className="article-card__title">
          <Link to={`/article/${article.slug}`}>
            {article.title}
          </Link>
        </h3>
        
        <p className="article-card__excerpt">{article.excerpt}</p>
        
        <div className="article-card__meta">
          <time className="article-card__date" dateTime={article.created_at}>
            {formatRelativeTime(article.created_at)}
          </time>
          {article.reading_time && (
            <span className="article-card__reading-time">{article.reading_time}</span>
          )}
        </div>
        
        {article.tags && article.tags.length > 0 && (
          <div className="article-card__tags">
            {article.tags.slice(0, 3).map(tag => (
              <Link 
                key={tag.id} 
                to={`/tag/${tag.slug}`}
                className="article-card__tag"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

// Compact article card (for sidebars and lists)
function ArticleCardCompact({ article, showImage = true, showCategory = true }) {
  const featuredImageUrl = article.featured_image?.url || article.featured_image;
  const imageAlt = article.featured_image?.alt_text || article.title;
  
  return (
    <article className="article-card-compact">
      {showImage && featuredImageUrl && (
        <Link to={`/article/${article.slug}`} className="article-card-compact__image-link">
          <img 
            src={featuredImageUrl} 
            alt={imageAlt}
            className="article-card-compact__image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </Link>
      )}
      
      <div className="article-card-compact__content">
        {showCategory && article.category && (
          <Link 
            to={`/category/${article.category.slug || article.category_slug}`} 
            className="article-card-compact__category"
          >
            {article.category.name || article.category}
          </Link>
        )}
        
        <h4 className="article-card-compact__title">
          <Link to={`/article/${article.slug}`}>
            {article.title}
          </Link>
        </h4>
        
        <time className="article-card-compact__date" dateTime={article.created_at}>
          {formatRelativeTime(article.created_at)}
        </time>
      </div>
    </article>
  );
}

// Hero article card (for large featured articles)
function ArticleCardHero({ article }) {
  const featuredImageUrl = article.featured_image?.url || article.featured_image;
  const imageAlt = article.featured_image?.alt_text || article.title;
  
  return (
    <article className="article-card-hero">
      <Link to={`/article/${article.slug}`} className="article-card-hero__image-link">
        {featuredImageUrl && (
          <img 
            src={featuredImageUrl} 
            alt={imageAlt}
            className="article-card-hero__image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
        <div className="article-card-hero__overlay">
          {article.category && (
            <span className="article-card-hero__category">
              {article.category.name || article.category}
            </span>
          )}
          <h2 className="article-card-hero__title">{article.title}</h2>
          <p className="article-card-hero__excerpt">{article.excerpt}</p>
          <div className="article-card-hero__meta">
            <time dateTime={article.created_at}>
              {formatRelativeTime(article.created_at)}
            </time>
            {article.reading_time && (
              <span className="article-card-hero__reading-time">{article.reading_time}</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

// PropTypes validation
const articlePropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  excerpt: PropTypes.string,
  featured_image: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      url: PropTypes.string,
      alt_text: PropTypes.string
    })
  ]),
  category: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      name: PropTypes.string,
      slug: PropTypes.string
    })
  ]),
  category_slug: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    slug: PropTypes.string
  })),
  created_at: PropTypes.string.isRequired,
  reading_time: PropTypes.string
});

ArticleCard.propTypes = {
  article: articlePropType.isRequired,
  featured: PropTypes.bool
};

ArticleCardCompact.propTypes = {
  article: articlePropType.isRequired,
  showImage: PropTypes.bool,
  showCategory: PropTypes.bool
};

ArticleCardHero.propTypes = {
  article: articlePropType.isRequired
};

export { ArticleCard, ArticleCardCompact, ArticleCardHero };
