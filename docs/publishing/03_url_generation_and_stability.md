# 03 - URL Generation, Identity & Independence

## 1. Public URL Architecture
Every successfully published Invite receives a permanent, canonical public URL.

### Canonical URL Options:
1. **User Identity Path**: `yourslovingly.co.in/username/invite-slug`
2. **Subdomain Format**: `username.yourslovingly.co.in/invite-slug`
3. **Direct Identifier**: `yourslovingly.co.in/invite-slug`

---

## 2. Permanent URL Stability
- Once published, normal republishing and text corrections **always preserve the exact same URL**.
- Critical for real-world usage:
  - Printed physical wedding cards with QR codes remain valid.
  - WhatsApp messages, emails, and shared links never break.
  - Browser bookmarks continue to resolve smoothly.

---

## 3. Decoupled Invite Identity vs. Public URL
- **Invite ID**: A permanent backend UUID uniquely identifying the user's design object.
- **Public URL**: The external routing address mapped to the published snapshot.
- Copying an Invite creates a brand-new Invite ID and provisions a fresh URL upon publication.

---

## 4. Published Snapshot Independence
- Published Invites render from self-contained, immutable snapshots.
- Future updates, retirements, or price changes to the original source Template or Global Elements have **zero effect** on already-published Invites.
