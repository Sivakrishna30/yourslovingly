# 05 - Expiry, Deletion & 30-Day Recovery Model

## 1. Expired vs. Deleted States

### Expired State
- Triggered automatically when the hosting duration (15 days initial or purchased extension) expires.
- Public microsite displays: *"This Invite has expired."*
- **Retention**: Stored safely in the user's dashboard; can be reactivated anytime with a hosting extension.

### Explicit Deletion
- Triggered when the creator clicks "Delete Invite".
- Initiates an immediate **30-Day Recovery Period**.
- Public visitors see: *"Invite temporarily unavailable."*

---

## 2. 30-Day Recovery Window
- **Restore Option**: Creator can restore the Invite back to its previous active state with full data, URL, and RSVPs preserved.
- **Immediate Permanent Purge**: Creator can bypass the 30-day window to permanently erase all assets and URLs immediately.
- **Automatic Purge**: After 30 days of inactivity in trash, the Invite is permanently and automatically deleted.

---

## 3. Entitlement Consumption Finality
- Deleting an Invite **never refunds** a previously consumed publishing entitlement.
- Once successfully published and verified, the publishing credit transaction is finalized.
