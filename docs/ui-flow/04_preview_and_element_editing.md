# 04 - Preview Experience & Element-by-Element Editing

## 1. Preview / Element Editing Stage (`/create/preview`)

The Preview experience brings together the entire Invite composition into a high-fidelity, interactive preview rendering exactly as guests will experience it on mobile and desktop devices.

```text
                        /create/preview
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
       Direct Manual Editing          Guided Step-by-Step
      (Click any element on           (Sequential element review
       the live canvas directly)       via Prev / Next controls)
```

---

## 2. Element-by-Element Sequential Review (Optional Assistant)

To help users review and fine-tune every detail of their Invite without missing any placeholder or ornament, the preview interface provides a **Guided Element Stepper**.

```text
┌─────────────────────────────────────────────────────────────┐
│ Element 3 of 10: Event Title [Priya & Rahul]               │
│ [ < Previous Element ]               [ Next Element > ]     │
└─────────────────────────────────────────────────────────────┘
```

### Sequential Element Workflow
1. **Numbered Progress Indicator**: Shows current focus index (e.g., `1/10 Background`, `2/10 Floral Frame`, `3/10 Title`, `4/10 Date`, `5/10 Venue`, `6/10 Spotify Player`, `7/10 RSVP`).
2. **`Previous` / `Next` Navigation**: Shifts active selection and focus cleanly across each element in logical layering order.
3. **Inspector Synchronization**: The side inspector immediately displays the exact property controls for the currently focused element.

### Strict Optionality Rule
* **This is NOT a mandatory wizard.**
* Users are never forced to step through all elements sequentially.
* The user can:
  * **Click directly on the canvas** to select and edit any element instantly.
  * **Use Next / Previous** to review sequentially when desired.
  * **Confirm or skip without changes** to jump straight to interactive features or publishing.

---

## 3. Preview Canvas Interaction & Ergonomics

When a user focuses on a specific element:
* **Active Focus Bounding Box**: Highlights the target element with crisp selection outlines and resize/rotate handles.
* **Secondary Accidental Click Protection**: Softly reduces sensitivity of background layers so creators do not accidentally select large backdrop artwork when trying to reposition small text or icons.
* **Live Dynamic Preview**: Text typing, color changes, and opacity adjustments render with $60\text{ fps}$ smoothness in real-time.
* **Device Emulation**: Instant toggling between **Mobile Screen** ($390\times 844\text{px}$) and **Desktop Tablet** viewports.

---

## 4. Continuous Autosave & Route Persistence

### Continuous Autosave Contract
* The application **continuously autosaves** all element positions, text values, color tweaks, and page additions to local cache immediately and debounces cloud synchronization to Firestore.
* A manual "Save Draft" button exists purely for user peace of mind, but the product **never relies on manual saving**.

### Route Hydration on Refresh (`/create/preview`)
* If a user refreshes the browser while on `/create/preview?id=inv_123`:
  1. The application parses the active Invite ID from URL parameters or local session cache.
  2. Hydrates the full element tree, page structure, and focus state.
  3. Re-renders `/create/preview` without lost data or redirection.
* **Never silently redirect to Home (`/`) on page reload.**

### Back Navigation Contract
```text
/create/preview
      ↓ (Click Back)
/create/elements
      ↓ (Click Back)
/create/details
      ↓ (Click Back)
/create/template
```
* Back navigation **always steps back to the previous logical creation stage**, preserving all user inputs and modifications.
