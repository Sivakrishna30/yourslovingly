# Yours Lovingly 🫰♥

Yours Lovingly is a premium personal event microsite and memory-page builder. It allows users to build beautiful, personalized websites for birthdays, weddings, baby showers, and other milestones, and share them securely using Google Drive integration.

## Key Features

- **Event Creator & Editor Flow**: Customize colors, templates, decoration elements, custom event types, and page backgrounds with real-time live preview.
- **Story Blocks**: Drag-and-drop ordered layout composed of custom text messages and photos (up to 10 compressed photos).
- **Google Drive Publishing & Sharing**:
  - Save pages as creator‑owned JSON database files on your Google Drive.
  - Choose visibility access: **Anyone with link** (ads shown) or **Restricted** (ad‑free, invite‑only).
- **Spotify Music Integration**: Paste any Spotify song, track, or playlist link to embed a native player directly onto the public memory page.
- **SEO Optimization**: Dynamically generates rich title tags, meta descriptions, and keywords optimized for individual events.
- **Smart Validation**: Enforces page integrity by requiring event title, recipient name, future‑or‑today dates, and photo limit checks.
- **Premium UX Polish**: Full mobile responsiveness, feedback toast notifications, copy‑to‑clipboard actions, and micro‑animations (card hover shifts, button glows, and card slide‑ins).

## Tech Stack

- **Core**: React 18, TypeScript, Vite
- **Styling**: Pure CSS (harmonious gradients, modern typography, glassmorphism, responsive media queries)
- **Backend & Auth**: Firebase Auth (Google Sign‑In with Google Drive scopes)

## Advertising & Monetization

- **Free Plan**: One memory page with ads displayed via **Google AdSense**. Ads appear in the top and bottom slots of the page (`AdSlot` component).
- **Premium Plan (₹499 – one‑time)**: Unlocks **15 ad‑free memory pages** permanently. No subscription, no auto‑renewal.
- **Extra Page Add‑on (₹49 – one‑time)**: Purchase additional ad‑free page slots. Stackable, no recurring billing.
- **Cancellation / Refund Policy**: All purchases are **one‑time and non‑refundable**. No cancellations are required because there are no recurring charges.

## Static Informational Pages

To comply with Google Ad Services (AdSense) publisher guidelines, the following pages are built-in:
- **About Us (`/about`)**: Explains Yours Lovingly's mission, privacy-preserving client-side and Google Drive-backed architecture, and plan choices.
- **Contact (`/contact`)**: Support details, refund/cancellation coordination, and data abuse reporting links to `unpredictable.knucklehead.era@gmail.com`.
- **Terms & Security Policy (`/terms`)**: Explains data security, scope of restricted Google Drive files access, refund guidelines, and user responsibility rules.

## Development

To run the application locally:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` file based on `.env.example` with your Firebase API and Google APIs credentials, **including your Google AdSense IDs**:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GOOGLE_API_KEY=your_google_api_key
   VITE_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
   VITE_ADSENSE_TOP_SLOT_ID=1234567890
   VITE_ADSENSE_BOTTOM_SLOT_ID=0987654321
   ```

3. **Start the local dev server**:
   ```bash
   npm run dev
   ```

4. **Verify Type System & Code Quality**:
   ```bash
   npx tsc --noEmit
   npm run lint
   ```

---

*All payments are one‑time, non‑recurring, and ad‑free for premium tiers. See the Terms page for full policy details.*
