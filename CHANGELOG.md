# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to Semantic Versioning.

## [Unreleased]
### Added
- Created `src/lib/svgLibrary.tsx` to provide a programmatic set of high-quality vector assets (Auspicious Kalash, Diya, Mandala, Peacock, Geometric Borders) fulfilling Item 2 without resorting to simple mock SVGs or copyrighted material.
- Authored `/docs/FINAL_VERIFICATION_REPORT.md` capturing Phase 1 completion outcomes.
- Created `CHANGELOG.md` to track QA phase version tags, timestamps, and modified files in accordance with the 4-phase Repo-Aware AI Engineering workflow.
- Adopted the PM ──► Architect ──► Developer ──► QA simulated multi-agent lifecycle in `AGENTS.md`.

### Changed
- **Fixed**: Pre-filling event data when selecting a sample in the `SamplesShowcase`. `App.tsx` now propagates the category, titles, colors, and descriptions from the clicked `SampleInvite` directly into the initialized `LovinglyEvent` draft.
- **Fixed**: WhatsApp Sharing in `src/components/creation/PublishStep.tsx` and `src/components/Dashboard.tsx`. Refactored standard generic hyperlink "Copy Link" into fully encoded `wa.me` intents prefilling the event summary and public URL.
- Refactored `AGENTS.md` to align with the core architectural tenets (Zero-Assumption, Single-Source-of-Truth, Zero-Mock Enforcement, and Anti-Slop).

