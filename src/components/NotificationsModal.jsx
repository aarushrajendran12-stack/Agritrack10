import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Bell,
  CheckCheck,
  AlertTriangle,
  Info,
  Calendar,
} from 'lucide-react';

export const NotificationsModal = ({ isOpen, onClose }) => {
  const { refreshNotifications } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await api.getNotifications();
      setNotifications(res.data?.notifications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    try {
      await api.markAllAsRead();
      await loadNotifications();
      await refreshNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={20} color="#15803d" />
            <h3 style={{ fontSize: '1.2rem' }}>Farm Alerts & Notifications</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              className="btn-secondary"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
              onClick={handleMarkAllRead}
            >
              <CheckCheck size={14} />
              <span>Mark all read</span>
            </button>
            <button className="btn-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {isLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading alerts...
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Bell size={36} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
              <h4>No notifications right now</h4>
              <p style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>
                Weather advisories and crop stage updates will appear here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: n.isRead ? '#fff' : 'var(--primary-light)',
                    borderLeft: `4px solid ${n.severity === 'WARNING' ? '#f59e0b' : n.severity === 'CRITICAL' ? '#dc2626' : '#15803d'}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700 }}>{n.title}</h4>
                    {!n.isRead && (
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#15803d' }} />
                    )}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.4, marginBottom: '0.4rem' }}>
                    {n.message}
                  </p>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
