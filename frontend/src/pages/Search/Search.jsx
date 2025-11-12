import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { articlesAPI } from '../../services/api';
import { ArticleCard } from '../../components/ArticleCard/ArticleCard';
import './Search.css';

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const currentQuery = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    if (currentQuery) {
      performSearch();
    }
  }, [currentQuery, currentPage]);

  async function performSearch() {
    try {
      setLoading(true);
      setError(null);

      const response = await articlesAPI.search(currentQuery, currentPage);
      setArticles(response.data.results || []);
      setPagination({
        count: response.data.count,
        totalPages: response.data.total_pages,
        currentPage: response.data.current_page,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (err) {
      console.error('Error searching:', err);
      setError('Failed to search articles');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim(), page: '1' });
    }
  }

  function handlePageChange(page) {
    setSearchParams({ q: currentQuery, page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="search-page">
      {/* Search Header */}
      <header className="search-header">
        <div className="search-header__container">
          <h1 className="search-header__title">Search</h1>
          
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="search-form__input"
            />
            <button type="submit" className="search-form__button">
              Search
            </button>
          </form>
          
          {currentQuery && (
            <div className="search-header__info">
              {loading ? (
                <span>Searching...</span>
              ) : (
                <span>
                  {pagination?.count || 0} result{pagination?.count !== 1 ? 's' : ''} for "{currentQuery}"
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Search Results */}
      <section className="search-content">
        <div className="search-content__container">
          {loading ? (
            <div className="search-loading">
              <div className="spinner"></div>
              <p>Searching...</p>
            </div>
          ) : error ? (
            <div className="search-error">
              <p>{error}</p>
            </div>
          ) : currentQuery && articles.length > 0 ? (
            <>
              <div className="articles-grid">
                {articles.map(article => (
                  <ArticleCard key={article.id} article={article} />
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
          ) : currentQuery ? (
            <div className="search-empty">
              <p>No articles found for "{currentQuery}"</p>
              <p className="search-empty__hint">Try different keywords or check your spelling</p>
            </div>
          ) : (
            <div className="search-empty">
              <p>Enter a search query to find articles</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Search;
