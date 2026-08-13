import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      localStorage.removeItem('token');
    }
  };

  const loadUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setAuthToken(token);
    try {
      const res = await axios.get(`${API_URL}/auth/me`);
      setUser(res.data.user);
    } catch (err) {
      console.error('Load user error:', err);
      if (err.response?.status === 401) {
        logout();
      }
    }
    setLoading(false);
  };

  const register = async (formData) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, formData);
      setToken(res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      return { success: true, data: res.data };
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const login = async (formData) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, formData);
      setToken(res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      return { success: true, data: res.data };
    } catch (err) {
      console.error('Login error:', err.response?.data);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setAuthToken(null);
    setUser(null);
  };

  const updateProfile = async (data) => {
    try {
      const res = await axios.put(`${API_URL}/auth/profile`, data);
      setUser(res.data.user);
      return { success: true, data: res.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Update failed' 
      };
    }
  };

  const changePassword = async (data) => {
    try {
      const res = await axios.put(`${API_URL}/auth/change-password`, data);
      return { success: true, data: res.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Password change failed' 
      };
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};