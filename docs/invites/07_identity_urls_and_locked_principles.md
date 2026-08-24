# 07 - Identity, URLs & Locked Architecture Principles

## 1. Invite Identity & URL Architecture
Every published Invite is assigned a permanent, unique identifier and public URL:
- **Canonical Structure Options**:
  - `yourslovingly.co.in/username/invite-slug`
  - `username.yourslovingly.co.in/invite-slug`
  - `yourslovingly.co.in/invite-id`
- **URL Immutability**: URL persists across text corrections, republishing, extensions, and recoveries.

---

## 2. Structural Schema Hierarchy

```text
INVITE
│
├── Identity
│   ├── Invite ID (Permanent UUID)
│   ├── User ID (Owner)
│   └── Public Canonical URL
│
├── Metadata
│   ├── Title (e.g. "Priya & Rahul Wedding")
│   ├── Event Type (Wedding, Birthday, etc.)
│   └── Source Template Reference (Historical metadata only)
│
├── Lifecycle Status
│   ├── State: DRAFT | PUBLISHED | EXPIRED | DELETED
│   ├── Hosting Start Date & Expiry Date
│   └── Deletion Timestamp (30-day countdown if deleted)
│
├── Canvas Pages (1..N)
│   ├── Page 1: Background + Element Instances + Overrides
│   ├── Page 2: Background + Element Instances + Overrides
│   └── Page N: ...
│
├── Interactive Configurations
│   ├── RSVP Form Schema & Guest Responses
│   ├── Venue Coordinates & Map Config
│   └── Spotify Track ID
│
└── Published Snapshot (Static, Immutable Delivery Bundle)
```

---

## 3. Master Summary of Locked Product Principles
1. **Invite is the Top-Level Entity**: The complete user-owned invitation product.
2. **Page is the Editable Canvas**: Invites contain 1..N Pages.
3. **Template Decoupling**: Invites are 100% independent snapshots upon instantiation.
4. **Draft Freedom**: Unlimited private drafts; no artificial draft locks.
5. **Verified Publishing**: Publishing is confirmed only after programmatic live availability check.
6. **Credit Safety**: Failed publications never consume credits or payments.
7. **Post-Publish Text Edits Only**: Free corrections limited to text fields; visual redesign requires new Invite.
8. **Permanent URL Stability**: URLs remain fixed during text updates and hosting extensions.
9. **30-Day Recovery Period**: Explicitly deleted Invites are recoverable for 30 days before permanent purging.
10. **Zero Refund on Consumption**: Successful live publications are permanently consumed.
