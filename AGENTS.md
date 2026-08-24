# AGENTS.md - Project Development Rules & Contracts

This file serves as the permanent persistent instruction set and coding contract for the AI coding agent working on this application. Detailed specification: `/docs/AGENT_INSTRUCTIONS.md`.

## Core Directives & Guidelines
1. **Strict Respect for User Intent**: Build exactly what the user asks for. Avoid unsolicited features, sidebars, or over-engineering. AI must implement the documented product, not invent the product.
2. **Tech Stack Contract**:
   - **Frontend**: React 18+, Vite, TypeScript, Tailwind CSS.
   - **Icons**: Lucide React only (`lucide-react`).
   - **Animations**: `motion/react`.
   - **Database & Auth**: Firebase Firestore and Firebase Authentication (using `src/lib/firebase-service.ts` and `src/firebase.ts`).
3. **Code Quality & Architecture**:
   - Split code into modular files (`/src/types.ts`, `/src/components/*`, `/src/lib/*`).
   - Avoid monolithic files (e.g. keeping everything in `App.tsx`).
   - Use proper TypeScript types and avoid `any` wherever possible.
   - Follow mobile-first responsive design principles with Tailwind CSS.
4. **Persistence & Data**:
   - User-authored content, journals, notes, and custom items must be persisted securely in Firebase Firestore.
5. **Anti-Slop Visual Design**:
   - Avoid generic AI clichés (no arbitrary gradient text everywhere, no nested cards without mathematical radius calculations, ensure WCAG AA contrast).
6. **Documentation as Sole Source of Truth**: The documentation is the sole source of truth. Never hallucinate, invent, assume, fabricate, or introduce dummy/mock/placeholder/fallback data or undocumented behavior. If any requirement, behavior, technical detail, flow, dependency, or implementation decision is unclear or missing from the available documentation, do not proceed based on an assumption. First check all relevant project documentation; if the answer is still unavailable, explicitly ask the user for clarification and confirmation before proceeding. If an actual issue, bug, inconsistency, or missing requirement is discovered, report it explicitly rather than masking it with mock data or an assumed solution. Proceed with implementation only after the required clarification is confirmed. Make no other changes to this document.

---

## Source-of-Truth Hierarchy
When making engineering decisions, follow this strict precedence order:
```text
1. Approved Product Specifications (/docs/product/*)
2. Approved Technical Architecture (/docs/TECHNICAL_ARCHITECTURE.md)
3. Current Repository + actual runtime behavior (/src/*)
4. Approved task / acceptance criteria
5. Tests
6. Human instructions in current task
7. AI inference
```
*Rule: Existing prototype code ≠ automatically correct. When prototype code conflicts with approved specs, migrate the code toward the specification.*

---

## The 12 Core AI Coding Concepts
1. **Context Management**: Use 3 layers (Permanent Context, Task Context, Local Code Context).
2. **Task Decomposition**: Break complex requests into small, independently verifiable units.
3. **Specification-First Development**: Reference docs before writing code.
4. **Repository-Aware Coding**: Inspect existing entry points, domain types, and data flows first.
5. **Planning Before Implementation**: Write a concise plan for non-trivial tasks.
6. **Small Iterative Changes**: Prefer small changes + tests over large rewrites.
7. **AI Code Review**: Inspect actual `git diff` before declaring completion.
8. **Test / Verification Workflow**: Verify behavior independently with targeted tests/builds.
9. **Debugging with AI**: Evidence before explanation (reproduce → collect logs → root cause).
10. **Git + AI Workflow**: Review uncommitted changes; commit coherent logical units.
11. **Documentation as Persistent Context**: Persist decisions in `/docs/` rather than chat memory.
12. **Knowing When NOT to Trust AI**: Lower confidence and STOP on ambiguous specs, payment/auth changes, or missing specifications.

---

## Agent Roles & Specialist Skills
Operate explicitly in these roles/skills during tasks:
- **Planning Agent**: Requirement interpretation, area identification, task decomposition, risks.
- **Coding Agent**: Focused implementation, contract satisfaction, minimal diffs.
- **Test Agent**: Execution, edge-case verification, attempting to disprove implementations.
- **Review Agent**: Architecture consistency, security checks, zero-hallucinated behavior.
- **Debug Agent**: Reproduce failure, collect logs, pinpoint root cause before edit.

---

## AI Stop Conditions (Must Halt & Ask/Verify)
Halt immediately and seek human/spec confirmation when encountering:
- Requirement conflict between sources.
- Missing specification for business logic or pricing.
- Destructive data migration risk.
- Security boundary / Firestore rule modification without tests.
- Payment / entitlement mutation logic.
- Publication boundary state changes.
- Unexpected architecture expansion.

---

## Definition of Done (AI Task Checklist)
- [ ] Requirement understood & relevant specification read
- [ ] Repository inspected & domain contract verified
- [ ] Plan created & decomposed
- [ ] Minimal implementation completed with zero halluncinated APIs
- [ ] Build & lint verified (`compile_applet` / `lint_applet`)
- [ ] Diff reviewed for unwanted/unrelated edits
- [ ] Documentation updated if architectural changes occurred

---

## The Golden Rules
1. **Read the specification before coding.**
2. **Inspect the repository before changing it.**
3. **Do not treat prototype code as product truth.**
4. **Do not invent missing requirements or pricing.**
5. **Plan before implementing non-trivial work.**
6. **Break large work into small verifiable tasks.**
7. **Change the minimum necessary code.**
8. **Test every meaningful change.**
9. **Review your own diff critically.**
10. **Use evidence when debugging.**
11. **Keep documentation as persistent project context.**
12. **Stop when confidence is insufficient.**
