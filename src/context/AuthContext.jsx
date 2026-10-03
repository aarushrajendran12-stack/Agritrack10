import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { translations } from '../i18n/translations.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('kisan_token'));
  const [crops, setCrops] = useState([]);
  const [activeCrop, setActiveCrop] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [language, setLanguage] = useState(() => localStorage.getItem('kisan_lang') || 'en');
  const [isLoading, setIsLoading] = useState(true);

  const t = translations[language] || translations.en;

  const handleSetLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('kisan_lang', lang);
  };

  const refreshCrops = async () => {
    try {
      const res = await api.getCrops();
      const list = res.data?.crops || [];
      setCrops(list);
      if (list.length > 0) {
        // If no active crop or current active crop not in list, set first
        setActiveCrop((prev) => {
          if (!prev) return list[0];
          const found = list.find((c) => c.id === prev.id);
          return found || list[0];
        });
      } else {
        setActiveCrop(null);
      }
    } catch (err) {
      console.error('Failed to fetch crops:', err);
    }
  };

  const refreshCart = async () => {
    if (!token) return;
    try {
      const res = await api.getCart();
      setCartCount(res.data?.cart?.itemCount || 0);
    } catch (err) {
      console.warn('Failed to refresh cart count');
    }
  };

  const refreshNotifications = async () => {
    if (!token) return;
    try {
      const res = await api.getNotifications();
      setUnreadNotificationsCount(res.data?.unreadCount || 0);
    } catch (err) {
      console.warn('Failed to refresh notifications');
    }
  };

  const loadUserData = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await api.getMe();
      setUser(res.data?.user || null);
      if (res.data?.user?.preferredLanguage) {
        setLanguage(res.data.user.preferredLanguage);
      }
      await Promise.all([refreshCrops(), refreshCart(), refreshNotifications()]);
    } catch (err) {
      console.warn('Token expired or invalid. Logging out.');
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    const { user: loggedInUser, token: authToken } = res.data;
    localStorage.setItem('kisan_token', authToken);
    setToken(authToken);
    setUser(loggedInUser);
    await loadUserData();
    return loggedInUser;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    const { user: registeredUser, token: authToken } = res.data;
    localStorage.setItem('kisan_token', authToken);
    setToken(authToken);
    setUser(registeredUser);
    await loadUserData();
    return registeredUser;
  };

  const logout = () => {
    localStorage.removeItem('kisan_token');
    setToken(null);
    setUser(null);
    setCrops([]);
    setActiveCrop(null);
    setCartCount(0);
    setUnreadNotificationsCount(0);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        crops,
        activeCrop,
        setActiveCrop,
        refreshCrops,
        cartCount,
        refreshCart,
        unreadNotificationsCount,
        refreshNotifications,
        language,
        setLanguage: handleSetLanguage,
        t,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
