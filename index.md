# Project Documentation Index (`index.md`)

This index maps all documentation, architecture guides, configuration files, agent instructions, and key modules for the application to provide immediate context to the AI agent.

---

## 0. AI Agent Operating Rules & Operating System (`/docs/AGENT_INSTRUCTIONS.md`)
**Operating rules for AI coding agents working on the Yours Lovingly repository:**
- **`AGENTS.md`**: Permanent persistent coding contract, stack rules, anti-slop guidelines, and 12 core concepts.
- **`/docs/AGENT_INSTRUCTIONS.md`**: Master Engineering Workflow Standard (Sections 1–48). Covers:
  - **Source-of-Truth Hierarchy**: Approved Product Specs > Technical Architecture > Current Code > Task Acceptance > Tests > Task Instructions.
  - **12 Core Concepts**: Context Management, Task Decomposition, Spec-First Dev, Repo Awareness, Planning, Small Iterative Changes, AI Code Review, Test/Verification, Debugging with Evidence, Git Workflow, Docs as Memory, Knowing When NOT to Trust AI.
  - **Agent Skills & Specialist Roles**: Planning Agent, Coding Agent, Test Agent, Review Agent, Debug Agent.
  - **AI Stop Conditions**: Halting on requirement conflicts, missing specs, destructive migration, security rule edits, payment/entitlement changes, or unknown repository state.
  - **Definition of Done**: 13-point task completion checklist.
  - **Golden Rules**: Read specs before coding, inspect repo first, plan before edits, test every change, review diff critically, evidence before explanation.

---

## 1. Technical Architecture & Engineering Specifications (`/docs/TECHNICAL_ARCHITECTURE.md`)
Canonical phase-1 technical source of truth:
- **`TECHNICAL_ARCHITECTURE.md`**: Complete domain model (Invite → Pages → Elements), Firestore collection schemas, publication attempts & idempotency, entitlement & payment verification model, asset storage & optimization, rendering architecture, route architecture & refresh safety, error codes, and migration strategy.

---

## 2. Product Documentation & Specifications (`/docs/product/`)
Whenever the AI agent needs clarification on product rules, business logic, or feature scopes, refer directly to these canonical specifications:
- **`01_overview_and_audience.md`**: Product overview, core vision, problem statement, target audiences (events, businesses, creators), and core value proposition.
- **`02_page_types_and_creation.md`**: Supported page types (invitations, business cards, flyers, portfolios), 10 event types, custom event names, creation flow, and template-first philosophy.
- **`03_design_and_element_model.md`**: Element-based hierarchy (no section abstraction), element independence, multi-page support, element styling/controls, and preview/remove premium workflows.
- **`04_features_and_publishing.md`**: Feature matrix (Free vs. Premium: Maps, QR, Spotify, RSVP, UPI, Insights, Password Protection), publishing lifecycle rules, post-publication copy flows, URL models, and export/sharing.
- **`05_lifecycle_and_monetization.md`**: Hosting rules (15-day initial, 30-day extensions, ₹999 lifetime), 30-day deleted page recovery, draft limits, account transfers, non-expiring page pack credits, and complete ₹ pricing table.

---

## 3. UI / UX Product Flow Specifications (`/docs/ui-flow/`)
Canonical end-to-end user experience and screen flow specifications:
- **`README.md`**: Directory overview and modular chapter mapping.
- **`00_product_flow_overview_and_philosophy.md`**: Core design principles (Freedom, Transparency, Flexibility), route structure, and navigation contracts.
- **`01_landing_and_authentication.md`**: Landing page architecture, sample showcases, zero-barrier guest creation, and user dashboard organization.
- **`02_creation_journey_and_templates.md`**: Event type selection, template preview/snapshot independence, generic details configuration, and media handling.
- **`03_elements_and_canvas_composition.md`**: Unified element-based architecture, element panel discovery, universal transforms, interactive components as native elements, and multi-page invite models.
- **`04_preview_and_element_editing.md`**: Live preview experience, optional element-by-element sequential review, canvas interaction ergonomics, and continuous autosave.
- **`05_interactive_features_and_rsvp.md`**: Interactive features configuration, basic/custom RSVP system, Spotify/Maps/QR integrations, and privacy-first analytics.
- **`06_publishing_pricing_and_verification.md`**: Publishing review, straightforward pricing model (₹49 Basic, ₹99 Premium, ₹14/₹99 Extensions, ₹999 Lifetime), deterministic URL verification, and safe republishing.
- **`07_lifecycle_post_publication_and_recovery.md`**: Post-publication editing rules, expiry vs. deletion, copy-to-new cloning, soft recovery, global error resilience matrix, and master end-to-end workflow diagram.

---

## 4. Design System & Element Specifications (`/docs/design-system/`)
Contains architectural rules and design models for native elements, element instances, and asset lifecycles:
- **`01_element_specification.md`**: Master Element Definitions vs. Instances, Parent-Child inheritance model, 12 Core Visual Types (Text, Image, SVG, Shape, Line, Icon, Frame, Table, Chart, GIF, Video, Audio), 6 Interactive Components (Gallery, Spotify, Maps, RSVP, UPI, QR), Creation modes (Asset Upload, Native Builder, AI Creation), validation & optimization, ownership & global publishing, and retired element protection.

---

## 5. Template System Specifications (`/docs/templates/`)
Contains specifications for template models, element compositions, placeholders, and snapshot instantiation:
- **`01_template_system_specification.md`**: Reusable design blueprints composed of native elements, Page instantiation vs. Templates, multi-page support, semantic placeholders (`{{bride_name}}`, `{{venue}}`), snapshot isolation, and safe element/template retirement models.

---

## 6. Core Configuration & Setup
- `AGENTS.md`: Permanent coding contract, stack rules, AI stop conditions, and 12 core AI concepts.
- `metadata.json`: App name, description, frame permissions, and major capabilities.
- `package.json`: Dependency manifests and scripts (`dev`, `build`, `start`).
- `.env.example`: Required environment variables template.
- `firebase-applet-config.json` & `firebase-blueprint.json`: Firebase project configuration.
- `firestore.rules`: Firestore database security rules.

---

## 7. Source Code Architecture (`/src`)
- `App.tsx`: Main application entry component and view router.
- `main.tsx`: React DOM mount point.
- `types.ts`: Global TypeScript interfaces and data models.
- `firebase.ts` & `src/lib/firebase-service.ts`: Firebase initialization and cloud Firestore/Auth operations.
- `lib/constants.ts`, `designSystem.ts`, `hosting.ts`, `presetMessages.ts`, `utils.ts`: Utility helpers, theme design tokens, and shared constants.

---

## 8. UI Components (`/src/components`)
- `Dashboard.tsx`: Main user dashboard and overview.
- `Landing.tsx`: Welcome / landing screen.
- `Editor.tsx`: Content editing module.
- `Viewer.tsx`: Content viewing module.
- `StudioInspector.tsx`: Inspector tooling for customization.
- `DecorativeOrnaments.tsx`: Visual assets and decorative elements.
- `InsightsModal.tsx`, `HostingRenewalModal.tsx`, `SmartMessageSuggestion.tsx`: Interactive modals and smart helpers.
