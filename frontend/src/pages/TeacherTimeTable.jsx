import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import TeacherDashboardLayout from '../components/TeacherDashboardLayout';
import './Materials.css';

const TeacherTimeTable = () => {
  const navigate = useNavigate();
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null
  });
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    const token = localStorage.getItem('teacherToken');
    if (!token) {
      navigate('/teacher');
      return;
    }
    fetchTimeTables();
  }, [navigate]);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
  };

  const fetchTimeTables = async () => {
    try {
      const response = await api.get('/teacher/timetables');
      if (response.data.success) {
        setTimetables(response.data.data);
      }
    } catch {
      showToast('error', 'Failed to load timetable');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.image) {
      showToast('error', 'Please provide timetable title and image file');
      return;
    }

    setUploading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('image', formData.image);

      const response = await api.post('/teacher/timetables', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        showToast('success', 'Time table uploaded successfully!');
        setFormData({ title: '', description: '', image: null });
        const input = document.getElementById('tt-file-input');
        if (input) input.value = '';
        fetchTimeTables();
      }
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Timetable upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteTimeTable = async (id, title) => {
    const shouldDelete = window.confirm(`Delete timetable "${title}"?`);
    if (!shouldDelete) return;

    try {
      const response = await api.delete(`/teacher/timetables/${id}`);
      if (response.data.success) {
        showToast('success', 'Time table deleted successfully');
        fetchTimeTables();
      }
    } catch {
      showToast('error', 'Failed to delete timetable');
    }
  };

  return (
    <TeacherDashboardLayout>
      {toast.show && (
        <div className={`toast-notification toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="materials-page">
        <div className="page-header">
          <h1>Time Table</h1>
          <p>Upload and manage class timetable images</p>
        </div>

        <div className="upload-card" style={{ marginTop: '0' }}>
          <h2>Upload Time Table (Image)</h2>
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-row">
              <div className="form-group">
                <label>Time Table Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Weekly Batch Schedule"
                  required
                />
              </div>
              <div className="form-group">
                <label>Image File *</label>
                <input
                  id="tt-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Optional note for students"
                rows="3"
              />
            </div>
            <button type="submit" className="btn-upload" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Time Table'}
            </button>
          </form>
        </div>

        <div className="materials-list-section" style={{ marginTop: '24px' }}>
          <h2>Uploaded Time Tables</h2>
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading timetable...</p>
            </div>
          ) : timetables.length === 0 ? (
            <div className="empty-state">
              <h3>No Time Table Yet</h3>
              <p>Upload your first timetable image</p>
            </div>
          ) : (
            <div className="materials-grid">
              {timetables.map((tt) => (
                <div key={tt._id} className="material-card">
                  <div className="material-info">
                    <h3>{tt.title}</h3>
                    <p>{tt.description || 'No description provided'}</p>
                    <span className="material-date">
                      Uploaded: {new Date(tt.uploadedAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <a
                      href={`${import.meta.env.VITE_SERVER_URL || ''}${tt.imageUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-upload"
                      style={{ textDecoration: 'none', padding: '8px 12px' }}
                    >
                      View
                    </a>
                    <button
                      className="btn-delete-material"
                      onClick={() => handleDeleteTimeTable(tt._id, tt.title)}
                    >
                      Delete
                    </button>
                  </div>
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
      `}</style>
    </TeacherDashboardLayout>
  );
};

export default TeacherTimeTable;
