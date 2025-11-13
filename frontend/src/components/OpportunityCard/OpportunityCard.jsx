import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatRelativeTime } from '../../utils/dateUtils';
import './OpportunityCard.css';

// Full-featured opportunity card
function OpportunityCard({ opportunity, featured = false }) {
  return (
    <article className={`opportunity-card ${featured ? 'opportunity-card--featured' : ''}`}>
      {opportunity.company_logo && (
        <div className="opportunity-card__logo-wrapper">
          <img 
            src={opportunity.company_logo} 
            alt={opportunity.company_name}
            className="opportunity-card__logo"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="opportunity-card__content">
        {opportunity.category && (
          <Link 
            to={`/opportunities/${opportunity.category.slug || opportunity.category_slug}`} 
            className="opportunity-card__category"
          >
            {opportunity.category.name || opportunity.category}
          </Link>
        )}
        
        <h3 className="opportunity-card__title">
          <Link to={`/opportunity/${opportunity.slug}`}>
            {opportunity.role}
          </Link>
        </h3>
        
        <p className="opportunity-card__company">{opportunity.company_name}</p>
        
        {opportunity.description && (
          <p className="opportunity-card__description">
            {opportunity.description.substring(0, 150)}
            {opportunity.description.length > 150 ? '...' : ''}
          </p>
        )}
        
        <div className="opportunity-card__details">
          {opportunity.location && (
            <span className="opportunity-card__detail">
              📍 {opportunity.location}
            </span>
          )}
          {opportunity.job_type && (
            <span className="opportunity-card__detail">
              💼 {opportunity.job_type}
            </span>
          )}
          {opportunity.salary && (
            <span className="opportunity-card__detail">
              💰 {opportunity.salary}
            </span>
          )}
        </div>
        
        <div className="opportunity-card__meta">
          <time className="opportunity-card__date" dateTime={opportunity.created_at}>
            Posted {formatRelativeTime(opportunity.created_at)}
          </time>
          {opportunity.deadline && (
            <span className="opportunity-card__deadline">
              Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
            </span>
          )}
        </div>
        
        {opportunity.skills && opportunity.skills.length > 0 && (
          <div className="opportunity-card__skills">
            {opportunity.skills.slice(0, 5).map((skill, index) => (
              <span 
                key={index}
                className="opportunity-card__skill"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

// Compact opportunity card (for sidebars and lists)
function OpportunityCardCompact({ opportunity, showLogo = true, showCategory = true }) {
  return (
    <article className="opportunity-card-compact">
      {showLogo && opportunity.company_logo && (
        <div className="opportunity-card-compact__logo-wrapper">
          <img 
            src={opportunity.company_logo} 
            alt={opportunity.company_name}
            className="opportunity-card-compact__logo"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="opportunity-card-compact__content">
        {showCategory && opportunity.category && (
          <Link 
            to={`/opportunities/${opportunity.category.slug || opportunity.category_slug}`} 
            className="opportunity-card-compact__category"
          >
            {opportunity.category.name || opportunity.category}
          </Link>
        )}
        
        <h4 className="opportunity-card-compact__title">
          <Link to={`/opportunity/${opportunity.slug}`}>
            {opportunity.role}
          </Link>
        </h4>
        
        <p className="opportunity-card-compact__company">{opportunity.company_name}</p>
        
        <time className="opportunity-card-compact__date" dateTime={opportunity.created_at}>
          {formatRelativeTime(opportunity.created_at)}
        </time>
      </div>
    </article>
  );
}

// Hero opportunity card (for large featured opportunities)
function OpportunityCardHero({ opportunity }) {
  return (
    <article className="opportunity-card-hero">
      <Link to={`/opportunity/${opportunity.slug}`} className="opportunity-card-hero__link">
        <div className="opportunity-card-hero__content">
          {opportunity.company_logo && (
            <img 
              src={opportunity.company_logo} 
              alt={opportunity.company_name}
              className="opportunity-card-hero__logo"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          {opportunity.category && (
            <span className="opportunity-card-hero__category">
              {opportunity.category.name || opportunity.category}
            </span>
          )}
          <h2 className="opportunity-card-hero__title">{opportunity.role}</h2>
          <p className="opportunity-card-hero__company">{opportunity.company_name}</p>
          {opportunity.description && (
            <p className="opportunity-card-hero__description">
              {opportunity.description.substring(0, 200)}
              {opportunity.description.length > 200 ? '...' : ''}
            </p>
          )}
          <div className="opportunity-card-hero__meta">
            <time dateTime={opportunity.created_at}>
              {formatRelativeTime(opportunity.created_at)}
            </time>
            {opportunity.location && (
              <span className="opportunity-card-hero__location">📍 {opportunity.location}</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

// PropTypes validation
const opportunityPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  slug: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  company_name: PropTypes.string.isRequired,
  company_logo: PropTypes.string,
  description: PropTypes.string,
  location: PropTypes.string,
  job_type: PropTypes.string,
  salary: PropTypes.string,
  deadline: PropTypes.string,
  skills: PropTypes.arrayOf(PropTypes.string),
  category: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      name: PropTypes.string,
      slug: PropTypes.string
    })
  ]),
  category_slug: PropTypes.string,
  created_at: PropTypes.string.isRequired
});

OpportunityCard.propTypes = {
  opportunity: opportunityPropType.isRequired,
  featured: PropTypes.bool
};

OpportunityCardCompact.propTypes = {
  opportunity: opportunityPropType.isRequired,
  showLogo: PropTypes.bool,
  showCategory: PropTypes.bool
};

OpportunityCardHero.propTypes = {
  opportunity: opportunityPropType.isRequired
};

export { OpportunityCard, OpportunityCardCompact, OpportunityCardHero };
