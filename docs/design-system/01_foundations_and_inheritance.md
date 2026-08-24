# 01 - Design System Foundations & Inheritance Model

## 1. Purpose
This document defines the foundational architecture of the Yours Lovingly design system.
- Designed to scale from 200 initial curated elements to tens of thousands of elements without requiring engine or editor rewrites.
- Supports system-created elements, user-created elements, AI-generated assets, reusable templates, page instances, and version-safe publishing.

> **Foundational Rule**: *An Element is a reusable design definition. A Page uses an instance of that element.*

---

## 2. Flat Element-Based Philosophy
Yours Lovingly operates on a pure **element-based design system**.
- **No Rigid Section Abstraction**: Elements exist directly on the page canvas.
- **Independent Manipulation**: Every element can be independently selected, moved, resized, rotated, duplicated, styled, layered, and deleted.
- **Universal Types**: Text, Images, SVGs, Shapes, Lines, Frames, Tables, Charts, and Interactive Components operate through a unified canvas model.

---

## 3. Element Definition vs. Element Instance
This is the core architectural separation of the design system.

### 3.1 Element Definition (Master)
The reusable master definition stored in the global/private library.
- Defines what the element is and its default properties (asset reference, default width/height, default colors, capabilities, tags).
- **Does not contain page-specific coordinates** (no fixed canvas $X/Y$).

```text
Element Definition
├── Identity & Version
├── Rendering Type (SVG, Text, Image, Shape, etc.)
├── Asset Reference
├── Default Dimensions & Styles
└── Supported Capabilities
```

### 3.2 Element Instance (Page Placement)
Created when an element is placed onto a page canvas.
- References the master definition.
- Stores only page-specific placement ($X, Y$) and specific user overrides (custom width, rotation, color, opacity, text content).
- Reuses visual assets across thousands of instances without asset duplication.

---

## 4. Parent–Child Inheritance Model
The relationship between master definition and instance follows lightweight property inheritance:

$$\text{Parent Defaults} + \text{Instance Overrides} = \text{Resolved Instance Configuration}$$

### Example:
- **Parent Definition (`floral-001`)**: `width = 320`, `height = 80`, `opacity = 100`, `rotation = 0`
- **Instance Overrides**: `width = 500`, `rotation = 15`
- **Resolved Configuration**: `width = 500`, `height = 80`, `opacity = 100`, `rotation = 15`

---

## 5. Published Snapshot Rule
When an Invite is published:
- The system resolves all master definitions and instance overrides into an immutable **Published Snapshot**.
- **Future-Proofing**: Subsequent edits, retirements, or removals of master elements in the global library **never alter or break already-published Invites**.
