import React from 'react';
import { alertVariants } from '../theme/colorVariants';
import { FiInfo, FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi';

/**
 * Alert Component - Display important messages and notifications
 * @param {string} variant - Alert type (info, success, warning, danger)
 * @param {string} title - Alert title
 * @param {React.ReactNode} children - Alert content
 * @param {boolean} dismissible - Show close button
 * @param {function} onDismiss - Dismiss handler
 * @param {string} className - Additional CSS classes
 */
const Alert = ({ 
  variant = 'info', 
  title,
  children, 
  dismissible = false,
  onDismiss,
  className = '',
  ...props 
}) => {
  const alertClass = alertVariants[variant] || alertVariants.info;
  
  const icons = {
    info: <FiInfo className="h-5 w-5 text-cyan-600" />,
    success: <FiCheckCircle className="h-5 w-5 text-green-600" />,
    warning: <FiAlertTriangle className="h-5 w-5 text-yellow-600" />,
    danger: <FiXCircle className="h-5 w-5 text-red-600" />,
  };
  
  const textColors = {
    info: 'text-cyan-900 dark:text-cyan-200',
    success: 'text-green-900 dark:text-green-200',
    warning: 'text-yellow-900 dark:text-yellow-200',
    danger: 'text-red-900 dark:text-red-200',
  };
  
  return (
    <div className={`${alertClass} ${className}`} role="alert" {...props}>
      <div className="flex">
        <div className="flex-shrink-0">
          {icons[variant]}
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${textColors[variant]}`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${title ? 'mt-2' : ''} ${textColors[variant]}`}>
            {children}
          </div>
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  variant === 'info' ? 'text-cyan-500 hover:bg-cyan-100 focus:ring-cyan-600' :
                  variant === 'success' ? 'text-green-500 hover:bg-green-100 focus:ring-green-600' :
                  variant === 'warning' ? 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600' :
                  'text-red-500 hover:bg-red-100 focus:ring-red-600'
                }`}
              >
                <span className="sr-only">Dismiss</span>
                <FiXCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;

