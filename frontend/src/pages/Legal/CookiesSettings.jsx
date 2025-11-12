import { useEffect, useState } from 'react';
import './Legal.css';

function CookiesSettings() {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always true, cannot be disabled
    analytics: true,
    advertising: false,
    preferences: true
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Cookie Settings - Sentinel Digest';
    
    // Load saved cookie preferences from localStorage
    const saved = localStorage.getItem('cookiePreferences');
    if (saved) {
      try {
        setCookiePreferences(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load cookie preferences', e);
      }
    }
  }, []);

  const handleToggle = (category) => {
    if (category === 'essential') return; // Cannot disable essential cookies
    
    const updated = {
      ...cookiePreferences,
      [category]: !cookiePreferences[category]
    };
    setCookiePreferences(updated);
    localStorage.setItem('cookiePreferences', JSON.stringify(updated));
  };

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      advertising: true,
      preferences: true
    };
    setCookiePreferences(allAccepted);
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted));
    alert('All cookies accepted!');
  };

  const rejectNonEssential = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      advertising: false,
      preferences: false
    };
    setCookiePreferences(essentialOnly);
    localStorage.setItem('cookiePreferences', JSON.stringify(essentialOnly));
    alert('Only essential cookies are enabled.');
  };

  return (
    <div className="legal-page">
      <div className="legal-container">
        <header className="legal-header">
          <h1>Cookie Settings & Policy</h1>
          <p className="legal-meta">
            <strong>Last Updated:</strong> November 11, 2025
          </p>
        </header>

        <section className="legal-section">
          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device (computer, tablet, or mobile) when you 
            visit websites. They help websites remember your preferences, recognize you on return visits, 
            and improve your browsing experience.
          </p>
          <p>
            Cookies can be <strong>"session cookies"</strong> (deleted when you close your browser) or 
            <strong>"persistent cookies"</strong> (remain on your device for a set period or until manually deleted).
          </p>
        </section>

        <section className="legal-section">
          <h2>How We Use Cookies</h2>
          <p>Sentinel Digest uses cookies for the following purposes:</p>

          <div className="cookie-category">
            <div className="cookie-category-header">
              <div>
                <h3>1. Essential Cookies (Required)</h3>
                <p className="cookie-description">
                  Necessary for the website to function properly. Cannot be disabled.
                </p>
              </div>
              <label className="cookie-toggle">
                <input
                  type="checkbox"
                  checked={cookiePreferences.essential}
                  disabled
                />
                <span className="toggle-slider disabled"></span>
              </label>
            </div>
            <ul>
              <li><strong>Authentication:</strong> Keep you logged in during your session</li>
              <li><strong>Security:</strong> Prevent cross-site request forgery (CSRF) attacks</li>
              <li><strong>Session Management:</strong> Maintain your browsing session</li>
              <li><strong>Load Balancing:</strong> Distribute server load efficiently</li>
            </ul>
            <p className="cookie-examples">
              <strong>Examples:</strong> sessionid, csrftoken, auth_token
            </p>
          </div>

          <div className="cookie-category">
            <div className="cookie-category-header">
              <div>
                <h3>2. Analytics Cookies (Recommended)</h3>
                <p className="cookie-description">
                  Help us understand how visitors use our site to improve performance and user experience.
                </p>
              </div>
              <label className="cookie-toggle">
                <input
                  type="checkbox"
                  checked={cookiePreferences.analytics}
                  onChange={() => handleToggle('analytics')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <ul>
              <li><strong>Page Views:</strong> Track which articles are most popular</li>
              <li><strong>User Behavior:</strong> Understand navigation patterns and engagement</li>
              <li><strong>Performance Monitoring:</strong> Identify slow-loading pages</li>
              <li><strong>Error Tracking:</strong> Detect and fix technical issues</li>
            </ul>
            <p className="cookie-examples">
              <strong>Examples:</strong> _ga (Google Analytics), _gid, article_views
            </p>
          </div>

          <div className="cookie-category">
            <div className="cookie-category-header">
              <div>
                <h3>3. Advertising Cookies (Optional)</h3>
                <p className="cookie-description">
                  Used to deliver relevant ads and measure campaign effectiveness.
                </p>
              </div>
              <label className="cookie-toggle">
                <input
                  type="checkbox"
                  checked={cookiePreferences.advertising}
                  onChange={() => handleToggle('advertising')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <ul>
              <li><strong>Personalized Ads:</strong> Show ads based on your interests</li>
              <li><strong>Ad Frequency:</strong> Limit how often you see the same ad</li>
              <li><strong>Campaign Tracking:</strong> Measure ad effectiveness</li>
              <li><strong>Retargeting:</strong> Show relevant ads on other websites</li>
            </ul>
            <p className="cookie-examples">
              <strong>Examples:</strong> _fbp (Facebook), ads_prefs, doubleclick
            </p>
            <p className="highlight-box">
              <strong>Note:</strong> Currently, Sentinel Digest does not display third-party advertisements. 
              This category is reserved for future use.
            </p>
          </div>

          <div className="cookie-category">
            <div className="cookie-category-header">
              <div>
                <h3>4. Preference Cookies (Recommended)</h3>
                <p className="cookie-description">
                  Remember your settings and preferences for a personalized experience.
                </p>
              </div>
              <label className="cookie-toggle">
                <input
                  type="checkbox"
                  checked={cookiePreferences.preferences}
                  onChange={() => handleToggle('preferences')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <ul>
              <li><strong>Theme:</strong> Remember your dark/light mode preference</li>
              <li><strong>Language:</strong> Save your language selection</li>
              <li><strong>Layout:</strong> Remember article view preferences (list/grid)</li>
              <li><strong>Filters:</strong> Save your category and tag preferences</li>
            </ul>
            <p className="cookie-examples">
              <strong>Examples:</strong> theme_preference, lang, view_mode
            </p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Manage Your Cookie Preferences</h2>
          <p>
            Use the toggles above to enable or disable specific cookie categories. Your preferences 
            will be saved and applied on future visits.
          </p>
          
          <div className="cookie-actions">
            <button className="btn-accept-all" onClick={acceptAll}>
              Accept All Cookies
            </button>
            <button className="btn-reject-optional" onClick={rejectNonEssential}>
              Reject Non-Essential Cookies
            </button>
          </div>

          <p className="cookie-note">
            <strong>Note:</strong> Disabling certain cookies may affect your experience on Sentinel Digest. 
            For example, without preference cookies, you'll need to re-select your theme each time you visit.
          </p>
        </section>

        <section className="legal-section">
          <h2>Third-Party Cookies</h2>
          <p>Some cookies are set by third-party services we use:</p>
          
          <h3>Google Analytics</h3>
          <ul>
            <li>Tracks page views, sessions, and user demographics</li>
            <li>Privacy Policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
            <li>Opt-out: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a></li>
          </ul>

          <h3>Social Media Platforms</h3>
          <ul>
            <li><strong>Facebook:</strong> Share buttons and social plugins</li>
            <li><strong>Twitter:</strong> Tweet embeds and share functionality</li>
            <li><strong>LinkedIn:</strong> Share buttons</li>
          </ul>
          <p>
            These platforms may set cookies when you interact with their features on our site. 
            Review their privacy policies for more information.
          </p>
        </section>

        <section className="legal-section">
          <h2>Browser-Based Cookie Control</h2>
          <p>
            In addition to our cookie settings, you can manage cookies through your browser. 
            Most browsers allow you to:
          </p>
          <ul>
            <li>View and delete existing cookies</li>
            <li>Block cookies from specific sites</li>
            <li>Block all third-party cookies</li>
            <li>Clear cookies when closing the browser</li>
          </ul>

          <h3>How to Manage Cookies in Popular Browsers:</h3>
          <ul>
            <li>
              <strong>Google Chrome:</strong> Settings → Privacy and Security → Cookies and other site data
              <br />
              <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Chrome Cookie Guide</a>
            </li>
            <li>
              <strong>Mozilla Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data
              <br />
              <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer">Firefox Cookie Guide</a>
            </li>
            <li>
              <strong>Safari:</strong> Preferences → Privacy → Manage Website Data
              <br />
              <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari Cookie Guide</a>
            </li>
            <li>
              <strong>Microsoft Edge:</strong> Settings → Cookies and site permissions
              <br />
              <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Edge Cookie Guide</a>
            </li>
          </ul>

          <p className="highlight-box">
            <strong>Important:</strong> Blocking all cookies may prevent you from using certain features 
            of Sentinel Digest, such as staying logged in or saving preferences.
          </p>
        </section>

        <section className="legal-section">
          <h2>Do Not Track Signals</h2>
          <p>
            Some browsers offer a "Do Not Track" (DNT) signal that requests websites not to track your activity. 
            Currently, there is no universal standard for how websites should respond to DNT signals.
          </p>
          <p>
            At this time, Sentinel Digest does not respond to DNT signals. However, you can use our 
            cookie settings above to control tracking.
          </p>
        </section>

        <section className="legal-section">
          <h2>Cookie Retention Periods</h2>
          <table className="cookie-table">
            <thead>
              <tr>
                <th>Cookie Type</th>
                <th>Retention Period</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Essential (Session)</td>
                <td>Until browser is closed</td>
              </tr>
              <tr>
                <td>Essential (Persistent)</td>
                <td>7 days</td>
              </tr>
              <tr>
                <td>Analytics</td>
                <td>2 years (Google Analytics)</td>
              </tr>
              <tr>
                <td>Advertising</td>
                <td>90 days (typical)</td>
              </tr>
              <tr>
                <td>Preferences</td>
                <td>1 year</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="legal-section">
          <h2>Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy to reflect changes in technology, legal requirements, 
            or our practices. Changes will be posted on this page with an updated "Last Updated" date.
          </p>
          <p>
            We encourage you to review this policy periodically.
          </p>
        </section>

        <section className="legal-section">
          <h2>Contact Us</h2>
          <p>If you have questions about our use of cookies, contact us:</p>
          <div className="contact-box">
            <p>
              <strong>Email:</strong> privacy@sentineldigest.com<br />
              <strong>Data Protection:</strong> dpo@sentineldigest.com<br />
              <strong>General Inquiries:</strong> <a href="/contact">Contact Page</a>
            </p>
          </div>
        </section>

        <footer className="legal-footer">
          <p>
            <strong>Related Documents:</strong><br />
            <a href="/privacy-policy">Privacy Policy</a> | 
            <a href="/terms-of-service">Terms of Service</a> | 
            <a href="/do-not-sell">Do Not Sell My Info</a>
          </p>
          <p className="legal-copyright">
            © 2025 Sentinel Digest. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default CookiesSettings;
