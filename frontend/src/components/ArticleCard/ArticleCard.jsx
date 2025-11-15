import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatRelativeTime } from '../../utils/dateUtils';
import { getProxiedImageUrl } from '../../services/api';
import './ArticleCard.css';

// Full-featured article card
function ArticleCard({ article, featured = false, showExcerpt = true }) {
  // Handle featured_image which can be an object or null
  const featuredImageUrl = article.featured_image?.url || article.featured_image;
  const imageAlt = article.featured_image?.alt_text || article.title;
  
  return (
    <article className={`article-card ${featured ? 'article-card--featured' : ''} ${!featuredImageUrl ? 'article-card--no-image' : ''}`}>
      {featuredImageUrl && (
        <Link to={`/article/${article.slug}`} className="article-card__image-link">
          <img 
            src={featuredImageUrl} 
            alt={imageAlt}
            className="article-card__image"
            onError={(e) => {
              const proxiedUrl = getProxiedImageUrl(featuredImageUrl);
              if (proxiedUrl && e.target.src !== proxiedUrl) {
                e.target.src = proxiedUrl;
              } else {
                e.target.closest('.article-card__image-link').style.display = 'none';
                e.target.closest('.article-card').classList.add('article-card--no-image');
              }
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
        
        {showExcerpt && article.excerpt && (
          <p className="article-card__excerpt">{article.excerpt}</p>
        )}
        
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
    <article className={`article-card-compact ${!featuredImageUrl || !showImage ? 'article-card-compact--no-image' : ''}`}>
      {showImage && featuredImageUrl && (
        <Link to={`/article/${article.slug}`} className="article-card-compact__image-link">
          <img 
            src={featuredImageUrl} 
            alt={imageAlt}
            className="article-card-compact__image"
            onError={(e) => {
              const proxiedUrl = getProxiedImageUrl(featuredImageUrl);
              if (proxiedUrl && e.target.src !== proxiedUrl) {
                e.target.src = proxiedUrl;
              } else {
                e.target.closest('.article-card-compact__image-link').style.display = 'none';
                e.target.closest('.article-card-compact').classList.add('article-card-compact--no-image');
              }
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

// Vertical article card (for grid layouts)
function ArticleCardVertical({ article, showCategory = false }) {
  const featuredImageUrl = article.featured_image?.url || article.featured_image;
  const imageAlt = article.featured_image?.alt_text || article.title;
  
  return (
    <article className="article-card-vertical">
      {featuredImageUrl && (
        <Link to={`/article/${article.slug}`} className="article-card-vertical__image-link">
          <img 
            src={featuredImageUrl} 
            alt={imageAlt}
            className="article-card-vertical__image"
            onError={(e) => {
              const proxiedUrl = getProxiedImageUrl(featuredImageUrl);
              if (proxiedUrl && e.target.src !== proxiedUrl) {
                e.target.src = proxiedUrl;
              } else {
                e.target.closest('.article-card-vertical__image-link').style.display = 'none';
              }
            }}
          />
        </Link>
      )}
      
      <div className="article-card-vertical__content">
        {showCategory && article.category && (
          <Link 
            to={`/category/${article.category.slug || article.category_slug}`} 
            className="article-card-vertical__category"
          >
            {article.category.name || article.category}
          </Link>
        )}
        
        <h4 className="article-card-vertical__title">
          <Link to={`/article/${article.slug}`}>
            {article.title}
          </Link>
        </h4>
        
        <div className="article-card-vertical__meta">
          <time className="article-card-vertical__date" dateTime={article.created_at}>
            {formatRelativeTime(article.created_at)}
          </time>
          {article.reading_time && (
            <span className="article-card-vertical__reading-time">{article.reading_time}</span>
          )}
        </div>
      </div>
    </article>
  );
}

// Hero article card (for large featured articles)
function ArticleCardHero({ article, showExcerpt = true }) {
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
              const proxiedUrl = getProxiedImageUrl(featuredImageUrl);
              if (proxiedUrl && e.target.src !== proxiedUrl) {
                e.target.src = proxiedUrl;
              } else {
                e.target.style.display = 'none';
              }
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
          {showExcerpt && article.excerpt && (
            <p className="article-card-hero__excerpt">{article.excerpt}</p>
          )}
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
  featured: PropTypes.bool,
  showExcerpt: PropTypes.bool
};

ArticleCardCompact.propTypes = {
  article: articlePropType.isRequired,
  showImage: PropTypes.bool,
  showCategory: PropTypes.bool
};

ArticleCardVertical.propTypes = {
  article: articlePropType.isRequired,
  showCategory: PropTypes.bool
};

ArticleCardHero.propTypes = {
  article: articlePropType.isRequired,
  showExcerpt: PropTypes.bool
};


export { ArticleCard, ArticleCardCompact, ArticleCardVertical, ArticleCardHero };