import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import './Events.css';

const Events = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      navigate('/crash-course/login');
    }
  }, [navigate]);

  return (
    <DashboardLayout>
      <div className="events-page">
        <div className="page-header">
          <h1>Upcoming Events</h1>
          <p>Register for webinars, workshops, and live sessions</p>
        </div>

        <div className="empty-state">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <h3>No Upcoming Events</h3>
          <p>Events and webinars will be announced here. Check back soon!</p>
        </div>

        <section className="past-events-section">
          <h2 className="section-title">Past Events</h2>
          <div className="past-events-card">
            <div className="empty-state">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <h3>No Past Events</h3>
              <p>Attended events will appear here</p>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Events;
