# 03 - Elements, Canvas Composition & Multi-Page Architecture

## 1. Unified Element-Based Philosophy

In Yours Lovingly, **everything that can be placed, styled, or edited on a canvas is an Element**.

There is no rigid, unalterable "section container" abstraction that restricts element placement. The complete Invite composition is a pure hierarchical tree of user-owned element instances:

```text
Invite
 ├── Page 1 (Cover)
 │    ├── Element: Background Color / Gradient
 │    ├── Element: Border Ornament (SVG)
 │    ├── Element: Heading Text (Title)
 │    ├── Element: Couple / Host Photo (Image)
 │    └── Element: Decorative Floral Corner (SVG)
 ├── Page 2 (Schedule & Venue)
 │    ├── Element: Itinerary Timeline (Text + Icons)
 │    ├── Element: Google Maps Interactive Widget
 │    └── Element: Spotify Soundtrack Player
 └── Page 3 (RSVP & Wishes)
      ├── Element: RSVP Interactive Form
      └── Element: QR Code Link Widget
```

---

## 2. Element Discovery & Addition Panel (`/create/elements`)

Users can open an intuitive, drawer-style Element Panel (similar to professional graphic design suites) to explore and insert new elements at any point during creation.

```text
Elements Library Panel
 ├── 🔤 Text (Headings, Subheadings, Body, Itinerary, Quotes)
 ├── 🖼️ Image (Personal Uploads, Gallery Grids, Framed Portraits)
 ├── 📐 Shapes & Lines (Geometric cards, dividers, badges, pill tags)
 ├── 🎨 SVG & Decorative Artwork (Florals, Mandalas, Motifs, Gold Foils)
 ├── 🖼️ Borders & Frames (Traditional, Modern, Minimalist framing)
 ├── 🎨 Backgrounds (Solid themes, parchment textures, soft gradients)
 ├── ⚡ Interactive Components (Spotify, Google Maps, RSVP, QR Code)
 └── 🪅 Other Festive / Event Ornaments
```

### Unrestricted Creative Palette Rule
* There is **no artificial limitation** stating *"Only elements from the chosen template may be used."*
* Users can add new elements, combine assets from different themes, delete existing template elements, or introduce interactive components whenever desired.

---

## 3. Universal Element Editing & Transformations

Every Element exposes a standardized, direct-manipulation property panel:

### Common Operations
* **Position ($X, Y$)**: Move freely anywhere on the canvas via drag-and-drop or coordinate inputs.
* **Dimensions (Width, Height)**: Resize smoothly with bounding box handles or proportional locking.
* **Rotation**: Rotate to any degree ($0^\circ - 360^\circ$).
* **Z-Index Layering**: Bring to Front, Send to Back, Move Forward, Move Backward.
* **Visibility**: Toggle element display on/off without permanently deleting.
* **Duplicate**: Clone with identical styling and relative offset.
* **Replace**: Swap asset or type while retaining positional geometry.
* **Delete**: Remove from the page with single-click action (and undo support).

### Element-Specific Styling Properties
* **Text**: Font family, font weight, size, line-height, letter spacing, alignment, color, text transform.
* **Images**: Aspect ratio, object-fit, corner radius, border, drop shadow, opacity.
* **SVGs / Artwork**: Primary and secondary tint colors, fill, stroke width, opacity.
* **Backgrounds**: Color palette, background gradient angles, image overlay opacity.

---

## 4. Interactive Components as Native Canvas Elements

Interactive capabilities (such as Spotify Audio, Google Maps, RSVP Forms, and QR codes) are treated **exactly like standard visual elements on the canvas**.

```text
Interactive Feature Concept
            ↓
  Placed on Canvas Page
            ↓
 Treated as a Native Element (Movable, Resizable, Layerable)
```

### Critical Sizing & Placement Principles
* **No Hardcoded Positions**: Spotify players, RSVP buttons, or Google Maps cards do **not** have fixed positions locked to the bottom or top of a page.
* **No Artificial Fixed Sizes**: Creators can resize an interactive component (e.g. compact mini Spotify pill vs. full-width album card; compact map snapshot vs. prominent navigation card).
* **Full Layering Control**: Interactive elements can be layered over background artwork or placed inside decorative frames.

---

## 5. Multi-Page Invite Model

An Invite can consist of a single impactful card or a multi-page interactive microsite.

### Strict Terminology Distinction
* **Invite**: The top-level user-owned design object, published URL entity, and billing unit.
* **Page**: An individual canvas surface contained within an Invite.

```text
Invite (e.g., "Priya & Rahul Wedding")
 ├── Page 1: Formal Invitation & Names
 ├── Page 2: Auspicious Dates & Function Schedule
 ├── Page 3: Venue Directions & Interactive Google Maps
 ├── Page 4: Photo Gallery & Love Story
 └── Page 5: Interactive RSVP & Guest Information
```

### Multi-Page Canvas Management
* **Add Page**: Appends a new blank page or duplicate of an existing page.
* **Reorder Pages**: Drag-and-drop page thumbnail sorter allows re-arranging the reading sequence.
* **Duplicate Page**: Creates an exact clone of a page and all its child elements.
* **Delete Page**: Removes a page (with confirmation if child elements exist).
* **Page Navigation**: The guest viewing experience supports vertical continuous scrolling or horizontal paginated swipe cards.

---

## 6. Zero Creative Locking & Creator Protection

Yours Lovingly maintains a strict design contract: **Zero artificial creative locking**.

### What Is Strictly Prohibited:
* Locking element positions to rigid grid slots unless the user opts into snapping.
* Enforcing arbitrary minimum or maximum aspect ratios on interactive widgets.
* Restricting font choices or color combinations based on arbitrary rules.

### How Creator Work Is Protected:
* Continuous **Autosave** (persisted locally and synced to cloud).
* **Snapshots & Version History** created at critical milestones (e.g., before publishing).
* **Confirmation Dialogs** for destructive actions (e.g. deleting an entire page).
* **Trash & Soft-Recovery** buffers ensuring accidentally deleted invites can be restored within 30 days.
