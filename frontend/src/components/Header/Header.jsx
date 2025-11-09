import Logo from '../../assets/Sentinel Digest.png';
import './Header.css';
import { useEffect } from 'react';
import useToggle from '../../hooks/useToggle';
import useFormInput from '../../hooks/useFormInput';
import Icon from '../common/Icon';
import { navigationLinks } from '../../config/navigation';

const Header = () => {
  const [isMenuOpen, toggleMenu] = useToggle(false);
  const [isSearchOpen, toggleSearch, , closeSearch] = useToggle(false);
  const [searchQuery, handleSearchChange, resetSearch] = useFormInput('');

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Add your search logic here
      // For example: navigate to search results page
      // window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
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
          
          <div className="logo-container">
            <img src={Logo} alt="Sentinel Digest Logo" className="logo" />
          </div>
          
          <div className="header-actions">
            <button className="cta-btn">Subscribe Now</button>
            <button className="login-btn">LOG IN</button>
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
          <a href="#" className="nav-link">Home</a>
          {navigationLinks.map((link) => (
            <a key={link.id} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
          <span className="nav-divider">|</span>
          <a href="#" className="nav-link nav-link-dropdown">
            Jobs 
            <Icon name="chevron-down" size="12px" />
          </a>
          <a href="#" className="nav-link nav-link-dropdown">
            Games 
            <Icon name="chevron-down" size="12px" />
          </a>
        </div>
      </nav>
    </>
  );
};

export default Header;
