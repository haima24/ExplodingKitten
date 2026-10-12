# ASCII Wireframe Rules & Component Patterns

## Allowed Characters

| Purpose | Characters |
|---------|------------|
| Borders | `+`, `-`, `|` |
| Arrows | `->`, `<-`, `^`, `v` |
| Checkboxes | `[x]`, `[ ]` |
| Radio buttons | `(*)`, `( )` |
| Text placeholder | `[Field Name........]`, `[__________________]` |
| Button | `[ Button Label ]` |
| Dropdown | `[Select option v]` |
| Progress active | `[=====>          ]` |
| Progress inactive | `[                ]` |
| Icons (text only) | `[i]`, `[!]`, `[?]`, `[x]` (info, warn, help, close) |

## Forbidden Characters

- **No Unicode characters** — no box-drawing chars (┌ ─ ┐ │ └ ┘), arrows (→ ←), bullets (• ·), or any non-ASCII code point.
- No emojis or symbols outside ASCII 32–126.

---

## Layout Rules

1. Every line inside a wireframe block must be the same character length.
2. Pad shorter lines with spaces to reach the longest line's length.
3. Wrap all wireframes in a fenced code block (` ``` `).
4. Desktop width: 80 characters max (adjustable, but state the width used).
5. Mobile width: 40 characters max.
6. Use `----` as a horizontal divider between sections.
7. Use `|` as a vertical divider.
8. Identify each element by a label above or to the right, aligned.

---

## Common Component Patterns

```
Text label:        Field Label:
Button:            [ Click Me         ]
Text input:        [__________________]
Dropdown:          [Select an option v]
Checkbox:          [x] Option A   [ ] Option B
Radio:             (*) Option A   ( ) Option B
Progress bar:      [=======>          ] Step 2 of 4
Table header:      | Col A    | Col B    | Col C    |
Table row:         | Value 1  | Value 2  | Value 3  |
Modal:             +---- Modal Title ----+
                   |  [Content area]     |
                   | [Cancel] [Confirm]  |
                   +---------------------+
Error message:     [!] This field is required.
Info message:      [i] Your session will expire in 5 minutes.
```

---

## Output Structure Templates

### Desktop Wireframe

````
Screen: [Screen Name] — Desktop View (80-char wide)

+------------------------------------------------------------------------------+
| [Header / Navigation Bar]                              [Logo] [Username v]   |
+---------------------------+----------------------------------------------------+
| [Left Sidebar]            | [Main Content Area]                               |
| - Nav Item 1              |   [Section Title]                                  |
| - Nav Item 2              |   [Content...]                                     |
|                           |                                                    |
+---------------------------+----------------------------------------------------+
| [Footer]                                                                       |
+------------------------------------------------------------------------------+
````

### Mobile Wireframe

````
Screen: [Screen Name] — Mobile View (40-char wide)

+--------------------------------------+
| [Back <-]    [Page Title]   [Menu =] |
+--------------------------------------+
| [Content Section]                    |
|   [Field Label]                      |
|   [__________________________]       |
|                                      |
|   [ Primary CTA Button      ]        |
+--------------------------------------+
| [Bottom Nav Icons]                   |
+--------------------------------------+
````

---

## Multi-Screen Annotation

When producing multiple screens in one response:
1. Label each screen clearly: `=== Screen: [Name] ===`
2. Produce **Desktop** view first, then **Mobile** view for each screen.
3. Add a brief **Navigation note** below each screen:
   - "Entry point: [how user arrives]"
   - "Exit points: [actions and destinations]"
