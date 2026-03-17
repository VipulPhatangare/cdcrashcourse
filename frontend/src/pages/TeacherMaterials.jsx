import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import TeacherDashboardLayout from '../components/TeacherDashboardLayout';
import './Materials.css';

const SUBJECT_OPTIONS = [
  'Physics',
  'Chemistry',
  'Mathematics'
];

const TeacherMaterials = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    description: '',
    file: null
  });
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [confirmDialog, setConfirmDialog] = useState({ show: false, id: '', name: '' });

  useEffect(() => {
    const token = localStorage.getItem('teacherToken');
    if (!token) {
      navigate('/teacher');
      return;
    }
    fetchMaterials();
  }, [navigate]);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
  };

  const fetchMaterials = async () => {
    try {
      const response = await api.get('/teacher/materials');
      if (response.data.success) {
        setMaterials(response.data.data);
      }
    } catch (error) {
      showToast('error', 'Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.subject || !formData.file) {
      showToast('error', 'Please provide material name, subject and PDF file');
      return;
    }

    setUploading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('subject', formData.subject);
      data.append('description', formData.description);
      data.append('file', formData.file);

      const response = await api.post('/teacher/materials', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        showToast('success', 'Material uploaded successfully!');
        setFormData({ name: '', subject: '', description: '', file: null });
        document.getElementById('file-input').value = '';
        fetchMaterials();
      }
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id, name) => {
    setConfirmDialog({ show: true, id, name });
  };

  const confirmDelete = async () => {
    try {
      const response = await api.delete(`/teacher/materials/${confirmDialog.id}`);
      if (response.data.success) {
        showToast('success', 'Material deleted successfully');
        fetchMaterials();
      }
    } catch (error) {
      showToast('error', 'Failed to delete material');
    } finally {
      setConfirmDialog({ show: false, id: '', name: '' });
    }
  };

  return (
    <TeacherDashboardLayout>
      {/* Toast */}
      {toast.show && (
        <div className={`toast-notification toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog.show && (
        <div className="modal-overlay" onClick={() => setConfirmDialog({ show: false, id: '', name: '' })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Material</h3>
            <p>Are you sure you want to delete "{confirmDialog.name}"?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setConfirmDialog({ show: false, id: '', name: '' })}>
                Cancel
              </button>
              <button className="btn-delete" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="materials-page">
        <div className="page-header">
          <h1>Study Materials</h1>
          <p>Upload and manage PDF study materials for students</p>
        </div>

        {/* Upload Form */}
        <div className="upload-card">
          <h2>Upload New Material</h2>
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-row">
              <div className="form-group">
                <label>Material Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Week 1 - Introduction to Engineering"
                  required
                />
              </div>
              <div className="form-group">
                <label>Subject *</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select subject</option>
                  {SUBJECT_OPTIONS.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>PDF File *</label>
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the study material"
                rows="3"
              />
            </div>
            <button type="submit" className="btn-upload" disabled={uploading}>
              {uploading ? (
                <>
                  <svg className="spinner" width="18" height="18" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
                    <path d="M12 2 A10 10 0 0 1 22 12" stroke="currentColor" strokeWidth="4" fill="none"/>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Upload Material
                </>
              )}
            </button>
          </form>
        </div>

        {/* Materials List */}
        <div className="materials-list-section">
          <h2>Uploaded Materials</h2>
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading materials...</p>
            </div>
          ) : materials.length === 0 ? (
            <div className="empty-state">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <h3>No Materials Yet</h3>
              <p>Upload your first study material to get started</p>
            </div>
          ) : (
            <div className="materials-grid">
              {materials.map((material) => (
                <div key={material._id} className="material-card">
                  <div className="material-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                  </div>
                  <div className="material-info">
                    <h3>{material.name}</h3>
                    <p style={{ marginBottom: '6px', fontWeight: 600, color: '#0d61aa' }}>
                      Subject: {material.subject || 'General'}
                    </p>
                    <p>{material.description || 'No description provided'}</p>
                    <span className="material-date">
                      Uploaded: {new Date(material.uploadedAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <button
                    className="btn-delete-material"
                    onClick={() => handleDelete(material._id, material.name)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .toast-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 14px 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 10000;
          font-weight: 500;
          animation: slideIn 0.3s ease;
        }
        .toast-success { border-left: 4px solid #10b981; color: #059669; }
        .toast-error { border-left: 4px solid #ef4444; color: #dc2626; }
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .modal-content {
          background: white;
          padding: 24px;
          border-radius: 12px;
          max-width: 400px;
          width: 90%;
        }
        .modal-content h3 {
          margin: 0 0 12px;
          color: #1f2937;
        }
        .modal-content p {
          margin: 0 0 20px;
          color: #6b7280;
        }
        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        .btn-cancel, .btn-delete {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
        }
        .btn-cancel {
          background: #f3f4f6;
          color: #374151;
        }
        .btn-delete {
          background: #ef4444;
          color: white;
        }
        .upload-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          margin-bottom: 24px;
        }
        .upload-card h2 {
          margin: 0 0 20px;
          color: #0d61aa;
          font-size: 1.25rem;
        }
        .upload-form .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          color: #374151;
          font-size: 0.9rem;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.9rem;
          font-family: inherit;
        }
        .form-group textarea {
          resize: vertical;
        }
        .btn-upload {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #0d61aa;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-upload:hover:not(:disabled) {
          background: #0a4d8a;
        }
        .btn-upload:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .materials-list-section h2 {
          margin: 0 0 20px;
          color: #1f2937;
          font-size: 1.25rem;
        }
        .materials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .material-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .material-icon {
          width: 48px;
          height: 48px;
          background: #eff6ff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0d61aa;
        }
        .material-info h3 {
          margin: 0 0 6px;
          color: #1f2937;
          font-size: 1rem;
        }
        .material-info p {
          margin: 0 0 8px;
          color: #6b7280;
          font-size: 0.85rem;
        }
        .material-date {
          font-size: 0.8rem;
          color: #9ca3af;
        }
        .btn-delete-material {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-delete-material:hover {
          background: #fecaca;
        }
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #9ca3af;
        }
        .empty-state svg {
          margin-bottom: 16px;
        }
        .empty-state h3 {
          margin: 0 0 8px;
          color: #6b7280;
        }
        @media (max-width: 768px) {
          .upload-form .form-row {
            grid-template-columns: 1fr;
          }
          .materials-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </TeacherDashboardLayout>
  );
};

export default TeacherMaterials;
