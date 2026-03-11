import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import logo from '../assets/Both Logo.png';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP + Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [countdown, setCountdown] = useState(0);

  // Send OTP to email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.post('/crashcourse/forgot-password', { email });
      
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

  // Reset password
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
      const response = await api.post('/crashcourse/reset-password', { 
        email, 
        otp,
        newPassword
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Password reset successful! Redirecting to login...' });
        setTimeout(() => {
          navigate('/crash-course/login');
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

  // Resend OTP
  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setOtp('');
    await handleSendOTP({ preventDefault: () => {} });
  };

  // Countdown timer for resend
  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
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
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-content">
          <Link to="/crash-course" className="logo-link">
            <img src={logo} alt="Campus Dekho" className="logo" />
          </Link>
          <div className="nav-links">
            <Link to="/crash-course/login" className="student-link">Login</Link>
            <Link to="/crash-course/register" className="register-link">Register</Link>
          </div>
        </div>
      </nav>

      <div className="forgot-password-content">
        <div className="forgot-password-card">
          <div className="forgot-password-header">
            <h2>Reset Password</h2>
            <p>{step === 1 ? 'Enter your email to receive OTP' : 'Enter OTP and new password'}</p>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

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

              <button 
                type="submit" 
                className="btn-primary btn-full"
                disabled={loading}
              >
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
                <small className="help-text">
                  OTP sent to {email}
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  minLength="6"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  minLength="6"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>

              <div className="resend-section">
                {countdown > 0 ? (
                  <p>Resend OTP in {countdown}s</p>
                ) : (
                  <button 
                    type="button" 
                    onClick={handleResendOTP}
                    className="btn-link"
                  >
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
            <p>
              Remember your password? <Link to="/crash-course/login">Login here</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <img src={logo} alt="Campus Dekho" className="footer-logo" />
            <p className="footer-description">
              Your trusted counselling partner for Engineering, Pharmacy & Management admissions in Maharashtra.
            </p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/crash-course">Home</Link></li>
              <li><Link to="/crash-course/register">Register</Link></li>
              <li><Link to="/crash-course/login">Login</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Resources</h3>
            <ul className="footer-links">
              <li><a href="#">Blog & News</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contact</h3>
            <ul className="footer-contact">
              <li>campusdekho.ai</li>
              <li>info@campusdekho.ai</li>
              <li>+91 xxxxxxxxxx</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 Campus Dekho. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ForgotPassword;
