# 03 — Template System Specification

**Product:** Yours Lovingly  
**Document Status:** Confirmed / Locked  
**Scope:** Reusable design blueprints, template element composition, data binding & placeholders, multi-page templates, template lifecycles, and page instantiation snapshots.

---

## 1. Purpose

A Template is a reusable design blueprint made from predefined reusable Elements. It provides a ready-made visual structure so users do not need to build the complete design from scratch.

A template defines visual arrangement, element composition, default styling, default values, layout, background, event-oriented structure, page structure where applicable, and predefined data-entry fields.

The user creates an Invite from the template and can freely customize the resulting design.

---

## 2. Template Is Built Using Elements

Templates use the existing Element System. Text, Image, SVG, Shape, Line, Icon, Frame, Table, Chart, GIF, Video, Audio, and Interactive Components remain individual elements.

Example:

```text
Wedding Template
├── Bride Name       → Text Element
├── Groom Name       → Text Element
├── Wedding Date     → Text Element
├── Couple Photo     → Image Element
├── Floral Ornament  → SVG Element
├── Decorative Frame → Frame Element
└── Venue Map        → Interactive Component
```

Every element remains independently editable. There is no separate Section abstraction.

---

## 3. Template Is Not a Special Giant Element

A template does not require a separate rendering architecture:

```text
Element
  ↓
Element Instance
  ↓
Template Composition
  ↓
Invite
```

The template is a composition of element instances/configurations and uses the same editor/rendering architecture as normal elements.

---

## 4. Template vs Invite

- A **Template** is the predefined reusable design.
- An **Invite** is the user’s actual design created from that template or from a blank canvas.
- An Invite belongs to the user’s profile/account.
- A user does not need to create a template to create an Invite.

---

## 5. Creating an Invite

### From a Template

```text
Choose Template
↓
Create Invite
↓
Fill predefined fields
↓
Preview
↓
Customize
↓
Preview
↓
Publish
```

### From Scratch

```text
New Blank Invite
↓
Add Elements
↓
Arrange
↓
Customize
↓
Preview
↓
Publish
```

---

## 6. Template Library

The initial template library is organized primarily by event type.

Examples:
- Wedding
- Engagement
- Birthday
- Anniversary
- Baby Shower
- Housewarming
- Festival
- Business
- General

**Initial target:** approximately **50 System Templates**, with roughly 4–5 curated templates per important event type to start.

---

## 7. Template Sources

Three conceptual sources are supported:

1. **System Templates** — created and maintained by Yours Lovingly.
2. **User Templates** — created by users and kept private or published globally.
3. **Invite-Specific Designs** — designs created directly as Invites without becoming templates.

---

## 8. Template Creation

Supported creation paths:

### Create from Scratch

```text
Create Template
↓
Blank Template
↓
Add Elements
↓
Arrange
↓
Configure Defaults
↓
Save
```

### Copy from Existing

A new template may be based on an existing Invite or Template.

```text
Existing Invite / Template
↓
Copy to New
↓
Independent Template
```

---

## 9. Duplication

Copying creates an independent object.

```text
Template A → Copy to New → Template B
Invite A → Copy to New → Invite B
```

Changes to the copy do not affect the source.

---

## 10. User Template Visibility

User-created templates support:
- **Private** (available only to creator)
- **Public / Global** (intentionally published to the global library with creator attribution)

---

## 11. Global Template Ownership

Only the creator can modify the original global User Template.

Other users can use it:

```text
Global Template
↓
Use Template
↓
Create Own Invite
↓
Edit Own Invite Freely
```

They cannot modify the shared original.

System Templates are controlled by Yours Lovingly and cannot be modified by normal users.

---

## 12. Global Template Modification

When the owner modifies a global template:
- Existing Invites remain unchanged because they already have independent snapshots.
- New Invites created afterward use the current template configuration.

```text
Template A
├── Existing Invite 1 → unchanged
├── Existing Invite 2 → unchanged
└── New Invite → current Template A
```

There is no live synchronization between a template and already-created Invites.

---

## 13. Template Version Metadata

A complex version-management system is not required.
A human-readable version metadata field may exist, for example: `V1`, `V1.1`, `V1.2`, `V2.0`.

This is identification/history metadata, not a branching or inheritance system.

---

## 14. Template → Invite Snapshot

Using a template creates an independent Invite snapshot.

```text
Template
↓
Resolve Template Configuration
↓
Create Page Instances
↓
Create Invite Snapshot
```

The Invite is not a live child of the Template. Future changes to the Template do not automatically modify existing Invites.

---

## 15. Element Snapshot Principle Inside Templates

The Template System follows the Element System’s reusable-definition → instance → resolved-configuration → snapshot principle.

Example:

```text
Element Definition
↓
Template Element Configuration
↓
Invite Creation
↓
Default Values + Instance Overrides
↓
Resolved Configuration
↓
Independent Invite Snapshot
```

The final Invite instance contains the resolved configuration necessary for continued operation.

---

## 16. Resolved Configuration

The reusable Element model may store only overridden values at instance level.

Example:

**Parent:**
```text
width = 320
height = 80
opacity = 100
rotation = 0
color = gold
```

**Instance overrides:**
```text
width = 500
rotation = 15
```

**Resolved configuration:**
```text
width = 500
height = 80
opacity = 100
rotation = 15
color = gold
```

When the Invite snapshot is created, the resolved configuration is preserved.

---

## 17. No Resize Restriction After Snapshot

Once an element is part of an Invite snapshot, the user is not restricted by the original parent defaults.

All supported element properties remain editable, including:
- Width / Height
- Rotation / Position
- Opacity / Color
- Shadow / Border
- Layer / Flip / Crop
- Typography / Animation / Responsive behavior

---

## 18. Why Snapshotting Is Required

Without a snapshot, parent changes or deletion could break child instances.

With a snapshot:

```text
Parent Definition
↓
Resolved Configuration
↓
Invite Snapshot
```

The Invite is self-sufficient:
- Parent retirement does not break the Invite.
- Parent updates do not unexpectedly modify the Invite.
- Parent deletion does not create an active runtime dependency.
- Published Invites remain stable.

---

## 19. Element Retirement

If a global Element used by existing templates/Invites is removed by its creator, it is **retired**, not physically deleted.

```text
ACTIVE → RETIRED
```

A retired element:
- Is removed from active future selection.
- Cannot be used for new instances.
- Is not shown as an active library option.
- Remains retained for existing usage where required.
- Does not invalidate existing snapshots.

---

## 20. Template Retirement

The same safe-retirement principle applies to Templates.

```text
ACTIVE → RETIRED
```

A retired Template:
- Cannot be selected for new Invite creation.
- Is removed from active discovery.
- Does not affect existing Invites.
- Does not invalidate existing snapshots.

Retirement means stopping future use without destroying existing usage.

---

## 21. Template Defaults

Templates contain predefined defaults for applicable properties (Text, Fonts, Colors, Positions, Sizes, Alignment, Spacing, Image placement, Decorative configuration, Background, Interactive component defaults).

These are starting values and can be edited after Invite creation.

---

## 22. Template Creation Input Form

When creating a template, the creator can define the predefined input fields required by that template:
- Template title / Invite title
- Event type
- Bride name / Groom name
- Event date / Event time
- Venue / Address / Description

The creator can enter sample values and see them reflected in the template preview.

---

## 23. Event Data and Placeholders

Templates can use semantic placeholders such as:

```text
{{bride_name}}
{{groom_name}}
{{event_name}}
{{event_date}}
{{event_time}}
{{venue}}
{{address}}
{{description}}
```

These are data bindings, not new rendering types.

For example:
```text
type = Text
role = bride_name
content = {{bride_name}}
```

The underlying rendering type remains Text.

---

## 24. Automatic Data Population

When a user creates an Invite from a template:

```text
Template
↓
User enters event information
↓
Template fields are populated
↓
Invite preview updates
```

The populated event data belongs to the user’s Invite, not to the reusable template.

---

## 25. All Template Elements Remain Editable

Templates are never flattened into a single artwork. Each element remains separately editable.

---

## 26. Template Background

Template backgrounds are page/template-level visual configuration.

SVG is the preferred initial format for decorative/background artwork such as:
- Floral patterns
- Traditional patterns
- Decorative borders
- Ornaments
- Repeating patterns
- Cultural/traditional artwork

Background configuration remains editable.

---

## 27. Multi-Page Templates

Templates may contain one or multiple pages.

```text
Template
├── Page 1
├── Page 2
├── Page 3
└── Page N
```

Multi-page templates are supported when the use case requires them.

---

## 28. Page Ordering

Multi-page templates support:
- Add page
- Delete page
- Duplicate page
- Reorder page
- Edit each page independently

No Section abstraction is required.

---

## 29. Download Relationship

Existing download rules remain unchanged:
- **Single-page document:** Image + PDF
- **Multi-page document:** PDF

---

## 30. Template Search and Discovery

Template discovery follows the same metadata philosophy as Elements:
- Category / Subcategory
- Keywords / Tags
- Event category
- Colors
- Creator / Visibility / Version

---

## 31. Template Preview

Every template has a visual preview for browsing and selection. The template editor also provides a live preview while the creator changes template values.

The preview is a representation for browsing; it is not the editable template itself.

---

## 32. Template Ownership Metadata

```text
Template ID
Name
Created By
Visibility
Status
Version
Created At
Updated At
```

For user-created global templates:
```text
Created By: <username>
Visibility: Global
```

---

## 33. Template Validation

At the current product stage there is no separate product-level validation or moderation workflow for global user-created templates.

When the creator selects:
> Publish Globally

the template is published globally. Basic technical sanity checks exist internally, with no separate approval blocker.

---

## 34. Template Composition and Element Reuse

Templates reference reusable Elements rather than duplicating the conceptual Element Library.

Example:
```text
Template
├── element_id = floral-001
├── element_id = text-heading-001
├── element_id = frame-001
└── element_id = image-frame-001
```

The same Element can be used in many templates.

---

## 35. Template → Invite Element Relationship

```text
Global Element
↓
Used by Template
↓
Template Element Configuration
↓
User creates Invite
↓
Resolve Defaults + Values + Overrides
↓
Independent Page Instance
↓
Snapshot
↓
User freely edits
```

The final Invite instance is independent of the source Template and parent Element definitions.

---

## 36. Final Template Hierarchy

```text
TEMPLATE
│
├── Identity
│   ├── ID
│   ├── Name
│   ├── Description
│   └── Version
│
├── Classification
│   ├── Category
│   ├── Subcategory
│   ├── Keywords / Tags
│   ├── Event Category
│   └── Colors
│
├── Ownership
│   ├── Created By
│   ├── Visibility
│   └── Status
│
├── Background
│   └── SVG / supported background configuration
│
├── Pages
│   ├── Page 1
│   │   ├── Background
│   │   └── Element Configurations
│   ├── Page 2
│   │   └── Element Configurations
│   └── Page N
│
├── Data Fields / Placeholders
└── Preview
```

---

## 37. Final Product Flow

```text
Template Library
      │
      ├── System Template
      └── User Template
              ↓
         Create Invite
              ↓
     Fill predefined fields
              ↓
     Resolve configuration
              ↓
      Create page instances
              ↓
       Create snapshot
              ↓
       User customizes
              ↓
           Preview
              ↓
          Publish
```

Alternative:
```text
Blank Invite
↓
Add Elements
↓
Arrange
↓
Customize
↓
Snapshot
↓
Preview
↓
Publish
```

---

## 38. Final Locked Principles

1. Template = reusable design blueprint.
2. Templates are composed from reusable Elements.
3. Every template element remains independently editable.
4. Templates are not giant flattened elements.
5. No separate Section abstraction is required.
6. The existing Element rendering architecture is reused.
7. An Invite is the user’s actual design.
8. An Invite belongs to the user’s profile/account.
9. A user can create an Invite without creating a Template.
10. Invites can be created from System Templates, User Templates, or from scratch.
11. Existing Invites and Templates can be copied using Copy to New.
12. Copies are independent.
13. Initial template organization is primarily event-based.
14. Initial target is approximately 50 System Templates.
15. Each important event can start with approximately 4–5 curated templates.
16. User Templates are Private by default.
17. User Templates can be published Public/Global.
18. Only the creator can modify the original global User Template.
19. Users of a global template can freely modify their own Invite.
20. System Templates cannot be modified by normal users.
21. Template changes do not affect existing Invite snapshots.
22. New Invites use the current template configuration.
23. No complex template versioning system is required.
24. Human-readable version metadata may exist (V1, V1.2, V2.0, etc.).
25. Template instantiation creates an independent Invite snapshot.
26. An Invite is not a live child of its source Template.
27. Template element configurations resolve into independent page instances.
28. Resolved configuration is preserved in the Invite snapshot.
29. Invite elements can be freely resized and edited after snapshot creation.
30. Parent Element retirement must not break an existing Invite snapshot.
31. Element and Template retirement follow the same safe-retirement principle.
32. Retired objects are not physically destroyed when historical usage depends on them.
33. Template defaults are predefined.
34. Template data fields/placeholders are semantic bindings, not new rendering types.
35. User-entered event data belongs to the user’s Invite.
36. Template previews are required.
37. Template editing provides live preview.
38. SVG is the preferred initial format for decorative/background artwork.
39. Multi-page Templates are supported where required.
40. Multi-page Templates support page ordering and page management.
41. Single-page documents support Image + PDF download.
42. Multi-page documents support PDF download.
43. Template search follows the Element System’s metadata philosophy.
44. User-created global Templates retain creator ownership information.
45. There is no separate user-facing global template validation/approval workflow at this stage.
46. Templates reference reusable Elements rather than duplicating the Element Library.
47. Global Elements can be reused across many Templates.
48. Template and Invite architecture follows the reusable-definition → instance → resolved-configuration → snapshot principle.
49. Templates do not impose permanent editing locks.
50. Existing Invites remain stable when their source Template is changed or retired.

---

## 39. Deferred Technical Decisions

The following are deferred to the Technical Product Architecture document:
- Exact database schema
- Exact template JSON structure
- Snapshot persistence strategy
- Asset storage & CDN
- Preview generation
- Rendering engine & responsive layout implementation
- Data-binding implementation & Template APIs
- Permission implementation & Retirement implementation details
