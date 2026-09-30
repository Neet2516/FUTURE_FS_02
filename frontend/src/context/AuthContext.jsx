import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('papercrm_token'));
  const [loading, setLoading] = useState(true); // loading until we resolve session

  // On mount — try to rehydrate from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('papercrm_token');
    const savedUser = localStorage.getItem('papercrm_user');

    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch {
        localStorage.removeItem('papercrm_token');
        localStorage.removeItem('papercrm_user');
      }
    }
    const timer = setTimeout(() => {
      setLoading(false);
    }, 550);
    return () => clearTimeout(timer);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('papercrm_token', authToken);
    localStorage.setItem('papercrm_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('papercrm_token');
    localStorage.removeItem('papercrm_user');
  };

  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
