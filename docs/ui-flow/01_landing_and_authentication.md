# 01 - Landing Page, Authentication & Dashboard Architecture

## 1. Landing Page Architecture

The Landing Page (`/`) serves as the primary marketing, discovery, and initial onboarding interface.

### Primary Purpose
The Landing Page must immediately and clearly answer 6 fundamental visitor questions:
1. **What is Yours Lovingly?** — Modern visual digital invitation and microsite creator.
2. **What can I create?** — High-end invitations, announcement cards, flyers, and event microsites across multiple event categories.
3. **What will my finished Invite look like?** — Live, interactive, responsive sample designs with elegant typography, rich media, and interactive widgets.
4. **Why should I use Yours Lovingly?** — Total creative freedom, zero ads, no subscription trap, real-time RSVP, maps, music, and instant shareable links.
5. **How much does it cost?** — Simple transparent pricing: Free to start, ₹49 Basic, ₹99 Premium.
6. **Common questions** — Transparent FAQ covering hosting validity, post-publication corrections, and export options.

### Key Sections on the Landing Page
* **Hero Banner**:
  - High-impact headline and value proposition.
  - **Primary CTA**: `Start Creating Free`.
  - *No duplicate or conflicting secondary "Create Invite" CTAs.*
* **Samples Showcase**:
  - Highlights a curated set of finished, high-quality Invites:
    - *Wedding Invite*
    - *Birthday Invite*
    - *Housewarming Invite*
    - *Anniversary / Representative Invite*
  - A quick "View Samples" action smoothly navigates/scrolls visitors to this showcase.
* **Feature Highlights**:
  - Promotes key capabilities: Predefined Templates & Elements, Google Maps directions, Spotify audio playback, interactive RSVP, QR codes, and analytics.
  - *Note: Do not render a heavy interactive template showcase on the landing page; template selection belongs natively inside the `/create` flow.*
* **Transparent Pricing**:
  - Highlights the ₹49 Basic and ₹99 Premium tiers with feature checklists.
* **Comprehensive FAQ**:
  - Addresses user expectations regarding hosting duration (15/30 days / lifetime), editing after publishing, mobile viewing, and guest limits.

---

## 2. Authentication & Guest Onboarding

Yours Lovingly adopts a **zero-barrier guest creation model**:

```text
Visitor enters Landing Page
            ↓
Clicks "Start Creating Free"
            ↓
Chooses Event Type & Template (No login prompt)
            ↓
Fills Invite Details & Customizes Canvas (No login prompt)
            ↓
Previews Full Live Design (No login prompt)
            ↓
Action Requiring Account (Save across sessions, Publish, Manage)
            ↓
Google Sign-In / Account Auth Prompt
            ↓
Working Draft Linked Seamlessly to User Account
```

### Guest Creation Capabilities
A guest user can freely perform all creative workflows without an account:
* Start an Invite
* Select Event Type
* Select Template or Blank Canvas
* Enter and customize Invite Details
* Add, reposition, resize, and style Elements
* Test interactive components in preview
* View full simulated Live Preview

### Authentication Triggers
Authentication becomes mandatory only when persistent, user-specific account operations are invoked:
1. **Saving Draft across browser sessions / devices**.
2. **Publishing the Invite** to generate a live canonical URL.
3. **Accessing the Dashboard** to manage existing, published, or expired Invites.
4. **Processing Payment** for basic or premium tiers.

### Auth Provider
* Seamless **Google Sign-In** integration (via Firebase Auth) provides one-click authentication.
* Session hydration automatically merges any in-memory guest draft into the user's Firestore collection without data loss.

---

## 3. Dashboard & Invite Management

The Authenticated User Dashboard (`/dashboard`) provides a centralized, high-clarity workspace for managing the complete lifecycle of all owned Invites.

### Dashboard Organization & Navigation

```text
Dashboard (/dashboard)
 ├── All Invites (/dashboard/invites)
 ├── Drafts (/dashboard/drafts)
 ├── Published (/dashboard/published)
 ├── Expired (/dashboard/expired)
 └── Account / Settings (/dashboard/account)
```

### Section Breakdown & Lifecycle Filtering

| Section | Scope & Criteria | Primary Actions Available |
| :--- | :--- | :--- |
| **Drafts** (`/dashboard/drafts`) | Private, unpublished working invites currently being designed. Autosaved and backed up. | **Edit / Resume**, **Duplicate / Copy to New**, **Delete Draft** |
| **Published** (`/dashboard/published`) | Live, verified, publicly accessible microsites within active validity period. | **View Live**, **Copy URL**, **Share**, **QR Code**, **Analytics**, **Free Text Correction**, **Extend Validity**, **Delete** |
| **Expired** (`/dashboard/expired`) | Previously published invites whose hosting period has elapsed. Public page shows expired state. | **Extend Validity** (Reactivate), **Copy to New** (Create fresh editable draft), **Delete** |
| **Trash / Recovery** | Soft-deleted invites retained for 30-day safety period. | **Recover / Restore**, **Permanently Delete** |

### Context-Aware Invite Action Menu
Depending on the Invite's exact lifecycle state, the UI exposes contextual actions:
* `Open / Preview`: Opens the live viewer or preview renderer.
* `Edit Canvas`: Reopens the full visual editor (for Drafts).
* `Quick Text Edit`: Allows free minor text/typo adjustments on Published Invites.
* `Share / Copy Link`: Copies the canonical public URL with instant feedback toast.
* `QR Generator`: Opens QR download and printable asset modal.
* `Analytics`: Opens visitor view counts and RSVP submission tallies.
* `Extend Validity`: Opens hosting renewal modal (₹14/30d Basic, ₹99/30d Premium, ₹999 Lifetime).
* `Copy to New`: Clones all design elements and pages into an independent new Draft with a distinct ID.
* `Delete`: Prompts for confirmation before moving to soft-deleted status.
