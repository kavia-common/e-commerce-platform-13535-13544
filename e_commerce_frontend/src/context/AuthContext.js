import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { load, save, remove } from '../utils/storage';

const AuthContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * useAuth provides access to auth state and actions: user, token, login, logout, register, refresh.
 */
export function useAuth() {
  return useContext(AuthContext);
}

/**
 * PUBLIC_INTERFACE
 * AuthProvider persists token in localStorage and exposes authenticated user info.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => load('token', ''));
  const [user, setUser] = useState(() => load('user', null));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    save('token', token);
  }, [token]);

  useEffect(() => {
    save('user', user);
  }, [user]);

  // Attempt to refresh user if token exists and no user loaded
  useEffect(() => {
    const refresh = async () => {
      if (token && !user) {
        try {
          const me = await api.me(token);
          setUser(me);
        } catch {
          setToken('');
          setUser(null);
        }
      }
    };
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    // PUBLIC_INTERFACE
    login: async (email, password) => {
      setLoading(true);
      try {
        const data = await api.login(email, password);
        setToken(data?.token || '');
        setUser(data?.user || null);
        return { ok: true };
      } catch (e) {
        return { ok: false, message: e.message };
      } finally {
        setLoading(false);
      }
    },
    // PUBLIC_INTERFACE
    register: async (name, email, password) => {
      setLoading(true);
      try {
        const data = await api.register(name, email, password);
        setToken(data?.token || '');
        setUser(data?.user || null);
        return { ok: true };
      } catch (e) {
        return { ok: false, message: e.message };
      } finally {
        setLoading(false);
      }
    },
    // PUBLIC_INTERFACE
    logout: () => { setToken(''); setUser(null); remove('token'); remove('user'); }
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
