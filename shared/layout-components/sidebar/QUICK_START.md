# Sidebar Quick Start Guide

## 🚀 Quick Start

### 1. Understanding the Structure

The sidebar has three main sections:
- **Header**: Logo and collapse button
- **Navigation**: Menu items with categories
- **Footer**: User profile (when expanded)

### 2. Adding a Simple Menu Item

Edit `nav.js` and add to the `Items` array:

```javascript
{
  icon: <FaYourIcon />,
  title: "Your Page",
  path: "/admin/your-page",
  type: "link",
  active: false,
  selected: false,
}
```

### 3. Adding a Dropdown Menu

```javascript
{
  icon: <FaYourIcon />,
  title: "Parent Item",
  path: "/admin/parent",
  type: "sub",
  active: false,
  selected: false,
  children: [
    {
      title: "Sub Item 1",
      path: "/admin/parent/sub1",
      type: "link",
      active: false,
      selected: false,
    },
    {
      title: "Sub Item 2",
      path: "/admin/parent/sub2",
      type: "link",
      active: false,
      selected: false,
    },
  ],
}
```

## 🎨 Common Customizations

### Change Sidebar Width

```javascript
// In sidebar.js, line ~525
${isCollapsed ? 'w-20' : 'w-72'}
// Change w-72 to your desired width (e.g., w-64, w-80)
```

### Change Colors

**Active Menu Color:**
```javascript
// Line ~593, ~616
bg-blue-600  // Change to any Tailwind color
```

**Hover Color:**
```javascript
// Line ~594, ~617
hover:bg-slate-700/50  // Adjust opacity or color
```

**Background Gradient:**
```css
/* In sidebar.module.css */
.sidebar-gradient {
  background: linear-gradient(
    180deg,
    #0f172a 0%,    /* Top color */
    #1e293b 50%,   /* Middle color */
    #0f172a 100%   /* Bottom color */
  );
}
```

### Disable Animations

```javascript
// For individual elements, remove transition classes:
transition-all duration-300

// Or set duration to 0:
transition-all duration-0
```

## 📱 Responsive Behavior

### Mobile (< 1024px)
- Sidebar hidden by default
- Hamburger menu in top-left
- Overlay when open
- Swipe to close (via overlay click)

### Desktop (≥ 1024px)
- Always visible
- Collapsible via chevron button
- Tooltips show on collapsed items
- Main content adjusts automatically

## 🔧 Common Tasks

### Change Menu Order

Simply reorder items in the `Items` array in `nav.js`.

### Hide Menu Item Conditionally

```javascript
{
  ...yourMenuItem,
  // Add conditional rendering in sidebar.js
  hidden: !userHasPermission, // Add this field
}

// Then in sidebar.js, filter items:
{firstlayer.Items.filter(item => !item.hidden).map((secondlayer, idx) => ...)}
```

### Add Icon to Menu

```javascript
// 1. Import icon at top of nav.js
import { FaNewIcon } from "react-icons/fa";

// 2. Use in menu item
{
  icon: <FaNewIcon />,
  title: "New Item",
  // ...
}
```

### Change Logo

Update in your app settings or directly:

```javascript
// In sidebar.js, replace:
src={appInfoSetting?.siteLogo}
// With:
src="/path/to/your/logo.png"
```

## 🐛 Quick Fixes

### Sidebar Overlaps Content

```javascript
// Add to your main content container:
className="lg:ml-72" // Match sidebar width
```

### Menu Not Highlighting Active Page

Check that the path in `nav.js` matches your route exactly:

```javascript
// If your route is: /admin/products
path: `/admin/products`, // Correct
path: `/admin/products/`, // Wrong (extra slash)
```

### Mobile Menu Won't Close

Ensure you're calling `setIsMobileMenuOpen(false)` in menu item onClick:

```javascript
onClick={() => {
  setSidemenu(secondlayer);
  setIsMobileMenuOpen(false); // This line
}}
```

## 💡 Pro Tips

1. **Icon Size**: Use consistent icon sizes (18-20px) for visual harmony
2. **Menu Depth**: Keep navigation depth to 2 levels max for UX
3. **Categories**: Group 5-7 items per category for easy scanning
4. **Tooltips**: They auto-show when sidebar is collapsed
5. **Animations**: Use `animate-fadeIn` class for custom animations

## 🎯 Feature Checklist

When adding a new menu item, ensure:

- [ ] Icon is imported and sized correctly
- [ ] Path matches the actual route
- [ ] Title is clear and concise
- [ ] Added to correct category
- [ ] Tested on mobile
- [ ] Active state works
- [ ] Accessibility (keyboard nav works)

## 📊 Performance Tips

1. **Use React.memo** for menu items if you have many items
2. **Lazy load** icons if using many custom icons
3. **Debounce** search if adding search functionality
4. **Virtual scrolling** if you have 100+ menu items

## 🔐 Adding Permissions

```javascript
// In nav.js
{
  icon: <FaAdmin />,
  title: "Admin Only",
  path: "/admin/settings",
  type: "link",
  requiredRole: "admin", // Add custom field
}

// In sidebar.js, filter based on user role
const filteredItems = firstlayer.Items.filter(item => {
  if (!item.requiredRole) return true;
  return authData?.role === item.requiredRole;
});
```

## 🌍 Internationalization (i18n)

```javascript
// In nav.js, use translation keys
{
  icon: <FaDashboard />,
  title: t('sidebar.dashboard'), // Use translation function
  path: "/admin/dashboard",
}
```

## 🔄 Dynamic Menu Items

```javascript
// Load menu items from API
const [menuitems, setMenuitems] = useState([]);

useEffect(() => {
  fetchMenuItems().then(items => {
    setMenuitems(items);
  });
}, []);
```

## 📝 Common Mistakes to Avoid

❌ **Don't:**
- Add too many top-level items (>15)
- Use vague menu labels
- Forget to test mobile view
- Override styles with !important
- Ignore accessibility

✅ **Do:**
- Group related items
- Use clear, action-oriented labels
- Test on real devices
- Use provided style classes
- Include ARIA labels

## 🚀 Next Steps

1. Review the full [README.md](./README.md) for detailed documentation
2. Check `sidebar.module.css` for available CSS classes
3. Test all responsive breakpoints
4. Verify accessibility with keyboard navigation
5. Run lighthouse audit for performance

## 📞 Getting Help

- Check console for errors
- Verify import paths
- Review React DevTools for state issues
- Test in different browsers
- Check Tailwind CSS is compiling correctly

---

**Happy Coding! 🎉**

