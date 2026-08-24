# 02 - Monetization Philosophy & User Model

## 1. Purpose & Scope
This document defines the core monetization principles, user entitlement model, and terminology foundation for Yours Lovingly.
- Focuses on product-level behavior, user identity, and value-based pricing.
- Excludes payment-gateway integration, database schemas, webhooks, and billing infrastructure.

---

## 2. Core Monetization Philosophy
Yours Lovingly monetizes **meaningful product value**, never ordinary creative freedom.

### Unrestricted Creative Operations (Always Free)
Users are never charged for:
- Moving, resizing, or rotating canvas elements
- Changing typography, decorative styles, or colors
- Arranging layers, alignment, and z-index ordering
- Creating layout variations and design iterations

### What Users Pay For
- **Publishing an Invite**: Hosting and provisioning a live, public microsite
- **Premium Invite Capabilities**: Advanced interactive components (Google Maps, Location QR, RSVP, UPI QR)
- **Premium Templates**: Exclusive curated designer templates
- **Downloadable Output**: High-res Image and multi-page PDF exports
- **Additional Published Invites**: Capacity to host multiple concurrent live events

> **Guiding Principle**: *Users pay for publishing capacity and value-added capabilities, not for creative freedom.*

---

## 3. Account Model (No Permanent Subscription)
- **Single Unified Account**: No permanent "Free User" vs. "Paid User" identity.
- **Pay-Per-Invite**: Users purchase individual Invite entitlements as needed.
- **Zero Mandatory Subscriptions**: No recurring monthly or annual commitments.
- **Exploration Allowed**: Anyone can create and preview Draft Invites without entering payment information or subscribing.

---

## 4. Invite vs. Page Terminology
- **Invite**: The complete user-owned invitation product/microsite.
- **Page**: An individual editable canvas inside an Invite (e.g., Cover, Event Details, Gallery, Venue, RSVP).
- **Draft Invite**: Private, editable working canvas.
- **Published Invite**: Live, verified, publicly accessible microsite.
- **Expired Invite**: Previously published Invite whose hosting duration has elapsed.

---

## 5. Draft Creation Freedom & Storage Policy
- **No Product-Level Count Restriction**: Users can create drafts freely to explore templates, experiment with layouts, compare designs, and test before publishing.
- **Lightweight Draft Data**: Drafts store structured JSON definitions (element references, coordinate positions, text overrides, styling tokens).
- **Asset Storage Policies**: High-resolution photos and uploaded media are managed via independent platform infrastructure limits, never as creative roadblocks in the editor.
