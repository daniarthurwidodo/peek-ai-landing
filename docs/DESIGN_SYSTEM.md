# Design System Documentation

**Version:** 1.0  
**Last Updated:** February 14, 2026  
**Status:** Active

---

## 1. Overview

The AI Interview Assistant design system provides a consistent visual language and component library for building user interfaces across the platform.

### 1.1 Design Principles

**Clarity** - Clear hierarchy and intuitive interactions  
**Consistency** - Unified patterns across all features  
**Accessibility** - WCAG AA compliant, inclusive design  
**Performance** - Fast loading, smooth interactions  
**Responsiveness** - Mobile-first, adaptive layouts

---

## 2. Brand Identity

### 2.1 Brand Values
- Professional yet approachable
- Trustworthy and reliable
- Modern and innovative
- Empowering and supportive

### 2.2 Voice & Tone
- **Voice:** Knowledgeable, supportive, encouraging
- **Tone:** Varies by context (celebratory for success, empathetic for challenges)

---

## 3. Color System

### 3.1 Primary Colors

**Blue (Primary)**
- `blue-50`: #eff6ff (Backgrounds)
- `blue-100`: #dbeafe (Hover states)
- `blue-500`: #3b82f6 (Interactive elements)
- `blue-600`: #2563eb (Primary actions)
- `blue-700`: #1d4ed8 (Active states)

**Usage:** Primary actions, links, focus states

### 3.2 Neutral Colors

**Gray Scale**
- `gray-50`: #f9fafb (Light backgrounds)
- `gray-100`: #f3f4f6 (Borders, dividers)
- `gray-300`: #d1d5db (Disabled states)
- `gray-600`: #4b5563 (Secondary text)
- `gray-900`: #111827 (Primary text)
- `black`: #000000 (Dark mode background)

**Usage:** Text, backgrounds, borders

### 3.3 Semantic Colors

**Success (Green)**
- `green-50`: #f0fdf4
- `green-600`: #16a34a
- Usage: Success messages, positive feedback

**Warning (Yellow)**
- `yellow-50`: #fefce8
- `yellow-600`: #ca8a04
- Usage: Warnings, caution states

**Error (Red)**
- `red-50`: #fef2f2
- `red-600`: #dc2626
- Usage: Errors, destructive actions

**Info (Blue)**
- `blue-50`: #eff6ff
- `blue-600`: #2563eb
- Usage: Informational messages

### 3.4 Dark Mode

**Background Colors**
- Primary: `#000000`
- Secondary: `#111827`
- Tertiary: `#1f2937`

**Text Colors**
- Primary: `#ffffff`
- Secondary: `#d1d5db`
- Tertiary: `#9ca3af`

---

## 4. Typography

### 4.1 Font Families

**Sans Serif (Primary)**
- Font: Geist Sans
- Variable: `--font-geist-sans`
- Usage: Body text, UI elements

**Monospace (Code)**
- Font: Geist Mono
- Variable: `--font-geist-mono`
- Usage: Code snippets, technical content

### 4.2 Type Scale

**Headings**
```css
h1: text-4xl sm:text-6xl (36px/60px)
h2: text-3xl sm:text-4xl (30px/36px)
h3: text-2xl (24px)
h4: text-xl (20px)
h5: text-lg (18px)
h6: text-base (16px)
```

**Body Text**
```css
Large: text-lg (18px)
Base: text-base (16px)
Small: text-sm (14px)
Extra Small: text-xs (12px)
```

### 4.3 Font Weights

- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### 4.4 Line Heights

- Tight: leading-tight (1.25)
- Normal: leading-normal (1.5)
- Relaxed: leading-relaxed (1.625)
- Loose: leading-loose (2)

---

## 5. Spacing System

### 5.1 Spacing Scale

Based on 4px base unit:

```
0: 0px
1: 4px
2: 8px
3: 12px
4: 16px
5: 20px
6: 24px
8: 32px
10: 40px
12: 48px
16: 64px
20: 80px
24: 96px
32: 128px
```

### 5.2 Component Spacing

**Padding**
- Small: p-2 (8px)
- Medium: p-4 (16px)
- Large: p-6 (24px)
- Extra Large: p-8 (32px)

**Margin**
- Small: m-2 (8px)
- Medium: m-4 (16px)
- Large: m-6 (24px)
- Extra Large: m-8 (32px)

**Gap (Flexbox/Grid)**
- Small: gap-2 (8px)
- Medium: gap-4 (16px)
- Large: gap-6 (24px)

---

## 6. Layout System

### 6.1 Breakpoints

```css
sm: 640px   /* Tablet */
md: 768px   /* Small laptop */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### 6.2 Container Widths

```css
max-w-7xl: 1280px (Main content)
max-w-2xl: 672px (Centered content)
max-w-lg: 512px (Forms, cards)
```

### 6.3 Grid System

**12-Column Grid**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Content */}
</div>
```

---

## 7. Components

### 7.1 Buttons

**Primary Button**
```tsx
<button className="rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors">
  Get Started
</button>
```

**Secondary Button**
```tsx
<button className="rounded-full border border-gray-300 px-8 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
  Learn More
</button>
```

**Sizes**
- Small: `px-4 py-2 text-xs`
- Medium: `px-6 py-2 text-sm`
- Large: `px-8 py-3 text-sm`

**States**
- Default: Base styles
- Hover: `hover:bg-blue-500`
- Active: `active:bg-blue-700`
- Disabled: `disabled:opacity-50 disabled:cursor-not-allowed`
- Loading: Show spinner, disable interaction

### 7.2 Cards

**Basic Card**
```tsx
<div className="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-xl ring-1 ring-gray-200 dark:ring-gray-700">
  {/* Content */}
</div>
```

**Interactive Card**
```tsx
<div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow hover:shadow-lg transition-shadow cursor-pointer">
  {/* Content */}
</div>
```

### 7.3 Forms

**Input Field**
```tsx
<input
  type="text"
  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
  placeholder="Enter text"
/>
```

**Label**
```tsx
<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
  Label Text
</label>
```

**Error Message**
```tsx
<p className="mt-1 text-sm text-red-600">
  Error message here
</p>
```

### 7.4 Navigation

**Header**
```tsx
<header className="sticky top-0 z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
  <nav className="max-w-7xl mx-auto px-6 py-4">
    {/* Navigation items */}
  </nav>
</header>
```

**Footer**
```tsx
<footer className="bg-gray-50 dark:bg-gray-900 py-12">
  <div className="max-w-7xl mx-auto px-6">
    {/* Footer content */}
  </div>
</footer>
```

### 7.5 Modals

**Modal Overlay**
```tsx
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
    {/* Modal content */}
  </div>
</div>
```

### 7.6 Alerts

**Success Alert**
```tsx
<div className="rounded-lg bg-green-50 dark:bg-green-900 p-4 border border-green-200 dark:border-green-700">
  <p className="text-sm text-green-800 dark:text-green-200">
    Success message
  </p>
</div>
```

**Error Alert**
```tsx
<div className="rounded-lg bg-red-50 dark:bg-red-900 p-4 border border-red-200 dark:border-red-700">
  <p className="text-sm text-red-800 dark:text-red-200">
    Error message
  </p>
</div>
```

---

## 8. Icons & Imagery

### 8.1 Icon System

**Icon Library:** Use emoji or icon library (Heroicons, Lucide)

**Sizes**
- Small: 16px
- Medium: 24px
- Large: 32px
- Extra Large: 48px

**Usage**
```tsx
<span className="text-2xl">🎯</span>
```

### 8.2 Images

**Optimization**
- Use WebP format
- Lazy loading
- Responsive images
- Alt text required

**Aspect Ratios**
- Square: 1:1
- Landscape: 16:9
- Portrait: 3:4

---

## 9. Animation & Transitions

### 9.1 Timing Functions

```css
ease-in: cubic-bezier(0.4, 0, 1, 1)
ease-out: cubic-bezier(0, 0, 0.2, 1)
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
```

### 9.2 Duration

- Fast: 150ms (Hover states)
- Normal: 300ms (Transitions)
- Slow: 500ms (Complex animations)

### 9.3 Common Transitions

**Fade In**
```css
transition: opacity 300ms ease-in-out
```

**Slide In**
```css
transition: transform 300ms ease-out
```

**Scale**
```css
transition: transform 200ms ease-in-out
```

---

## 10. Accessibility

### 10.1 Color Contrast

- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

### 10.2 Focus States

All interactive elements must have visible focus:

```css
focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
```

### 10.3 Keyboard Navigation

- Tab order follows visual order
- All interactive elements keyboard accessible
- Skip links for main content
- Escape key closes modals

### 10.4 Screen Readers

- Semantic HTML elements
- ARIA labels where needed
- Alt text for images
- Hidden text for icon-only buttons

---

## 11. Dark Mode

### 11.1 Implementation

Use Tailwind's dark mode classes:

```tsx
<div className="bg-white dark:bg-black text-gray-900 dark:text-white">
  Content
</div>
```

### 11.2 Color Adjustments

- Reduce contrast in dark mode
- Use softer shadows
- Adjust opacity for overlays
- Test readability

---

## 12. Component Library (Mantine)

### 12.1 Mantine Components

We use Mantine UI for complex components:

- Modals
- Dropdowns
- Date pickers
- Tooltips
- Notifications

### 12.2 Customization

```tsx
import { MantineProvider } from '@mantine/core';

<MantineProvider
  theme={{
    primaryColor: 'blue',
    fontFamily: 'var(--font-geist-sans)',
  }}
>
  {children}
</MantineProvider>
```

---

## 13. Best Practices

### 13.1 Do's ✅

- Use design tokens (Tailwind classes)
- Maintain consistent spacing
- Follow accessibility guidelines
- Test in dark mode
- Use semantic HTML
- Optimize images
- Test on multiple devices

### 13.2 Don'ts ❌

- Don't use arbitrary values
- Don't skip accessibility
- Don't ignore mobile
- Don't use inline styles
- Don't forget alt text
- Don't use low contrast colors

---

## 14. Resources

### 14.1 Tools

- Figma (Design mockups)
- Tailwind CSS (Styling)
- Mantine UI (Component library)
- Heroicons (Icon library)

### 14.2 References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Mantine Documentation](https://mantine.dev)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web.dev Accessibility](https://web.dev/accessibility)

---

**Questions or Feedback?**  
Contact the design team or create an issue in the repository.
