import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import api from '../api/axios';
import './StudentProfile.css';

const StudentProfile = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editData, setEditData] = useState({ name: '', phone: '', profilePhoto: null });

  // Change Password state
  const [changingPassword, setChangingPassword] = useState(false);
  const [cpStep, setCpStep] = useState(1); // 1 = send OTP, 2 = verify OTP + set new pass
  const [cpOtp, setCpOtp] = useState('');
  const [cpNewPassword, setCpNewPassword] = useState('');
  const [cpConfirm, setCpConfirm] = useState('');
  const [cpSending, setCpSending] = useState(false);
  const [cpSubmitting, setCpSubmitting] = useState(false);
  const [cpMessage, setCpMessage] = useState({ type: '', text: '' });
  const [showCpNewPassword, setShowCpNewPassword] = useState(false);
  const [showCpConfirmPassword, setShowCpConfirmPassword] = useState(false);

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      navigate('/crash-course/login');
      return;
    }
    fetchProfile(studentId);
  }, [navigate]);

  const fetchProfile = async (id) => {
    try {
      const res = await api.get(`/crashcourse/profile/${id}`);
      if (res.data.success) {
        setStudent(res.data.data);
        setEditData({ name: res.data.data.name, phone: res.data.data.phone, profilePhoto: null });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setEditData(prev => ({ ...prev, profilePhoto: e.target.files[0] }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    const studentId = localStorage.getItem('studentId');
    try {
      const formData = new FormData();
      formData.append('name', editData.name);
      formData.append('phone', editData.phone);
      if (editData.profilePhoto) {
        formData.append('profilePhoto', editData.profilePhoto);
      }
      const res = await api.patch(`/crashcourse/profile/${studentId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setStudent(res.data.data);
        localStorage.setItem('studentName', res.data.data.name);
        setEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleSendChangePasswordOTP = async () => {
    if (cpNewPassword.length < 6) {
      setCpMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    if (cpNewPassword !== cpConfirm) {
      setCpMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    setCpSending(true);
    setCpMessage({ type: '', text: '' });
    const studentId = localStorage.getItem('studentId');
    try {
      const res = await api.post('/crashcourse/change-password-otp', { studentId, newPassword: cpNewPassword });
      if (res.data.success) {
        setCpStep(2);
        setCpMessage({ type: 'success', text: res.data.message });
      }
    } catch (err) {
      setCpMessage({ type: 'error', text: err.response?.data?.message || 'Failed to send OTP' });
    } finally {
      setCpSending(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setCpSubmitting(true);
    const studentId = localStorage.getItem('studentId');
    try {
      const res = await api.post('/crashcourse/change-password', {
        studentId,
        otp: cpOtp,
        newPassword: cpNewPassword
      });
      if (res.data.success) {
        setCpMessage({ type: 'success', text: 'Password changed successfully!' });
        setTimeout(() => {
          setChangingPassword(false);
          setCpStep(1);
          setCpOtp('');
          setCpNewPassword('');
          setCpConfirm('');
          setCpMessage({ type: '', text: '' });
        }, 2000);
      }
    } catch (err) {
      setCpMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
    } finally {
      setCpSubmitting(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === 'Approved') return 'sp-badge approved';
    if (status === 'Rejected') return 'sp-badge rejected';
    return 'sp-badge pending';
  };

  const initials = student?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';

  if (loading) {
    return (
      <DashboardLayout>
        <div className="home-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="sp-page">
        <div className="sp-header">
          <h1>My Profile</h1>
          <p>View and manage your account information</p>
        </div>

        <div className="sp-grid">
          {/* Left: Avatar card */}
          <div className="sp-avatar-card">
            <div className="sp-avatar">
              {student?.profilePhoto ? (
                <img src={`${import.meta.env.VITE_SERVER_URL || ''}/${student.profilePhoto.replace(/\\/g, '/')}`} alt="Profile" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <h2 className="sp-name">{student?.name}</h2>
            <p className="sp-email">{student?.email}</p>
            {/* PAYMENT DISABLED — payment status badge hidden */}
            {/* <span className={getStatusClass(student?.paymentStatus)}>
              {student?.paymentStatus || 'Pending'}
            </span> */}

            {!editing && !changingPassword && (
              <button className="sp-edit-btn" onClick={() => setEditing(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit Profile
              </button>
            )}
            {!editing && !changingPassword && (
              <button className="sp-change-pass-btn" onClick={() => setChangingPassword(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Change Password
              </button>
            )}
          </div>

          {/* Right: Details / Edit form */}
          <div className="sp-details-card">
            {message.text && (
              <div className={`sp-message ${message.type}`}>{message.text}</div>
            )}

            {!editing && !changingPassword ? (
              <div className="sp-details">
                <h3 className="sp-section-title">Personal Information</h3>

                <div className="sp-row">
                  <div className="sp-label">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Full Name
                  </div>
                  <div className="sp-value">{student?.name}</div>
                </div>

                <div className="sp-row">
                  <div className="sp-label">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    Email
                  </div>
                  <div className="sp-value">{student?.email}</div>
                </div>

                <div className="sp-row">
                  <div className="sp-label">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    Phone
                  </div>
                  <div className="sp-value">{student?.phone}</div>
                </div>

                <h3 className="sp-section-title" style={{ marginTop: '28px' }}>Course Information</h3>

                <div className="sp-row">
                  <div className="sp-label">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    Course
                  </div>
                  <div className="sp-value">{student?.courseName}</div>
                </div>

                {/* PAYMENT DISABLED — Transaction ID, Payment Status, Payment Screenshot hidden */}
                {/* <div className="sp-row">
                  <div className="sp-label">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                    Transaction ID
                  </div>
                  <div className="sp-value">{student?.transactionId}</div>
                </div>

                <div className="sp-row">
                  <div className="sp-label">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    Payment Status
                  </div>
                  <div className="sp-value">
                    <span className={getStatusClass(student?.paymentStatus)}>
                      {student?.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="sp-row">
                  <div className="sp-label">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Payment Screenshot
                  </div>
                  <div className="sp-value">
                    {student?.paymentScreenshot ? (
                      <a
                        href={`http://localhost:5000/${student.paymentScreenshot}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sp-link"
                      >
                        View Screenshot
                      </a>
                    ) : (
                      <span style={{ color: '#aaa' }}>Not uploaded</span>
                    )}
                  </div>
                </div> */}

                <div className="sp-row">
                  <div className="sp-label">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Registered On
                  </div>
                  <div className="sp-value">
                    {student?.createdAt && new Date(student.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            ) : editing ? (
              <form onSubmit={handleUpdate} className="sp-form">
                <h3 className="sp-section-title">Edit Profile</h3>

                <div className="sp-form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="sp-form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editData.phone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    required
                    placeholder="10-digit mobile number"
                  />
                </div>

                <div className="sp-form-group">
                  <label>Profile Photo <span style={{ color: '#aaa', fontWeight: 400 }}>(optional)</span></label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="sp-btn-group">
                  <button
                    type="button"
                    className="sp-cancel-btn"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="sp-save-btn"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="sp-cp-form">
                <h3 className="sp-section-title">Change Password</h3>

                {cpMessage.text && (
                  <div className={`sp-message ${cpMessage.type}`}>{cpMessage.text}</div>
                )}

                {cpStep === 1 ? (
                  <div className="sp-form">
                    <div className="sp-form-group">
                      <label>New Password</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showCpNewPassword ? 'text' : 'password'}
                          value={cpNewPassword}
                          onChange={e => setCpNewPassword(e.target.value)}
                          placeholder="Min. 6 characters"
                          minLength={6}
                          style={{ paddingRight: '40px' }}
                        />
                        <button
                          type="button"
                          aria-label={showCpNewPassword ? 'Hide new password' : 'Show new password'}
                          onClick={() => setShowCpNewPassword(!showCpNewPassword)}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#6b7280',
                            padding: '4px'
                          }}
                        >
                          {showCpNewPassword ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                              <line x1="1" y1="1" x2="23" y2="23"/>
                            </svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="sp-form-group">
                      <label>Confirm New Password</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showCpConfirmPassword ? 'text' : 'password'}
                          value={cpConfirm}
                          onChange={e => setCpConfirm(e.target.value)}
                          placeholder="Re-enter new password"
                          style={{ paddingRight: '40px' }}
                        />
                        <button
                          type="button"
                          aria-label={showCpConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                          onClick={() => setShowCpConfirmPassword(!showCpConfirmPassword)}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#6b7280',
                            padding: '4px'
                          }}
                        >
                          {showCpConfirmPassword ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                              <line x1="1" y1="1" x2="23" y2="23"/>
                            </svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="sp-btn-group">
                      <button
                        type="button"
                        className="sp-cancel-btn"
                        onClick={() => { setChangingPassword(false); setCpNewPassword(''); setCpConfirm(''); setCpMessage({ type: '', text: '' }); }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="sp-save-btn"
                        onClick={handleSendChangePasswordOTP}
                        disabled={cpSending}
                      >
                        {cpSending ? 'Sending OTP...' : 'Continue'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleChangePassword} className="sp-form">
                    <div className="sp-cp-email-box">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      <p>OTP sent to <strong>{student?.email}</strong></p>
                    </div>
                    <div className="sp-form-group">
                      <label>Enter OTP</label>
                      <input
                        type="text"
                        className="otp-input"
                        value={cpOtp}
                        onChange={e => setCpOtp(e.target.value)}
                        placeholder="000000"
                        maxLength={6}
                        required
                      />
                    </div>
                    <div className="sp-btn-group">
                      <button
                        type="button"
                        className="sp-cancel-btn"
                        onClick={() => { setChangingPassword(false); setCpStep(1); setCpOtp(''); setCpNewPassword(''); setCpConfirm(''); setCpMessage({ type: '', text: '' }); }}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="sp-save-btn" disabled={cpSubmitting}>
                        {cpSubmitting ? 'Changing...' : 'Confirm & Save'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
