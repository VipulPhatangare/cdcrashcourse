import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import DashboardLayout from '../components/DashboardLayout';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [latestMaterial, setLatestMaterial] = useState(null);
  const [materialsLoading, setMaterialsLoading] = useState(true);

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      navigate('/crash-course/login');
      return;
    }

    const fetchStudent = async () => {
      try {
        const res = await api.get(`/crashcourse/profile/${studentId}`);
        if (res.data.success) {
          setStudent(res.data.data);
        }
      } catch {
        setStudent({
          name: localStorage.getItem('studentName') || 'Student',
          email: localStorage.getItem('studentEmail') || '',
          paymentStatus: 'Pending',
          courseName: 'Campus Dekho Admission Crash Course'
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchLatestMaterial = async () => {
      setMaterialsLoading(true);
      try {
        const res = await api.get(`/crashcourse/materials/${studentId}`);
        if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const sorted = [...res.data.data].sort((a, b) =>
            new Date(b.uploadedAt || b.createdAt || 0) - new Date(a.uploadedAt || a.createdAt || 0)
          );
          setLatestMaterial(sorted[0]);
        } else {
          setLatestMaterial(null);
        }
      } catch {
        setLatestMaterial(null);
      } finally {
        setMaterialsLoading(false);
      }
    };

    fetchStudent();
    fetchLatestMaterial();
  }, [navigate]);

  const latestMaterialSeenId = localStorage.getItem('studentSeenLatestMaterialId');
  const hasUnseenLatestMaterial = Boolean(latestMaterial?._id && latestMaterialSeenId !== latestMaterial._id);

  const handleOpenMaterials = () => {
    if (latestMaterial?._id) {
      localStorage.setItem('studentSeenLatestMaterialId', latestMaterial._id);
    }
    navigate('/crash-course/materials');
  };

  // PAYMENT DISABLED
  // const getPaymentBadge = (status) => {
  //   const map = {
  //     Approved: { label: 'Payment Approved', cls: 'approved' },
  //     Rejected:  { label: 'Payment Rejected', cls: 'rejected' },
  //     Pending:   { label: 'Pending Verification', cls: 'pending' }
  //   };
  //   return map[status] || map.Pending;
  // };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="home-loading">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  // PAYMENT DISABLED
  // const badge = getPaymentBadge(student?.paymentStatus);

  return (
    <DashboardLayout>
      <div className="home-page">

        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="banner-content">
            <div className="welcome-text">
              <h1>Welcome back, {student?.name}</h1>
              <p>Continue your learning journey with Campus Dekho</p>
            </div>
            <div className="banner-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Enrolled Course */}
        <section className="course-section">
          <h2 className="section-title">Your Enrolled Course</h2>
          <div className="course-cards">
            <div className="course-card">
              <div className="course-header">
                <div className="course-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </div>
                {/* PAYMENT DISABLED — payment badge hidden */}
                {/* <span className={`course-badge ${badge.cls}`}>{badge.label}</span> */}
              </div>
              <h3 className="course-name">{student?.courseName}</h3>
              <div className="course-details">
                <div className="detail-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span>Email: <strong>{student?.email}</strong></span>
                </div>
                {student?.phone && (
                  <div className="detail-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 11.6 19.79 19.79 0 0 1 1.06 3a2 2 0 0 1 1.72-2.18L5.78.82A2 2 0 0 1 7.8 2.52a12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L6.78 8.7a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 20.5 15z"></path>
                    </svg>
                    <span>Phone: <strong>{student?.phone}</strong></span>
                  </div>
                )}
                {/* PAYMENT DISABLED — Payment Status and Transaction ID hidden */}
                {/* <div className="detail-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                  <span>Payment Status: <strong>{student?.paymentStatus}</strong></span>
                </div>
                {student?.transactionId && (
                  <div className="detail-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    <span>Transaction ID: <strong>{student?.transactionId}</strong></span>
                  </div>
                )} */}
              </div>
              <button
                className="course-action-btn"
                onClick={() => navigate('/crash-course/my-profile')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"></path>
                </svg>
                View Full Profile
              </button>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            <button className="action-card" onClick={() => navigate('/crash-course/events')}>
              <div className="action-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3>Events</h3>
              <p>View upcoming events</p>
            </button>
            <button className="action-card" onClick={() => navigate('/crash-course/my-profile')}>
              <div className="action-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3>My Profile</h3>
              <p>Manage your account</p>
            </button>
            <button
              className={`action-card action-card-material${hasUnseenLatestMaterial ? ' action-card-new-material' : ''}`}
              onClick={handleOpenMaterials}
            >
              <div className="action-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <h3>
                Latest Material
                {hasUnseenLatestMaterial && <span className="action-star">*</span>}
              </h3>
              {latestMaterial && (
                <div className="action-chip-row">
                  {hasUnseenLatestMaterial && <span className="action-new-chip">★ New Upload</span>}
                  <span className="action-date-chip">
                    {new Date(latestMaterial.uploadedAt || latestMaterial.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
              )}
              <p>
                {materialsLoading
                  ? 'Checking latest upload...'
                  : latestMaterial?.name || 'No material uploaded yet'}
              </p>
            </button>
            <button className="action-card" onClick={() => navigate('/crash-course/support')}>
              <div className="action-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <h3>Support</h3>
              <p>Get help</p>
            </button>
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
};

export default Home;
