# 01 - Template System Foundations & Creation

## 1. Purpose
A **Template** is a predefined, reusable design blueprint constructed entirely from reusable Elements.
- Provides an immediate, professional visual starting point so users never face a blank canvas.
- Encapsulates visual hierarchy, typography pairings, color harmonies, ornament placements, and interactive placeholders.
- The user creates an Invite from a template and retains 100% customization freedom.

---

## 2. Element Composition (No Giant Blackbox Objects)
Templates use the standard Element System. There is no separate rendering pipeline or monolithic layout object:

```text
Wedding Template
├── Bride Name       → Text Element
├── Groom Name       → Text Element
├── Wedding Date     → Text Element
├── Couple Photo     → Image Element
├── Floral Ornament  → SVG Element
├── Decorative Frame → Frame Element
└── Venue Map        → Interactive Component
```

Every single element in a template remains independently selectable, movable, and editable.

---

## 3. Template vs. Invite Distinction
- **Template**: The reusable blueprint in the library.
- **Invite**: The user's actual design instance created from that template.
- An Invite belongs to a specific user account.
- Editing an Invite never alters the source Template.

---

## 4. Creation Paths
- **From Template**: Select template $\rightarrow$ enter event details $\rightarrow$ preview $\rightarrow$ customize on canvas $\rightarrow$ publish.
- **From Scratch**: Blank canvas $\rightarrow$ add elements $\rightarrow$ position & style $\rightarrow$ preview $\rightarrow$ publish.
- **Copy from Existing**: Duplicate an existing Template or Invite into an independent new blueprint/draft.

---

## 5. Template Library Organization
- Structured by **Event Type**: Wedding, Engagement, Birthday, Anniversary, Baby Shower, Housewarming, Festival, Business, General.
- **Target Capacity**: Initial launch library of ~50 curated System Templates (4–5 high-quality designs per primary category).

---

## 6. Template Visibility, Ownership & Versioning
- **System Templates**: Managed by Yours Lovingly, immutable by regular users.
- **User Templates**: Created by community creators; can be **Private** (creator only) or **Global/Public** (attributed to creator).
- **Versioning**: Human-readable identification metadata (e.g. `V1`, `V1.1`, `V2.0`) for tracking revisions without runtime branching complexity.
