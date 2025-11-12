import { useEffect, useState } from 'react';
import './Legal.css';

function DoNotSell() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    details: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Do Not Sell My Personal Information - Sentinel Digest';
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real implementation, this would send the request to the backend
    console.log('Do Not Sell request submitted:', formData);
    
    // For now, just show confirmation
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: '', email: '', details: '' });
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="legal-page">
      <div className="legal-container">
        <header className="legal-header">
          <h1>Do Not Sell My Personal Information</h1>
          <p className="legal-meta">
            <strong>CCPA Compliance</strong> - California Consumer Privacy Act<br />
            <strong>Last Updated:</strong> November 11, 2025
          </p>
        </header>

        <section className="legal-section">
          <h2>Your Right to Opt Out</h2>
          <p>
            Under the <strong>California Consumer Privacy Act (CCPA)</strong> and similar privacy laws, 
            you have the right to opt out of the "sale" or "sharing" of your personal information.
          </p>
          <p>
            Sentinel Digest respects your privacy rights and provides this page as a simple way to 
            exercise your opt-out rights.
          </p>
        </section>

        <section className="legal-section">
          <h2>What Does "Selling" Mean?</h2>
          <p>
            Under CCPA, "selling" personal information means disclosing it to third parties for monetary 
            or other valuable consideration. This includes:
          </p>
          <ul>
            <li>Sharing data with advertising partners for targeted ads</li>
            <li>Providing user data to analytics platforms that use it for their own purposes</li>
            <li>Exchanging data with third parties for business benefits</li>
          </ul>

          <h3>What Sentinel Digest Does NOT Do:</h3>
          <p className="highlight-box">
            <strong>Important:</strong> Sentinel Digest does not sell your personal information 
            for profit to data brokers or marketing companies. We do not share your name, email, 
            or contact information with third parties for their marketing purposes without your explicit consent.
          </p>
        </section>

        <section className="legal-section">
          <h2>What Data May Be Shared?</h2>
          <p>
            While we don't "sell" data in the traditional sense, certain data may be shared with 
            trusted partners for legitimate business purposes:
          </p>

          <h3>Analytics and Performance</h3>
          <ul>
            <li><strong>Google Analytics:</strong> Tracks page views, user behavior, and traffic sources</li>
            <li><strong>Purpose:</strong> Improve website performance and user experience</li>
            <li><strong>Data Shared:</strong> IP address (anonymized), device type, browsing patterns</li>
          </ul>

          <h3>Social Media Integration</h3>
          <ul>
            <li><strong>Platforms:</strong> Facebook, Twitter, LinkedIn (share buttons)</li>
            <li><strong>Purpose:</strong> Enable social sharing of articles</li>
            <li><strong>Data Shared:</strong> Article URLs, referral information when you click share buttons</li>
          </ul>

          <h3>Advertising (Future Use)</h3>
          <ul>
            <li><strong>Status:</strong> Currently, Sentinel Digest does not display third-party advertisements</li>
            <li><strong>Future Implementation:</strong> If ads are introduced, we will update this policy and seek consent</li>
            <li><strong>Opt-Out:</strong> You can opt out proactively using this page</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>How to Opt Out</h2>
          <p>You have three options to opt out of data sharing:</p>

          <h3>Option 1: Submit This Form</h3>
          <p>Fill out the form below to request that your data not be sold or shared:</p>

          {submitted ? (
            <div className="success-message">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <h3>Request Submitted Successfully!</h3>
              <p>
                We've received your "Do Not Sell" request and will process it within 30 days.
              </p>
              <p>
                You'll receive a confirmation email at <strong>{formData.email}</strong> with 
                details about your request status.
              </p>
            </div>
          ) : (
            <form className="do-not-sell-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                />
                <small>We'll use this to verify your identity and confirm your request.</small>
              </div>

              <div className="form-group">
                <label htmlFor="details">Additional Details (Optional)</label>
                <textarea
                  id="details"
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Provide any additional information about your request (optional)"
                ></textarea>
              </div>

              <button type="submit" className="btn-submit">
                Submit "Do Not Sell" Request
              </button>

              <p className="form-note">
                <strong>Processing Time:</strong> We will process your request within 30 days and 
                send you a confirmation email.
              </p>
            </form>
          )}

          <h3>Option 2: Email Us Directly</h3>
          <div className="contact-box">
            <p>
              Send an email to <strong>privacy@sentineldigest.com</strong> with the subject line:
              <br />
              <code>"Do Not Sell My Personal Information"</code>
              <br /><br />
              Include your name and email address for verification purposes.
            </p>
          </div>

          <h3>Option 3: Manage Cookie Settings</h3>
          <p>
            You can disable analytics and advertising cookies through our 
            <a href="/cookies-settings"> Cookie Settings</a> page. This will limit data 
            sharing with third-party analytics and advertising platforms.
          </p>
        </section>

        <section className="legal-section">
          <h2>What Happens After You Opt Out?</h2>
          <p>Once your opt-out request is processed:</p>
          <ul>
            <li>
              <strong>Advertising Cookies Disabled:</strong> We will not share your browsing data with 
              advertising partners (when applicable)
            </li>
            <li>
              <strong>Analytics Limited:</strong> Your data will be anonymized in analytics reports or excluded entirely
            </li>
            <li>
              <strong>Essential Services Continue:</strong> You can still use all features of Sentinel Digest normally
            </li>
            <li>
              <strong>Cookie Preference Saved:</strong> Your opt-out preference is stored and respected on future visits
            </li>
          </ul>

          <h3>What Will NOT Change:</h3>
          <ul>
            <li>Essential cookies for login and security will still function</li>
            <li>You'll still receive our newsletter if you've subscribed (unsubscribe separately)</li>
            <li>We may still use your data internally to provide services (not shared with third parties)</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Verification Process</h2>
          <p>
            To protect your privacy, we need to verify your identity before processing opt-out requests. 
            We may:
          </p>
          <ul>
            <li>Send a confirmation email to the address you provided</li>
            <li>Request additional information to match against our records</li>
            <li>Ask you to log into your account (if you have one)</li>
          </ul>
          <p>
            This verification process helps prevent unauthorized requests and ensures we're honoring 
            the right person's privacy rights.
          </p>
        </section>

        <section className="legal-section">
          <h2>Your CCPA Rights</h2>
          <p>In addition to opting out of data sales, California residents have the right to:</p>
          
          <h3>1. Right to Know</h3>
          <ul>
            <li>What personal information we collect about you</li>
            <li>The categories of sources from which we collect it</li>
            <li>The business purpose for collecting or selling it</li>
            <li>The categories of third parties with whom we share it</li>
          </ul>

          <h3>2. Right to Delete</h3>
          <ul>
            <li>Request deletion of personal information we've collected</li>
            <li>Subject to certain exceptions (legal obligations, fraud prevention, etc.)</li>
          </ul>

          <h3>3. Right to Non-Discrimination</h3>
          <ul>
            <li>We will not discriminate against you for exercising your CCPA rights</li>
            <li>You will not be denied services, charged different prices, or receive lower quality service</li>
          </ul>

          <h3>4. Right to Opt Out of Sale</h3>
          <ul>
            <li>Opt out of the sale or sharing of personal information (this page)</li>
          </ul>

          <p>
            To exercise any of these rights, visit our <a href="/privacy-policy">Privacy Policy</a> or 
            contact us at <strong>privacy@sentineldigest.com</strong>.
          </p>
        </section>

        <section className="legal-section">
          <h2>Other Jurisdictions</h2>
          <p>
            While this page focuses on CCPA (California), Sentinel Digest respects privacy rights 
            globally, including:
          </p>
          <ul>
            <li><strong>GDPR (EU):</strong> Right to object to processing and data portability</li>
            <li><strong>PIPEDA (Canada):</strong> Right to access and correct personal information</li>
            <li><strong>LGPD (Brazil):</strong> Right to opt out of data processing</li>
            <li><strong>Other US States:</strong> Similar privacy laws in Virginia, Colorado, Connecticut, etc.</li>
          </ul>
          <p>
            Regardless of your location, you can use this page to opt out of data sharing.
          </p>
        </section>

        <section className="legal-section">
          <h2>Frequently Asked Questions</h2>
          
          <h3>Q: Does opting out affect my user experience?</h3>
          <p>
            <strong>A:</strong> No. You can still read articles, comment, bookmark, and use all features 
            of Sentinel Digest. The only difference is that your data won't be shared with third-party 
            analytics or advertising partners.
          </p>

          <h3>Q: Do I need an account to opt out?</h3>
          <p>
            <strong>A:</strong> No. You can opt out whether or not you have a Sentinel Digest account. 
            However, if you don't have an account, your opt-out preference is stored via cookies, so 
            it may reset if you clear your browser data.
          </p>

          <h3>Q: How long does it take to process my request?</h3>
          <p>
            <strong>A:</strong> We aim to process all opt-out requests within <strong>30 days</strong>, 
            as required by CCPA. You'll receive a confirmation email once processed.
          </p>

          <h3>Q: Can I reverse my opt-out decision?</h3>
          <p>
            <strong>A:</strong> Yes. You can opt back in at any time by contacting us or adjusting your 
            <a href="/cookies-settings"> Cookie Settings</a>.
          </p>

          <h3>Q: What if I'm not in California?</h3>
          <p>
            <strong>A:</strong> You can still use this page to opt out. While CCPA is California-specific, 
            Sentinel Digest extends similar privacy rights to all users globally.
          </p>
        </section>

        <section className="legal-section">
          <h2>Contact Information</h2>
          <p>For questions or concerns about data selling and privacy rights:</p>
          <div className="contact-box">
            <p>
              <strong>Privacy Team:</strong> privacy@sentineldigest.com<br />
              <strong>Data Protection Officer:</strong> dpo@sentineldigest.com<br />
              <strong>General Support:</strong> <a href="/contact">Contact Page</a><br />
              <strong>Phone:</strong> [Insert Phone Number] (Mon-Fri, 9 AM - 5 PM PT)<br />
              <br />
              <strong>Mailing Address:</strong><br />
              Sentinel Digest<br />
              Privacy Rights Department<br />
              [Insert Physical Address]<br />
              [City, State, ZIP Code]
            </p>
          </div>
        </section>

        <footer className="legal-footer">
          <p>
            <strong>Related Documents:</strong><br />
            <a href="/privacy-policy">Privacy Policy</a> | 
            <a href="/cookies-settings">Cookie Settings</a> | 
            <a href="/terms-of-service">Terms of Service</a>
          </p>
          <p className="legal-copyright">
            © 2025 Sentinel Digest. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default DoNotSell;
