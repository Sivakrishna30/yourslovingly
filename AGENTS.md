# AGENTS.md - Project Development Rules & Contracts

This file serves as the permanent persistent instruction set and coding contract for the AI coding agent working on this application.

## Core Directives & Guidelines
1. **Strict Respect for User Intent**: Build exactly what the user asks for. Avoid unsolicited features, sidebars, or over-engineering.
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
