import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import DashboardLayout from '../components/DashboardLayout';
import './Support.css';

const Support = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState({ type: '', text: '' });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      navigate('/crash-course/login');
      return;
    }
    setSubmitting(true);
    setSubmitMsg({ type: '', text: '' });
    try {
      const res = await api.post('/crashcourse/queries', {
        studentId,
        subject: formData.subject,
        message: formData.message
      });
      if (res.data.success) {
        setSubmitMsg({ type: 'success', text: res.data.message });
        setFormData({ subject: '', message: '' });
      }
    } catch (err) {
      setSubmitMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit query. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
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

        {/* Query Submission Form */}
        <section className="query-form-section">
          <h2 className="section-title">Submit Your Query</h2>
          <div className="query-form-card">
            {submitMsg.text && (
              <div className={`query-msg query-msg-${submitMsg.type}`}>
                {submitMsg.text}
              </div>
            )}
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
              <button type="submit" className="submit-query-btn" disabled={submitting}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                {submitting ? 'Submitting...' : 'Submit Query'}
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
