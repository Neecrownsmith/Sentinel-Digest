import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ArticleCard } from '../../components/ArticleCard/ArticleCard';
import { articlesAPI } from '../../services/api';
import Seo from '../../components/common/Seo';
import { SITE_URL } from '../../utils/env';
import './Tag.css';

function Tag() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [tagName, setTagName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchTagArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await articlesAPI.getByTag(slug, page);
        setArticles(response.data.results);
        setTotalResults(response.data.count);
        setTotalPages(response.data.total_pages);
        setHasMore(!!response.data.next);
        
        // Extract tag name from first article if available
        if (response.data.results.length > 0) {
          const article = response.data.results[0];
          const tag = article.tags?.find(t => t.slug === slug || t === slug);
          if (tag) {
            setTagName(typeof tag === 'string' ? tag : tag.name);
          } else {
            setTagName(slug.replace(/-/g, ' '));
          }
        } else {
          setTagName(slug.replace(/-/g, ' '));
        }
      } catch (err) {
        console.error('Error fetching tag articles:', err);
        setError('Failed to load articles for this tag. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTagArticles();
    window.scrollTo(0, 0);
  }, [slug, page]);

  useEffect(() => {
    setSearchParams({ page: page.toString() });
  }, [page, setSearchParams]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setPage(page + 1);
    }
  };

  if (loading) {
    return (
      <div className="tag-page">
        <div className="tag-container">
          <div className="loading-spinner">Loading articles...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tag-page">
        <div className="tag-container">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="tag-page">
      <Seo
        title={`Tag: ${tagName || slug}`}
        description={`Explore articles tagged with ${tagName || slug} on Sentinel Digest.`}
        canonicalPath={`/tag/${slug}`}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `Articles tagged ${tagName || slug} | Sentinel Digest`,
            description: `Curated stories tagged ${tagName || slug} from Sentinel Digest.`,
            url: SITE_URL ? `${SITE_URL}/tag/${slug}` : undefined,
          },
          {
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
                name: `Tag: ${tagName || slug}`,
                item: SITE_URL ? `${SITE_URL}/tag/${slug}` : undefined,
              },
            ],
          },
        ]}
      />
      <div className="tag-container">
        <header className="tag-header">
          <div className="tag-badge">
            <span className="tag-icon">#</span>
          </div>
          <h1 className="tag-title">{tagName}</h1>
          <p className="tag-meta">
            {totalResults} {totalResults === 1 ? 'article' : 'articles'} tagged
          </p>
        </header>

        {articles.length > 0 ? (
          <>
            <div className="tag-articles-grid">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="tag-pagination">
                <button
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                  className="pagination-btn"
                >
                  <span>←</span> Previous
                </button>

                <div className="pagination-info">
                  <span className="current-page">Page {page}</span>
                  <span className="page-separator">of</span>
                  <span className="total-pages">{totalPages}</span>
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={!hasMore}
                  className="pagination-btn"
                >
                  Next <span>→</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="tag-empty">
            <div className="empty-icon">#</div>
            <h2>No Articles Found</h2>
            <p>There are no published articles with this tag yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tag;
