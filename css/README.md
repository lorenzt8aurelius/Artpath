# CSS Structure Documentation

This folder contains the organized CSS files for the ArtPath project. The CSS has been broken down into logical components for better maintainability and organization.

## File Structure

### Main Files
- **`main.css`** - Main CSS file that imports all component files
- **`base.css`** - Global styles, fonts, and basic layout
- **`navigation.css`** - Navbar, sidebar, and menu styles
- **`auth.css`** - Authentication modals and forms
- **`dashboard.css`** - Dashboard-specific styles (artist/client dashboards)
- **`landing.css`** - Landing page styles (hero, cards, gallery)
- **`sections.css`** - Landing page sections (features, testimonials, pricing, etc.)
- **`footer.css`** - Footer styles

## Usage

To use these styles in your HTML files, simply link to `css/main.css`:

```html
<link rel="stylesheet" href="css/main.css">
```

## Component Breakdown

### Base Styles (`base.css`)
- Global reset and typography
- Body and background styles
- Utility classes
- Animation keyframes
- Loading states
- Focus states
- Message styling

### Navigation (`navigation.css`)
- Main navbar
- Sticky navigation
- Sidebar menu
- Mobile menu toggle
- Responsive navigation

### Authentication (`auth.css`)
- Modal containers
- Login/Register forms
- Upload art modal
- File input styling
- Form validation states

### Dashboard (`dashboard.css`)
- Dashboard layout and sidebar
- Commission tables
- Profile management
- Messaging system
- Earnings tracking
- Portfolio grid
- Responsive dashboard

### Landing Page (`landing.css`)
- Hero section
- Search functionality
- Card components
- Art gallery
- Welcome sections
- Responsive landing

### Sections (`sections.css`)
- Features section
- How it works
- About section
- Testimonials
- Pricing cards
- FAQ section
- Call-to-action sections

### Footer (`footer.css`)
- Footer layout
- Footer links
- Footer styling

## Benefits of This Structure

1. **Maintainability** - Each component is in its own file
2. **Reusability** - Components can be easily reused across pages
3. **Organization** - Clear separation of concerns
4. **Performance** - Only load the CSS you need
5. **Collaboration** - Multiple developers can work on different components
6. **Debugging** - Easier to find and fix styling issues

## Adding New Styles

When adding new styles:

1. Determine which component file they belong to
2. Add the styles to the appropriate file
3. If it's a new component, create a new CSS file
4. Import the new file in `main.css`

## Best Practices

- Keep related styles together
- Use consistent naming conventions
- Comment complex CSS rules
- Test responsive behavior
- Maintain the existing color scheme and design patterns 