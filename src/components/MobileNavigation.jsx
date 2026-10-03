import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Sprout,
  CloudSun,
  ShoppingBag,
  IndianRupee,
  ShieldCheck,
} from 'lucide-react';

export const MobileNavigation = ({ activeTab, setActiveTab }) => {
  const { user, t } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'crops', label: 'Crops', icon: Sprout },
    { id: 'weather', label: 'Weather', icon: CloudSun },
    { id: 'marketplace', label: 'Market', icon: ShoppingBag },
    { id: 'finance', label: 'Finance', icon: IndianRupee },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ id: 'admin', label: 'Admin', icon: ShieldCheck });
  }

  return (
    <nav className="mobile-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
