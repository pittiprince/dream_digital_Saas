# Review packet: Independent Reviewer, fourth review

Prepared by the Chief Engineer, who wrote Proposal B. Treat this packet as a reading list, not as guidance on conclusions.

## Subjects

- Proposal B revision 5, consolidated: `docs/status/security-hardening-plan-rev5-2026-10-12.md`
- Proposal A revision 5: `docs/operations/sre-architecture-phase-brief-rev5.md`

## Read before judging

- The Security Engineer's review of revision 5, which precedes this review: `docs/security/proposal-b-rev5-security-review-2026-10-12.md`. If that file does not exist, say so and stop: the fourth review follows the Security review.
- The Security reread of revision 4: `docs/security/proposals-security-reread-2026-10-12.md`
- The earlier independent reviews: `docs/status/proposals-second-review-2026-10-12.md` (verbatim) and `docs/status/proposals-third-review-2026-10-12.md` (a condensed record typed by the author; its findings N1 to N10 and F1 to F6 are listed there)
- Code as needed: `.claude/settings.json`, the three hooks under `.claude/hooks/`, `scripts/check-feature-ledger.mjs`, `scripts/test-guards.mjs`, `.gitignore`, `CLAUDE.md`

## Required mapping

Every prior finding mapped to exactly one of: Addressed in the proposal; Partially addressed; Unresolved; Requires owner decision. Prior findings are: N1 to N10 and F1 to F6 of the third review; its five named changes for Proposal A and its eight order contradictions; SR-01 to SR-15, SA4-01 to SA4-09, SC-01 and SC-02 of the Security reread and its 21 consistency rows; and every finding in the Security review of revision 5.

## Output

The reviewer holds no write tool. Its report returns as a message. The Chief Engineer saves that message with the Write tool, word for word, at `docs/status/proposals-fourth-review-2026-10-12.md`, labelled as a transcription by the reviewed party. That is weaker evidence than a file the reviewer or the owner saved.

## If the owner prefers original evidence

Run at your own terminal, from the repository root, and keep the saved file. Every option's effect is unverified until you run it.

```
claude -p --model opus --agent independent-reviewer --strict-mcp-config --output-format stream-json --verbose "Read docs/status/review-packets/independent-review-packet-2026-10-12.md and carry out the fourth review it describes." > <a folder outside the repository>/fourth-review.jsonl
```

The reviewer keeps its shell here because it needs read-only git; its allowlist limits it. The Chief Engineer cannot launch this form.
