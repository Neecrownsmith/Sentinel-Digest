import { useEffect } from 'react';
import './Legal.css';

function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Terms of Service - Sentinel Digest';
  }, []);

  return (
    <div className="legal-page">
      <div className="legal-container">
        <header className="legal-header">
          <h1>Terms of Service</h1>
          <p className="legal-meta">
            <strong>Effective Date:</strong> November 11, 2025<br />
            <strong>Last Updated:</strong> November 11, 2025
          </p>
        </header>

        <section className="legal-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            Welcome to Sentinel Digest. By accessing or using our website, mobile applications, or any 
            related services (collectively, "the Platform"), you agree to be bound by these Terms of Service 
            ("Terms"). If you do not agree to these Terms, please discontinue use immediately.
          </p>
          <p>
            These Terms constitute a legally binding agreement between you and Sentinel Digest ("we", "us", or "our").
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Eligibility and Account Registration</h2>
          
          <h3>2.1 Age Requirements</h3>
          <p>
            You must be at least 13 years old to use Sentinel Digest. Users between 13 and 18 must have 
            parental or guardian consent. By using the Platform, you represent that you meet these age requirements.
          </p>

          <h3>2.2 Account Creation</h3>
          <p>To access certain features, you may need to create an account. You agree to:</p>
          <ul>
            <li>Provide accurate, complete, and current information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorized access</li>
            <li>Accept responsibility for all activities under your account</li>
          </ul>

          <h3>2.3 Account Types</h3>
          <ul>
            <li><strong>Regular Users:</strong> Basic access to read and engage with content</li>
            <li><strong>Staff Members:</strong> Access to admin panel (by invitation only)</li>
            <li><strong>Social Managers:</strong> Additional social media management capabilities</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. Acceptable Use Policy</h2>
          
          <h3>3.1 You Agree To:</h3>
          <ul>
            <li>Use the Platform only for lawful purposes and in compliance with all applicable laws</li>
            <li>Respect intellectual property rights of Sentinel Digest and third parties</li>
            <li>Engage respectfully with other users and maintain civil discourse</li>
            <li>Report any bugs, security vulnerabilities, or inappropriate content</li>
          </ul>

          <h3>3.2 You Agree NOT To:</h3>
          <ul>
            <li><strong>Scrape or Copy:</strong> Systematically download, scrape, or copy our content without permission</li>
            <li><strong>Disrupt Service:</strong> Upload viruses, malware, or attempt to interfere with platform operations</li>
            <li><strong>Impersonate:</strong> Misrepresent your identity or affiliation</li>
            <li><strong>Spam:</strong> Post repetitive, unsolicited, or commercial content</li>
            <li><strong>Harass:</strong> Engage in bullying, hate speech, or threatening behavior</li>
            <li><strong>Violate Privacy:</strong> Share others' personal information without consent</li>
            <li><strong>Reverse Engineer:</strong> Attempt to access source code or underlying technology</li>
            <li><strong>Circumvent Security:</strong> Bypass authentication, rate limiting, or access controls</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Intellectual Property Rights</h2>
          
          <h3>4.1 Our Content</h3>
          <p>
            All content on Sentinel Digest, including but not limited to articles, images, logos, trademarks, 
            software, and design elements, is owned by Sentinel Digest or licensed from third parties. 
            All rights reserved.
          </p>
          <p>
            <strong>Protected by:</strong> Copyright laws, trademark laws, and international treaties.
          </p>

          <h3>4.2 Limited License to Users</h3>
          <p>We grant you a limited, non-exclusive, non-transferable license to:</p>
          <ul>
            <li>Access and view content for personal, non-commercial use</li>
            <li>Share article links on social media platforms</li>
            <li>Print or download articles for personal reference</li>
          </ul>

          <h3>4.3 Prohibited Uses</h3>
          <p>You may NOT:</p>
          <ul>
            <li>Republish or redistribute our content on other websites without written permission</li>
            <li>Remove copyright notices or attributions</li>
            <li>Use our content for commercial purposes without a licensing agreement</li>
            <li>Create derivative works without authorization</li>
          </ul>

          <h3>4.4 AI-Generated Content</h3>
          <p>
            Sentinel Digest uses artificial intelligence (OpenAI GPT models) to rewrite and curate news content 
            from public sources. While we strive for accuracy and originality:
          </p>
          <ul>
            <li>AI-generated content is checked for plagiarism and duplicate detection</li>
            <li>We cite sources where applicable</li>
            <li>Content is reviewed before publication</li>
            <li>No warranty is provided for absolute factual accuracy</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>5. User-Generated Content</h2>
          
          <h3>5.1 Your Content</h3>
          <p>
            When you post comments, feedback, or other content ("User Content"), you retain ownership 
            but grant Sentinel Digest a worldwide, royalty-free, perpetual, non-exclusive license to:
          </p>
          <ul>
            <li>Display, reproduce, and distribute your content on the Platform</li>
            <li>Modify or adapt content for technical or formatting purposes</li>
            <li>Use for promotional or marketing materials (with attribution)</li>
          </ul>

          <h3>5.2 Content Standards</h3>
          <p>Your User Content must NOT:</p>
          <ul>
            <li>Violate laws or regulations</li>
            <li>Contain hate speech, discrimination, or harassment</li>
            <li>Include pornographic, violent, or explicit material</li>
            <li>Promote illegal activities or self-harm</li>
            <li>Infringe on others' intellectual property</li>
            <li>Contain spam, advertising, or phishing links</li>
          </ul>

          <h3>5.3 Moderation</h3>
          <p>
            We reserve the right to remove, edit, or reject any User Content that violates these Terms, 
            without prior notice. We are not obligated to monitor or review all content but may do so 
            at our discretion.
          </p>

          <h3>5.4 Anonymous Comments</h3>
          <p>
            While we allow anonymous commenting, abusive anonymous content may result in the feature 
            being disabled or restricted for specific users or globally.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. AI and Automated Systems</h2>
          
          <h3>6.1 AI-Powered Features</h3>
          <p>Sentinel Digest uses artificial intelligence for:</p>
          <ul>
            <li><strong>Content Curation:</strong> Scraping, rewriting, and summarizing news articles</li>
            <li><strong>Recommendations:</strong> Suggesting articles based on reading history</li>
            <li><strong>Duplicate Detection:</strong> Using FAISS similarity search to prevent duplicate content</li>
            <li><strong>Trending Analysis:</strong> Calculating trending scores based on engagement metrics</li>
          </ul>

          <h3>6.2 No Guarantee of Accuracy</h3>
          <p>
            While we aim for factual accuracy, AI systems may produce errors, biases, or misinterpretations. 
            Sentinel Digest is NOT responsible for:
          </p>
          <ul>
            <li>Inaccuracies in AI-generated content</li>
            <li>Decisions made based on information from the Platform</li>
            <li>Third-party content scraped from news sources</li>
          </ul>
          <p className="highlight-box">
            <strong>Important:</strong> Users should verify critical information from primary or authoritative sources. 
            Sentinel Digest is a news aggregation and curation platform, not an authoritative source.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Third-Party Links and Services</h2>
          <p>
            Our Platform may contain links to third-party websites, social media platforms, or external services. 
            We are not responsible for:
          </p>
          <ul>
            <li>Content or practices of external websites</li>
            <li>Privacy policies of third-party services</li>
            <li>Accuracy or safety of linked resources</li>
          </ul>
          <p>
            Accessing third-party links is at your own risk. We recommend reviewing their terms and privacy policies.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Payment and Transactions (Future Features)</h2>
          <p>
            When Sentinel Digest introduces paid features (e.g., premium subscriptions, store purchases, job listings):
          </p>
          <ul>
            <li>All prices are in USD (or local currency as displayed)</li>
            <li>Payment processing is handled by secure third-party providers (Stripe, PayPal, etc.)</li>
            <li>Refunds are subject to our Refund Policy (to be published)</li>
            <li>Subscriptions auto-renew unless canceled before renewal date</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>9. Disclaimers and Limitation of Liability</h2>
          
          <h3>9.1 "As Is" Service</h3>
          <p>
            Sentinel Digest is provided "as is" and "as available" without warranties of any kind, 
            either express or implied, including but not limited to:
          </p>
          <ul>
            <li>Merchantability or fitness for a particular purpose</li>
            <li>Accuracy, completeness, or reliability of content</li>
            <li>Uninterrupted or error-free operation</li>
            <li>Security or freedom from viruses</li>
          </ul>

          <h3>9.2 No Liability</h3>
          <p>
            To the maximum extent permitted by law, Sentinel Digest and its affiliates, officers, 
            employees, or partners shall NOT be liable for:
          </p>
          <ul>
            <li>Indirect, incidental, consequential, or punitive damages</li>
            <li>Loss of profits, data, or business opportunities</li>
            <li>Damages arising from use or inability to use the Platform</li>
            <li>User Content or third-party actions</li>
          </ul>
          <p>
            <strong>Maximum Liability:</strong> In jurisdictions that do not allow exclusion of liability, 
            our total liability is limited to the amount you paid us in the past 12 months (or $100 USD if no payment).
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Sentinel Digest from any claims, damages, 
            losses, or expenses (including legal fees) arising from:
          </p>
          <ul>
            <li>Your violation of these Terms</li>
            <li>Your User Content</li>
            <li>Your use or misuse of the Platform</li>
            <li>Infringement of third-party rights</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>11. Termination and Suspension</h2>
          
          <h3>11.1 By You</h3>
          <p>
            You may terminate your account at any time by contacting us at <strong>support@sentineldigest.com</strong> 
            or using the account deletion feature in your profile settings.
          </p>

          <h3>11.2 By Us</h3>
          <p>We reserve the right to suspend or terminate your account if:</p>
          <ul>
            <li>You violate these Terms or our policies</li>
            <li>We suspect fraudulent, illegal, or harmful activity</li>
            <li>Required by law or government authority</li>
            <li>The Platform is discontinued or significantly modified</li>
          </ul>

          <h3>11.3 Effect of Termination</h3>
          <ul>
            <li>Access to your account will be revoked</li>
            <li>Your User Content may be deleted (subject to legal retention requirements)</li>
            <li>Licenses granted to us remain in effect for content already published</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>12. Changes to Terms</h2>
          <p>
            We may modify these Terms at any time to reflect changes in our services, legal requirements, 
            or business practices.
          </p>
          <ul>
            <li><strong>Notification:</strong> Significant changes will be announced via email or prominent website notice</li>
            <li><strong>Effective Date:</strong> Changes take effect 30 days after posting (unless sooner required by law)</li>
            <li><strong>Continued Use:</strong> Your continued use after changes constitutes acceptance</li>
            <li><strong>Disagreement:</strong> If you disagree, discontinue use and close your account</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>13. Governing Law and Dispute Resolution</h2>
          
          <h3>13.1 Governing Law</h3>
          <p>
            These Terms are governed by the laws of <strong>[Insert Jurisdiction]</strong>, without 
            regard to conflict of law principles.
          </p>

          <h3>13.2 Dispute Resolution</h3>
          <p>
            In the event of a dispute, you agree to first attempt informal resolution by contacting us at 
            <strong> legal@sentineldigest.com</strong>.
          </p>

          <h3>13.3 Arbitration (Optional Clause)</h3>
          <p>
            If informal resolution fails, disputes will be resolved through binding arbitration in accordance 
            with [Insert Arbitration Rules], rather than in court, except for small claims court matters.
          </p>

          <h3>13.4 Class Action Waiver</h3>
          <p>
            You agree to resolve disputes individually, not as part of a class action or collective proceeding.
          </p>
        </section>

        <section className="legal-section">
          <h2>14. Miscellaneous</h2>
          
          <h3>14.1 Entire Agreement</h3>
          <p>These Terms, along with our Privacy Policy and other policies, constitute the entire agreement between you and Sentinel Digest.</p>

          <h3>14.2 Severability</h3>
          <p>If any provision is found invalid or unenforceable, the remaining provisions remain in effect.</p>

          <h3>14.3 No Waiver</h3>
          <p>Our failure to enforce any right or provision does not constitute a waiver of that right.</p>

          <h3>14.4 Assignment</h3>
          <p>You may not assign these Terms without our consent. We may assign our rights to any affiliate or successor.</p>

          <h3>14.5 Force Majeure</h3>
          <p>We are not liable for delays or failures due to circumstances beyond our reasonable control (natural disasters, pandemics, war, etc.).</p>
        </section>

        <section className="legal-section">
          <h2>15. Contact Information</h2>
          <p>For questions or concerns regarding these Terms, contact us:</p>
          <div className="contact-box">
            <p>
              <strong>Email:</strong> legal@sentineldigest.com<br />
              <strong>Support:</strong> support@sentineldigest.com<br />
              <strong>General Inquiries:</strong> <a href="/contact">Contact Page</a><br />
              <strong>Mailing Address:</strong><br />
              Sentinel Digest<br />
              Legal Department<br />
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
            <a href="/accessibility">Accessibility Statement</a> | 
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

export default TermsOfService;
