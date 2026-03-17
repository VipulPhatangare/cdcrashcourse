import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import logo from '../assets/Both Logo.png';
import AuthPopupAlert from '../components/AuthPopupAlert';
import './AdminLogin.css';

const TeacherLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.post('/teacher/login', formData);

      if (response.data.success) {
        // Store token
        localStorage.setItem('teacherToken', response.data.data.token);
        localStorage.setItem('teacherName', response.data.data.teacher.name);
        localStorage.setItem('teacherEmail', response.data.data.teacher.email);
        localStorage.setItem('teacherId', response.data.data.teacher.id);

        setMessage({ type: 'success', text: 'Login successful!' });

        // Navigate to dashboard
        setTimeout(() => {
          navigate('/teacher/dashboard');
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
    <div className="admin-login-container">
      <AuthPopupAlert message={message} onClose={() => setMessage({ type: '', text: '' })} />
      <div className="login-card">
        <div className="login-header">
          <img src={logo} alt="Campus Dekho" className="login-logo" />
          <h2>Teacher Login</h2>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter teacher email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
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

          <button
            type="submit"
            className="btn-login"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div style={{ marginTop: '12px', textAlign: 'right' }}>
            <Link to="/teacher/forgot-password" style={{ color: '#0d61aa', fontWeight: 600, textDecoration: 'none' }}>
              Forgot Password?
            </Link>
          </div>
        </form>

        <div className="login-footer">
          <p>Crash Course Teacher Panel</p>
          <p style={{ marginTop: '8px' }}>
            New teacher? <Link to="/teacher/register" style={{ color: '#0d61aa', fontWeight: '600' }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;
