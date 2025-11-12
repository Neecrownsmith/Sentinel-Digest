import './Footer.css';
import Logo from '../../assets/Sentinel-Digest-black-bg.png';
import { useState } from 'react';
import { Link } from 'react-router-dom';
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
          
          {/* Language Selector */}
          <select className="language-selector" aria-label="Select language">
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>

        {/* Dynamic Footer Sections from Config */}
        {Object.entries(footerSections).map(([key, section]) => (
          <div key={key} className={`footer-column ${openSection === key ? 'open' : ''}`}>
            <h3 
              className="footer-column-title" 
              onClick={() => toggleSection(key)}
              role="button"
              tabIndex={0}
              aria-expanded={openSection === key}
            >
              {section.title}
              <span className="accordion-icon">{openSection === key ? '−' : '+'}</span>
            </h3>
            <div className="footer-column-content">
              {section.links.map((link) => (
                link.isRouter ? (
                  <Link 
                    key={link.label} 
                    to={link.href} 
                    className="footer-link" 
                    aria-label={link.label}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a 
                    key={link.label} 
                    href={link.href} 
                    className="footer-link" 
                    aria-label={link.label}
                  >
                    {link.label}
                  </a>
                )
              ))}
            </div>
          </div>
        ))}

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
                <Link to={link.href} className="footer-bottom-link" aria-label={link.label}>
                  {link.label}
                </Link>
                {index < legalLinks.length - 1 && <span className="footer-divider" aria-hidden="true">|</span>}
              </span>
            ))}
            <span className="footer-divider" aria-hidden="true">|</span>
            <Link to="/cookies-settings" className="footer-bottom-link" aria-label="Cookie Settings">Cookie Settings</Link>
            <span className="footer-divider" aria-hidden="true">|</span>
            <Link to="/accessibility" className="footer-bottom-link" aria-label="Accessibility">Accessibility</Link>
            <span className="footer-divider" aria-hidden="true">|</span>
            <Link to="/do-not-sell" className="footer-bottom-link" aria-label="Do Not Sell My Info">Do Not Sell My Info</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
