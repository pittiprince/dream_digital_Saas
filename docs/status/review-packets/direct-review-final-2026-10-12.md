# Direct-review packets for the final approval gate

Prepared by the Chief Engineer, who wrote Proposal B and the closure amendment under review. **No review of the closure amendment has occurred.** These packets are for sessions the owner launches and saves; nothing below is evidence until the owner has run it. Treat the packets as reading lists, not as guidance on conclusions.

## How the owner launches and preserves each review

Run at your own terminal, from the repository root. Save the output **outside the repository** first; it is the original evidence. Every option's effect is unverified until you run it; the first record of the saved file shows the session's model, tools and attached connectors, so check it before trusting the rest.

Security Engineer, without a shell:

```
claude -p --model opus --agent security-engineer --disallowedTools Bash --strict-mcp-config --output-format stream-json --verbose "Carry out the Security review described in docs/status/review-packets/direct-review-final-2026-10-12.md, part A." > ~/dreamdigital-reviews/security-final.jsonl
```

Independent Reviewer, after the Security review exists (it keeps its shell, which its allowlist limits to read-only git):

```
claude -p --model opus --agent independent-reviewer --strict-mcp-config --output-format stream-json --verbose "Carry out the independent review described in docs/status/review-packets/direct-review-final-2026-10-12.md, part B." > ~/dreamdigital-reviews/independent-final.jsonl
```

Create the folder first. The prompt is the last argument and follows an option that takes no value; a prompt placed directly after an option that accepts several values has been recorded as swallowed. If a session reports a tool call refused by a guard, that is the guard working: do not re-run it in another form.

The Security Engineer writes its own file. The Independent Reviewer cannot write: its verdict is the last record of the saved file. Do not accept a summary or transcription from the Chief Engineer in place of either.

## Part A. Security Engineer

**Read in full:**
- `docs/status/final-closure-amendment-2026-10-12.md`
- `docs/status/security-hardening-plan-rev5-2026-10-12.md`, section 3 (which section 1 of the amendment replaces), section 7, section 8
- `docs/testing/ledger-test-specification-2026-10-12.md`
- Your own review of revision 5: `docs/security/proposal-b-rev5-security-review-2026-10-12.md`

**As needed:** `docs/operations/sre-architecture-phase-brief-rev5.md` sections 3.6, 7.3, 8.4, 9.1; `.claude/hooks/path-guard.mjs`; `scripts/check-feature-ledger.mjs`; `scripts/test-guards.mjs`; `docs/status/proposals-fourth-review-2026-10-12.md` (a transcription by the author).

**Answer:**
1. Does the corrected patch route close S5-01: can any agent-written change, test or patch, be applied or executed before both reviews? Is anything now missing from the route?
2. Does section 2 of the amendment remove the differences on identity attestation and scan ownership, without weakening either document?
3. Does the ledger test specification contain a test case, with an expected failing behaviour, for every false-acceptance input you raised (S5-03 to S5-08, S5-13 to S5-15)? Name any missing or mis-stated case.
4. The residual-risk register: for each of the twelve rows, do you agree with the recommended class? Name any finding that should block the phase and is not marked so.
5. Any new finding, with severity.

**Required verdict, in these words:** for the amendment, one of "S5-01 closed in text", "S5-01 not closed"; and one of "no objection to the owner approving O1 to O3", "objection", each with reasons; and a statement of whether any High or Critical finding remains unresolved. State that the review approves nothing.

**Write one file yourself:** `docs/security/final-closure-security-review-2026-10-12.md`. Read and Write only; no shell; no probe of any guard; no connector.

## Part B. Independent Reviewer

**First confirm** that `docs/security/final-closure-security-review-2026-10-12.md` exists and read it. If it does not, say so and stop.

**Read in full:** the closure amendment; the ledger test specification; the Security review of revision 5 and the final Security review; `docs/status/proposals-fourth-review-2026-10-12.md`.

**As needed:** both revision 5 proposals; the code named in part A; `docs/status/baseline-commit-readiness-rev3-2026-10-12.md`.

**Answer, compactly:**
1. Map each of these to Addressed in the proposal, Partially addressed, Unresolved, or Requires owner decision, with the place checked: S5-01 to S5-16, S5-A1 to S5-A6, R4-01 to R4-13, F1 to F6.
2. The ledger test specification against the plan's rules: any false-acceptance input still without a test case; any case whose expected result is wrong on the code.
3. The residual-risk register: is each class supported; is any risk accepted on the owner's behalf.
4. The readiness report: is its manifest equal to the output of `git status --porcelain --untracked-files=all --ignored` (run the plain form, with no extra option); does it claim any scan or verification that was not performed.
5. Any new problem, with severity.

**Required verdict, in these words:** separately for Proposal A and Proposal B, read with the amendment, one of "ready for the owner's decision", "ready with named minor changes", "not ready"; whether O4 may start; and every unresolved High. State that the review approves nothing.

Read-only; no probe or bypass of any guard; no connector; a guard refusal stops the operation and is quoted.

## What counts as done

A review has occurred when the owner holds its saved output. Until then the review record for the closure amendment is: **none.**
