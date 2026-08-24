# 01 - Invite System Foundations & Creation

## 1. Purpose & Scope
This document defines the core architecture of the **Invite System** in Yours Lovingly.
- An Invite is the complete, user-owned invitation product or microsite.
- An Invite contains one or more editable canvas Pages.
- Provides complete freedom of design, layout, typography, and interactive components.

---

## 2. Core Design Philosophy
- **Element-Based Composition**: Invites are composed directly of discrete, movable Elements.
- **No Mandatory Section Boundaries**: Free-form positioning across the entire page canvas.
- **Universal Editability**: Every element can be selected, moved, resized, rotated, styled, layered, or deleted.

---

## 3. User Experience & Creation Journey

```text
Select Invite Type (Wedding, Birthday, Business, Portfolio, etc.)
                   ↓
Choose Template (or start Blank Canvas)
                   ↓
Fill Event Details (Auto-populates placeholders)
                   ↓
Canvas Customization (Style, Add Elements, Reorder Pages)
                   ↓
Interactive Live Preview
                   ↓
Publish Microsite
```

---

## 4. Invite Definition & Account Ownership
- An Invite belongs to a single user account.
- Stored as a private, editable Draft until published.
- Users can create multiple Invites for different events (e.g. Wedding Invite, Sangeet Invite, Reception Invite).

---

## 5. Creation Sources
1. **From System Template**: Instantiates a curated blueprint with pre-arranged typography and ornamentations.
2. **From Community/User Template**: Clones a shared public template into a private Invite.
3. **From Scratch**: Begins with an empty canvas ready for custom element placement.
4. **Copy from Existing Invite**: Clones an existing Invite into a brand-new, independent Invite ID.

---

## 6. Template Independence & Snapshot Architecture
- Creating an Invite from a template creates an **independent snapshot**.
- The Invite does **not** maintain a live link to the template.
- If the original template is later updated, redesigned, or retired, **the user's Invite remains 100% stable and intact**.

---

## 7. Universal Canvas Manipulation Controls
- **Precision Controls**: Numeric inputs for coordinate placement ($X, Y$), width, height, and rotation.
- **Tactile Drag Controls**: On-canvas selection bounding boxes, drag handles, and touch-friendly gestures.
- **Z-Index Layering**: Move forward, backward, front, back.
- **Style Inspector**: Typography tokens, color palettes, opacity sliders, shadows, borders, and animations.
