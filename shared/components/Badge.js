import React from 'react';
import { badgeVariants, getStatusBadge, getPriorityBadge } from '../theme/colorVariants';

/**
 * Badge Component - Displays status, priority, or categorical information
 * @param {string} variant - Color variant (primary, success, danger, warning, info, gray, purple, orange)
 * @param {string} status - If provided, automatically determines color based on status
 * @param {string} priority - If provided, automatically determines color based on priority
 * @param {React.ReactNode} children - Badge content
 * @param {string} className - Additional CSS classes
 */
const Badge = ({ 
  variant = 'primary', 
  status, 
  priority, 
  children, 
  className = '',
  ...props 
}) => {
  let badgeClass;
  
  if (status) {
    badgeClass = getStatusBadge(status);
  } else if (priority) {
    badgeClass = getPriorityBadge(priority);
  } else {
    badgeClass = badgeVariants[variant] || badgeVariants.primary;
  }
  
  return (
    <span 
      className={`${badgeClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;

