import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Globe,
  ShoppingCart,
  Bell,
  PlusCircle,
  Sprout,
  LogOut,
  User as UserIcon,
} from 'lucide-react';

export const Navbar = ({
  onOpenAddCrop,
  onOpenCart,
  onOpenNotifications,
  onOpenAuth,
}) => {
  const {
    user,
    isAuthenticated,
    crops,
    activeCrop,
    setActiveCrop,
    cartCount,
    unreadNotificationsCount,
    language,
    setLanguage,
    logout,
    t,
  } = useAuth();

  const activeFarm = user?.farms?.[0] || activeCrop?.farm;

  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <div className="topbar-title">
          <h2>{t.appName}</h2>
        </div>

        {/* Farm Location Badge */}
        <div className="farm-location-badge">
          <MapPin size={14} color="#15803d" />
          <span>{activeFarm?.locationName || 'Malegaon, Maharashtra'}</span>
        </div>

        {/* Active Crop Selector if multiple crops exist */}
        {crops.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sprout size={16} color="#15803d" />
            <select
              value={activeCrop?.id || ''}
              onChange={(e) => {
                const found = crops.find((c) => c.id === e.target.value);
                if (found) setActiveCrop(found);
              }}
              style={{
                padding: '0.3rem 0.6rem',
                fontSize: '0.85rem',
                fontWeight: '600',
                borderRadius: 'var(--radius-md)',
              }}
            >
              {crops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.cropType} {c.variety ? `(${c.variety})` : ''} - {c.status}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="topbar-right">
        {/* Language Switcher */}
        <button
          className="btn-icon"
          title="Change Language / भाषा बदलें"
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          style={{ width: 'auto', padding: '0 0.6rem', gap: '0.3rem', fontSize: '0.82rem', fontWeight: 600 }}
        >
          <Globe size={16} />
          <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
        </button>

        {/* Add Crop Button */}
        {isAuthenticated && (
          <button className="btn-primary" onClick={onOpenAddCrop} style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
            <PlusCircle size={16} />
            <span>{t.addCrop}</span>
          </button>
        )}

        {/* Cart Button */}
        {isAuthenticated && (
          <button className="btn-icon" onClick={onOpenCart} title={t.cart}>
            <ShoppingCart size={18} />
            {cartCount > 0 && <span className="badge-counter">{cartCount}</span>}
          </button>
        )}

        {/* Notifications Button */}
        {isAuthenticated && (
          <button className="btn-icon" onClick={onOpenNotifications} title="Notifications">
            <Bell size={18} />
            {unreadNotificationsCount > 0 && (
              <span className="badge-counter" style={{ backgroundColor: '#dc2626' }}>
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        )}

        {/* User Account / Auth */}
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--bg-subtle)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <UserIcon size={16} color="#15803d" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{user?.name}</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{user?.role}</span>
              </div>
            </div>
            <button className="btn-icon" onClick={logout} title={t.logout}>
              <LogOut size={16} color="#dc2626" />
            </button>
          </div>
        ) : (
          <button className="btn-primary" onClick={onOpenAuth}>
            <span>{t.login}</span>
          </button>
        )}
      </div>
    </header>
  );
};
