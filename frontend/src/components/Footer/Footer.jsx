import './Footer.css';
import Logo from '../../assets/Sentinel Digest.png';
import { useState, useEffect } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  // Handle newsletter subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    setIsSubscribing(true);
    setSubscribeMessage('');
    
    // Simulate API call
    setTimeout(() => {
      setSubscribeMessage('Thank you for subscribing!');
      setEmail('');
      setIsSubscribing(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setSubscribeMessage(''), 3000);
    }, 1500);
  };

  // Back to top functionality
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show back to top button on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle mobile accordion
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo and Newsletter */}
        <div className="footer-brand">
          <img src={Logo} alt="Sentinel Digest" className="footer-logo" loading="lazy" />
          <p className="footer-tagline">A Modern News Publication</p>
          
          {/* Newsletter Signup Form */}
          <form className="footer-newsletter" onSubmit={handleSubscribe}>
            <h3 className="newsletter-title">Subscribe to our Newsletter</h3>
            <p className="newsletter-description">Get the latest news delivered to your inbox</p>
            <div className="newsletter-input-group">
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="newsletter-input"
                aria-label="Email for newsletter"
              />
              <button 
                type="submit" 
                className="newsletter-btn"
                disabled={isSubscribing}
                aria-label="Subscribe to newsletter"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            {subscribeMessage && (
              <p className="newsletter-message success" role="status" aria-live="polite">
                {subscribeMessage}
              </p>
            )}
          </form>

          <button className="footer-subscribe-btn" aria-label="Subscribe for unlimited access">
            Subscribe for unlimited access
          </button>
          <a href="#" className="footer-link" aria-label="View site map">Site Map</a>
          
          {/* Language Selector */}
          <select className="language-selector" aria-label="Select language">
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>

        {/* Services Column */}
        <div className={`footer-column ${openSection === 'services' ? 'open' : ''}`}>
          <h3 
            className="footer-column-title" 
            onClick={() => toggleSection('services')}
            role="button"
            tabIndex={0}
            aria-expanded={openSection === 'services'}
          >
            Our Services
            <span className="accordion-icon">{openSection === 'services' ? '−' : '+'}</span>
          </h3>
          <div className="footer-column-content">
            <a href="#" className="footer-link" aria-label="eNewspaper">eNewspaper</a>
            <a href="#" className="footer-link" aria-label="Find/Post Jobs">Find/Post Jobs</a>
            <a href="#" className="footer-link" aria-label="Place an Ad">Place an Ad</a>
            <a href="#" className="footer-link" aria-label="Media Kit">Media Kit</a>
            <a href="#" className="footer-link" aria-label="Invest Now">Invest Now</a>
          </div>
        </div>

        {/* Features Column */}
        <div className={`footer-column ${openSection === 'features' ? 'open' : ''}`}>
          <h3 
            className="footer-column-title" 
            onClick={() => toggleSection('features')}
            role="button"
            tabIndex={0}
            aria-expanded={openSection === 'features'}
          >
            Features
            <span className="accordion-icon">{openSection === 'features' ? '−' : '+'}</span>
          </h3>
          <div className="footer-column-content">
            <a href="#" className="footer-link" aria-label="Crossword">Crossword</a>
            <a href="#" className="footer-link" aria-label="Obituaries">Obituaries</a>
            <a href="#" className="footer-link" aria-label="Recipes">Recipes</a>
            <a href="#" className="footer-link" aria-label="Guides">Guides</a>
            <a href="#" className="footer-link" aria-label="Store">Store</a>
          </div>
        </div>

        {/* Company Column */}
        <div className={`footer-column ${openSection === 'company' ? 'open' : ''}`}>
          <h3 
            className="footer-column-title" 
            onClick={() => toggleSection('company')}
            role="button"
            tabIndex={0}
            aria-expanded={openSection === 'company'}
          >
            Company
            <span className="accordion-icon">{openSection === 'company' ? '−' : '+'}</span>
          </h3>
          <div className="footer-column-content">
            <a href="#" className="footer-link" aria-label="About/Contact">About/Contact</a>
            <a href="#" className="footer-link" aria-label="For the Record">For the Record</a>
            <a href="#" className="footer-link" aria-label="Careers">Careers</a>
            <a href="#" className="footer-link" aria-label="Manage Subscription">Manage Subscription</a>
            <a href="#" className="footer-link" aria-label="Reprints and Permissions">Reprints and Permissions</a>
          </div>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h3 className="footer-social-title">Follow Us</h3>
          <div className="footer-social-icons">
            <a href="https://twitter.com" className="social-icon" aria-label="Follow us on Twitter" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
              </svg>
            </a>
            <a href="https://instagram.com" className="social-icon" aria-label="Follow us on Instagram" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
              </svg>
            </a>
            <a href="https://youtube.com" className="social-icon" aria-label="Subscribe to our YouTube channel" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
              </svg>
            </a>
            <a href="https://facebook.com" className="social-icon" aria-label="Like us on Facebook" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button 
          className="back-to-top" 
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
          </svg>
        </button>
      )}

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Sentinel Digest. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <a href="#" className="footer-bottom-link" aria-label="Terms of Service">Terms of Service</a>
            <span className="footer-divider" aria-hidden="true">|</span>
            <a href="#" className="footer-bottom-link" aria-label="Privacy Policy">Privacy Policy</a>
            <span className="footer-divider" aria-hidden="true">|</span>
            <a href="#" className="footer-bottom-link" aria-label="Cookie Settings">Cookie Settings</a>
            <span className="footer-divider" aria-hidden="true">|</span>
            <a href="#" className="footer-bottom-link" aria-label="Accessibility">Accessibility</a>
            <span className="footer-divider" aria-hidden="true">|</span>
            <a href="#" className="footer-bottom-link" aria-label="Do Not Sell My Info">Do Not Sell My Info</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
