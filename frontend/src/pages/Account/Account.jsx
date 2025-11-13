import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { articlesAPI, socialPostsAPI } from '../../services/api';
import { ArticleCard } from '../../components/ArticleCard/ArticleCard';
import { getProxiedImageUrl } from '../../utils/imageProxy';
import './Account.css';

function Account() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [likedArticles, setLikedArticles] = useState([]);
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [socialPosts, setSocialPosts] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: ''
  });
  const [saving, setSaving] = useState(false);

  // Get backend URL from environment variable
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  // Check if user is admin or superuser
  const isAdmin = user?.is_staff || user?.is_superuser;
  const isSuperuser = user?.is_superuser;
  const isSocialManager = user?.is_social_manager || user?.is_superuser;

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'liked') {
      loadLikedArticles();
    } else if (activeTab === 'bookmarks') {
      loadBookmarkedArticles();
    } else if (activeTab === 'admin' && isSocialManager) {
      setSelectedPlatform(null); // Reset platform view when entering admin panel
      loadSocialPosts();
    }
  }, [activeTab]);

  async function loadLikedArticles() {
    setLoading(true);
    try {
      const response = await articlesAPI.getMyLiked();
      setLikedArticles(response.data);
    } catch (error) {
      console.error('Error loading liked articles:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadBookmarkedArticles() {
    setLoading(true);
    try {
      const response = await articlesAPI.getMyBookmarks();
      setBookmarkedArticles(response.data);
    } catch (error) {
      console.error('Error loading bookmarked articles:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadSocialPosts() {
    setLoading(true);
    try {
      const posts = await socialPostsAPI.getPendingPosts();
      setSocialPosts(posts);
    } catch (error) {
      console.error('Error loading social posts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSharePost(post, platformKey) {
    try {
      const articleUrl = `${window.location.origin}/article/${post.article_slug}`;
      // Use only the caption content (URL is already included in caption)
      const shareText = post.caption || post.article_title;
      let shareUrl = '';

      // Build platform-specific share URL
      switch (platformKey) {
        case 'twitter':
          // Caption already includes the URL, so just pass the caption
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
          break;
        case 'facebook':
          // For Facebook, extract URL from caption if present, otherwise use article URL
          const urlMatch = shareText.match(/https?:\/\/[^\s]+/);
          const fbUrl = urlMatch ? urlMatch[0] : articleUrl;
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fbUrl)}`;
          break;
        case 'linkedin':
          // For LinkedIn, extract URL from caption if present, otherwise use article URL
          const linkedinUrlMatch = shareText.match(/https?:\/\/[^\s]+/);
          const linkedinUrl = linkedinUrlMatch ? linkedinUrlMatch[0] : articleUrl;
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(linkedinUrl)}`;
          break;
        case 'whatsapp':
          // Caption already includes the URL, so just pass the caption
          shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
          break;
        case 'instagram':
          // Instagram doesn't support web sharing URLs, open article instead
          window.open(articleUrl, '_blank');
          alert('Please share this article manually on Instagram. The article has been opened in a new tab.');
          break;
        default:
          window.open(articleUrl, '_blank');
          break;
      }

      // Open share dialog
      if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }
      
      // Mark as posted
      await socialPostsAPI.markAsPosted(post.id);
      
      // Reload social posts and get the updated list
      const updatedPosts = await socialPostsAPI.getPendingPosts();
      setSocialPosts(updatedPosts);
      
      // Check if the current platform still has posts after reload
      if (selectedPlatform) {
        const grouped = groupPostsByPlatform(updatedPosts);
        if (!grouped[selectedPlatform] || grouped[selectedPlatform].posts.length === 0) {
          setSelectedPlatform(null);
        }
      }
    } catch (error) {
      console.error('Error marking post as shared:', error);
      alert('Failed to mark post as shared. Please try again.');
    }
  }

  // Group social posts by platform
  function groupPostsByPlatform(posts) {
    const grouped = {};
    posts.forEach(post => {
      const platform = post.platform_name;
      if (!grouped[platform]) {
        grouped[platform] = {
          key: post.platform_key,
          posts: []
        };
      }
      grouped[platform].posts.push(post);
    });
    return grouped;
  }

  // Get platform icon
  function getPlatformIcon(platformKey) {
    const icons = {
      'facebook': (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      'twitter': (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      'linkedin': (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      'instagram': (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      'whatsapp': (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      )
    };
    return icons[platformKey] || null;
  }

  // Get platform color
  function getPlatformColor(platformKey) {
    const colors = {
      'facebook': '#1877f2',
      'twitter': '#1da1f2',
      'linkedin': '#0a66c2',
      'instagram': '#e4405f',
      'whatsapp': '#25d366'
    };
    return colors[platformKey] || '#667eea';
  }

  function handleLogout() {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  }

  function handleEditToggle() {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reset to original values if canceling
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || ''
      });
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    try {
      // For now, just simulate saving
      // In production, you'd call an API endpoint like:
      // await authAPI.updateProfile(profileData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="account-page">
      <div className="account-container">
        <div className="account-sidebar">
          <div className="account-user-info">
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h2>{user?.username}</h2>
            <p className="user-email">{user?.email}</p>
            {isAdmin && (
              <div className="admin-badge-container">
                <span className={`admin-badge ${isSuperuser ? 'superuser' : ''}`}>
                  {isSuperuser ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                      Superuser
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                      </svg>
                      Admin
                    </>
                  )}
                </span>
              </div>
            )}
          </div>

          <nav className="account-nav">
            <button
              className={`account-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Profile</span>
            </button>
            
            <button
              className={`account-nav-item ${activeTab === 'liked' ? 'active' : ''}`}
              onClick={() => setActiveTab('liked')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span>Liked Articles</span>
            </button>
            
            <button
              className={`account-nav-item ${activeTab === 'bookmarks' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookmarks')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>Bookmarked Articles</span>
            </button>
            
            {isAdmin && (
              <button
                className={`account-nav-item ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => setActiveTab('admin')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="9" x2="15" y2="9"></line>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
                <span>Admin Panel</span>
              </button>
            )}
            
            <button className="account-nav-item logout" onClick={handleLogout}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Logout</span>
            </button>
          </nav>
        </div>

        <div className="account-content">
          {activeTab === 'profile' && (
            <div className="account-section">
              <h1 className="section-title">Profile Information</h1>
              
              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="profile-edit-form">
                  <div className="profile-info-grid">
                    <div className="info-item">
                      <label>Username</label>
                      <input
                        type="text"
                        name="username"
                        value={profileData.username}
                        onChange={handleInputChange}
                        className="profile-input"
                        required
                      />
                    </div>
                    
                    <div className="info-item">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        className="profile-input"
                        required
                      />
                    </div>
                    
                    <div className="info-item">
                      <label>First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        value={profileData.first_name}
                        onChange={handleInputChange}
                        className="profile-input"
                        placeholder="Enter first name"
                      />
                    </div>
                    
                    <div className="info-item">
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        value={profileData.last_name}
                        onChange={handleInputChange}
                        className="profile-input"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  <div className="profile-actions">
                    <button type="button" className="cancel-btn" onClick={handleEditToggle}>
                      Cancel
                    </button>
                    <button type="submit" className="save-btn" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="profile-info-grid">
                    <div className="info-item">
                      <label>Username</label>
                      <p>{user?.username}</p>
                    </div>
                    
                    <div className="info-item">
                      <label>Email</label>
                      <p>{user?.email}</p>
                    </div>
                    
                    <div className="info-item">
                      <label>First Name</label>
                      <p>{user?.first_name || 'Not set'}</p>
                    </div>
                    
                    <div className="info-item">
                      <label>Last Name</label>
                      <p>{user?.last_name || 'Not set'}</p>
                    </div>
                  </div>

                  <button className="edit-profile-btn" onClick={handleEditToggle}>
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          )}

          {activeTab === 'liked' && (
            <div className="account-section">
              <h1 className="section-title">
                Liked Articles ({likedArticles.length})
              </h1>
              
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading liked articles...</p>
                </div>
              ) : likedArticles.length === 0 ? (
                <div className="empty-state">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <h3>No liked articles yet</h3>
                  <p>Start liking articles to see them here</p>
                  <Link to="/" className="browse-btn">Browse Articles</Link>
                </div>
              ) : (
                <div className="articles-grid">
                  {likedArticles.map(like => (
                    <ArticleCard 
                      key={like.id} 
                      article={{
                        id: like.article,
                        title: like.article_title,
                        slug: like.article_slug,
                        excerpt: like.article_excerpt,
                        featured_image: like.article_image,
                        category: { name: like.article_category },
                        created_at: like.created_at
                      }} 
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookmarks' && (
            <div className="account-section">
              <h1 className="section-title">
                Bookmarked Articles ({bookmarkedArticles.length})
              </h1>
              
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading bookmarked articles...</p>
                </div>
              ) : bookmarkedArticles.length === 0 ? (
                <div className="empty-state">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <h3>No bookmarked articles yet</h3>
                  <p>Start bookmarking articles to read them later</p>
                  <Link to="/" className="browse-btn">Browse Articles</Link>
                </div>
              ) : (
                <div className="articles-grid">
                  {bookmarkedArticles.map(bookmark => (
                    <ArticleCard 
                      key={bookmark.id} 
                      article={{
                        id: bookmark.article,
                        title: bookmark.article_title,
                        slug: bookmark.article_slug,
                        excerpt: bookmark.article_excerpt,
                        featured_image: bookmark.article_image,
                        category: bookmark.article_category ? { name: bookmark.article_category } : null,
                        created_at: bookmark.created_at
                      }} 
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'admin' && isAdmin && (
            <div className="account-section">
              <h1 className="section-title">
                Admin Panel
                {isSuperuser && <span className="superuser-indicator"> (Superuser Access)</span>}
              </h1>
              
              <div className="admin-dashboard">
                {/* Admin Level Info */}
                <div className="admin-level-card">
                  <div className="admin-level-header">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                    </svg>
                    <div>
                      <h3>Your Admin Level</h3>
                      <p className="admin-level-type">{isSuperuser ? 'Superuser' : 'Staff Member'}</p>
                    </div>
                  </div>
                  <div className="admin-level-description">
                    {isSuperuser ? (
                      <p>You have full administrative access to all features and settings of the platform.</p>
                    ) : (
                      <p>You have staff-level access to manage content and moderate the platform.</p>
                    )}
                  </div>
                </div>

                {/* Social Posts Management - Only for Social Managers */}
                {isSocialManager && (
                  <div className="social-posts-admin-card">
                    {selectedPlatform === null ? (
                      // Platform Dashboard
                      <>
                        <div className="social-posts-card-header">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"></path>
                            <path d="M12 18h.01"></path>
                            <path d="M9 12h6"></path>
                            <path d="M9 8h6"></path>
                          </svg>
                          <div>
                            <h3>Social Media Posts</h3>
                            <p>Manage and share pending social media posts</p>
                          </div>
                        </div>
                        
                        {loading ? (
                          <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading social posts...</p>
                          </div>
                        ) : socialPosts.length === 0 ? (
                          <div className="empty-state-small">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"></path>
                              <path d="M12 18h.01"></path>
                              <path d="M9 12h6"></path>
                              <path d="M9 8h6"></path>
                            </svg>
                            <p>All caught up! No pending posts.</p>
                          </div>
                        ) : (
                          <div className="platform-dashboard-grid">
                            {Object.entries(groupPostsByPlatform(socialPosts)).map(([platformName, data]) => (
                              <div 
                                key={platformName}
                                className="platform-card"
                                onClick={() => setSelectedPlatform(platformName)}
                                style={{ '--platform-color': getPlatformColor(data.key) }}
                              >
                                <div className="platform-card-icon" style={{ color: getPlatformColor(data.key) }}>
                                  {getPlatformIcon(data.key)}
                                </div>
                                <div className="platform-card-content">
                                  <h3>{platformName}</h3>
                                  <p className="post-count">
                                    {data.posts.length} {data.posts.length === 1 ? 'post' : 'posts'} pending
                                  </p>
                                </div>
                                <div className="platform-card-arrow">
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      // Platform Detail View
                      <>
                        {(() => {
                          const platformData = groupPostsByPlatform(socialPosts)[selectedPlatform];
                          if (!platformData) return null;

                          return (
                            <>
                              <div className="platform-detail-header">
                                <button 
                                  className="back-button"
                                  onClick={() => setSelectedPlatform(null)}
                                >
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                  </svg>
                                  Back to Platforms
                                </button>
                                <div className="platform-detail-title">
                                  <div className="platform-icon" style={{ color: getPlatformColor(platformData.key) }}>
                                    {getPlatformIcon(platformData.key)}
                                  </div>
                                  <div>
                                    <h2>{selectedPlatform}</h2>
                                    <p>{platformData.posts.length} {platformData.posts.length === 1 ? 'post' : 'posts'} pending</p>
                                  </div>
                                </div>
                              </div>

                              <div className="platform-posts">
                                {platformData.posts.map(post => (
                                  <div key={post.id} className="social-post-card">
                                    <div className="post-content">
                                      {post.article_image && (
                                        <img 
                                          src={post.article_image} 
                                          alt={post.article_title} 
                                          className="post-image" 
                                          onError={(e) => {
                                            const img = e.target;
                                            if (!img.dataset.proxied) {
                                              img.dataset.proxied = '1';
                                              img.src = getProxiedImageUrl(img.src);
                                            } else {
                                              img.style.display = 'none';
                                            }
                                          }}
                                        />
                                      )}
                                      <div className="post-details">
                                        <h4>{post.article_title}</h4>
                                        {post.article_excerpt && (
                                          <p className="post-excerpt">{post.article_excerpt.substring(0, 120)}...</p>
                                        )}
                                        <div className="post-meta">
                                          <span className="post-status">{post.status}</span>
                                          <span className="post-date">
                                            {new Date(post.created_at).toLocaleDateString('en-US', {
                                              month: 'short',
                                              day: 'numeric',
                                              year: 'numeric'
                                            })}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="post-actions">
                                      <button 
                                        className="share-now-btn"
                                        onClick={() => handleSharePost(post, platformData.key)}
                                      >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                          <polyline points="15 3 21 3 21 9"></polyline>
                                          <line x1="10" y1="14" x2="21" y2="3"></line>
                                        </svg>
                                        Share Now
                                      </button>
                                      <Link 
                                        to={`/article/${post.article_slug}`}
                                        className="view-article-btn"
                                        target="_blank"
                                      >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                          <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                        View Article
                                      </Link>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </>
                          );
                        })()}
                      </>
                    )}
                  </div>
                )}

                {/* Quick Actions */}
                <div className="admin-quick-actions">
                  <h3>Quick Actions</h3>
                  <div className="admin-actions-grid">
                    <a href={`${BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="admin-action-card">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="9" y1="9" x2="15" y2="9"></line>
                        <line x1="9" y1="15" x2="15" y2="15"></line>
                      </svg>
                      <div>
                        <h4>Django Admin</h4>
                        <p>Access the full admin dashboard</p>
                      </div>
                    </a>

                    <div className="admin-action-card" onClick={() => window.location.href = `${BACKEND_URL}/admin/articles/article/add/`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="12" y1="18" x2="12" y2="12"></line>
                        <line x1="9" y1="15" x2="15" y2="15"></line>
                      </svg>
                      <div>
                        <h4>Create Article</h4>
                        <p>Publish a new article</p>
                      </div>
                    </div>

                    <div className="admin-action-card" onClick={() => window.location.href = `${BACKEND_URL}/admin/articles/article/`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      <div>
                        <h4>Manage Articles</h4>
                        <p>Edit or delete articles</p>
                      </div>
                    </div>

                    <div className="admin-action-card" onClick={() => window.location.href = `${BACKEND_URL}/admin/articles/category/`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                      </svg>
                      <div>
                        <h4>Manage Categories</h4>
                        <p>Add or edit categories</p>
                      </div>
                    </div>

                    {isSuperuser && (
                      <>
                        <div className="admin-action-card" onClick={() => window.location.href = `${BACKEND_URL}/admin/api/user/`}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                          <div>
                            <h4>Manage Users</h4>
                            <p>View and manage all users</p>
                          </div>
                        </div>

                        <div className="admin-action-card" onClick={() => window.location.href = `${BACKEND_URL}/admin/`}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M12 1v6m0 6v6m-6-6h6m6 0h6"></path>
                          </svg>
                          <div>
                            <h4>Site Settings</h4>
                            <p>Configure platform settings</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Admin Permissions */}
                <div className="admin-permissions-card">
                  <h3>Your Permissions</h3>
                  <div className="permissions-list">
                    <div className="permission-item">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Create and publish articles</span>
                    </div>
                    <div className="permission-item">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Edit all articles</span>
                    </div>
                    <div className="permission-item">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Manage categories and tags</span>
                    </div>
                    <div className="permission-item">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Moderate comments</span>
                    </div>
                    {isSuperuser && (
                      <>
                        <div className="permission-item superuser-permission">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>Manage all users and permissions</span>
                        </div>
                        <div className="permission-item superuser-permission">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>Full database access</span>
                        </div>
                        <div className="permission-item superuser-permission">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>Configure site settings</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Account;
