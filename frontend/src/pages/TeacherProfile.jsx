import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import TeacherDashboardLayout from '../components/TeacherDashboardLayout';

const TeacherProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const token = localStorage.getItem('teacherToken');
    if (!token) {
      navigate('/teacher');
      return;
    }

    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/teacher/profile');
      if (response.data.success) {
        setProfile(response.data.data);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const initials = profile?.name
    ? profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'T';

  return (
    <TeacherDashboardLayout>
      <div className="materials-page">
        <div className="page-header">
          <h1>My Profile</h1>
          <p>Account details for your teacher dashboard</p>
        </div>

        {message.text && (
          <div style={{
            marginBottom: '16px',
            padding: '12px 14px',
            borderRadius: '8px',
            background: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fecaca'
          }}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        ) : profile ? (
          <div className="teacher-profile-card">
            <div className="teacher-profile-left">
              <div className="teacher-profile-avatar">
                {initials}
              </div>
              <h2 className="teacher-profile-name">{profile.name}</h2>
              <p className="teacher-profile-email">{profile.email}</p>
            </div>

            <div>
              <h3 className="teacher-profile-title">Teacher Information</h3>
              <div className="teacher-profile-details">
                <div>
                  <p className="teacher-profile-label">Subject</p>
                  <p className="teacher-profile-value">{profile.subject || 'Not added yet'}</p>
                </div>
                <div>
                  <p className="teacher-profile-label">Phone</p>
                  <p className="teacher-profile-value">{profile.phone || 'Not added yet'}</p>
                </div>
                <div>
                  <p className="teacher-profile-label">Registered On</p>
                  <p className="teacher-profile-value">
                    {profile.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <style jsx>{`
        .teacher-profile-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 24px;
          display: grid;
          grid-template-columns: minmax(220px, 280px) 1fr;
          gap: 24px;
        }

        .teacher-profile-left {
          text-align: center;
          border-right: 1px solid #e5e7eb;
          padding-right: 24px;
        }

        .teacher-profile-avatar {
          width: 88px;
          height: 88px;
          margin: 0 auto 12px;
          border-radius: 50%;
          background: #0d61aa;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.5rem;
        }

        .teacher-profile-name {
          margin: 0;
          color: #111827;
        }

        .teacher-profile-email {
          margin: 6px 0 0;
          color: #6b7280;
          word-break: break-word;
        }

        .teacher-profile-title {
          margin-top: 0;
          color: #0d61aa;
        }

        .teacher-profile-details {
          display: grid;
          gap: 14px;
        }

        .teacher-profile-label {
          margin: 0 0 4px;
          font-size: 0.85rem;
          color: #6b7280;
        }

        .teacher-profile-value {
          margin: 0;
          color: #111827;
          font-weight: 600;
          word-break: break-word;
        }

        @media (max-width: 900px) {
          .teacher-profile-card {
            grid-template-columns: 1fr;
            padding: 18px;
            gap: 18px;
          }

          .teacher-profile-left {
            border-right: none;
            border-bottom: 1px solid #e5e7eb;
            padding-right: 0;
            padding-bottom: 16px;
          }
        }
      `}</style>
    </TeacherDashboardLayout>
  );
};

export default TeacherProfile;
