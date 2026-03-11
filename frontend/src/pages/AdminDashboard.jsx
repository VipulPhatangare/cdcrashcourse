import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import logo from '../assets/Both Logo.png';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [statistics, setStatistics] = useState({
    totalRegistrations: 0,
    pendingPayments: 0,
    approvedPayments: 0,
    rejectedPayments: 0
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    studentId: null
  });

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }

    fetchStudents();
  }, [navigate]);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/admin/students');
      
      if (response.data.success) {
        setStudents(response.data.data.students);
        setStatistics(response.data.data.statistics);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin');
      } else {
        setMessage({ 
          type: 'error', 
          text: 'Failed to load data' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Approve Payment',
      message: 'Are you sure you want to approve this payment?',
      onConfirm: () => confirmApprove(id),
      studentId: id
    });
  };

  const confirmApprove = async (id) => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });

    try {
      const response = await api.patch(`/admin/approve/${id}`);
      
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Payment approved successfully!' });
        fetchStudents();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to approve payment' 
      });
    }
  };

  const handleReject = async (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reject Payment',
      message: 'Are you sure you want to reject this payment?',
      onConfirm: () => confirmReject(id),
      studentId: id
    });
  };

  const confirmReject = async (id) => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });

    try {
      const response = await api.patch(`/admin/reject/${id}`);
      
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Payment rejected' });
        fetchStudents();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to reject payment' 
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    navigate('/admin');
  };

  const viewScreenshot = (screenshot) => {
    setSelectedImage(screenshot);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="nav-content">
          <img src={logo} alt="Campus Dekho" className="logo" />
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Crash Course Dashboard</h2>
          <p>Manage student registrations and payments</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-total">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>{statistics.totalRegistrations}</h3>
              <p>Total Registrations</p>
            </div>
          </div>

          <div className="stat-card stat-pending">
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div className="stat-info">
              <h3>{statistics.pendingPayments}</h3>
              <p>Pending Payments</p>
            </div>
          </div>

          <div className="stat-card stat-approved">
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div className="stat-info">
              <h3>{statistics.approvedPayments}</h3>
              <p>Approved Payments</p>
            </div>
          </div>

          <div className="stat-card stat-rejected">
            <div className="stat-icon">❌</div>
            <div className="stat-info">
              <h3>{statistics.rejectedPayments}</h3>
              <p>Rejected Payments</p>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="table-container">
          <h3>Student Registrations</h3>
          
          {students.length === 0 ? (
            <p className="no-data">No registrations yet</p>
          ) : (
            <div className="table-wrapper">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Transaction ID</th>
                    <th>Payment Screenshot</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.phone}</td>
                      <td>{student.transactionId}</td>
                      <td>
                        <button
                          onClick={() => viewScreenshot(student.paymentScreenshot)}
                          className="btn-view"
                        >
                          View
                        </button>
                      </td>
                      <td>
                        <span className={`status-badge status-${student.paymentStatus.toLowerCase()}`}>
                          {student.paymentStatus}
                        </span>
                      </td>
                      <td>
                        {new Date(student.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td>
                        <div className="action-buttons">
                          {student.paymentStatus === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(student._id)}
                                className="btn-approve"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(student._id)}
                                className="btn-reject"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {student.paymentStatus !== 'Pending' && (
                            <span className="action-disabled">
                              {student.paymentStatus}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <img 
              src={`/uploads/${selectedImage.replace(/^.*[\\/]/, '')}`} 
              alt="Payment Screenshot" 
            />
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <div className="modal-overlay" onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-header">
              <h3>{confirmDialog.title}</h3>
            </div>
            <div className="confirm-body">
              <p>{confirmDialog.message}</p>
            </div>
            <div className="confirm-actions">
              <button 
                onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDialog.onConfirm}
                className="btn-confirm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
