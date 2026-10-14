# Final closure amendment to Proposal A revision 5 and Proposal B revision 5

Date: 2026-10-12. Author: Chief Engineer (orchestrating session). **Proposed. Not approved. Nothing applied. Not reviewed by anyone:** it was written after the Security review of revision 5 and the fourth independent review, and answers them. No new review has occurred.

**Why a separate file.** Revision 5 of the plan and of the brief are left exactly as the reviewers read them. This amendment changes four things and nothing else. Where it differs from either revision 5, this amendment governs. The texts themselves still need these changes folded in at their next revision; until then both documents are read with this file.

Subjects: Proposal B, `docs/status/security-hardening-plan-rev5-2026-10-12.md` ("the plan"); Proposal A, `docs/operations/sre-architecture-phase-brief-rev5.md` ("the brief").

Labels as in the plan: **mechanism**, evidence grades (*recorded*, *relayed*, *static*, *unverified*), **policy**. Nothing here is implemented or tested.

## 1. Patch route, corrected (answers S5-01 High, S5-02, R4-08, R4-11)

**Defect.** In the plan's section 3, step 4 had the owner apply, run and commit QA's test change before the Security and Independent Reviewer reviews at steps 5 and 6. Agent-written code would have run at the owner's terminal, outside every hook, unreviewed. For step 1 of the hardening (H-12) the whole change is a test change.

**Replacement for the plan's section 3, steps 1 to 11.** No agent-written change, test or patch, is applied or executed before both reviews.

1. **Patch text** is written as a unified diff under `docs/status/hardening-patches/`. The author never reviews, approves or applies it.
2. **Test diff.** QA writes the new and changed cases as a diff to `scripts/test-guards.mjs`, saved under `docs/testing/hardening-tests/`, in a session **the owner launches without a shell**; the owner saves that session's output, whose start-up record shows its tools. QA cannot overwrite `scripts/test-guards.mjs` (static: no ownership pattern matches that name; QA's any-depth patterns do admit other test-named files under `scripts/`, finding H-16).
3. **The owner commits the patch file and the test diff, unapplied and unexecuted.** That commit hash identifies the text under review.
4. **Security Engineer review of both files** at that hash. The reviewer reads the committed text with `git show <hash>:<path>`, which its allowlist admits (static, `.claude/hooks/path-guard.mjs:42`). The review cites the hash and both paths.
5. **Independent Reviewer recommendation on both files** at that hash, after reading the Security review.
6. Both reviews come from sessions the owner launches and saves. For the Independent Reviewer this is the only form, because that role cannot write and a copy typed by the author is a transcription.
7. **Before applying anything,** the owner lists the files each diff touches (`git apply --stat <file>`) and compares them with the plan's step table.
8. **Only now is the test diff applied:** the owner runs `git apply --check <test diff>` then `git apply <test diff>`, with no agent session open, then `node scripts/test-guards.mjs`, saving the raw output under `docs/testing/evidence/hardening/`. This is the failing-first run: it must show the failures the entry predicts. The owner commits the test change, citing the reviewed hash.
9. **Then the patch is applied** the same way, from the same reviewed commit, one step per commit on a hardening branch, the message citing the reviewed hash.
10. **The owner verifies:** `node scripts/test-guards.mjs`, raw output saved. That output is what makes a fix "verified".
11. **The Independent Reviewer's final check,** owner-launched: the applied diffs equal the reviewed diffs, by `git show` on the commits; the failing-first output shows the predicted failures; the verifying output shows the predicted results. If the failing-first output differs from the prediction, the step stops and returns to step 1.

What the reviewers no longer have at steps 4 and 5 is the failing-first output; they review the tests by reading. The output is checked at step 11 instead. That is the cost of not running unreviewed code.

## 2. Reconciliation of the two documents

**2.1 Identity: probe or attestation** (S5-A3; plan section 7 rule 8 and decision 4; brief section 3.6 item C5 and section 8.4).

The brief made the refused out-of-lane write mandatory; the plan let the owner attest instead. Both needed the same fact. One rule now governs both:

- **At the launch capture (O3) the probe is mandatory and cannot be attested.** The phase does not open unless the saved capture shows the path guard refusing the out-of-lane write and naming `devops-sre`. This shows once, by mechanism, that the launch form produces a session fenced as the role.
- **During the phase, each owner-launched session still attempts its own unique probe write**, as instructed in the owner's prompt.
- **Whether the checker can verify that refusal per session depends on the record format the capture reports.** If it can, rule 8 is checked structurally. If it cannot, and only then, the owner may attest per session with the plan's exact line, the stage is reported "attested, not verified", and the ledger exits with status 3.
- Attestation is never available for the capture itself, for rule 7 (the tool allowlist) where the first record lists tools, or for a session whose file is missing.

**2.2 Who runs content scans** (S5-A4; plan section 1 item 6; brief sections 7.3 and 9.1).

The plan said the owner runs content scans; the brief still offered a role launched without a shell. One rule now governs both:

- **Every content scan whose result is committed as evidence, or on which an acceptance criterion or a commit decision rests, is run by the owner**, with the system search tool by full path and output limited to file names and line numbers.
- The brief's option of a no-shell searcher is withdrawn.
- A role may still use its own search tool to do its own reading. That is not a scan and produces no evidence.
- **One exception requires the owner's explicit, direct instruction for that occasion:** a count-only triage scan delegated to QA, labelled as triage, which never replaces the owner's scan. The scan recorded in `docs/testing/evidence/` for this closure pass is of that kind.

**2.3 Smaller alignments.**
- No file named `CLAUDE.md` and no `.claude/` folder may exist anywhere under `docs/`, not only under `docs/operations/` (R4-03). This applies to the brief's criterion 23 and the plan's rule 11.
- The owner launches QA's no-shell sessions (R4-08).
- The plan's header sentence "earlier revisions are kept unedited" is corrected to: revisions 4 and 5 and the amendments have not been edited since they were written; revision 3 of the plan was edited twice after it was first written, as Appendix A records (R4-10).
- The plan's H-16 prediction "`.Claude/x`: ALLOW today" is wrong: a named role is refused today (static, `path-guard.mjs:86`). It becomes a regression pin. H-33's "`ok` today" for an underscore-prefixed ledger is corrected to "skipped today" (`check-feature-ledger.mjs:106`).

## 3. Ledger false-acceptance findings as test cases

Every remaining false-acceptance finding (the Security review's on the plan's section 7, the fourth review's R4-01 to R4-06, and the third review's F1 to F6) is converted into an explicit test case with its expected failing behaviour in **`docs/testing/ledger-test-specification-2026-10-12.md`**, written by QA. If that file is absent, the conversion has not been done. Those cases are the failing-first test file for hardening step 2: the step 2 patch is not written until each case exists as a test, and the patch is judged by them, not by further review of prose.

## 4. Residual-risk register: the twelve High findings open through the SRE phase

These twelve stay unfixed while the phase runs, even if the pre-phase steps (test repairs, the ledger check, fencing of unassigned sessions) are applied and verified. **This register recommends; it accepts nothing.** Each row needs the owner's own decision, recorded in the owner's words.

**No restriction named below is verified today.** "Verified by" says what evidence would verify it and when.

Assumed conditions of the phase, each itself unverified until shown: `devops-sre` is launched by the owner without a shell; the other roles taking part are the Software Architect and SAGE (no shell), the Security Engineer and the Independent Reviewer (shell limited to a read-only allowlist, recorded as refusing other commands); the four roles with an open shell take no part; the orchestrating session is fenced by step 3; connectors are detached.

| ID | What stays open | How it could bite during the phase | Containment available | Verified by | Recommended class |
|---|---|---|---|---|---|
| H-29 | Connector tools are outside every guard | A session with an attached connector could send mail, spend credits or change external resources; hostile text could ask it to | The owner detaches connectors at O1 | The start-up record of each owner-launched session. **Nothing shows the connector state of delegated sessions or of the orchestrating session**; several delegated agents reported connector instruction text in their context this week | **Must block** until connectors are detached and one owner-launched record shows none. The gap for delegated sessions needs an explicit owner decision |
| H-35 | Any role can read any file the machine user can, inside or outside the project | A phase session reads a personal credential in the home directory; for `devops-sre` it lands in the saved session file and may be committed | Launch-time deny rules on home credential paths for owner-launched sessions (unverified); the owner's scan of each session file before committing; none for delegated roles | The launch capture, if deny rules are adopted; otherwise nothing | **Must block unless** the owner either verifies a read restriction in the capture, or states in writing that no credential they care about is readable in the home directory. Not a risk to accept by default |
| H-01 | Four roles hold an open shell | Only if one of those roles runs in the phase | Not delegating to them. This is policy: a fenced coordinator can still start them, because the agent tool is outside the hook matcher (static, `settings.json:55`) | After the fact, by the run log (corroboration) read by the owner at O7 | **Containable**, by a restriction that is policy today. The owner decides whether policy plus the O7 reading is enough, or whether a `deny` rule on those four agent types is added to pre-phase hardening |
| H-02 | No filesystem enforcement for shells | As H-01; the two allowlisted shells are read-only by mechanism | As H-01 | As H-01 | **Can wait**, if H-01 is contained |
| H-05 | Destructive commands are covered by one spelling | As H-01 | As H-01 | As H-01 | **Can wait**, if H-01 is contained |
| H-04 | Manifests and delivery config are in the `devops-sre` lane | A no-shell `devops-sre` can still write `package.json`, `.github/`, `.gitignore` with the file tool | Launch-time deny rules (unverified); detection against the phase baseline with git, which is reliable once commits exist | The capture for prevention; the owner's `git status` and `git diff` after each session for detection | **Containable by detection.** Prevention is unverified |
| H-16 | Any-depth patterns reach protected folders; nested instruction files | `devops-sre` writes a `Dockerfile`-named file under `.claude/`, or a nested `CLAUDE.md` under `docs/` | Launch-time deny rules (unverified; one of about sixteen is tested); the listing after each session | The listing, read by the owner or the reviewer after each session | **Containable by detection.** Whether a nested instruction file loads is unknown until probed (H-28) |
| H-34 | A git-ignored local settings file may outrank the project | A session with write access outside its lane creates it; the next session runs under different rules | The file is absent today (recorded); the opening commit records the ignored files present; the listing shows any new one | `git status --ignored`, by the owner at each checkpoint | **Containable by detection** |
| H-10 | A run record can be fabricated | A forged line satisfies a `run:` line for a delegated role's stage | After step 3 no phase participant can write the log: no-shell roles are refused by the path guard, the allowlisted shells cannot redirect, the coordinator is fenced | Step 3's verifying test output; the owner reading the log's new lines at O7 | **Containable**, on condition that step 3 is applied and verified before O5 |
| H-08 | Guards allow the action when they fail | The path guard crashes and every write is allowed, with no sign | None before the fact. Each session's refused probe shows the guard alive at that moment; the baseline comparison shows any out-of-lane write afterwards | The probe refusal in each session file; git comparison at each checkpoint | **Can wait, with a condition:** the failing-hook probes (H-51) are run at O3, so the owner knows what a crash does before the phase opens |
| H-06 | Secret-name matching misses case variants and globs | Only if a secret-named file exists | No env or key file exists in the repository (recorded by QA's listing); the owner's attestation at O1 covers production credentials | The owner's own listing at O5 | **Can wait**, on that attestation. Blocks if a secret file is ever placed in the tree |
| H-17 | A directory search may return lines from a secret file | As H-06 | As H-06 | As H-06 | **Can wait**, as H-06 |

**Summary of the recommendation, for the owner to accept, change or reject.**
- Must block the phase until contained: **H-29, H-35.**
- Containable, each with a named condition: **H-01, H-04, H-10, H-16, H-34.**
- Can wait, each on a named condition: **H-02, H-05, H-06, H-08, H-17.**
- For every row the owner writes one of: accept as recommended; require more before the phase; reject.

## 5. Traceability

| Finding | Source | Change | Where |
|---|---|---|---|
| S5-01 (High) | Security review of revision 5; confirmed by the fourth review | Reviews before any agent-written change is applied or run | Section 1, steps 3 to 8 |
| S5-02 | Security review | How a reviewer reads committed text; the applying commands | Section 1, steps 4, 7, 8 |
| R4-07 | Fourth review | "QA cannot write to `scripts/`" corrected | Section 1, step 2 |
| R4-08 | Fourth review | The owner launches QA's no-shell sessions | Section 1 step 2; section 2.3 |
| R4-11 | Fourth review | Owner-launched form only, for the Independent Reviewer | Section 1 step 6 |
| S5-A3 | Security review; fourth review | Capture probe mandatory; per-session attestation only where the record cannot carry the check | Section 2.1 |
| S5-A4; consistency row 19 | Security review; fourth review | The owner runs every evidential scan; one labelled exception | Section 2.2 |
| R4-03 | Fourth review | No instruction file anywhere under `docs/` | Section 2.3 |
| R4-10 | Fourth review | Header claim about earlier revisions corrected | Section 2.3 |
| H-16 and H-33 predictions | Both reviews | Corrected | Section 2.3 |
| S5-03 to S5-08, S5-13 to S5-15; R4-01 to R4-06; F1 to F6 | Security review; fourth review; third review | Converted to test cases with expected failures | Section 3; QA's specification |
| "Accept in words the Highs left open" | Fourth review | Twelve-row register with recommended class and owner decision | Section 4 |

**Not changed by this amendment, and still open:** S5-09 (limits of fencing: a fenced coordinator can still delegate to open-shell roles; now row H-01 of the register); S5-10 to S5-12 and S5-16; R4-09, R4-12, R4-13; S5-A1, S5-A2, S5-A5, S5-A6. They are small, named in the two reviews, and belong in the next revision of each document. The brief's own text has not been edited: its sections 3.6, 7.3, 8.4 and 9.1 still say what section 2 of this amendment replaces.
