# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to Semantic Versioning.

## [Unreleased]
### Added
- Created `src/lib/svgLibrary.tsx` to provide a programmatic set of high-quality vector assets (Auspicious Kalash, Diya, Mandala, Peacock, Geometric Borders) fulfilling Item 2 without resorting to simple mock SVGs or copyrighted material.
- Authored `/docs/FINAL_VERIFICATION_REPORT.md` capturing Phase 1 completion outcomes.
- Created `CHANGELOG.md` to track QA phase version tags, timestamps, and modified files in accordance with the 4-phase Repo-Aware AI Engineering workflow.
- Adopted the PM ──► Architect ──► Developer ──► QA simulated multi-agent lifecycle in `AGENTS.md`.

### Changed
- **Fixed**: Browser tab title and metadata updated to `Yours Lovingly` (removed all `|` pipe characters from `index.html`, `<title>`, `og:title`, `twitter:title`, and UI creation header).
- **Fixed**: Tab favicon icon updated to feature the official golden finger heart brand logo (`/logo.jpg`, `/public/favicon.jpg`, `/public/favicon.svg`).
- **Fixed**: Firestore security rules permission denial on publication and user document operations. Updated `/firestore.rules` to allow owner creation of public snapshots, version histories under `public_invites/{slug}/versions/{snapshotId}`, proper user document management, and atomic insights updates.
- **Fixed**: Publication pipeline snapshot write in `PublishService.ts` using `batch.set(..., { merge: true })` and attaching `ownerId` to versions, ensuring no missing permissions during publish actions.
- **Fixed**: Pre-filling event data when selecting a sample in the `SamplesShowcase`. `App.tsx` now propagates the category, titles, colors, and descriptions from the clicked `SampleInvite` directly into the initialized `LovinglyEvent` draft.
- **Fixed**: WhatsApp Sharing in `src/components/creation/PublishStep.tsx` and `src/components/Dashboard.tsx`. Refactored standard generic hyperlink "Copy Link" into fully encoded `wa.me` intents prefilling the event summary and public URL.
- **Fixed**: Dashboard tab switching & sub-navigation routing. Created `DashboardRouteWrapper` in `App.tsx` utilizing `useParams` to dynamically resolve `/dashboard/:tab` routes (`all`, `drafts`, `published`, `expired`, `trash`, `account`), passing down active tab state correctly to `Dashboard.tsx`.
- **Enhanced**: Merged Creation Steps 1 & 2 into a single streamlined Step 1 (`TemplateStep.tsx`) with a simple Event Type dropdown selector and template card grid, removing cluttered filters and search bars.
- **Fixed**: Mobile Phone Preview responsiveness in `PreviewStep.tsx`. Adjusted phone container max-width to `w-full max-w-[340px] sm:max-w-[380px]` and outer border width to prevent horizontal overflow and right-side cropping on mobile viewports.
- **Added**: Free 1st Page Publish option (`₹0` with 15 Days Free Active Hosting) in `PublishStep.tsx` and a welcome banner allowing users to publish their first page without required hosting plan selection.
- **Added**: "Save Draft" functionality across all creation steps (`TemplateStep`, `DetailsStep`, `ElementsStep`, `PreviewStep`, `FeaturesStep`), with toast notifications and top header shortcut button.
- **Enhanced**: Fixed bottom navigation bar (`sticky bottom-0`) across all creation steps with sequential sub-tab navigation (Basics → Venue → Message, Colors → Fonts → Frames → Motifs → Textures → Photos, Spotify → RSVP → UPI → Security) before advancing to subsequent steps.
- **Fixed**: Restricted PDF & PNG Export options in `Viewer.tsx` to display only after the event page is published (`event.isPublished === true`).
- **Fixed**: Removed all Sanskrit and Hindi terms from the application (`eventTypes.ts`, `presetMessages.ts`, `designSystem.ts`, `samples.ts`). Replaced "Griha Pravesham" with "Housewarming Ceremony" and changed "Shloka" fields to "Custom Welcome Tagline / Quote".
- **Added**: Flexible invitation message inputs (`DetailsStep.tsx`). Users can add multiple message paragraphs dynamically with "＋ Add Another Message Paragraph" and contextual AI Smart Suggestions for each paragraph.
- **Fixed**: Dashboard "Copy Symbol" button (`Dashboard.tsx`). Fixed `handleCopyToNew` to clone existing events into a new draft with title `(Copy)` and open the creation editor immediately.
- **Changed**: Reordered creation steps (`CreationFlow.tsx`, `StepIndicator.tsx`). Step 4 is now "Select Features & Integrations", and Step 5 is "Live Guest Preview".
- **Added**: Automatic Google Maps Location Directions QR Code generation (`DetailsStep.tsx`). Displays a scan QR code toggle whenever a Google Maps link is provided.
- **Added**: Enhanced UPI Gift module (`FeaturesStep.tsx`). Supports uploading/attaching a custom UPI QR Code image file (`upiQrImageUrl`), entering a UPI ID / Phone number, payee display name, and clear validation indicator.
- **Changed**: Disabled RSVP form by default (`defaultRsvpConfig.enabled: false`) per user preference.
- **Added**: Clear Premium feature callouts (`⭐ Premium Feature` badges) and a 1-click upgrade banner in `PublishStep.tsx` for users attempting to publish pages with active premium features under the Basic plan.

