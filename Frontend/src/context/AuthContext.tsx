import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  token: string | null;
  role: string | null;
  login: (token: string, role?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(() => localStorage.getItem('role'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (role) {
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('role');
    }
  }, [role]);

  const login = (newToken: string, newRole?: string) => {
    setToken(newToken);
    if (newRole) setRole(newRole);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    try {
      // Force a full refresh so all providers and cached state reset on logout.
      // Use small timeout so React state has a chance to settle and localStorage updates run.
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          try {
            // replace current URL with home then reload to clear any in-memory caches
            window.location.href = '/';
            window.location.reload();
          } catch (e) {
            // as a fallback, do a plain reload
            window.location.reload();
          }
        }, 60);
      }
    } catch (e) {
      // ignore
    }
  };

  const value: AuthContextType = {
    token,
    role,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
