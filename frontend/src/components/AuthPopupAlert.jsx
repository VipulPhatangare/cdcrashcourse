import { useEffect } from 'react';
import './AuthPopupAlert.css';

const AuthPopupAlert = ({ message, onClose, duration = 3200 }) => {
  useEffect(() => {
    if (!message?.text) return;

    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message?.text) return null;

  return (
    <div className={`auth-popup-alert auth-popup-${message.type || 'info'}`} role="status" aria-live="polite">
      <div className="auth-popup-icon">
        {message.type === 'success' ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : message.type === 'error' ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        )}
      </div>
      <p className="auth-popup-text">{message.text}</p>
      <button type="button" className="auth-popup-close" onClick={onClose} aria-label="Close alert">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};

export default AuthPopupAlert;
