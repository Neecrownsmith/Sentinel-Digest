import { useEffect } from 'react';
import './Legal.css';

function Accessibility() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Accessibility Statement - Sentinel Digest';
  }, []);

  return (
    <div className="legal-page">
      <div className="legal-container">
        <header className="legal-header">
          <h1>Accessibility Statement</h1>
          <p className="legal-meta">
            <strong>Last Updated:</strong> November 11, 2025
          </p>
        </header>

        <section className="legal-section">
          <h2>Our Commitment</h2>
          <p>
            Sentinel Digest is committed to ensuring digital accessibility for all users, regardless 
            of ability or disability. We strive to provide an inclusive experience that adheres to 
            best practices and legal standards.
          </p>
          <p>
            We believe that everyone should have equal access to news and information. Accessibility 
            is not just a legal requirement—it's a core value that guides our design and development decisions.
          </p>
        </section>

        <section className="legal-section">
          <h2>Accessibility Standards</h2>
          <p>
            Sentinel Digest aims to conform to the <strong>Web Content Accessibility Guidelines (WCAG) 2.1</strong> 
            at <strong>Level AA</strong>, an internationally recognized standard for web accessibility.
          </p>
          <p>
            WCAG guidelines are organized around four principles:
          </p>
          <ul>
            <li><strong>Perceivable:</strong> Information must be presentable to users in ways they can perceive</li>
            <li><strong>Operable:</strong> User interface components must be operable by all users</li>
            <li><strong>Understandable:</strong> Information and operation must be understandable</li>
            <li><strong>Robust:</strong> Content must be robust enough to work with current and future technologies</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Accessibility Features</h2>
          <p>We have implemented the following features to enhance accessibility:</p>

          <h3>1. Keyboard Navigation</h3>
          <ul>
            <li>Full keyboard support for all interactive elements</li>
            <li>Logical tab order throughout the site</li>
            <li>Visible focus indicators on all focusable elements</li>
            <li>Skip navigation links to bypass repetitive content</li>
            <li>Keyboard shortcuts for common actions (where applicable)</li>
          </ul>

          <h3>2. Screen Reader Compatibility</h3>
          <ul>
            <li>Semantic HTML structure for proper content hierarchy</li>
            <li>ARIA labels and landmarks for improved navigation</li>
            <li>Descriptive link text (no "click here" links)</li>
            <li>Alt text for all meaningful images</li>
            <li>Proper heading structure (H1, H2, H3, etc.)</li>
            <li>Form labels and error messages announced to screen readers</li>
          </ul>
          <p>
            <strong>Tested with:</strong> JAWS, NVDA (Windows), VoiceOver (macOS/iOS), TalkBack (Android)
          </p>

          <h3>3. Visual Design</h3>
          <ul>
            <li><strong>Color Contrast:</strong> All text meets WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)</li>
            <li><strong>Text Sizing:</strong> Text can be resized up to 200% without loss of functionality</li>
            <li><strong>Readable Fonts:</strong> Clear, legible typography with sufficient spacing</li>
            <li><strong>Non-Color Reliance:</strong> Information is not conveyed by color alone</li>
            <li><strong>Dark Mode:</strong> Optional dark theme to reduce eye strain</li>
          </ul>

          <h3>4. Content Structure</h3>
          <ul>
            <li>Clear page titles and headings</li>
            <li>Descriptive labels for form fields</li>
            <li>Error identification and suggestions for correction</li>
            <li>Consistent navigation across all pages</li>
            <li>Breadcrumb trails for complex navigation</li>
          </ul>

          <h3>5. Multimedia Accessibility</h3>
          <ul>
            <li>Alternative text for images</li>
            <li>Captions for videos (when applicable)</li>
            <li>Transcripts for audio content</li>
            <li>Controls for autoplay prevention</li>
          </ul>

          <h3>6. Responsive Design</h3>
          <ul>
            <li>Mobile-friendly layout that adapts to different screen sizes</li>
            <li>Touch-friendly interface with adequate target sizes</li>
            <li>Zoom support without horizontal scrolling</li>
            <li>Portrait and landscape orientation support</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Known Limitations</h2>
          <p>
            While we strive for full accessibility, we acknowledge the following areas that may require improvement:
          </p>
          <ul>
            <li>
              <strong>Third-Party Content:</strong> Some embedded content from external sources (social media, 
              news sources) may not meet our accessibility standards
            </li>
            <li>
              <strong>PDF Documents:</strong> Older archived documents may not be fully accessible; we're working 
              to remediate these
            </li>
            <li>
              <strong>Real-Time Features:</strong> Live updates and notifications may not be fully compatible 
              with all assistive technologies
            </li>
            <li>
              <strong>Legacy Browser Support:</strong> Older browsers may not support all accessibility features
            </li>
          </ul>
          <p>
            We are actively working to address these limitations and improve accessibility across all aspects 
            of our platform.
          </p>
        </section>

        <section className="legal-section">
          <h2>Assistive Technologies Supported</h2>
          <p>Sentinel Digest is designed to work with the following assistive technologies:</p>
          
          <h3>Screen Readers</h3>
          <ul>
            <li>JAWS (Windows)</li>
            <li>NVDA (Windows)</li>
            <li>VoiceOver (macOS, iOS)</li>
            <li>TalkBack (Android)</li>
            <li>Narrator (Windows)</li>
          </ul>

          <h3>Browser Extensions & Tools</h3>
          <ul>
            <li>Browser zoom and text scaling</li>
            <li>High contrast mode</li>
            <li>Voice control software (Dragon NaturallySpeaking, etc.)</li>
            <li>Screen magnification tools</li>
          </ul>

          <h3>Input Devices</h3>
          <ul>
            <li>Keyboard-only navigation</li>
            <li>Switch controls</li>
            <li>Eye-tracking devices</li>
            <li>Touch screen interfaces</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Testing and Evaluation</h2>
          <p>We regularly test Sentinel Digest for accessibility using:</p>
          <ul>
            <li><strong>Automated Tools:</strong> axe DevTools, WAVE, Lighthouse accessibility audits</li>
            <li><strong>Manual Testing:</strong> Keyboard navigation, screen reader testing, color contrast analysis</li>
            <li><strong>User Testing:</strong> Feedback from users with disabilities</li>
            <li><strong>Third-Party Audits:</strong> Periodic professional accessibility audits</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Ongoing Efforts</h2>
          <p>Accessibility is an ongoing commitment. Our efforts include:</p>
          <ul>
            <li>Regular accessibility audits and updates</li>
            <li>Training for developers and content creators on accessibility best practices</li>
            <li>Incorporating accessibility into the design and development process from the start</li>
            <li>Monitoring evolving accessibility standards and technologies</li>
            <li>Responding promptly to user feedback and reported issues</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Feedback and Assistance</h2>
          <p>
            We welcome feedback on the accessibility of Sentinel Digest. If you encounter any barriers 
            or have suggestions for improvement, please let us know:
          </p>
          
          <div className="contact-box">
            <p>
              <strong>Accessibility Coordinator:</strong><br />
              Email: <a href="mailto:accessibility@sentineldigest.com">accessibility@sentineldigest.com</a><br />
              <br />
              <strong>General Support:</strong><br />
              Email: <a href="mailto:support@sentineldigest.com">support@sentineldigest.com</a><br />
              Contact Form: <a href="/contact">Contact Page</a><br />
              <br />
              <strong>Mailing Address:</strong><br />
              Sentinel Digest<br />
              Accessibility Department<br />
              [Insert Physical Address]<br />
              [City, State, ZIP Code]
            </p>
          </div>

          <p>
            <strong>Response Time:</strong> We aim to respond to all accessibility inquiries within 3-5 business days.
          </p>

          <h3>What to Include in Your Report</h3>
          <p>When reporting an accessibility issue, please provide:</p>
          <ul>
            <li>Description of the problem</li>
            <li>The page URL where you encountered the issue</li>
            <li>The assistive technology you're using (if applicable)</li>
            <li>Your browser and operating system</li>
            <li>Steps to reproduce the issue</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Legal Compliance</h2>
          <p>Sentinel Digest strives to comply with:</p>
          <ul>
            <li><strong>Americans with Disabilities Act (ADA)</strong> - Title III (US)</li>
            <li><strong>Section 508 of the Rehabilitation Act</strong> (US Federal)</li>
            <li><strong>European Accessibility Act (EAA)</strong> (EU)</li>
            <li><strong>EN 301 549</strong> European accessibility standard</li>
            <li><strong>Accessible Canada Act (ACA)</strong> (Canada)</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Alternative Access</h2>
          <p>
            If you are unable to access any content or use any features due to a disability, 
            please contact us. We will work with you to provide the information or service in an 
            alternative format or assist you in accessing the content.
          </p>
          <p>
            <strong>Alternative formats available:</strong> Large print, plain text email, audio description
          </p>
        </section>

        <section className="legal-section">
          <h2>Updates to This Statement</h2>
          <p>
            This Accessibility Statement is reviewed and updated regularly to reflect our ongoing 
            efforts and compliance with evolving standards.
          </p>
          <p>
            <strong>Last Reviewed:</strong> November 11, 2025<br />
            <strong>Next Scheduled Review:</strong> May 11, 2026
          </p>
        </section>

        <footer className="legal-footer">
          <p>
            <strong>Related Documents:</strong><br />
            <a href="/privacy-policy">Privacy Policy</a> | 
            <a href="/terms-of-service">Terms of Service</a> | 
            <a href="/contact">Contact Us</a>
          </p>
          <p className="legal-copyright">
            © 2025 Sentinel Digest. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Accessibility;
