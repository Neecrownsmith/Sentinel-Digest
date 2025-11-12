import { useEffect } from 'react';
import './Company.css';

function Careers() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Volunteer Opportunities - Sentinel Digest';
  }, []);

  const volunteerRoles = [
    {
      title: 'Editorial Assistant',
      description: 'Support our newsroom with research, fact-checking, and content curation under the guidance of our editorial team.',
      requirements: ['Interest in journalism', 'Basic research skills', 'Attention to detail'],
      commitment: 'Few hours per week'
    },
    {
      title: 'Digital Ambassador',
      description: 'Promote our stories and initiatives on social media to expand our reach and engage with our community.',
      requirements: ['Active on social media', 'Good communication skills', 'Understanding of digital trends'],
      commitment: 'Flexible hours'
    },
    {
      title: 'Community Outreach',
      description: 'Represent Sentinel Digest in community programs and promote media literacy and civic participation.',
      requirements: ['Strong interpersonal skills', 'Passion for community engagement', 'Local knowledge'],
      commitment: 'Few hours per month'
    },
    {
      title: 'Content Moderator',
      description: 'Help maintain quality discussions by reviewing comments and user-generated content.',
      requirements: ['Good judgment', 'Understanding of community guidelines', 'Patient and fair'],
      commitment: 'Few hours per week'
    }
  ];

  return (
    <div className="company-page careers-page">
      {/* Hero Section */}
      <section className="company-hero">
        <div className="company-hero-content">
          <h1>Volunteer With Us</h1>
          <p className="hero-subtitle">
            Join our mission to deliver quality news and information to communities
          </p>
        </div>
      </section>

      {/* Volunteer Intro */}
      <section className="volunteer-intro-section">
        <div className="section-container">
          <h2>Join Our Mission Through Volunteering</h2>
          <p className="volunteer-intro-text">
            Volunteers are the heart of our community engagement efforts, helping us amplify our impact through editorial support, 
            community outreach, and digital initiatives. We seek individuals passionate about journalism, civic engagement, and social good.
          </p>
          <p className="volunteer-intro-text">
            Whether you're a student looking for experience, a professional wanting to give back, or someone passionate about quality 
            journalism, we invite you to contribute to our mission of delivering trusted news to our community.
          </p>
        </div>
      </section>

      {/* Volunteer Roles */}
      <section className="volunteer-roles-section">
        <div className="section-container">
          <h2>Volunteer Opportunities</h2>
          <div className="volunteer-roles-grid">
            {volunteerRoles.map((role, index) => (
              <div key={index} className="volunteer-role-card">
                <h3>{role.title}</h3>
                <p>{role.description}</p>
                <div className="role-details">
                  <h4>What We're Looking For:</h4>
                  <ul>
                    {role.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                  <p className="volunteer-commitment">
                    <strong>Time Commitment:</strong> {role.commitment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Benefits */}
      <section className="volunteer-benefits-section">
        <div className="section-container">
          <h2>What You'll Gain</h2>
          <div className="volunteer-benefits-grid">
            <div className="volunteer-benefit-card">
              <h3>Hands-On Experience</h3>
              <p>Gain practical experience in media, journalism, and digital content creation.</p>
            </div>
            <div className="volunteer-benefit-card">
              <h3>Professional Network</h3>
              <p>Connect with journalists, industry leaders, and community influencers.</p>
            </div>
            <div className="volunteer-benefit-card">
              <h3>Recognition</h3>
              <p>Receive a certificate of appreciation and recognition on our website (with consent).</p>
            </div>
            <div className="volunteer-benefit-card">
              <h3>Meaningful Impact</h3>
              <p>Contribute to initiatives that inform and empower communities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Requirements */}
      <section className="volunteer-requirements-section">
        <div className="section-container">
          <h2>General Requirements</h2>
          <div className="requirements-content">
            <ul>
              <li>Commitment to Sentinel Digest's values of truth, fairness, and independence</li>
              <li>Availability to dedicate time based on your chosen role (flexible scheduling available)</li>
              <li>Strong communication skills and collaborative spirit</li>
              <li>For editorial roles, basic research skills and attention to detail are preferred</li>
              <li>No prior experience required for most roles – training is provided!</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How to Apply for Volunteering */}
      <section className="volunteer-apply-section">
        <div className="section-container">
          <h2>How to Apply</h2>
          <div className="apply-content">
            <p>Ready to make a difference? Here's how to get started:</p>
            <ul>
              <li>
                <strong>Email us:</strong> Send your application to{' '}
                <a href="mailto:volunteers@sentineldigest.com" className="apply-email">
                  volunteers@sentineldigest.com
                </a>
              </li>
              <li>
                <strong>Include:</strong>
                <ul>
                  <li>Your CV or resume (if applicable)</li>
                  <li>A brief statement of interest (200-300 words) explaining why you want to volunteer</li>
                  <li>Your preferred volunteer role(s)</li>
                  <li>Your availability and time commitment</li>
                </ul>
              </li>
              <li>
                <strong>Subject line:</strong> Use "Volunteer Application - [Your Preferred Role]"
              </li>
            </ul>
            <p>
              <strong>Response time:</strong> We aim to respond within two weeks. Selected volunteers will be contacted for a brief interview 
              or orientation session.
            </p>
          </div>
        </div>
      </section>

      {/* Volunteer Commitment Statement */}
      <section className="volunteer-commitment-section">
        <div className="section-container">
          <h2>Our Commitment to Volunteers</h2>
          <div className="commitment-grid">
            <div className="commitment-card">
              <h3>Training & Support</h3>
              <p>We provide training and ongoing guidance from our experienced team members.</p>
            </div>
            <div className="commitment-card">
              <h3>Flexible Scheduling</h3>
              <p>We work with your schedule to find volunteer opportunities that fit your life.</p>
            </div>
            <div className="commitment-card">
              <h3>Safe Environment</h3>
              <p>We maintain a respectful, inclusive environment for all volunteers.</p>
            </div>
            <div className="commitment-card">
              <h3>Fair Recognition</h3>
              <p>Your contributions are valued and acknowledged appropriately.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="careers-footer-note">
        <div className="section-container">
          <p>
            Sentinel Digest is an equal opportunity organization committed to creating an inclusive environment.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Careers;
