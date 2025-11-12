import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { authAPI } from '../services/api';
import logger from '../utils/logger';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const userData = await authAPI.getProfile();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        logger.error('Auth check failed', { error: error.message });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  }

  async function login(email, password) {
    try {
      const data = await authAPI.login(email, password);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      
      const userData = await authAPI.getProfile();
      setUser(userData);
      setIsAuthenticated(true);
      
      logger.info('User logged in successfully', { userId: userData.id });
      
      return { success: true };
    } catch (error) {
      logger.error('Login failed', {
        email,
        error: error.response?.data?.detail || error.message
      });
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Invalid email or password.' 
      };
    }
  }

  async function signup(username, email, password, passwordConfirm) {
    try {
      await authAPI.register(username, email, password, passwordConfirm);
      
      // Auto-login after signup using email
      const loginResult = await login(email, password);
      
      if (loginResult.success) {
        logger.info('User signed up successfully', { username, email });
      }
      
      return loginResult;
    } catch (error) {
      logger.error('Signup failed', {
        username,
        email,
        error: error.response?.data
      });
      
      const errors = error.response?.data;
      let errorMessage = 'Signup failed. Please try again.';
      
      if (errors) {
        if (errors.username) errorMessage = `Username: ${errors.username[0]}`;
        else if (errors.email) errorMessage = `Email: ${errors.email[0]}`;
        else if (errors.password) errorMessage = `Password: ${errors.password[0]}`;
        else if (errors.non_field_errors) errorMessage = errors.non_field_errors[0];
      }
      
      return { success: false, error: errorMessage };
    }
  }

  function logout() {
    logger.info('User logged out', { userId: user?.id });
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
