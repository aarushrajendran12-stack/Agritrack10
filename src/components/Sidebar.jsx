import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Sprout,
  CloudSun,
  ShoppingBag,
  IndianRupee,
  ShieldCheck,
  Wheat,
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, t } = useAuth();

  const navItems = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'crops', label: t.navCropTracking, icon: Sprout },
    { id: 'weather', label: t.navWeather, icon: CloudSun },
    { id: 'marketplace', label: t.navMarketplace, icon: ShoppingBag },
    { id: 'finance', label: t.navFinance, icon: IndianRupee },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ id: 'admin', label: t.navAdmin, icon: ShieldCheck });
  }

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Wheat size={24} />
        </div>
        <div className="brand-text">
          <h1>{t.appName}</h1>
          <span>{t.tagline}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {user ? (
          <div className="user-mini-card">
            <div className="user-avatar">{user.name.charAt(0)}</div>
            <div className="user-info-text">
              <div className="user-name">{user.name}</div>
              <span className="user-role-badge">{user.role}</span>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>
            Guest Farmer Mode
          </div>
        )}
      </div>
    </aside>
  );
};
