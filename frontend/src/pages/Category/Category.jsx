import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { articlesAPI, categoriesAPI } from '../../services/api';
import { ArticleCard } from '../../components/ArticleCard/ArticleCard';
import './Category.css';

function Category() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    loadCategoryData();
  }, [slug, currentPage]);

  async function loadCategoryData() {
    try {
      setLoading(true);
      setError(null);

      const [categoryRes, articlesRes] = await Promise.all([
        categoriesAPI.getCategory(slug),
        articlesAPI.getByCategory(slug, currentPage),
      ]);

      setCategory(categoryRes.data);
      setArticles(articlesRes.data.results || []);
      setPagination({
        count: articlesRes.data.count,
        totalPages: articlesRes.data.total_pages,
        currentPage: articlesRes.data.current_page,
        next: articlesRes.data.next,
        previous: articlesRes.data.previous,
      });
    } catch (err) {
      console.error('Error loading category:', err);
      setError(err.response?.status === 404 ? 'Category not found' : 'Failed to load category');
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
      <div className="category-loading">
        <div className="spinner"></div>
        <p>Loading category...</p>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="category-error">
        <h2>{error || 'Category not found'}</h2>
      </div>
    );
  }

  return (
    <div className="category-page">
      {/* Category Header */}
      <header className="category-header">
        <div className="category-header__container">
          <h1 className="category-header__title">{category.name}</h1>
          {category.description && (
            <p className="category-header__description">{category.description}</p>
          )}
          <div className="category-header__meta">
            <span>{pagination?.count || 0} articles</span>
          </div>
        </div>
      </header>

      {/* Articles Grid */}
      <section className="category-content">
        <div className="category-content__container">
          {articles.length > 0 ? (
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
          ) : (
            <div className="category-empty">
              <p>No articles found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Category;
