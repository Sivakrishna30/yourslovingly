# 02 - Creation Journey, Templates & Content Details

## 1. Creation Entry Point & Event Type Selection

The creation journey begins when the user clicks `Start Creating Free` on the Landing Page or `+ New Invite` from the Dashboard.

### Step 1: Event Type (`/create/event-type`)
The first meaningful design decision is selecting the **Event Type**.

```text
                  User Enters /create/event-type
                                │
   ┌──────────────┬─────────────┼─────────────┬──────────────┐
   ▼              ▼             ▼             ▼              ▼
Wedding       Birthday    Housewarming   Anniversary     Baby Shower / Other
```

#### Selection Mechanics:
* Supported categories include **Wedding, Birthday, Housewarming, Anniversary, Engagement, Baby Shower / Naming Ceremony, Festive / Pooja, Business / Launch, and Custom Events**.
* Event Type selection primes the design engine to filter and recommend tailored templates and pre-configure standard content placeholders.
* **Strict Rule**: Event Type is chosen **first**. Templates are filtered according to that selection. The system must **never** ask the user to re-select an event type after a template is chosen.

---

## 2. Template / Blank Selection (`/create/template`)

After selecting an Event Type, the user chooses their starting point:

```text
               Event Type Selected (e.g. Wedding)
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
       Choose a Template                 Start Blank
  (Filtered by Event Type)          (Clean empty canvas)
```

### 1. Use Template
* Displays curated, aesthetic template compositions specifically tailored for the chosen event type.
* Each card provides a rich visual thumbnail and live design preview.
* Clicking a template instantiates an initial layout snapshot.

### 2. Start Blank
* Initializes an empty, unconstrained single-page canvas with a clean default background.
* Allows creators and designers to compose bespoke invites from scratch using the Element library.

---

## 3. Template Preview & Snapshot Isolation

### Live Interactive Preview Before Selection
* Users can view a full-sized interactive preview of any template before confirming.
* Previews render with sensible, elegant typography and sample content matching the theme.

### Snapshot Independence Rule
* Once a template is selected:
  * The template definition is cloned into an **independent, user-owned Invite snapshot**.
  * The Invite has **zero runtime dependency** on the original template definition.
  * If the underlying global template is modified, updated, or retired in the future, the user's working invite remains completely unaffected.

---

## 4. Invite Details Configuration (`/create/details`)

The Invite Details stage allows users to enter structured event information that automatically synchronizes with placeholder elements across the canvas.

### Generic Content Fields
To avoid brittle or culturally rigid assumptions (such as hard-coding "Bride Name" / "Groom Name" as unalterable core engine schemas), the system utilizes **extensible, generic content fields**:
* `Title` (e.g., "The Wedding of Priya & Rahul", "Aarav turns 5!", "Housewarming Ceremony")
* `Event Subtitle` (e.g., "Together with their families", "Join us in celebrating")
* `Date` (e.g., "December 24, 2026")
* `Time` (e.g., "6:30 PM onwards")
* `Venue Name & Address` (e.g., "Grand Palace Hall, MG Road, Bengaluru")
* `Host / Family Note` (e.g., "With best compliments from the Sharma family")
* `Additional Content / Message` (e.g., Dress code, itinerary notes, custom blessings)

### Template-Defined Expected Details
* Templates declare standard expected fields relevant to their composition.
* When a wedding template is loaded, its configured fields appear cleanly in the Invite Details form.
* When a housewarming or birthday template is loaded, appropriate fields are exposed.

### Creator Flexibility:
* Users can freely:
  * Fill standard fields.
  * Leave optional fields empty (empty placeholders gracefully hide or collapse).
  * Add custom text blocks and supplementary fields.
  * Modify label mappings at any time.

---

## 5. Live Default Values & Real-Time Reflection

* Templates come pre-populated with realistic sample values.
* As the user enters their actual details (e.g. typing `Date: 24 December`, `Venue: Chennai`), the canvas preview **immediately and synchronously updates** to reflect those actual values in place of dummy data.

```text
User Types in Form ──────► Instant Canvas Hydration ──────► Live Preview Shows Actual Data
(Venue: "Chennai")                                          (No dummy "Sample City" text)
```

---

## 6. Date, Time & Countdown Representations

Date and time values support flexible display formats across canvas elements:

1. **Standard Formatted Date**: `"24 December 2026"` / `"Saturday, Dec 24, 2026"`
2. **Compact Numeric Date**: `"24.12.2026"` / `"12/24/2026"`
3. **Dynamic Live Countdown**:
   * Elements can be styled as active timers: `"90 Days Remaining"` / `"14 Hours to Go"`.
   * Automatically ticks down in real-time based on the event timestamp.

---

## 7. Images & Media Elements

Images can be added and customized freely across any page of the Invite:
* **Addition**: Upload from local device (drag-and-drop or file picker) or select from curated stock assets.
* **Transformations**: Reposition, resize, rotate, crop, adjust corner radius, and apply shadow/border styles.
* **Replacement**: Replace an existing placeholder image without losing coordinate positions or layer ordering.
* **Storage Optimization**: Automatically compressed and served via CDN according to product asset limits.
