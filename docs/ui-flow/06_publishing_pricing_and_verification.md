# 06 - Publishing, Pricing Model & Deterministic Verification

## 1. Publishing Review & Plan Selection (`/create/publish`)

When design customization and interactive feature setup are complete, the creator enters the **Publishing Review** screen.

```text
                        /create/publish
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
       Basic Invite Plan              Premium Invite Plan
             ₹49                              ₹99
   • Standard Elements              • All Basic Features
   • 15-Day Active Hosting          • Premium Templates & SVGs
   • Basic RSVP & QR Code           • Custom RSVP & Music Player
   • Free Typo Corrections          • Google Maps Directions
                                    • High-Res Image Download
                                    • Priority Verification
```

---

## 2. Transparent Pricing Architecture

The pricing model is intentionally straightforward, transparent, and fair:

* **No Creator Packs or Complicated Pro Bundles**
* **No Multi-page Penalty Pricing**
* **No Recurring Monthly Subscription Traps**
* **One-time payment per published Invite**

### Standard Plan Matrix

| Tier / Capability | Price | Included Validity | Key Included Features |
| :--- | :--- | :--- | :--- |
| **Basic Invite** | **₹49** | 15 Days | Core templates, standard typography, basic RSVP, QR code link, free text typo corrections. |
| **Premium Invite** | **₹99** | 15 Days | Everything in Basic + Premium templates, Spotify music player, Google Maps integration, Custom RSVP forms, Analytics & high-res image download. |
| **Basic Extension** | **₹14** | +30 Days | Extends live hosting for 30 additional days on a Basic Invite. |
| **Premium Extension** | **₹99** | +30 Days | Extends live hosting for 30 additional days on a Premium Invite. |
| **Lifetime Premium** | **₹999** | Permanent | Indefinite lifetime hosting validity; no recurring renewals ever needed. |

> **Value Principle**: Users pay for the capability and hosting value of the Invite, never for creative freedom or tool features during design.

---

## 3. Premium Capabilities vs. Post-Publication Scope

Selecting Premium unlocks advanced features (such as Spotify background audio, custom RSVP fields, or premium gold artwork), but:

* **Premium does NOT grant unrestricted post-publication layout redesigns.**
* Once an Invite is published (Basic or Premium), the design composition is locked to protect the integrity of shared links. Minor text typo corrections remain completely free.
* To perform major layout or visual redesigns after publishing, users can clone the invite via `Copy to New`.

---

## 4. End-to-End Publication Flow & Verification

The publishing pipeline enforces a strict, fail-safe verification cycle:

```text
Preview (/create/preview)
    ↓
Publishing Review (/create/publish)
    ↓
Payment Gateway (Razorpay / Stripe / UPI) (/create/payment)
    ↓ (Payment Success)
Publication Processing (Static snapshot generated & deployed)
    ↓
Canonical URL Provisioning (https://yourslovingly.in/invite/inv_xyz)
    ↓
Availability Verification Check (Automated health check on live URL)
    │
    ├─────────────────────────────┬─────────────────────────────┐
    ▼ (Check Passed: 200 OK)      ▼ (Check Failed / Timeout)    ▼ (Transient Error)
Status: `published = true`    Status: `published = false`   Auto-reconciliation Worker
Live URL shared with user     Draft preserved; User alerted Enqueued for verification
```

### Deterministic Publication Verification
1. **Live Accessibility Check**: The backend verifies that the static snapshot and assets are 100% accessible over CDN before flipping `published = true`.
2. **Deterministic Outcome**:
   * **Success**: Invite is marked `Published`, canonical URL is returned, and sharing modal opens.
   * **Failure**: Invite safely remains as an intact `Draft`. The user receives a clear error explanation and one-click retry.
3. **No Hanging States**: The UI never gets trapped in an indefinite loading spinner.

---

## 5. Canonical URL & Identity Model

* Every published Invite is assigned a **permanent Invite ID** and **canonical public URL**:
  ```text
  https://yourslovingly.in/invite/[INVITE_SLUG_OR_ID]
  ```
* **Republishing Safety Rule**:
  * If a host applies minor text corrections and republishes, the invite **maintains the exact same canonical URL**.
  * The previous valid public version remains live until the new version passes verification.
* **Duplication Independence**:
  * Using `Copy to New` generates a distinct new Invite ID and an entirely new URL when published.

---

## 6. Post-Publication Sharing Suite

Upon verified publication, the creator receives immediate access to the full sharing suite:
* **One-Tap Link Copy**: Copies formatted invitation message and short URL.
* **Direct WhatsApp Share**: Pre-fills invitation message with bride/groom or host names.
* **Printable QR Code**: High-resolution vector QR code ready for physical card printing.
* **Real-time Analytics**: Instant view counter and RSVP tracking dashboard.
