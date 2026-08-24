# 05 - Template Hierarchy & Locked Architectural Principles

## 1. Structural Schema Hierarchy

```text
TEMPLATE
│
├── Identity
│   ├── Template ID
│   ├── Name & Description
│   └── Version Tag (e.g. V1.0)
│
├── Classification
│   ├── Category (e.g. Wedding)
│   ├── Subcategory / Style Tags
│   ├── Color Palette
│   └── Tier (Basic / Premium)
│
├── Ownership & Visibility
│   ├── Created By (User ID / System)
│   ├── Visibility (Private / Global)
│   └── Lifecycle Status (Active / Retired)
│
├── Background Configuration
│   └── SVG Pattern, Color Fills & Opacity
│
├── Page Canvases (1..N)
│   ├── Page 1: Element Instance Configurations & Coordinates
│   ├── Page 2: Element Instance Configurations & Coordinates
│   └── Page N: ...
│
├── Data Placeholders & Input Bindings
└── Responsive Preview Metadata
```

---

## 2. Core Template Lifecycle Flow

```text
Template Library
       │
       ├── System Templates
       └── User Templates
               ↓
        Select & Preview
               ↓
       Fill Event Details
               ↓
    Instantiate Invite Snapshot
               ↓
        Canvas Customization
               ↓
         Live Preview
               ↓
            Publish
```

---

## 3. Locked Template Principles
1. **Templates Are Composed of Primitives**: Built entirely from standard Elements; no monolithic wrapper components.
2. **Every Element Is Independently Editable**: Users retain complete control over all properties.
3. **Decoupled Snapshots**: Instantiating a template creates an immutable Invite snapshot. Future template revisions never alter created Invites.
4. **Safe Retirement**: Retiring a template hides it from future discovery while keeping existing Invites 100% stable.
5. **No Section Restraints**: Layout is free-form and canvas-based.
6. **Multi-Page Support**: Full reordering, deletion, and addition of pages without rigid limits.
