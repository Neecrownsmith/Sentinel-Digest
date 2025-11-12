import { useEffect, useState } from 'react';
import './Company.css';

function Advertise() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Advertise with Us - Sentinel Digest';
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setFormData({ name: '', email: '', company: '', budget: '', message: '' });
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  const adOptions = [
    {
      title: 'Banner Ads',
      description: 'Display banner advertisements across our platform',
      features: ['Header and sidebar placements', 'Responsive design', 'Click tracking', 'Monthly impressions report']
    },
    {
      title: 'Sponsored Content',
      description: 'Native advertising that matches our editorial content',
      features: ['Editorial-style articles', 'Labeled as sponsored', 'SEO benefits', 'Social media promotion']
    },
    {
      title: 'Newsletter Sponsorship',
      description: 'Reach our engaged email subscriber base',
      features: ['Featured placement in newsletter', 'Direct audience access', 'High engagement rates', 'Weekly or monthly options']
    },
    {
      title: 'Category Sponsorship',
      description: 'Exclusive sponsorship of specific news categories',
      features: ['Brand visibility in category', 'Custom branded section', 'Priority ad placement', 'Category association']
    }
  ];

  const audienceStats = [
    { label: 'Monthly Visitors', value: '50K+' },
    { label: 'Newsletter Subscribers', value: '10K+' },
    { label: 'Avg. Session Duration', value: '4 min' },
    { label: 'Return Visitor Rate', value: '65%' }
  ];

  return (
    <div className="company-page advertise-page">
      {/* Hero Section */}
      <section className="company-hero">
        <div className="company-hero-content">
          <h1>Advertise with Sentinel Digest</h1>
          <p className="hero-subtitle">
            Reach an engaged audience of news readers and decision-makers
          </p>
        </div>
      </section>

      {/* Audience Section */}
      <section className="audience-section">
        <div className="section-container">
          <h2>Our Audience</h2>
          <p className="section-description">
            Connect with an educated, engaged audience that values quality journalism and trusted information.
          </p>
          <div className="stats-grid">
            {audienceStats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advertising Options */}
      <section className="ad-options-section">
        <div className="section-container">
          <h2>Advertising Options</h2>
          <div className="ad-options-grid">
            {adOptions.map((option, index) => (
              <div key={index} className="ad-option-card">
                <h3>{option.title}</h3>
                <p className="ad-description">{option.description}</p>
                <ul className="ad-features">
                  {option.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Advertise Section */}
      <section className="why-advertise-section">
        <div className="section-container">
          <h2>Why Advertise with Us?</h2>
          <div className="why-grid">
            <div className="why-card">
              <h3>Targeted Audience</h3>
              <p>Reach readers interested in news, current events, and quality content.</p>
            </div>
            <div className="why-card">
              <h3>Brand Safety</h3>
              <p>Your ads appear alongside trusted, quality journalism in a professional environment.</p>
            </div>
            <div className="why-card">
              <h3>Flexible Options</h3>
              <p>Choose from various ad formats and budgets that fit your needs.</p>
            </div>
            <div className="why-card">
              <h3>Performance Tracking</h3>
              <p>Get detailed analytics and reports on your campaign performance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="advertise-contact-section">
        <div className="section-container">
          <h2>Get Started</h2>
          <p className="section-description">
            Fill out the form below and we'll get back to you within 24 hours to discuss your advertising needs.
          </p>

          {showSuccess && (
            <div className="success-message">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Thank you! We'll contact you within 24 hours.</span>
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
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
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="company">Company Name</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="budget">Estimated Budget</label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                >
                  <option value="">Select budget range</option>
                  <option value="under-1k">Under $1,000</option>
                  <option value="1k-5k">$1,000 - $5,000</option>
                  <option value="5k-10k">$5,000 - $10,000</option>
                  <option value="10k-plus">$10,000+</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Tell Us About Your Goals *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                placeholder="What are your advertising objectives? Which ad formats interest you?"
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              Send Inquiry
            </button>
          </form>
        </div>
      </section>

      {/* Additional Info */}
      <section className="advertise-info-section">
        <div className="section-container">
          <h2>Advertising Guidelines</h2>
          <div className="info-content">
            <p>
              We maintain high standards for all advertisements on our platform. All ads must comply with our content policies and editorial standards.
            </p>
            <ul>
              <li>Ads must be clearly distinguishable from editorial content</li>
              <li>No misleading or deceptive advertising</li>
              <li>Prohibited content: illegal products, adult content, discriminatory messaging</li>
              <li>We reserve the right to reject any advertisement that doesn't meet our standards</li>
            </ul>
            <p>
              For detailed advertising guidelines and media kit, please contact our advertising team.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Advertise;
