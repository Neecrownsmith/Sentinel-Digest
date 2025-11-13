import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { jobsAPI, jobCategoriesAPI } from '../../services/api';
import { OpportunityCard } from '../../components/OpportunityCard/OpportunityCard';
import logger from '../../utils/logger';
import './Opportunities.css';

function Opportunities() {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    loadOpportunitiesData();
  }, [categorySlug, currentPage]);

  async function loadOpportunitiesData() {
    try {
      setLoading(true);
      setError(null);

      if (categorySlug) {
        // Load specific category data
        const [categoryRes, jobsRes] = await Promise.all([
          jobCategoriesAPI.getCategory(categorySlug),
          jobsAPI.getByCategory(categorySlug, currentPage),
        ]);

        setCategory(categoryRes.data);
        setJobs(jobsRes.data.results || []);
        setPagination({
          count: jobsRes.data.count,
          totalPages: jobsRes.data.total_pages,
          currentPage: jobsRes.data.current_page,
          next: jobsRes.data.next,
          previous: jobsRes.data.previous,
        });
      } else {
        // Load all jobs
        const jobsRes = await jobsAPI.getJobs({ page: currentPage });
        setJobs(jobsRes.data.results || []);
        setPagination({
          count: jobsRes.data.count,
          totalPages: jobsRes.data.total_pages,
          currentPage: jobsRes.data.current_page,
          next: jobsRes.data.next,
          previous: jobsRes.data.previous,
        });
      }
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

  function handlePageChange(page) {
    setSearchParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (loading) {
    return (
      <div className="opportunities-loading">
        <div className="spinner"></div>
        <p>Loading opportunities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="opportunities-error">
        <h2>{error}</h2>
        <p>Please try again later or browse all opportunities.</p>
      </div>
    );
  }

  return (
    <div className="opportunities-page">
      {/* Opportunities Header */}
      <header className="opportunities-header">
        <div className="opportunities-header__container">
          <h1 className="opportunities-header__title">
            {category ? category.name : 'All Opportunities'}
          </h1>
          {category?.description && (
            <p className="opportunities-header__description">{category.description}</p>
          )}
          <div className="opportunities-header__meta">
            <span>{pagination?.count || 0} opportunities available</span>
          </div>
        </div>
      </header>

      {/* Opportunities Grid */}
      <section className="opportunities-content">
        <div className="opportunities-content__container">
          {jobs.length > 0 ? (
            <>
              <div className="opportunities-grid">
                {jobs.map((job) => (
                  <OpportunityCard key={job.id} opportunity={job} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.previous}
                    className="pagination__button"
                  >
                    ← Previous
                  </button>

                  <div className="pagination__info">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.next}
                    className="pagination__button"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="opportunities-empty">
              <p>No opportunities found{category ? ' in this category' : ''}.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

Opportunities.propTypes = {
  // No props needed - uses route params
};

export default Opportunities;
