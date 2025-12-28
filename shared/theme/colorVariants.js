// Color Variants System for Admin Panel
// Consistent color palette for all admin pages

export const colorVariants = {
  // Primary Colors (Main Actions, Active States)
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    bg: 'bg-blue-500',
    bgHover: 'hover:bg-blue-600',
    bgLight: 'bg-blue-100',
    text: 'text-blue-600',
    textLight: 'text-blue-500',
    border: 'border-blue-500',
    ring: 'ring-blue-500',
  },

  // Success Colors (Approved, Active, Completed)
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    bg: 'bg-green-500',
    bgHover: 'hover:bg-green-600',
    bgLight: 'bg-green-100',
    text: 'text-green-600',
    textLight: 'text-green-500',
    border: 'border-green-500',
    ring: 'ring-green-500',
  },

  // Warning Colors (Pending, Attention Required)
  warning: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
    bg: 'bg-yellow-500',
    bgHover: 'hover:bg-yellow-600',
    bgLight: 'bg-yellow-100',
    text: 'text-yellow-600',
    textLight: 'text-yellow-500',
    border: 'border-yellow-500',
    ring: 'ring-yellow-500',
  },

  // Danger/Error Colors (Blocked, Deleted, Critical)
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    bg: 'bg-red-500',
    bgHover: 'hover:bg-red-600',
    bgLight: 'bg-red-100',
    text: 'text-red-600',
    textLight: 'text-red-500',
    border: 'border-red-500',
    ring: 'ring-red-500',
  },

  // Info Colors (Information, Updates)
  info: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    bg: 'bg-cyan-500',
    bgHover: 'hover:bg-cyan-600',
    bgLight: 'bg-cyan-100',
    text: 'text-cyan-600',
    textLight: 'text-cyan-500',
    border: 'border-cyan-500',
    ring: 'ring-cyan-500',
  },

  // Purple Colors (Special, Premium Features)
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
    bg: 'bg-purple-500',
    bgHover: 'hover:bg-purple-600',
    bgLight: 'bg-purple-100',
    text: 'text-purple-600',
    textLight: 'text-purple-500',
    border: 'border-purple-500',
    ring: 'ring-purple-500',
  },

  // Orange Colors (Moderate Priority)
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    bg: 'bg-orange-500',
    bgHover: 'hover:bg-orange-600',
    bgLight: 'bg-orange-100',
    text: 'text-orange-600',
    textLight: 'text-orange-500',
    border: 'border-orange-500',
    ring: 'ring-orange-500',
  },

  // Gray/Neutral Colors (Inactive, Disabled, Secondary)
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    bg: 'bg-gray-500',
    bgHover: 'hover:bg-gray-600',
    bgLight: 'bg-gray-100',
    text: 'text-gray-600',
    textLight: 'text-gray-500',
    border: 'border-gray-500',
    ring: 'ring-gray-500',
  },
};

// Status-based color mappings
export const statusColors = {
  // Order/Payment Status
  pending: colorVariants.warning,
  paid: colorVariants.success,
  packed: colorVariants.info,
  shipped: colorVariants.primary,
  delivered: colorVariants.success,
  cancelled: colorVariants.danger,
  refunded: colorVariants.orange,
  
  // User Status
  active: colorVariants.success,
  inactive: colorVariants.gray,
  blocked: colorVariants.danger,
  approved: colorVariants.success,
  'approval-required': colorVariants.warning,
  
  // General Status
  open: colorVariants.success,
  closed: colorVariants.gray,
  resolved: colorVariants.primary,
  expired: colorVariants.orange,
  
  // Priority Levels
  high: colorVariants.danger,
  medium: colorVariants.warning,
  low: colorVariants.success,
};

// Button Variants
export const buttonVariants = {
  primary: `inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`,
  
  secondary: `inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`,
  
  success: `inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`,
  
  danger: `inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`,
  
  warning: `inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`,
  
  info: `inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-cyan-600 border border-transparent rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`,
  
  ghost: `inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-transparent border border-transparent rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`,
  
  outline: {
    primary: `inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-transparent border border-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`,
    success: `inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-green-600 bg-transparent border border-green-600 rounded-lg hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`,
    danger: `inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-transparent border border-red-600 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`,
    warning: `inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-yellow-600 bg-transparent border border-yellow-600 rounded-lg hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`,
  },
};

// Badge Variants
export const badgeVariants = {
  primary: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
  success: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
  danger: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800',
  warning: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800',
  info: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800',
  gray: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800',
  purple: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800',
  orange: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800',
};

// Card Variants
export const cardVariants = {
  default: 'bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700',
  hover: 'bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200 cursor-pointer',
  primary: 'bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow p-6 border border-blue-200 dark:border-blue-700',
  success: 'bg-green-50 dark:bg-green-900/20 rounded-lg shadow p-6 border border-green-200 dark:border-green-700',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow p-6 border border-yellow-200 dark:border-yellow-700',
  danger: 'bg-red-50 dark:bg-red-900/20 rounded-lg shadow p-6 border border-red-200 dark:border-red-700',
};

// Input Variants
export const inputVariants = {
  default: 'block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm transition-all duration-200',
  success: 'block w-full px-3 py-2 border border-green-500 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm transition-all duration-200',
  error: 'block w-full px-3 py-2 border border-red-500 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm transition-all duration-200',
};

// Alert Variants
export const alertVariants = {
  info: 'bg-cyan-50 dark:bg-cyan-900/20 border-l-4 border-cyan-500 p-4 rounded',
  success: 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded',
  danger: 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded',
};

// Helper function to get status badge
export const getStatusBadge = (status) => {
  const statusLower = status?.toLowerCase();
  const colorScheme = statusColors[statusLower] || colorVariants.gray;
  
  return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorScheme.bgLight} ${colorScheme.text}`;
};

// Helper function to get priority badge
export const getPriorityBadge = (priority) => {
  const priorityLower = priority?.toLowerCase();
  const colorScheme = statusColors[priorityLower] || colorVariants.gray;
  
  return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorScheme.bgLight} ${colorScheme.text}`;
};

// Helper function to get button classes
export const getButtonClasses = (variant = 'primary', size = 'md') => {
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  const baseClasses = buttonVariants[variant] || buttonVariants.primary;
  return baseClasses.replace('px-4 py-2 text-sm', sizes[size]);
};

export default colorVariants;

