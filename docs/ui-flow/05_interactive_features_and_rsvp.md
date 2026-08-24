# 05 - Interactive Features, RSVP & Analytics

## 1. Interactive Features Configuration (`/create/features`)

Following element styling and preview inspection, creators can configure high-level interactive capabilities for their event microsite.

```text
Interactive Features Configuration
 ├── 💌 Interactive RSVP System (Basic or Custom questionnaire)
 ├── 🎵 Spotify Background Audio / Track Integration
 ├── 🗺️ Google Maps Location Pin & Driving Directions
 ├── 📱 Canonical QR Code Generator & Download
 └── 💬 Guest Wishes / Message Wall (Optional)
```

### Feature Optionality Rule
* **All interactive features are optional.**
* If an event does not require RSVP or music, those features remain disabled and leave zero visual clutter on the final published microsite.

---

## 2. RSVP System Configuration

The RSVP feature allows creators to gather guest confirmations, headcount estimations, and meal preferences in real-time.

```text
                        RSVP Configuration
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
          Basic RSVP                      Custom RSVP
  • Attending (Yes / No)         • Headcount / Additional Guests
  • Guest Name                   • Meal Preference (Veg / Non-Veg)
  • Optional Short Wish          • Custom Questions & Dropdowns
```

### 1. Basic RSVP Mode
* Suitable for casual or straightforward gatherings.
* **Fields**: Guest Name, Phone/Email, Attending Status (`Attending` / `Regretful Decline`), Optional Blessing Note.

### 2. Custom RSVP Mode
* Ideal for weddings, banquets, and multi-day ceremonies.
* **Extended Options**:
  * Number of accompanying adults and children.
  * Dietary preferences (`Pure Vegetarian`, `Non-Vegetarian`, `Jain`, `Vegan`, `Gluten-Free`).
  * Attendance across specific sub-events (e.g. Sangeet: Yes/No, Reception: Yes/No).
  * Custom text or multiple-choice questions configured by the host.

### Guest RSVP Submissions & Host Visibility
* Guest responses are securely submitted in real-time to the host's Firestore collection.
* The host can view, search, export, and manage responses directly from their Dashboard.

---

## 3. Spotify, Google Maps & QR Integration

### Spotify Audio Integration
* Hosts can paste any valid Spotify track or playlist URL.
* Provides subtle ambient audio control with elegant autoplay hints, play/pause controls, and volume toggling.

### Google Maps Navigation
* Configured with exact venue coordinates or address search.
* Displays an interactive map snapshot on the invite with a one-tap `Open in Google Maps` directions link.

### Canonical QR Code Widget
* Generates an aesthetic, high-resolution QR code mapping directly to the invite's canonical URL.
* Supports customizable styling (embedded logo, color matching).
* Downloadable in PNG/SVG for physical print cards, welcome boards, and standees.

---

## 4. Analytics & Guest Insights

Yours Lovingly provides **transparent, privacy-respecting analytics** without intrusive tracking or unnecessary metrics bloat.

### Metrics Captured:
1. **Total Page Views**: Overall view counts across the microsite.
2. **Unique Visitors**: Estimated unique visits based on privacy-friendly anonymous session hashing.
3. **Views Over Time**: Clean daily/weekly view velocity charts.
4. **RSVP Response Tallies**: Aggregated counts of Accepted vs. Declined vs. Pending responses.

### Clutter-Free Philosophy:
* Does **not** include noisy or intrusive tracking such as GPS tracking, device telemetry logging, or invasive cookies.
* Delivers pure, actionable insights that event hosts actually care about.

---

## 5. Host Notifications & Reporting

* **Real-Time Dashboard Updates**: RSVP confirmations appear immediately in the host dashboard.
* **WhatsApp / Email Summaries**: Configurable automated notifications sent to hosts when guests RSVP or when milestones are reached (e.g., "50 guests confirmed!").
