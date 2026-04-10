import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get('users/profile/');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

 const login = async (username, password) => {
  try {
    const response = await axiosInstance.post('token/', { username, password });
    const { access, refresh, user: userData } = response.data;
    
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    
    setUser(userData);
    setIsAuthenticated(true);
    toast.success('Login successful!');
    return true;
  } catch (error) {
    toast.error(error.response?.data?.detail || 'Login failed');
    return false;
  }
};

  const register = async (username, email, password, password2) => {
    try {
      const response = await axiosInstance.post('users/register/', {
        username,
        email,
        password,
        password2,
      });
      toast.success('Registration successful! Please login.');
      return true;
    } catch (error) {
      const errors = error.response?.data;
      if (errors) {
        Object.values(errors).forEach(err => toast.error(err[0]));
      }
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (data) => {
    try {
      const response = await axiosInstance.patch('users/profile/', data);
      setUser(response.data);
      toast.success('Profile updated!');
      return true;
    } catch (error) {
      toast.error('Update failed');
      return false;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};