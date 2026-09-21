import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('crm_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('crm_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify user profile if token exists
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('crm_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('crm_user', JSON.stringify(res.data));
        } catch (err) {
          console.error('Session expired:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: receivedToken, ...userData } = response.data;
    localStorage.setItem('crm_token', receivedToken);
    localStorage.setItem('crm_user', JSON.stringify(userData));
    setToken(receivedToken);
    setUser(userData);
    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    const { token: receivedToken, ...userData } = response.data;
    localStorage.setItem('crm_token', receivedToken);
    localStorage.setItem('crm_user', JSON.stringify(userData));
    setToken(receivedToken);
    setUser(userData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
