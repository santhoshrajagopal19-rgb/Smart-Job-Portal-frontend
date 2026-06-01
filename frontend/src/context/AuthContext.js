import React, { createContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/api';

// Create authentication context
export const AuthContext = createContext();

// Authentication Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Register user
  const register = useCallback(async (name, email, password, role) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.post('/auth/register', {
        name,
        email,
        password,
        role: role || 'candidate',
      });

      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Login user
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout user
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  // Check if user is authenticated
  const isAuthenticated = !!user;
  const isCandidate = user?.role === 'candidate';
  const isRecruiter = user?.role === 'recruiter';
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated,
    isCandidate,
    isRecruiter,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
