# 06 — Pricing, Monetization & Entitlements Specification

**Product:** Yours Lovingly  
**Document Status:** Confirmed / Locked  
**Scope:** Pricing tiers, publishing entitlements, Basic vs. Premium Invite capabilities, Draft behavior, template monetization, download entitlements, and core monetization philosophy.

---

## 1. Purpose

This document defines the product-level pricing, publishing entitlement, Premium/Basic Invite behavior, Draft behavior, template monetization, download entitlement, and monetization philosophy for Yours Lovingly.

This is a product-behavior document. Payment-gateway implementation, database schema, technical architecture, storage architecture, billing webhooks, and other infrastructure details are intentionally outside this document.

---

## 2. Core Monetization Philosophy

Yours Lovingly should monetize meaningful product value rather than restrict creativity.

Users should not be charged merely for ordinary creative operations such as:

- moving an element
- resizing an element
- rotating an element
- changing ordinary decorative properties
- arranging elements
- creating ordinary design variations

The product should avoid artificial creative restrictions.

Users pay primarily for:

- publishing an Invite
- Premium Invite capabilities
- Premium templates
- downloadable output where applicable
- additional published Invite entitlements

The principle is:

> **Users pay for publishing capacity and value-added capabilities, not for creative freedom.**

---

## 3. User Model

There is no permanent “free user” versus “paid user” product identity.

There is:

> **One user account with individually purchased Invite entitlements.**

There is no mandatory monthly or yearly subscription model in the current product definition.

A user may create Draft Invites for exploration without becoming a subscriber.

---

## 4. Invite Terminology

An Invite is the complete user-owned design/product that can contain one or more Pages.

A Page is an individual editable canvas inside an Invite.

Example:

```text
Wedding Invite
├── Cover Page
├── Event Details Page
├── Gallery Page
├── Venue Page
└── RSVP Page
```

Publishing happens at the Invite level. Pages compose the Invite.

- A **Draft Invite** is editable and private.
- A **Published Invite** is publicly accessible.
- An **Expired Invite** is a previously published Invite whose validity has ended.

---

## 5. Draft Invites

Draft creation has no artificial product-level count restriction.

Users may create Draft Invites to:

- explore templates
- experiment with layouts
- add and edit elements
- preview designs
- compare different designs
- decide which Invite to publish

Draft data is primarily lightweight design/configuration data consisting of element instances, overrides, text values, page configuration, and references to assets.

Actual uploaded assets such as photos are the storage-heavy resources. Asset/storage limits may be defined separately as infrastructure/resource policies.

A Draft is not a paid published product.

---

## 6. Basic Invite Pricing

A Basic Invite publication costs:

> **₹49 per published Invite**

Each additional Basic Invite is purchased individually for ₹49. There is NO bundle pricing, NO Creator Pack, and NO bulk package.

Basic publishing includes:

- **15 days of live hosting** and view validity
- Standard predesigned templates and design tools
- Standard elements and typography
- Text details, Spotify music player, and photo gallery (up to 10 photos)
- Platform watermark (*"Crafted with Yours Lovingly"*)
- Public publishing at canonical URL
- Free post-publication text-only corrections
- Free and unrestricted Draft mode

A Basic published Invite does not include downloadable output (no Image or PDF downloads).

---

## 7. Premium Invite Pricing

A Premium Invite publication costs:

> **₹99 per published Invite**

Each additional Premium Invite is purchased individually for ₹99. There is NO bundle pricing and NO multi-Invite discount pack.

Premium includes everything in Basic plus:

- **15 days of live hosting** and view validity
- **Watermark-Free experience** (platform watermark removed)
- Interactive Google Maps embed + directions
- Auto-generated Location QR Code
- Interactive RSVP form with attendance counting & real-time guest responses
- UPI QR / cash gift module (direct UPI payment intent routing)
- Detailed visitor analytics (views, unique visitors, response timeline)
- Downloadable invite files:
  - High-res Image download (PNG) for single-page invites
  - Multi-page Vector PDF download for multi-page invites

Premium does NOT provide unrestricted post-publication design editing.

Even Premium Invites follow the same post-publication editing rule:

> **Only text values may be corrected after publication.**

Changing layout, position, typography, colors, element configuration, or other design properties after publication is not available as a normal post-publication editing operation. To perform a visual redesign, users create a fresh draft via **Copy to New**.

---

## 8. Basic → Premium Upgrade

A published Basic Invite may be upgraded to Premium at any time (while active or expired).

The upgrade price is:

> **₹49 additional** (₹49 original + ₹49 upgrade = ₹98 ~ ₹99 total equivalent)

The upgrade applies directly to that specific Invite artifact.

- The user does not need to recreate the Invite or change its URL.
- Removes the watermark immediately.
- Unlocks all Premium interactive capabilities (Google Maps, RSVP, UPI QR, Analytics) and Image/PDF downloads.
- Retains the current validity window (does not add days by itself; extension can be purchased separately).

---

## 9. Premium Templates

Templates may be classified as Basic or Premium for discovery and monetization purposes.

The template library may expose:

- All
- Basic
- Premium

Premium templates can be previewed by users.

A Premium template may be used to create a Draft, but publishing the resulting Premium Invite requires the applicable Premium entitlement.

Premium status belongs to the resulting Invite/publishing entitlement, not to the user’s permanent account type.

---

## 10. Elements

Individual decorative and functional elements are not currently divided into Basic and Premium categories.

There is no Basic/Premium element paywall in the current product definition.

This may be introduced later as a Phase 2 monetization capability if required.

---

## 11. Publishing

Publishing is the primary monetization transition.

A Draft Invite can be published as:

- **Basic** → ₹49
- **Premium** → ₹99

Publication is successful only after the public Invite has actually been created and verified as available.

A failed publication must not consume the applicable entitlement/payment.

A successful publication consumes the applicable publication entitlement.

---

## 12. Published Invite Editing

Once an Invite has been successfully published, its design is not freely editable.

Free post-publication editing is intentionally limited to text-value corrections.

Examples:

- name
- date
- address
- ordinary words
- letters
- similar content corrections

The user cannot use free post-publication editing to change:

- element position
- element size
- font
- font styling
- colors
- layout
- background
- element arrangement
- design structure
- interactive design configuration

This rule applies to both Basic and Premium Invites.

There is no paid full-design post-publication editor in the current product model.

---

## 13. Download

Download capability is available only for Premium Invites.

- Basic ₹49 Invites do not include download.
- Premium ₹99 Invites include download.

Supported download formats and exact export implementation are defined separately from this monetization document.

A Basic user may upgrade the Invite to Premium if they require Premium capabilities such as download.

---

## 14. Published Invite Capacity / Additional Invites

There is no user-facing “Page Slot” system.

The user should not have to understand slot arithmetic such as:

- 3 slots
- 5 slots
- 7 slots
- consumed slots
- replacement slots

Instead, the product presents publishing as an individual, atomic Invite-level purchase.

- Basic Invite publication: **₹49**
- Premium Invite publication: **₹99**

Each additional Invite is purchased individually at its standard price (₹49 for Basic, ₹99 for Premium).

There is NO bundle pricing, NO Creator Pack, and NO bulk package (e.g. no ₹499 or ₹999 multi-page packs).

---

## 15. Drafts and Published Invites Are Separate Concepts

Draft capacity is not reduced when an Invite is published.

Drafts are exploratory working designs.

Published Invites are monetized public artifacts.

The system must not create confusing user-facing concepts such as “publishing consumes a Draft slot.”

A user may keep Draft Invites for experimentation while separately owning published Invites.

---

## 16. Validity, Expiry & Hosting Extensions

Every published Invite (Basic or Premium) includes **15 days of live hosting** and view validity from the timestamp of publication.

### Expired Invites

An Expired Invite remains in the user’s account.

- Expiry does **not** mean deletion.
- Expiry does **not** convert the Invite into a Draft.
- Expiry does **not** automatically create a new Draft.
- The public URL displays an inactive/expired message, but the original slug and design remain preserved.

### Hosting Extension Model

Validity extensions are purchased individually per-Invite:

- **Basic Invite Extension**: **₹49** for **+30 days** of live hosting.
- **Premium Invite Extension**: **₹99** for **+30 days** of live hosting.
- **Lifetime Validity**: **₹999** per Invite for permanent hosting with no expiration date.

### Extension Stacking Rules:
- **Active Invites**: Adding +30 days extends from the current expiration timestamp (stacking). Multiple 30-day extensions can be purchased consecutively.
- **Expired Invites**: Adding +30 days reactivates the Invite for 30 days starting immediately from the extension purchase timestamp.
- **Lifetime Validity**: Sets the expiration timestamp to infinite/permanent, removing all future expiration notices.
- Extensions extend hosting validity only; they do not alter design layout or convert the Invite into a Draft.

### Copy to New

If the user wants to redesign an expired or published Invite, the user can use:

> **Copy to New**

This creates a new Draft Invite with a new Invite ID.

The original expired Invite remains unchanged in the creator's dashboard.

Because Draft creation has no artificial product-level count restriction, the new Draft does not require a Page-slot calculation.

---

## 17. Refund Principle

A successful publication is not refunded merely because the user later:

- deletes the Invite
- allows it to expire
- stops using it
- replaces it with another Invite

Once successful publication has occurred, the associated publication entitlement is considered consumed.

Payment/refund handling for genuine billing errors, duplicate transactions, or payment-system failures is a separate concern.

---

## 18. No Subscription Requirement

The current product does not require:

- monthly subscription
- yearly subscription
- permanent Premium user status
- permanent paid account status

A user simply purchases the published Invite capabilities they need.

The same user can have:

```text
Invite A → Free/Basic
Invite B → Basic ₹49
Invite C → Premium ₹99
```

The user’s account itself does not become permanently “Premium”.

---

## 19. Monetization Boundaries

The product should avoid arbitrary monetization such as:

> “Pay to move this element.”  
> “Pay to resize this element.”  
> “Pay to rotate this decoration.”  
> “Pay to use ordinary SVG elements.”  

Instead, monetization should remain at meaningful product boundaries:

- publishing
- Premium Invite capabilities
- Premium templates
- download
- additional published Invite entitlements

This preserves the product’s core philosophy of creative freedom.

---

## 20. Storage and Draft Protection Principle

Draft creation should not be artificially restricted merely because Draft configuration data is stored.

Draft configuration is primarily lightweight structured data:

- element instance references
- overridden values
- text values
- positions
- styles
- page configuration
- asset references

Actual storage-heavy resources are uploaded assets such as photos and other media.

Infrastructure-level protections such as storage quotas, asset-size limits, upload controls, rate limiting, or abuse protection may be introduced independently if required for platform stability.

These are not intended to become creative restrictions in the product experience.

---

## 21. Current Commercial Model Summary

| Capability | Basic | Premium |
| :--- | :---: | :---: |
| **Publishing Price** | **₹49** | **₹99** |
| **Initial Live Hosting & Validity** | **15 Days** | **15 Days** |
| **Platform Watermark** | Yes (*"Crafted with Yours Lovingly"*) | ❌ No (Watermark-Free) |
| **Predesigned Templates & Design Tools** | Yes | Yes |
| **Spotify Music & 10-Photo Gallery** | Yes | Yes |
| **Interactive Maps & Directions** | No | Yes |
| **Location QR Code Generation** | No | Yes |
| **Interactive RSVP & Headcount** | No | Yes |
| **UPI QR / Cash Gift Direct Routing** | No | Yes |
| **Visitor Analytics & Timelines** | No | Yes |
| **Downloadable Assets (PNG / PDF)** | No | Yes (PNG single-page, PDF multi-page) |
| **Post-Publication Text Corrections** | Free & Unlimited | Free & Unlimited |
| **Post-Publication Design Alterations** | ❌ (Requires "Copy to New") | ❌ (Requires "Copy to New") |
| **30-Day Hosting Extension** | **₹49** | **₹99** |
| **Lifetime Hosting Validity** | **₹999** | **₹999** |
| **Upgrade to Premium** | — | **₹49 additional** |
| **Bundle / Creator Pack Pricing** | None (Atomic per-Invite) | None (Atomic per-Invite) |
| **Monthly / Yearly Subscriptions** | None | None |

---

## 22. Product Decisions Locked in This Document

1. Basic publication = ₹49 per Invite (includes 15 days live hosting).
2. Premium publication = ₹99 per Invite (includes 15 days live hosting & Watermark-Free experience).
3. Basic → Premium upgrade = ₹49 additional (unlocks all Pro features & downloads immediately).
4. Initial hosting validity = 15 days from publication timestamp for all newly published Invites.
5. Basic 30-day hosting extension = ₹49 (stacks onto active expiry or reactivates expired Invite for 30 days).
6. Premium 30-day hosting extension = ₹99 (stacks onto active expiry or reactivates expired Invite for 30 days).
7. Lifetime validity = ₹999 per Invite (permanent hosting, never expires).
8. NO bundle pricing, NO Creator Packs, and NO multi-Invite packages (e.g. no ₹499/₹999 packs).
9. NO user-facing "Page Slot" arithmetic or slot consumption models.
10. Premium is an Invite-level entitlement, not a permanent user subscription.
11. There is no mandatory monthly/yearly subscription.
12. Draft creation has no artificial product-level count restriction and is always 100% free.
13. Drafts are for exploration and remain separate from published Invite entitlements.
14. Published Invites are the primary monetized artifact.
15. Download entitlement is strictly Premium-only (PNG image for single-page, Vector PDF for multi-page).
16. Post-publication editing is text-value-only for both Basic and Premium.
17. Full design editing after publication requires creating a fresh draft via "Copy to New".
18. Expiry does not convert an Invite into a Draft and never deletes it from the creator's dashboard.
19. Successful publication is not refunded merely because the Invite later expires or is deleted.
20. Monetization protects genuine platform value without restricting creative freedom.
