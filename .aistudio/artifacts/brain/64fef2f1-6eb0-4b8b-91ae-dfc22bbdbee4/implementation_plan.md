# Phase 1 Focus: Digital Invitations, Center Elements & Professional Typography Plan

Revised blueprint strictly focused on **Digital Invitations** for Phase 1 per user direction: removing the unneeded "Select Page Type" panel and all business card / flyer / portfolio references from the landing page hero, renaming "Motif" to **"Center Elements"** across the application, and simplifying the typography options in the editor to professional, recognizable font names.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following revisions have been confirmed based on direct user instructions:
>
> - **Remove "Select Page Type" Section**: Completely eliminate the "Select Page Type" box (Digital Business Card, Pamphlet & Flyer, Digital Portfolio) from the landing page hero section.
> - **Phase 1 Scope Ceiling**: No new templates or categories for business cards, flyers, or portfolios will be added for Phase 1. The existing curated Digital Invite templates and categories are preserved as the sole focus.
> - **Terminology Update**: Confirmed renaming the confusing label **"Motif"** to **"Center Elements"** across the editor bottom toolbar, inspector headers, and preset lists.
> - **Typography Simplification**: Confirmed replacing complex pairing descriptions (such as "Dancing Script + Garamond") with **clean, professional short font names** (`Inter`, `Playfair Display`, `Poppins`, `Cormorant`, `Outfit`, and `Cinzel`).

---

## 1. Overview & Core Concept

### What It Delivers
1. **Streamlined Digital Invitation Landing Experience (`src/components/Landing.tsx`)**:
   - Remove the confusing "Select Page Type" cards panel from the Hero section.
   - Present a focused, impactful single-purpose Hero showcasing digital invitation creation with quick CTA buttons ("Create Free Invitation", "View Samples", "Pricing").
   - Eliminate all references to business cards, flyers, and portfolios from the landing page copy and navigation to keep the message 100% focused on wedding, birthday, housewarming, and family celebrations.
2. **Intuitive "Center Elements" Labeling (`SampleCanvasEditor.tsx`, `Viewer.tsx`, `designSystem.ts`)**:
   - Replace the obscure French term "Motif" with clear, human-friendly **"Center Elements"**.
   - Bottom toolbar tab: `Center Elements` (with Sparkles icon).
   - Inspector header: `Editing Center Element`.
   - Element selection hint: `Center element selected & highlighted`.
3. **Professional Short Font Names in Canvas Inspector (`SampleCanvasEditor.tsx`)**:
   - Streamline font selection dropdown to standard, widely recognized font names:
     - `Playfair Display` (Classic Editorial Serif)
     - `Inter` (Modern Clean Sans-Serif)
     - `Poppins` (Bold Contemporary Sans)
     - `Cormorant` (Elegant Luxury Serif)
     - `Outfit` (Rounded Clean Sans)
     - `Cinzel` (Royal Heritage Serif)
   - Remove illegible/confusing script fonts like "Dancing Script" from the list.

---

## 2. User Experience & Visual Design

### A. Landing Page Hero Cleanup (`Landing.tsx`)
- **Before**: A split screen where the right column contained a box titled "Select Page Type" displaying 4 cards (Digital Invite, Business Card, Pamphlet, Portfolio) that diverted focus.
- **After**: A centered, commanding hero presentation:
  - Strong value headline: *"Create Stunning Digital Invitations with Real Traditional Elegance"*.
  - Value bullet strip: *Ad-Free · Free 15-Day Hosting · WhatsApp Sharing · Instant RSVP & Google Maps*.
  - Clean action row with primary button *"Create Free Invitation"*, secondary *"View Samples"*, and *"Pricing"*.
  - Directly leads into the interactive invitation samples gallery without clutter.

### B. Sample Canvas Editor Center Elements (`SampleCanvasEditor.tsx`)
- Floating toolbar tab label updated from `Motifs` to `Center Elements`.
- Contextual inspector header updated to display:
  - Icon + **"Editing Center Element"**
  - Description: *"Choose a traditional or celebratory center element for your invitation."*
  - Dedicated **Reset**, **Collapse/Expand**, and **Close (X)** buttons preserved in the fixed top header.
  - Scrollable grid of center elements: Auspicious Kalash, Grand Rangoli, Royal Twin Peacock, Sacred Lotus, Brass Diya, Ganesha Line Art, Temple Bells, Botanical Rose Wreath, Intertwined Rings, and Doves.

### C. Typography Styling in Inspector
- Font style selector updated to display single-line, clean professional font names:
  ```html
  <option value="Playfair Display">Playfair Display (Serif)</option>
  <option value="Inter">Inter (Clean Sans)</option>
  <option value="Poppins">Poppins (Modern Bold)</option>
  <option value="Cormorant Garamond">Cormorant (Elegant Serif)</option>
  <option value="Outfit">Outfit (Clean Sans)</option>
  <option value="Cinzel">Cinzel (Royal Serif)</option>
  ```
- Ensures fonts look crisp and legible on both mobile devices and desktop screens.

---

## 3. Key Product Decisions & Trade-Offs

| Decision | Chosen Approach | Rationale |
|---|---|---|
| **Landing Hero Layout** | Remove "Select Page Type" block entirely; center the hero content and CTAs | Eliminates user confusion since the platform is currently optimized for digital invitations. Keeps the initial customer journey clear and distraction-free. |
| **Phase 1 Product Scope** | Exclusively focus on Digital Invitations | Eliminates premature feature creep. Existing invitation templates, themes, RSVP, music player, and UPI gifts work reliably and serve the core use case. |
| **Terminology** | "Center Elements" instead of "Motifs" | Users find "Motif" confusing and unfamiliar. "Center Elements" is universally understood. |
| **Font Selection** | 6 Curated Professional Fonts | Prevents hard-to-read cursive fonts and gives users clean, modern typographic control. |

---

## 4. Technical Architecture & Modifications

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Yours Lovingly (Phase 1)                        │
└────────────────────────────────────────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼───────────────────────────┐
       ▼                            ▼                           ▼
┌──────────────────┐      ┌──────────────────┐       ┌──────────────────┐
│   Landing Hero   │      │ Samples Showcase │       │  Canvas Editor   │
│ (src/components/ │      │ (src/components/ │       │(SampleCanvasEd.) │
│   Landing.tsx)   │      │SamplesShowcase.  │       │                  │
└────────┬─────────┘      └────────┬─────────┘       └────────┬─────────┘
         │                         │                          │
         ▼                         ▼                          ▼
 [Remove Select Page]     [Keep existing 100%        ["Motif" ──► "Center
 [Type box completely]    [invite samples: wedding,  [Elements" toolbar &
 [Center-aligned Hero]    [birthday, housewarming,   [inspector, simplified
                          [baby shower, etc.]        [professional fonts]
```

---

## 5. Execution Steps

1. **Step 1: Landing Page Hero Cleanup (`src/components/Landing.tsx`)**:
   - Remove the `Select Page Type` container and its 4 category buttons (lines ~215-262).
   - Adjust the hero layout container to a centered, balanced layout (`max-w-4xl mx-auto text-center`).
   - Clean up any unused imports or variables in `Landing.tsx`.
2. **Step 2: Terminology Rename (`SampleCanvasEditor.tsx`, `types.ts`, `designSystem.ts`)**:
   - Update toolbar button label from `Motifs` to `Center Elements`.
   - Update inspector header from `Editing Center Decorative Motif` to `Editing Center Element`.
   - Update inspector helper text and tooltips.
3. **Step 3: Font Selection Simplification (`SampleCanvasEditor.tsx`, `index.html`)**:
   - Add `Poppins` and `Inter` Google Font links in `index.html` alongside `Playfair Display`, `Outfit`, and `Fraunces`.
   - Update the font selector in `SampleCanvasEditor.tsx` to list the 6 professional fonts with clean labels.
4. **Step 4: Verification & QA**:
   - Run `compile_applet` and `lint_applet` to verify zero build or type errors.
   - Update `CHANGELOG.md` with QA records.
