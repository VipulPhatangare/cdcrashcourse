import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/Both Logo.png';
import c2cLogo from '../assets/C2C.png';
import studentsImg from '../assets/Gemini_Generated_Image_837l1o837l1o837l.png';
import './CrashCourseLanding.css';

const CrashCourseLanding = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to portal home
    const storedStudentId = localStorage.getItem('studentId');
    const storedName = localStorage.getItem('studentName');

    if (storedStudentId && storedName) {
      navigate('/crash-course/home', { replace: true });
      return;
    }
  }, [navigate]);

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-content">
          <img src={logo} alt="Campus Dekho" className="logo" />
          <div className="nav-links">
            <Link to="/crash-course/login" className="student-link">Login</Link>
            <Link to="/crash-course/register" className="register-link">Register</Link>
            <Link to="/admin" className="admin-link">Admin</Link>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="banner-container">
          <div className="banner-content">
            {/* Left Section - Branding */}
            <div className="banner-left">
              <div className="brand-logo">
                <img src={c2cLogo} alt="Campus Career" className="c2c-logo" />
              </div>
              <div className="brand-tagline">
                <span className="tagline-text">CAREER | SKILLS</span>
              </div>
              <div className="initiative-badge">
                <span className="initiative-text">Initiative by</span>
                <img src={logo} alt="Campus Dekho" className="initiative-logo" />
              </div>
            </div>

            {/* Center Section - Course Info */}
            <div className="banner-center">
              <h1 className="banner-title">
                <span className="title-main">MHT CET Engineering</span>
                <span className="title-sub">Crash Course 2026</span>
              </h1>
              <p className="banner-tagline">Boost Your Rank with Expert Guidance</p>
              <div className="students-image">
                <img src={studentsImg} alt="Students Learning" className="students-img" />
              </div>
            </div>

            {/* Right Section - Benefits */}
            <div className="banner-right">
              <ul className="benefits-list">
                <li className="benefit-item">
                  <span className="benefit-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                  </span>
                  <span className="benefit-text">Complete MHT CET Syllabus Revision</span>
                </li>
                <li className="benefit-item">
                  <span className="benefit-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="5"></circle>
                      <line x1="12" y1="1" x2="12" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="23"></line>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                      <line x1="1" y1="12" x2="3" y2="12"></line>
                      <line x1="21" y1="12" x2="23" y2="12"></line>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                  </span>
                  <span className="benefit-text">Important PYQs & Concept Tricks</span>
                </li>
                <li className="benefit-item">
                  <span className="benefit-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </span>
                  <span className="benefit-text">Daily Practice Tests</span>
                </li>
                <li className="benefit-item">
                  <span className="benefit-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </span>
                  <span className="benefit-text">Expert Faculty Guidance</span>
                </li>
                <li className="benefit-item">
                  <span className="benefit-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </span>
                  <span className="benefit-text">Limited Seats Available</span>
                </li>
              </ul>
              {!isLoggedIn && (
                <>
                  <Link to="/crash-course/register" className="register-now-btn">
                    Register Now
                  </Link>
                  <p className="corridor-text">The Admission Corridor</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-header">
          <h2 className="features-title">What You'll Get as a Student</h2>
          <p className="features-subtitle">Comprehensive resources and support for your MHT CET journey</p>
        </div>
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3>Expert Faculty</h3>
            <p>Learn from experienced educators with proven track records in MHT CET preparation</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <h3>Study Materials</h3>
            <p>Access comprehensive notes, video lectures, and practice resources tailored for success</p>
            <span className="feature-badge">Coming Soon</span>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
            <h3>Mock Tests</h3>
            <p>Regular practice tests with detailed analysis to track your progress and improve performance</p>
            <span className="feature-badge">Coming Soon</span>
          </div>
        </div>
      </section>

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

export default CrashCourseLanding;
