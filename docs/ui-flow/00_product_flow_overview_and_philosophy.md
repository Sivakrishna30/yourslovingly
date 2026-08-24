# 00 - Product Flow Philosophy & Navigation Architecture

## 1. Product Flow Philosophy
Yours Lovingly is a visual Invite creation and publishing platform. The UI follows three primary foundational principles:

### Freedom
* Users can freely create and modify their Invite.
* There should be no unnecessary creative restrictions.
* Every element, artwork, typography piece, and interactive component can be placed, sized, and layered without artificial boundaries.

### Transparency
At every stage of the product journey, the user should clearly understand:
* **Where they are**: Visual breadcrumbs and distinct route locations.
* **What they are editing**: Exact element focus and canvas context.
* **What has been saved**: Unobtrusive autosave status and draft timestamps.
* **What is draft / published / expired**: Explicit lifecycle badge indicators.
* **What action comes next**: Clear, deterministic calls-to-action without surprise gates.
* **Whether payment is required**: Transparent pricing breakdown upfront.

### Flexibility
The user can start their creation journey from:
* **A predefined Template**: Provides an aesthetic starting composition.
* **A Blank Invite**: Start with a clean canvas ready for custom element placement.

> **Key Rule**: Templates provide an initial starting composition, never a permanent restriction or runtime lock.

---

## 2. Master Product Flow & Screen Hierarchy

```text
Landing Page (/)
     ↓
Start Creating Free
     ↓
Event Type (/create/event-type)
     ↓
Template Selection / Blank Invite (/create/template)
     ↓
Invite Details (/create/details)
     ↓
Elements (/create/elements)
     ↓
Preview / Element Editing (/create/preview)
     ↓
Interactive Features (/create/features)
     ↓
Publishing (/create/publish)
     ↓
Payment (when required) (/create/payment)
     ↓
Publication Verification
     ↓
Published Invite (/invite/:id)
     ↓
Share / QR / Analytics / Download

Authenticated User Area:
Dashboard (/dashboard)
 ├── Invites (/dashboard/invites)
 ├── Drafts (/dashboard/drafts)
 ├── Published (/dashboard/published)
 ├── Expired (/dashboard/expired)
 └── Account (/dashboard/account)
```

---

## 3. Global Navigation Principle
Every meaningful UI screen **must** have its own distinct, addressable route / URI.

* **No screen should depend on ephemeral homepage state.**
* **Refreshing a page must preserve that exact page and hydrate its state.**
* **Direct URLs must be accessible**: Opening a direct link to `/create/details?id=xyz` or `/dashboard/published` must load that specific workspace directly.

### Standard Route Mapping

| Route | Description & View Purpose |
| :--- | :--- |
| `/` | Primary Landing Page & marketing showcase |
| `/create` | Create Invite entry router / redirect |
| `/create/event-type` | Event category selection (Wedding, Birthday, etc.) |
| `/create/template` | Event-filtered Template selection or Blank Invite choice |
| `/create/details` | Generic & template-defined content fields configuration |
| `/create/elements` | Visual element discovery, addition, and layering |
| `/create/preview` | Live Invite preview & optional element-by-element editing |
| `/create/features` | Interactive capabilities configuration (RSVP, Maps, Spotify) |
| `/create/publish` | Plan tier selection, validity review, and publishing trigger |
| `/create/payment` | Checkout and payment gateway execution |
| `/invite/:id` | Canonical public rendered microsite |
| `/dashboard` | User overview and metrics |
| `/dashboard/invites` | Complete Invite management index |
| `/dashboard/drafts` | Working private drafts |
| `/dashboard/published` | Live published Invites |
| `/dashboard/expired` | Expired Invites awaiting extension or cloning |

---

## 4. Navigation Rules & Behavioral Contract

### Refresh Persistence
* When a user triggers a browser refresh, the application **must reopen the current route and hydrate its working state**.
* The application must **never** silently redirect to Home unless the current route or resource ID is genuinely invalid or non-existent.

### Back Navigation
* Application Back button and browser navigation must return to the user's previous meaningful logical step:
  ```text
  Template Selection
         ↓
   Invite Details
         ↓
      Elements
  ```
  *Back from Elements returns to `Invite Details` (not `Home`).*
  *Back from `Invite Details` returns to `Template Selection`.*

### Direct URL Access
* Valid deep links (e.g. editing a specific draft via `/create/details?id=draft_123`) must load and authenticate where needed, presenting the exact editor step immediately.

### Invalid / Expired Route Handling
* An invalid, non-existent, or unpermitted route must present an informative error / not-found state with recovery actions, rather than silently jumping to Home.

---

## 5. Product-Level State Model

The complete Invite lifecycle progresses through deterministic states:

```text
       ┌──────────────┐
       │    DRAFT     │ ───────────────┐
       └──────────────┘                │
              │ (Publish clicked)      │
              ▼                        │
       ┌──────────────┐                │
       │  PUBLISHING  │                │
       └──────────────┘                │
        │            │                 │
 (Fail) │            │ (Verified)      │
        ▼            ▼                 │
      [DRAFT]  ┌──────────────┐        │
               │  PUBLISHED   │ ───────┼───────► [DELETED]
               └──────────────┘        │         (Soft recovery
                      │ (Validity ends)│          available 30d)
                      ▼                │
               ┌──────────────┐        │
               │   EXPIRED    │ ───────┘
               └──────────────┘
                │            │
      (Extend)  ▼            ▼ (Copy to New)
          [PUBLISHED]   [NEW DRAFT]
```

### Core Implementation Principles
1. **Template**: Starting composition snapshot only; never a runtime dependency.
2. **Invite**: Independent user-owned product and design object.
3. **Page**: Canvas inside an Invite (supports multi-page compositions).
4. **Element**: Independently editable, movable, resizable piece of a page canvas.
5. **Interactive Feature**: High-level product capability that renders and manipulates as a native Element inside the preview canvas.
