/**
 * Professional Table Component
 * A modern, responsive table with multiple variants and features
 * 
 * @example
 * <Table variant="modern">
 *   <Table.Header>
 *     <Table.Row>
 *       <Table.Head>Name</Table.Head>
 *       <Table.Head>Email</Table.Head>
 *     </Table.Row>
 *   </Table.Header>
 *   <Table.Body>
 *     <Table.Row>
 *       <Table.Cell>John</Table.Cell>
 *       <Table.Cell>john@example.com</Table.Cell>
 *     </Table.Row>
 *   </Table.Body>
 * </Table>
 */

import React from 'react';

/**
 * Main Table Container
 */
const Table = ({ 
  children, 
  className = '',
  variant = 'modern', // modern, striped, bordered, minimal
  hoverable = true,
  responsive = true
}) => {
  const baseClasses = 'w-full text-sm text-left';
  
  const variantClasses = {
    modern: 'rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700',
    striped: 'rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700',
    bordered: 'border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden',
    minimal: ''
  };

  const containerClasses = responsive 
    ? 'overflow-x-auto rounded-xl' 
    : '';

  const tableClasses = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.modern}
    ${className}
  `.trim();

  return (
    <div className={containerClasses}>
      <table className={tableClasses} data-hoverable={hoverable} data-variant={variant}>
        {children}
      </table>
    </div>
  );
};

/**
 * Table Header
 */
const TableHeader = ({ children, className = '' }) => {
  return (
    <thead className={`bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-750 ${className}`}>
      {children}
    </thead>
  );
};

/**
 * Table Body
 */
const TableBody = ({ children, className = '' }) => {
  return (
    <tbody className={`bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 ${className}`}>
      {children}
    </tbody>
  );
};

/**
 * Table Footer
 */
const TableFooter = ({ children, className = '' }) => {
  return (
    <tfoot className={`bg-gray-50 dark:bg-gray-700/50 ${className}`}>
      {children}
    </tfoot>
  );
};

/**
 * Table Row
 */
const TableRow = ({ 
  children, 
  className = '',
  onClick,
  hoverable = true,
  selected = false
}) => {
  const hoverClasses = hoverable 
    ? 'hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors duration-150' 
    : '';
  
  const clickableClasses = onClick 
    ? 'cursor-pointer' 
    : '';

  const selectedClasses = selected
    ? 'bg-blue-100 dark:bg-blue-900/20'
    : '';

  const rowClasses = `
    ${hoverClasses}
    ${clickableClasses}
    ${selectedClasses}
    ${className}
  `.trim();

  return (
    <tr className={rowClasses} onClick={onClick}>
      {children}
    </tr>
  );
};

/**
 * Table Head Cell
 */
const TableHead = ({ 
  children, 
  className = '',
  align = 'left', // left, center, right
  sortable = false,
  onSort,
  sortDirection // 'asc', 'desc', null
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const sortableClasses = sortable 
    ? 'cursor-pointer select-none hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors' 
    : '';

  const headClasses = `
    px-6 py-4
    text-xs font-bold uppercase tracking-wider
    text-gray-700 dark:text-gray-300
    whitespace-nowrap
    ${alignClasses[align]}
    ${sortableClasses}
    ${className}
  `.trim();

  return (
    <th className={headClasses} onClick={sortable ? onSort : undefined}>
      <div className="flex items-center gap-2">
        {children}
        {sortable && (
          <span className="text-gray-400">
            {sortDirection === 'asc' && '↑'}
            {sortDirection === 'desc' && '↓'}
            {!sortDirection && '⇅'}
          </span>
        )}
      </div>
    </th>
  );
};

/**
 * Table Data Cell
 */
const TableCell = ({ 
  children, 
  className = '',
  align = 'left', // left, center, right
  variant = 'default' // default, status, action
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const variantClasses = {
    default: 'text-gray-900 dark:text-white',
    status: 'font-semibold',
    action: ''
  };

  const cellClasses = `
    px-6 py-4
    ${alignClasses[align]}
    ${variantClasses[variant]}
    ${className}
  `.trim();

  return (
    <td className={cellClasses}>
      {children}
    </td>
  );
};

/**
 * Table Caption
 */
const TableCaption = ({ children, className = '' }) => {
  return (
    <caption className={`py-3 text-sm text-gray-600 dark:text-gray-400 ${className}`}>
      {children}
    </caption>
  );
};

/**
 * Empty State Component
 */
const TableEmpty = ({ message = "No data available", icon = "📋", className = '' }) => {
  return (
    <TableRow hoverable={false}>
      <TableCell colSpan={100} align="center" className={`py-12 ${className}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="text-5xl opacity-50">{icon}</div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">{message}</p>
        </div>
      </TableCell>
    </TableRow>
  );
};

/**
 * Loading State Component
 */
const TableLoading = ({ rows = 5, columns = 4, className = '' }) => {
  return (
    <>
      {[...Array(rows)].map((_, rowIndex) => (
        <TableRow key={rowIndex} hoverable={false}>
          {[...Array(columns)].map((_, colIndex) => (
            <TableCell key={colIndex} className={className}>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

// Attach sub-components to main Table component
Table.Header = TableHeader;
Table.Body = TableBody;
Table.Footer = TableFooter;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;
Table.Caption = TableCaption;
Table.Empty = TableEmpty;
Table.Loading = TableLoading;

export default Table;

