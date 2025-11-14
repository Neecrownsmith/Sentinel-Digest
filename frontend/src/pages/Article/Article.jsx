import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { articlesAPI } from '../../services/api';
import { ArticleCardCompact } from '../../components/ArticleCard/ArticleCard';
import { formatDateTime } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';
import './Article.css';

function Article() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Social engagement state
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // Comments state
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    loadArticle();
    window.scrollTo(0, 0);
  }, [slug]);

  async function loadArticle() {
    try {
      setLoading(true);
      setError(null);

      const articleRes = await articlesAPI.getArticle(slug);
      const articleData = articleRes.data;
      
      setArticle(articleData);
      setLikeCount(articleData.like_count || 0);
      setLiked(articleData.user_has_liked || false);
      setBookmarked(articleData.user_has_bookmarked || false);
      setComments(articleData.comments || []);

      // Load related articles
      if (articleData.id) {
        try {
          const relatedRes = await articlesAPI.getRelated(articleData.id, 5);
          setRelatedArticles(relatedRes.data);
        } catch (relatedErr) {
          console.error('Error loading related articles:', relatedErr);
        }
      }
    } catch (err) {
      console.error('Error loading article:', err);
      setError(err.response?.status === 404 ? 'Article not found' : 'Failed to load article');
    } finally {
      setLoading(false);
    }
  }

  // Social interaction functions
  async function handleLike() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    try {
      const response = await articlesAPI.likeArticle(slug);
      setLiked(response.data.liked);
      setLikeCount(response.data.like_count);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  }

  async function handleBookmark() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    try {
      const response = await articlesAPI.bookmarkArticle(slug);
      setBookmarked(response.data.bookmarked);
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  }

  function handleShare(platform) {
    const url = window.location.href;
    const title = article?.title || 'Article';
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

  async function handleCommentSubmit(e) {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    
    if (!commentText.trim()) {
      alert('Please write a comment');
      return;
    }
    
    setCommentSubmitting(true);
    
    try {
      const response = await articlesAPI.addComment(slug, {
        text: commentText.trim(),
        is_anonymous: isAnonymous
      });
      
      // Add new comment to the list
      setComments([response.data, ...comments]);
      setCommentText('');
      setIsAnonymous(false);
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Failed to post comment. Please try again.');
    } finally {
      setCommentSubmitting(false);
    }
  }

  async function handleDeleteComment(commentId) {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    try {
      await articlesAPI.deleteComment(slug, commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Failed to delete comment. Please try again.');
    }
  }

  function formatCommentDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  function formatArticleContent(content) {
    if (!content) return '';
    
    // Split content into paragraphs and format them
    const paragraphs = content.split('\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      // Check if it's a heading
      if (paragraph.startsWith('#')) {
        const level = paragraph.match(/^#+/)[0].length;
        const text = paragraph.replace(/^#+\s*/, '');
        return `<h${Math.min(level + 1, 6)} class="article-subheading">${formatInlineContent(text)}</h${Math.min(level + 1, 6)}>`;
      }
      
      // Regular paragraph
      return `<p class="article-paragraph">${formatInlineContent(paragraph)}</p>`;
    }).join('');
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
    // This regex looks for http/https URLs not preceded by href="
    text = text.replace(/(?<!href=")(https?:\/\/[^\s<"]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Convert **bold** to <strong>
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Convert *italic* to <em> (but not ** which is already processed)
    text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
    
    return text;
  }

  function formatArticleContentWithImages(content, images) {
    if (!content) return '';
    
    // If no images, return formatted content as before
    if (!images || images.length === 0) {
      return formatArticleContent(content);
    }
    
    // Split content into paragraphs and format them
    const paragraphs = content.split('\n').filter(p => p.trim());
    const totalParagraphs = paragraphs.length;
    
    // Calculate strategic positions for images
    // First image after ~20% of content, then distribute rest evenly
    const imagePositions = [];
    if (images.length === 1) {
      // Single image: place after first 20-25% of content
      imagePositions.push(Math.floor(totalParagraphs * 0.25));
    } else if (images.length === 2) {
      // Two images: after 25% and 65% of content
      imagePositions.push(Math.floor(totalParagraphs * 0.25));
      imagePositions.push(Math.floor(totalParagraphs * 0.65));
    } else {
      // Multiple images: distribute evenly throughout (skip first 15% and last 10%)
      const startPosition = Math.floor(totalParagraphs * 0.15);
      const endPosition = Math.floor(totalParagraphs * 0.9);
      const availableSpace = endPosition - startPosition;
      const spacing = Math.floor(availableSpace / images.length);
      
      for (let i = 0; i < images.length; i++) {
        imagePositions.push(startPosition + (spacing * (i + 1)));
      }
    }
    
    let imageIndex = 0;
    let html = '';
    
    paragraphs.forEach((paragraph, index) => {
      // Add paragraph content
      if (paragraph.startsWith('#')) {
        const level = paragraph.match(/^#+/)[0].length;
        const text = paragraph.replace(/^#+\s*/, '');
        html += `<h${Math.min(level + 1, 6)} class="article-subheading">${formatInlineContent(text)}</h${Math.min(level + 1, 6)}>`;
      } else {
        html += `<p class="article-paragraph">${formatInlineContent(paragraph)}</p>`;
      }
      
      // Insert image if we're at a strategic position
        if (imageIndex < images.length && imagePositions[imageIndex] === index) {
        const image = images[imageIndex];
        const imgSrc = image.url || image.image;
        const imgAlt = image.alt_text || image.caption || '';
        const imgCaption = image.caption || '';
        html += `
          <figure class="article-image-inline">
              <img src="${imgSrc}" alt="${imgAlt}"
                   onerror="if(!this.dataset.proxied){this.dataset.proxied=1;this.src='/api/proxy-image/?url='+encodeURIComponent(this.src);}else{this.style.display='none';}" />
            ${imgCaption ? `<figcaption>${imgCaption}</figcaption>` : ''}
          </figure>
        `;
        imageIndex++;
      }
    });
    
    return html;
  }

  if (loading) {
    return (
      <div className="article-loading">
        <div className="spinner"></div>
        <p>Loading article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-error">
        <h2>{error || 'Article not found'}</h2>
        <Link to="/" className="back-home-button">← Back to Home</Link>
      </div>
    );
  }

  return (
    <article className="article-page">
      {/* Article Header */}
      <header className="article-header">
        <div className="article-header__container">
          {article.category && (
            <Link 
              to={`/category/${article.category.slug}`}
              className="article-header__category"
            >
              {article.category.name}
            </Link>
          )}
          
          <h1 className="article-header__title">{article.title}</h1>
          
          <p className="article-header__excerpt">{article.excerpt}</p>
          
          <div className="article-header__meta">
            <time dateTime={article.created_at}>
              {formatDateTime(article.created_at)}
            </time>
            {article.reading_time && (
              <span className="article-header__reading-time">{article.reading_time}</span>
            )}
            {article.view_count > 0 && (
              <span className="article-header__views">{article.view_count.toLocaleString()} views</span>
            )}
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="article-header__tags">
              {article.tags.map(tag => (
                <Link 
                  key={tag.id}
                  to={`/tag/${tag.slug}`}
                  className="article-header__tag"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Featured Image */}
      {article.featured_image && (
        <div className="article-featured-image">
          <img 
            src={article.featured_image} 
            alt={article.title}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Article Content */}
      <div className="article-content-wrapper">
        <div className="article-content__container">
          <div className="article-content__main">
            {/* Social Engagement Bar */}
            <div className="article-engagement">
              <div className="engagement-actions">
                <button 
                  className={`engagement-btn ${liked ? 'active' : ''}`}
                  onClick={handleLike}
                  aria-label={liked ? 'Unlike' : 'Like'}
                  title={liked ? 'Unlike this article' : 'Like this article'}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path 
                      fill={liked ? '#e74c3c' : 'currentColor'}
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    />
                  </svg>
                  <span>Like</span>
                </button>

                <button 
                  className="engagement-btn"
                  onClick={() => {
                    const commentsSection = document.getElementById('comments-section');
                    commentsSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  aria-label="Comment"
                  title="Jump to comments"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path 
                      fill="currentColor"
                      d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"
                    />
                  </svg>
                  <span>Comment</span>
                </button>

                <button 
                  className={`engagement-btn ${bookmarked ? 'active' : ''}`}
                  onClick={handleBookmark}
                  aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
                  title={bookmarked ? 'Remove bookmark' : 'Bookmark this article'}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path 
                      fill={bookmarked ? '#f39c12' : 'currentColor'}
                      d={bookmarked 
                        ? "M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"
                        : "M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"
                      }
                    />
                  </svg>
                  <span>Bookmark</span>
                </button>

                <button 
                  className="engagement-btn"
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  aria-label="Share"
                  title="Share this article"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path 
                      fill="currentColor"
                      d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
                    />
                  </svg>
                  <span>Share</span>
                </button>
              </div>

              {showShareMenu && (
                <div className="share-menu">
                  <button onClick={() => handleShare('twitter')} className="share-option">
                        <svg viewBox="0 0 24 24" width="20" height="20" className="share-icon-svg">
                          <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        Twitter
                      </button>
                      <button onClick={() => handleShare('facebook')} className="share-option">
                        <svg viewBox="0 0 24 24" width="20" height="20" className="share-icon-svg">
                          <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </button>
                      <button onClick={() => handleShare('linkedin')} className="share-option">
                        <svg viewBox="0 0 24 24" width="20" height="20" className="share-icon-svg">
                          <path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                      </button>
                      <button onClick={() => handleShare('whatsapp')} className="share-option">
                        <svg viewBox="0 0 24 24" width="20" height="20" className="share-icon-svg">
                          <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp
                      </button>
                      <button onClick={() => handleShare('copy')} className="share-option">
                        <svg viewBox="0 0 24 24" width="20" height="20" className="share-icon-svg">
                          <path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                        </svg>
                        Copy Link
                      </button>
                    </div>
                  )}
            </div>

            {/* Article Body */}
            <div 
              className="article-content"
              dangerouslySetInnerHTML={{ __html: formatArticleContentWithImages(article.content, article.images) }}
            />
            
            {/* Additional Images - only show if not already distributed in content */}
            {/* This section is now handled within the content */}

            {/* Comments Section */}
            <div id="comments-section" className="article-comments">
              <h3 className="comments-title">Comments ({comments.length})</h3>
              
              {!isAuthenticated && (
                <div className="comment-auth-notice">
                  <p>You must be <Link to="/login" state={{ from: location }}>logged in</Link> to comment.</p>
                </div>
              )}
              
              {isAuthenticated && (
                <form className="comment-form" onSubmit={handleCommentSubmit}>
                  <div className="comment-form-header">
                    <span className="comment-user">Commenting as <strong>{isAnonymous ? 'Anonymous' : user?.username}</strong></span>
                  </div>

                  <textarea 
                    placeholder="Share your thoughts..."
                    rows="4"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="comment-input"
                    required
                  />
                  
                  <div className="comment-form-footer">
                    <label className="comment-anonymous-checkbox">
                      <input 
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                      />
                      <span>Post as Anonymous</span>
                    </label>
                    
                    <button 
                      type="submit" 
                      className="comment-submit"
                      disabled={commentSubmitting}
                    >
                      {commentSubmitting ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </form>
              )}

              {/* Comments List */}
              <div className="comments-list">
                {comments.length === 0 ? (
                  <p className="no-comments">Be the first to comment on this article!</p>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-header">
                        <div className="comment-author">
                          <div className="author-avatar">
                            {comment.is_anonymous ? 'A' : (comment.username?.charAt(0).toUpperCase() || '?')}
                          </div>
                          <div className="author-info">
                            <span className="author-name">
                              {comment.display_name || comment.username || 'Anonymous'}
                            </span>
                            <span className="comment-time">{formatCommentDate(comment.created_at)}</span>
                          </div>
                        </div>
                        {isAuthenticated && user?.id === comment.user?.id && (
                          <button 
                            className="comment-delete"
                            onClick={() => handleDeleteComment(comment.id)}
                            title="Delete comment"
                          >
                            ×
                          </button>
                        )}
                      </div>
                      <div className="comment-body">
                        <p>{comment.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="article-sidebar">
            {relatedArticles.length > 0 && (
              <div className="sidebar-section">
                <h3 className="sidebar-title">Related Articles</h3>
                <div className="sidebar-list">
                  {relatedArticles.map(relatedArticle => (
                    <ArticleCardCompact 
                      key={relatedArticle.id}
                      article={relatedArticle}
                      showImage={true}
                      showCategory={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </article>
  );
}

export default Article;
