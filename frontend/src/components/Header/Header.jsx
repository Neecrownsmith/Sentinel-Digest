import Logo from '../../assets/Sentinel Digest.png';
import './Header.css';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Focus on search input when opened
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
    } else {
      setSearchQuery('');
    }
  };

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
            <button className="menu-btn" onClick={toggleMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
            </svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
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
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search"
            />
            <button type="submit" className="search-submit-btn" aria-label="Submit search">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </button>
            <button type="button" className="search-close-btn" onClick={toggleSearch} aria-label="Close search">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
              </svg>
            </button>
          </form>
        </div>
      </header>

      <nav className={`header-nav ${isMenuOpen ? 'menu-open' : ''}`}>
        <div className="nav-container">
          <a href="#" className="nav-link">Home</a>
          <a href="#" className="nav-link">News</a>
          <a href="#" className="nav-link">Politics</a>
          <a href="#" className="nav-link">Business</a>
          <a href="#" className="nav-link">Technology</a>
          <a href="#" className="nav-link">Health</a>
          <a href="#" className="nav-link">Education</a>
          <a href="#" className="nav-link">Entertainment</a>
          <a href="#" className="nav-link">Sports</a>
          <a href="#" className="nav-link">International</a>
          <a href="#" className="nav-link">Opinion</a>
          <span className="nav-divider">|</span>
          <a href="#" className="nav-link nav-link-dropdown">
            Jobs 
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
              <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
            </svg>
          </a>
          <a href="#" className="nav-link nav-link-dropdown">
            Games 
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
              <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
            </svg>
          </a>
        </div>
      </nav>
    </>
  );
};

export default Header;
