import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobsAPI } from '../../services/api';
import { OpportunityCardCompact } from '../../components/OpportunityCard/OpportunityCard';
import { formatDateTime } from '../../utils/dateUtils';
import logger from '../../utils/logger';
import Seo from '../../components/common/Seo';
import { SITE_URL } from '../../utils/env';
import './JobDetail.css';

function JobDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [otherJobs, setOtherJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    loadJob();
    window.scrollTo(0, 0);
  }, [slug]);

  async function loadJob() {
    try {
      setLoading(true);
      setError(null);

      const jobRes = await jobsAPI.getJob(slug);
      setJob(jobRes.data);

      // Load related jobs from same category
      if (jobRes.data.id) {
        try {
          const relatedRes = await jobsAPI.getRelated(slug, 5);
          setRelatedJobs(relatedRes.data);
        } catch (relatedErr) {
          logger.error('Error loading related jobs', { error: relatedErr.message });
        }

        // Load other opportunities (general list)
        try {
          const othersRes = await jobsAPI.getJobs({ page: 1, limit: 8 });
          // Filter out current job
          const filtered = othersRes.data.results?.filter(j => j.id !== jobRes.data.id) || [];
          setOtherJobs(filtered.slice(0, 5));
        } catch (othersErr) {
          logger.error('Error loading other jobs', { error: othersErr.message });
        }
      }
    } catch (err) {
      logger.error('Error loading job', { error: err.message, slug });
      setError(
        err.response?.status === 404
          ? 'Opportunity not found'
          : 'Failed to load opportunity'
      );
    } finally {
      setLoading(false);
    }
  }

  function formatInlineContent(text) {
    if (!text) return '';
    
    // First, escape any HTML to prevent XSS
    text = text.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&#039;');
    
    // Convert markdown-style links [text](url) BEFORE converting plain URLs
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Convert standalone URLs that aren't already in <a> tags
    text = text.replace(/(?<!href=")(https?:\/\/[^\s<"]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Convert **bold** to <strong>
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Convert *italic* to <em> (but not ** which is already processed)
    text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
    
    return text;
  }

  function formatJobContent(content) {
    if (!content) return '';
    
    // Split content into paragraphs and format them
    const paragraphs = content.split('\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph) => {
      // Check if it's a heading (starts with #, ##, ###)
      if (paragraph.startsWith('#')) {
        const level = paragraph.match(/^#+/)[0].length;
        const text = paragraph.replace(/^#+\s*/, '');
        return `<h${Math.min(level + 2, 6)} class="job-subheading">${formatInlineContent(text)}</h${Math.min(level + 2, 6)}>`;
      }
      
      // Check if it's a bullet point
      if (paragraph.match(/^\s*[\*\-]\s+/)) {
        const text = paragraph.replace(/^\s*[\*\-]\s+/, '');
        return `<li class="job-list-item">${formatInlineContent(text)}</li>`;
      }
      
      // Regular paragraph
      return `<p class="job-paragraph">${formatInlineContent(paragraph)}</p>`;
    }).join('');
  }

  function handleShare(platform) {
    const url = window.location.href;
    const title = job?.role || 'Opportunity';
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        setShowShareMenu(false);
        return;
      default:
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      setShowShareMenu(false);
    }
  }

  function handleApply() {
    if (job?.apply_link) {
      window.open(job.apply_link, '_blank');
    } else if (job?.application_link) {
      window.open(job.application_link, '_blank');
    } else {
      alert('Application link not available for this opportunity.');
    }
  }

  if (loading) {
    return (
      <div className="job-loading">
        <div className="spinner"></div>
        <p>Loading opportunity...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-error">
        <h2>{error || 'Opportunity not found'}</h2>
        <button onClick={() => navigate('/opportunities')} className="btn-back">
          Browse All Opportunities
        </button>
      </div>
    );
  }

  const canonicalPath = `/opportunity/${slug}`;
  const jobImage = job.company_logo || job.company_image || '';
  const jobJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.role,
    description: job.description ? job.description.slice(0, 320) : undefined,
    datePosted: job.created_at,
    validThrough: job.deadline || undefined,
    employmentType: job.job_type || undefined,
    jobLocation: job.location
      ? {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: job.location,
          },
        }
      : undefined,
    hiringOrganization: job.company_name
      ? {
          '@type': 'Organization',
          name: job.company_name,
          sameAs: job.company_url || undefined,
          logo: jobImage && SITE_URL ? `${SITE_URL.replace(/\/$/, '')}${jobImage.startsWith('/') ? jobImage : `/${jobImage}`}` : undefined,
        }
      : undefined,
    identifier: job.id,
    url: SITE_URL ? `${SITE_URL}${canonicalPath}` : undefined,
    industry: job.category?.name || undefined,
    baseSalary: job.salary || undefined,
  };

  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL || undefined,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Opportunities',
        item: SITE_URL ? `${SITE_URL}/opportunities` : undefined,
      },
      job.category && {
        '@type': 'ListItem',
        position: 3,
        name: job.category.name,
        item: SITE_URL && job.category.slug ? `${SITE_URL}/opportunities/${job.category.slug}` : undefined,
      },
      {
        '@type': 'ListItem',
        position: job.category ? 4 : 3,
        name: job.role,
        item: SITE_URL ? `${SITE_URL}${canonicalPath}` : undefined,
      },
    ].filter(Boolean),
  };

  const seoNode = (
    <Seo
      title={job.role}
      description={job.description ? job.description.slice(0, 155) : `${job.role} at ${job.company_name}`}
      canonicalPath={canonicalPath}
      image={jobImage}
      type="job"
      jsonLd={[jobJsonLd, breadcrumbsJsonLd]}
    />
  );

  return (
    <div className="job-detail">
      {seoNode}
      {/* Job Header */}
      <header className="job-header">
        <div className="job-header__container">
          {job.company_logo && (
            <div className="job-header__logo">
              <img loading="lazy" decoding="async" src={job.company_logo} alt={job.company_name} />
            </div>
          )}

          {job.category && (
            <Link
              to={`/opportunities/${job.category.slug}`}
              className="job-header__category"
            >
              {job.category.name}
            </Link>
          )}

          <h1 className="job-header__title">{job.role}</h1>
          <p className="job-header__company">{job.company_name}</p>

          <div className="job-header__meta">
            {job.location && (
              <span className="job-meta-item">
                <span className="job-meta-icon">📍</span>
                {job.location}
              </span>
            )}
            {job.job_type && (
              <span className="job-meta-item">
                <span className="job-meta-icon">💼</span>
                {job.job_type}
              </span>
            )}
            {job.salary && (
              <span className="job-meta-item">
                <span className="job-meta-icon">💰</span>
                {job.salary}
              </span>
            )}
            <span className="job-meta-item">
              <span className="job-meta-icon">📅</span>
              Posted {formatDateTime(job.created_at)}
            </span>
            {job.deadline && (
              <span className="job-meta-item job-meta-item--deadline">
                <span className="job-meta-icon">⏰</span>
                Deadline: {new Date(job.deadline).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="job-header__actions">
            <button onClick={handleApply} className="btn-apply">
              Apply Now
            </button>
            <div className="social-actions">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="btn-action btn-share"
                title="Share"
              >
                <span>Share</span>
              </button>

              {showShareMenu && (
                <div className="share-menu">
                  <button onClick={() => handleShare('linkedin')}>LinkedIn</button>
                  <button onClick={() => handleShare('twitter')}>Twitter</button>
                  <button onClick={() => handleShare('facebook')}>Facebook</button>
                  <button onClick={() => handleShare('whatsapp')}>WhatsApp</button>
                  <button onClick={() => handleShare('copy')}>Copy Link</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Job Content */}
      <main className="job-content">
        <div className="job-content__container">
          <div className="job-content__main">
            {/* Description */}
            {job.description && (
              <section className="job-section">
                <h2 className="job-section__title">About this opportunity</h2>
                <div
                  className="job-section__content"
                  dangerouslySetInnerHTML={{ __html: formatJobContent(job.description) }}
                />
              </section>
            )}

            {/* Responsibilities */}
            {job.responsibilities && (
              <section className="job-section">
                <h2 className="job-section__title">Responsibilities</h2>
                <div
                  className="job-section__content"
                  dangerouslySetInnerHTML={{ __html: formatJobContent(job.responsibilities) }}
                />
              </section>
            )}

            {/* Requirements */}
            {job.requirements && (
              <section className="job-section">
                <h2 className="job-section__title">Requirements</h2>
                <div
                  className="job-section__content"
                  dangerouslySetInnerHTML={{ __html: formatJobContent(job.requirements) }}
                />
              </section>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <section className="job-section">
                <h2 className="job-section__title">Required Skills</h2>
                <div className="job-skills">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="job-skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Benefits */}
            {job.benefits && (
              <section className="job-section">
                <h2 className="job-section__title">Benefits</h2>
                <div
                  className="job-section__content"
                  dangerouslySetInnerHTML={{ __html: formatJobContent(job.benefits) }}
                />
              </section>
            )}

            {/* Application Instructions */}
            {job.how_to_apply && (
              <section className="job-section">
                <h2 className="job-section__title">How to Apply</h2>
                <div
                  className="job-section__content"
                  dangerouslySetInnerHTML={{ __html: formatJobContent(job.how_to_apply) }}
                />
              </section>
            )}

            {/* Apply Button Bottom */}
            <div className="job-apply-section">
              <button onClick={handleApply} className="btn-apply btn-apply--large">
                Apply for this position
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="job-content__sidebar">
            {/* More Opportunities in Category */}
            {relatedJobs.length > 0 && (
              <div className="sidebar-section">
                <h3 className="sidebar-section__title">More Opportunities</h3>
                <div className="sidebar-jobs-list">
                  {relatedJobs.map(relatedJob => (
                    <OpportunityCardCompact
                      key={relatedJob.id}
                      opportunity={relatedJob}
                      showLogo={false}
                      showCategory={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other Opportunities */}
            {otherJobs.length > 0 && (
              <div className="sidebar-section">
                <h3 className="sidebar-section__title">Other Opportunities</h3>
                <div className="sidebar-jobs-list">
                  {otherJobs.map(otherJob => (
                    <OpportunityCardCompact
                      key={otherJob.id}
                      opportunity={otherJob}
                      showLogo={false}
                      showCategory={true}
                    />
                  ))}
                </div>
                <Link to="/opportunities" className="sidebar-view-all">
                  Show All Opportunities →
                </Link>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

JobDetail.propTypes = {
  // No props needed - uses route params
};

export default JobDetail;
