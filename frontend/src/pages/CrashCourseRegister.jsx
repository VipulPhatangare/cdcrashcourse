import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import logo from '../assets/Both Logo.png';
import AuthPopupAlert from '../components/AuthPopupAlert';
// PAYMENT DISABLED — imports no longer needed
// import paymentQR from '../assets/QR-code.jpg';
// import gpayScreenshot from '../assets/GPaYSampleScreenshot.jpeg';
// import phonePeScreenshot from '../assets/phonePaYSampleScreenshot.jpeg';
import './CrashCourseRegister.css';

const CrashCourseRegister = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',
    // PAYMENT DISABLED
    // transactionId: '',
    // paymentScreenshot: null
  });

  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // PAYMENT DISABLED
  // const [lightboxImg, setLightboxImg] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // PAYMENT DISABLED
  // const handleFileChange = (e) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     paymentScreenshot: e.target.files[0]
  //   }));
  // };

  // Send OTP
  const handleSendOTP = async () => {
    if (!formData.email) {
      setMessage({ type: 'error', text: 'Please enter your email' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.post('/crashcourse/send-otp', { email: formData.email });
      
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
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      setMessage({ type: 'error', text: 'Please enter OTP' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.post('/crashcourse/verify-otp', {
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
      setLoading(false);
    }
  };

  // Handle Step 1 - Personal Information (now directly registers, payment step removed)
  const handleStep1Submit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email || !formData.password || !formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (!emailVerified) {
      setMessage({ type: 'error', text: 'Please verify your email first' });
      return;
    }

    // PAYMENT DISABLED — submit registration directly (course is free)
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.post('/crashcourse/register', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      if (response.data.success) {
        localStorage.setItem('studentId', response.data.data.studentId);
        setCurrentStep(3);
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

  // PAYMENT DISABLED
  // const handleStep2Submit = async (e) => {
  //   e.preventDefault();
  //   if (!formData.transactionId || !formData.paymentScreenshot) {
  //     setMessage({ type: 'error', text: 'Please provide transaction ID and payment screenshot' });
  //     return;
  //   }
  //   setLoading(true);
  //   setMessage({ type: '', text: '' });
  //   try {
  //     const formDataToSend = new FormData();
  //     formDataToSend.append('name', formData.name);
  //     formDataToSend.append('email', formData.email);
  //     formDataToSend.append('phone', formData.phone);
  //     formDataToSend.append('password', formData.password);
  //     formDataToSend.append('transactionId', formData.transactionId);
  //     formDataToSend.append('paymentScreenshot', formData.paymentScreenshot);
  //     const response = await api.post('/crashcourse/register', formDataToSend, {
  //       headers: { 'Content-Type': 'multipart/form-data' }
  //     });
  //     if (response.data.success) {
  //       localStorage.setItem('studentId', response.data.data.studentId);
  //       setCurrentStep(3);
  //     }
  //   } catch (error) {
  //     setMessage({
  //       type: 'error',
  //       text: error.response?.data?.message || 'Registration failed'
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Navigate to profile
  const handleViewProfile = () => {
    navigate('/crash-course/my-profile');
  };

  return (
    <div className="register-container">
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

      <div className="register-content">
        <div className="register-card">
          <div className="card-logo">
            <img src={logo} alt="Campus Dekho" />
          </div>
          {/* Progress Bar */}
          <div className="progress-bar">
            <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Personal Info</div>
            </div>
            {/* PAYMENT DISABLED — step 2 removed */}
            {/* <div className={`progress-line ${currentStep >= 2 ? 'active' : ''}`}></div>
            <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Payment</div>
            </div> */}
            <div className={`progress-line ${currentStep >= 3 ? 'active' : ''}`}></div>
            <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Success</div>
            </div>
          </div>

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <form onSubmit={handleStep1Submit} className="step-form">
              <h2>Personal Information</h2>
              
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
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter 10-digit phone number"
                  pattern="[0-9]{10}"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <div className="email-verification">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    disabled={emailVerified}
                    required
                  />
                  {!emailVerified && (
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      className="btn-send-otp"
                      disabled={loading || !formData.email}
                    >
                      {otpSent ? 'Resend OTP' : 'Send OTP'}
                    </button>
                  )}
                  {emailVerified && (
                    <span className="verified-badge">Verified</span>
                  )}
                </div>
              </div>

              {otpSent && !emailVerified && (
                <div className="form-group">
                  <label>Enter OTP *</label>
                  <div className="otp-verification">
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
                      className="btn-verify-otp"
                      disabled={loading}
                    >
                      Verify OTP
                    </button>
                  </div>
                  <small>Check your email for OTP (valid for 10 minutes)</small>
                </div>
              )}

              <div className="form-group">
                <label>Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password (min 6 characters)"
                    minLength="6"
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
                    placeholder="Re-enter your password"
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

              <button
                type="submit"
                className="btn-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register Now'}
              </button>
            </form>
          )}

          {/* PAYMENT DISABLED — Step 2 (Payment) removed */}
          {/* {currentStep === 2 && (
            <form onSubmit={handleStep2Submit} className="step-form">
              <h2>Payment</h2>
              <div className="payment-info">
                <div className="payment-amount"><h3>Course Fee: ₹999</h3></div>
                <div className="qr-section">
                  <h4>Scan QR Code to Pay</h4>
                  <div className="qr-image-wrapper">
                    <img src={paymentQR} alt="Payment QR Code" className="qr-image" />
                  </div>
                  <p className="payment-instructions">
                    After payment, upload the screenshot and enter transaction ID below
                  </p>
                </div>
              </div>
              <div className="form-group">
                <label>Transaction ID *</label>
                <input type="text" name="transactionId" value={formData.transactionId}
                  onChange={handleChange} placeholder="Enter transaction ID from payment app" required />
              </div>
              <div className="form-group">
                <label>Payment Screenshot *</label>
                <input type="file" accept="image/*" onChange={handleFileChange} required />
                {formData.paymentScreenshot && (
                  <small className="file-selected">Selected: {formData.paymentScreenshot.name}</small>
                )}
              </div>
              <div className="sample-screenshots">
                <h4>Sample Payment Screenshots</h4>
                <p className="sample-hint">Your screenshot should look similar to one of these:</p>
                <div className="sample-grid">
                  <div className="sample-item">
                    <img src={gpayScreenshot} alt="Google Pay sample screenshot" />
                    <button className="view-full-btn" onClick={() => setLightboxImg({ src: gpayScreenshot, label: 'Google Pay' })}>View Full Image</button>
                    <span>Google Pay</span>
                  </div>
                  <div className="sample-item">
                    <img src={phonePeScreenshot} alt="PhonePe sample screenshot" />
                    <button className="view-full-btn" onClick={() => setLightboxImg({ src: phonePeScreenshot, label: 'PhonePe' })}>View Full Image</button>
                    <span>PhonePe</span>
                  </div>
                </div>
              </div>
              <div className="button-group">
                <button type="button" onClick={() => setCurrentStep(1)} className="btn-secondary">Back</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Registration'}
                </button>
              </div>
            </form>
          )} */}

          {/* Step 3: Success */}
          {currentStep === 3 && (
            <div className="success-message">
              <div className="success-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h2>Registration Successful!</h2>
              <p>
                Thank you for registering for the <strong>Campus Dekho Crash Course</strong>.
              </p>
              <p>
                You now have full access to course materials and live sessions.
              </p>
              <button 
                onClick={handleViewProfile}
                className="btn-primary btn-full"
              >
                View My Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PAYMENT DISABLED — Lightbox removed */}
      {/* {lightboxImg && (
        <div className="lightbox-overlay" onClick={() => setLightboxImg(null)}>
          <div className="lightbox-box" onClick={e => e.stopPropagation()}>
            <div className="lightbox-header">
              <span>{lightboxImg.label} — Sample Screenshot</span>
              <button className="lightbox-close" onClick={() => setLightboxImg(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <img src={lightboxImg.src} alt={lightboxImg.label} className="lightbox-img" />
          </div>
        </div>
      )} */}

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

export default CrashCourseRegister;
