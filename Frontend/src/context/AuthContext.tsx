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
    // Dispatch a global event so other providers (cart/wishlist) can persist user data to server
    try {
      if (typeof window !== 'undefined') {
        const ev = new CustomEvent('app:before-logout', { detail: { token } });
        window.dispatchEvent(ev);
      }
    } catch (e) {
      // ignore
    }

    // Give listeners a short time to start network synces before clearing auth state
    setTimeout(() => {
      setToken(null);
      setRole(null);
      try {
        // replace current URL with home then reload to clear any in-memory caches
        if (typeof window !== 'undefined') {
          window.location.href = '/';
          window.location.reload();
        }
      } catch (e) {
        try { window.location.reload(); } catch (e2) { /* ignore */ }
      }
    }, 700);
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
