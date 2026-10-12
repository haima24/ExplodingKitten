# Figma Wireframe Guide

Reference for driving `figma-ui-mcp` to draw production-quality wireframes and UI mockups
directly on the Figma canvas.

---

## Prerequisites

### 1 — `figma-ui-mcp` must be installed and running

```powershell
# Install globally (one-time)
npm install -g figma-ui-mcp

# Or run directly via npx (no install needed)
npx figma-ui-mcp
```

**VS Code / GitHub Copilot config** — add to `.vscode/mcp.json` or `settings.json`:
```json
{
  "mcp": {
    "servers": {
      "figma-ui-mcp": {
        "command": "npx",
        "args": ["figma-ui-mcp"]
      }
    }
  }
}
```

> Restart the editor after adding the MCP server config.

If the repo already vendors the server (e.g. under a `tools/figma-ui-mcp/` folder), prefer
running it from there instead of npx, and load its plugin manifest from that same folder.

### 2 — Figma Desktop plugin must be running

1. Open **Figma Desktop** (the web app does not support localhost connections).
2. Go to **Plugins → Development → Import plugin from manifest...**
3. Select the `manifest.json` from the figma-ui-mcp plugin folder.
4. Run **Plugins → Development → Figma UI MCP Bridge**.
5. The plugin shows a green dot when connected.

### 3 — Verify connection

```
Ask the agent: "figma_status"
Expected: Connected — File: "...", Page: "...", Plugin v2.x.x
```

If not connected, stop and instruct the user to start Figma Desktop and run the plugin —
never attempt to draw blind.

---

## Step 1 — Gather Context

Before drawing, collect:

1. **Screen name / purpose** — e.g., "Login screen", "Dashboard", "Product list"
2. **Platform** — Mobile (390×844) | Tablet (768×1024) | Desktop (1440×900)
3. **Theme** — Light | Dark | Minimal white | Glassmorphism
4. **Key elements to include** — from the SRS, user stories, or client description
5. **Design system** — Does the project have an existing Figma design system? If yes, read it first with `figma_read get_variables` and `get_styles`.

Use `vscode_askQuestions` to collect these if not already provided:

```json
{
  "questions": [
    {
      "header": "Screen name",
      "question": "What screen or flow should be designed?",
      "options": [
        { "label": "Login / Authentication", "recommended": true },
        { "label": "Dashboard / Home" },
        { "label": "List / Search results" },
        { "label": "Detail / Form" },
        { "label": "Other (describe below)" }
      ]
    },
    {
      "header": "Platform",
      "question": "Target platform?",
      "options": [
        { "label": "Mobile (390×844)", "recommended": true },
        { "label": "Desktop (1440×900)" },
        { "label": "Both" }
      ]
    },
    {
      "header": "Theme",
      "question": "Visual theme?",
      "options": [
        { "label": "Light / Clean", "recommended": true },
        { "label": "Dark" },
        { "label": "Enterprise / Neutral" }
      ]
    }
  ]
}
```

---

## Step 2 — Standard Wireframe Workflow

### A. Load API reference (always first)

```
Call: figma_docs
Purpose: Load full API reference so the agent knows all available operations.
```

### B. Read existing canvas (if applicable)

```
Call: figma_read → operation: "get_page_nodes"
Purpose: Understand existing frames and avoid x/y collisions.
```

If the project has an existing design system:
```
Call: figma_read → operation: "get_variables"    // Design tokens (colors, spacing)
Call: figma_read → operation: "get_styles"       // Paint + text styles
Call: figma_read → operation: "get_local_components"  // Reusable components
```

### C. Draw the wireframe

Call `figma_write` with JavaScript code. Follow these baseline wireframe standards
(override with the project's own design system tokens whenever they exist):

#### Frame sizes
| Platform | Width | Height |
|---|---|---|
| Mobile | 390 | 844 |
| Desktop | 1440 | 900 |
| Tablet | 768 | 1024 |

#### Default colour palette (light theme)
| Usage | Hex |
|---|---|
| Page background | `#F8F9FA` |
| Card / surface | `#FFFFFF` |
| Primary action | `#0066CC` |
| Text primary | `#1A1A2E` |
| Text secondary | `#6C757D` |
| Border | `#DEE2E6` |
| Input background | `#FFFFFF` |
| Disabled / placeholder | `#ADB5BD` |

#### Default colour palette (dark theme)
| Usage | Hex |
|---|---|
| Page background | `#0F172A` |
| Card / surface | `#1E293B` |
| Primary action | `#3B82F6` |
| Text primary | `#F8FAFC` |
| Text secondary | `#94A3B8` |
| Border | `#334155` |

#### Typography defaults
| Style | Font | Size | Weight |
|---|---|---|---|
| H1 | Inter | 28 | Bold |
| H2 | Inter | 22 | SemiBold |
| H3 | Inter | 18 | SemiBold |
| Body | Inter | 14 | Regular |
| Caption | Inter | 12 | Regular |
| Button label | Inter | 14 | Medium |

#### Auto-layout defaults
- Use `layoutMode: "VERTICAL"` for page/card containers
- Use `layoutMode: "HORIZONTAL"` for nav bars, button rows
- Standard padding: `paddingTop: 16, paddingBottom: 16, paddingLeft: 16, paddingRight: 16`
- Standard item spacing: `itemSpacing: 12`

### D. Screenshot to verify

```
Call: figma_read → operation: "screenshot" → nodeId: <root frame id>
Purpose: Return inline image so the agent can verify the result.
```

---

## Step 3 — Screen Templates

Use these patterns as starting points. Adapt to the project's context and design tokens.

### Template: Mobile Login Screen

```javascript
// Root frame
const frame = await figma.create({
  type: "FRAME", name: "Login",
  x: 0, y: 0, width: 390, height: 844,
  fill: "#F8F9FA",
  layoutMode: "VERTICAL",
  paddingTop: 60, paddingBottom: 40,
  paddingLeft: 24, paddingRight: 24,
  itemSpacing: 24,
});

// Logo / App name
await figma.create({
  type: "TEXT", name: "App Name",
  parentId: frame.id,
  content: "App Name", fontSize: 28, fontWeight: "Bold",
  fill: "#1A1A2E", textAlign: "CENTER",
  width: 342,
});

// Email input
const emailInput = await figma.create({
  type: "FRAME", name: "Email Input",
  parentId: frame.id,
  width: 342, height: 52,
  fill: "#FFFFFF", cornerRadius: 8,
  stroke: "#DEE2E6", strokeWeight: 1,
  layoutMode: "HORIZONTAL",
  paddingLeft: 16, paddingRight: 16,
  primaryAxisAlignItems: "CENTER",
  counterAxisAlignItems: "CENTER",
});
await figma.create({
  type: "TEXT", name: "Email Placeholder",
  parentId: emailInput.id,
  content: "Email address", fontSize: 14,
  fill: "#ADB5BD",
});

// Password input
const pwInput = await figma.create({
  type: "FRAME", name: "Password Input",
  parentId: frame.id,
  width: 342, height: 52,
  fill: "#FFFFFF", cornerRadius: 8,
  stroke: "#DEE2E6", strokeWeight: 1,
  layoutMode: "HORIZONTAL",
  paddingLeft: 16, paddingRight: 16,
  primaryAxisAlignItems: "CENTER",
  counterAxisAlignItems: "CENTER",
});
await figma.create({
  type: "TEXT", name: "Password Placeholder",
  parentId: pwInput.id,
  content: "Password", fontSize: 14,
  fill: "#ADB5BD",
});

// Login button
const btn = await figma.create({
  type: "FRAME", name: "Login Button",
  parentId: frame.id,
  width: 342, height: 52,
  fill: "#0066CC", cornerRadius: 8,
  layoutMode: "HORIZONTAL",
  primaryAxisAlignItems: "CENTER",
  counterAxisAlignItems: "CENTER",
});
await figma.create({
  type: "TEXT", name: "Button Label",
  parentId: btn.id,
  content: "Sign In", fontSize: 14, fontWeight: "Medium",
  fill: "#FFFFFF",
});

// Forgot password link
await figma.create({
  type: "TEXT", name: "Forgot Password",
  parentId: frame.id,
  content: "Forgot password?", fontSize: 14,
  fill: "#0066CC", textAlign: "CENTER",
  width: 342,
});
```

### Template: Desktop Dashboard

```javascript
const dash = await figma.create({
  type: "FRAME", name: "Dashboard",
  x: 0, y: 0, width: 1440, height: 900,
  fill: "#F8F9FA",
});

// Sidebar
const sidebar = await figma.create({
  type: "FRAME", name: "Sidebar",
  parentId: dash.id,
  x: 0, y: 0, width: 240, height: 900,
  fill: "#1A1A2E",
  layoutMode: "VERTICAL",
  paddingTop: 24, paddingLeft: 16, paddingRight: 16, itemSpacing: 8,
});
await figma.create({
  type: "TEXT", name: "Logo",
  parentId: sidebar.id,
  content: "App Name", fontSize: 18, fontWeight: "Bold",
  fill: "#FFFFFF",
});

// Main content area
const main = await figma.create({
  type: "FRAME", name: "Main Content",
  parentId: dash.id,
  x: 240, y: 0, width: 1200, height: 900,
  fill: "#F8F9FA",
  layoutMode: "VERTICAL",
  paddingTop: 32, paddingLeft: 32, paddingRight: 32, itemSpacing: 24,
});

// Header
await figma.create({
  type: "TEXT", name: "Page Title",
  parentId: main.id,
  content: "Dashboard", fontSize: 28, fontWeight: "Bold",
  fill: "#1A1A2E",
});

// KPI cards row
const kpiRow = await figma.create({
  type: "FRAME", name: "KPI Row",
  parentId: main.id,
  width: 1136, height: 120,
  fill: "#F8F9FA",
  layoutMode: "HORIZONTAL", itemSpacing: 24,
});
for (var i = 0; i < 4; i++) {
  var card = await figma.create({
    type: "FRAME", name: "KPI Card " + (i+1),
    parentId: kpiRow.id,
    width: 260, height: 120,
    fill: "#FFFFFF", cornerRadius: 8,
    stroke: "#DEE2E6", strokeWeight: 1,
    layoutMode: "VERTICAL",
    paddingTop: 20, paddingLeft: 20, paddingRight: 20, itemSpacing: 8,
  });
  await figma.create({
    type: "TEXT", name: "KPI Label",
    parentId: card.id,
    content: "Metric " + (i+1), fontSize: 12,
    fill: "#6C757D",
  });
  await figma.create({
    type: "TEXT", name: "KPI Value",
    parentId: card.id,
    content: "1,234", fontSize: 28, fontWeight: "Bold",
    fill: "#1A1A2E",
  });
}
```

---

## Step 4 — Multi-Screen Flow

When the scope requires multiple screens (e.g., onboarding flow, checkout steps):

1. Draw each screen as a separate top-level frame, spaced `x + (width + 80)` apart.
2. Use `figma_read → get_page_nodes` before each new frame to find the next available x position.
3. Add prototype interactions with `figma.setReactions` to link screens:

```javascript
await figma.setReactions({
  id: loginButtonId,
  reactions: [{
    trigger: { type: "ON_CLICK" },
    action: { type: "NAVIGATE", destinationId: dashboardFrameId, transition: "SMART_ANIMATE" }
  }]
});
```

---

## Step 5 — Output Format

After drawing, provide the user with:

```markdown
## Figma Wireframe — {Screen Name}

**File:** {Figma file name}
**Page:** {Figma page name}
**Frames created:** {list of frame names}
**Platform:** {Mobile / Desktop / Both}

### Screenshot
{inline screenshot from figma_read}

### Next Steps
- [ ] Share Figma link with stakeholders for feedback
- [ ] Annotate with user story references (if applicable)
- [ ] Export as PNG/PDF for proposal/spec attachment (use `figma_read → export_image`)
```

---

## Step 6 — Export for Documents

To attach wireframes to a proposal, SRS, or user story:

```
Call: figma_read → operation: "export_image" → nodeId: <frame id>, format: "PNG", scale: 2
```

Confirm the save folder with the user before writing the exported image to disk.

---

## Filtering Rules

| Condition | Action |
|---|---|
| `figma_status` returns "not connected" | Stop. Instruct user to start Figma Desktop and run the plugin first. |
| No platform specified | Default to Mobile first, then offer to create a Desktop variant. |
| Existing design system found via `get_variables` | Use existing tokens — do NOT hardcode hex values. |
| No design system found | Use the default palette above. |
| User asks for "quick wireframe" | Use a simplified version — flat colours, no auto-layout, no components. |
| User asks for "full mockup" | Use auto-layout, design tokens, and icon libraries. |

---

## Anti-Patterns

- Do not hardcode hex values if design tokens are already in the Figma file — always read `get_variables` first for existing projects.
- Do not create more than 10 frames in a single `figma_write` call — use batches or multiple calls.
- Do not skip `figma_docs` before a complex draw — the agent needs the API reference to use advanced features.
- Do not take a screenshot before the `figma_write` call completes.
- Do not expose real client/company names in Figma layer names — use role-based names (e.g., "Admin Panel", not a client's actual name).

---

## MCP Server Reference

npm package: `figma-ui-mcp`
MCP tools exposed:

| Tool | Purpose |
|---|---|
| `figma_status` | Check plugin connection |
| `figma_docs` | Load full API reference |
| `figma_write` | Draw / modify nodes on canvas |
| `figma_read` | Read nodes, screenshot, export, CSS |
| `figma_rules` | Generate design system rule sheet |
