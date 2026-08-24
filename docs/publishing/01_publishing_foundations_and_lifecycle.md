# 01 - Publishing Workflow & Verification Foundations

## 1. Purpose & Scope
Publishing is the core lifecycle milestone that converts a private, user-owned Draft Invite into an immutable, high-availability public microsite.

> **Guiding Principle**: *An Invite becomes public only after publication actually succeeds and the public microsite is programmatically verified as available.*

---

## 2. Invite Lifecycle States
The primary Invite lifecycle progresses through four distinct states:

```text
DRAFT ──────────────► PUBLISHED ──────────────► EXPIRED
  │                       │                        │
  │                       ▼                        ▼
  └───────────────► DELETED (30-Day Recovery) ────► PERMANENTLY PURGED
```

---

## 3. Draft State Characteristics
- **Private & Safe**: Visible only to the creator; never indexed by search engines.
- **Unrestricted Canvas**: Full freedom to add elements, rearrange layouts, test color schemes, and preview interactive features.
- **No Cost to Create**: Draft creation is free and exploratory.

---

## 4. The Publication Pipeline

```text
Draft State
    ↓
Click "Publish"
    ↓
Freeze Design Snapshot
    ↓
Provision Public URL
    ↓
Automated Availability Health-Check
    ↓
PUBLISHED State Finalized
    ↓
Publishing Entitlement Consumed
```

---

## 5. Programmatic Availability Verification
To prevent broken links or failed deployments:
1. The deployment pipeline provisions the microsite bundle and URL.
2. An automated verification worker issues an internal probe request to the provisioned URL.
3. The probe validates HTTP 200 OK status and verifies design payload integrity.
4. Only upon confirmed verification is the user notified and the publication finalized.
