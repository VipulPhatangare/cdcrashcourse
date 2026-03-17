import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import logo from '../assets/Both Logo.png';
import AuthPopupAlert from '../components/AuthPopupAlert';
import './AdminLogin.css';

const TeacherRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
    subject: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'email') {
      setEmailVerified(false);
      setOtpSent(false);
    }
  };

  const handleSendOTP = async () => {
    if (!formData.email) {
      setMessage({ type: 'error', text: 'Please enter your email' });
      return;
    }

    setOtpLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.post('/teacher/send-otp', { email: formData.email });
      if (response.data.success) {
        setOtpSent(true);
        setMessage({ type: 'success', text: 'OTP sent to your email!' });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to send OTP'
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      setMessage({ type: 'error', text: 'Please enter OTP' });
      return;
    }

    setOtpLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.post('/teacher/verify-otp', {
        email: formData.email,
        otp: formData.otp
      });

      if (response.data.success) {
        setEmailVerified(true);
        setMessage({ type: 'success', text: 'Email verified successfully!' });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Invalid OTP'
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validation
    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    if (!emailVerified) {
      setMessage({ type: 'error', text: 'Please verify your email with OTP first' });
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/teacher/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        subject: formData.subject,
        phone: formData.phone
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Registration successful! Redirecting to login...' });
        setTimeout(() => {
          navigate('/teacher');
        }, 2000);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Registration failed'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <AuthPopupAlert message={message} onClose={() => setMessage({ type: '', text: '' })} />
      <div className="login-card" style={{ maxWidth: '500px' }}>
        <div className="login-header">
          <img src={logo} alt="Campus Dekho" className="login-logo" />
          <h2>Teacher Registration</h2>
          <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '8px 0 0' }}>
            Create your teacher account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={emailVerified}
              />
              {!emailVerified && (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={otpLoading || !formData.email}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #0d61aa',
                    background: '#eff6ff',
                    color: '#0d61aa',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {otpSent ? 'Resend OTP' : 'Send OTP'}
                </button>
              )}
            </div>
            {emailVerified && (
              <small style={{ color: '#059669', fontWeight: 600 }}>Email verified</small>
            )}
          </div>

          {otpSent && !emailVerified && (
            <div className="form-group">
              <label>Enter OTP *</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  required
                />
                <button
                  type="button"
                  onClick={handleVerifyOTP}
                  disabled={otpLoading}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #059669',
                    background: '#ecfdf3',
                    color: '#059669',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Verify OTP
                </button>
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Subject/Specialization</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g., Mathematics, Physics"
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password (min 6 characters)"
                required
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
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
                {showPassword ? (
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

          <div className="form-group">
            <label>Confirm Password *</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {showConfirmPassword ? (
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

          <button
            type="submit"
            className="btn-login"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="login-footer">
          <p>Already have an account? <Link to="/teacher" style={{ color: '#0d61aa', fontWeight: '600' }}>Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default TeacherRegister;
