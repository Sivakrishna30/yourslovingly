# 03 - Publishing Workflow & Public Availability Verification

## 1. The Publishing Transition
Publishing converts a private, editable Draft into a publicly hosted, high-availability microsite.

```text
Draft Canvas
     ↓
Publish Click
     ↓
Backend Ingress & Snapshot Freezing
     ↓
Public URL Provisioning
     ↓
Automated Availability Verification
     ↓
PUBLISHED State Confirmed
     ↓
Publish Credit Consumed
```

---

## 2. Mandatory Availability Verification
- A microsite is **not** considered published merely because the user clicked "Publish".
- The system must programmatically ping and verify that the public URL responds successfully ($200\text{ OK}$) and serves the complete design bundle.
- Only upon successful verification is the Invite marked `PUBLISHED`.

---

## 3. Failure Safety & Credit Protection
- If verification fails or payment is interrupted:
  - **Zero publish credits are consumed.**
  - The Invite returns safely to `DRAFT` state with all user edits preserved.
  - The user sees a clear, friendly error message: *"We couldn't publish your Invite right now. Your credit was not consumed. Please try again."*

---

## 4. Snapshot Immutability
- Upon successful publication, the visual layout, element positions, and styling are permanently frozen into a high-performance static snapshot for lightning-fast guest delivery.
