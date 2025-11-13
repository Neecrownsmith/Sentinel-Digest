import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../../assets/Sentinel-Digest-white-bg.png';
import './Header.css';
import { useEffect, useRef, useState } from 'react';
import useToggle from '../../hooks/useToggle';
import useFormInput from '../../hooks/useFormInput';
import Icon from '../common/Icon';
import { navigationLinks, opportunityCategories } from '../../config/navigation';
import { useAuth } from '../../context/AuthContext';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, toggleMenu, , closeMenu] = useToggle(false);
  const [isSearchOpen, toggleSearch, , closeSearch] = useToggle(false);
  const [isAccountOpen, toggleAccount, , closeAccount] = useToggle(false);
  const [isOpportunitiesExpanded, setIsOpportunitiesExpanded] = useState(false);
  const [searchQuery, handleSearchChange, resetSearch] = useFormInput('');
  const accountRef = useRef(null);
  
  // Prevent body scroll when mobile nav open
  useEffect(() => {
    if (isMenuOpen && window.innerWidth <= 1190) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [isMenuOpen]);

  // Focus on search input when opened and reset when closed
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
    } else {
      resetSearch();
    }
  }, [isSearchOpen, resetSearch]);

  // Close account dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        closeAccount();
      }
    };

    if (isAccountOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAccountOpen, closeAccount]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      closeSearch();
    }
  };

  const handleLogout = () => {
    logout();
    closeAccount();
    navigate('/');
  };

  const handleAccountNavigate = () => {
    closeAccount();
    navigate('/account');
  };

  const toggleOpportunities = (e) => {
    e.preventDefault();
    setIsOpportunitiesExpanded(!isOpportunitiesExpanded);
  };

  const handleOpportunityClick = () => {
    setIsOpportunitiesExpanded(false);
    closeMenu();
  };

  // Get current date
  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <>
      <header className="header-top">
        <div className="header-container">
          <div className="header-left">
            <button className="menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
              <Icon name="menu" size="24px" />
              <span className="menu-text">Sections</span>
            </button>
            <span className="header-date">{getCurrentDate()}</span>
          </div>
          
          <Link to="/" className="logo-container">
            <img src={Logo} alt="Sentinel Digest Logo" className="logo" />
          </Link>
          
          <div className="header-actions">
            <button className="cta-btn">Subscribe Now</button>
            {isAuthenticated ? (
              <div className="account-dropdown" ref={accountRef}>
                <button className="account-btn" onClick={toggleAccount} aria-label="Account menu">
                  <Icon name="user" size="20px" />
                  <span className="account-username">{user?.username}</span>
                  <Icon name="chevron-down" size="12px" />
                </button>
                {isAccountOpen && (
                  <div className="account-menu">
                    <div className="account-menu-header">
                      <div className="account-avatar">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="account-info">
                        <div className="account-name">{user?.username}</div>
                        <div className="account-email">{user?.email}</div>
                      </div>
                    </div>
                    <div className="account-menu-divider"></div>
                    <button className="account-menu-item" onClick={handleAccountNavigate}>
                      <Icon name="user" size="18px" />
                      <span>My Account</span>
                    </button>
                    <button className="account-menu-item" onClick={handleLogout}>
                      <Icon name="logout" size="18px" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="login-btn" onClick={() => navigate('/login')}>LOG IN</button>
            )}
            <button className="search-btn" onClick={toggleSearch} aria-label="Toggle search">
              <Icon name="search" size="20px" />
            </button>
          </div>
        </div>

        {/* Search Box */}
        <div className={`search-box ${isSearchOpen ? 'search-open' : ''}`}>
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              id="search-input"
              className="search-input"
              placeholder="Search articles, topics, authors..."
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Search"
            />
            <button type="submit" className="search-submit-btn" aria-label="Submit search">
              <Icon name="search" size="20px" />
            </button>
            <button type="button" className="search-close-btn" onClick={closeSearch} aria-label="Close search">
              <Icon name="close" size="20px" />
            </button>
          </form>
        </div>
      </header>

      <nav className={`header-nav ${isMenuOpen ? 'menu-open' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="nav-link">Home</Link>
          {navigationLinks.map((link) => (
            <Link
              key={link.id}
              to={link.href}
              className="nav-link"
              onClick={(e) => {
                // If already on this URL, prevent redundant navigation and just collapse
                if (location.pathname === link.href) {
                  e.preventDefault();
                }
                closeMenu();
                setIsOpportunitiesExpanded(false);
              }}
            >
              {link.label}
            </Link>
          ))}
          <span className="nav-divider">|</span>
          <div className={`nav-menu-item ${isOpportunitiesExpanded ? 'expanded' : ''}`}>
            <button 
              className={`nav-link nav-link-expandable ${isOpportunitiesExpanded ? 'expanded' : ''}`}
              onClick={toggleOpportunities}
            >
              Opportunities
              <Icon name="chevron-down" size="12px" />
            </button>
            <div className="nav-submenu">
              {opportunityCategories.map((category) => (
                <Link 
                  key={category.id} 
                  to={category.href} 
                  className="nav-submenu-item"
                  onClick={(e) => {
                    if (location.pathname === category.href) {
                      e.preventDefault();
                    }
                    handleOpportunityClick();
                  }}
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>
          <a href="#" className="nav-link nav-link-expandable">
            Games 
            <Icon name="chevron-down" size="12px" />
          </a>
        </div>
      </nav>
    </>
  );
}

export default Header;
