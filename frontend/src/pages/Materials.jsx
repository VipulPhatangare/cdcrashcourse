import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import DashboardLayout from '../components/DashboardLayout';
import './Materials.css';

const Materials = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      navigate('/crash-course/login');
      return;
    }
    fetchMaterials(studentId);
  }, [navigate]);

  const fetchMaterials = async (studentId) => {
    try {
      const res = await api.get(`/crashcourse/materials/${studentId}`);
      if (res.data.success) {
        setMaterials(res.data.data);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Your access is currently inactive. Please contact admin.');
      } else {
        setError('Failed to load materials');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (filePath, name) => {
    const url = `${import.meta.env.VITE_SERVER_URL || ''}/${filePath.replace(/\\/g, '/')}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = name + '.pdf';
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
          <h1>Study Materials</h1>
          <p>Access downloadable resources and study guides</p>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading materials...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <p>{error}</p>
          </div>
        ) : materials.length === 0 ? (
          <div className="empty-state">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <h3>No Materials Yet</h3>
            <p>Study materials will be uploaded here by the admin. Check back soon!</p>
          </div>
        ) : (
          <div className="materials-grid">
            {materials.map((material) => (
              <div key={material._id} className="material-card">
                <div className="material-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                </div>
                <div className="material-info">
                  <h3>{material.name}</h3>
                  <p>{material.description}</p>
                  <span className="material-date">
                    Uploaded: {new Date(material.uploadedAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <button
                  className="btn-download"
                  onClick={() => handleDownload(material.filePath, material.name)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Materials;
