---
version: alpha
name: "<Product or Design System Name>"
description: "<One-sentence design intent>"
colors:
  primary: "#2563EB"
  primary-foreground: "#FFFFFF"
  secondary: "#0F172A"
  background: "#FFFFFF"
  surface: "#F8FAFC"
  surface-elevated: "#FFFFFF"
  border: "#CBD5E1"
  text: "#0F172A"
  text-muted: "#64748B"
  success: "#166534"
  warning: "#92400E"
  danger: "#B91C1C"
typography:
  headline-lg:
    fontFamily: "Inter"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0px"
  headline-md:
    fontFamily: "Inter"
    fontSize: "24px"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "0px"
  body-md:
    fontFamily: "Inter"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0px"
  label-md:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  full: "9999px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  card:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
  chip-muted:
    backgroundColor: "{colors.border}"
    textColor: "{colors.text}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  caption-muted:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text-muted}"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    padding: "0px"
  alert-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  alert-warning:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  alert-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
---

# <Product or Design System Name> DESIGN.md

## Overview

Describe the product personality, audience, density, and emotional tone. State what the UI should feel like and what it must avoid.

Confidence:
- Observed:
- Provided:
- Inferred:
- Proposed:

## Colors

Explain how each color role is used. Reserve `primary` for the main action or strongest brand signal. Use `danger`, `warning`, and `success` only for semantic states.

## Typography

Use the typography tokens above for headings, body text, labels, and dense data. Do not scale font size directly with viewport width.

## Layout

Define the spacing rhythm, grid behavior, page width, section density, and alignment rules.

## Elevation & Depth

Define shadow, border, and surface hierarchy. Keep elevation consistent and avoid decorative depth that does not communicate interaction or grouping.

## Shapes

Define radius rules for cards, inputs, buttons, modals, and chips. Avoid mixing very sharp and very rounded components unless a clear hierarchy requires it.

## Components

Buttons:
- Primary:
- Secondary:
- Destructive:
- Disabled:

Inputs:
- Text fields:
- Select/dropdown:
- Checkbox/radio/toggle:
- Error/helper text:

Cards and panels:
- Usage:
- Padding:
- Header/content/action areas:

Tables and lists:
- Header:
- Row:
- Empty state:
- Sorting/filtering:

Dialogs and alerts:
- Confirmation:
- Error:
- Toast/notification:

Charts and dashboards:
- KPI cards:
- Trend charts:
- Category comparisons:
- Data labels/tooltips:

## Responsive Behavior

Define breakpoints, navigation collapse, grid collapse, touch targets, table behavior, and chart behavior on mobile.

## Accessibility

Maintain readable contrast, visible focus states, keyboard navigation, meaningful labels, non-color-only status cues, and sufficient touch target size.

## Do's and Don'ts

Do:
- Use the primary color intentionally for the main action.
- Keep spacing consistent with the token scale.
- Prefer clear component states over decorative variation.

Don't:
- Introduce unapproved colors, shadows, or font sizes.
- Use more than two font families.
- Hide validation or error behavior from the design.

## Agent Prompt Guide

When generating UI from this file:
- Follow the token values exactly unless the user approves a change.
- Use the component rules before inventing new styles.
- Check responsive behavior and accessibility before finalizing.
- If a needed rule is missing, add an assumption and ask for validation.

## Open Questions

| Question | Why it matters | Owner |
| --- | --- | --- |
