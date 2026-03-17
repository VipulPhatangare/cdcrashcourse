import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import logo from '../assets/Both Logo.png';
import AuthPopupAlert from '../components/AuthPopupAlert';
import './StudentLogin.css';

const StudentLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setMessage({ type: 'error', text: 'Please enter email and password' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.post('/crashcourse/login', { 
        email, 
        password 
      });

      if (response.data.success) {
        const studentId = response.data.data.studentId;
        localStorage.setItem('studentId', studentId);
        localStorage.setItem('studentEmail', response.data.data.email);
        localStorage.setItem('studentName', response.data.data.name);
        
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
        setTimeout(() => {
          navigate('/crash-course/home');
        }, 1000);
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Login failed' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-login-container">
      <AuthPopupAlert message={message} onClose={() => setMessage({ type: '', text: '' })} />
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

      <div className="login-content">
        {/* Login Card */}
        <div className="login-card">
          <div className="card-logo">
            <img src={logo} alt="Campus Dekho" />
          </div>
          <div className="login-header">
            <h2>Student Login</h2>
            <p>Enter your credentials to access your profile</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
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

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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

            <div className="forgot-password-link">
              <Link to="/crash-course/forgot-password">Forgot Password?</Link>
            </div>

            <button 
              type="submit" 
              className="btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account? <Link to="/crash-course/register">Register here</Link>
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

export default StudentLogin;
