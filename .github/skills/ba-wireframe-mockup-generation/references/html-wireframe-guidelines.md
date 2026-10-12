# HTML Wireframe Design Guidelines

Rules and best practices for generating presentable HTML wireframe prototypes.
Inspired by self-contained single-file HTML prototyping and modern design system principles.

---

## Technology Stack

| Layer | Choice | Reason |
|---|---|---|
| **CSS Framework** | Tailwind CSS (CDN) | Utility-first, no build step, rapid prototyping |
| **Icons** | Heroicons (inline SVG) or Lucide Icons (CDN) | Clean, consistent, MIT-licensed |
| **Fonts** | Inter (Google Fonts CDN) | Modern, readable, widely used in design systems |
| **Interactivity** | Vanilla JS only | No framework dependency, single-file portability |

### CDN References (always use these exact versions)

```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Google Fonts: Inter -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<!-- Lucide Icons (optional) -->
<script src="https://unpkg.com/lucide@latest"></script>
```

---

## File Structure

Every HTML wireframe MUST be a **single self-contained HTML file** — no external dependencies beyond CDN links.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Screen Name] — Wireframe</title>
    <!-- CDN imports -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script>
        tailwind.config = { /* custom config if needed */ }
    </script>
    <style type="text/tailwindcss">
        /* Custom utilities if needed */
    </style>
</head>
<body class="font-['Inter'] bg-gray-50 antialiased">
    <!-- Wireframe content -->
</body>
</html>
```

---

## Design Tokens (Wireframe Palette)

Use a constrained wireframe-appropriate color palette to keep focus on layout and structure:

| Token | Tailwind Class | Usage |
|---|---|---|
| **Background** | `bg-gray-50` | Page background |
| **Surface** | `bg-white` | Cards, panels, modals |
| **Border** | `border-gray-200` | Dividers, input borders |
| **Text Primary** | `text-gray-900` | Headings, labels |
| **Text Secondary** | `text-gray-500` | Descriptions, hints |
| **Text Muted** | `text-gray-400` | Placeholders |
| **Primary Action** | `bg-blue-600 text-white` | Primary buttons, links |
| **Secondary Action** | `bg-white border-gray-300 text-gray-700` | Secondary buttons |
| **Danger** | `bg-red-600 text-white` | Destructive actions |
| **Success** | `bg-green-600 text-white` | Confirmation states |
| **Warning** | `bg-amber-500 text-white` | Warning states |
| **Focus Ring** | `ring-2 ring-blue-500 ring-offset-2` | Focus states |

If the project has its own design system (colours, fonts, spacing already defined elsewhere),
prefer those tokens over the generic palette above — ask the user for the project's design
tokens before generating a Mid/Hi-fi prototype.

### When to Use Color vs Gray

- **Gray only (default):** Low-fidelity wireframe — focus on layout and hierarchy
- **With accent color:** Medium-fidelity — highlight interactive elements and CTAs
- **Full palette:** High-fidelity prototype — near-production visual appearance

---

## Layout Principles

### Mobile-First Responsive

Always design mobile-first, then layer desktop breakpoints:

```html
<!-- Mobile: stack, Desktop: side-by-side -->
<div class="flex flex-col md:flex-row">...</div>
```

### Standard Breakpoints

| Breakpoint | Width | Typical Use |
|---|---|---|
| Default (no prefix) | < 640px | Mobile phone |
| `sm:` | ≥ 640px | Large phone / small tablet |
| `md:` | ≥ 768px | Tablet |
| `lg:` | ≥ 1024px | Desktop |
| `xl:` | ≥ 1280px | Large desktop |

### Page Layout Patterns

| Pattern | When to Use | Structure |
|---|---|---|
| **Single Column** | Forms, content pages, mobile | `max-w-lg mx-auto` |
| **Sidebar + Content** | Dashboards, admin panels | `grid grid-cols-1 lg:grid-cols-[250px_1fr]` |
| **Header + Main + Footer** | Standard pages | Flex column with `min-h-screen` |
| **Multi-Column Grid** | Card layouts, listings | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6` |

### Spacing Scale

Use consistent spacing (Tailwind defaults):
- **Section gaps:** `space-y-8` or `gap-8`
- **Card padding:** `p-6`
- **Form field gaps:** `space-y-4`
- **Inline element gaps:** `gap-2` or `gap-3`

---

## Component Patterns

### Navigation Bar

```html
<nav class="bg-white border-b border-gray-200 px-4 py-3">
  <div class="max-w-7xl mx-auto flex items-center justify-between">
    <div class="font-semibold text-lg text-gray-900">[Logo/App Name]</div>
    <div class="hidden md:flex items-center gap-6">
      <a href="#" class="text-gray-600 hover:text-gray-900">Nav Item</a>
    </div>
    <!-- Mobile menu button -->
    <button class="md:hidden p-2 text-gray-600">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>
  </div>
</nav>
```

### Form Input

```html
<div>
  <label class="block text-sm font-medium text-gray-700 mb-1">[Label]</label>
  <input type="text" placeholder="[Placeholder]"
    class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
  <p class="mt-1 text-sm text-gray-500">[Helper text]</p>
</div>
```

### Button Variants

```html
<!-- Primary -->
<button class="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Primary Action
</button>

<!-- Secondary -->
<button class="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Secondary
</button>

<!-- Danger -->
<button class="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
  Delete
</button>
```

### Card

```html
<div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
  <h3 class="text-lg font-semibold text-gray-900">[Card Title]</h3>
  <p class="mt-2 text-gray-500">[Description]</p>
</div>
```

### Table

```html
<div class="overflow-x-auto">
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">[Column]</th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      <tr class="hover:bg-gray-50">
        <td class="px-6 py-4 text-sm text-gray-900">[Value]</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Modal / Dialog

```html
<!-- Backdrop -->
<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <!-- Modal -->
  <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
    <h2 class="text-xl font-semibold text-gray-900">[Modal Title]</h2>
    <p class="mt-2 text-gray-500">[Content]</p>
    <div class="mt-6 flex justify-end gap-3">
      <button class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg">Cancel</button>
      <button class="px-4 py-2 bg-blue-600 text-white rounded-lg">Confirm</button>
    </div>
  </div>
</div>
```

### Toast / Alert

```html
<div class="rounded-lg border border-blue-200 bg-blue-50 p-4 flex items-start gap-3">
  <svg class="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
  <p class="text-sm text-blue-800">[Alert message]</p>
</div>
```

### Empty State

```html
<div class="text-center py-12">
  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
  </svg>
  <h3 class="mt-2 text-sm font-medium text-gray-900">[Empty state title]</h3>
  <p class="mt-1 text-sm text-gray-500">[Description]</p>
  <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">[CTA]</button>
</div>
```

---

## Accessibility Requirements

Every HTML wireframe MUST include:

1. **Semantic HTML** — Use `<nav>`, `<main>`, `<header>`, `<footer>`, `<section>`, `<article>`
2. **ARIA labels** — On interactive elements without visible text: `aria-label="Close modal"`
3. **Focus management** — All interactive elements must be keyboard-accessible
4. **Color contrast** — Minimum WCAG AA (4.5:1 for text, 3:1 for large text)
5. **Alt text** — All images must have `alt` attribute (use `alt=""` for decorative)
6. **Form labels** — Every input must have an associated `<label>`
7. **Skip link** — Include for complex pages: `<a href="#main" class="sr-only focus:not-sr-only">Skip to content</a>`

---

## Interactivity Guidelines

### What to Include

- Tab/panel switching (show/hide content)
- Mobile menu toggle
- Modal open/close
- Dropdown expand/collapse
- Form validation visual feedback (no backend)
- Accordion expand/collapse

### What NOT to Include

- API calls or data fetching
- Router/navigation between pages (use anchor links within the same file)
- State management libraries
- Authentication flows
- Real form submission

### Implementation Pattern

```html
<script>
  // Simple toggle pattern
  function toggle(id) {
    const el = document.getElementById(id);
    el.classList.toggle('hidden');
  }
</script>
```

---

## Fidelity Levels

| Level | Name | Use Case | Characteristics |
|---|---|---|---|
| **Lo-fi** | Layout Wireframe | Early exploration, stakeholder alignment | Gray palette only, placeholder text `[...]`, no images, focus on structure |
| **Mid-fi** | Interactive Wireframe | Feature review, story attachment | Accent colors on CTAs, real labels, hover states, basic interactivity |
| **Hi-fi** | Visual Prototype | Design sign-off, usability testing | Full color palette, real copy, icons, transitions, responsive |

### Default: Mid-fi

Unless the user requests otherwise, generate **mid-fi** wireframes — they balance speed with communication clarity.

---

## Anti-Patterns

| Don't | Do Instead |
|---|---|
| Use React/Vue/Angular | Vanilla HTML + Tailwind + minimal JS |
| Import npm packages | Use CDN links only |
| Create multiple files | Single self-contained HTML file |
| Use Lorem Ipsum | Use realistic placeholder text relevant to the domain |
| Hardcode pixel values | Use Tailwind spacing/sizing utilities |
| Skip mobile layout | Always include responsive classes |
| Use inline styles | Use Tailwind utility classes |
| Add complex animations | Keep transitions simple (`transition-all duration-200`) |
| Use proprietary fonts | Use Inter or system fonts |
| Create backend functionality | Focus on visual and interaction only |

---

## Wireframe Annotation

Add a floating annotation panel at the bottom of the wireframe for context:

```html
<!-- Wireframe metadata (hidden in print) -->
<div class="fixed bottom-0 left-0 right-0 bg-gray-900 text-white text-xs p-3 print:hidden">
  <div class="max-w-7xl mx-auto flex items-center justify-between">
    <span><strong>Screen:</strong> [Name]</span>
    <span><strong>Story:</strong> [ID or TBD]</span>
    <span><strong>Fidelity:</strong> [Lo-fi / Mid-fi / Hi-fi]</span>
    <span><strong>Date:</strong> [YYYY-MM-DD]</span>
  </div>
</div>
```

---

## Multi-Screen Presentation

When generating multiple screens in one file, use a tabbed or scrollable layout:

```html
<!-- Screen selector tabs -->
<div class="sticky top-0 bg-white border-b z-40 px-4">
  <div class="max-w-7xl mx-auto flex gap-4 overflow-x-auto py-3">
    <button onclick="showScreen('screen1')" class="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">Screen 1</button>
    <button onclick="showScreen('screen2')" class="px-3 py-1 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100">Screen 2</button>
  </div>
</div>

<!-- Screens -->
<div id="screen1" class="screen">...</div>
<div id="screen2" class="screen hidden">...</div>

<script>
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}
</script>
```
