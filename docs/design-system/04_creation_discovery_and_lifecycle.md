# 04 - Element Creation, Discovery & Lifecycle Management

## 1. Element Creation Modes
The design system supports three distinct authoring workflows:
1. **Upload Asset**: Upload SVG vector files, high-res PNGs, WebP graphics, or animated GIFs.
2. **Native Element Builder**: Group and compose existing primitives (e.g. text + frame + floral ornament) into a new reusable element.
3. **AI-Assisted Creation**: Prompt-driven creation of tailored SVG artwork and decorative assets conforming strictly to the platform's color and token system.

---

## 2. Search & Discovery Matrix
To enable rapid search across tens of thousands of elements:
- **Hierarchical Indexing**: `Category` $\rightarrow$ `Subcategory` $\rightarrow$ `Specific Tags`.
- **Event Categorization**: Wedding, Engagement, Birthday, Festival, Corporate, Baby Shower, Housewarming.
- **Color Search**: Filtering elements by dominant palette or exact hex match.
- **AI Tagging**: Automated tag extraction and categorization suggestions upon asset upload.

---

## 3. Ownership, Visibility & Moderation
- **Private Elements**: Visible and usable only by the creator within their private dashboard.
- **Global / Public Elements**: Published to the community library with creator attribution (`Created by: <username>`).
- **Save as New Element**: Any user can customize an existing element on their canvas and save it as a new distinct element in their library.

---

## 4. Safe Retirement Principle (Zero Broken Canvases)
- **Deprecation**: Deprecated global elements are marked as **Retired**, never physically purged.
- **Rules of Retirement**:
  - Retired elements are hidden from new template/invite discovery.
  - Cannot be selected for new designs.
  - **All existing instances in Drafts, Templates, and Published Invites remain 100% functional and intact.**

---

## 5. Summary of Locked Design System Rules
1. Elements are the fundamental building blocks of all designs; no mandatory section containers exist.
2. Master Element Definitions and Element Instances are decoupled.
3. Master elements store defaults; instances store page coordinates and overrides.
4. Resolved configurations are snapshot-frozen upon Invite publication.
5. 12 Visual Types + 6 Interactive Components provide complete coverage.
6. Retired elements never break historical or live publications.
