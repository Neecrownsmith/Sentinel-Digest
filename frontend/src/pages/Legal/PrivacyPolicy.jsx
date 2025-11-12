import { useEffect } from 'react';
import './Legal.css';

function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Privacy Policy - Sentinel Digest';
  }, []);

  return (
    <div className="legal-page">
      <div className="legal-container">
        <header className="legal-header">
          <h1>Privacy Policy</h1>
          <p className="legal-meta">
            <strong>Effective Date:</strong> November 11, 2025<br />
            <strong>Last Updated:</strong> November 11, 2025
          </p>
        </header>

        <section className="legal-section">
          <h2>Introduction</h2>
          <p>
            Sentinel Digest ("we", "our", or "us") respects your privacy and is committed to protecting your personal data. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our 
            website <strong>www.sentineldigest.com</strong> or use any related services, including our mobile apps, games, 
            job portal, or store (collectively, "the Platform").
          </p>
          <p>
            By using the Platform, you agree to the collection and use of information in accordance with this policy. 
            If you do not agree with our policies and practices, please do not use our services.
          </p>
        </section>

        <section className="legal-section">
          <h2>Information We Collect</h2>
          
          <h3>1. Personal Information</h3>
          <ul>
            <li>Name, email address, and account credentials</li>
            <li>Profile details (username, bio, preferences)</li>
            <li>Social media profile information (when using Google OAuth login)</li>
            <li>Communication preferences and newsletter subscriptions</li>
          </ul>

          <h3>2. Usage Data</h3>
          <ul>
            <li>IP address and geolocation data</li>
            <li>Browser type, version, and language settings</li>
            <li>Device information (operating system, device type)</li>
            <li>Pages visited, time spent, and navigation patterns</li>
            <li>Article views, likes, comments, and bookmarks</li>
            <li>Search queries and filter preferences</li>
          </ul>

          <h3>3. Cookies & Tracking Technologies</h3>
          <ul>
            <li>Session cookies for authentication and security</li>
            <li>Analytics cookies to understand user behavior</li>
            <li>Preference cookies to remember your settings</li>
            <li>Advertising cookies for personalized content (with consent)</li>
          </ul>

          <h3>4. User-Generated Content</h3>
          <ul>
            <li>Comments and feedback you post on articles</li>
            <li>Social media sharing activity</li>
            <li>Content ratings and engagement metrics</li>
          </ul>

          <h3>5. Transactional Data (Future Features)</h3>
          <ul>
            <li>Payment information for store purchases</li>
            <li>Job applications and resume submissions</li>
            <li>Game progress and achievements</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>How We Use Your Information</h2>
          <p>We use collected data to:</p>
          <ul>
            <li><strong>Provide Services:</strong> Deliver AI-curated news content and personalized recommendations</li>
            <li><strong>Account Management:</strong> Manage user accounts, authentication, and profile settings</li>
            <li><strong>Personalization:</strong> Tailor content based on your reading history and preferences</li>
            <li><strong>Communication:</strong> Send email updates, newsletters, and notifications (opt-in only)</li>
            <li><strong>Analytics:</strong> Monitor platform performance, engagement metrics, and trending content</li>
            <li><strong>Security:</strong> Prevent fraud, abuse, and unauthorized access</li>
            <li><strong>Legal Compliance:</strong> Fulfill legal obligations and enforce our Terms of Service</li>
            <li><strong>Product Development:</strong> Improve features, test new functionality, and enhance user experience</li>
            <li><strong>Marketing:</strong> Provide relevant content recommendations and promotional materials (with consent)</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Data Sharing and Disclosure</h2>
          
          <h3>We May Share Your Data With:</h3>
          
          <h4>Service Providers</h4>
          <ul>
            <li>Cloud hosting services (for data storage and processing)</li>
            <li>Analytics providers (Google Analytics, etc.)</li>
            <li>Email service providers (for newsletters and notifications)</li>
            <li>Content delivery networks (CDN) for faster page loading</li>
            <li>AI service providers (OpenAI for content generation)</li>
          </ul>

          <h4>Legal Authorities</h4>
          <ul>
            <li>When required by law, court order, or government regulation</li>
            <li>To protect our rights, property, or safety</li>
            <li>To investigate potential violations of our Terms of Service</li>
          </ul>

          <h4>Business Transfers</h4>
          <ul>
            <li>In case of merger, acquisition, or sale of assets</li>
            <li>Your data may be transferred to the new entity</li>
          </ul>

          <h4>With Your Consent</h4>
          <ul>
            <li>When you explicitly authorize data sharing</li>
            <li>For specific third-party integrations you enable</li>
          </ul>

          <p className="highlight-box">
            <strong>Important:</strong> We never sell your personal data to third parties for marketing purposes 
            without your explicit consent. See our <a href="/do-not-sell">"Do Not Sell My Information"</a> page for more details.
          </p>
        </section>

        <section className="legal-section">
          <h2>Data Security</h2>
          <p>We implement industry-standard security measures to protect your data:</p>
          <ul>
            <li>HTTPS encryption for all data transmission</li>
            <li>Secure password hashing (PBKDF2 algorithm)</li>
            <li>JWT authentication for API access</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Access controls and employee data handling policies</li>
            <li>Automated backups and disaster recovery procedures</li>
          </ul>
          <p>
            However, no method of transmission over the internet is 100% secure. While we strive to protect 
            your data, we cannot guarantee absolute security.
          </p>
        </section>

        <section className="legal-section">
          <h2>Data Retention</h2>
          <p>We retain your data only as long as necessary to:</p>
          <ul>
            <li>Provide our services and fulfill the purposes described in this policy</li>
            <li>Comply with legal obligations (tax records, audit trails)</li>
            <li>Resolve disputes and enforce our agreements</li>
          </ul>
          <p>
            <strong>Account Data:</strong> Retained while your account is active<br />
            <strong>Usage Logs:</strong> 30-90 days for analytics purposes<br />
            <strong>Backup Data:</strong> Up to 1 year in encrypted backups<br />
            <strong>Legal Records:</strong> As required by applicable laws
          </p>
          <p>
            Upon account deletion, we will remove or anonymize your personal data within 30 days, 
            except where retention is required by law.
          </p>
        </section>

        <section className="legal-section">
          <h2>Your Privacy Rights</h2>
          <p>Depending on your jurisdiction, you have the right to:</p>

          <h3>Access and Portability</h3>
          <ul>
            <li>Request a copy of your personal data in a structured format</li>
            <li>Export your account data (profile, comments, bookmarks)</li>
          </ul>

          <h3>Correction and Updates</h3>
          <ul>
            <li>Update your profile information at any time</li>
            <li>Correct inaccurate or incomplete data</li>
          </ul>

          <h3>Deletion ("Right to be Forgotten")</h3>
          <ul>
            <li>Request deletion of your account and personal data</li>
            <li>Remove specific comments or user-generated content</li>
          </ul>

          <h3>Opt-Out and Preferences</h3>
          <ul>
            <li>Unsubscribe from marketing emails (link in every email)</li>
            <li>Disable cookies via browser settings or our <a href="/cookies-settings">Cookie Settings</a> page</li>
            <li>Opt out of personalized advertising</li>
            <li>Request that your data not be sold (CCPA)</li>
          </ul>

          <h3>Object and Restrict</h3>
          <ul>
            <li>Object to specific data processing activities</li>
            <li>Request restriction of certain data uses</li>
          </ul>

          <p className="highlight-box">
            To exercise any of these rights, contact us at <strong>privacy@sentineldigest.com</strong> 
            or visit your <a href="/account">Account Settings</a> page.
          </p>
        </section>

        <section className="legal-section">
          <h2>Children's Privacy</h2>
          <p>
            Sentinel Digest is not intended for users under the age of 13. We do not knowingly collect 
            personal information from children under 13. If you are a parent or guardian and believe 
            your child has provided us with personal data, please contact us immediately at 
            <strong> privacy@sentineldigest.com</strong>.
          </p>
          <p>
            Users between 13 and 18 should have parental or guardian consent before using our services.
          </p>
        </section>

        <section className="legal-section">
          <h2>International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your own. 
            These countries may have different data protection laws than your jurisdiction.
          </p>
          <p>
            We ensure appropriate safeguards are in place when transferring data internationally, 
            including standard contractual clauses and compliance with GDPR (for EU users) and 
            CCPA (for California residents).
          </p>
        </section>

        <section className="legal-section">
          <h2>Third-Party Links and Services</h2>
          <p>
            Our Platform may contain links to third-party websites, social media platforms, or services. 
            We are not responsible for the privacy practices of these external sites. We encourage you 
            to read their privacy policies before providing any personal information.
          </p>
          <p>
            <strong>Social Media Integration:</strong> When you use "Share" features or login via Google, 
            you are subject to those platforms' privacy policies.
          </p>
        </section>

        <section className="legal-section">
          <h2>Updates to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically to reflect changes in our practices, 
            technology, legal requirements, or business operations.
          </p>
          <p>
            <strong>Notification:</strong> We will notify you of significant changes via email or 
            prominent notice on our website at least 30 days before changes take effect.
          </p>
          <p>
            <strong>Continued Use:</strong> Your continued use of the Platform after changes are 
            posted constitutes acceptance of the updated policy.
          </p>
          <p>
            <strong>Review:</strong> We encourage you to review this policy periodically.
          </p>
        </section>

        <section className="legal-section">
          <h2>Contact Us</h2>
          <p>If you have questions, concerns, or requests regarding this Privacy Policy, please contact us:</p>
          <div className="contact-box">
            <p>
              <strong>Email:</strong> privacy@sentineldigest.com<br />
              <strong>Data Protection Officer:</strong> dpo@sentineldigest.com<br />
              <strong>General Inquiries:</strong> <a href="/contact">Contact Page</a><br />
              <strong>Mailing Address:</strong><br />
              Sentinel Digest<br />
              Privacy Department<br />
              [Insert Physical Address]<br />
              [City, State, ZIP Code]
            </p>
          </div>
          <p>
            We will respond to all legitimate requests within 30 days.
          </p>
        </section>

        <footer className="legal-footer">
          <p>
            <strong>Jurisdiction-Specific Rights:</strong><br />
            <a href="/privacy-policy#gdpr">GDPR (EU)</a> | 
            <a href="/privacy-policy#ccpa">CCPA (California)</a> | 
            <a href="/do-not-sell">Do Not Sell My Info</a> | 
            <a href="/cookies-settings">Cookie Settings</a>
          </p>
          <p className="legal-copyright">
            © 2025 Sentinel Digest. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
