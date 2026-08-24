# Document 05 — Publishing & Lifecycle Specification

**Product:** Yours Lovingly  
**Document:** Publishing & Lifecycle Specification  
**Status:** Confirmed  

---

## 1. Purpose

Publishing is the transition that turns a private user-owned Invite into a publicly accessible Yours Lovingly Invite.

Core principle:

> An Invite becomes public only after publication actually succeeds and the public Invite is verified as available.

The publishing system must be predictable, transparent, failure-safe, credit-safe, URL-stable, and protective of the user’s completed artwork.

---

## 2. Invite Lifecycle

The primary Invite lifecycle is:

```text
DRAFT
   │
   │ Publish
   ▼
PUBLISHING
   │
   │ Verification Success
   ▼
PUBLISHED
   │
   │ Expiry
   ▼
EXPIRED
```

Deletion is a separate lifecycle:

```text
PUBLISHED / EXPIRED
        │
        │ Delete
        ▼
   RECOVERABLE
        │
   ┌────┴─────┐
   │          │
Recover   Permanent Delete
   │          │
   ▼          ▼
Previous    DELETED
State
```

A Draft does not require the recoverable-deletion state. Draft deletion can be handled as a normal destructive deletion according to the product’s deletion confirmation rules.

**Expired is not Deleted.**

Published and Expired Invites can enter the 30-day recoverable deletion state when explicitly deleted.

---

## 3. Draft

A Draft is a private user-owned working Invite.

A Draft:

- belongs to the user’s profile
- is not publicly accessible
- is fully editable
- is automatically saved
- can contain one or multiple Pages
- can contain any supported Elements
- can contain optional interactive features
- can be created from a Template or from a blank Invite

During Draft state the user can:

- add Elements
- remove Elements
- move Elements
- resize Elements
- rotate Elements
- change supported Element properties
- arrange layers
- change backgrounds
- add/remove/reorder Pages
- edit content
- configure optional interactive components
- preview the Invite

There should be no artificial creative restriction.

---

## 4. Publish Action

The normal flow is:

```text
Draft
  ↓
Preview
  ↓
Publish
  ↓
Publication Processing
  ↓
Public Representation Creation
  ↓
URL Provisioning
  ↓
Availability Verification
  ↓
Published
```

Clicking Publish alone does not mean the Invite is successfully published.

---

## 5. Publication Processing

After Publish is requested, the system processes the Invite for public delivery.

The processing stage creates the public representation and prepares its public URL.

The Invite remains in a non-published processing state until availability has been verified.

---

## 6. Publication Success

A successful publication requires:

1. The public representation is successfully created.
2. The public URL is provisioned.
3. The public Invite is actually available.
4. Availability is programmatically verified.
5. The Invite is then marked as Published.
6. The applicable publish entitlement is consumed.

Flow:

```text
DRAFT
 ↓
Publish
 ↓
Generate Public Representation
 ↓
Provision URL
 ↓
Verify URL / Invite Availability
 ↓
PUBLISHED
 ↓
Consume Applicable Publish Entitlement
```

---

## 7. Publication Verification

Publication verification answers:

> Is the newly published public Invite actually available to visitors?

The system can programmatically verify the provisioned public URL after publication processing.

Conceptually:

```text
Provision URL
      ↓
Request / check public URL
      ↓
Validate expected successful response
      ↓
Confirm expected Invite/public representation
      ↓
Publication Verified
```

Only after this verification should the Invite’s Published state be finalized.

The exact implementation belongs to the later technical implementation stage; the product requirement is that successful publication must be verified.

---

## 8. Publication Failure

If publication fails:

```text
DRAFT
 ↓
Publish
 ↓
Failure
 ↓
DRAFT
```

The user must:

- retain their Draft
- retain their design work
- retain the applicable publish credit
- receive a clear failure message
- be able to retry

Example:

> **We couldn’t publish your Invite right now. Your publish credit was not consumed. Please try again.**

---

## 9. Unknown / Uncertain Publication

A rare edge case can occur when the client cannot determine whether publication succeeded.

Example:

```text
User clicks Publish
       ↓
Server processes request
       ↓
Network timeout / connection interruption
       ↓
Client cannot determine final result
```

The system must not immediately assume either success or failure.

A background reconciliation process must check the actual publication state.

```text
UNKNOWN
   ↓
Check Publication State
   ├── Published → PUBLISHED + entitlement consumed
   └── Not Published → DRAFT + entitlement preserved/restored
```

The user must not lose an entitlement because the system could not initially determine the result.

---

## 10. Publish Credit Rule

Fundamental commercial rule:

> **A publish credit/entitlement is consumed only after successful publication.**

### Successful publication

```text
Publish
 ↓
Success
 ↓
Credit Consumed
```

### Failed publication

```text
Publish
 ↓
Failure
 ↓
Credit Preserved
```

### Unknown publication

```text
Publish
 ↓
Unknown
 ↓
Reconciliation
 ↓
Success → Consume
Failure → Preserve / Restore
```

---

## 11. Publication Record

Each publication attempt should have an internal publication record.

The record should identify at least:

- Invite ID
- User/owner
- Publication attempt ID
- Timestamp
- Publication status
- Public URL
- Applicable entitlement/credit transaction
- Success/failure result
- Failure reason where applicable
- Verification status
- Reconciliation status where applicable

This provides a reliable product-level record of publication behaviour.

---

## 12. URL Generation

Every successfully published Invite receives a public URL.

The exact URL structure is a product decision and should support the user’s profile identity and/or Invite identity.

Possible product patterns include:

```text
shiva.yourslovingly...
```

or:

```text
yourslovingly.../shiva
```

or an Invite-specific representation such as:

```text
yourslovingly.../<invite-identifier>
```

The product should ultimately choose one canonical public URL format.

The URL must uniquely resolve to the Invite.

---

## 13. URL Stability

Once an Invite is published, normal editing and successful republishing must keep the same public URL.

Example:

```text
Before republish:
shiva.yourslovingly...

After republish:
shiva.yourslovingly...
```

This is important because the URL may already be:

- printed
- shared through WhatsApp
- posted on social media
- encoded in a QR code
- bookmarked
- sent to guests

Republishing should update the Invite represented at the existing URL rather than create a new URL.

---

## 14. Invite Identity

Every Invite has its own permanent independent Invite ID.

The Invite ID is separate from its public URL.

```text
Invite ID
   +
Public URL
```

A duplicated Invite receives a new Invite ID.

Therefore:

```text
Original Invite ID ≠ Duplicated Invite ID
```

---

## 15. Published Invite Independence

A published Invite must not depend on the original source Template or Global Element definitions remaining active.

The Invite is rendered from its own resolved/snapshotted configuration.

Therefore:

```text
Template Retired
      ↓
Existing Invite
      ↓
No Impact
```

and:

```text
Global Element Retired
      ↓
Existing Invite
      ↓
No Impact
```

---

## 16. Published Invite Editing

A successfully published Invite is not freely design-editable.

Normal free editing cannot change the published design’s:

- Element position
- width
- height
- rotation
- opacity
- color
- shadow
- border
- flip
- crop
- layer order
- font
- font size
- typography
- layout
- background
- Element addition/deletion
- Page arrangement
- design composition

This preserves the published artwork while still allowing practical content correction.

---

## 17. Free Text Correction

A limited text-only correction mode may be available after publication.

The user may change the actual text value.

Examples:

- Name
- Date
- Address
- Wording
- Letters
- Words

Example:

```text
Sivakrishna & Dayana
          ↓
Sivakrishna & Dayana Raj
```

The following remain locked in the free text-correction mode:

- font
- font size
- font weight
- font color
- position
- alignment
- spacing
- typography
- Element dimensions
- layout
- background
- other design properties

Principle:

> **Content correction may be free; design modification is not.**

---

## 18. Full Post-Publish Design Editing

Full design editing after publication requires the applicable paid/entitled operation.

Conceptual flow:

```text
Published Invite
      ↓
Edit Design
      ↓
Check Applicable Entitlement
      ↓
 ┌───────────────┐
 │               │
Available     Not Available
 │               │
Consume        Purchase /
Entitlement    Upgrade
 │               │
 └───────┬───────┘
         ↓
    Full Design Edit
         ↓
       Preview
         ↓
      Republish
```

Current commercial direction:

- Basic Invite: ₹49
- Premium Invite: ₹99

The exact commercial implementation is handled in the later Credits & Monetization specification.

---

## 19. Republish

After an eligible full design edit:

```text
Published Invite
      ↓
Full Design Edit
      ↓
Preview
      ↓
Republish
      ↓
Published Invite
```

The Invite retains:

- the same Invite ID
- the same canonical public URL

The public representation is replaced only after the new publication succeeds.

---

## 20. Republish Failure

If a new publication fails:

```text
Existing Published Invite
        ↓
Edit
        ↓
Republish
        ↓
Failure
```

The previous valid Published representation must remain public.

The failed new representation must not replace the existing valid public Invite.

The user’s pending changes should be preserved where possible.

The applicable publication entitlement must not be consumed for an unsuccessful republish.

---

## 21. Atomic Publication Principle

A new published version becomes public only after it is successfully generated and verified.

```text
Existing Published Version
          │
          │
          ├── New publication processing
          │
          ├── Failure → Existing version remains public
          │
          └── Success → New version becomes public
```

This protects visitors from seeing a partially processed or broken Invite.

---

## 22. Expiry

When a Published Invite reaches its configured expiry condition:

```text
PUBLISHED
    ↓
EXPIRED
```

The public Invite should display an expired state, such as:

> **This Invite has expired.**

Expiry does not automatically delete the Invite.

---

## 23. Expired Invite Retention

An Expired Invite remains associated with the user’s profile.

It remains identifiable as:

> **Expired**

Expiry itself does not move the Invite into the deleted/recovery lifecycle.

The Invite management and entitlement-counting rules determine how an Expired Invite contributes to account limits.

---

## 24. Expired vs Deleted

These are different states.

### Expired

The Invite was previously published but is no longer active.

### Deleted

The user explicitly removed the Invite.

Therefore:

```text
Expired ≠ Deleted
```

---

## 25. Deletion

Explicit deletion is a destructive action.

For Published and Expired Invites:

```text
Published / Expired
       ↓
Delete
       ↓
Recoverable
```

A clear confirmation must be shown before deletion.

Example:

> **Delete this Invite? It will be recoverable for 30 days.**

Drafts do not require the same recoverable-deletion lifecycle.

---

## 26. 30-Day Recovery

A deleted Published or Expired Invite remains recoverable for 30 days.

During this period the user can:

- Recover
- Permanently Delete Now

---

## 27. Automatic Permanent Deletion

If no recovery action is taken:

```text
Recoverable
     ↓
30 Days
     ↓
Deleted
```

After permanent deletion, the normal product recovery mechanism no longer applies.

---

## 28. Immediate Permanent Deletion

The user may choose:

> **Delete Permanently Now**

when the product exposes this option.

This bypasses the 30-day recovery period.

A destructive confirmation is mandatory.

---

## 29. Recovery

When a Published or Expired Invite is recovered, it returns to its previous valid state.

Examples:

```text
Published
   ↓ Delete
Recoverable
   ↓ Recover
Published
```

```text
Expired
   ↓ Delete
Recoverable
   ↓ Recover
Expired
```

The recovery model must preserve the Invite’s previous valid lifecycle state.

---

## 30. Delete Does Not Refund Publication Credit

Once an Invite has successfully published:

```text
Publish Success
      ↓
Credit Consumed
      ↓
Delete Invite
```

The consumed publish credit is not refunded.

This remains true even if the Invite was public for only a very short time.

A successful publication is a completed publication transaction.

---

## 31. Expiry Does Not Refund Publication Credit

Similarly:

```text
Publish Success
      ↓
Credit Consumed
      ↓
Invite Expires
```

Expiry does not refund the consumed publication entitlement.

---

## 32. Download

Draft Invites cannot be downloaded as final published output.

The UI may show:

> **Publish this Invite to download.**

Download becomes available only after successful publication and when the Invite has the required entitlement.

---

## 33. Download Entitlement

Current product direction:

|Invite Type|Download    |
|-----------|------------|
|₹49 Basic  |Not included|
|₹99 Premium|Included    |

A user with a Basic Invite can upgrade/add the applicable Premium entitlement and then use the download feature.

---

## 34. Download Formats

### Single-page Invite

Available formats:

- Image
- PDF

### Multi-page Invite

Available format:

- PDF

---

## 35. Published Invite Actions

A successfully published Invite provides:

- Copy URL
- Share URL
- Generate QR Code
- Download, when entitled

---

## 36. QR Code

The QR Code is simply an encoded representation of the canonical Invite URL.

It is not:

- a separate Invite
- a separate publication
- a separate URL
- a separate analytics system

---

## 37. Sharing

The canonical Invite URL is used for:

- Copy URL
- Share URL
- QR Code

A separate share-link tracking system is not required.

---

## 38. Analytics

Initial Invite Insights intentionally remain simple.

### Included

- Invite Views
- Unique Visitors
- Views Over Time

### Explicitly excluded

- QR-specific visits
- Share-link-specific visits
- Visitor device information
- Visitor location
- UPI activity
- Scanner activity

---

## 39. Invite Views vs Unique Visitors

These are separate metrics.

Example:

One visitor opens the same Invite five times:

```text
Invite Views = 5
Unique Visitors ≈ 1
```

The exact visitor-identification implementation belongs to later technical planning; this document only defines the product-level metrics.

---

## 40. RSVP

RSVP is optional.

It is not required for publication.

Default RSVP choices:

- Attending
- Not Attending

The creator can enable or disable RSVP according to the Invite’s needs.

---

## 41. Custom RSVP

Creators may configure additional RSVP questions and response options.

Examples:

```text
Will you attend?
[Attending]
[Not Attending]
```

```text
Food preference?
[Veg]
[Non-Veg]
```

```text
Number of guests?
[Text Input]
```

Supported controls can include:

- Text
- Yes/No
- Radio options
- Checkbox options
- Multiple choice
- Other supported response controls

RSVP remains creator-configurable and optional.

---

## 42. Interactive Components

Optional interactive components include:

- RSVP
- Google Maps / Show Directions
- Spotify
- Countdown
- UPI QR
- Future supported interactive features

None of these are mandatory for every Invite.

---

## 43. Interactive Features and Templates

Templates may contain optional predefined interactive-component configurations.

For example, a Premium Wedding Template may already contain:

- Spotify
- RSVP
- Maps
- Countdown

When an Invite is created from that Template:

```text
Template Configuration
        ↓
Invite Creation
        ↓
Resolved Invite Configuration
        ↓
Independent Invite Snapshot
```

The resulting Invite does not remain a live child of the Template.

---

## 44. Interactive Components and Publishing

Interactive features are Invite-level configurations.

After Invite creation, the Invite owns its resolved configuration.

The published Invite renders from that Invite’s snapshot.

Therefore, later Template changes do not modify the already-created Invite.

---

## 45. Premium and Basic Templates

Templates may be classified as:

- Basic
- Premium

This classification is primarily displayed at the Template-library level.

It should not unnecessarily appear as a visual/design element inside the actual Invite.

### Basic Template

Contains Basic-compatible features.

### Premium Template

May contain Premium/interactive features and corresponding sample content.

Examples of Premium features may include:

- interactive RSVP
- Spotify
- Maps
- Countdown
- other Premium components
- download eligibility

The exact entitlement mapping will be defined in the Credits & Monetization specification.

---

## 46. Invite Duplication

An Invite can be duplicated.

```text
Invite A
  ↓
Copy to New
  ↓
Invite B
```

Invite B receives:

- new Invite ID
- independent snapshot
- independent design
- independent lifecycle
- independent publication
- independent URL when published

Changes to Invite A do not affect Invite B.

---

## 47. Public vs Protected Copy

Public Invites may be copyable according to their copy permissions.

If an Invite is public and copy permission is enabled:

> Other users may copy the design.

If an Invite is passcode-protected:

> Unauthorized users cannot copy it.

The protection applies to copying by unrelated users.

The owner retains appropriate ownership-level copy capabilities.

---

## 48. Copy Does Not Copy URL

When an Invite is copied:

```text
Original Invite
    ↓
Copy
    ↓
New Invite ID
    ↓
New Invite Lifecycle
    ↓
New URL when published
```

The original Invite’s URL is not inherited.

---

## 49. Publication Idempotency

A user accidentally clicking Publish twice must not create two logical publications.

Example:

```text
2 Publish clicks
      ≠
2 publications
```

The system should treat repeated requests for the same logical operation idempotently.

Core rule:

> **One successful logical publication = one applicable publication entitlement consumption.**

---

## 50. Credit Transaction Safety

The system must prevent both dangerous states:

```text
Publication Failed
+
Credit Consumed
```

and:

```text
Publication Succeeded
+
Credit Transaction Missing
```

Both situations must be safely reconcilable.

---

## 51. Error Handling

Every important publication/lifecycle operation must have a deterministic outcome.

### Publish

```text
Success → Published
Failure → Draft
```

### Republish

```text
Success → New Published Representation
Failure → Existing Published Representation Remains
```

### Delete

```text
Success → Recoverable
Failure → Invite Remains
```

### Recover

```text
Success → Previous Valid State
Failure → Recoverable State Remains
```

The system must not leave the user indefinitely stuck without a result.

---

## 52. User-Facing Errors

User-facing errors should be clear and actionable.

Avoid exposing raw infrastructure details such as:

> HTTP 502 / publication_worker_exception

Prefer:

> **We couldn’t publish your Invite right now. Your credit was not consumed. Please try again.**

Technical details can be recorded internally for diagnostics.

---

## 53. Error Logging

Important operations should generate internal diagnostic records, including:

- Publish
- Republish
- URL provisioning
- Download generation
- Delete
- Recover
- Permanent Delete
- Credit transaction
- Publication reconciliation

---

## 54. Data Preservation

When an operation fails, the system should preserve the user’s last valid state.

Examples:

```text
Failed Publish
→ Draft preserved
```

```text
Failed Republish
→ Existing Published Invite preserved
```

```text
Failed Delete
→ Invite preserved
```

```text
Failed Recovery
→ Recoverable state preserved
```

---

## 55. No Artificial Creative Restrictions

The publication system must not introduce unnecessary creative restrictions.

It must not impose:

- fixed Element counts
- fixed layouts
- mandatory Templates
- mandatory event types
- mandatory RSVP
- mandatory Spotify
- mandatory Maps
- mandatory backgrounds
- mandatory Page structures

Technical safeguards may exist where required for reliability, security, or platform operation, but they must not become arbitrary creative restrictions.

---

## 56. Active Invite / Draft Limit Example

The product can enforce an account’s active Invite entitlement.

Example:

```text
Maximum active Invites = 3
```

Possible state:

```text
Invite A → Published
Invite B → Draft
Invite C → Draft
```

This uses three active Invite slots.

An Expired Invite remains in the user’s profile; whether it consumes an active slot is an entitlement/product-rule decision and will be finalized with the account/credits model.

---

## 57. Core Product Principles

1. Publishing makes an Invite public.
2. Clicking Publish is not itself successful publication.
3. Public availability must be verified.
4. Successful publication consumes the applicable entitlement.
5. Failed publication does not consume it.
6. Unknown outcomes are reconciled.
7. The Invite URL remains stable during normal republishing.
8. Every Invite has an independent Invite ID.
9. Published Invites are independent of their source Templates.
10. Published Invites are independent of retired Global Elements.
11. Published Invites are not freely design-editable.
12. Free post-publication correction may change text values only.
13. Full design editing requires the applicable paid entitlement.
14. Failed republishing never destroys the previous valid public representation.
15. Expired and Deleted are separate states.
16. Drafts do not require the recoverable-deletion lifecycle.
17. Published and Expired Invites can be recovered after explicit deletion.
18. The recovery period is 30 days.
19. Permanent deletion can be requested immediately.
20. Automatic permanent deletion occurs after 30 days if no action is taken.
21. Successful publication credits are not refunded by expiry or deletion.
22. Downloads require successful publication and applicable Premium entitlement.
23. Basic ₹49 Invites do not include download.
24. Premium ₹99 Invites include download.
25. Single-page downloads support Image and PDF.
26. Multi-page downloads support PDF.
27. Published actions include Copy URL, Share, QR, and entitled Download.
28. QR is only a representation of the canonical Invite URL.
29. Analytics initially include Views, Unique Visitors, and Views Over Time.
30. QR-specific, share-link-specific, device, location, UPI, and scanner analytics are excluded.
31. RSVP is optional and creator-configurable.
32. Interactive components are optional.
33. Templates may be Basic or Premium and may contain optional predefined interactive configurations.
34. A created Invite receives its own resolved interactive configuration and snapshot.
35. Public Invites may be copyable when copy permission allows it.
36. Passcode-protected Invites cannot be copied by unauthorized users.
37. Copying an Invite creates a new Invite ID and eventual new URL.
38. Critical publication operations must be idempotent.
39. Credit transactions must be safely reconcilable.
40. Important operations must have deterministic outcomes.
41. User-facing errors must be understandable and actionable.
42. Critical operations must be internally logged.
43. Failed operations must preserve the user’s last valid work.
44. Publishing must protect artwork without artificially restricting creativity.

---

## Document Scope

This document defines **product behaviour for the Published Invite and its lifecycle**.

It does not define the internal technical architecture, database schema, infrastructure, workers, or implementation details.

Those will be handled separately when the corresponding technical/product documents are created.

---

## Status

**CONFIRMED**

This document is now the product-level source of truth for:

- Publishing
- Publication verification
- Publish entitlement consumption
- URL behaviour
- Published Invite editing
- Republish
- Expiry
- Deletion
- Recovery
- Permanent deletion
- Downloads
- QR/share behaviour
- Initial Invite analytics
- RSVP publication behaviour
- Optional interactive features
- Published Invite protection
- Publication error handling
