import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Company.css';

function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'About Us - Sentinel Digest';
  }, []);

  return (
    <div className="company-page">
      <div className="company-container">
        {/* Hero Section */}
        <header className="company-hero">
          <h1>About Sentinel Digest</h1>
          <p className="hero-tagline">
            Your Trusted Source for AI-Curated News and Information
          </p>
        </header>

        {/* Mission Section */}
        <section className="company-section mission-section">
          <div className="section-content">
            <h2>Our Mission</h2>
            <p className="lead-text">
              At Sentinel Digest, we believe in democratizing access to quality news by leveraging 
              the power of artificial intelligence to curate, rewrite, and deliver trustworthy 
              information to readers worldwide.
            </p>
            <p>
              In an era of information overload, we stand as your vigilant sentinel—filtering through 
              the noise to bring you the most relevant, accurate, and engaging news stories across 
              politics, technology, business, health, entertainment, and more.
            </p>
          </div>
        </section>

        {/* What We Do */}
        <section className="company-section">
          <h2>What We Do</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered Curation</h3>
              <p>
                Our advanced AI systems scan thousands of news sources daily, identifying the most 
                important and relevant stories using natural language processing and machine learning algorithms.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">✍️</div>
              <h3>Original Content Creation</h3>
              <p>
                Using state-of-the-art GPT models, we rewrite news articles to ensure originality, 
                clarity, and readability while maintaining factual accuracy and proper attribution.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Duplicate Detection</h3>
              <p>
                Our FAISS-powered similarity search ensures you don't see the same story repeated 
                across multiple sources, saving you time and reducing information fatigue.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Trend Analysis</h3>
              <p>
                We track reader engagement and calculate trending scores to surface the most impactful 
                stories, helping you stay informed about what matters most.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Personalized Experience</h3>
              <p>
                With user accounts, bookmarking, and reading history, we tailor your news feed to 
                match your interests while introducing you to diverse perspectives.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>Social Engagement</h3>
              <p>
                Share articles, engage in meaningful discussions through comments, and connect with 
                a community of informed readers across social media platforms.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="company-section story-section">
          <h2>Our Story</h2>
          <div className="story-content">
            <p>
              Sentinel Digest was founded in 2025 with a vision to revolutionize how people consume 
              news in the digital age. Recognizing the challenges of misinformation, content duplication, 
              and information overload, our team set out to build a platform that combines the best of 
              human editorial judgment with cutting-edge AI technology.
            </p>
            <p>
              What started as an experiment in automated news aggregation has evolved into a comprehensive 
              digital news platform serving thousands of readers daily. We're proud to offer not just 
              news, but a complete ecosystem including:
            </p>
            <ul className="story-list">
              <li><strong>News Articles:</strong> Covering 10+ categories from politics to entertainment</li>
              <li><strong>User Engagement:</strong> Comments, likes, bookmarks, and social sharing</li>
              <li><strong>Editorial Curation:</strong> Top stories and trending content hand-picked by our team</li>
              <li><strong>Advanced Search:</strong> Find exactly what you're looking for with powerful filters</li>
            </ul>
            <p>
              As we continue to grow, we're exploring new frontiers including job listings, educational 
              resources, entertainment (games), and e-commerce—all designed to complement your daily 
              news consumption and enrich your digital experience.
            </p>
          </div>
        </section>

        {/* Our Values */}
        <section className="company-section values-section">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>🛡️ Accuracy & Trust</h3>
              <p>
                We verify information from credible sources and maintain editorial standards that 
                prioritize factual accuracy above all else.
              </p>
            </div>

            <div className="value-card">
              <h3>🌍 Diversity & Inclusion</h3>
              <p>
                We present multiple perspectives on important issues and strive to give voice to 
                underrepresented communities and viewpoints.
              </p>
            </div>

            <div className="value-card">
              <h3>🔒 Privacy & Security</h3>
              <p>
                Your data is yours. We implement robust security measures and respect your privacy 
                rights under GDPR, CCPA, and other regulations.
              </p>
            </div>

            <div className="value-card">
              <h3>🚀 Innovation</h3>
              <p>
                We continuously experiment with new technologies and methodologies to improve how 
                news is discovered, consumed, and shared.
              </p>
            </div>

            <div className="value-card">
              <h3>♿ Accessibility</h3>
              <p>
                Everyone deserves access to information. We design with accessibility in mind, 
                ensuring our platform works for users of all abilities.
              </p>
            </div>

            <div className="value-card">
              <h3>🤝 Community</h3>
              <p>
                We foster respectful dialogue and civil discourse, creating a space where readers 
                can engage thoughtfully with news and each other.
              </p>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="company-section tech-section">
          <h2>Our Technology</h2>
          <p className="section-intro">
            Sentinel Digest is built on modern, scalable technologies that ensure fast performance, 
            reliability, and security:
          </p>
          <div className="tech-grid">
            <div className="tech-category">
              <h3>Backend</h3>
              <ul>
                <li>Django REST Framework</li>
                <li>Python 3.12+</li>
                <li>PostgreSQL Database</li>
                <li>Redis Caching</li>
                <li>Celery Task Queue</li>
              </ul>
            </div>

            <div className="tech-category">
              <h3>AI & ML</h3>
              <ul>
                <li>OpenAI GPT-4</li>
                <li>FAISS Similarity Search</li>
                <li>Newspaper3k Scraping</li>
                <li>NLP Processing</li>
                <li>Sentiment Analysis</li>
              </ul>
            </div>

            <div className="tech-category">
              <h3>Frontend</h3>
              <ul>
                <li>React 19</li>
                <li>Vite Build Tool</li>
                <li>React Router</li>
                <li>Axios HTTP Client</li>
                <li>Responsive CSS3</li>
              </ul>
            </div>

            <div className="tech-category">
              <h3>Infrastructure</h3>
              <ul>
                <li>Cloud Hosting</li>
                <li>CDN Delivery</li>
                <li>Load Balancing</li>
                <li>SSL/TLS Encryption</li>
                <li>Automated Backups</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="company-section team-section">
          <h2>Our Team</h2>
          <p className="section-intro">
            Sentinel Digest is powered by a passionate team of developers, journalists, data scientists, 
            and designers committed to reimagining digital news.
          </p>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">👤</div>
              <h3>Editorial Team</h3>
              <p>
                Experienced journalists and editors who curate top stories, verify facts, and maintain 
                editorial standards.
              </p>
            </div>

            <div className="team-member">
              <div className="member-avatar">💻</div>
              <h3>Engineering</h3>
              <p>
                Full-stack developers and AI engineers building robust, scalable systems that power 
                our platform.
              </p>
            </div>

            <div className="team-member">
              <div className="member-avatar">🎨</div>
              <h3>Design & UX</h3>
              <p>
                Creative designers focused on delivering intuitive, accessible, and beautiful user 
                experiences.
              </p>
            </div>

            <div className="team-member">
              <div className="member-avatar">📈</div>
              <h3>Data Science</h3>
              <p>
                ML specialists optimizing algorithms for trend detection, content recommendations, 
                and duplicate identification.
              </p>
            </div>
          </div>
        </section>

        {/* Future Plans */}
        <section className="company-section future-section">
          <h2>What's Next?</h2>
          <p className="section-intro">
            We're constantly evolving. Here's what's on our roadmap:
          </p>
          <div className="roadmap-list">
            <div className="roadmap-item">
              <span className="roadmap-status completed">✓ Completed</span>
              <div>
                <h3>User Accounts & Authentication</h3>
                <p>Google OAuth integration, profile management, and personalized experiences</p>
              </div>
            </div>

            <div className="roadmap-item">
              <span className="roadmap-status completed">✓ Completed</span>
              <div>
                <h3>Social Media Management</h3>
                <p>Platform-specific post queues and one-click sharing for content managers</p>
              </div>
            </div>

            <div className="roadmap-item">
              <span className="roadmap-status in-progress">⏳ In Progress</span>
              <div>
                <h3>Email Newsletters</h3>
                <p>Curated daily/weekly digests delivered directly to your inbox</p>
              </div>
            </div>

            <div className="roadmap-item">
              <span className="roadmap-status planned">📋 Planned</span>
              <div>
                <h3>Mobile Applications</h3>
                <p>Native iOS and Android apps for news on the go</p>
              </div>
            </div>

            <div className="roadmap-item">
              <span className="roadmap-status planned">📋 Planned</span>
              <div>
                <h3>Multi-Language Support</h3>
                <p>News in multiple languages to reach global audiences</p>
              </div>
            </div>

            <div className="roadmap-item">
              <span className="roadmap-status planned">📋 Planned</span>
              <div>
                <h3>Premium Subscriptions</h3>
                <p>Ad-free experience, exclusive content, and advanced features</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="company-section cta-section">
          <h2>Join Our Community</h2>
          <p>
            Experience the future of news consumption. Create an account to unlock personalized 
            features, save your favorite articles, and engage with our growing community.
          </p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn-primary">Create Account</Link>
            <Link to="/contact" className="btn-secondary">Get in Touch</Link>
          </div>
        </section>

        {/* Contact Info */}
        <section className="company-section contact-info-section">
          <h2>Get in Touch</h2>
          <div className="contact-grid">
            <div className="contact-item">
              <h3>📧 Contact Us</h3>
              <p>info@sentineldigest.com</p>
              <p style={{fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.8}}>
                For all inquiries including editorial, support, partnerships, and legal matters
              </p>
            </div>

            <div className="contact-item">
              <h3>� WhatsApp Channel</h3>
              <p style={{fontSize: '0.95rem'}}>
                <a href="https://whatsapp.com/channel/0029VbB3VwTDDmFT12in6R0Q" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   style={{color: '#25D366', textDecoration: 'none'}}>
                  Join Our Channel
                </a>
              </p>
              <p style={{fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.8}}>
                Get the latest updates and news
              </p>
            </div>
          </div>

          <div className="social-links">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="https://www.facebook.com/SentinelDigest" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://x.com/SentinelDigest" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/sentineldigest" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/sentineldigest/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </a>
              <a href="https://youtube.com/@sentineldigest" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="https://whatsapp.com/channel/0029VbB3VwTDDmFT12in6R0Q" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Channel">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
