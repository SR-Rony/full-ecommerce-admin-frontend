import React from 'react';
import { buttonVariants, getButtonClasses } from '../theme/colorVariants';

/**
 * Button Component - Consistent button styling across admin panel
 * @param {string} variant - Color variant (primary, secondary, success, danger, warning, info, ghost)
 * @param {string} size - Button size (sm, md, lg)
 * @param {boolean} outline - Use outline variant
 * @param {boolean} disabled - Disabled state
 * @param {boolean} loading - Loading state with spinner
 * @param {React.ReactNode} children - Button content
 * @param {string} className - Additional CSS classes
 * @param {function} onClick - Click handler
 */
const Button = ({ 
  variant = 'primary', 
  size = 'md',
  outline = false,
  disabled = false,
  loading = false,
  children, 
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  let buttonClass;
  
  if (outline && buttonVariants.outline[variant]) {
    buttonClass = buttonVariants.outline[variant];
  } else {
    buttonClass = getButtonClasses(variant, size);
  }
  
  return (
    <button 
      type={type}
      className={`${buttonClass} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;

