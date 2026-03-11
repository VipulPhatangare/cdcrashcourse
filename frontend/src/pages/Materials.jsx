import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import './Materials.css';

const Materials = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      navigate('/crash-course/login');
    }
  }, [navigate]);

  return (
    <DashboardLayout>
      <div className="materials-page">
        <div className="page-header">
          <h1>Study Materials</h1>
          <p>Access downloadable resources and study guides</p>
        </div>

        <div className="empty-state">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
          <h3>No Materials Yet</h3>
          <p>Study materials and resources will be uploaded here after your payment is verified.</p>
        </div>

        <section className="materials-info-section">
          <div className="info-card">
            <div className="info-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>
            <div className="info-content">
              <h3>Materials Coming Soon</h3>
              <p>We are constantly updating our library with new study materials, video lectures, and practice resources. Stay tuned!</p>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Materials;
