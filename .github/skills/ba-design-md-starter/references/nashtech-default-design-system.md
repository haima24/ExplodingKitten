# NashTech Default Design System (Fallback)

Use this as the **default design system** whenever no existing design system, brand guide,
live URL, or Figma file is available to capture from. All tokens below are tagged
**Proposed** (per the confidence levels in the main skill) — apply them directly without
blocking on user confirmation, then note in the output that NashTech defaults were used
because no project-specific source was found.

Source: captured from `https://www.nashtechglobal.com/` via the design-system-capture
workflow. Professional, technology-forward tone — a safe baseline for internal tools,
prototypes, and early-stage screens with no brand identity yet.

---

## Colors

| Token | Hex | Usage |
|---|---|---|
| Primary (Red) | `#D6001C` | CTA buttons, active states, brand accent, links |
| Primary hover | `#B50017` | Button hover state |
| Primary active | `#940013` | Button pressed state |
| Primary light (bg) | `#FFF0F2` | Light tint background, selected row |
| Dark Navy | `#0A002C` | Hero/dark sections, sidebar background |
| Dark Navy hover | `#140047` | Dark surface hover |
| Light Blue bg | `#EEF4FF` | Alternating section background |
| Body text | `#3F3F48` | Main body text, nav items |
| Dark text | `#272731` | Headings on light background |
| Muted text | `#57575F` | Secondary text, captions |
| Success | `#198754` | Confirmation states |
| Info | `#0DCAF0` | Informational states |
| Warning | `#FFC107` | Warning states |
| Danger | `#DC3545` | Destructive/error states |
| White / Surface | `#FFFFFF` | Cards, panels, modals, page background |
| Page background | `#F8F9FA` | App background (light gray) |
| Border | `#E0E0E5` | Card borders, dividers |
| Border (subtle) | `#E9ECEF` | Table rows, faint separators |

## Typography

**Primary font:** `Mulish, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
**Monospace fallback:** `'JetBrains Mono', 'Courier New', monospace`

| Style | Weight | Size | Usage |
|---|---|---|---|
| H1 | Bold 700 | 64px | Hero / page titles |
| H2 | Bold 700 | 36px | Section headings |
| H3 | Bold 700 | 24px | Card titles, sub-sections |
| H4 | SemiBold 600 | 20px | Minor headings |
| Body md | Regular 400 | 16px | Default body text |
| Body sm | Regular 400 | 14px | Dense UI, descriptions |
| Body xs | Regular 400 | 12px | Captions, helper text |
| Button label | Bold 700 | 16px | Button labels |

## Spacing

Base scale (4px increments): `4, 8, 12, 16, 20, 24, 32, 40, 48, 60` px.

## Corner Radii

| Element | Radius |
|---|---|
| Buttons | `2px`–`4px` |
| Cards | `8px` |
| Modals | `16px` |
| Pills/badges | `9999px` (full) |

## Shadows / Elevation

| Level | Value |
|---|---|
| Low | `0 2px 8px rgba(214, 0, 28, 0.06)` |
| Medium | `0 8px 24px rgba(214, 0, 28, 0.10)` |
| High | `0 16px 48px rgba(214, 0, 28, 0.15)` |
| Focus ring | `0 0 0 4px rgba(214, 0, 28, 0.20)` |

## Layout

- Header height: `108px` (fixed)
- Sidebar width: `260px`
- Max content width: `1280px`
- Section alternation pattern: white → light-blue tint → dark navy → white

## Ready-to-paste DESIGN.md YAML front matter

Paste this into the `DESIGN.md` YAML front matter when using NashTech defaults, then adjust
`name`/`description` for the actual product:

```yaml
colors:
  primary: "#D6001C"
  primary-foreground: "#FFFFFF"
  secondary: "#3F3F48"
  background: "#FFFFFF"
  surface: "#FFFFFF"
  surface-elevated: "#FFFFFF"
  border: "#E0E0E5"
  text: "#3F3F48"
  text-muted: "#57575F"
  success: "#198754"
  warning: "#FFC107"
  danger: "#DC3545"
typography:
  headline-lg:
    fontFamily: "Mulish"
    fontSize: "64px"
    fontWeight: 700
    lineHeight: 1.125
  headline-md:
    fontFamily: "Mulish"
    fontSize: "36px"
    fontWeight: 700
    lineHeight: 1.25
  body-md:
    fontFamily: "Mulish"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: "Mulish"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.4
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
rounded:
  sm: "2px"
  md: "8px"
  lg: "16px"
  full: "9999px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    padding: "13px 17px"
  card:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
```

## When to use this default

- No brand assets, screenshots, live site, or Figma file were provided.
- The screen/prototype is internal-only or throwaway and branding does not matter yet.
- The user explicitly asks for "a default" or "NashTech style" theme.

Do not silently apply this default when the product clearly needs its own brand (e.g. a
named client project with existing brand assets available) — in that case, capture the
real design system first (see "Capturing a design system from a live source" in `SKILL.md`).
