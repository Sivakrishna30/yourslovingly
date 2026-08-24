# 02 - Template Instantiation & Snapshot Architecture

## 1. Template $\rightarrow$ Invite Instantiation Flow
Creating an Invite from a template initiates a deep configuration resolution:

```text
Template Blueprint
        ↓
Resolve Template Element Configurations
        ↓
Instantiate Page Canvases
        ↓
Create Independent Invite Snapshot
```

The resulting Invite is completely decoupled from the source Template. Subsequent edits, price updates, or retirements of the Template have **zero impact** on existing Invites.

---

## 2. Element Resolution Inside Templates
When an Invite is instantiated, parent master element defaults and template-level overrides merge into a self-sufficient snapshot:

$$\text{Master Element Defaults} + \text{Template Overrides} = \text{Resolved Configuration}$$

### Example Resolution:
- **Master Element (`floral-001`)**: `width = 320`, `height = 80`, `color = gold`
- **Template Override**: `width = 500`, `rotation = 15`
- **Invite Instance Snapshot**: `width = 500`, `height = 80`, `color = gold`, `rotation = 15`

---

## 3. Unrestricted Post-Instantiation Editability
Once the Invite snapshot is created, the user is never restricted by template defaults:
- All dimensions, coordinates, rotations, and opacities are freely adjustable.
- All font families, weights, colors, and alignments can be customized.
- Template elements can be freely deleted, replaced, or duplicated.

---

## 4. Safe Template & Element Retirement
- If a global Template or constituent Element is retired by its author:
  - It is removed from library discovery for future users.
  - **Existing Invites, Drafts, and Published Snapshots remain 100% unaffected and visually intact.**
