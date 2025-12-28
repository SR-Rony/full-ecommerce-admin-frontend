import React from 'react';
import { cardVariants } from '../theme/colorVariants';

/**
 * Card Component - Consistent card styling across admin panel
 * @param {string} variant - Color variant (default, hover, primary, success, warning, danger)
 * @param {React.ReactNode} children - Card content
 * @param {string} className - Additional CSS classes
 * @param {function} onClick - Click handler (for interactive cards)
 */
const Card = ({ 
  variant = 'default', 
  children, 
  className = '',
  onClick,
  ...props 
}) => {
  const cardClass = cardVariants[variant] || cardVariants.default;
  
  return (
    <div 
      className={`${cardClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * CardHeader Component - Consistent card header styling
 */
export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 ${className}`} {...props}>
    {children}
  </div>
);

/**
 * CardTitle Component - Card title styling
 */
export const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`} {...props}>
    {children}
  </h3>
);

/**
 * CardBody Component - Card body with consistent padding
 */
export const CardBody = ({ children, className = '', noPadding = false, ...props }) => (
  <div className={`${noPadding ? '' : 'p-6'} ${className}`} {...props}>
    {children}
  </div>
);

/**
 * CardFooter Component - Card footer styling
 */
export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;

