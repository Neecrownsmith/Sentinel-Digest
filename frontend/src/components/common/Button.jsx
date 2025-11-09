import React from 'react';
import './Button.css';

/**
 * Reusable Button component with variants and sizes
 * @param {string} variant - Button style variant: 'primary', 'secondary', 'ghost'
 * @param {string} size - Button size: 'small', 'medium', 'large'
 * @param {string} children - Button content
 * @param {string} className - Additional CSS classes
 * @param {function} onClick - Click handler
 * @param {string} type - Button type: 'button', 'submit', 'reset'
 * @param {boolean} disabled - Disabled state
 * @param {string} ariaLabel - Accessibility label
 */
const Button = ({ 
  variant = 'primary', 
  size = 'medium', 
  children, 
  className = '', 
  onClick, 
  type = 'button',
  disabled = false,
  ariaLabel,
  ...rest 
}) => {
  const buttonClass = `btn btn--${variant} btn--${size} ${className}`.trim();

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
