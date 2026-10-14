# Independent Reviewer, third review, 2026-10-12: condensed record

**This is not the reviewer's verbatim report.** The reviewer holds no write tool. The Chief Engineer, who wrote Proposal B and is criticised in the review, condensed the reviewer's hand-back message into this file with the Write tool. Wording in quotation marks is the reviewer's. The full text exists only in the orchestrating session's conversation. The reviewer's own advice applies: the owner may compare this file with that message, or re-run the review as a session the owner launches and saves.

Subjects: Proposal A revision 4 (`docs/operations/sre-architecture-phase-brief-rev4.md`); Proposal B revision 4 with amendment 1 (`security-hardening-plan-rev4-2026-10-12.md`, `security-hardening-plan-rev4-amendment-1-2026-10-12.md`). Method: reading only; all guard and checker analysis static; nothing run or probed; no connector called.

## Verdicts (recommendations only; the reviewer approves nothing)

- **Proposal A: "ready with named minor changes", all before the O3 capture.**
- **Proposal B: "not ready as a whole".** O1, O2 and O3 change no protected file and can go to the owner now. One new High finding, N1.
- The amendment answers both Security Highs (SR-01, SR-02), and the Security Engineer has not read it.

## Named changes for Proposal A

1. S6 and S7a to S7c: full path to the system search tool, exit status saved, names-and-numbers form (Security SA4-01, SA4-02).
2. Align the brief with the amendment (N8): identity instruction in the owner's own prompt, a probe path unique per session, rules R1 to R9, the contents of O1.
3. Security SA4-04, SA4-05, SA4-09: read every tool-call record, state custody of the launch-time settings file, add `.git/` to criterion 3.
4. Section 1.1 relabelled as policy ("no fenced role can launch it" is wrong on the code, `path-guard.mjs:68`); section 1.4 understatements.
5. Stale "unreviewed" lines.

"Approving the brief does not open the phase."

## Blocking items for Proposal B, from O4 onward

1. **N1 (High) and N2:** freeze the ledger header and the set of stage lines at the opening commit, with tests.
2. **N3 and N4:** repair rules R7 and R2.
3. **N5:** restate what amendment section A2 dropped from revision 4 section 3.
4. **N7:** define three undefined inputs.
5. The Security Engineer reads the amendment, or a consolidated revision that folds it in.

Not blocking if fixed before O4: N6, N9, N10, F3, F4.

## New problems

| # | Severity | Problem | Action |
|---|---|---|---|
| N1 | High | Rule R1 applies only to agents the ledger header lists under `no-shell:`. The header is typed and nothing freezes it, so a ledger that omits `devops-sre` there lets the main author's stage be ticked by a `run:` line from any delegated run | Read the header and the stage-line set from the opening commit's copy; the working copy may differ only in ticks, evidence, `accepted`, `learning-complete` |
| N2 | Medium | Rule R4 fails unticked lines, not absent ones: a missing deliverable is invisible | As N1 |
| N3 | Medium | Rule R7 forbids any ledger change after acceptance, but `understanding-check` and `learning-complete: yes` come after acceptance (`check-feature-ledger.mjs:90-93`, `CLAUDE.md`) | Allow those two changes |
| N4 | Low | R2 allows a session file's first commit to be the opening commit; R7 says that commit holds the ledger only | "A descendant" only |
| N5 | Medium | Amendment A2 "replaces" section 3 and omits where patches live, the failing-first run, the Security requirement and the owner's verifying run | Say "amends", or restate |
| N6 | Low | R8, R9 and the script-location fix change two more test cases, unlisted; no stated way for tests to point the checker at a fixture | List them |
| N7 | Medium | Undefined: where the "set captured at O3" is read from; what text "carries the approval"; the exit status of an "attested" stage | Define each |
| N8 | Medium | The brief predates the amendment and contradicts it; by the brief's own rule, where the two disagree neither is followed | Brief revision 5 before O3 |
| N9 | Low | `.github/` dropped from protected prefixes while a test still predicts a block there | Re-predict |
| N10 | Low | Stale "reviewed by nobody" lines; "left exactly as it stood" unclear for revision 3 | Correct |

## Inputs that still pass the design-tier binding falsely

| # | Input | Fix |
|---|---|---|
| F1 | Ledger whose `no-shell:` line omits `devops-sre`, plus a `run:` line for it | As N1 |
| F2 | One ticked `authoring` line; the others never added | As N1 |
| F3 | A copy of the O3 capture file at a new path, committed after O5 | A probe path unique per session; session start time at or after the opening commit |
| F4 | A git-ignored local settings file created in the window; or a change outside `docs/` made and reverted | Check ignored paths and per-commit name lists |
| F5 | An owner line citing any commit hash | Define the approval text |
| F6 | An appended run record; a genuine session launched and committed by another shell | Policy until steps 3 and 6; acknowledged in the amendment |

On the documented limitation and its alternative: "Honest, and safe in direction", "not yet adequate": whether an attested stage lets acceptance pass is undefined, the attestation wording is undefined, and the brief still describes the older text-form check.

## Execution order

O1 to O9 is the same sequence in all three documents. "It is not yet unambiguous." Eight contradictions, in short: the brief disagrees with the plan as amended; the amendment requires a brief revision before O3 that is in no row; the brief's O1 lacks the attestation and privacy decision; identity instruction in a task file against the owner's prompt; QA at O4 "without a shell" against "or the residual is recorded"; the owner-run scan applies from O2 but no step writes its procedure; the brief's open questions are now answered by the amendment; no step has Security read the amendment before O4.

## Owner's requirements for this round, as the reviewer found them

| Requirement | Met? |
|---|---|
| B: every blocking second-review finding addressed | Partly (B-N1, B-N2, B-N3, B-N10 partial) |
| Six rows with two reviewers | Met |
| Seven-ledger-test prediction | Met, residue N6 |
| H-42, H-47 statements | Met |
| A/B timing conflict | Met |
| Binding to the owner-launched session and identity | Partly: "owner-launched" cannot be established and that is documented; identity is conditional on the capture |
| No pass on an unrelated historical record | Partly: pre-opening records excluded; F1, F3 remain |
| Mechanism, observed, policy kept apart | Mostly met |
| No control claimed working from a document | Met |
| A: role verified before launch; one write fails and one succeeds | Met in text |
| A: both search patterns corrected | Partly: S2 met; S6 depends on which search tool runs |
| A: Chief Engineer inside the phase, outside the confinement | Met |
| A: scope and confinement | Met as rules |
| One unambiguous order | Partly |
| Neither represented as approved | Met |

## Mapping, in summary

- Second review, B-N1 to B-N10: Addressed B-N4, B-N5, B-N6, B-N8, B-N9; Partial B-N1, B-N2, B-N3, B-N7, B-N10. H-42 and H-47: Addressed.
- Second review, A-N1 to A-N6 and T-10: all Addressed except A-N4, Partial.
- Security reread: Addressed SR-01, SR-09, SR-11, SR-12, SR-14, SR-15; Partial SR-02, SR-03, SR-05, SR-06, SR-07, SR-08, SR-10, SR-13, SA4-04; Requires user decision SR-04; Unresolved SA4-01, SA4-02, SA4-03, SA4-05 to SA4-09 and SC-01.
- Of Security's 21 consistency rows: 14 Addressed, 4 Partial, 3 Unresolved (rows 2, 15, 20).
- Remediation matrix: dispositions too favourable on B-N2, B-N7, B-N10, SR-02, SR-03, SR-07 and some mismatch rows; missing SA4-08, SC-01, consistency row 8, the repository-state rows and Security's 66 earlier-item rows.
- Citations: 27 checked in the amendment and in sections 7 and 8 of revision 4; no line number wrong.

## How the round was produced

- Run log lines 21 to 24, end times UTC on 2026-10-12: independent-reviewer 04:45:31; devops-sre 05:07:15; qa-test-engineer 05:10:29; security-engineer 05:29:34. `devops-sre` and QA ended 194 seconds apart; the reviewer could not tell whether they overlapped.
- Listing: 52 untracked files, one ignored. Seven new since the second review, all under `docs/`. Outside `docs/`, the same 24 names as before; content changes cannot be determined with no commits.
- Revision 3 of the plan was edited after the second review (its header now quotes that verdict). The brief's revision 4 was again written by a delegated run that held a shell.
- The scan after a guard refusal went to QA's open shell; the amendment concedes this.

## Baseline

Scan evidence: sound as triage; exposes no matched text. Three hits classified by the reviewer as not credentials (the pattern list in the revision 4 brief; two run-log hashes in the readiness report; long tool names in `da-vinci.md`). Three hits classified by nobody: check 2 in the revision 3 brief and in the first security review; check 7 in the evidence file. Not covered: files written since the scan, the run log, identifiers of 32 to 39 characters, account-number and bucket shapes, names. Run log: 24 lines at the time of review, still ignored, earlier lines consistent with the previous review's description; the reviewer cannot hash it.

Before committing, the owner should: decide the privacy question first; open the three unclassified hit lines; re-run the scan personally over the final file set with the system search tool; run `node scripts/test-guards.mjs` and save the output; compute the run log's line count and SHA-256 for the commit message; read `.git/config` and list `.git/hooks/`; not push.

## Limits the reviewer stated

Read and read-only git only; no content search, hashing or `node`. Not read: the first reviews, the Architect's review, QA's test plan, validation records and evidence transcripts, `docs/learning/`. It relied on the second review and the Security reread for what earlier findings asked, and on QA's statement of the commands it ran.
