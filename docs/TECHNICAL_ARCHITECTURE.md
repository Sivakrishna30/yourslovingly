# Yours Lovingly — Technical Architecture & Engineering Specification

**Product:** Yours Lovingly  
**Document:** Technical Architecture, Data Model, API Contracts & Engineering Specification  
**Status:** Phase 1 Technical Source of Truth  
**Audience:** Developers, coding agents, testers, reviewers and maintainers  
**Product-level sources:** Confirmed/Locked Specifications 02–06  
**Implementation reference:** Existing Sivakrishna30/yourslovingly repository on GitHub  
**Phase 1 scope:** Web application + reusable design system + templates + Invite lifecycle + publishing + basic interactive features  
**Explicitly deferred:** User-created/AI-created Elements, Element marketplace, advanced analytics, subscriptions, Creator/Pro bundles  

---

## 1. Purpose

This document translates the approved Yours Lovingly product specifications into an implementation-oriented technical model.

It defines:

• Current implementation baseline  
• Target application architecture  
• Domain model  
• Firestore data structure  
• Element and Template persistence  
• Invite/Page persistence  
• Draft/autosave model  
• Asset storage  
• Rendering model  
• Routing and refresh-safe navigation  
• Authentication and authorization  
• API/service boundaries  
• Publishing transaction  
• Entitlement/payment model  
• Expiry/deletion/recovery  
• Analytics and RSVP storage  
• Error handling  
• Observability  
• Testing requirements  
• Migration strategy  
• Engineering acceptance criteria  

This document does not redefine product behavior. Product behavior comes from the approved product specifications.

Where the existing code and product specification differ, the approved product specification wins and the existing implementation is treated as the migration baseline.

---

## 2. Source-of-Truth Hierarchy

### 2.0 Decision Authority

The final product specifications are authoritative even when the current prototype code contains an older or conflicting implementation.

The engineering rule is:

```text
Approved Product Specification
          ↓
Technical Architecture
          ↓
Implementation
          ↓
Prototype / legacy code
```

Prototype behavior must be migrated toward the approved product model; it must not redefine it.

The engineering team must use the following precedence order.

### 2.1 Product Specifications

The confirmed product specifications are authoritative for behavior:

1. `02-design-system-and-element-specification.md`
2. `03-template-system-specification.md`
3. `04-page-invite-system-specification.md`
4. `05-publishing-lifecycle-specification.md`
5. `06-pricing-monetization-entitlements-specification.md`

The documents explicitly mark these product decisions as confirmed/locked. The Element specification defines the reusable definition/instance/snapshot model. The Template specification defines reusable blueprints and independent Page snapshots. The Page/Invite specification defines the user-owned design, lifecycle, editing, Elements, Pages, analytics and interactive behavior. The Publishing specification defines verified publication, entitlement consumption, URL stability and lifecycle. The Monetization specification defines the current commercial model.

### 2.2 Existing Repository

The GitHub repository is the implementation reference only.

It represents the current prototype/working implementation and must not override approved product decisions.

The current repository includes React/TypeScript/Vite UI, Firebase initialization, Firestore services, Editor, Dashboard, Viewer, hosting utilities, design system, Firestore rules and related configuration.

### 2.3 Conflict Rule

When code conflicts with the approved product specifications:

> Keep the desired product behavior from the specification and migrate the implementation toward it.

Do not preserve prototype behavior merely because it already exists in code.

---

## 3. Existing Implementation Baseline

Repository reviewed:

`Sivakrishna30/yourslovingly`

Current implementation characteristics include:

• React + TypeScript + Vite frontend  
• Vercel deployment  
• Firebase Authentication  
• Google sign-in  
• Cloud Firestore  
• Firebase Storage initialization  
• Browser-side Firestore service  
• Custom pathname routing in App.tsx  
• LovinglyEvent as a large aggregate model  
• published_events/{slug} public collection  
• RSVP and transaction subcollections  
• Lightweight page-view analytics  
• Existing Template/Design System  
• Existing Studio/Element inspector  
• Existing Editor/Viewer/Dashboard components  

The repository package configuration confirms React/TypeScript/Vite and Firebase dependencies. The Firebase initialization confirms Firebase Auth, Firestore and Storage are configured in the application.

---

## 4. Current-Code Findings

### 4.1 Routing

Current App.tsx contains a hand-written pathname router.

Current behavior includes:

• `/` resolves to Home for guests  
• `/` resolves to Dashboard for authenticated users  
• `/dashboard` resolves to Dashboard  
• viewer routes are inferred from path segments  
• Editor Back currently pushes `/`  

This conflicts with the approved requirement:

> Every meaningful UI screen must have its own stable route, refresh must preserve the route, and Back must return to the previous meaningful state rather than blindly navigating Home.

The router must therefore be replaced or substantially strengthened.

### 4.2 Draft Initialization

Current `createBlankEvent()` creates an object with publication/hosting fields populated immediately. A new draft must not be represented as already published or already publication-dated.

Draft creation must produce:

```text
status = draft
publishedAt = null
publicationId = null
expiresAt = null
```

Publication timestamps are created only during successful publication.

### 4.3 Current Publish Operation

Current `handlePublishAndSave()` marks `isPublished = true` and writes the object. This is not the final publication transaction defined by product specifications.

The final implementation must instead:

```text
Draft
→ publication request
→ entitlement verification
→ snapshot creation
→ public representation
→ URL verification
→ successful publication
```

The public state must not be considered successful merely because a Firestore write completed.

### 4.4 Current Monolithic Event Document

The current service persists a complete `LovinglyEvent` object under one Firestore document.

This is suitable for the prototype but is not the preferred Phase-1 production model for:

• Multi-page Invites  
• Large Element sets  
• Per-Element editing  
• Template references  
• Independent snapshots  
• Asset references  
• Publication versions  

The target design therefore decomposes the domain into Invite → Pages → Element Instances.

### 4.5 Existing Security Rules

Current Firestore rules contain overly broad public mutation capabilities.

Notable examples:

• Public insight documents allow unrestricted writes.  
• Transaction documents are publicly readable.  
• Signed-in users can update/delete transaction records without ownership checks.  
• Signed-in users can update/delete RSVP records without ownership/role checks.  
• Published event documents are directly writable from the browser.  

These rules must be redesigned before production use of payment-sensitive or guest-sensitive data.

### 4.6 Legacy Commercial Model

The repository still contains older pricing concepts such as Pro Creator Pack / ₹499 and older hosting extension values.

Those are legacy implementation values and are not part of the current approved model.

The approved monetization specification explicitly rejects Creator/Pro bundles, user-facing Page Slot arithmetic and subscriptions.

---

## 5. Target Architecture

The target architecture remains intentionally small.

```text
                   ┌──────────────────────┐
                   │      Vercel          │
                   │ React + TypeScript   │
                   └──────────┬───────────┘
                              │
          ┌───────────────────┼──────────────────┐
          │                   │                  │
          ▼                   ▼                  ▼
 Firebase Auth          Firestore           Firebase Storage
 Google Sign-In         Application Data     Binary Assets
          │                   │                  │
          └───────────────────┼──────────────────┘
                              │
                              ▼
                 Trusted Firebase Server Layer
                 ┌────────────────────────────┐
                 │ Publish / Entitlement      │
                 │ Payment Verification       │
                 │ Reconciliation             │
                 │ Expiry Jobs                │
                 │ Protected Operations       │
                 └────────────────────────────┘
```

### 5.1 Core services

**Vercel**
Responsible for:
• Frontend hosting  
• SPA delivery  
• Static assets  
• Frontend deployment  

**Firebase Authentication**
Responsible for:
• User identity  
• Google sign-in  
• Current user session  
• Firebase ID tokens  

**Cloud Firestore**
Responsible for:
• User accounts/profile metadata  
• Invites  
• Pages  
• Element definitions  
• Element instances  
• Templates  
• Publication records  
• Entitlements  
• RSVP data  
• Lightweight analytics  

**Firebase Storage**
Responsible for:
• Uploaded photos  
• User assets  
• Managed SVG/PNG/WebP/GIF files  
• Generated export binaries when required  

**Firebase Functions / trusted Google backend**
Used only when browser-side trust is insufficient:
• Payment verification  
• Publication finalization  
• Publication reconciliation  
• Entitlement mutation  
• Expiry processing  
• Privileged administration  
• Protected asset processing  

There is no requirement to create a large REST backend for ordinary CRUD.

---

## 6. Application Architecture

Recommended frontend code organization:

```text
src/
├── app/
│   ├── router/
│   ├── routes/
│   └── providers/
│
├── components/
│   ├── landing/
│   ├── dashboard/
│   ├── editor/
│   ├── preview/
│   ├── viewer/
│   ├── elements/
│   └── common/
│
├── domain/
│   ├── invite/
│   ├── page/
│   ├── element/
│   ├── template/
│   ├── publication/
│   ├── entitlement/
│   └── analytics/
│
├── data/
│   ├── firestore/
│   ├── storage/
│   └── repositories/
│
├── services/
│   ├── publication/
│   ├── payment/
│   ├── assets/
│   └── analytics/
│
├── lib/
├── types/
└── utils/
```

The exact folder naming can vary. The architectural boundary matters more than the exact path.

---

## 7. Domain Model

### 7.1 Invite
An Invite is the complete user-owned design/product.
It can contain:
• One or more Pages  
• Content/Data  
• Element Instances  
• Interactive Feature configuration  
• Publication state  
• Public identity  
• Analytics reference  

### 7.2 Page
A Page is an individual editable canvas inside an Invite.

### 7.3 Element Definition
Reusable master definition.
It contains:
• Identity  
• Type  
• Classification  
• Asset reference  
• Default configuration  
• Capabilities  
• Ownership  
• Status  
• Version metadata  

It must not contain page-specific placement.

### 7.4 Element Instance
The instance represents one usage of a reusable Element on a Page.
It contains:
• Instance ID  
• Definition ID  
• Page ID  
• Position  
• Size  
• Rotation  
• Layer order  
• Instance-specific overrides  
• Resolved configuration when necessary  

### 7.5 Template
Reusable design blueprint composed of Element configurations.

### 7.6 Publication
A verified public representation of an Invite at a point in time.

---

## 8. Firestore Collection Model

Recommended target structure:

```text
users/{uid}

users/{uid}/invites/{inviteId}
users/{uid}/invites/{inviteId}/pages/{pageId}
users/{uid}/invites/{inviteId}/pages/{pageId}/elements/{elementInstanceId}

templates/{templateId}
templates/{templateId}/pages/{pageId}
templates/{templateId}/pages/{pageId}/elements/{elementId}

elements/{elementDefinitionId}

public_invites/{inviteId}
public_invites/{inviteId}/versions/{publicationId}

public_invites/{inviteId}/rsvps/{rsvpId}
public_invites/{inviteId}/insights/{bucketId}

publication_attempts/{attemptId}

entitlements/{entitlementId}
```

---

## 9. Invite Document Schema

Recommended conceptual schema:

```ts
interface Invite {
  id: string;
  ownerId: string;

  title: string;
  eventType: string;
  customEventType?: string;

  status: 'draft' | 'publishing' | 'published' | 'expired';

  sourceTemplateId?: string | null;

  currentPublicationId?: string | null;
  canonicalSlug?: string | null;

  visibility: 'public' | 'protected';
  copyPermission: 'allowed' | 'disabled';

  createdAt: Timestamp;
  updatedAt: Timestamp;

  publishedAt?: Timestamp | null;
  expiresAt?: Timestamp | null;

  pricingTier?: 'basic' | 'premium';
  premiumFeatures?: string[];

  pageOrder: string[];

  featureSummary?: {
    rsvp?: boolean;
    spotify?: boolean;
    maps?: boolean;
    countdown?: boolean;
    qr?: boolean;
    upi?: boolean;
  };

  deletedAt?: Timestamp | null;
  deletionPurgeAt?: Timestamp | null;
}
```

This is conceptual. Field names may change during implementation but the responsibilities must remain.

---

## 10. Page Document Schema

```ts
interface InvitePage {
  id: string;
  inviteId: string;

  order: number;
  title?: string;

  background: BackgroundConfig;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

Background configuration can contain:

```ts
interface BackgroundConfig {
  type: 'color' | 'gradient' | 'image' | 'svg' | 'pattern';
  value?: string;
  assetId?: string;
  settings?: Record<string, unknown>;
}
```

---

## 11. Element Definition Schema

```ts
interface ElementDefinition {
  id: string;
  name: string;
  version: string;

  type:
    | 'text'
    | 'image'
    | 'svg'
    | 'shape'
    | 'line'
    | 'icon'
    | 'frame'
    | 'table'
    | 'chart'
    | 'gif'
    | 'video'
    | 'audio';

  category: string;
  subcategory?: string;

  tags: string[];
  keywords: string[];
  eventCategories: string[];

  colors?: string[];
  colorValues?: string[];

  asset?: AssetReference | null;

  defaultConfig: Record<string, unknown>;
  capabilities: ElementCapabilities;

  ownerType: 'system' | 'user';
  ownerId?: string;

  visibility: 'private' | 'global';
  status: 'active' | 'retired';

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

Semantic roles such as `bride_name`, `groom_name`, `event_date` are data bindings/roles, not new renderer types.

---

## 12. Element Instance Schema

```ts
interface ElementInstance {
  id: string;

  pageId: string;
  elementDefinitionId: string;

  role?: string;

  order: number;
  zIndex: number;

  position: {
    x: number;
    y: number;
  };

  size: {
    width: number;
    height: number;
  };

  rotation: number;

  overrides: Record<string, unknown>;

  resolvedConfig?: Record<string, unknown>;

  responsive?: {
    desktop?: Record<string, unknown>;
    tablet?: Record<string, unknown>;
    mobile?: Record<string, unknown>;
  };

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

Instances store the values that differ from the reusable definition where practical. Parent defaults + instance overrides resolve to the final configuration. At snapshot time, the resolved configuration becomes self-sufficient.

---

## 13. Element Capabilities

Capabilities describe what the editor is allowed to do with a particular Element type.

Example:

```ts
interface ElementCapabilities {
  move: boolean;
  resize: boolean;
  rotate: boolean;
  duplicate: boolean;
  delete: boolean;

  opacity?: boolean;
  visibility?: boolean;
  layer?: boolean;

  flipX?: boolean;
  flipY?: boolean;

  crop?: boolean;
  shadow?: boolean;
  border?: boolean;

  typography?: boolean;
  color?: boolean;

  animation?: boolean;
  responsive?: boolean;
}
```

Capabilities are not the same as behavior.

• Capabilities = what editing operations are available.  
• Behavior = what the Element actually does when rendered/interacted with.  

---

## 14. Interactive Components

Interactive components remain a separate product-level configuration category:

• Gallery  
• Spotify  
• Maps  
• RSVP  
• UPI  
• QR  
• Countdown  

However, when placed on a Page and shown in Preview, they are represented as Element instances for visual editing.

Therefore:

```text
Interactive Feature Definition
        ↓
Page Element Instance
        ↓
Position / Size / Layer / Style
        ↓
Interactive Renderer
```

A Spotify, Map, QR or RSVP Element must not be hard-coded to a fixed position or fixed size unless a specific renderer property makes such a constraint technically necessary.

This directly preserves the approved product rule that interactive components are freely placeable in Preview.

---

## 15. Template Schema

Recommended conceptual model:

```ts
interface Template {
  id: string;

  name: string;
  description?: string;
  version: string;

  category: string;
  subcategory?: string;

  tags: string[];
  keywords: string[];

  eventCategories: string[];
  colors?: string[];

  ownerType: 'system' | 'user';
  ownerId?: string;

  visibility: 'private' | 'global';
  status: 'active' | 'retired';

  pricingTier?: 'basic' | 'premium';

  pageOrder: string[];

  previewAsset?: AssetReference;

  fields: TemplateFieldDefinition[];

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

## 16. Template Field Definition

Template fields are data bindings, not renderer types.

```ts
interface TemplateFieldDefinition {
  id: string;

  key: string;
  label: string;

  type:
    | 'text'
    | 'date'
    | 'time'
    | 'location'
    | 'image'
    | 'url';

  required: boolean;

  defaultValue?: unknown;

  role?: string;

  displayConfig?: Record<string, unknown>;

  order: number;
}
```

Example:

```text
key = event_date
type = date
role = event_date
```

The underlying visual element may still be:

```text
type = Text
```

The role is a binding, not a new Element type.

---

## 17. Template Instantiation

Template creation flow:

```text
Template
    ↓
Resolve Template Configuration
    ↓
Create Invite
    ↓
Create Pages
    ↓
Create Element Instances
    ↓
Resolve Defaults + Input Data + Overrides
    ↓
Save Draft
```

The resulting Invite/Page is independent of the Template.

Future Template changes do not modify the existing Invite.

---

## 18. Snapshot Model

At any point where independent rendering is required:

```text
Definition
+ Template Configuration
+ Instance Overrides
+ Current Data
        ↓
Resolved Configuration
        ↓
Snapshot
```

Snapshots are required for:

• Published versions  
• Stable Template instantiation  
• Protected historical state  
• Recovery where necessary  

---

## 19. Publication Snapshot

Publication should produce:

```ts
interface PublicationSnapshot {
  publicationId: string;
  inviteId: string;
  generatedAt: Timestamp;

  inviteMetadata: Record<string, unknown>;

  pages: Array<{
    pageId: string;
    pageOrder: number;
    background: BackgroundConfig;

    elements: Array<{
      instanceId: string;
      type: string;
      resolvedConfiguration: Record<string, unknown>;
      assetReference?: AssetReference;
      zIndex: number;
    }>;

    interactiveConfiguration: Record<string, unknown>;
  }>;

  renderingSchemaVersion: string;
}
```

The public renderer should never need to resolve live parent definitions to render a previously published version.

---

## 20. Publication Attempts

Each publish request gets an attempt record.

```ts
interface PublicationAttempt {
  id: string;

  inviteId: string;
  ownerId: string;

  idempotencyKey: string;

  requestedAt: Timestamp;

  status:
    | 'requested'
    | 'processing'
    | 'snapshot_created'
    | 'url_provisioning'
    | 'verifying'
    | 'succeeded'
    | 'failed'
    | 'unknown'
    | 'reconciled';

  publicationId?: string;
  publicUrl?: string;

  entitlementId?: string;

  errorCode?: string;
  errorMessage?: string;

  verifiedAt?: Timestamp;
  completedAt?: Timestamp;
}
```

This supports idempotency and reconciliation.

---

## 21. Idempotency

Double clicking Publish must not create two logical publications.

The client generates an idempotency key per logical publish attempt.

The server stores it with a unique/transactionally checked PublicationAttempt.

Repeated requests with the same key return the existing result.

Core invariant:

```text
One logical successful publication
        =
One successful publication entitlement consumption
```

This is explicitly required by the publishing specification.

---

## 22. Entitlement Model

The current product does not have a permanent “free user” / “paid user” account identity.

There is one user account with purchased Invite entitlements.

The approved monetization spec defines:

• First published Invite: Free  
• Additional Basic Invite: ₹49  
• Additional Premium Invite: ₹99  
• Basic → Premium upgrade: ₹49 additional  
• No monthly/yearly subscription  
• No Creator/Pro bundle in the current model  
• No Basic/Premium Element paywall  
• Download only for Premium  
• Published text-only corrections are free  
• Full design editing after publication is not offered, including as a paid feature  

> **Important:** Do not implement a user-facing “Page Slot” counter. Draft count is not reduced by publishing. Drafts are exploratory working objects and do not consume the published-Invite entitlement model.

---

## 23. Entitlement Schema

```ts
interface Entitlement {
  id: string;

  ownerId: string;

  inviteId?: string;

  type:
    | 'first_publish_free'
    | 'basic_publish'
    | 'premium_publish'
    | 'premium_upgrade';

  status:
    | 'available'
    | 'reserved'
    | 'consumed'
    | 'reversed'
    | 'expired';

  amountPaid: number;

  currency: 'INR';

  paymentReference?: string;

  createdAt: Timestamp;
  consumedAt?: Timestamp;

  publicationAttemptId?: string;
}
```

The exact payment provider record should be stored separately if necessary; Firestore entitlement state should be the product-facing authority after server verification.

---

## 24. Payment Architecture

The browser must not decide that money was successfully paid merely because a client callback fired.

Recommended flow:

```text
Client
  ↓
Create checkout request
  ↓
Trusted backend
  ↓
Payment provider
  ↓
Payment success/webhook
  ↓
Trusted verification
  ↓
Create/activate entitlement
  ↓
Return entitlement state
```

The same principle applies to Premium upgrades.

---

## 25. Publishing + Payment Ordering

Recommended transaction model:

```text
Draft
  ↓
User clicks Publish
  ↓
Determine Basic/Premium
  ↓
Check whether a valid entitlement already exists
  ├── Yes → continue
  └── No  → checkout/payment
  ↓
Server verifies entitlement
  ↓
Create publication attempt
  ↓
Create snapshot
  ↓
Provision public representation
  ↓
Verify public availability
  ↓
Publication succeeds
  ↓
Consume entitlement
```

The exact transaction strategy may use Firestore transactions plus trusted server-side state.

---

## 26. Failed Publication

Failed publication must preserve:

• Draft  
• User design  
• Existing published version if one exists  
• Applicable entitlement  

It must not incorrectly consume an entitlement.

User-facing message should be clear, for example:

> We couldn’t publish your Invite right now. Your publish entitlement was not consumed.

Internal logs should preserve technical diagnostics.

---

## 27. Unknown Publication Outcome

If the client loses connectivity after the server begins publication:

`unknown` must not immediately be mapped to success or failure.

Reconciliation should:

1. Find the publication attempt.
2. Check its server status.
3. Check the public URL.
4. Confirm whether the publication snapshot is accessible.
5. Resolve the result.
6. Consume or restore entitlement accordingly.

---

## 28. Republish

Republish uses the same Invite ID and canonical URL.

Flow:

```text
Published Invite
    ↓
Allowed edit flow / new unpublished changes
    ↓
Preview
    ↓
Republish
    ↓
Create new publication snapshot
    ↓
Verify new public version
    ↓
Switch current publication pointer
```

The old verified publication remains active until the new one is verified.

If republish fails:

> Existing published version remains publicly available.

This is a product requirement, not merely an implementation preference.

---

## 29. Public URL Model

The approved product behavior requires:

• Stable Invite identity  
• Stable canonical public URL through normal republishing  
• New URL for a duplicated Invite  

The existing code currently generates a creator/event-type/slug-style route:

```text
/:creator/:eventType/:slug
```

The technical implementation may continue using a path-based canonical URL in Phase 1.

A subdomain architecture may be added later if operationally justified.

The important invariants are:

```text
same Invite
    +
successful republish
    =
same canonical URL
```

and:

```text
Copy to New
    =
new Invite ID
    =
new URL
```

---

## 30. Route Architecture

The final UI requires real routes.

Recommended client routes:

```text
/
 /samples
 /pricing
 /create
 /create/event-type
 /create/template
 /create/details
 /create/elements
 /create/preview
 /create/features
 /create/publish
 /create/payment

 /dashboard
 /dashboard/invites
 /dashboard/drafts
 /dashboard/published
 /dashboard/expired
 /dashboard/deleted

 /invite/:inviteId/...

 /:creator/:eventType/:slug
```

A route table or React Router implementation should be used.

Each screen must be refresh-safe.

---

## 31. Route Persistence

The route is the authoritative description of the current UI screen.

On refresh:

```text
/create/details
    →
reopen /create/details
```

On browser Back:

```text
/create/preview
    →
/create/elements
```

Do not replace browser history with Home navigation for every Back operation.

Do not redirect to `/` just because the React application restarted.

---

## 32. Deep-Link Restoration

Every edit-flow route must be able to reconstruct the screen from:

• Auth state  
• Invite ID  
• Persisted Invite state  
• Current step route  

If required data does not exist:

• Show a clear Not Found/Unavailable state  
• Provide a relevant recovery/navigation action  
• Do not silently send the user Home  

---

## 33. Authentication and Authorization

Firebase Authentication with Google remains the primary identity mechanism.

**Client:** Client uses `onAuthStateChanged` to maintain session state.  
**Firestore Rules:** Verify `request.auth.uid == ownerId` where applicable.  
**Server:** Trusted functions verify the Firebase ID token automatically through the Firebase callable/HTTP security layer.  

Never trust client-supplied ownership metadata.

---

## 34. Guest Creation

Guest creation may exist in browser memory/local persistence before authentication.

A guest draft is not automatically a globally accessible Firestore record.

When the user signs in:

```text
Guest Draft
    ↓
Ownership assigned to authenticated UID
    ↓
Persist Invite
```

The exact guest persistence strategy can be local-only in Phase 1 unless cross-device continuation before authentication is explicitly required.

---

## 35. Firestore Security Rules Model

Recommended boundaries:

**Private Invite data:** Owner only (`users/{uid}/invites/**`). Condition: `request.auth != null && request.auth.uid == uid`.  
**System definitions:** Read according to visibility; write only through trusted/admin operations.  
**User Template/Element:** Owner write. Public read only when public/global.  
**Public publication snapshot:** Public read. No direct public client write.  
**RSVP:** Public create only with strict validation. Owner read. Guests cannot arbitrarily update/delete prior records.  
**Analytics:** Public logging should not expose an unrestricted write surface. Prefer controlled write function or a narrowly validated path.  
**Entitlements:** Owner read. Trusted service write.  

---

## 36. Firestore Data Integrity Rules

Rules should validate:

• Required IDs  
• Owner identity  
• Allowed state transitions  
• String length  
• Array limits that are infrastructure-safe  
• Numeric ranges  
• Timestamp types  
• Allowed enum values  
• Public visibility constraints  

> Infrastructure limits must not become arbitrary creative restrictions. For example, a Firestore field length limit can exist for reliability, but “maximum 50 Elements” should not be a product rule.

---

## 37. Element Asset Storage

Recommended Storage path:

```text
users/{uid}/invites/{inviteId}/assets/{assetId}
```

System-managed reusable assets:

```text
system/elements/{elementDefinitionId}/{assetFile}
```

User-published reusable Element assets can use:

```text
user-elements/{ownerId}/{elementId}/{assetFile}
```

Exact path naming may change, but ownership isolation must remain.

---

## 38. Asset Metadata

```ts
interface AssetReference {
  assetId: string;

  storagePath: string;

  mimeType: string;

  width?: number;
  height?: number;

  byteSize: number;

  checksum?: string;

  createdAt: Timestamp;

  ownerId?: string;

  sourceType:
    | 'system'
    | 'user-upload'
    | 'template'
    | 'generated';
}
```

Never use large base64 strings in Firestore.

---

## 39. Supported Reusable Asset Formats

The approved Element specification defines:

• SVG  
• PNG  
• WebP  
• GIF  

for the initial reusable asset system.

Video remains a conceptual Element type, but arbitrary reusable video-file upload is outside the initial asset-upload scope.

---

## 40. Asset Validation

Validation should check as applicable:

• File format  
• Integrity  
• Size  
• Dimensions  
• SVG validity  
• GIF validity  
• Security constraints  
• Rendering compatibility  

A fundamentally invalid asset must not enter the reusable Element registry.

Validation errors should explain the reason.

---

## 41. Asset Optimization

Validation and optimization are separate.

If a valid asset is large:

```text
Valid
  ↓
Optimization opportunity
  ↓
User chooses:
   Optimize
   Keep Original
```

Quality-affecting optimization requires user consent. This is a locked product principle from the Element specification.

Phase-1 user-created/AI Element creation is deferred, but the asset pipeline should remain compatible with the future model.

---

## 42. Rendering Architecture

Use a shared rendering model.

```text
Domain Element
     ↓
Resolved configuration
     ↓
Renderer selection by Element type
     ↓
Visual output
```

Examples:

• Text → TextRenderer  
• Image → ImageRenderer  
• SVG → SVGRenderer  
• Shape → ShapeRenderer  
• Frame → FrameRenderer  
• Chart → ChartRenderer  
• Video → VideoRenderer  

The Element definition determines type. The configuration determines the visual variant.

New floral artwork should normally be:

```text
New asset + New metadata/configuration + Existing SVG renderer
```

not a new renderer. This is how the system can grow from approximately 200 Elements to thousands/tens of thousands without rewriting the editor.

---

## 43. Preview Rendering

Editor Preview renders the current Draft state.

It includes:

• All Pages  
• All Element instances  
• Background  
• Typography  
• Content  
• Interactive components  
• Responsive behavior  

The same domain/rendering model should be shared with the public Viewer where practical.

Difference:
• Editor Preview = interactive  
• Public Viewer = read-only  

---

## 44. Preview Element Editing

The Preview screen supports:

• Manual Element selection  
• One-by-one Element navigation  
• Previous/Next  
• Current Element identification  
• Element-specific property editing  
• Position, Resize, Rotation, Layering  
• Type-specific controls  

Interactive components behave as Elements in this editing context.

The guided Element navigation is a UX feature, not a permanent restriction.

---

## 45. Autosave Architecture

Autosave is mandatory. Do not write to Firestore on every raw keystroke.

Recommended:

```text
UI Change
   ↓
Local State
   ↓
Debounce
   ↓
Save Queue
   ↓
Firestore Update
```

Suggested starting debounce: 500–1000 ms. The exact value should be tuned during testing.

Autosave should expose a small state machine: `idle`, `saving`, `saved`, `error`, `offline`.

---

## 46. Draft Recovery

If network fails:

• Preserve local working state.  
• Mark the UI as offline/unsynced.  
• Retry automatically.  
• Do not discard unsaved changes.  

If the browser closes before synchronization completes, the local recovery mechanism should attempt restoration if guest/local persistence is enabled.

---

## 47. Concurrency

Phase 1 does not require collaborative real-time editing.

Use lightweight optimistic/last-write-wins handling. Include `updatedAt` and `revision`. A save can include `expectedRevision`, preventing silent overwrites from stale tabs.

---

## 48. Invite Data vs Design vs Features

Keep three conceptual boundaries:

```text
Invite Details        → content/data
Elements              → visual design
Interactive Features  → interactive configuration
```

Example:

• Title → data + Text Element  
• Date → data + Text Element  
• Venue → data + Text/Map Element  
• Spotify URL → Feature configuration  
• Google Maps → Feature configuration  
• RSVP → Feature configuration  
• Element position → Design instance  
• Element font → Design instance  
• Element color → Design instance  

When placed on the Preview canvas, interactive components are rendered as Elements.

---

## 49. RSVP Storage

Recommended: `public_invites/{inviteId}/rsvps/{rsvpId}`

Schema:

```ts
interface RSVP {
  id: string;

  inviteId: string;

  guestName: string;
  attending: boolean;
  guestCount?: number;

  answers?: Record<string, unknown>;

  createdAt: Timestamp;
}
```

The creator owns/read-manages RSVP data. Guest creation should be allowed only through a tightly validated public write path.

---

## 50. Analytics Storage

Initial analytics:
• Page Views  
• Unique Visitors  
• Views Over Time  

Recommended aggregate structure:
• `public_invites/{inviteId}/insights/summary`  
• `public_invites/{inviteId}/insights/daily/{yyyy-mm-dd}`  

Example:

```ts
interface InsightSummary {
  views: number;
  uniqueVisitors: number;

  updatedAt: Timestamp;
}

interface DailyInsight {
  date: string;
  views: number;
  uniqueVisitorsApprox?: number;
}
```

Do not build QR-specific, device, location or UPI analytics in Phase 1 because they are explicitly excluded from the product specification.

---

## 51. Public Viewer

Public Viewer should resolve:

```text
canonical URL
    ↓
Invite identity
    ↓
currentPublicationId
    ↓
publication snapshot
    ↓
render
```

It must not load the mutable draft document for public presentation. This is necessary for published stability.

---

## 52. Expiry

Expiry can be computed from `expiresAt`, but the persisted lifecycle state should eventually reconcile to:

```text
published → expired
```

A scheduled job can process expiry. The public Viewer can also defensively detect an expired state before serving interactive content. Expiry does not delete the Invite.

---

## 53. Deletion and Recovery

Product behavior:

```text
Draft / Published / Expired
            ↓
          Delete
            ↓
        Recoverable
            ↓
     ┌──────┴──────┐
     │             │
  Recover      Permanent Delete
```

Recovery period: **30 days**. The system may permanently delete after 30 days.

For recovery, the implementation should retain enough information to restore the previous valid state. A soft-delete marker is preferable to immediate Firestore destruction during the recovery period.

---

## 54. Retirement vs Deletion

Reusable Templates and Element Definitions use:

```text
active → retired
```

They are not physically deleted merely because they are removed from future discovery. This prevents old snapshots from breaking.

---

## 55. Template Search Data

Recommended Firestore indexed fields:
• category, subcategory  
• eventCategories[], tags[], keywords[], colors[]  
• visibility, ownerType, status, pricingTier  

Search can initially use exact filters, array membership, and prefix/search helper fields. A dedicated search service is not required for the initial template volume (~50 system templates).

---

## 56. Element Search Data

The Element specification allows Category, Subcategory, Keywords, Tags, Event Categories, and Colors.

Initial library target: ~200 Elements. Designed to scale to 2,000 → 20,000+ without renderer rewrites.

---

## 57. Template/Element Ownership

System-owned: `ownerType = system`  
User-owned: `ownerType = user`, `ownerId = UID`  

Global user assets/templates retain creator attribution. Only the creator can modify the original global User Template. Users of a global Template create their own independent Invite.

---

## 58. Template Retirement

Retiring a Template means `active → retired`.

Retired Templates:
• Are not available to new users for creation  
• Remain retained where historical usage depends on them  
• Do not affect existing Invites  
• Do not mutate existing snapshots  

---

## 59. Public Copy

If `copyPermission = allowed` and the Invite is public:
> Other users may copy the design.

If passcode protected:
> Unauthorized users cannot copy.

A copy gets a new Invite ID, independent Page IDs, independent Element Instances, independent lifecycle, independent publication identity, and a new URL when published. The original URL is never copied.

---

## 60. Download

Product rule:
• Draft: no download  
• Basic published Invite: no download  
• Premium published Invite: download available  

Single-page: Image, PDF  
Multi-page: PDF  

Download generation itself is technical and can be implemented through a renderer/export service.

---

## 61. Export Strategy

**Client-side export:** Suitable only when the rendered document is stable and the environment supports it.  
**Server-side export:** Preferred for multi-page PDF, consistent fonts, high-resolution assets, and stable printed output.  

Phase 1 may begin with a controlled client/server hybrid, but the public rendering snapshot must remain the source content.

---

## 62. Error Model

All major operations should use a consistent domain result.

Conceptual shape:

```ts
interface OperationResult<T> {
  ok: boolean;

  data?: T;

  error?: {
    code: string;
    message: string;
    retryable?: boolean;
  };
}
```

User-facing errors must be human-readable. Internal diagnostic metadata must be separate.

---

## 63. Error Codes

Recommended examples:

```text
AUTH_REQUIRED
FORBIDDEN
INVITE_NOT_FOUND
INVITE_NOT_EDITABLE
TEMPLATE_RETIRED
ELEMENT_RETIRED
INVALID_ASSET
ASSET_TOO_LARGE
PAYMENT_REQUIRED
PAYMENT_VERIFICATION_FAILED
ENTITLEMENT_NOT_AVAILABLE
PUBLICATION_IN_PROGRESS
PUBLICATION_FAILED
PUBLICATION_UNCERTAIN
PUBLICATION_VERIFICATION_FAILED
EXPIRED
DELETED
RECOVERY_EXPIRED
```

---

## 64. Observability

Use structured logs for:
• Create Invite, Update Invite, Autosave  
• Asset upload, Template selection, Element creation/use  
• Publish request, Payment verification, Publication verification, Republish  
• Expiry, Delete, Recovery, Permanent delete  
• Download generation, RSVP submission, Analytics failures  

Do not log sensitive payment credentials, OAuth tokens or private asset contents.

---

## 65. Auditability

For important state changes, store: `actorId`, `action`, `targetType`, `targetId`, `timestamp`, `result`, `reason`.

Recommended audit targets: Publication, Entitlement consumption, Template global publish, Template retirement, Element retirement, Delete, Permanent Delete, Recovery.

A full audit system can be lightweight in Phase 1.

---

## 66. Testing Strategy

Testing must map directly to product invariants.

**Unit Tests:** Test Element resolution, Parent defaults + overrides, Template binding, Date display, Entitlement rules, Lifecycle transitions, Expiry logic, Recovery logic, URL generation, Idempotency key handling.

**Integration Tests:** Test Auth → Firestore ownership, Draft save, Template instantiation, Element creation from definition, Snapshot creation, Publication, Payment verification, RSVP, Analytics, Recovery.

**Security Tests:** Explicitly test cross-user isolation, guest restrictions, publication verification integrity, and entitlement authorization.

**Route Tests:** Test refresh restoration, browser Back navigation, deep-linking, unauthorized/expired/deleted access.

---

## 67. Product Invariants for Testing

1. Template changes do not mutate existing Invites.
2. Element master changes do not mutate published snapshots.
3. Retired definitions do not break existing usage.
4. Published URL remains stable across successful republish.
5. Duplicate Invite receives a new identity.
6. Failed publication does not consume entitlement.
7. Unknown publication result is reconciled.
8. Failed republish does not destroy old public version.
9. Deleted Invite is recoverable for 30 days where product rules require recovery.
10. Expiry does not equal deletion.
11. Draft creation is not artificially limited.
12. Creative editing is not artificially restricted.
13. Interactive components are freely positioned/sized in Preview as Elements.
14. Premium is an Invite-level entitlement, not a permanent user subscription.
15. Free post-publication text correction does not modify design properties.
16. There is no Page Slot arithmetic in the user-facing product model.

---

## 68. Migration Strategy from Current LovinglyEvent

Transition flow:

```text
Current users/events
       ↓
Migration Adapter
       ↓
Invite
       ├── Pages
       └── Elements
```

Mapping:
• `LovinglyEvent` → `Invite`  
• `elements[]` + `elementStyles` → Page Element Instances  
• `photos[]` → Image asset references + Image Element Instances  
• Interactive URLs (`spotifyUrl`, `googleMapsUrl`, etc.) → Interactive Feature config + Interactive Element Instances in Preview  
• `isPublished`, `publishedAt`, `expiresAt` → Invite lifecycle + Publication records  

---

## 69. Legacy Field Handling

Legacy fields (Google Drive IDs, old planTier values, Pro Creator Pack / ₹499, old hosting defaults) must be explicitly classified during migration as: `KEEP`, `MIGRATE`, `DEPRECATE`, or `REMOVE`. Do not silently carry every prototype field into the new architecture.

---

## 70. Current Type Model Migration

The new architecture splits the monolithic `LovinglyEvent` into `Invite`, `Page`, `ElementDefinition`, `ElementInstance`, `Template`, `Publication`, `Entitlement`, `Asset`, `RSVP`, and `Insight`.

---

## 71. Firebase Service Migration

Introduce repository abstraction layers (`InviteRepository`, `PageRepository`, `ElementRepository`, etc.) that handle persistence exclusively, leaving domain rules to service modules.

---

## 72. Service Layer

Recommended services:
• `InviteService`  
• `TemplateService`  
• `ElementService`  
• `PreviewService`  
• `PublicationService`  
• `EntitlementService`  
• `AssetService`  
• `RSVPService`  
• `AnalyticsService`  
• `LifecycleService`  

---

## 73. Trusted Server Functions

Operations requiring server trust: `startPayment`, `verifyPayment`, `requestPublication`, `verifyPublication`, `reconcilePublication`, `extendValidity`, `deletePermanently`, `recoverInvite`.

---

## 74. Database Transactions

Use Firestore transactions or batched writes for atomic multi-record updates (e.g. publication attempt finalization, invite duplication, soft-delete recovery).

---

## 75. Indexing

Keep initial composite indexes minimal:
• User → Invites by `updatedAt`  
• User → Drafts / Published / Expired  
• Templates / Elements → `category` + `status`, `eventCategory` + `status`  

---

## 76. Performance

1. Fast Landing Page  
2. Fast Template discovery  
3. Smooth editor interactions  
4. Debounced Firestore writes  
5. Lazy-load heavy Element/asset libraries  
6. Lazy-load images  
7. Avoid loading complete Element library into memory at once  
8. Public Viewer loads publication snapshot efficiently  

---

## 77. Caching

Cache read-heavy immutable resources (System Templates, System Element metadata, SVG assets, fonts, public publication snapshots). Avoid cross-user data leakage.

---

## 78. Offline Behaviour

Leverage Firestore offline persistence while maintaining UI state awareness (`Saved`, `Saving`, `Offline`, `Sync pending`, `Sync failed`). Do not treat unconfirmed server operations as successful in local cache.

---

## 79. Security for Public Invites

Expose only the publication snapshot required for public presentation. Never leak owner metadata, private draft configs, payment references, or audit trails.

---

## 80. Security for RSVP

RSVP submissions are guest input. Validate string length, boolean parameters, guest counts, and submission rate limits. Never allow RSVP writes to mutate Invite configuration.

---

## 81. Security for Payments

Payment secrets belong exclusively on the server. Entitlements are granted only through server-side verification of payment outcomes.

---

## 82. Security for Passcodes

Never store raw passcodes in public snapshots. Validate access through server verification before serving protected content or copy capabilities.

---

## 83. Public Copy Flow

1. Public Invite → Click Copy  
2. Verify `copyPermission == allowed`  
3. Verify not protected / pass authorized  
4. Create new Invite with new Page/Element instances in `draft` status  

---

## 84. Template/Element Retirement Jobs

Retirement marks definitions `active → retired`. New instances cannot reference retired definitions, but existing snapshots render unaffected.

---

## 85. Database Ownership Rules

Every user-owned resource (`Invite`, `Page`, `ElementInstance`, `Publication`, `Entitlement`) must trace back deterministically to `ownerId`.

---

## 86. Developer Workflow

1. Identify governing specification.  
2. Identify domain objects & persistence impact.  
3. Assess security, routing, and UI impact.  
4. Add/update unit, integration, and security tests.  
5. Update technical documentation on architectural changes.  

---

## 87. Tester Workflow

Test using product invariants across full state transitions: Start state → Action → Expected state → Persisted state → Refresh → Restored state.

---

## 88. Reviewer Checklist

Verify Product consistency, Domain consistency, Persistence isolation, Security rules, Failure/recovery handling, and Routing/UX infrastructure.

---

## 89. Definition of Done — Phase 1 Technical Architecture

Aligned when:
• Vercel, Google Auth, Firestore, Firebase Storage are configured.  
• Domain separation (`Invite`/`Page`/`Element`/`Template`) is enforced.  
• Published snapshots are self-contained and immutable.  
• Draft creation has no artificial limit; no Page Slot arithmetic exists.  
• Publication is idempotent and verified; entitlements managed server-side.  
• Republish preserves canonical URL.  
• 30-day soft-delete recovery operates correctly.  
• Routes are stable and refresh-safe.  
• Test suites confirm product invariants and security boundaries.  

---

## 90. Deferred Phase-2 Decisions

Explicitly deferred:
• User-created / AI-created Elements  
• AI asset repair/optimization UI  
• Element marketplace & global moderation workflow  
• Advanced Template authoring/versioning  
• Premium Element paywall & subscription billing  
• Creator/Pro bundles, collaborative editing, multi-region CDN  

---

## 91. Current Legacy Items to Remove/Quarantine

Remove/quarantine:
• Google Drive publishing fields  
• Old `planTier` values & Pro Creator Pack (₹499)  
• Old hosting-duration defaults & extension pricing  
• Monolithic `LovinglyEvent` storage  
• Direct client publication writes & broad guest transaction permissions  

---

## 92. Final Technical Model

```text
USER
 │
 ├── Firebase Authentication
 │
 └── INVITES
      │
      ├── Invite metadata
      │
      ├── Pages
      │    │
      │    ├── Background
      │    └── Element Instances
      │          │
      │          └── Element Definitions
      │
      ├── Content / Data
      │
      ├── Interactive Configuration
      │
      └── Publication
           │
           ├── Publication Attempt
           ├── Entitlement
           └── Immutable Publication Snapshot
                    │
                    └── Public Viewer
```

---

## 93. Product-to-Technical Traceability

| Product rule | Technical responsibility |
|---|---|
| Template is reusable blueprint | `templates/*` + Template domain |
| Page/Invite is independent | `users/{uid}/invites/*` |
| Elements are reusable definitions + instances | `elements/*` + page element subcollections |
| Snapshot after instantiation/publication | resolved configuration + publication version |
| No creative restrictions | no arbitrary count/paywall/lock logic |
| Drafts unlimited at product level | no Draft slot counter |
| Publish only after actual success | trusted publication workflow |
| Failed publish preserves entitlement | transactional/reconciled entitlement |
| Stable URL | canonical Invite public identity |
| Republish keeps URL | `currentPublicationId` pointer |
| Expired ≠ deleted | separate lifecycle fields |
| 30-day deletion recovery | soft-delete timestamps |
| Basic/Premium per Invite | entitlement records |
| No subscriptions | no user-level subscription state required |
| Premium download | entitlement check in export service |
| Text-only post-publish correction | restricted mutation path |
| Interactive features optional | feature configuration + Element instances in Preview |
| Insights simple | aggregated Firestore insight documents |
| Refresh-safe navigation | real client router + persisted Invite/step state |

---

## 93A. API Contract Examples

Request Publication:
```json
{
  "inviteId": "inv_123",
  "idempotencyKey": "pub_01J...",
  "requestedTier": "premium"
}
```

Response:
```json
{
  "ok": true,
  "publicationAttemptId": "pubatt_123",
  "status": "processing"
}
```

Get Publication Status:
`getPublicationStatus(publicationAttemptId)`

Response:
```json
{
  "ok": true,
  "status": "succeeded",
  "publicationId": "publication_123",
  "publicUrl": "https://..."
}
```

Start Payment:
```json
{
  "inviteId": "inv_123",
  "tier": "premium",
  "idempotencyKey": "pay_01J..."
}
```

Response:
```json
{
  "ok": true,
  "checkoutReference": "checkout_123"
}
```

Extend Validity:
```json
{
  "inviteId": "inv_123",
  "extensionType": "validity_extension"
}
```

Permanently Delete:
```json
{
  "inviteId": "inv_123",
  "confirmationToken": "..."
}
```

---

## 94. Final Authority Statement

This document is an engineering translation of the approved Yours Lovingly product specifications.

If a future code change conflicts with this document, the conflict must be identified explicitly.

If a future product decision changes an approved product specification, this technical document must be updated rather than silently diverging.

The existing GitHub repository is not the product source of truth. It is the prototype/implementation baseline from which the new architecture is migrated.
