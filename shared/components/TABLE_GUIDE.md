# 📊 Professional Table Component Guide

## Overview
A modern, fully-featured table component with professional styling, multiple variants, and responsive design.

---

## ✨ Features

- 🎨 **Multiple Variants** - Modern, Striped, Bordered, Minimal
- 📱 **Fully Responsive** - Auto horizontal scroll on small screens
- 🎭 **Hover Effects** - Smooth row highlighting
- 🔄 **Sortable Columns** - Built-in sorting support
- ⚡ **Loading States** - Professional skeleton loaders
- 📭 **Empty States** - Beautiful empty data displays
- 🌙 **Dark Mode** - Complete dark mode support
- ♿ **Accessible** - Semantic HTML and ARIA support

---

## 📦 Basic Usage

### Simple Table

```jsx
import Table from '@/shared/components/Table';

function MyTable() {
  return (
    <Table variant="modern">
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Email</Table.Head>
          <Table.Head>Status</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>John Doe</Table.Cell>
          <Table.Cell>john@example.com</Table.Cell>
          <Table.Cell>Active</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Jane Smith</Table.Cell>
          <Table.Cell>jane@example.com</Table.Cell>
          <Table.Cell>Inactive</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
}
```

---

## 🎨 Variants

### 1. Modern (Default)
Professional gradient header with shadow and rounded corners.

```jsx
<Table variant="modern">
  {/* content */}
</Table>
```

### 2. Striped
Alternating row colors for better readability.

```jsx
<Table variant="striped">
  {/* content */}
</Table>
```

### 3. Bordered
Strong borders for clear cell separation.

```jsx
<Table variant="bordered">
  {/* content */}
</Table>
```

### 4. Minimal
Clean, minimal design with subtle styling.

```jsx
<Table variant="minimal">
  {/* content */}
</Table>
```

---

## 📋 Components

### Table (Container)
Main table wrapper with variant and responsive options.

**Props:**
- `variant` - "modern" | "striped" | "bordered" | "minimal" (default: "modern")
- `hoverable` - boolean (default: true) - Enable row hover effects
- `responsive` - boolean (default: true) - Enable horizontal scroll
- `className` - string - Additional CSS classes

### Table.Header
Table header section with gradient background.

**Props:**
- `className` - string - Additional CSS classes

### Table.Body
Table body section with row dividers.

**Props:**
- `className` - string - Additional CSS classes

### Table.Footer
Table footer section (optional).

**Props:**
- `className` - string - Additional CSS classes

### Table.Row
Individual table row with hover and click support.

**Props:**
- `hoverable` - boolean (default: true) - Enable hover effect
- `onClick` - function - Row click handler
- `selected` - boolean - Highlight as selected
- `className` - string - Additional CSS classes

### Table.Head
Header cell with sorting support.

**Props:**
- `align` - "left" | "center" | "right" (default: "left")
- `sortable` - boolean - Enable sorting
- `onSort` - function - Sort handler
- `sortDirection` - "asc" | "desc" | null - Current sort direction
- `className` - string - Additional CSS classes

### Table.Cell
Data cell with alignment and variant options.

**Props:**
- `align` - "left" | "center" | "right" (default: "left")
- `variant` - "default" | "status" | "action"
- `className` - string - Additional CSS classes

### Table.Caption
Table caption (optional).

**Props:**
- `className` - string - Additional CSS classes

### Table.Empty
Empty state component.

**Props:**
- `message` - string (default: "No data available")
- `icon` - string (default: "📋") - Emoji icon
- `className` - string - Additional CSS classes

### Table.Loading
Loading state with skeleton rows.

**Props:**
- `rows` - number (default: 5) - Number of skeleton rows
- `columns` - number (default: 4) - Number of skeleton columns
- `className` - string - Additional CSS classes

---

## 🎯 Advanced Examples

### Table with Loading State

```jsx
<Table variant="modern">
  <Table.Header>
    <Table.Row>
      <Table.Head>Name</Table.Head>
      <Table.Head>Email</Table.Head>
      <Table.Head>Status</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {isLoading && <Table.Loading rows={5} columns={3} />}
    {!isLoading && data.map(item => (
      <Table.Row key={item.id}>
        <Table.Cell>{item.name}</Table.Cell>
        <Table.Cell>{item.email}</Table.Cell>
        <Table.Cell>{item.status}</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>
```

### Table with Empty State

```jsx
<Table variant="modern">
  <Table.Header>
    <Table.Row>
      <Table.Head>Product</Table.Head>
      <Table.Head>Price</Table.Head>
      <Table.Head>Stock</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {data.length === 0 && (
      <Table.Empty 
        message="No products found" 
        icon="📦" 
      />
    )}
    {data.length > 0 && data.map(item => (
      <Table.Row key={item.id}>
        <Table.Cell>{item.name}</Table.Cell>
        <Table.Cell>${item.price}</Table.Cell>
        <Table.Cell>{item.stock}</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>
```

### Sortable Table

```jsx
const [sortColumn, setSortColumn] = useState('name');
const [sortDirection, setSortDirection] = useState('asc');

const handleSort = (column) => {
  if (sortColumn === column) {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  } else {
    setSortColumn(column);
    setSortDirection('asc');
  }
};

return (
  <Table variant="modern">
    <Table.Header>
      <Table.Row>
        <Table.Head 
          sortable 
          sortDirection={sortColumn === 'name' ? sortDirection : null}
          onSort={() => handleSort('name')}
        >
          Name
        </Table.Head>
        <Table.Head 
          sortable 
          sortDirection={sortColumn === 'email' ? sortDirection : null}
          onSort={() => handleSort('email')}
        >
          Email
        </Table.Head>
        <Table.Head>Status</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {sortedData.map(item => (
        <Table.Row key={item.id}>
          <Table.Cell>{item.name}</Table.Cell>
          <Table.Cell>{item.email}</Table.Cell>
          <Table.Cell>{item.status}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
);
```

### Clickable Rows

```jsx
<Table variant="modern">
  <Table.Header>
    <Table.Row>
      <Table.Head>Order ID</Table.Head>
      <Table.Head>Customer</Table.Head>
      <Table.Head>Total</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {orders.map(order => (
      <Table.Row 
        key={order.id}
        onClick={() => handleOrderClick(order.id)}
        hoverable={true}
      >
        <Table.Cell>#{order.id}</Table.Cell>
        <Table.Cell>{order.customer}</Table.Cell>
        <Table.Cell>${order.total}</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>
```

### Selected Rows

```jsx
const [selectedRows, setSelectedRows] = useState([]);

<Table variant="modern">
  <Table.Header>
    <Table.Row>
      <Table.Head>Select</Table.Head>
      <Table.Head>Name</Table.Head>
      <Table.Head>Email</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {data.map(item => (
      <Table.Row 
        key={item.id}
        selected={selectedRows.includes(item.id)}
      >
        <Table.Cell>
          <input 
            type="checkbox" 
            checked={selectedRows.includes(item.id)}
            onChange={() => toggleRow(item.id)}
          />
        </Table.Cell>
        <Table.Cell>{item.name}</Table.Cell>
        <Table.Cell>{item.email}</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>
```

### Table with Actions

```jsx
<Table variant="modern">
  <Table.Header>
    <Table.Row>
      <Table.Head>Product</Table.Head>
      <Table.Head>Price</Table.Head>
      <Table.Head align="right">Actions</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {products.map(product => (
      <Table.Row key={product.id}>
        <Table.Cell className="font-medium">
          {product.name}
        </Table.Cell>
        <Table.Cell>
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            ${product.price}
          </span>
        </Table.Cell>
        <Table.Cell align="right" variant="action">
          <div className="flex justify-end gap-2">
            <button className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Edit
            </button>
            <button className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              Delete
            </button>
          </div>
        </Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>
```

### Complex Cell Content

```jsx
<Table variant="modern">
  <Table.Header>
    <Table.Row>
      <Table.Head>Product</Table.Head>
      <Table.Head>Sales</Table.Head>
      <Table.Head>Revenue</Table.Head>
      <Table.Head>Views</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {products.map(product => (
      <Table.Row key={product.id}>
        <Table.Cell className="font-medium">
          <div className="flex items-center gap-3">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {product.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                SKU: {product.sku}
              </div>
            </div>
          </div>
        </Table.Cell>
        <Table.Cell>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {product.sales}
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400">
              +{product.salesGrowth}% this month
            </div>
          </div>
        </Table.Cell>
        <Table.Cell>
          <span className="font-bold text-green-600 dark:text-green-400">
            ${product.revenue.toLocaleString()}
          </span>
        </Table.Cell>
        <Table.Cell>
          <div className="flex items-center gap-1">
            <span className="text-purple-600 dark:text-purple-400">👁️</span>
            <span className="font-semibold">
              {product.views.toLocaleString()}
            </span>
          </div>
        </Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>
```

---

## 🎨 Styling Guidelines

### Color-Coded Values

```jsx
// Price/Money (Blue)
<span className="font-semibold text-blue-600 dark:text-blue-400">
  $99.99
</span>

// Revenue/Positive (Green)
<span className="font-bold text-green-600 dark:text-green-400">
  $1,234.56
</span>

// Count/Quantity (Gray)
<span className="font-semibold text-gray-900 dark:text-white">
  42
</span>

// Views/Stats (Purple)
<div className="flex items-center gap-1">
  <span className="text-purple-600 dark:text-purple-400">👁️</span>
  <span className="font-semibold">1,234</span>
</div>

// Secondary Info (Gray-500)
<span className="text-xs text-gray-500 dark:text-gray-400">
  (Additional info)
</span>

// Success/Positive Change (Emerald)
<span className="text-xs text-emerald-600 dark:text-emerald-400">
  +15% growth
</span>
```

### Status Badges in Tables

```jsx
// Success Status
<span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs font-bold rounded-full">
  Active
</span>

// Warning Status
<span className="px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs font-bold rounded-full">
  Pending
</span>

// Error Status
<span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-xs font-bold rounded-full">
  Inactive
</span>
```

---

## 📱 Responsive Behavior

The table automatically becomes horizontally scrollable on small screens when `responsive={true}` (default).

For better mobile UX, consider:

1. **Hiding less important columns on mobile:**
```jsx
<Table.Head className="hidden md:table-cell">Optional Column</Table.Head>
```

2. **Stacking content vertically in cells:**
```jsx
<Table.Cell>
  <div className="flex flex-col gap-1">
    <span>Primary Info</span>
    <span className="text-xs text-gray-500">Secondary Info</span>
  </div>
</Table.Cell>
```

3. **Using shorter labels on mobile:**
```jsx
<Table.Head>
  <span className="hidden md:inline">Full Name</span>
  <span className="md:hidden">Name</span>
</Table.Head>
```

---

## ♿ Accessibility

The table component follows accessibility best practices:

- ✅ Semantic HTML (`<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`)
- ✅ Proper `scope` attributes on header cells
- ✅ Keyboard navigation support
- ✅ Focus indicators on clickable rows
- ✅ ARIA attributes where needed
- ✅ High contrast colors (WCAG AA compliant)

---

## 🚀 Performance Tips

1. **Virtualize long lists** - Use react-window or react-virtual for tables with 1000+ rows
2. **Memoize expensive computations** - Use `useMemo` for sorted/filtered data
3. **Lazy load data** - Implement pagination or infinite scroll
4. **Optimize re-renders** - Use `React.memo` on Table.Row for static content

---

## 🎯 Best Practices

1. ✅ Use `Table.Loading` instead of showing an empty table while loading
2. ✅ Always provide an `Table.Empty` state when no data is available
3. ✅ Keep table headers concise and descriptive
4. ✅ Use consistent alignment (left for text, right for numbers)
5. ✅ Color-code values for quick visual scanning
6. ✅ Make rows clickable when they lead to details
7. ✅ Use icons to enhance readability (👁️ for views, 💰 for revenue, etc.)
8. ✅ Provide sort functionality for data analysis
9. ✅ Consider mobile users - hide non-essential columns on small screens
10. ✅ Add hover effects for better UX

---

## 🔍 Troubleshooting

### Table not scrolling horizontally on mobile
Make sure `responsive={true}` (default) is set on the `<Table>` component.

### Hover effects not working
Check that `hoverable={true}` is set on the `<Table>` component or individual `<Table.Row>` components.

### Dark mode colors not showing
Ensure all color classes include `dark:` variants (e.g., `text-gray-900 dark:text-white`).

### Empty state not showing
Make sure you're rendering `<Table.Empty>` inside `<Table.Body>`, not as a separate row.

---

## 📚 Related Components

- `Card` - For wrapping tables in cards
- `Badge` - For status indicators in cells
- `Button` - For action buttons in cells
- `Alert` - For displaying messages above/below tables

---

**Created:** October 30, 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready

