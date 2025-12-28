# 🎨 Admin Panel Color Variant System

A comprehensive, production-ready color system for building consistent and professional admin interfaces.

## 📚 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Components](#components)
- [Color Palette](#color-palette)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)
- [API Reference](#api-reference)

---

## Overview

The Color Variant System provides:
- ✅ **8 Pre-defined Color Schemes** (Primary, Success, Warning, Danger, Info, Purple, Orange, Gray)
- ✅ **Smart Status-Based Colors** (Automatic color assignment based on status/priority)
- ✅ **Consistent Components** (Badge, Button, Card, Alert)
- ✅ **Dark Mode Support** (All components work in light and dark modes)
- ✅ **Accessibility Compliant** (WCAG AA contrast ratios)
- ✅ **Fully Responsive** (Mobile-first design)

---

## Quick Start

### Installation

No additional installation required! The system is already integrated into your project.

### Basic Usage

```jsx
// 1. Import components
import Badge from '@/shared/components/Badge';
import Button from '@/shared/components/Button';
import Card from '@/shared/components/Card';
import Alert from '@/shared/components/Alert';

// 2. Use in your component
function MyComponent() {
  return (
    <div>
      <Badge status="active">Active</Badge>
      <Button variant="primary">Click Me</Button>
      <Card>Card Content</Card>
      <Alert variant="success">Success!</Alert>
    </div>
  );
}
```

---

## Components

### 1. Badge Component

Display status indicators, tags, and labels.

```jsx
// Status-based (Automatic color)
<Badge status="active">Active</Badge>
<Badge status="pending">Pending</Badge>
<Badge status="blocked">Blocked</Badge>

// Priority-based (Automatic color)
<Badge priority="high">High</Badge>
<Badge priority="medium">Medium</Badge>
<Badge priority="low">Low</Badge>

// Manual variant
<Badge variant="success">Success</Badge>
<Badge variant="danger">Danger</Badge>
```

**Props:**
- `variant`: `'primary' | 'success' | 'danger' | 'warning' | 'info' | 'gray' | 'purple' | 'orange'`
- `status`: Auto-assigns color based on status
- `priority`: Auto-assigns color based on priority
- `className`: Additional CSS classes

---

### 2. Button Component

Consistent button styling with multiple variants and states.

```jsx
// Basic variants
<Button variant="primary">Primary</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Delete</Button>

// Outline style
<Button variant="primary" outline>Outline</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button loading={true}>Loading...</Button>
<Button disabled>Disabled</Button>
```

**Props:**
- `variant`: `'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'ghost'`
- `size`: `'sm' | 'md' | 'lg'`
- `outline`: `boolean` - Outline style
- `loading`: `boolean` - Show loading spinner
- `disabled`: `boolean` - Disabled state
- `onClick`: Click handler function
- `type`: `'button' | 'submit' | 'reset'`
- `className`: Additional CSS classes

---

### 3. Card Component

Container component with multiple variants and sub-components.

```jsx
// Basic card
<Card>
  <h3>Card Content</h3>
</Card>

// Structured card
<Card variant="default">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardBody>
    Content goes here
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Variant cards
<Card variant="primary">Primary</Card>
<Card variant="success">Success</Card>
<Card variant="hover">Hoverable</Card>
```

**Props:**
- `variant`: `'default' | 'hover' | 'primary' | 'success' | 'warning' | 'danger'`
- `onClick`: Click handler (for interactive cards)
- `className`: Additional CSS classes

**Sub-components:**
- `CardHeader`: Header section with bottom border
- `CardTitle`: Styled title text
- `CardBody`: Main content area
- `CardFooter`: Footer section with top border

---

### 4. Alert Component

Display important messages and notifications.

```jsx
// Basic alerts
<Alert variant="info">Information message</Alert>
<Alert variant="success">Success message</Alert>
<Alert variant="warning">Warning message</Alert>
<Alert variant="danger">Error message</Alert>

// With title
<Alert variant="info" title="Information">
  Detailed message content
</Alert>

// Dismissible
<Alert 
  variant="success" 
  dismissible 
  onDismiss={() => console.log('Dismissed')}
>
  This can be dismissed
</Alert>
```

**Props:**
- `variant`: `'info' | 'success' | 'warning' | 'danger'`
- `title`: Optional title text
- `dismissible`: `boolean` - Show close button
- `onDismiss`: Dismiss handler function
- `className`: Additional CSS classes

---

## Color Palette

### Primary (Blue)
**Use for:** Main actions, links, active states
- Light: `#dbeafe` (bg-blue-100)
- Medium: `#3b82f6` (bg-blue-500)
- Dark: `#1e40af` (bg-blue-800)
- Text: `#2563eb` (text-blue-600)

### Success (Green)
**Use for:** Approved, completed, active accounts
- Light: `#dcfce7` (bg-green-100)
- Medium: `#22c55e` (bg-green-500)
- Dark: `#166534` (bg-green-800)
- Text: `#16a34a` (text-green-600)

### Warning (Yellow)
**Use for:** Pending, attention required
- Light: `#fef9c3` (bg-yellow-100)
- Medium: `#eab308` (bg-yellow-500)
- Dark: `#854d0e` (bg-yellow-800)
- Text: `#ca8a04` (text-yellow-600)

### Danger (Red)
**Use for:** Blocked, errors, delete actions
- Light: `#fee2e2` (bg-red-100)
- Medium: `#ef4444` (bg-red-500)
- Dark: `#991b1b` (bg-red-800)
- Text: `#dc2626` (text-red-600)

### Info (Cyan)
**Use for:** Information, updates
- Light: `#e0f2fe` (bg-cyan-100)
- Medium: `#0ea5e9` (bg-cyan-500)
- Dark: `#075985` (bg-cyan-800)
- Text: `#0284c7` (text-cyan-600)

### Purple
**Use for:** Premium features, special categories
- Light: `#f3e8ff` (bg-purple-100)
- Medium: `#a855f7` (bg-purple-500)
- Dark: `#6b21a8` (bg-purple-800)
- Text: `#9333ea` (text-purple-600)

### Orange
**Use for:** Moderate priority, refunds
- Light: `#ffedd5` (bg-orange-100)
- Medium: `#f97316` (bg-orange-500)
- Dark: `#9a3412` (bg-orange-800)
- Text: `#ea580c` (text-orange-600)

### Gray
**Use for:** Inactive, disabled, secondary
- Light: `#f3f4f6` (bg-gray-100)
- Medium: `#6b7280` (bg-gray-500)
- Dark: `#1f2937` (bg-gray-800)
- Text: `#4b5563` (text-gray-600)

---

## Usage Examples

### Product Page

```jsx
function ProductCard({ product }) {
  return (
    <Card variant="hover">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold">{product.name}</h3>
        <Badge status={product.stock > 0 ? 'active' : 'inactive'}>
          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
        </Badge>
      </div>
      
      <div className="flex gap-2 mb-4">
        {product.featured && (
          <Badge variant="purple">Featured</Badge>
        )}
        <Badge variant="info">{product.category}</Badge>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="primary" size="sm">Edit</Button>
        <Button variant="danger" size="sm" outline>Delete</Button>
      </div>
    </Card>
  );
}
```

### Order Status Management

```jsx
function OrderStatusCard({ order }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3>Order #{order.id}</h3>
        <Badge status={order.status.toLowerCase()}>
          {order.status}
        </Badge>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Payment:</span>
          <Badge status={order.paymentStatus}>
            {order.paymentStatus}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span>Priority:</span>
          <Badge priority={order.priority}>
            {order.priority}
          </Badge>
        </div>
      </div>
      
      {order.status === 'pending' && (
        <Alert variant="warning">
          This order is awaiting payment confirmation
        </Alert>
      )}
      
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="success">Approve</Button>
        <Button variant="danger">Cancel</Button>
      </div>
    </Card>
  );
}
```

### Customer Management

```jsx
function CustomerListItem({ customer }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold">{customer.name}</h4>
        <div className="flex gap-2">
          <Badge status={customer.isBlocked ? 'blocked' : 'active'}>
            {customer.isBlocked ? 'Blocked' : 'Active'}
          </Badge>
          {customer.isEmailVerified && (
            <Badge variant="success">Verified</Badge>
          )}
        </div>
      </div>
      
      {customer.requiresApproval && (
        <Alert variant="warning" title="Approval Required">
          This customer account needs admin approval
        </Alert>
      )}
      
      <div className="flex justify-end space-x-2 mt-3">
        <Button variant="primary" size="sm">View Profile</Button>
        {!customer.isBlocked ? (
          <Button variant="danger" size="sm" outline>Block</Button>
        ) : (
          <Button variant="success" size="sm" outline>Unblock</Button>
        )}
      </div>
    </div>
  );
}
```

---

## Best Practices

### 1. Be Consistent
Always use the same color for the same meaning across all pages.

✅ **Good:**
```jsx
<Badge status="active">Active</Badge>  // Always green
<Badge status="blocked">Blocked</Badge> // Always red
```

❌ **Bad:**
```jsx
<Badge variant="primary">Active</Badge>  // Sometimes blue
<Badge variant="success">Active</Badge>  // Sometimes green
```

### 2. Use Semantic Variants
Choose variants based on meaning, not just appearance.

✅ **Good:**
```jsx
<Button variant="danger" onClick={handleDelete}>Delete</Button>
<Button variant="success" onClick={handleApprove}>Approve</Button>
```

❌ **Bad:**
```jsx
<Button variant="primary" onClick={handleDelete}>Delete</Button>
```

### 3. Maintain Proper Contrast
Ensure text is readable on all backgrounds.

✅ **Good:**
```jsx
<div className="bg-blue-500 text-white">Readable</div>
<div className="bg-blue-100 text-blue-800">Readable</div>
```

❌ **Bad:**
```jsx
<div className="bg-blue-500 text-blue-400">Hard to read</div>
```

### 4. Consider Dark Mode
Test all color combinations in both light and dark modes.

```jsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Works in both modes
</div>
```

### 5. Use Loading States
Provide feedback during async operations.

```jsx
<Button 
  variant="primary" 
  loading={isLoading}
  onClick={handleSave}
>
  {isLoading ? 'Saving...' : 'Save'}
</Button>
```

---

## API Reference

### Helper Functions

#### `getStatusBadge(status)`
Returns appropriate badge classes for a given status.

```jsx
import { getStatusBadge } from '@/shared/theme/colorVariants';

const badgeClass = getStatusBadge('active');
// Returns: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
```

#### `getPriorityBadge(priority)`
Returns appropriate badge classes for a given priority.

```jsx
import { getPriorityBadge } from '@/shared/theme/colorVariants';

const badgeClass = getPriorityBadge('high');
// Returns: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
```

#### `getButtonClasses(variant, size)`
Returns button classes for a given variant and size.

```jsx
import { getButtonClasses } from '@/shared/theme/colorVariants';

const buttonClass = getButtonClasses('primary', 'md');
```

### Direct Access to Variants

```jsx
import { 
  colorVariants,      // All color definitions
  statusColors,       // Status-to-color mappings
  buttonVariants,     // Button style definitions
  badgeVariants,      // Badge style definitions
  cardVariants,       // Card style definitions
  alertVariants,      // Alert style definitions
  inputVariants       // Input style definitions
} from '@/shared/theme/colorVariants';
```

---

## Demo Page

Visit `/admin/color-variants-demo` to see all components and variants in action.

---

## Support & Documentation

- **Full Documentation:** [`COLOR_VARIANTS_GUIDE.md`](./COLOR_VARIANTS_GUIDE.md)
- **Component Source:** `/shared/components/`
- **Color Definitions:** [`colorVariants.js`](./colorVariants.js)

---

**Version:** 1.0.0  
**Last Updated:** November 2025  
**Maintained by:** Admin Panel Team

