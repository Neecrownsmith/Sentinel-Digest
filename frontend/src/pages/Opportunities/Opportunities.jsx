import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { jobsAPI, jobCategoriesAPI } from '../../services/api';
import { OpportunityCard, OpportunityCardCompact } from '../../components/OpportunityCard/OpportunityCard';
import { opportunityCategories } from '../../config/navigation';
import logger from '../../utils/logger';
import './Opportunities.css';
import Seo from '../../components/common/Seo';
import { SITE_URL } from '../../utils/env';

const RESULTS_PER_PAGE = 10;
const CLOSING_SOON_LIMIT = 3;

const PINNED_CATEGORIES = opportunityCategories;

const deadlineFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const CATEGORY_SUMMARIES = {
  job: 'Explore curated full-time and contract roles from vetted publishers with an emphasis on high-impact digital and media positions.',
  internship: 'Find structured internship experiences designed to accelerate early career growth across media, tech, and creative industries.',
  graduateprogram: 'Pursue graduate schemes and rotational programs tailored for recent graduates ready to immerse in leadership tracks.',
  bootcamp: 'Discover immersive bootcamps delivering condensed upskilling in analytics, engineering, design, and emerging media tooling.',
  scholarship: 'Unlock scholarships that offset tuition and professional certification costs for storytellers, analysts, and technologists.',
  grant: 'Identify grant funding that backs independent research, investigative storytelling, and mission-driven innovation projects.',
  default: 'Explore recent postings curated for ambitious analysts, storytellers, and operators across digital media and adjacent fields.',
};

function normalizeCategoryKey(input) {
  if (!input) {
    return '';
  }

  const raw = typeof input === 'string' ? input : input.slug || input.name || '';

  let normalized = raw.toString().toLowerCase().trim();
  normalized = normalized.replace(/[^a-z0-9]+/g, '');

  if (normalized.endsWith('s') && normalized.length > 1 && !normalized.endsWith('ss')) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
}

function findPinnedCategory(slug) {
  if (!slug) {
    return null;
  }

  return (
    PINNED_CATEGORIES.find(
      (item) => normalizeCategoryKey(item) === normalizeCategoryKey({ slug })
    ) || null
  );
}

function formatCount(value, fallback = null) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function formatDeadline(dateInput) {
  if (!dateInput) {
    return null;
  }

  const parsed = new Date(dateInput);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return deadlineFormatter.format(parsed);
}

function buildPagination(payload, fallbackCurrentPage) {
  const fallbackCount = Array.isArray(payload?.results)
    ? payload.results.length
    : Array.isArray(payload)
      ? payload.length
      : 0;

  const count = formatCount(payload?.count, fallbackCount);
  const totalPages = Number.isFinite(Number(payload?.total_pages))
    ? Number(payload.total_pages)
    : Math.max(1, Math.ceil(count / RESULTS_PER_PAGE));

  const current = Number.isFinite(Number(payload?.current_page))
    ? Number(payload.current_page)
    : Math.min(Math.max(fallbackCurrentPage, 1), totalPages);

  const hasPrevious = typeof payload?.previous !== 'undefined'
    ? Boolean(payload.previous)
    : current > 1;

  const hasNext = typeof payload?.next !== 'undefined'
    ? Boolean(payload.next)
    : current < totalPages;

  return {
    count,
    totalPages,
    currentPage: current,
    next: hasNext,
    previous: hasPrevious,
  };
}

function getCategorySummary(slug) {
  const key = normalizeCategoryKey({ slug }) || 'default';
  if (CATEGORY_SUMMARIES[key]) {
    return CATEGORY_SUMMARIES[key];
  }
  return CATEGORY_SUMMARIES.default;
}

function pluralizeCategory(categoryName) {
  if (!categoryName) return 'All Opportunities';
  
  const lower = categoryName.toLowerCase();
  
  // Handle special cases
  if (lower === 'opportunity') return 'Opportunities';
  if (lower === 'internship') return 'Internships';
  if (lower === 'scholarship') return 'Scholarships';
  if (lower === 'grant') return 'Grants';
  if (lower === 'bootcamp') return 'Bootcamps';
  if (lower === 'job') return 'Jobs';
  if (lower.includes('program')) return categoryName.replace(/program/i, 'Programs');
  
  // Default: add 's' if not already plural
  if (categoryName.endsWith('s')) return categoryName;
  return `${categoryName}s`;
}

function Opportunities() {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const previousCategorySlug = useRef(categorySlug);

  const [category, setCategory] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [closingSoon, setClosingSoon] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [closingLoading, setClosingLoading] = useState(false);

  const currentPage = useMemo(
    () => Math.max(1, parseInt(searchParams.get('page') || '1', 10)),
    [searchParams],
  );

  useEffect(() => {
    if (previousCategorySlug.current === categorySlug) {
      return;
    }

    previousCategorySlug.current = categorySlug;

    if (!categorySlug) {
      return;
    }

    const currentSearchPage = searchParams.get('page');
    if (!currentSearchPage || currentSearchPage === '1') {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('page');
    setSearchParams(nextParams, { replace: true });
  }, [categorySlug, searchParams, setSearchParams]);

  useEffect(() => {
    loadOpportunities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug, currentPage]);

  useEffect(() => {
    loadClosingSoon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug]);

  async function loadOpportunities() {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        page_size: RESULTS_PER_PAGE,
      };

      if (categorySlug) {
        params.category = categorySlug;
      }

      const jobsPromise = jobsAPI.getJobs(params);

      let categoryData = null;
      if (categorySlug) {
        try {
          const categoryRes = await jobCategoriesAPI.getCategory(categorySlug);
          categoryData = categoryRes.data;
        } catch (categoryErr) {
          if (categoryErr.response?.status === 404) {
            logger.warn('Category not found from API, using pinned metadata when available', {
              categorySlug,
            });
            categoryData = findPinnedCategory(categorySlug);
          } else {
            throw categoryErr;
          }
        }
      }

      const jobsRes = await jobsPromise;
      const fetched = jobsRes?.data?.results ?? jobsRes?.data ?? [];
      setCategory(categoryData);
      setJobs(Array.isArray(fetched) ? fetched : []);
      setPagination(buildPagination(jobsRes?.data, currentPage));
    } catch (err) {
      logger.error('Error loading opportunities', {
        error: err.message,
        categorySlug,
        page: currentPage,
      });
      setError(
        err.response?.status === 404
          ? 'Opportunity category not found'
          : 'Failed to load opportunities'
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadClosingSoon() {
    try {
      setClosingLoading(true);
      const params = {
        page: 1,
        page_size: CLOSING_SOON_LIMIT,
        close_deadline: true,
      };
      if (categorySlug) {
        params.category = categorySlug;
      }

      const res = await jobsAPI.getJobs(params);
      const fetched = res?.data?.results ?? res?.data ?? [];
      setClosingSoon(Array.isArray(fetched) ? fetched.slice(0, CLOSING_SOON_LIMIT) : []);
    } catch (err) {
      logger.warn('Failed to load closing soon opportunities', {
        error: err.message,
        categorySlug,
      });
      setClosingSoon([]);
    } finally {
      setClosingLoading(false);
    }
  }

  function handlePageChange(page) {
    if (!pagination) {
      return;
    }
    const target = Math.max(1, Math.min(page, pagination.totalPages));
    if (target === pagination.currentPage) {
      return;
    }
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', target.toString());
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderPagination() {
    if (!pagination || pagination.totalPages <= 1) {
      return null;
    }

    const { currentPage: activePage, totalPages } = pagination;

    function getPages() {
      const pages = [];
      const showEllipsis = totalPages > 7;

      if (!showEllipsis) {
        // Show all pages if 7 or fewer
        return Array.from({ length: totalPages }, (_, index) => index + 1);
      }

      // Always show first page
      pages.push(1);

      if (activePage <= 3) {
        // Near the start: 1, 2, 3, 4, ..., last
        pages.push(2, 3, 4);
        if (totalPages > 5) pages.push('ellipsis-end');
        pages.push(totalPages);
      } else if (activePage >= totalPages - 2) {
        // Near the end: 1, ..., last-3, last-2, last-1, last
        if (totalPages > 5) pages.push('ellipsis-start');
        pages.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // In the middle: 1, ..., current-1, current, current+1, ..., last
        pages.push('ellipsis-start');
        pages.push(activePage - 1, activePage, activePage + 1);
        pages.push('ellipsis-end');
        pages.push(totalPages);
      }

      return pages;
    }

    const pages = getPages();

    return (
      <div className="opportunities-pagination">
        <button
          onClick={() => handlePageChange(1)}
          disabled={!pagination.previous}
          className="opportunities-pagination__nav opportunities-pagination__nav--first"
          aria-label="First page"
          title="First page"
        >
          ⟪
        </button>
        
        <button
          onClick={() => handlePageChange(activePage - 1)}
          disabled={!pagination.previous}
          className="opportunities-pagination__nav"
          aria-label="Previous page"
          title="Previous page"
        >
          ←
        </button>

        <div className="opportunities-pagination__pages" role="list">
          {pages.map((page, index) => {
            if (typeof page === 'string' && page.startsWith('ellipsis')) {
              return (
                <span
                  key={`${page}-${index}`}
                  className="opportunities-pagination__ellipsis"
                  aria-hidden="true"
                >
                  …
                </span>
              );
            }
            
            const isActive = page === activePage;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`opportunities-pagination__page ${isActive ? 'is-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Page ${page}`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => handlePageChange(activePage + 1)}
          disabled={!pagination.next}
          className="opportunities-pagination__nav"
          aria-label="Next page"
          title="Next page"
        >
          →
        </button>
        
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={!pagination.next}
          className="opportunities-pagination__nav opportunities-pagination__nav--last"
          aria-label="Last page"
          title="Last page"
        >
          ⟫
        </button>
      </div>
    );
  }

  const displayCategoryName = category?.name || category?.title || (categorySlug ? categorySlug.replace(/-/g, ' ') : '');
  const pluralCategory = displayCategoryName ? pluralizeCategory(displayCategoryName) : 'Opportunities';
  const categorySummary = categorySlug ? getCategorySummary(categorySlug) : CATEGORY_SUMMARIES.default;
  const canonicalPath = categorySlug ? `/opportunities/${categorySlug}` : '/opportunities';
  const seoTitle = categorySlug ? pluralCategory : 'Opportunities';

  const jobsSchema = jobs.slice(0, 10)
    .map((job) => {
      if (!job || !job.slug) {
        return null;
      }
      return {
        '@type': 'JobPosting',
        title: job.role,
        description: job.description ? job.description.slice(0, 280) : undefined,
        datePosted: job.created_at,
        validThrough: job.deadline || undefined,
        employmentType: job.job_type || undefined,
        hiringOrganization: job.company_name
          ? {
              '@type': 'Organization',
              name: job.company_name,
              sameAs: job.company_url || undefined,
            }
          : undefined,
        jobLocation: job.location
          ? {
              '@type': 'Place',
              address: {
                '@type': 'PostalAddress',
                addressLocality: job.location,
              },
            }
          : undefined,
        identifier: job.id,
        url: SITE_URL ? `${SITE_URL}/opportunity/${job.slug}` : undefined,
      };
    })
    .filter(Boolean);

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: categorySlug ? `${pluralCategory} | Sentinel Digest` : 'Opportunities | Sentinel Digest',
    description: categorySummary,
    url: SITE_URL ? `${SITE_URL}${canonicalPath}` : undefined,
    mainEntity: jobsSchema,
  };

  const breadcrumbsSchema = {
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
      categorySlug && {
        '@type': 'ListItem',
        position: 3,
        name: pluralCategory,
        item: SITE_URL ? `${SITE_URL}${canonicalPath}` : undefined,
      },
    ].filter(Boolean),
  };

  const seoNode = (
    <Seo
      title={seoTitle}
      description={categorySummary}
      canonicalPath={canonicalPath}
      jsonLd={[collectionSchema, breadcrumbsSchema]}
    />
  );

  if (loading) {
    return (
      <div className="opportunities-loading">
        {seoNode}
        <div className="spinner"></div>
        <p>Loading opportunities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="opportunities-error">
        {seoNode}
        <h2>{error}</h2>
        <p>Please try again later or browse all opportunities.</p>
      </div>
    );
  }

  return (
    <div className="opportunities-page">
      {seoNode}
      <header className="opportunities-header">
        <div className="opportunities-header__container">
          <div className="opportunities-header__title-row">
            <h1 className="opportunities-header__title">
              {category ? pluralCategory : 'All Opportunities'}
            </h1>
            {categorySlug && (
              <Link to="/opportunities" className="opportunities-header__view-all">
                View All Opportunities
              </Link>
            )}
          </div>
          {category?.description && (
            <p className="opportunities-header__description">{category.description}</p>
          )}
          <div className="opportunities-header__meta">
            <span>{formatCount(pagination?.count, 0)} opportunities available</span>
          </div>
        </div>
      </header>

      <section className="opportunities-content">
        <div className="opportunities-content__container">
          <div className="opportunities-layout">
            <div className="opportunities-main">
              {jobs.length > 0 ? (
                <>
                  <div className="opportunities-grid">
                    {jobs.map((job) => (
                      <OpportunityCard key={job.id} opportunity={job} />
                    ))}
                  </div>

                  {pagination && pagination.totalPages > 0 && (
                    <div className="opportunities-pagination-info">
                      Showing {((pagination.currentPage - 1) * RESULTS_PER_PAGE) + 1} - {Math.min(pagination.currentPage * RESULTS_PER_PAGE, pagination.count)} of {pagination.count} opportunities
                    </div>
                  )}

                  {renderPagination()}
                </>
              ) : (
                <div className="opportunities-empty">
                  <p>No opportunities found{category ? ' in this category' : ''}.</p>
                </div>
              )}
            </div>

            <aside className="opportunities-sidebar">
              <div className="opportunities-sidebar__section opportunities-sidebar__section--closing">
                <h3 className="opportunities-sidebar__title">Closing Soon</h3>
                {closingLoading && (
                  <p className="opportunities-sidebar__placeholder">Checking deadlines…</p>
                )}
                {!closingLoading && closingSoon.length === 0 && (
                  <p className="opportunities-sidebar__placeholder">No deadlines within 7 days.</p>
                )}
                {!closingLoading && closingSoon.length > 0 && (
                  <div className="opportunities-closing">
                    {closingSoon.map((job) => (
                      <div key={job.id} className="opportunities-closing__item">
                        <OpportunityCardCompact opportunity={job} showLogo={false} />
                        {job.deadline && (
                          <span className="opportunities-closing__deadline">
                            Due {formatDeadline(job.deadline)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {category && (
                <div className="opportunities-sidebar__section opportunities-sidebar__section--summary">
                  <h3 className="opportunities-sidebar__title">About this category</h3>
                  <p className="opportunities-sidebar__description">
                    {category.description || getCategorySummary(categorySlug)}
                  </p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Opportunities;
