# 07 - Lifecycle, Post-Publication, Extensions & Recovery

## 1. Post-Publication Editing & Correction Rules

To protect the integrity of links that have already been distributed to hundreds of guests via WhatsApp and print cards, published invites follow strict editing rules:

```text
                        Published Invite
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
     Free Text Corrections            Major Design Overhaul
  (Typos, Dates, Venue text,        (Changing layouts, fonts,
   Host notes, RSVP details)         backgrounds, or artwork)
               │                               │
               ▼                               ▼
       Allowed for Free                Clone via "Copy to New"
  (Retains same canonical URL)     (Creates fresh editable Draft)
```

### What Is Allowed for Free:
* Correcting typos in names, dates, venue addresses, and family greetings.
* Updating itinerary timings or adding a parking instruction.
* Modifying RSVP deadline dates or questions.

### What Is Locked After Publication:
* Changing fonts, layout grids, or coordinate placement of elements.
* Replacing core artwork, backgrounds, or theme motifs.
* *Reasoning*: Preserves consistency for recipients who have already opened the card and prevents unintended visual regressions.

---

## 2. Expiry vs. Deletion Lifecycle

**Expiry is NOT deletion.** They represent completely different states:

```text
Active Published State (Valid for 15 / 30 / Lifetime Days)
                        │
                        ▼ (Validity elapsed)
                  Expired State
    • Canonical URL displays polite "Event Has Concluded" notice.
    • Invite is safely preserved in creator's Dashboard under `/dashboard/expired`.
    • Guest RSVP responses and analytics data remain intact.
    • NEVER automatically deleted.
```

---

## 3. Validity Extensions & Reactivation

Creators can extend the live hosting period of any published or expired invite directly from the Dashboard:

* **Basic Extension**: **₹14 / 30 Days**
* **Premium Extension**: **₹99 / 30 Days**
* **Lifetime Validity**: **₹999 (Permanent Hosting)**

### Key Extension Rule:
* Extending validity reactivates or extends the public URL availability.
* It does **not** reopen the published invite for free design redesigns.
* If a host wishes to create a newly redesigned invite for a different event, they use `Copy to New`.

---

## 4. "Copy to New" (Independent Invite Cloning)

`Copy to New` enables creators to reuse existing layouts without risking published links:

* Creates an **independent, brand-new Invite** with a distinct Invite ID.
* Clones all canvas pages, element coordinates, fonts, color palettes, and text content into a clean `Draft` state.
* The new Draft can be freely modified, redesigned, or published with its own unique canonical URL.
* Leaves the original Published / Expired invite 100% unaltered.

---

## 5. Deletion, Trash & Soft Recovery

Deletion is an explicit user action governed by safety buffers:

```text
User initiates Delete on Invite (Draft, Published, or Expired)
                        │
                        ▼
            Explicit Confirmation Dialog
                        │
                        ▼
          Moved to Trash (Soft Deleted)
    • Retained for 30-Day Recovery Period.
    • User can click "Restore" at any time to recover the Invite.
                        │
                        ▼ (After 30 Days or Manual "Delete Forever")
              Permanently Purged
```

---

## 6. Global Error Handling & Deterministic Outcomes

Every asynchronous user action (saving, publishing, payment, duplication, deletion) **must yield a deterministic, unambiguous outcome**:

| Operation | Success Outcome | Failure / Timeout Outcome | Recovery Path |
| :--- | :--- | :--- | :--- |
| **Autosave** | Status indicates "All changes saved". | Local storage fallback preserves in-memory edits. | Auto-retries cloud sync silently when connection resumes. |
| **Publishing** | Status `Published = true`; canonical URL active. | Status remains `Draft`; user notified of exact error. | One-click "Retry Publishing" button; zero lost work. |
| **Payment** | Receipt generated; triggers publishing pipeline. | Transaction aborted; invite remains in Draft. | User can retry payment or choose a different payment method. |
| **Page Reload** | Hydrates state for the active route. | Fallback to dashboard with user toast. | State reconstructed from persistent local/cloud draft. |

---

## 7. Master End-to-End Visual Workflow

```text
                         LANDING PAGE (/)
                               │
                               ▼
                    START CREATING FREE
                               │
                               ▼
                    EVENT TYPE (/create/event-type)
                               │
                  ┌────────────┴────────────┐
                  ▼                         ▼
             USE TEMPLATE                 BLANK
                  │                         │
                  ▼                         │
        EVENT-SPECIFIC TEMPLATES           │
                  │                         │
                  └────────────┬────────────┘
                               ▼
                    INVITE DETAILS (/create/details)
                               │
                               ▼
                       ELEMENTS (/create/elements)
                               │
                ┌──────────────┴──────────────┐
                │                             │
        Template Elements               New Elements
                │                             │
                └──────────────┬──────────────┘
                               ▼
                 PREVIEW / EDIT (/create/preview)
                               │
                    ┌──────────┴──────────┐
                    │                     │
             Direct Editing        Next / Previous
             (Click canvas)        Sequential Stepper
                    │                     │
                    └──────────┬──────────┘
                               ▼
               INTERACTIVE FEATURES (/create/features)
                               │
                               ▼
                     PUBLISHING (/create/publish)
                               │
                    ┌──────────┴──────────┐
                    │                     │
                 Basic                 Premium
                  ₹49                   ₹99
                    │                     │
                    └──────────┬──────────┘
                               ▼
                      PAYMENT (/create/payment)
                               │
                               ▼
                    PUBLICATION PROCESSING
                               │
                               ▼
                      URL PROVISIONING
                               │
                               ▼
                    AVAILABILITY CHECK
                         /          \
                       FAIL         SUCCESS
                        │             │
                        ▼             ▼
                      DRAFT       PUBLISHED (/invite/:id)
                                      │
                    ┌─────────────────┼────────────────┐
                    ▼                 ▼                ▼
                  SHARE              QR             ANALYTICS
                    │
                    ▼
                  EXPIRE
                    │
              ┌─────┴─────┐
              ▼           ▼
          EXTEND       COPY TO NEW
```

### Core Architecture Axioms
1. **Template**: Starting composition; never a permanent restriction.
2. **Invite**: Independent, user-owned, durable design object.
3. **Page**: Canvas surface inside an Invite.
4. **Element**: Discrete, movable, resizable, layerable entity.
5. **Interactive Feature**: High-level capability behaving as an Element on canvas.
6. **Navigation**: Every screen has its own route; refresh preserves route state; back returns to previous logical step.
