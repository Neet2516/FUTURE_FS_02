import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

const DEMO_USERS = [
  {
    id: 'usr_001',
    name: 'Sarah Miller',
    email: 'sarah@papercrm.io',
    role: 'Lead Account Executive',
    avatarColor: '#fff9c4',
    title: 'Senior AE (West Coast)',
  },
  {
    id: 'usr_002',
    name: 'Alex Chen',
    email: 'alex@papercrm.io',
    role: 'Sales Director',
    avatarColor: '#ffd1dc',
    title: 'Global Sales Director',
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(DEMO_USERS[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Attempt to load current user from API or fallback to primary demo
    authApi.me()
      .then(remoteUser => {
        if (remoteUser) {
          setUser({
            ...remoteUser,
            avatarColor: remoteUser.avatar_color || '#fff9c4',
          });
        }
      })
      .catch(() => {
        // Fallback to local demo user
      });
  }, []);

  const switchDemoUser = (userId) => {
    const selected = DEMO_USERS.find(u => u.id === userId) || DEMO_USERS[0];
    setUser(selected);
    localStorage.setItem('papercrm_user_id', selected.id);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, demoUsers: DEMO_USERS, switchDemoUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
