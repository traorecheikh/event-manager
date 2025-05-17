import React, { createContext, useContext, useState, useEffect } from 'react';
// Updated import path for auth functions
import {
  isAuthenticated as checkAuth,
  logout as authLogout,
  getProfile,
  login as apiLogin, // Renamed to avoid conflict with context login function
  register as apiRegister // Renamed to avoid conflict with context register function
} from '../services/api'; // Changed from ./services/auth

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (checkAuth()) {
        try {
          const userProfile = await getProfile();
          setCurrentUser(userProfile);
        } catch (error) {
          console.error('Failed to fetch profile, logging out', error);
          authLogout();
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, []);

  const login = async (email, password) => {
    try {
      // Use the renamed apiLogin from services/api.js
      const userData = await apiLogin(email, password);
      const userProfile = await getProfile();
      setCurrentUser(userProfile);
      return userData;
    } catch (error) {
      console.error('Context login failed', error);
      setCurrentUser(null);
      throw error;
    }
  };

  const register = async (email, password) => {
    try {
      // Use the renamed apiRegister from services/api.js
      const userData = await apiRegister(email, password);
      const userProfile = await getProfile();
      setCurrentUser(userProfile);
      return userData;
    } catch (error) {
      console.error('Context register failed', error);
      setCurrentUser(null);
      throw error;
    }
  };

  const logout = () => {
    authLogout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

