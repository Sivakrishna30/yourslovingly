# Design System & Element Specification

**Product:** Yours Lovingly  
**Document Status:** Confirmed / Locked  
**Scope:** Native design system, reusable elements, element instances, assets, templates, user-created elements, global library, and extensibility model.

---

## 1. Purpose

This document defines the foundation of the Yours Lovingly design system.

The goal is to allow Yours Lovingly to start with a controlled library of approximately 200 elements and expand to thousands or tens of thousands of elements without requiring the editor or application architecture to be rewritten for every new visual.

The design system must support:

- System-created elements
- User-created elements
- AI-assisted element creation
- Reusable templates
- Page-specific element instances
- Instance-level customization
- Global element publishing
- Private elements
- Search and discovery
- Asset validation and optimization
- Version-safe publishing
- Future expansion without creating a new renderer for every visual variation

A core principle is:

> **An element is a reusable design definition. A page uses an instance of that element.**

---

# 2. Core Design Philosophy

Yours Lovingly will use an **element-based design system**.

There is no mandatory section-based design model.

A page is composed of individual elements. Examples include:

- Name
- Description
- Date
- Venue
- Image
- Floral ornament
- Spotify component
- Map component
- QR component
- RSVP component
- Shapes
- Lines
- Frames
- Tables
- Charts
- Decorative artwork

Each element can be independently selected, moved, resized, rotated, duplicated, deleted, and configured according to the capabilities and properties supported by its type.

Elements do not need to belong to a traditional “section” abstraction.

---

# 3. Element Definition vs Element Instance

This is the most important architectural distinction in the design system.

## 3.1 Element Definition

An Element Definition is the reusable master definition stored in the global/private element library.

Example:
`floral-001 — Elegant Floral Divider`

The definition describes what the element is and how it should behave by default.
It does **not** contain page-specific placement.

A master Element Definition does not inherently belong to:
- A page
- A template
- A user design
- A particular event
- A particular position on a canvas

Therefore, the master definition does not contain instance-specific X/Y placement.

Conceptually:

```text
Element Definition
├── Identity
├── Type
├── Classification
├── Asset reference
├── Default configuration
├── Capabilities
├── Ownership
└── Version
```

---

## 3.2 Element Instance

When an element is placed into a template or page, an Element Instance is created.

The instance references the master element and stores the values that are specific to that usage.

Example:

```text
Element Definition:
floral-001

Instance:
instance-001

User:
user-123

Page:
page-456

Overrides:
width = 500
rotation = 15
opacity = 80
```

A second page can use the exact same master element:

```text
Element Definition:
floral-001

Instance:
instance-002

User:
user-789

Page:
page-999

Overrides:
width = 250
rotation = -10
```

The visual asset is not duplicated merely because multiple instances exist.
The instances reference the same reusable element/asset.

---

# 4. Parent–Child Inheritance Model

The relationship between an Element Definition and its Instances follows a parent–child inheritance model.

## Parent
The master Element Definition contains default values.

Example:
```text
width = 320
height = 80
opacity = 100
rotation = 0
```

## Child / Instance
The instance stores only the values it overrides.

Example:
```text
width = 500
rotation = 15
```

The final rendered values are resolved as:

$$\text{Parent Defaults} + \text{Instance Overrides} = \text{Final Instance Configuration}$$

Therefore:
```text
width     → 500   (instance override)
height    → 80    (parent default)
opacity   → 100   (parent default)
rotation  → 15    (instance override)
```

This minimizes duplicated data and keeps the model scalable.
An instance can be created for every use of an element, while the actual visual asset remains reusable.

---

# 5. Published Snapshot Rule

A published Invite must not remain dependent on future changes to the global element library.

At publication time:

```text
Element Definition
        +
Element Instance
        +
Instance Overrides
        ↓
Resolved Final Design
        ↓
Published Snapshot
```

The published Invite becomes an immutable representation of the design at that time.

Therefore:
- Future global element changes must not alter an already published Invite.
- Future template changes must not alter an already published Invite.
- Future element-library changes must not alter an already published Invite.

This guarantees visual stability for published microsites.

---

# 6. Core Element Types

The initial design system defines **12 core visual element types**.

## 6.1 Text
Used for text content such as:
- Names
- Dates
- Titles
- Quotes
- Descriptions
- Venue information

Text is one rendering primitive. Semantic roles such as `bride_name`, `groom_name`, `event_date`, and `venue` are not separate element types.

## 6.2 Image
Static raster images such as Photos, PNG artwork, WebP artwork.

## 6.3 SVG
Vector artwork and decorative designs such as Floral ornaments, Peacock designs, Traditional ornaments, Decorative borders, Dividers, Calligraphy artwork. SVG is a rendering type (category is `Floral`).

## 6.4 Shape
Basic geometric primitives generated/rendered by the engine: Rectangle, Circle, Triangle, Star, etc.

## 6.5 Line
Dividers, Straight lines, Arrows, Decorative line forms.

## 6.6 Icon
Standard reusable icons: Heart, Calendar, Location, Phone, Social icons, etc.

## 6.7 Frame
Image-containing or decorative frames (Circle, Heart, Floral, Polaroid, Traditional).

## 6.8 Table
Structured rows and columns for Event schedules, Seating info, Simple data tables.

## 6.9 Chart
Data visualization: Bar chart, Pie chart, Line chart, Donut chart.

## 6.10 GIF
Animated image assets.

## 6.11 Video
Video content.

## 6.12 Audio
Audio / music content.

---

# 7. Interactive Components

Interactive product functionality is kept conceptually separate from the core visual rendering types:

1. **Gallery**
2. **Spotify**
3. **Maps**
4. **RSVP**
5. **UPI**
6. **QR**

These are not treated as ordinary decorative assets. They are product-aware components rendered by the Yours Lovingly microsite/editor system.

---

# 8. Type vs Category vs Role

- **Type**: Defines how the engine renders the element (`Text`, `Image`, `SVG`, `Shape`, `Chart`, etc.).
- **Category**: Broad classification (`Floral`, `Traditional`, `Decorative`, `Wedding`, `Birthday`, `Business`).
- **Subcategory**: Specific classification (`Floral -> Roses, Leaves, Borders, Dividers`).
- **Role**: Semantic purpose when required (`bride_name`, `groom_name`, `event_date`, `venue`).

---

# 9. Element Asset & Formats

- **Element**: Definition of the reusable component.
- **Asset**: Actual visual/resource file (SVG, PNG, WebP, GIF) referenced by the definition.
- *Outside initial upload scope*: JPG, raw video files, Lottie.

---

# 10. Common Element Capabilities & Layering

Common operations:
- Move, Resize, Rotate, Duplicate, Delete
- Position, Width, Height, Opacity, Visibility, Z-Index / Layer ordering (Bring Forward, Send Backward, Bring to Front, Send to Back)
- Flip H/V, Shadow, Border, Border Radius, Brightness, Contrast, Saturation, Blur, Animation, Responsive overrides, Position/Size locks.

---

# 11. Type-Specific Configuration & Animation

- **Text**: Font family, size, weight, style, color, alignment, line-height, letter-spacing, transform.
- **Image**: Source, crop, fit, position, border-radius.
- **SVG**: Asset source, color/fill overrides.
- **Shape**: Shape type, fill, stroke, stroke-width, corner-radius.
- **Table / Chart**: Rows/cols, data series, labels, themes.
- **Animation**: Optional (fade, slide, zoom, duration, delay).

---

# 12. Element Creation Modes

```text
Create Element
├── Upload Asset (SVG / PNG / WebP / GIF)
├── Build with Elements (Native Element Builder composed from primitives)
└── Create with AI (Design-aware AI generation following design system rules)
```

---

# 13. Discovery, Classification & Ownership

- **Search Matrix**: Category + Subcategory + Keywords/Tags + Event Categories + Colors/Hex values.
- **Metadata Assistance**: System/AI suggests tags & categories for creator confirmation.
- **Validation**: Strict validation of format, size, SVG syntax, and security before saving.
- **Ownership & Visibility**:
  - `Private`: Only creator can use it.
  - `Global / Public`: Creator publishes -> moderation/validation -> Global Element Library with attribution (`Created by: <username>`).
- **Save as New Element**: Any customized element can be saved as an independent new element with its own ID.
- **Retire Rule**: Deprecated global elements are marked as *Retired* (cannot be selected for new pages, but existing instances and published Invites remain 100% intact).

---

# 14. Core Rules Locked by This Specification

1. Elements are the fundamental design units.
2. A traditional section abstraction is not required.
3. Element Definition and Element Instance are separate concepts.
4. Master elements contain defaults; instances contain page-specific placement and overrides.
5. Resolved configuration = Parent Defaults + Instance Overrides.
6. The same asset is reused by many instances without asset duplication.
7. Published Invites resolve into an immutable snapshot.
8. Type, category, subcategory, tags, and semantic role are distinct concepts.
9. 12 Core Visual Types + 6 Interactive Components (Gallery, Spotify, Maps, RSVP, UPI, QR).
10. Retired global elements protect existing designs from breaking.
11. Architecture scales from 200 to 20,000+ elements without rewriting the core editor engine.
