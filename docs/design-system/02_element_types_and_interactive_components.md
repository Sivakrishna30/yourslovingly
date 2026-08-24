# 02 - Core Element Types & Interactive Components

## 1. Core Visual Element Types (12 Types)

The design engine natively supports 12 fundamental visual rendering primitives:

1. **Text**: Names, titles, dates, descriptions, venue information, quotes. (Semantic roles like `bride_name` are data bindings, not separate types).
2. **Image**: Raster photos, PNG artwork, WebP illustrations.
3. **SVG**: Vector graphics, floral ornaments, peacock motifs, traditional borders, calligraphy, dividers.
4. **Shape**: Geometric primitives rendered by the canvas engine (Rectangles, Circles, Triangles, Stars).
5. **Line**: Straight lines, dividers, arrows, dashed decorative borders.
6. **Icon**: Standard vector icons (Hearts, Calendar, Location Pin, Phone, Social Media).
7. **Frame**: Image-clipping and decorative borders (Circle, Polaroid, Floral, Arch, Traditional).
8. **Table**: Structured tabular data for itineraries, event schedules, seating arrangements.
9. **Chart**: Visual data representations (Bar charts, Donut charts, Pie charts, Line graphs).
10. **GIF**: Lightweight animated visual loops.
11. **Video**: Video media embeds.
12. **Audio**: Background music, voice notes, audio playback.

---

## 2. Interactive Product Components (6 Components)

Interactive product functionality operates as specialized canvas components with live behavior:

1. **Photo Gallery**: Multi-image interactive carousel and grid with lightbox.
2. **Spotify Player**: Single-song seamless background music / embedded audio player.
3. **Google Maps**: Interactive map with venue pin and automated directions link.
4. **Interactive RSVP**: Configurable guest response form with real-time dashboard tracking.
5. **UPI Scanner / QR**: Custom UPI payment QR generating direct merchant/personal transfers.
6. **Location / URL QR**: High-resolution scannable QR code for physical card printing.

---

## 3. Type vs. Category vs. Role Architecture

To maintain clarity and rapid searchability:
- **Type**: How the rendering engine draws the element (`Text`, `Image`, `SVG`, `Shape`, etc.).
- **Category**: Broad classification for discovery (`Floral`, `Traditional`, `Modern`, `Minimal`, `Festive`).
- **Subcategory**: Specific grouping (`Floral → Roses, Leaves, Corners, Dividers`).
- **Semantic Role**: Optional data placeholder (`bride_name`, `groom_name`, `event_date`, `venue`).

---

## 4. Asset Formats & Supported Scope
- **Direct Canvas Formats**: SVG (preferred for vectors/artwork), PNG, WebP, GIF.
- **Optimization**: SVGs are sanitized and optimized; raster assets are validated for responsive resolution and compression.
