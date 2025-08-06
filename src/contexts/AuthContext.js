import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Set up axios defaults
  axios.defaults.baseURL = 'http://localhost:8000/api';
  axios.defaults.headers.common['Accept'] = 'application/json';
  axios.defaults.headers.common['Content-Type'] = 'application/json';

  // Check if user is logged in on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch current user data
  const fetchUser = async () => {
    try {
      const response = await axios.get('/user');
      setCurrentUser(response.data.user);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
      setLoading(false);
    }
  };

  // Register a new user
  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post('/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setCurrentUser(user);
      
      return { success: true, user };
    } catch (error) {
      setError(error.response?.data?.errors || { message: 'Registration failed' });
      return { success: false, errors: error.response?.data?.errors };
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setError(null);
      const response = await axios.post('/login', credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setCurrentUser(user);
      
      return { success: true, user };
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      return { success: false, message: error.response?.data?.message };
    }
  };

  // Google authentication
  const googleAuth = async (googleData) => {
    try {
      setError(null);
      const response = await axios.post('/google-auth', googleData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setCurrentUser(user);
      
      return { success: true, user };
    } catch (error) {
      setError(error.response?.data?.message || 'Google authentication failed');
      return { success: false, message: error.response?.data?.message };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      if (currentUser) {
        await axios.post('/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setCurrentUser(null);
      navigate('/');
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setError(null);
      const response = await axios.put('/user', userData);
      setCurrentUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (error) {
      setError(error.response?.data?.errors || { message: 'Update failed' });
      return { success: false, errors: error.response?.data?.errors };
    }
  };

  // Update user location
  const updateLocation = async (locationData) => {
    try {
      setError(null);
      const response = await axios.post('/location', locationData);
      // Update user with new location
      await fetchUser();
      return { success: true, location: response.data.location };
    } catch (error) {
      setError(error.response?.data?.errors || { message: 'Location update failed' });
      return { success: false, errors: error.response?.data?.errors };
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    googleAuth,
    logout,
    updateProfile,
    updateLocation,
    fetchUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};