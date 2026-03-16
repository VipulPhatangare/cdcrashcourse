import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import DashboardLayout from '../components/DashboardLayout';
import './Events.css';

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      navigate('/crash-course/login');
      return;
    }
    fetchEvents();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/crashcourse/events');
      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="events-page">
        <div className="page-header">
          <h1>Upcoming Events</h1>
          <p>Live sessions, webinars, and workshops with Zoom links</p>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading events...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <p>{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <h3>No Upcoming Events</h3>
            <p>Events and live sessions will be announced here. Check back soon!</p>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event._id} className="event-card">
                <div className="event-header">
                  <div className="event-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <div className="event-meta">
                    <span className="event-date">{event.date}</span>
                    <span className="event-time">{event.time}</span>
                  </div>
                  <span className="event-badge">Live Session</span>
                </div>

                <div className="event-body">
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                </div>

                <div className="event-footer">
                  <a
                    href={event.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-join-zoom"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.899L15 14"></path>
                      <rect x="1" y="6" width="14" height="12" rx="2" ry="2"></rect>
                    </svg>
                    Join Zoom Meeting
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Events;
