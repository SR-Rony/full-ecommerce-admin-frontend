# Color Variants System - Admin Panel Design Guide

## 📋 Overview

This guide provides a comprehensive color variant system for maintaining consistent, professional design across all admin pages.

## 🎨 Color Palette

### Primary Colors (Blue)
**Use for:** Main actions, primary buttons, active states, links
- `bg-blue-500` - Primary backgrounds
- `text-blue-600` - Primary text
- `border-blue-500` - Primary borders

### Success Colors (Green)
**Use for:** Approved status, completed actions, active accounts, success messages
- `bg-green-500` - Success backgrounds
- `text-green-600` - Success text
- `border-green-500` - Success borders

### Warning Colors (Yellow)
**Use for:** Pending status, attention required, warnings
- `bg-yellow-500` - Warning backgrounds
- `text-yellow-600` - Warning text
- `border-yellow-500` - Warning borders

### Danger Colors (Red)
**Use for:** Blocked status, delete actions, errors, critical alerts
- `bg-red-500` - Danger backgrounds
- `text-red-600` - Danger text
- `border-red-500` - Danger borders

### Info Colors (Cyan)
**Use for:** Information, updates, notifications
- `bg-cyan-500` - Info backgrounds
- `text-cyan-600` - Info text
- `border-cyan-500` - Info borders

### Purple Colors
**Use for:** Premium features, special categories
- `bg-purple-500` - Purple backgrounds
- `text-purple-600` - Purple text
- `border-purple-500` - Purple borders

### Orange Colors
**Use for:** Moderate priority, refund status
- `bg-orange-500` - Orange backgrounds
- `text-orange-600` - Orange text
- `border-orange-500` - Orange borders

### Gray/Neutral Colors
**Use for:** Inactive status, disabled states, secondary actions
- `bg-gray-500` - Gray backgrounds
- `text-gray-600` - Gray text
- `border-gray-500` - Gray borders

---

## 🔧 Component Usage

### Badge Component

```jsx
import Badge from '@/shared/components/Badge';

// Status-based (automatic color)
<Badge status="active">Active</Badge>
<Badge status="pending">Pending</Badge>
<Badge status="blocked">Blocked</Badge>

// Priority-based (automatic color)
<Badge priority="high">High Priority</Badge>
<Badge priority="medium">Medium</Badge>
<Badge priority="low">Low Priority</Badge>

// Manual variant
<Badge variant="success">Approved</Badge>
<Badge variant="danger">Deleted</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="info">New Update</Badge>
```

### Button Component

```jsx
import Button from '@/shared/components/Button';

// Primary action
<Button variant="primary">Save Changes</Button>

// Secondary action
<Button variant="secondary">Cancel</Button>

// Success action
<Button variant="success">Approve</Button>

// Danger action
<Button variant="danger">Delete</Button>

// With loading state
<Button variant="primary" loading={isLoading}>
  {isLoading ? 'Saving...' : 'Save'}
</Button>

// Outline variant
<Button variant="primary" outline>Edit</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### Card Component

```jsx
import Card, { CardHeader, CardTitle, CardBody, CardFooter } from '@/shared/components/Card';

// Basic card
<Card>
  <h3>Card Content</h3>
</Card>

// Structured card
<Card variant="default">
  <CardHeader>
    <CardTitle>Products Overview</CardTitle>
  </CardHeader>
  <CardBody>
    <p>Card content goes here</p>
  </CardBody>
  <CardFooter>
    <Button>View All</Button>
  </CardFooter>
</Card>

// Variant cards
<Card variant="primary">Primary Card</Card>
<Card variant="success">Success Card</Card>
<Card variant="warning">Warning Card</Card>
<Card variant="danger">Danger Card</Card>

// Hoverable card
<Card variant="hover" onClick={() => alert('Clicked!')}>
  Clickable Card
</Card>
```

### Alert Component

```jsx
import Alert from '@/shared/components/Alert';

// Info alert
<Alert variant="info" title="Information">
  This is an informational message.
</Alert>

// Success alert
<Alert variant="success" title="Success!">
  Your changes have been saved successfully.
</Alert>

// Warning alert
<Alert variant="warning" title="Warning">
  Please review the following before proceeding.
</Alert>

// Danger alert
<Alert variant="danger" title="Error">
  An error occurred while processing your request.
</Alert>

// Dismissible alert
<Alert 
  variant="info" 
  dismissible 
  onDismiss={() => console.log('Dismissed')}
>
  This alert can be dismissed.
</Alert>
```

---

## 📊 Status Color Mappings

### Order Status
- **Pending** → Yellow (Warning)
- **Paid** → Green (Success)
- **Packed** → Cyan (Info)
- **Shipped** → Blue (Primary)
- **Delivered** → Green (Success)
- **Cancelled** → Red (Danger)
- **Refunded** → Orange

### User Status
- **Active** → Green (Success)
- **Inactive** → Gray (Neutral)
- **Blocked** → Red (Danger)
- **Approved** → Green (Success)
- **Approval Required** → Yellow (Warning)

### General Status
- **Open** → Green (Success)
- **Closed** → Gray (Neutral)
- **Resolved** → Blue (Primary)
- **Expired** → Orange

### Priority Levels
- **High** → Red (Danger)
- **Medium** → Yellow (Warning)
- **Low** → Green (Success)

---

## 🎯 Best Practices

### 1. **Consistency is Key**
Always use the same color for the same status/action across all pages.

```jsx
// ✅ Good - Consistent
<Badge status="active">Active</Badge>      // Always green
<Badge status="blocked">Blocked</Badge>    // Always red

// ❌ Bad - Inconsistent
<Badge variant="primary">Active</Badge>    // Sometimes blue
<Badge variant="success">Active</Badge>    // Sometimes green
```

### 2. **Use Semantic Variants**
Choose variants based on meaning, not just aesthetics.

```jsx
// ✅ Good - Semantic
<Button variant="danger" onClick={handleDelete}>Delete</Button>
<Button variant="success" onClick={handleApprove}>Approve</Button>

// ❌ Bad - Non-semantic
<Button variant="primary" onClick={handleDelete}>Delete</Button>
```

### 3. **Proper Contrast**
Ensure text is readable on all backgrounds.

```jsx
// ✅ Good - High contrast
<div className="bg-blue-500 text-white">Text</div>
<div className="bg-blue-100 text-blue-800">Text</div>

// ❌ Bad - Low contrast
<div className="bg-blue-500 text-blue-400">Text</div>
```

### 4. **Responsive Design**
Test color combinations in both light and dark modes.

```jsx
// ✅ Good - Works in both modes
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Content
</div>
```

---

## 📦 Quick Reference

### Import Components
```jsx
import Badge from '@/shared/components/Badge';
import Button from '@/shared/components/Button';
import Card, { CardHeader, CardTitle, CardBody, CardFooter } from '@/shared/components/Card';
import Alert from '@/shared/components/Alert';
```

### Import Color Utilities
```jsx
import { 
  colorVariants, 
  statusColors, 
  buttonVariants, 
  badgeVariants,
  getStatusBadge,
  getPriorityBadge 
} from '@/shared/theme/colorVariants';
```

---

## 🚀 Migration Guide

### Replacing Old Badges

**Before:**
```jsx
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
  Active
</span>
```

**After:**
```jsx
<Badge status="active">Active</Badge>
```

### Replacing Old Buttons

**Before:**
```jsx
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  Save
</button>
```

**After:**
```jsx
<Button variant="primary">Save</Button>
```

### Replacing Old Cards

**Before:**
```jsx
<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
  Content
</div>
```

**After:**
```jsx
<Card>Content</Card>
```

---

## 🎨 Color Examples by Page Type

### Dashboard
- Statistics cards: Primary (blue), Success (green), Warning (yellow), Danger (red)
- Charts: Use primary color variants
- Quick actions: Primary buttons

### Products
- Stock status: Success (in stock), Danger (out of stock), Warning (low stock)
- Featured products: Purple cards
- Actions: Primary (edit), Danger (delete), Info (view)

### Orders
- Order status: Color-coded badges per status
- Payment status: Success (paid), Warning (pending), Danger (failed)
- Actions: Success (approve), Danger (cancel)

### Customers
- Account status: Success (active), Danger (blocked), Warning (pending approval)
- Email verification: Success (verified), Gray (unverified)
- Actions: Primary (view), Success (approve), Danger (block)

---

## 🔍 Troubleshooting

### Issue: Colors not applying
**Solution:** Ensure Tailwind CSS is properly configured and the file is included in the `content` array.

### Issue: Dark mode colors not working
**Solution:** Add `dark:` prefix to dark mode specific classes.

### Issue: Components not importing
**Solution:** Check the file path and ensure the component is exported.

---

## 📞 Support

For questions or issues with the color variant system, refer to:
- This documentation
- Tailwind CSS documentation
- Component source files in `/shared/components`

---

**Last Updated:** November 2025
**Version:** 1.0.0

