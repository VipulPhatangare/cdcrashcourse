import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import './Support.css';

const Support = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      navigate('/crash-course/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Query submitted successfully! We will get back to you soon.');
    setFormData({ subject: '', message: '' });
  };

  return (
    <DashboardLayout>
      <div className="support-page">
        <div className="page-header">
          <h1>Support Center</h1>
          <p>Need help? We're here to assist you</p>
        </div>

        {/* Support Header */}
        <section className="support-header-section">
          <div className="support-banner">
            <div className="banner-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div className="banner-content">
              <h2>Need Help? Contact Campus Dekho Support Team</h2>
              <p>We're available 24/7 to help you with any questions or concerns</p>
            </div>
          </div>
        </section>

        {/* Quick Support Options */}
        <section className="quick-support-section">
          <h2 className="section-title">Quick Support Options</h2>
          <div className="support-options-grid">
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="support-option-card whatsapp">
              <div className="option-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3>WhatsApp Support</h3>
              <p>Get instant help via WhatsApp</p>
              <span className="option-badge">Available 24/7</span>
            </a>

            <a href="mailto:support@campusdekho.ai" className="support-option-card email">
              <div className="option-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h3>Email Support</h3>
              <p>Send us an email for detailed queries</p>
              <span className="option-badge">Response in 24 hrs</span>
            </a>

            <button className="support-option-card phone">
              <div className="option-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <h3>Phone Support</h3>
              <p>Call us for immediate assistance</p>
              <span className="option-badge">Mon-Sat 9AM-6PM</span>
            </button>
          </div>
        </section>

        {/* Query Submission Form */}
        <section className="query-form-section">
          <h2 className="section-title">Submit Your Query</h2>
          <div className="query-form-card">
            <form onSubmit={handleSubmit} className="query-form">
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter subject of your query"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your query in detail..."
                  rows="6"
                  required
                />
              </div>
              <button type="submit" className="submit-query-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                Submit Query
              </button>
            </form>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-card">
              <h3>When will my payment be verified?</h3>
              <p>Payment verification typically takes 24-48 hours. You'll receive an email once verified.</p>
            </div>
            <div className="faq-card">
              <h3>How do I access course materials?</h3>
              <p>Once your payment is verified, you can access all materials from the Materials section.</p>
            </div>
            <div className="faq-card">
              <h3>What if I miss a live session?</h3>
              <p>All sessions are recorded and will be available in your dashboard after the session ends.</p>
            </div>
            <div className="faq-card">
              <h3>Can I get a refund?</h3>
              <p>Refund requests can be made within 24 hours of registration. Contact support for assistance.</p>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Support;
