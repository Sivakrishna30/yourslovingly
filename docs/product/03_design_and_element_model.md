# 03 - Design & Element Architecture Model

## 1. Flat Element Model (No Section Abstraction)
Yours Lovingly deliberately does **not** use a rigid `Section → Element` hierarchy. Everything editable is treated directly as an **Element**.

```text
Page
│
├── Name Element
├── Description Element
├── Date Element
├── Time Element
├── Venue Element
├── Image Element
├── Gallery Element
├── Spotify Element
├── RSVP Element
├── Map Element
└── QR Element
```

---

## 2. Element Independence & Configuration Copying
- **Complete Independence**: Each element is independently configurable. Modifying one element does not implicitly alter another element.
- **Element Properties**: Content, position, size, typography, color, visual styling, custom configuration, and visibility.
- **Copy Configuration Capability**: Creators can copy styling values (font family, font size, weight, color, alignment) from one element and apply them to another without creating a hard dependency or link between them.

---

## 3. Element Editing & Manipulation Controls
- Select, move, resize, edit, delete, duplicate, reposition, style, and configure.
- **Resizing Methods**: Numeric step controls, visual drag handles, and touch gestures where supported.
- Supports both precise metric-based manipulation and intuitive tactile adjustments.

---

## 4. Multi-Page Architecture & Navigation
Designs can be either **Single Page** (one smooth continuous view) or **Multi-Page** (`Page 1`, `Page 2`, `Page 3`, ...).
- **Page Independence**: Elements on Page 1 do not automatically alter elements on Page 2.
- **Predefined Multi-Page Transitions**: 4–5 curated, clean navigation styles:
  1. *Page Turn / Book*
  2. *Slide*
  3. *Fade*
  4. *Horizontal Swipe*
  5. *Simple Next / Previous*
- Users never have to manually build or configure complex animation timelines.

---

## 5. Preview Experience & Premium Feature Detection
- **Unrestricted Experimentation**: Users can add, style, and preview both free and premium features without paying upfront.
- **Publish-Time Gate**:
  - If premium features (Google Maps, Location QR, RSVP, UPI, etc.) are present during publication:
    - **Option 1**: Pay for the Premium Invite or use a Premium Credit.
    - **Option 2**: Click **"Remove Premium Features"** — the app automatically strips premium components, re-renders the clean preview, and allows publishing the Basic version.
