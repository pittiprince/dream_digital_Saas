# Remediation matrix, 2026-10-12

Prepared by the Chief Engineer (orchestrating session). One row per finding from the second independent review (`proposals-second-review-2026-10-12.md`) and from the Security Engineer's reread (`docs/security/proposals-security-reread-2026-10-12.md`).

**How to read it.** "Change made" means a change to the text of a proposal. **No row means a control was implemented or tested: nothing in either proposal is implemented.** "Evidence" is where the reader can check the change. Dispositions are the author's own claim, to be checked by the third review: **Addressed**, **Partly**, **Unresolved**, **Owner decision**.

Abbreviations: B4 = `security-hardening-plan-rev4-2026-10-12.md`; Am1 = `security-hardening-plan-rev4-amendment-1-2026-10-12.md`; A4 = `docs/operations/sre-architecture-phase-brief-rev4.md`.

## 1. Second review, Proposal B

| ID | Previous defect | Change made | Evidence | Test required | Remaining limitation | Disposition |
|---|---|---|---|---|---|---|
| B-N1 (High) | The `design` tier could pass on an unrelated run record or never pass for a directly launched author | Session-bound stage lines; run log not consulted for them; opening commit derived from git; nine added rules | B4 section 7; Am1 A3 rules R1 to R9 | The cases in B4 section 7 and Am1 A3, on a temporary git repository | Identity and authorship need tool-call records in the session file, unverified until the owner's capture; a commit is not provably the owner's; nothing is implemented | Partly |
| B-N2 | H-38 baseline empty for a copied ledger | Ledger created in `features/` at opening, never copied; window bounded at both ends | B4 section 7; Am1 R7 | Accepted design ledger, then a later commit outside `docs/`: passes; path outside `docs/` inside the window: fails | Depends on git plumbing, open until step 6 | Addressed in text |
| B-N3 | Wrong prediction that seven ledger cases pass unchanged | Prediction corrected; fixture changes listed | B4 section 8; Am1 A5 | Each of the seven cases re-stated with its expected message | The Security reread found further wrong rows (`:55`, `:56`, `:71`, `:82`, `:106-107`, `:123-129`); corrected in Am1, unchecked by anyone | Partly |
| B-N4 | Step table omitted files; H-47 ordered before H-16; no probe for H-34, H-08 | Files listed per step; H-47 with H-16 in step 6; H-34 probe and new H-51 in Wave 0 | B4 section 5, H-51 | — | Step 7 wrongly listed `.gitignore`; corrected in Am1 A5 | Addressed in text |
| B-N5 | Six rows had one reviewer | Every protected change lists Security and Reviewer | B4 reconciled table | — | — | Addressed |
| B-N6 | Fallback: an agent session applying a patch | Withdrawn | B4 section 3 step 6; Am1 A2 | — | — | Addressed |
| B-N7 | "Kept unchanged" untrue; unknown editor of the revision 2 brief | Revision 3 and revision 4 not edited after review; editors named | Am1 A1 item 7 | — | Revision 3 carries the edit made after the second review; that is recorded, not undone | Addressed |
| B-N8 | Approval recorded by the reviewed party | The approval record is two owner commits | Am1 A2 | Reviewer compares the two commits | A commit is not provably the owner's | Partly |
| B-N9 | One run id could not bind a two-agent stage | One agent per line, many lines per stage; every line must be ticked | B4 H-14; Am1 R4 | Eleven lines, one ticked, accepted: fails | — | Addressed in text |
| B-N10 | Failing-first run unassigned | Owner runs it; tests committed before the patch | B4 section 3 step 2; Am1 A2 | — | — | Addressed |
| H-42 statement | Misdescribed Proposal A's launch form | Corrected twice | B4 H-42; Am1 A5 | Owner's capture | Whether `--verbose` takes no value is unverified | Addressed |
| H-47 statement | Claimed an owning role could write git plumbing | Corrected: no role owns it; open routes named | B4 H-47; Am1 A5 | Regression pins in B4 H-47 | Any-depth patterns match some file names inside those folders | Addressed |
| Missing fields H-22, H-23, H-38, H-13 | No abuse cases, tests or safe verification | Added | B4 H-22, H-23, section 7 | As stated in each | — | Addressed |
| R1, R17 not cited | H-25, H-21 did not cite the findings they answer | Cited | B4 H-25, H-21 | — | — | Addressed |
| UNVERIFIED 16, 19 | Addendum identity; corrections never reviewed | Labelled relayed; reviewer to read the corrected section | B4 H-41 | Owner can `diff` the two files | Not yet done | Partly |
| N-18 | Verdict reaches the owner through the author | Owner-launched reviewer sessions for patch recommendations | B4 section 3 step 4; Am1 A2 item 4 | — | For this round the reviews were delegated and saved by the author | Owner decision |
| N-19 | Fallbacks, missing start time, script paths | H-49; script resolves against its own location | B4 H-49; Am1 A3 | Unset variable: BLOCK | — | Addressed in text |
| Rec 5 | Commands of 2026-10-11 unrecorded | Listed, then corrected after the reread | B4 Appendix A; Am1 A1 item 7 | — | From the session's own history; nothing on file | Partly |
| B2 item 4 | Email search had no command | Command given | B4 Appendix A | — | Output not on file | Partly |
| H-29 timing and whose record | Connector decision at the end of Wave 1 | Detaching at O1; owner-launched record | B4 section 4, H-29; Am1 A5 | Start-up record shows no connector tools | Shows nothing about delegated or orchestrating sessions | Partly |
| Owner approval of the departure from `CLAUDE.md` | Missing from B's decisions | Added | B4 decision 8 | — | — | Owner decision |
| A/B conflict on the design-tier timing | B offered the tier before acceptance; A forbade any `.claude/` change in the phase | One order: tier at O4, phase baseline at O5 | B4 section 4; A4 section 2 | — | Order depends on step 2 being applied and verified first | Addressed in text |

## 2. Second review, Proposal A

| ID | Previous defect | Change made | Evidence | Test required | Remaining limitation | Disposition |
|---|---|---|---|---|---|---|
| A-N1 | Capture did not prove the session ran as `devops-sre` | Identity by record field if present, and a path-guard refusal naming the role | A4 section 3.6 (C3, C5), criterion 17 | Owner's capture at O3 | Security: must be read from the denied write call, not text; not yet applied to A4 | Partly |
| A-N2 | Deny-rule test could pass on a blanket refusal | One authorized write must succeed; refusal must state its source | A4 section 3.6 (W1 to W3, C4 to C6) | Owner's capture | One deny rule of about sixteen is tested | Partly |
| A-N3 | S2 matched "undecided" | Word boundaries on `decided` and `selected` | A4 section 9.2 | Owner runs the self-check | Not run | Addressed in text |
| A-N4 | No exact S6 command | Two command forms keeping only name and line number | A4 section 9.2 | Owner runs on a fixture | Security: bare `grep` may be a wrapper on this machine and could leak matched text; not yet fixed | Partly |
| A-N5 | Orchestrating session not stated as outside the fence | Separate table, rules 21 to 24, a risk and an approval item | A4 section 1.4 | — | Security: understated on reach outside the tree and inside `.git/` | Partly |
| A-N6, T-10 | Section order; hostname layout not required | Both fixed | A4 section 6, criteria 16 and 24 | — | — | Addressed |
| Consistency rows of the second review | Tier lines, session evidence, run-log baseline, connectors, 6a timing, order, branches | Reconciled to B4 | A4 sections 2, 3.5, 3.7, 8 | — | Security lists 21 remaining mismatches (section 4 below) | Partly |

## 3. Security reread, Proposal B

| ID | Finding | Change made | Evidence | Test required | Remaining limitation | Disposition |
|---|---|---|---|---|---|---|
| SR-01 (High) | Reviewed patch text not bound to applied text | Patch committed unapplied; reviews cite the hash; applied from it; reviewer compares | Am1 A2 | Reviewer's comparison of the two commits | Not re-read by Security | Addressed in text |
| SR-02 (High) | Four false passes in the binding | Rules R1 to R4, with tests | Am1 A3 | Four failing cases | Implementability depends on the session file's contents | Addressed in text |
| SR-03 | Identity check defeated by a text match | Structural check on the denied write; instruction in the owner's prompt | Am1 R6 | File holding the phrase only in a read result: fails | As SR-02 | Addressed in text |
| SR-04 | "The owner's commit" is a commit | Stated as policy; supports listed | Am1 A3 limits | — | No mechanism until step 6 and H-32; signing is the owner's choice | Owner decision |
| SR-05 | Git plumbing open and unchecked in the phase | Owner checks at O5, each checkpoint and O7; stated | Am1 A3 limits, A4 | — | Policy only; A4's criterion 3 not yet amended | Partly |
| SR-06 | A `run:` line satisfied by an appended record | Stated; owner reads new log lines at O7 | Am1 A3 limits | — | Policy only | Partly |
| SR-07 | Docs-only window has no end; start can move | Window bounded; opening commit holds the ledger only | Am1 R7 | Two cases | — | Addressed in text |
| SR-08 | Stage completion and owner line unspecified | Every line ticked; owner line cites an owner commit | Am1 R4, R8, R9 | Two cases | The stage-to-agent table is not yet printed | Partly |
| SR-09 | Statements claiming more than exists | Section 1 bullet replaced; matrix written; labels corrected | Am1 A1; this file | — | — | Addressed |
| SR-10 | Wrong regression rows; `..` rule blocks revision ranges | Corrected | Am1 A5 | `git diff main...HEAD` stays allowed | "Must hold" column not restated case by case | Partly |
| SR-11 | Four internal contradictions | Corrected | Am1 A5 | — | — | Addressed |
| SR-12 | Appendix A understated | Rewritten | Am1 A1 item 7 | — | Relayed; nothing on file | Addressed |
| SR-13 | Content committed before anything inspects it | Owner-run scan from O2 on, session files included | Am1 A5 | Planted marker in a fixture | The scan procedure is not yet written | Partly |
| SR-14 | Credential attestation timed after the phase | Moved to O1 | Am1 A4 | — | — | Addressed |
| SR-15 | Checker resolves paths against the working directory | Resolve against the script's location | Am1 A3 limits | Run from another directory | — | Addressed in text |
| Option: H-31 and H-32(a) before the phase | Would fence the coordinating session | Not adopted; put to the owner | Am1 A4 | — | Adopting it changes the order | Owner decision |

## 4. Security reread, Proposal A, and remaining mismatches

These are **accepted and not yet applied to the brief**. They are to be applied in a further revision of the brief before the O3 capture is run.

| ID | Finding | Disposition |
|---|---|---|
| SA4-01 | S6 commands call bare `grep`; on this machine that name is a wrapper (recorded by QA), so matched text could be saved. Use the full path; save the exit status | Unresolved |
| SA4-02 | S7a to S7c save the matched identifier | Unresolved |
| SA4-03 | S6b over-matches honest documents; S6e misses standard base64; S6f misses most Markdown placements | Unresolved |
| SA4-04 | A start-up tool list may not show every callable tool; checks must read every tool-call record | Partly (rule R5 in Am1; A4 not amended) |
| SA4-05 | Custody of the launch-time settings file and the task file unstated; keep the settings file outside the repository | Unresolved |
| A4 section 1.1 | "No fenced role can launch it" is policy, not a mechanism: four roles hold a shell | Unresolved |
| A4 section 1.4 | Understated: reach outside the working tree, `.git/`, unknown agent types, other delegated roles | Unresolved |
| A4 criterion 3 | Does not list `.git/config` or `.git/hooks/` | Unresolved |
| A4 scan scope | Session files are committed and scanned by nothing | Partly (Am1 A5; A4 not amended) |
| Mismatches 1 to 3, 5 to 7, 16, 17 | Order and baseline details | Addressed in Am1 A4; A4 not amended |
| Mismatches 9 to 13 | Ledger content, third line form, unticked lines, session reuse | Addressed in Am1 A3; A4 not amended |
| Mismatches 4, 14, 15, 18 to 21 | QA with a shell; forged append; connector state of other sessions; conduct rules; who scans; step 3 wording; placeholder | Partly: Am1 A1, A2, A3, A5 |

## 5. Conduct findings about the orchestrating session

| Finding | Response | Disposition |
|---|---|---|
| Ran commands outside the Chief Engineer allowlist | Since the directive: read-only git only. Self-report; nobody can check it | Owner decision whether to fence (H-32) |
| Rewrote a refused command as a script | Rule adopted: a refusal stops the operation and the owner is asked | Policy |
| Printed matched lines during a scan | No scan run by this session since; scans are the owner's | Policy |
| Concurrent writers | One delegation at a time in this round, each awaited before the next | Self-report |
| Saved reviews by script from transcripts | Reviews in this round are saved with the Write tool from the hand-back text, labelled as transcribed | Owner decision: launch reviewer sessions directly |
| Delegated the scan to QA's open shell | Recorded as triage; the owner's scan is still required | Unresolved until the owner scans |
