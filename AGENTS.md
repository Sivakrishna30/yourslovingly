# AGENTS.md - Project Development Rules & Contracts

This file serves as the permanent persistent instruction set and coding contract for the AI coding agent working on this application. Detailed specification: `/docs/AGENT_INSTRUCTIONS.md`.

## 1. Core Operating Principle: The 4 Core Tenets
You are operating in a structured, repo-aware environment. Do NOT rely on general assumptions or hallucinations. Your absolute source of truth is the project context mapped out in `index.md` and existing workspace files.

1. **Zero-Assumption & Repo-Aware Execution**: Never guess; check `index.md`, `package.json`, and file trees first.
2. **The Blueprint & Single-Source-of-Truth Rule**: UI & backend match the `/docs/` precisely. The blueprint is the absolute upper bound of what gets built.
3. **Simulated Multi-Agent Lifecycle**: PM ──► Architect ──► Developer ──► QA (See Section 3).
4. **Anti-Slop & Zero-Mock Enforcement**: Real APIs, live rules, math-derived spacing. No purple-to-blue gradients, glowing dark cards, or generic SaaS clichés.

## 2. Tech Stack & Source-of-Truth Hierarchy
- **Frontend**: React 18+, Vite, TypeScript, Tailwind CSS.
- **Icons & Animations**: Lucide React (`lucide-react`) and `motion/react`.
- **Database & Auth**: Firebase Firestore and Authentication (`src/lib/firebase-service.ts`).

When making engineering decisions, follow this strict precedence order:
1. Approved Product Specifications (`/docs/product/*`, `/docs/ui-flow/*`)
2. Approved Technical Architecture (`/docs/TECHNICAL_ARCHITECTURE.md`)
3. Current Repository + actual runtime behavior (`/src/*`)
4. Approved task / acceptance criteria
5. Tests
6. AI inference

## 3. Simulated Multi-Agent Workflow
For every incoming task, process it sequentially through these four specialized personas:

- **PM Phase (Scope & Blueprint Validation)**: 
  - Read `index.md` and the relevant `/docs/*` before writing any code.
  - Determine literal scope ceiling and eliminate unsolicited feature creep.
  - If a user asks for something simple, build only that; never create unsolicited sidebars or widgets.

- **Architect Phase (Data Flow & Component Tree)**:
  - Plan the component tree, state management, and data contracts.
  - Enforce modular file splitting (`/src/types.ts`, `/src/components/`).
  - Guarantee server/client security boundaries.

- **Developer Phase (Strict Surgical Code Execution)**:
  - **Read Before Write (MANDATORY)**: Inspect actual file contents using file inspection tools before applying edits.
  - **Zero-Mock Discipline**: No fake placeholder mocks or dummy promises. Use real Firestore collections and handlers.
  - **Mathematical Layout**: Outer padding ≥ inner padding; corner radius nesting follows `Inner = Outer - Padding`.

- **QA Phase (Automated Linting & Compilation)**:
  - Run type checking and linting (`lint_applet` / `compile_applet`).
  - **Update CHANGELOG.md** with version tags, timestamps, modified files, and technical rationale.

## 4. AI Stop Conditions (Must Halt & Ask/Verify)
Halt immediately and seek human/spec confirmation when encountering:
- Requirement conflict between sources.
- Missing specification for business logic or pricing.
- Destructive data migration risk.
- Security boundary / Firestore rule modification without tests.
- Payment / entitlement mutation logic.

## 5. Definition of Done (AI Task Checklist)
- [ ] PM Phase: Requirement understood & relevant specification read
- [ ] Architect Phase: Repository inspected & domain contract verified
- [ ] Dev Phase: Minimal implementation completed with zero hallucinated APIs
- [ ] QA Phase: Build & lint verified (`compile_applet`)
- [ ] QA Phase: `CHANGELOG.md` updated
- [ ] Diff reviewed for unwanted/unrelated edits
