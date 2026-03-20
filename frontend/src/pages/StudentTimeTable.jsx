import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import DashboardLayout from '../components/DashboardLayout';
import './Materials.css';

const StudentTimeTable = () => {
  const navigate = useNavigate();
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      navigate('/crash-course/login');
      return;
    }
    fetchTimeTable(studentId);
  }, [navigate]);

  const fetchTimeTable = async (studentId) => {
    try {
      const ttRes = await api.get(`/crashcourse/timetables/${studentId}`);
      if (ttRes.data.success) {
        setTimetables(ttRes.data.data);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Your access is currently inactive. Please contact admin.');
      } else {
        setError('Failed to load timetable');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (imageUrl, title) => {
    const cleanUrl = `${import.meta.env.VITE_SERVER_URL || ''}${imageUrl}`;
    try {
      const response = await fetch(cleanUrl);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      const ext = blob.type?.split('/')[1] || 'jpg';
      a.download = `${title || 'timetable'}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch {
      alert('Download failed. Please try again.');
    }
  };

  return (
    <DashboardLayout>
      <div className="materials-page">
        <div className="page-header">
          <h1>Time Table</h1>
          <p>View and download the latest class timetable</p>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading timetable...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <p>{error}</p>
          </div>
        ) : timetables.length === 0 ? (
          <div className="empty-state">
            <h3>No Time Table Yet</h3>
            <p>Time table image will appear here once uploaded.</p>
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
                    className="btn-download"
                    href={`${import.meta.env.VITE_SERVER_URL || ''}${tt.imageUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', justifyContent: 'center' }}
                  >
                    View Time Table
                  </a>

                  <button
                    className="btn-download"
                    onClick={() => handleDownload(tt.imageUrl, tt.title)}
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentTimeTable;
