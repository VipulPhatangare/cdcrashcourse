import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import TeacherDashboardLayout from '../components/TeacherDashboardLayout';
import './Events.css';

const TeacherEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    zoomLink: '',
    date: '',
    time: ''
  });
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [confirmDialog, setConfirmDialog] = useState({ show: false, id: '', title: '' });

  useEffect(() => {
    const token = localStorage.getItem('teacherToken');
    if (!token) {
      navigate('/teacher');
      return;
    }
    fetchEvents();
  }, [navigate]);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
  };

  const fetchEvents = async () => {
    try {
      const response = await api.get('/teacher/events');
      if (response.data.success) {
        setEvents(response.data.data);
      }
    } catch (error) {
      showToast('error', 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.zoomLink || !formData.date || !formData.time) {
      showToast('error', 'Please fill all fields');
      return;
    }

    setSaving(true);
    try {
      const response = await api.post('/teacher/events', formData);

      if (response.data.success) {
        showToast('success', 'Event created successfully!');
        setFormData({ title: '', description: '', zoomLink: '', date: '', time: '' });
        fetchEvents();
      }
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to create event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id, title) => {
    setConfirmDialog({ show: true, id, title });
  };

  const confirmDelete = async () => {
    try {
      const response = await api.delete(`/teacher/events/${confirmDialog.id}`);
      if (response.data.success) {
        showToast('success', 'Event deleted successfully');
        fetchEvents();
      }
    } catch (error) {
      showToast('error', 'Failed to delete event');
    } finally {
      setConfirmDialog({ show: false, id: '', title: '' });
    }
  };

  return (
    <TeacherDashboardLayout>
      {/* Toast */}
      {toast.show && (
        <div className={`toast-notification toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog.show && (
        <div className="modal-overlay" onClick={() => setConfirmDialog({ show: false, id: '', title: '' })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Event</h3>
            <p>Are you sure you want to delete "{confirmDialog.title}"?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setConfirmDialog({ show: false, id: '', title: '' })}>
                Cancel
              </button>
              <button className="btn-delete" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="events-page">
        <div className="page-header">
          <h1>Live Events</h1>
          <p>Create and manage Zoom sessions for students</p>
        </div>

        {/* Create Form */}
        <div className="create-card">
          <h2>Create New Event</h2>
          <form onSubmit={handleSubmit} className="event-form">
            <div className="form-group">
              <label>Event Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Live Doubt Solving Session"
                required
              />
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what students will learn in this session"
                rows="3"
                required
              />
            </div>
            <div className="form-group">
              <label>Zoom Meeting Link *</label>
              <input
                type="url"
                name="zoomLink"
                value={formData.zoomLink}
                onChange={handleInputChange}
                placeholder="https://zoom.us/j/..."
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time *</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-create" disabled={saving}>
              {saving ? (
                <>
                  <svg className="spinner" width="18" height="18" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
                    <path d="M12 2 A10 10 0 0 1 22 12" stroke="currentColor" strokeWidth="4" fill="none"/>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Create Event
                </>
              )}
            </button>
          </form>
        </div>

        {/* Events List */}
        <div className="events-list-section">
          <h2>Scheduled Events</h2>
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="empty-state">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <h3>No Events Scheduled</h3>
              <p>Create your first event to schedule a Zoom session</p>
            </div>
          ) : (
            <div className="events-grid">
              {events.map((event) => (
                <div key={event._id} className="event-card">
                  <div className="event-date">
                    <div className="date-day">{new Date(event.date).getDate()}</div>
                    <div className="date-month">
                      {new Date(event.date).toLocaleDateString('en-IN', { month: 'short' })}
                    </div>
                  </div>
                  <div className="event-content">
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    <div className="event-meta">
                      <span className="event-time">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        {event.time}
                      </span>
                      <a href={event.zoomLink} target="_blank" rel="noopener noreferrer" className="zoom-link">
                        Join Zoom →
                      </a>
                    </div>
                  </div>
                  <button
                    className="btn-delete-event"
                    onClick={() => handleDelete(event._id, event.title)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .toast-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 14px 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 10000;
          font-weight: 500;
          animation: slideIn 0.3s ease;
        }
        .toast-success { border-left: 4px solid #10b981; color: #059669; }
        .toast-error { border-left: 4px solid #ef4444; color: #dc2626; }
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .modal-content {
          background: white;
          padding: 24px;
          border-radius: 12px;
          max-width: 400px;
          width: 90%;
        }
        .modal-content h3 {
          margin: 0 0 12px;
          color: #1f2937;
        }
        .modal-content p {
          margin: 0 0 20px;
          color: #6b7280;
        }
        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        .btn-cancel, .btn-delete {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
        }
        .btn-cancel {
          background: #f3f4f6;
          color: #374151;
        }
        .btn-delete {
          background: #ef4444;
          color: white;
        }
        .create-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          margin-bottom: 24px;
        }
        .create-card h2 {
          margin: 0 0 20px;
          color: #0d61aa;
          font-size: 1.25rem;
        }
        .event-form .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          color: #374151;
          font-size: 0.9rem;
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.9rem;
          font-family: inherit;
        }
        .form-group textarea {
          resize: vertical;
        }
        .btn-create {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #0d61aa;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-create:hover:not(:disabled) {
          background: #0a4d8a;
        }
        .btn-create:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .events-list-section h2 {
          margin: 0 0 20px;
          color: #1f2937;
          font-size: 1.25rem;
        }
        .events-grid {
          display: grid;
          gap: 20px;
        }
        .event-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 20px;
          align-items: start;
        }
        .event-date {
          width: 60px;
          text-align: center;
          padding: 12px 8px;
          background: linear-gradient(135deg, #0d61aa, #5ba425);
          color: white;
          border-radius: 10px;
        }
        .date-day {
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 4px;
        }
        .date-month {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        .event-content h3 {
          margin: 0 0 8px;
          color: #1f2937;
          font-size: 1.1rem;
        }
        .event-content p {
          margin: 0 0 12px;
          color: #6b7280;
          font-size: 0.9rem;
          line-height: 1.5;
        }
        .event-meta {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .event-time {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: #6b7280;
          font-weight: 500;
        }
        .zoom-link {
          color: #0d61aa;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.85rem;
        }
        .zoom-link:hover {
          text-decoration: underline;
        }
        .btn-delete-event {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          transition: background 0.2s;
          height: fit-content;
        }
        .btn-delete-event:hover {
          background: #fecaca;
        }
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #9ca3af;
        }
        .empty-state svg {
          margin-bottom: 16px;
        }
        .empty-state h3 {
          margin: 0 0 8px;
          color: #6b7280;
        }
        @media (max-width: 768px) {
          .event-form .form-row {
            grid-template-columns: 1fr;
          }
          .event-card {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </TeacherDashboardLayout>
  );
};

export default TeacherEvents;
