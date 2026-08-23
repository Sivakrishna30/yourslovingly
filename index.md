# Project Documentation Index (`index.md`)

This index maps all documentation, architecture guides, configuration files, and key modules for the application to provide immediate context to the AI agent.

## 1. Core Configuration & Setup
- `metadata.json`: App name, description, frame permissions, and major capabilities.
- `package.json`: Dependency manifests and scripts (`dev`, `build`, `start`).
- `.env.example`: Required environment variables template.
- `firebase-applet-config.json` & `firebase-blueprint.json`: Firebase project configuration.
- `firestore.rules`: Firestore database security rules.

## 2. Source Code Architecture (`/src`)
- `App.tsx`: Main application entry component and view router.
- `main.tsx`: React DOM mount point.
- `types.ts`: Global TypeScript interfaces and data models.
- `firebase.ts` & `src/lib/firebase-service.ts`: Firebase initialization and cloud Firestore/Auth operations.
- `lib/constants.ts`, `designSystem.ts`, `hosting.ts`, `presetMessages.ts`, `utils.ts`: Utility helpers, theme design tokens, and shared constants.

## 3. UI Components (`/src/components`)
- `Dashboard.tsx`: Main user dashboard and overview.
- `Landing.tsx`: Welcome / landing screen.
- `Editor.tsx`: Content editing module.
- `Viewer.tsx`: Content viewing module.
- `StudioInspector.tsx`: Inspector tooling for customization.
- `DecorativeOrnaments.tsx`: Visual assets and decorative elements.
- `InsightsModal.tsx`, `HostingRenewalModal.tsx`, `SmartMessageSuggestion.tsx`: Interactive modals and smart helpers.
