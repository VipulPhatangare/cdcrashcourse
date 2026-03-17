import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import logo from '../assets/Both Logo.png';
import AuthPopupAlert from '../components/AuthPopupAlert';
import './ForgotPassword.css';

const TeacherForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [countdown, setCountdown] = useState(0);

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.post('/teacher/forgot-password', { email });

      if (response.data.success) {
        setStep(2);
        setMessage({ type: 'success', text: 'OTP sent to your email' });
        startCountdown();
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to send OTP'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setMessage({ type: 'error', text: 'Please enter valid 6-digit OTP' });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.post('/teacher/reset-password', {
        email,
        otp,
        newPassword
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Password reset successful! Redirecting to login...' });
        setTimeout(() => {
          navigate('/teacher');
        }, 2000);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Password reset failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    setOtp('');
    await handleSendOTP({ preventDefault: () => {} });
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="forgot-password-container">
      <AuthPopupAlert message={message} onClose={() => setMessage({ type: '', text: '' })} />
      <nav className="navbar">
        <div className="nav-content">
          <Link to="/teacher" className="logo-link">
            <img src={logo} alt="Campus Dekho" className="logo" />
          </Link>
          <div className="nav-links">
            <Link to="/teacher" className="student-link">Teacher Login</Link>
            <Link to="/teacher/register" className="register-link">Register</Link>
          </div>
        </div>
      </nav>

      <div className="forgot-password-content">
        <div className="forgot-password-card">
          <div className="forgot-password-header">
            <h2>Teacher Reset Password</h2>
            <p>{step === 1 ? 'Enter your email to receive OTP' : 'Enter OTP and new password'}</p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="forgot-password-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  required
                />
              </div>

              <button type="submit" className="btn-primary btn-full" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="forgot-password-form">
              <div className="form-group">
                <label htmlFor="otp">Enter OTP</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  required
                />
                <small className="help-text">OTP sent to {email}</small>
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    minLength="6"
                    required
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                    onClick={() => setShowNewPassword(!showNewPassword)}
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
                    {showNewPassword ? (
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
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    minLength="6"
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

              <button type="submit" className="btn-primary btn-full" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>

              <div className="resend-section">
                {countdown > 0 ? (
                  <p>Resend OTP in {countdown}s</p>
                ) : (
                  <button type="button" onClick={handleResendOTP} className="btn-link">
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setMessage({ type: '', text: '' });
                }}
                className="btn-secondary btn-full"
              >
                Change Email
              </button>
            </form>
          )}

          <div className="forgot-password-footer">
            <p>Remember your password? <Link to="/teacher">Login here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherForgotPassword;
