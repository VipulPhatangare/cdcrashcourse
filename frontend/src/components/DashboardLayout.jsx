import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import botLogo from '../assets/Both Logo.png';
import './DashboardLayout.css';

const NAV_ITEMS = [
  {
    to: '/crash-course/home',
    label: 'Home',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    )
  },
  {
    to: '/crash-course/events',
    label: 'Events',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    )
  },
  {
    to: '/crash-course/materials',
    label: 'Materials',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
      </svg>
    )
  },
  {
    to: '/crash-course/timetable',
    label: 'Time Table',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="16" rx="2"></rect>
        <line x1="3" y1="10" x2="21" y2="10"></line>
        <line x1="8" y1="4" x2="8" y2="20"></line>
      </svg>
    )
  },
  {
    to: '/crash-course/my-profile',
    label: 'Profile',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    )
  },
  {
    to: '/crash-course/support',
    label: 'Support',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    )
  }
];

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const studentId = localStorage.getItem('studentId');
  const studentName = localStorage.getItem('studentName') || 'Student';
  const studentEmail = localStorage.getItem('studentEmail') || '';
  const initials = studentName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentName');
    localStorage.removeItem('studentEmail');
    navigate('/crash-course/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="dashboard-layout">
      {/* Topbar - full width at top */}
      <header className="topbar">
        <button className="hamburger" onClick={() => setSidebarOpen(o => !o)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div className="topbar-brand">
          <img src={botLogo} alt="Campus Dekho" className="topbar-logo" />
          <span className="topbar-panel-type">Student Dashboard</span>
        </div>
        <div className="topbar-right">
          <Link to="/crash-course/my-profile" className="topbar-avatar">
            {initials}
          </Link>
        </div>
      </header>

      {/* Body: sidebar + content */}
      <div className="dashboard-body">
        <div
          className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
          onClick={closeSidebar}
        />

        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav className="sidebar-nav">
            {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-link${isActive ? ' nav-link-active' : ''}`
                  }
                  onClick={closeSidebar}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
            ))}
          </nav>

          <div className="sidebar-user">
            <div className="user-info">
              <Link to="/crash-course/my-profile" className="user-avatar" style={{ textDecoration: 'none' }}>{initials}</Link>
              <div>
                <p className="user-name">{studentName}</p>
                <p className="user-email">{studentEmail}</p>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="dashboard-main">
          <div className="page-content">
            {children}
          </div>
          {/* Footer - shown on all screen sizes */}
          <footer className="dash-footer">
            <div className="dash-footer-grid">
              <div className="dash-footer-col">
                <img src={botLogo} alt="Campus Dekho" className="dash-footer-logo" />
                <p>Your trusted counselling partner for Engineering admissions in Maharashtra.</p>
              </div>
              <div className="dash-footer-col">
                <h4>Quick Links</h4>
                <ul>
                  <li><Link to="/crash-course/home">Home</Link></li>
                  <li><Link to="/crash-course/events">Events</Link></li>
                  <li><Link to="/crash-course/materials">Materials</Link></li>
                  <li><Link to="/crash-course/timetable">Time Table</Link></li>
                  <li><Link to="/crash-course/support">Support</Link></li>
                </ul>
              </div>
              <div className="dash-footer-col">
                <h4>Resources</h4>
                <ul>
                  <li><Link to="/crash-course/materials">Study Materials</Link></li>
                  <li><Link to="/crash-course/timetable">Time Table</Link></li>
                  <li><Link to="/crash-course/events">Upcoming Events</Link></li>
                  <li><Link to="/crash-course/my-profile">My Profile</Link></li>
                </ul>
              </div>
              <div className="dash-footer-col">
                <h4>Contact</h4>
                <ul>
                  <li><a href="mailto:support@campusdekho.ai">support@campusdekho.ai</a></li>
                  <li><Link to="/crash-course/support">Help &amp; Support</Link></li>
                </ul>
              </div>
            </div>
            <p className="dash-footer-copy">&copy; 2026 Campus Dekho. All rights reserved.</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
