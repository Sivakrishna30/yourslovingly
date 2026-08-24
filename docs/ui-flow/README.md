# Yours Lovingly — Complete Product UI Flow Specification

This directory contains the canonical UI / UX Product Flow Specification for **Yours Lovingly**, broken down into modular chapters for development, review, and iteration.

## Document Directory

1. **[`00_product_flow_overview_and_philosophy.md`](./00_product_flow_overview_and_philosophy.md)**
   - Core Principles: Freedom, Transparency, Flexibility
   - Complete Product Flow & Route Map
   - Global Navigation Principles & Refresh State Persistence
   - Product-Level State Model

2. **[`01_landing_and_authentication.md`](./01_landing_and_authentication.md)**
   - Landing Page Structure & Core Questions
   - Samples Showcase & Value Propositions
   - Zero-Barrier Guest Creation vs. Authenticated Workflows
   - User Dashboard & Section Breakdown (Drafts, Published, Expired)

3. **[`02_creation_journey_and_templates.md`](./02_creation_journey_and_templates.md)**
   - Entry Point & Event Type Selection
   - Template Recommendation & Blank Canvas Option
   - Template Preview & Snapshot Isolation
   - Generic & Extensible Invite Details Fields
   - Live Default Values, Date/Time Formats & Image Handling

4. **[`03_elements_and_canvas_composition.md`](./03_elements_and_canvas_composition.md)**
   - Unified Element-Based Composition (Everything is an Element)
   - Element Discovery & Categorized Palette
   - Universal Direct-Manipulation Transformations
   - Interactive Components as Native Elements
   - Multi-Page Architecture (Invite vs. Page distinction)
   - Zero Creative Locking Principles

5. **[`04_preview_and_element_editing.md`](./04_preview_and_element_editing.md)**
   - Interactive Live Preview Experience
   - Optional Sequential Element-by-Element Stepper (1/N, Prev/Next)
   - Direct Canvas Selection & Accidental Click Guarding
   - Continuous Autosave & Route Hydration

6. **[`05_interactive_features_and_rsvp.md`](./05_interactive_features_and_rsvp.md)**
   - Interactive Features Setup Screen
   - Basic vs. Custom RSVP Form Configuration
   - Spotify Audio, Google Maps Navigation & QR Codes
   - Privacy-Focused Analytics & Host Reporting

7. **[`06_publishing_pricing_and_verification.md`](./06_publishing_pricing_and_verification.md)**
   - Publishing Review & Tier Comparison
   - Transparent Pricing Table (₹49 Basic, ₹99 Premium, ₹14/₹99 Extensions, ₹999 Lifetime)
   - Premium Scope Boundaries
   - Payment Execution & Deterministic URL Verification
   - Canonical URL Stability & Safe Republishing Architecture

8. **[`07_lifecycle_post_publication_and_recovery.md`](./07_lifecycle_post_publication_and_recovery.md)**
   - Post-Publication Free Text Corrections vs. Design Locks
   - Expiry vs. Deletion Lifecycle
   - Validity Extensions & Reactivation
   - `Copy to New` Independent Cloning
   - 30-Day Trash & Soft Recovery
   - Global Error Resilience Matrix
   - Master End-to-End Visual Flow Diagram
