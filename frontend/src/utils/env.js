import logger from './logger';

/**
 * Environment Configuration Validation
 * Validates required environment variables and provides helpful error messages
 */

const REQUIRED_ENV_VARS = [
  'VITE_API_URL'
];

const OPTIONAL_ENV_VARS = [
  'VITE_API_BASE_URL',
  'VITE_GOOGLE_CLIENT_ID',
  'VITE_FACEBOOK_APP_ID',
  'VITE_TWITTER_CLIENT_ID',
  'VITE_BACKEND_URL'
];

/**
 * Validate environment variables
 * @returns {Object} Validation result with status and missing vars
 */
export function validateEnv() {
  const missing = [];
  const warnings = [];

  // Check required variables
  REQUIRED_ENV_VARS.forEach(varName => {
    if (!import.meta.env[varName]) {
      missing.push(varName);
    }
  });

  // Check optional but recommended variables
  OPTIONAL_ENV_VARS.forEach(varName => {
    if (!import.meta.env[varName]) {
      warnings.push(varName);
    }
  });

  return {
    isValid: missing.length === 0,
    missing,
    warnings
  };
}

/**
 * Initialize environment validation
 * Logs errors and warnings for missing environment variables
 */
export function initEnv() {
  const { isValid, missing, warnings } = validateEnv();

  if (!isValid) {
    const errorMessage = `Missing required environment variables: ${missing.join(', ')}`;
    logger.error(errorMessage, {
      missing,
      help: 'Please create a .env file based on .env.example'
    });
    
    // Show user-friendly error in development
    if (import.meta.env.DEV) {
      console.error(
        '%c⚠️ Environment Configuration Error',
        'color: #ef4444; font-size: 16px; font-weight: bold;'
      );
      console.error(`Missing required variables: ${missing.join(', ')}`);
      console.error('Create a .env file based on .env.example');
    }
  }

  if (warnings.length > 0 && import.meta.env.DEV) {
    logger.warn('Optional environment variables not set', {
      warnings,
      note: 'Some features may be limited'
    });
  }

  return isValid;
}

/**
 * Get environment variable with fallback
 * @param {string} key - Environment variable key
 * @param {string} fallback - Fallback value
 * @returns {string} Environment variable value or fallback
 */
export function getEnv(key, fallback = '') {
  return import.meta.env[key] || fallback;
}

/**
 * Check if OAuth providers are configured
 * @returns {Object} OAuth provider status
 */
export function getOAuthStatus() {
  return {
    google: Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID),
    facebook: Boolean(import.meta.env.VITE_FACEBOOK_APP_ID),
    twitter: Boolean(import.meta.env.VITE_TWITTER_CLIENT_ID)
  };
}

/**
 * Get API configuration
 * @returns {Object} API configuration
 */
export function getApiConfig() {
  const apiUrl = import.meta.env.VITE_API_URL || 
                 import.meta.env.VITE_API_BASE_URL || 
                 'http://localhost:8000/api';
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 
                     apiUrl.replace('/api', '');

  return {
    apiUrl,
    backendUrl
  };
}

export default {
  validateEnv,
  initEnv,
  getEnv,
  getOAuthStatus,
  getApiConfig
};
