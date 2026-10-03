import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Sprout,
  ShieldCheck,
  Store,
} from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, register, t } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register({ name, email, phone, password });
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail, demoPassword) => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await login(demoEmail, demoPassword);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Demo login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.25rem' }}>
            {tab === 'login' ? 'Welcome to KisanSetu' : 'Farmer Registration'}
          </h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Quick Demo Credentials Strip for Hackathon Judges */}
          <div style={{ backgroundColor: 'var(--primary-light)', border: '1px dashed var(--primary-border)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.45rem', textTransform: 'uppercase' }}>
              ⚡ 1-Click Demo Login (For Judges & Evaluators)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.6rem', justifyContent: 'flex-start' }}
                onClick={() => handleQuickDemoLogin('farmer@kisan.in', 'Kisan@123')}
              >
                <Sprout size={14} color="#15803d" />
                <span><strong>Demo Farmer:</strong> Ramesh Patil (Wheat Field, Malegaon)</span>
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.6rem', justifyContent: 'flex-start' }}
                onClick={() => handleQuickDemoLogin('admin@farminput.gov.in', 'Admin@123')}
              >
                <ShieldCheck size={14} color="#0284c7" />
                <span><strong>Admin:</strong> ICAR Krishi Nodal Admin</span>
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.6rem', justifyContent: 'flex-start' }}
                onClick={() => handleQuickDemoLogin('agro.supplies@kisan.in', 'Seller@123')}
              >
                <Store size={14} color="#d97706" />
                <span><strong>Agro Input Seller:</strong> Maharashtra Agro Kendra</span>
              </button>
            </div>
          </div>

          {/* Tab Selector */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
            <button
              className={`nav-item ${tab === 'login' ? 'active' : ''}`}
              style={{ flex: 1, justifyContent: 'center', borderRadius: 0, padding: '0.5rem', color: tab === 'login' ? 'var(--primary)' : 'var(--text-muted)' }}
              onClick={() => { setTab('login'); setErrorMsg(''); }}
            >
              Sign In
            </button>
            <button
              className={`nav-item ${tab === 'register' ? 'active' : ''}`}
              style={{ flex: 1, justifyContent: 'center', borderRadius: 0, padding: '0.5rem', color: tab === 'register' ? 'var(--primary)' : 'var(--text-muted)' }}
              onClick={() => { setTab('register'); setErrorMsg(''); }}
            >
              Create Account
            </button>
          </div>

          {errorMsg && (
            <div style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {tab === 'register' && (
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patil"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="farmer@kisan.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {tab === 'register' && (
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                  Mobile Number
                </label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.5rem' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Authenticating...' : tab === 'login' ? 'Sign In to Farm Portal' : 'Register Farm Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
