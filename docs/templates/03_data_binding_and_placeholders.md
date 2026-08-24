# 03 - Data Binding, Input Forms & Event Placeholders

## 1. Template Predefined Defaults
Templates specify pre-configured initial values across:
- Primary headings, subtitles, and event body copy
- Display and body font pairings
- Theme color tokens (primary accent, secondary accent, background fill)
- Interactive component defaults (default RSVP toggles, map placeholder pins)

---

## 2. Dynamic Event Input Form
When creating an Invite from a template, users can quickly fill in high-level event details:
- Event Title / Celebration Name
- Bride & Groom / Host Names
- Event Date, Event Time, Timezone
- Venue Name, Full Address, Landmark Instructions
- Description / Special Invitation Message

---

## 3. Semantic Placeholders & Data Bindings
Templates utilize semantic placeholders to bind input fields directly into text elements:

```text
{{bride_name}}
{{groom_name}}
{{event_name}}
{{event_date}}
{{event_time}}
{{venue}}
{{address}}
{{description}}
```

### Architectural Principle
Placeholders are **pure data bindings**, not distinct rendering types.
- An element with `role = bride_name` and `content = {{bride_name}}` remains an ordinary **Text Element**.
- Users can click directly on the canvas at any time to format, style, or override placeholder text directly.

---

## 4. Automatic Population & User Ownership
- As the user types into the quick-setup form, all matching placeholders throughout the template update in real-time.
- The resulting populated content belongs exclusively to the user's private Invite snapshot and is never saved back to the public template.
