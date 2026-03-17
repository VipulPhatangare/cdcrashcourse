import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import logo from '../assets/Both Logo.png';
import './AdminDashboard.css';

const NAV_ITEMS = [
  {
    key: 'students',
    label: 'Students',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    )
  },
  {
    key: 'materials',
    label: 'Materials',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    )
  },
  {
    key: 'events',
    label: 'Events',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    )
  },
  {
    key: 'queries',
    label: 'Queries',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    )
  }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Tab ────────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('students');

  // ── Students ───────────────────────────────────────────────────────────────
  const [students, setStudents] = useState([]);
  const [statistics, setStatistics] = useState({
    totalRegistrations: 0,
    pendingPayments: 0,
    approvedPayments: 0,
    rejectedPayments: 0
  });
  const [loading, setLoading] = useState(true);
  // PAYMENT DISABLED
  // const [selectedImage, setSelectedImage] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false, title: '', message: '', onConfirm: null
  });

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState([]);

  const showToast = (type, text) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, text }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const dismissToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  // ── Materials ──────────────────────────────────────────────────────────────
  const [materials, setMaterials] = useState([]);
  const [matLoading, setMatLoading] = useState(false);
  const [matForm, setMatForm] = useState({ name: '', description: '', pdf: null });
  const [matUploading, setMatUploading] = useState(false);

  // ── Events ─────────────────────────────────────────────────────────────────
  const [events, setEvents] = useState([]);
  const [evtLoading, setEvtLoading] = useState(false);
  const [evtForm, setEvtForm] = useState({ title: '', description: '', zoomLink: '', date: '', time: '' });
  const [evtSaving, setEvtSaving] = useState(false);

  // ── Queries ────────────────────────────────────────────────────────────────
  const [queries, setQueries] = useState([]);
  const [qryLoading, setQryLoading] = useState(false);

  const adminEmail = localStorage.getItem('adminEmail') || 'Admin';

  // ── Init ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { navigate('/admin'); return; }
    fetchStudents();
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'materials' && materials.length === 0) fetchMaterials();
    if (activeTab === 'events' && events.length === 0) fetchEvents();
    if (activeTab === 'queries' && queries.length === 0) fetchQueries();
  }, [activeTab]);

  // ── Students ───────────────────────────────────────────────────────────────
  const fetchStudents = async () => {
    try {
      const res = await api.get('/admin/students');
      if (res.data.success) {
        setStudents(res.data.data.students);
        setStatistics(res.data.data.statistics);
      }
    } catch (err) {
      if (err.response?.status === 401) { localStorage.removeItem('adminToken'); navigate('/admin'); }
      else showToast('error', 'Failed to load student data');
    } finally { setLoading(false); }
  };

  // PAYMENT DISABLED — approve/reject handlers removed
  // const handleApprove = (id) => setConfirmDialog({
  //   isOpen: true, title: 'Approve Payment',
  //   message: 'Are you sure you want to approve this payment?',
  //   onConfirm: () => confirmApprove(id)
  // });
  // const confirmApprove = async (id) => {
  //   setConfirmDialog(p => ({ ...p, isOpen: false }));
  //   try {
  //     await api.patch(`/admin/approve/${id}`);
  //     showToast('success', 'Payment approved successfully!');
  //     fetchStudents();
  //   } catch { showToast('error', 'Failed to approve payment'); }
  // };
  // const handleReject = (id) => setConfirmDialog({
  //   isOpen: true, title: 'Reject Payment',
  //   message: 'Are you sure you want to reject this payment?',
  //   onConfirm: () => confirmReject(id)
  // });
  // const confirmReject = async (id) => {
  //   setConfirmDialog(p => ({ ...p, isOpen: false }));
  //   try {
  //     await api.patch(`/admin/reject/${id}`);
  //     showToast('success', 'Payment rejected');
  //     fetchStudents();
  //   } catch { showToast('error', 'Failed to reject payment'); }
  // };

  const handleDeleteStudent = (id) => setConfirmDialog({
    isOpen: true, title: 'Delete Student',
    message: 'Are you sure you want to delete this student? This action cannot be undone.',
    onConfirm: () => confirmDeleteStudent(id)
  });

  const confirmDeleteStudent = async (id) => {
    setConfirmDialog(p => ({ ...p, isOpen: false }));
    try {
      await api.delete(`/admin/students/${id}`);
      setStudents(prev => prev.filter(s => s._id !== id));
      showToast('success', 'Student deleted successfully');
    } catch { showToast('error', 'Failed to delete student'); }
  };

  // ── Materials ──────────────────────────────────────────────────────────────
  const fetchMaterials = async () => {
    setMatLoading(true);
    try {
      const res = await api.get('/admin/materials');
      if (res.data.success) setMaterials(res.data.data);
    } catch { showToast('error', 'Failed to load materials'); }
    finally { setMatLoading(false); }
  };

  const handleMatSubmit = async (e) => {
    e.preventDefault();
    if (!matForm.pdf) { showToast('error', 'Please select a PDF file'); return; }
    setMatUploading(true);
    try {
      const data = new FormData();
      data.append('name', matForm.name);
      data.append('description', matForm.description);
      data.append('pdf', matForm.pdf);
      const res = await api.post('/admin/materials', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data.success) {
        showToast('success', 'Material uploaded successfully!');
        setMatForm({ name: '', description: '', pdf: null });
        document.getElementById('mat-pdf-input').value = '';
        fetchMaterials();
      }
    } catch (err) { showToast('error', err.response?.data?.message || 'Upload failed'); }
    finally { setMatUploading(false); }
  };

  const handleDeleteMaterial = (id) => setConfirmDialog({
    isOpen: true, title: 'Delete Material',
    message: 'Are you sure you want to delete this material? This action cannot be undone.',
    onConfirm: () => confirmDeleteMaterial(id)
  });

  const confirmDeleteMaterial = async (id) => {
    setConfirmDialog(p => ({ ...p, isOpen: false }));
    try {
      await api.delete(`/admin/materials/${id}`);
      setMaterials(prev => prev.filter(m => m._id !== id));
      showToast('success', 'Material deleted');
    } catch { showToast('error', 'Failed to delete material'); }
  };

  // ── Events ─────────────────────────────────────────────────────────────────
  const fetchEvents = async () => {
    setEvtLoading(true);
    try {
      const res = await api.get('/admin/events');
      if (res.data.success) setEvents(res.data.data);
    } catch { showToast('error', 'Failed to load events'); }
    finally { setEvtLoading(false); }
  };

  const handleEvtSubmit = async (e) => {
    e.preventDefault();
    setEvtSaving(true);
    try {
      const res = await api.post('/admin/events', evtForm);
      if (res.data.success) {
        showToast('success', 'Event created successfully!');
        setEvtForm({ title: '', description: '', zoomLink: '', date: '', time: '' });
        fetchEvents();
      }
    } catch (err) { showToast('error', err.response?.data?.message || 'Failed to create event'); }
    finally { setEvtSaving(false); }
  };

  const handleDeleteEvent = (id) => setConfirmDialog({
    isOpen: true, title: 'Delete Event',
    message: 'Are you sure you want to delete this event? This action cannot be undone.',
    onConfirm: () => confirmDeleteEvent(id)
  });

  const confirmDeleteEvent = async (id) => {
    setConfirmDialog(p => ({ ...p, isOpen: false }));
    try {
      await api.delete(`/admin/events/${id}`);
      setEvents(prev => prev.filter(ev => ev._id !== id));
      showToast('success', 'Event deleted');
    } catch { showToast('error', 'Failed to delete event'); }
  };

  // ── Queries ────────────────────────────────────────────────────────────────
  const fetchQueries = async () => {
    setQryLoading(true);
    try {
      const res = await api.get('/admin/queries');
      if (res.data.success) setQueries(res.data.data);
    } catch { showToast('error', 'Failed to load queries'); }
    finally { setQryLoading(false); }
  };

  const handleResolveQuery = async (id) => {
    try {
      const res = await api.patch(`/admin/queries/${id}/resolve`);
      if (res.data.success) {
        setQueries(queries.map(q => q._id === id ? { ...q, status: 'Resolved' } : q));
        showToast('success', 'Query marked as resolved');
      }
    } catch { showToast('error', 'Failed to resolve query'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    navigate('/admin');
  };

  const handleTabClick = (key) => {
    setActiveTab(key);
    setSidebarOpen(false);
  };

  const openQueryCount = queries.filter(q => q.status === 'Open').length;

  if (loading) {
    return (
      <div className="admin-layout">
        <div className="admin-loading-screen">
          <div className="admin-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">

      {/* ── Topbar ──────────────────────────────────────────────────────────── */}
      <header className="admin-topbar">
        <button className="admin-hamburger" onClick={() => setSidebarOpen(o => !o)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <div className="admin-topbar-brand">
          <div className="admin-topbar-titles">
            <span className="admin-topbar-name">Campus Dekho</span>
            <span className="admin-topbar-sub">Admin Panel</span>
          </div>
        </div>

        <div className="admin-topbar-right">
          <div className="admin-topbar-user">
            <div className="admin-topbar-avatar">A</div>
            <div className="admin-topbar-info">
              <span className="admin-topbar-role">Admin</span>
              <span className="admin-topbar-email">{adminEmail}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="admin-topbar-logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="admin-body">

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
          {/* Logo block */}
          <div className="admin-sidebar-logo">
            <img src={logo} alt="Campus Dekho" className="admin-sidebar-logo-img" />
            <span className="admin-sidebar-portal-label">Admin Panel</span>
          </div>

          {/* Nav */}
          <nav className="admin-sidebar-nav">
            {NAV_ITEMS.map(item => (
              <button
                key={item.key}
                className={`admin-nav-link${activeTab === item.key ? ' active' : ''}`}
                onClick={() => handleTabClick(item.key)}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.key === 'queries' && openQueryCount > 0 && (
                  <span className="admin-nav-badge">{openQueryCount}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom user */}
          <div className="admin-sidebar-bottom">
            <div className="admin-sidebar-user">
              <div className="admin-sidebar-avatar">A</div>
              <div className="admin-sidebar-user-info">
                <p className="admin-sidebar-role">Administrator</p>
                <p className="admin-sidebar-email">{adminEmail}</p>
              </div>
            </div>
            <button className="admin-sidebar-logout" onClick={handleLogout}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>
        </aside>

        {/* ── Main Content ─────────────────────────────────────────────────── */}
        <main className="admin-main">
          <div className="admin-content">

            {/* Page heading row */}
            <div className="admin-page-heading">
              <div>
                <h2>
                  {NAV_ITEMS.find(n => n.key === activeTab)?.label}
                </h2>
                <p>
                  {activeTab === 'students' && 'Manage student registrations'}
                  {activeTab === 'materials' && 'Upload and manage PDF study materials'}
                  {activeTab === 'events' && 'Create and manage live sessions with Zoom links'}
                  {activeTab === 'queries' && 'View and resolve student support queries'}
                </p>
              </div>
            </div>

            {/* Stats — always visible */}
            <div className="stats-grid">
              <div className="stat-card stat-total">
                <div className="stat-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                  </svg>
                </div>
                <div className="stat-info"><h3>{statistics.totalRegistrations}</h3><p>Total Registrations</p></div>
              </div>
              {/* PAYMENT DISABLED — payment stat cards hidden */}
              {/* <div className="stat-card stat-pending">
                <div className="stat-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div className="stat-info"><h3>{statistics.pendingPayments}</h3><p>Pending Payments</p></div>
              </div>
              <div className="stat-card stat-approved">
                <div className="stat-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div className="stat-info"><h3>{statistics.approvedPayments}</h3><p>Approved Payments</p></div>
              </div>
              <div className="stat-card stat-rejected">
                <div className="stat-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                </div>
                <div className="stat-info"><h3>{statistics.rejectedPayments}</h3><p>Rejected Payments</p></div>
              </div> */}
            </div>

            {/* ── STUDENTS ──────────────────────────────────────────────────── */}
            {activeTab === 'students' && (
              <div className="tab-content">
                <div className="table-container">
                  <h3>Student Registrations</h3>
                  {students.length === 0 ? (
                    <p className="no-data">No registrations yet</p>
                  ) : (
                    <div className="table-wrapper">
                      <table className="students-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            {/* PAYMENT DISABLED */}
                            {/* <th>Transaction ID</th>
                            <th>Screenshot</th> */}
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((s, i) => (
                            <tr key={s._id}>
                              <td className="td-index">{i + 1}</td>
                              <td>{s.name}</td>
                              <td>{s.email}</td>
                              <td>{s.phone}</td>
                              {/* PAYMENT DISABLED */}
                              {/* <td><span className="txn-id">{s.transactionId}</span></td>
                              <td>
                                <button onClick={() => setSelectedImage(s.paymentScreenshot)} className="btn-view">View</button>
                              </td> */}
                              <td>
                                <span className={`status-badge status-${s.paymentStatus.toLowerCase()}`}>
                                  {s.paymentStatus}
                                </span>
                              </td>
                              <td className="td-date">{new Date(s.createdAt).toLocaleDateString('en-IN')}</td>
                              <td>
                                <button onClick={() => handleDeleteStudent(s._id)} className="btn-reject">Delete</button>
                              </td>
                              {/* PAYMENT DISABLED — approve/reject actions removed */}
                              {/* <td>
                                <div className="action-buttons">
                                  {s.paymentStatus === 'Pending' ? (
                                    <>
                                      <button onClick={() => handleApprove(s._id)} className="btn-approve">Approve</button>
                                      <button onClick={() => handleReject(s._id)} className="btn-reject">Reject</button>
                                    </>
                                  ) : (
                                    <span className="action-disabled">{s.paymentStatus}</span>
                                  )}
                                </div>
                              </td> */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── MATERIALS ─────────────────────────────────────────────────── */}
            {activeTab === 'materials' && (
              <div className="tab-content">
                <div className="admin-card">
                  <h3 className="admin-card-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Upload New Material (PDF)
                  </h3>
                  <form onSubmit={handleMatSubmit} className="admin-form">
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Material Name *</label>
                        <input
                          type="text"
                          placeholder="e.g., Physics Chapter 3 Notes"
                          value={matForm.name}
                          onChange={e => setMatForm({ ...matForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>PDF File *</label>
                        <input
                          id="mat-pdf-input"
                          type="file"
                          accept=".pdf"
                          onChange={e => setMatForm({ ...matForm, pdf: e.target.files[0] })}
                          required
                        />
                      </div>
                    </div>
                    <div className="admin-form-group">
                      <label>Description <span style={{fontWeight:400,color:'#94a3b8'}}>(optional)</span></label>
                      <textarea
                        placeholder="Brief description of this material..."
                        value={matForm.description}
                        onChange={e => setMatForm({ ...matForm, description: e.target.value })}
                        rows="3"
                      />
                    </div>
                    <button type="submit" className="admin-btn-primary" disabled={matUploading}>
                      {matUploading ? 'Uploading...' : 'Upload Material'}
                    </button>
                  </form>
                </div>

                <div className="admin-card" style={{ marginTop: '20px' }}>
                  <h3 className="admin-card-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    Uploaded Materials ({materials.length})
                  </h3>
                  {matLoading ? (
                    <div className="admin-loading-inline">Loading...</div>
                  ) : materials.length === 0 ? (
                    <p className="no-data">No materials uploaded yet</p>
                  ) : (
                    <div className="admin-list">
                      {materials.map(mat => (
                        <div key={mat._id} className="admin-list-item">
                          <div className="admin-list-icon pdf-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                              <polyline points="14 2 14 8 20 8"/>
                            </svg>
                          </div>
                          <div className="admin-list-info">
                            <strong>{mat.name}</strong>
                            <span>{mat.description}</span>
                            <small>Uploaded: {new Date(mat.uploadedAt).toLocaleDateString('en-IN')}</small>
                          </div>
                          <div className="admin-list-actions">
                            <a
                              href={`${import.meta.env.VITE_SERVER_URL || ''}/${mat.filePath.replace(/\\/g, '/')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-view"
                            >View PDF</a>
                            <button onClick={() => handleDeleteMaterial(mat._id)} className="btn-reject">Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── EVENTS ────────────────────────────────────────────────────── */}
            {activeTab === 'events' && (
              <div className="tab-content">
                <div className="admin-card">
                  <h3 className="admin-card-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    Create New Event / Session
                  </h3>
                  <form onSubmit={handleEvtSubmit} className="admin-form">
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Event Title *</label>
                        <input
                          type="text"
                          placeholder="e.g., Physics Live Session - MHT CET 2026"
                          value={evtForm.title}
                          onChange={e => setEvtForm({ ...evtForm, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Zoom Meeting Link *</label>
                        <input
                          type="url"
                          placeholder="https://zoom.us/j/..."
                          value={evtForm.zoomLink}
                          onChange={e => setEvtForm({ ...evtForm, zoomLink: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Date *</label>
                        <input
                          type="date"
                          value={evtForm.date}
                          onChange={e => setEvtForm({ ...evtForm, date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Time *</label>
                        <input
                          type="time"
                          value={evtForm.time}
                          onChange={e => setEvtForm({ ...evtForm, time: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="admin-form-group">
                      <label>Description *</label>
                      <textarea
                        placeholder="What will be covered in this session?"
                        value={evtForm.description}
                        onChange={e => setEvtForm({ ...evtForm, description: e.target.value })}
                        rows="3"
                        required
                      />
                    </div>
                    <button type="submit" className="admin-btn-primary" disabled={evtSaving}>
                      {evtSaving ? 'Creating...' : 'Create Event'}
                    </button>
                  </form>
                </div>

                <div className="admin-card" style={{ marginTop: '20px' }}>
                  <h3 className="admin-card-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                    </svg>
                    All Events ({events.length})
                  </h3>
                  {evtLoading ? (
                    <div className="admin-loading-inline">Loading...</div>
                  ) : events.length === 0 ? (
                    <p className="no-data">No events created yet</p>
                  ) : (
                    <div className="admin-list">
                      {events.map(ev => (
                        <div key={ev._id} className="admin-list-item">
                          <div className="admin-list-icon event-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2"/>
                              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                              <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                          </div>
                          <div className="admin-list-info">
                            <strong>{ev.title}</strong>
                            <span>{ev.description}</span>
                            <div className="event-detail-row">
                              <small>📅 {ev.date} &nbsp; ⏰ {ev.time}</small>
                              <a href={ev.zoomLink} target="_blank" rel="noopener noreferrer" className="zoom-link-pill">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.899L15 14"/>
                                  <rect x="1" y="6" width="14" height="12" rx="2"/>
                                </svg>
                                Zoom Link
                              </a>
                            </div>
                          </div>
                          <div className="admin-list-actions">
                            <button onClick={() => handleDeleteEvent(ev._id)} className="btn-reject">Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── QUERIES ───────────────────────────────────────────────────── */}
            {activeTab === 'queries' && (
              <div className="tab-content">
                <div className="admin-card">
                  <h3 className="admin-card-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    Student Queries ({queries.length})
                  </h3>
                  {qryLoading ? (
                    <div className="admin-loading-inline">Loading...</div>
                  ) : queries.length === 0 ? (
                    <p className="no-data">No queries from students yet</p>
                  ) : (
                    <div className="admin-list">
                      {queries.map(q => (
                        <div key={q._id} className={`admin-list-item${q.status === 'Resolved' ? ' resolved' : ''}`}>
                          <div className="admin-list-icon query-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                          </div>
                          <div className="admin-list-info">
                            <strong>{q.subject}</strong>
                            <span className="query-message">{q.message}</span>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                              <small>👤 {q.studentName} ({q.studentEmail})</small>
                              <small>📅 {new Date(q.createdAt).toLocaleString('en-IN')}</small>
                              <span className={`status-badge ${q.status === 'Resolved' ? 'status-approved' : 'status-pending'}`}>
                                {q.status}
                              </span>
                            </div>
                          </div>
                          {q.status === 'Open' && (
                            <div className="admin-list-actions">
                              <button onClick={() => handleResolveQuery(q._id)} className="btn-approve">Mark Resolved</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* PAYMENT DISABLED — payment screenshot modal removed */}
      {/* {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedImage(null)}>×</button>
            <p className="modal-label">Payment Screenshot</p>
            <img src={`${import.meta.env.VITE_SERVER_URL || ''}/${selectedImage.replace(/\\/g, '/')}`} alt="Payment Screenshot" />
          </div>
        </div>
      )} */}

      {/* ── Confirm Dialog ───────────────────────────────────────────────────── */}
      {confirmDialog.isOpen && (
        <div className="modal-overlay" onClick={() => setConfirmDialog(p => ({ ...p, isOpen: false }))}>
          <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
            <div className="confirm-header">
              <h3>{confirmDialog.title}</h3>
            </div>
            <div className="confirm-body">
              <p>{confirmDialog.message}</p>
            </div>
            <div className="confirm-actions">
              <button onClick={() => setConfirmDialog(p => ({ ...p, isOpen: false }))} className="btn-cancel">Cancel</button>
              <button onClick={confirmDialog.onConfirm} className="btn-confirm">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast Notifications ──────────────────────────────────────────────── */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <div className="toast-icon">
              {t.type === 'success' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              )}
            </div>
            <span className="toast-text">{t.text}</span>
            <button className="toast-close" onClick={() => dismissToast(t.id)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminDashboard;
