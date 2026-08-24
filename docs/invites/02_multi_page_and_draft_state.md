# 02 - Multi-Page Canvases, Autosave & Draft State

## 1. Multi-Page Architecture
An Invite can contain one or multiple distinct canvas Pages:

```text
Wedding Invite
├── Page 1: Cover & Monogram
├── Page 2: Ceremonies & Timings
├── Page 3: Couple Photo Gallery
├── Page 4: Interactive Venue & Google Maps
└── Page 5: RSVP Form & Spotify Music
```

---

## 2. Canvas Page Management
- **Add Page**: Appends a new blank canvas or duplicates an existing page.
- **Delete Page**: Removes a page (with confirmation if populated).
- **Reorder Pages**: Drag-and-drop thumbnail drawer to re-sequence page order.
- **Page Transitions**: 5 curated transition effects (Page Turn/Book, Slide, Fade, Horizontal Swipe, Next/Previous).
- **Independent Context**: Modifying Page 1 never changes the styling or layout of Page 2.

---

## 3. Autosave & Draft Recovery
- **Continuous Local & Cloud Autosave**: Changes to text, positions, and styles persist automatically.
- **Unauthenticated Drafts**: Stored in local browser storage; seamlessly merged into the user account upon Google Sign-In.
- **Draft Freedom**: Users can maintain working drafts to test layouts without paying upfront.

---

## 4. Real-Time Preview Modes
- **Device Viewports**: Instant toggle between Mobile (portrait) and Desktop (responsive) representations.
- **Interactive Component Sandbox**: Test RSVP form submission, map interaction, and music playback in a live sandbox before publishing.
