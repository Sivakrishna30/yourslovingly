# 04 - Features, Publishing & Sharing Workflow

## 1. Feature Classification Matrix

| Feature | Tier | Description & Scope |
| :--- | :---: | :--- |
| **Typography & Styling** | Free | Complete font, size, alignment, and color controls across all elements. |
| **Venue Information** | Free | Free-form venue name, address, and instructions text. |
| **Spotify Music** | Free | 1 curated Spotify song embedded seamlessly per invite. |
| **Photo Gallery** | Free | Up to 10 images per invite with configurable gallery layouts. |
| **Password Protection** | Free/Configurable | Optional password protection with "Remember Access" authorization. |
| **Google Maps** | **Premium** | Interactive map embed with automated directions link. |
| **Location QR** | **Premium** | Auto-generated QR code navigating directly to the venue/location. |
| **Interactive RSVP** | **Premium** | Customizable RSVP form responses captured directly into dashboard. |
| **UPI Scanner / QR** | **Premium** | Displays custom UPI QR / VPA. Payment routes directly to user's UPI. |
| **Invite Insights** | **Premium** | Total views, unique visitors, views over time, and RSVP activity. |

---

## 2. Publishing Rules & Credit Consumption
- **Lifecycle Event**: Publishing turns an editable draft into a public, hosted live microsite.
- **Entitlement Rule**: A publishing credit is **only consumed upon successful live publication** (payment confirmed + invite live + public URL generated).
- **Failure Safety**: If payment or publishing fails for any reason, **zero credits are consumed**, and the user returns safely to their draft.
- **Irreversible Consumption**: Once an invite is published successfully, that entitlement is permanently consumed even if the user later deletes or expires the invite.

---

## 3. Post-Publication Editing & Copy Flow
- Published invites cannot simply be edited for free to maintain lifecycle consistency.
- **Copy to New Invite**: Creates a fresh duplicate with a new invite ID and new URL, requiring its own publishing entitlement while keeping the original invite intact.

---

## 4. Invite URLs & Persistence
- **Supported URL Patterns**:
  - `yourslovingly.co.in/username/invite-name`
  - `username.yourslovingly.co.in/invite-name`
- **URL Persistence**: The URL remains permanently tied to the invite through extensions, expirations, and recoveries. It never changes unless "Copy to New Invite" is chosen.

---

## 5. Sharing, QR & Export Rules
- **Sharing Actions**:
  1. *Copy URL*: Quick clipboard copy.
  2. *Share URL*: Native device/browser share sheet.
  3. *Generate QR Code*: URL-based QR code for printing on physical invitation cards.
- **Download & Export**: Available only after publication:
  - *Single-page designs*: PDF and high-res Image export.
  - *Multi-page designs*: Full-document multi-page PDF.
