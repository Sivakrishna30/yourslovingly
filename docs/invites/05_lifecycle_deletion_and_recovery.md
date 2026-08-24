# 05 - Invite Lifecycle, Deletion & 30-Day Recovery

## 1. Lifecycle State Definitions

```text
DRAFT ──────────────► PUBLISHED ──────────────► EXPIRED
  │                       │                        │
  │                       ▼                        ▼
  └───────────────► DELETED (30-Day Recovery) ────► PERMANENTLY PURGED
```

---

## 2. Expiry vs. Explicit Deletion

### 2.1 Expired State
- Occurs automatically when the hosting duration (15 days initial, or purchased extension) elapses.
- Visitors see a friendly *"This Invite has expired"* notice.
- **Expiry is NOT deletion**: The Invite remains safely in the creator's dashboard and can be extended with a single click.

### 2.2 Deleted State
- Occurs only when the creator explicitly deletes a published or expired Invite.
- Moves the Invite to the **30-Day Recoverable Trash**.
- Public visitors see *"Invite temporarily unavailable"*.

---

## 3. 30-Day Recovery Window
- During the 30-day window, the creator can:
  - **Recover**: Instantly restores the Invite to its prior valid state (Published or Expired).
  - **Permanently Delete**: Immediately purges all data, assets, and URLs.
- **Automatic Purge**: If no action is taken after 30 days, the Invite is permanently and irrevocably deleted.

---

## 4. Consumption Finality
- Deleting an Invite **never refunds** a previously consumed publishing entitlement.
- Once successfully published, the transaction is finalized.
