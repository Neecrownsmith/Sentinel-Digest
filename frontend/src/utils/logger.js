/**
 * Error Logger Utility
 * Centralized error logging with support for external monitoring services
 */

// Log levels
export const LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

class Logger {
  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    // In production, you can integrate with services like Sentry, LogRocket, etc.
    this.externalLogger = null;
  }

  /**
   * Initialize external logging service (e.g., Sentry)
   * @param {Object} service - External logging service instance
   */
  init(service) {
    this.externalLogger = service;
  }

  /**
   * Format error message with context
   * @param {string} message - Error message
   * @param {Object} context - Additional context
   * @returns {string} Formatted message
   */
  formatMessage(message, context) {
    const timestamp = new Date().toISOString();
    let formatted = `[${timestamp}] ${message}`;
    
    if (context && Object.keys(context).length > 0) {
      formatted += `\nContext: ${JSON.stringify(context, null, 2)}`;
    }
    
    return formatted;
  }

  /**
   * Log error message
   * @param {string|Error} error - Error message or Error object
   * @param {Object} context - Additional context information
   */
  error(error, context = {}) {
    const message = error instanceof Error ? error.message : error;
    const formatted = this.formatMessage(message, context);

    // Always log to console in development
    if (this.isDevelopment) {
      console.error(formatted, error instanceof Error ? error.stack : '');
    }

    // Send to external service in production
    if (!this.isDevelopment && this.externalLogger) {
      this.externalLogger.captureException(error, {
        extra: context,
        level: 'error'
      });
    }
  }

  /**
   * Log warning message
   * @param {string} message - Warning message
   * @param {Object} context - Additional context
   */
  warn(message, context = {}) {
    const formatted = this.formatMessage(message, context);

    if (this.isDevelopment) {
      console.warn(formatted);
    }

    if (!this.isDevelopment && this.externalLogger) {
      this.externalLogger.captureMessage(message, {
        extra: context,
        level: 'warning'
      });
    }
  }

  /**
   * Log info message (development only)
   * @param {string} message - Info message
   * @param {Object} context - Additional context
   */
  info(message, context = {}) {
    if (this.isDevelopment) {
      const formatted = this.formatMessage(message, context);
      console.info(formatted);
    }
  }

  /**
   * Log debug message (development only)
   * @param {string} message - Debug message
   * @param {Object} context - Additional context
   */
  debug(message, context = {}) {
    if (this.isDevelopment) {
      const formatted = this.formatMessage(message, context);
      console.debug(formatted);
    }
  }

  /**
   * Log API error with request details
   * @param {Error} error - Error object
   * @param {Object} request - Request details
   */
  apiError(error, request = {}) {
    const context = {
      ...request,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method
    };

    this.error(error, context);
  }
}

// Export singleton instance
const logger = new Logger();
export default logger;
