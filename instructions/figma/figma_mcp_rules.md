## **Figma MCP Rules**

### **General Principles**

- Read and follow these rules carefully — no skipping steps.
- Do not rely on past work or memory; always follow the current instructions.
- Ask before making assumptions or introducing changes not in the design.
- Avoid breaking changes unless explicitly approved.
- Follow the current app structure and conventions when generating new code.

### **Assets**

- Download all visual assets (images, SVGs, icons, illustrations) directly from Figma.
- Store assets in the correct `assets/` or `public/` directory; ensure paths are correct to prevent broken images.
- Do not use placeholders or mock images.
- Ensure images are fully visible within their specified width and height.
- Prefer **inline SVG** for icons when available.
- Confirm all assets are saved locally or properly referenced.

### **Design Accuracy**

- Match all colors, typography, spacing, padding, and dimensions exactly as in Figma.
- Maintain pixel-perfect layouts and responsiveness per the design.
- Align all elements (left, right, top, bottom) exactly as in Figma.
- Follow Figma’s Auto Layout settings when implementing designs (if present).

### **Development Practices**

- Use the project’s existing CSS for styling whenever available.
- Obtain approval before introducing a new community UI library.
- Ensure existing components match the Figma design, and update them if they deviate.
- Place all new UI components in src/components/.