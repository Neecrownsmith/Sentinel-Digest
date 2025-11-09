import './Footer.css';
import Logo from '../../assets/Sentinel Digest.png';
import { useState } from 'react';
import useScrollToTop from '../../hooks/useScrollToTop';
import useAccordion from '../../hooks/useAccordion';
import useFormInput from '../../hooks/useFormInput';
import Icon from '../common/Icon';
import { footerSections, socialLinks, legalLinks, copyrightText } from '../../config/footer';

function Footer() {
  const [email, handleEmailChange, resetEmail] = useFormInput('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const [showBackToTop, scrollToTop] = useScrollToTop(500);
  const [openSection, toggleSection] = useAccordion(null);

  // Handle newsletter subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    setIsSubscribing(true);
    setSubscribeMessage('');
    
    // Simulate API call
    setTimeout(() => {
      setSubscribeMessage('Thank you for subscribing!');
      resetEmail();
      setIsSubscribing(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setSubscribeMessage(''), 3000);
    }, 1500);
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
                onChange={handleEmailChange}
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
            {socialLinks.map((social) => (
              <a 
                key={social.name}
                href={social.href} 
                className="social-icon" 
                aria-label={social.ariaLabel}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Icon name={social.name.toLowerCase()} size="24px" />
              </a>
            ))}
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
          <Icon name="arrow-up" size="20px" />
        </button>
      )}

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} {copyrightText.split('©')[1] || 'Sentinel Digest'}
          </p>
          <div className="footer-bottom-links">
            {legalLinks.map((link, index) => (
              <span key={link.label}>
                <a href={link.href} className="footer-bottom-link" aria-label={link.label}>
                  {link.label}
                </a>
                {index < legalLinks.length - 1 && <span className="footer-divider" aria-hidden="true">|</span>}
              </span>
            ))}
            <span className="footer-divider" aria-hidden="true">|</span>
            <a href="#" className="footer-bottom-link" aria-label="Accessibility">Accessibility</a>
            <span className="footer-divider" aria-hidden="true">|</span>
            <a href="#" className="footer-bottom-link" aria-label="Do Not Sell My Info">Do Not Sell My Info</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
