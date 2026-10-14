# Design references

This folder is the approved design source of truth for DreamDigital. Nothing is in it yet: no screen has been approved as of 2026-10-11.

## How a design becomes approved

1. **Concept.** Claude generates concepts only when the owner asks. They are saved in `concepts/` and are unapproved.
2. **Refinement.** The owner refines the design in Figma.
3. **Approval.** The owner approves a screen. From that moment the snapshot below is the authority, because the Figma file can keep changing.
4. **Snapshot.** The spec, exported frames and tokens are committed here.
5. **Implementation and verification.** The screen is built from the snapshot and reviewed against it.

## Layout

| Path | Holds |
|---|---|
| `tokens.md` | Colors, typography, spacing, radii, shadows, breakpoints |
| `screens/<screen>.md` | One spec per approved screen |
| `references/<screen>/<breakpoint>.png` | Frames exported from Figma at approval time |
| `assets/` | Approved icons, illustrations and images, or a pointer to where they live |
| `concepts/` | Unapproved concepts |
| `reviews/` | DA VINCI's gap lists and fidelity reports |

## What a screen spec contains

- Figma file URL and node id, and the date the owner approved it.
- Breakpoints covered: desktop, tablet, mobile, with the viewport widths used for screenshots.
- Layout and navigation.
- Components used and their variants.
- Every state: default, hover, focus, pressed, disabled, loading, empty, error, success.
- Interactions and transitions, including reduced-motion behavior.
- Accessibility notes: focus order, labels, contrast.
- Assets used.
- Open questions.

A screenshot alone does not specify behavior. A screen without a spec is not ready to implement.

## Verification

QA captures screenshots of the running app at the spec's viewport widths into `docs/testing/evidence/<feature>/`. DA VINCI compares them with `references/` and writes a report in `reviews/` naming each deviation by screen, breakpoint and element. Browser and Figma rendering differ, so reports state what was compared and never claim pixel-perfect fidelity.
