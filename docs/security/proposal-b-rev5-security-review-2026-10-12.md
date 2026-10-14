# Security review of Proposal B revision 5 (consolidated hardening plan), with the security portions of Proposal A revision 5

| | |
|---|---|
| Date | 2026-10-12 |
| Reviewer | `security-engineer`, by delegation from the Chief Engineer, on the owner's directive of 2026-10-12 as relayed in that task |
| Subject B | `docs/status/security-hardening-plan-rev5-2026-10-12.md` (by the Chief Engineer, who also wrote my review packet and my task) |
| Subject A | `docs/operations/sre-architecture-phase-brief-rev5.md` (by `devops-sre`), security and secrets portions |
| Kind of review | Document review with a static reading of the guard code. **A review position. It approves nothing.** I fixed nothing. |

## 0. How to read this

**What I read.** **I read the whole of the plan, lines 1 to 589: the header, sections 1 to 14 and Appendix A, including the complete patch route (section 3), the design-tier binding (section 7) and the session-fencing proposal (section 8). There is no section of the plan I did not read.** I also read the whole of the brief (1,222 lines, in three parts), although only its security portions are assessed here.

**Method.** Read tool, and one Write (this file). No shell command, although my tool list holds a shell. No guard was probed, bypassed or tested. No connector or MCP tool was called; instruction text from four connectors was present in my context and was treated as data. No tool call was refused by a guard. One Read returned "File does not exist" (this file's own path, checked before writing); that is not a guard refusal.

**Labels.**

- **Mechanism**: the software refuses the action whatever the agent intends. Every statement I make about what code does with an input is **static**: read from the source as it stands today, never run.
- **Design**: text in the plan describing code that does not exist. A statement about a design is a statement about words.
- **Recorded**: another role's report on file says so. Not re-checked by me.
- **Policy**: a written rule. It limits nothing by itself.
- **To confirm**: my recollection of how git, a search tool or the harness behaves. Not observed in this work.

**Headline.**

1. No critical finding.
2. **One new High finding, S5-01, unresolved:** the patch route has the owner apply, run and commit an agent-written change to a protected script before either reviewer has read it. It is a reordering of two steps. I escalate it, as my role requires.
3. My two earlier Highs, SR-01 and SR-02, are **addressed in the text**. Nothing is implemented, so neither is fixed in fact.
4. Section 7 is much stronger than revision 4. I found **eleven concrete inputs or conditions that would still pass falsely** (section 4.2), all Medium or Low, most of them one sentence to close.
5. Section 8's two-line change does what it claims on a static reading, narrows authority for every input and widens it for none. "No session is ever treated as the owner" is the right position for the guard. It is not yet a complete statement about the harness (S5-09).
6. Proposal B: no objection to it going to the owner for decision, **with named changes**. Proposal A: no objection, **with named changes**.

**A caution about this file.** I was briefed by the author of Proposal B, and my final message returns to that session. This file sits in a tree that session can write today (static, `path-guard.mjs:63-64`). The plan's own section 3, step 7, says a review should come from a session the owner launches and saves, or be read from a copy the owner has committed. This one is neither yet. The owner may wish to commit it promptly, or compare it with my final message.

---

## 1. My earlier findings

Source: `docs/security/proposals-security-reread-2026-10-12.md`. "Addressed" means revision 5 contains text that does what I asked. It never means implemented. A sentence promising something is "Partially addressed".

### 1.1 SR-01 to SR-15 (Proposal B)

| ID | Outcome | Place checked, and what remains |
|---|---|---|
| SR-01 | Addressed | Plan section 3, steps 3, 5, 6, 7, 8, 9, 11. All eight changes I named are present. New residue: S5-01, S5-02 |
| SR-02 | Addressed | Section 7: frozen ledger; rules 1, 3, 4, 6, 9; test table. The four inputs I gave are each a failing test. New, different inputs: section 4.2 |
| SR-03 | Addressed | Rule 8 (structural, unique probe path, instruction in the owner's prompt). Conditional on what the capture shows; the plan says so |
| SR-04 | Requires owner decision | Section 3 last paragraph states it as policy; signed commits are decision 7. My suggested owner reading of `git log` at O7 is not in the plan |
| SR-05 | Addressed | Section 7 limits (owner reads `.git/config`, lists `.git/hooks/` at O5, each checkpoint, O7); section 4 "still open". An owner check, which is what I asked. Residue: S5-08 (the index is not covered) |
| SR-06 | Addressed | Section 7 limits, third bullet |
| SR-07 | Partially addressed | Rule 11 bounds the window, allows the two later changes, takes the earliest adding commit, fails on deletion, includes the working tree. "The opening commit contains the ledger and nothing else" is in the O5 row as an owner action, but is not one of the twelve rules and has no test (S5-03) |
| SR-08 | Addressed | Rules 1, 10, 12; stage-to-agent table printed |
| SR-09 | Partially addressed | Section 1 item 1 is corrected and is now right on the code; the reference to a missing file is gone. Still: three "recorded" statements name no file (H-24; section 2 "recorded refusing for 8 roles"; section 3 step 11); two cells of the section 2 table overclaim; one new overclaim in the header (section 7.1 below) |
| SR-10 | Addressed | H-35 (`..` only as a path component or after a colon); section 9 restated by case; fixture changes listed. One small slip, section 7.2 row 39 |
| SR-11 | Addressed | H-16; step 7 no longer lists `.gitignore`; H-05 and H-08 wording |
| SR-12 | Addressed | Appendix A: files named, the run-log deletion listed, the launch and the transcript extraction characterised, the scan route conceded. Not said: whether connectors were attached to the 2026-10-11 probe session |
| SR-13 | Partially addressed | H-48 "from O2 onward", but the procedure "is not yet written" and no row of the order holds its drafting. A promise |
| SR-14 | Addressed | O1 row; H-50 |
| SR-15 | Addressed | H-33: paths resolved against the script's location, printed |

Counts: Addressed 11, Partially addressed 3, Unresolved 0, Requires owner decision 1.

### 1.2 SA4-01 to SA4-09, SC-01, SC-02

| ID | Outcome | Place checked, and what remains |
|---|---|---|
| SA4-01 | Addressed | Brief 9.2: full path, exit status saved. Residue S5-A2 |
| SA4-02 | Addressed | Brief 9.2, S7a to S7c in form N; criterion 25. Residue S5-A1 (S7d) |
| SA4-03 | Addressed | Brief 9.2, three pattern notes; limits stated |
| SA4-04 | Addressed | Brief 3.6 C8 point 7 and C9; criterion 17 (b); plan rule 7. Covers calls made, not tools merely reachable; stated |
| SA4-05 | Addressed | Brief 3.1 "Custody of the task file"; 3.2; C11; rules 26, 27 |
| SA4-06 | Addressed | Brief 1.4, both tables |
| SA4-07 | Addressed | Brief 1.1 |
| SA4-08 | Partially addressed | Brief 3.2 and 7.3 state it as a known limit and offer W4. The brief itself calls it "unresolved as a control" |
| SA4-09 | Addressed | Brief criterion 3 (b); 3.4 step 2 |
| SC-01 | Partially addressed | The brief's own patterns start at 32 and cover the shapes. The baseline scan is unchanged; the owner's re-run at O2 is a promise |
| SC-02 | Partially addressed | Plan section 1 item 6 ("content scans are run by the owner") and Appendix A. The baseline scan on file is still the one an open-shell role ran |

Counts: Addressed 8, Partially addressed 3.

### 1.3 The 21 consistency rows

| # | Outcome | Place checked |
|---|---|---|
| 1 | Addressed | O3a in both documents |
| 2 | Addressed | O1 in both |
| 3 | Addressed | H-50 at O1 in both |
| 4 | Addressed | Plan section 3 step 2; brief 7.3 (c) |
| 5 | Addressed | O6 row, the stated exception |
| 6 | Addressed | O5 row prints the run-log record |
| 7 | Addressed | O5 row; brief 3.7. As a statement only (see SR-07) |
| 8 | Addressed | Rule 11 ends the window; brief criterion 2 says it is narrower |
| 9 | Addressed | `no-shell:`, `capture:`, the owner line, rule 12; brief 8.5 moves the extra sections out |
| 10 | Addressed | Rule 12 |
| 11 | Addressed | Three line forms in both |
| 12 | Addressed | Rule 1 |
| 13 | Addressed | Rule 6 |
| 14 | Addressed | Plan section 7 limits; brief 3.5 |
| 15 | Partially addressed | H-29 "still open" and brief 1.4 state the gap. Nothing closes it; the owner's account settings are the only check |
| 16 | Addressed | Plan section 10; brief 3.7 |
| 17 | Addressed | Rule 11, last sentence |
| 18 | Addressed | Plan section 1 item 5 now covers shell, writes, connectors, web tools and commits |
| 19 | Partially addressed | Plan: "content scans are run by the owner". Brief 9.1: the owner, or a no-shell role for the text-printing patterns. The two still differ (S5-A4) |
| 20 | Addressed | Plan section 8 is a fixed proposal |
| 21 | Partially addressed | H-42 now quotes `--strict-mcp-config`; its placeholder still differs from the brief's. Cosmetic |

Counts: Addressed 18, Partially addressed 3.

### 1.4 The option I raised: fence the coordinating session before the phase

**Addressed.** Adopted as step 3 at O4 (plan sections 4, 5 and 8; decision 5). The plan records the timing as the owner's decision of 2026-10-12; I have that only from the plan and from my task. My assessment of the exact change is in section 5.

**Totals for item 1, 48 rows: Addressed 38, Partially addressed 9, Unresolved 0, Requires owner decision 1.**

---

## 2. The third review's findings

Source: `docs/status/proposals-third-review-2026-10-12.md`, which is a condensed record typed by the author of the plan, not the reviewer's text. I rely on it for what each item says.

| ID | Outcome | Place checked, and what remains |
|---|---|---|
| N1 (High) | Addressed | Section 7: header fields read from the opening commit's copy; first row of the test table. See S5-03 for a different route to the same effect |
| N2 | Addressed | Frozen line set; two test cases |
| N3 | Addressed | Rule 11, last two sentences; two test cases |
| N4 | Addressed | Rule 4: "a descendant, never the opening commit itself" |
| N5 | Addressed | Section 3 restated in eleven steps: where patches live, the failing-first run, the Security requirement, the owner's verifying run |
| N6 | Addressed | Section 9 fixture changes; H-33 (tests run a copied script) |
| N7 | Addressed | Rule 7 (`capture:`), rule 10 (approval line), exit status 3. Three further inputs are undefined: S5-07 |
| N8 | Partially addressed | The brief's revision 5 copies the order, the line forms and the twelve rules exactly. Two disagreements remain (S5-A3, S5-A4), and by the brief's own rule "neither is followed" where they disagree |
| N9 | Addressed | H-16: `.github/` not a blanket prefix; QA patterns anchored |
| N10 | Addressed | Header and section 14 state reviews by file |
| F1 | Addressed | As N1 |
| F2 | Addressed | As N2 |
| F3 | Addressed | Rules 4, 5, 8, 9; test row. Holds only where rules 8 and 9 are checked, not attested |
| F4 | Addressed | Rule 11: per-commit names, working tree, ignored list. Residue: S5-08 |
| F5 | Addressed | Rule 10. Residue: S5-15 |
| F6 | Partially addressed | Section 7 limits: stated, with owner-side reading. Policy until steps 3 and 7, as the plan says |

**Totals for item 2, 16 rows: Addressed 14, Partially addressed 2, Unresolved 0, Requires owner decision 0.**

---

## 3. Section 3, the patch route

**Is reviewed text now bound to applied text?** In the text, yes. The owner commits the patch and the test diff unapplied (step 3); both reviews cite that hash (5, 6); the owner applies from that commit and the applying commit cites the hash (9); the Reviewer compares the two with `git show` (11). On a static reading `git show` is admitted for the Reviewer and for me (`path-guard.mjs:42`, `:47`, `:48`). This is the binding I asked for under SR-01.

**Is the separation of author, reviewers, approver and applier real?** In roles, yes, and better than before: the author "never reviews, approves or applies"; QA drafts tests without a shell; the reviews come from owner-launched sessions or an owner-committed copy; the owner compares the touched files with the step table. In mechanics it rests on two things the plan states honestly as policy: a commit is not provably the owner's, and four roles keep an open shell until step 7.

**What can still go wrong.**

1. **A protected file is changed, run and committed before any review (S5-01, High).** Step 4 has the owner apply QA's diff to `scripts/test-guards.mjs`, run it with `node`, and commit it. The Security review is step 5 and the Reviewer's is step 6. So an agent-written change to a protected script is executed at the owner's terminal, with the owner's full account and outside every hook, before anyone but its author has read it. The test file spawns processes and deletes directories recursively today (`scripts/test-guards.mjs:27`, `:124`, `:147`), and under step 2 it will also create repositories and run git. Section 8 makes the owner's terminal the root of trust for everything; this is the one place the route sends unreviewed agent text straight to it. It also contradicts the route's own rule that every protected change gets both reviews first. **Fix:** both reviewers read the test diff at the step 3 hash before the failing-first run; they read the saved failing output afterwards. No new step is needed, only the order.
2. **A reviewer in a no-shell session cannot tell that what it read is what was committed (S5-02, Medium).** This review is an example: I read working copies with the Read tool and can cite no hash. A review that "cites the hash" after reading the working file is citing something it did not check. **Fix:** the reviewer reads the patch through `git show <hash>:<path>`, or the review states plainly that it read the working copy and the owner confirms a clean tree at that hash.
3. **Step 9 does not say how to "apply from the commit".** If the owner runs the apply command on the working-tree file, a later edit in the author's lane is applied; step 11 would catch it only afterwards, and only by eye. **Fix:** give the exact command form that takes the patch from the commit, and make step 11 mechanical where possible (for example a reverse apply check of the committed patch against the applied tree; to confirm). The Reviewer comparing two long diffs by reading is weak for a large patch.
4. **A patch can change more than text.** File modes, renames and new files are in a unified diff. Step 8 compares file names with the step table; it should also say that a mode change or a new file not in the table stops the step.
5. **"With no agent session open (hooks are read fresh on every tool call)"** states harness behaviour as fact. The hook scripts are spawned per call (static, `settings.json:50`, `:59`); whether the hook configuration itself is re-read per call is to confirm. The instruction is right either way.
6. **This review itself** did not follow step 7: the author launched it, wrote its reading list and receives its result. The packet offers the owner-launched form; it was not used.

---

## 4. Section 7, the frozen ledger and the twelve rules

### 4.1 Assessment

The frozen ledger is the right repair for N1 and N2: reading the header and the line set from the opening commit's copy removes the typed header as a way round rule 3. Rules 1, 3, 4, 6, 8 and 9 close the four inputs I gave under SR-02. The structural form of rule 8 is sound in principle: the refusal text is produced by `path-guard.mjs:87` from the `agent_type` the harness passed, not by the model (mechanism, static).

Everything below is static against a design. Nothing can be run, because nothing is implemented.

### 4.2 Inputs that would still pass falsely

| # | Input or condition | Why it passes | Severity | Fix |
|---|---|---|---|---|
| FP-1 | **A second ledger file.** The Chief Engineer writes a new file in `docs/status/features/` (its own lane, before and after step 3). The owner's routine checkpoint commit of `docs/status/` (brief 3.7) sweeps it in. | "The opening commit" is whichever commit first added *that file*. The new ledger's own header and line set are then frozen: no `no-shell:` entry, fewer lines, `run:` lines for the main author. It passes on its own terms while the O5 ledger sits unaccepted, which also passes. This is N1's effect by another route, and needs no shell and no committer but the owner. The only control is the owner comparing printed hashes. | Medium | The checker fails a ledger whose opening commit touches any path other than that ledger; fails two ledgers with one `id`; requires the file name to begin with the header `id`; prints the number of ledgers found. Add the test. (S5-03) |
| FP-2 | **The `capture:` field names a session file whose tool list holds a shell.** | Rule 7 is "a subset of the captured set". The captured set is whatever that file lists. Nothing in the twelve rules says the set may not contain a shell, an agent tool, a web tool or a connector tool; that judgement is the brief's item C1, read by a person. Nothing requires the capture commit to precede the opening commit, or says the set is read from the blob at that commit and not from the working file. | Medium | For an agent under `no-shell:`, the checker itself refuses a captured set or a session containing the shell, an agent tool, a web tool or any connector-prefixed tool. The capture commit must be an ancestor of the opening commit, and the file is read at that commit. (S5-04) |
| FP-3 | **A session file rewritten by a later commit.** Added genuinely in commit C1; changed in C2; the line cites C1. | Rule 4 says "byte-identical to its committed version". If that means the version at HEAD, the rewritten file passes: it exists, equals HEAD, and C1 did first add it. The test table covers "changed since its commit", not "changed by a later commit". | Medium | "Byte-identical to the blob in the cited commit, and no later commit changes it." Add the test. (S5-05) |
| FP-4 | **The deliverable is not what the session wrote.** The session writes one line to its `item:` path; the real text arrives later from a delegated run that held a shell. | Rule 9 asks for "a successful write to the `item:` path". It binds a call, not the content the owner accepts. Rule 4 fixes the session file's bytes, not the deliverable's. This is the SR-02 scenario one step removed. | Medium | If the capture shows written content is recorded: the committed deliverable equals the content of the session's last successful write to it. If not: add it to the stated limits. Say whether an Edit call counts as a write. (S5-06) |
| FP-5 | **A change to a guard hidden from git.** An open shell marks a tracked file outside `docs/` as skip-worktree or assume-unchanged, then edits it. | Rule 11 "includes the working tree", presumably through git. Git then reports the file as unchanged. No commit touches it. The Reviewer's `git status` and the brief's criteria 2 and 3 do not see it either. The owner's reading of `.git/config` and `.git/hooks/` does not look at the index. | Medium | The checker hashes every tracked file outside `docs/` itself and compares with the HEAD blob, or fails on any index flag. (S5-08) |
| FP-6 | **An ignored file that existed at O5 and is changed afterwards.** | Rule 11 compares the *list* of ignored files with the opening message. Names only. `.vscode/*` is ignored (`.gitignore:35`), as are env-style names and logs. A listed file's content can change freely. | Low to Medium | Record name and SHA-256 per ignored file in the opening message, the run log apart. (S5-08) |
| FP-7 | **A change outside `docs/` brought in by a merge.** A side branch forked before O5 carries a commit to `.claude/`; it is merged cleanly into the phase branch. | "Every commit from the opening commit to the accepting commit" does not say how the commits are enumerated. A first-parent or ancestry-path walk does not visit the side commit, and a clean merge commit lists no changed paths by default (to confirm). | Medium | Fail on any merge commit in the window (the brief already says nothing is merged during the phase), and also compare the two end trees outside `docs/`. (S5-08) |
| FP-8 | **An attestation line used where the rule could have been checked and failed.** | The plan does not say which rules are attested for a given ledger, where that choice is recorded, which commit carries the `Attested-by-owner:` line, or that an attestation cannot override a rule that was checkable and failed. If any commit message carrying the line converts a failing rule 8 into "attested", a session that was not fenced as the role yields status 3 instead of 1. | Medium | S5-07, below. |
| FP-9 | **A session run before O5** that used a known probe path and `item:` path (both are proposed in advance in the brief), committed after O5. | Rule 5 requires the start time "if the record holds one". If the record holds none, rules 4, 7, 8 and 9 pass. The clause silently skips the check, against the plan's own sentence "a rule is never silently skipped". | Low | Remove "if the record holds one"; a missing start time is an impossible rule and goes to attestation. (S5-14) |
| FP-10 | **An approval line in any commit.** | Rule 10 does not say the cited commit must be a descendant of the opening commit, inside the window, or cited once. | Low | Add all three. (S5-15) |
| FP-11 | **`accepted: yes` set by the coordinating session** in the working copy and swept into an owner checkpoint commit. | `accepted` is one of the permitted differences. Rule 10 binds the plan approval to an exact line in a commit message; nothing binds acceptance, which is the more consequential decision. For a status-3 ledger the plan says the decision is "recorded in the accepting commit's message" but defines no text and no check. | Medium | An exact line, for example `Accepted-by-owner: <ledger id>`, in the message of the commit that first sets `accepted: yes`, and that commit touches the ledger only. (S5-07) |

One possible false **fail**, which matters because a permanently failing check invites weakening: the Write tool takes absolute paths, so the target in a session record will be absolute while `probe:` and `item:` are repository-relative. "Exactly the line's `probe:` path" needs a stated normalisation, the same one the guard uses (`path-guard.mjs:80-81`). Also `.DS_Store` is ignored (`.gitignore:33`) and appears whenever a folder is opened in the file manager; rule 11 as written then fails on "a new ignored file".

### 4.3 Is the treatment of what the tooling cannot establish safe?

**Safe in direction.** An attested stage is never reported as passed, exit status 3 is distinct from 0, and the owner chooses per rule. That is the right shape. It is **not yet complete** (S5-07, Medium):

1. Which rules are attested for a ledger must be a **frozen header field**, set at opening from the O3a decision. Otherwise the choice is made implicitly, per line, by whoever writes a commit message.
2. An attestation replaces a rule the capture showed to be **impossible**. It must never replace a rule that was checkable and failed.
3. Say which commit carries the `Attested-by-owner:` line (the commit that first adds the session file is the natural one) and that the line is used once.
4. Say that **fail dominates**: a ledger, or a run over several ledgers, with any failure exits 1, never 3.
5. Define the accepting text (FP-11).
6. The attestation line is exactly as strong as "a commit is the owner's": policy. The plan says this of commits in general; it should say it of this line.
7. Anything that consumes the exit status must treat 3 as not passed. Today nothing does; say it for the future.

### 4.4 Are the stated limits complete?

No. The five stated limits are accurate. Missing:

- The binding does not tie the accepted deliverable's content to the session (FP-4).
- The capture file defines the allowlist (FP-2).
- **The checker is run from the working tree and cannot vouch for itself.** A modified working copy of the script prints whatever it likes, and rule 11's working-tree check is that same script. The owner should confirm the script and the hooks equal their committed versions before the O7 run, by means that do not trust the index (FP-5).
- Commit times and record times are self-declared; "at or after the opening commit's time" is as strong as the clock and the committer.
- The session file must be parsed as structured records, top level only. A tool-call or denial that appears inside a string (a Read result, a written document) must not count. Rule 8 says this for the phrase; the same must hold for rules 7 and 9.
- Whether the freeze applies to the `substantial` and `small` tiers, and whether the body text of a ledger (scope, findings, decisions in `_TEMPLATE.md`) is frozen, is not stated. The brief assumed the body is frozen and moved four sections out. (S5-13)
- `docs/status/features/_TEMPLATE.md` is in the coordinating role's own lane and inside `docs/`, so it can change during the window. If the applied checker reads required fields from the template at run time, the template is an input the coordinator controls. Hard-code the field list. (S5-13)

---

## 5. Section 8, fencing unassigned sessions

Read against `.claude/hooks/path-guard.mjs`, all 89 lines. Static.

**The claim that `block` is defined above the changed lines: correct.** It is a function declaration at `:51-54`; the changed lines are `:63-64`. (A function declaration is also hoisted, so the order would not matter.)

**Does the change do what the section claims?** Yes.

- `input.agent_type || 'chief-engineer'`: absent, `null`, empty string, `0` and `false` all become `chief-engineer`. Write and Edit then reach `:83-88` and are confined to `docs/status/`; the outside-project test at `:83`, which an unassigned session never reaches today, now applies. The shell reaches `:67-73` with the `chief-engineer` allowlist.
- `!Object.hasOwn(OWNED, agent)` then `block(...)`: any other value that is not one of the ten keys is refused with exit 2 and the guard's message, for the shell and for every write tool, because the test sits above both branches. `constructor`, `toString` and `__proto__` are refused; today `in` is true for them and the hook then throws at `:71` or `:86`.
- **Every input is narrowed or unchanged. None is widened.** Named role: same path as today. No type: from unrestricted to the `chief-engineer` lane. Unknown: from unrestricted to refused.

**Any input that still inherits wider authority?** Not through the two lines. Around them:

1. **Delegation to an open-shell role (S5-09, Medium).** The hook does not see the agent tool (`settings.json:55`). A session fenced as `chief-engineer` can still start any of the nine named roles, and four of them hold a shell with no allowlist (`path-guard.mjs:45-49`, `:68`; `.claude/agents/*.md:4`). Through one of those it can still run anything: edit the hooks, commit, start a nested session. Appendix A records this route being used once already. So the section's closing sentence, that step 3 "turns the orchestrating session's shell and write limits from self-report into a mechanism for the whole phase", is true of its own two tools and not of what it can cause. The control on that route during the phase stays policy until step 7. The section should say so.
2. **A non-string `agent_type` (S5-10, Low).** A JSON array with one element, for example a one-item list holding a role name, coerces to that role's key in `Object.hasOwn` and in the two lookups. It gains no more than a named role has, and the harness is not expected to send it. Add `typeof agent === 'string'` so the unknown-type refusal covers it.
3. **Tools the matcher does not name.** Read, Grep, Glob, connectors, web tools and the agent tool are untouched by step 3. The plan says this in sections 2 and 4, not in section 8.
4. **The `chief-engineer` allowlist itself** still admits reads outside the project through git (H-35, step 7), and git runs whatever `.git/config` tells it to (H-47). Stated in section 4.
5. **Links** (H-15, step 7): a link under `docs/status/` redirects an in-lane write. Creating one needs a shell.
6. **Fall-through exits unchanged by step 3:** unparseable input (`:57-61`) and a write call with no target path (`:78`) still exit 0 until step 4. Neither is under a session's control on my reading.

**Any regression for the ten named roles?** None on a static reading. A named role's `agent_type` is a non-empty string and an own key of `OWNED`; the first line leaves it alone and the second does not fire. `BASH_ALLOW[agent]` and `OWNED[agent]` are reached exactly as today.

**Is "no session is ever treated as the owner" the right position?** Yes, for the guard. Any in-band switch (a variable, a marker file, a phrase) is settable by whatever holds a shell or can write the file, and the guard cannot authenticate a person. Two qualifications:

- **It is a statement about the guard's code, not about the harness (S5-09).** A session in which the project's hooks do not run is treated as the owner in effect. Routes I can name, each to confirm: a launch option or setting that disables hooks (the plan itself cites a `--safe-mode` option as the recovery route under H-08, which is such a switch by another name); a local settings file, whose precedence is unverified and whose protection is step 6 (H-34); a session started with a different project root that then writes into this folder. Each needs a shell or the owner's own hand, so they sit with H-01 and H-34. The sentence "there is no owner mode" should carry that limit.
- **The default.** Treating an absent type as `chief-engineer` grants `docs/status/`, which holds the ledger's working copy, the patch files before the owner commits them, the task files and the template. If H-23 shows that the main session reliably carries the `chief-engineer` type, **refusing an absent type outright is the safer default**: a stray or nested untyped session would then get nothing. The plan's choice is defensible while H-23 is unknown, and is strictly better than today. Recommend deciding it from the H-23 result.

**Are the lock-out risks and the recovery route stated honestly?** Mostly. The recovery route (the owner edits or restores the one file by hand) is sound and needs no agent. Not stated:

- Built-in agent types that an owner-driven session may start for itself become unable to write or run commands (S5-11, Low). That follows from "unknown is not trusted" but belongs in the list.
- If the extension gives the main session a type that is present but different, the orchestrator is refused everything, including `docs/status/`. The section's last bullet covers "empty or renamed" as unverified; it should name this outcome.
- After step 3 a refusal naming `chief-engineer` no longer tells a typed session from an untyped one, so H-23's question can only be answered before step 3. The order already has it there.

**Is anything in the test table wrong against the code?** No row is wrong.

| Row | Checked against | Result |
|---|---|---|
| No type, Write `.claude/settings.json`: ALLOW, then BLOCK | `:64`; then `:86` | Correct |
| No type, Write `scripts/x.mjs`, `CLAUDE.md`, `apps/api/x.ts`: ALLOW, then BLOCK | `:64`; `:12`, `:86` | Correct |
| No type, Write `docs/status/x.md`: ALLOW, ALLOW | `:12` | Correct |
| No type, shell `rm x`, `git commit -m x`, `pnpm install`, `claude -p x`: ALLOW, then BLOCK | `:64`; `:42-43`, `:46`, `:71` | Correct |
| No type, shell `git status`: ALLOW, ALLOW | `:42` | Correct |
| `general-purpose` or `constructor`: ALLOW or a crash, then BLOCK with the message | `:64`, `:68`, `:71`, `:86` | Correct. `general-purpose` exits 0 today; `constructor` throws |
| Ten named roles unchanged; 26 ownership cases, `:65` excepted | `scripts/test-guards.mjs:40-65` | Correct: 26 cases, the last at `:65` |

The live probe's expected text is also right: the refusal would read that `chief-engineer` does not own the path.

---

## 6. Sections 4 and 5

**Is the order safe and unambiguous?** Safe: each step's dependencies precede it. H-23 and the capture (O3) come before the patches that depend on them; step 2 precedes step 3, so the ledger-check allowlist line is narrowed before it starts to bind the unassigned session; the fail-closed change (step 4) waits for H-51 and for the phase to end. Nearly unambiguous. Three points:

1. The O3a and O6 rows still say "identity alternative" and "alternative (a)". Section 7 no longer uses those terms; it has rule 8 and attestation. The brief adds a gloss; the plan should use its own words.
2. Two things the order depends on have no row: the H-48 scan procedure, needed "from O2 onward" and not yet written; and bringing QA's test plan into line "before step 1" (section 9).
3. O4 does not say that this review, or any Security read of the plan, must be in the owner's hands first. The brief proposes it; the plan should carry it.

**Are waves, steps and the reconciled table consistent with each other and with the register?** I checked every row of the reconciled table against the step table and the register entries. They agree, with these small exceptions:

- Step 7 lists `.claude/agents/devops-sre.md` as changed. No register entry proposes a change to that file.
- H-48: the table names the owner as implementer; the entry says QA drafts the procedure.
- Step 2 lists `SKILL.md`; section 7 cites `:14` and `:18` only, but `:22` tells the Chief Engineer to fill in `started`, which rule 12 removes.

**Does every protected change name the owner as implementer and both reviewers?** Yes. Every Wave 1 and Wave 2 row has "Owner" and "Security, Reviewer"; H-12 has "Owner applies; QA drafts" with both reviewers. The rows with one reviewer or none (H-18, H-21 to H-23, H-28, H-39 to H-46, H-50, H-51) are Wave 0 items that change no protected file.

**Is anything open during the phase left unstated?** Yes. The "still open between O5 and O7" paragraph is a real improvement, but it reads as a complete list and is not one. Missing by ID: **H-01 and H-02** (four roles with an unsandboxed open shell, the root cause; the paragraph mentions an open shell only for two of its effects), H-03 (no detection), H-04 (manifest and config writes in the `devops-sre` lane), H-05, H-09, H-15 (links), H-17 (if the probe shows a leak, the fix is step 5), H-49. Also unstated there: the delegation route of section 5 above, and that Read, connectors and web tools of the coordinating session are untouched by step 3. **Named change:** say "every finding scheduled for steps 4 to 9 is open during the phase", then keep the list as examples.

---

## 7. Claims

### 7.1 Statements that claim more than exists

No statement in the plan says a fix is verified. The header's "There are no verified fixes" is accurate and is kept to throughout. These claim or imply too much:

| # | Place | Statement | Problem |
|---|---|---|---|
| 1 | Header | "two independent reviewers checked 71 of these citations against the code and found no wrong line number" | The 71 (my 44 and the third review's 27) were checks of revision 4 and its amendment. Revision 5 adds citations nobody had checked (section 8 `:51-54`, `:4-5`; section 9 `:40-64`, `:73-77`, `:106-107`, `:131-145`; H-08 `:78`; H-51 `:50`, `:59`). "These" implies the present text was checked |
| 2 | Section 2, Write and Edit row | "Open afterwards: — after step 3 for agent sessions" | H-16, H-15 and H-04 are step 7; `:78` is step 4. Not closed at step 3 |
| 3 | Section 2, Starting agents row | "Open for unknown types and no-type sessions until step 3" | Step 3 does not touch the starting of agents. It refuses an unknown type's writes and shell after it has been started. Its reads, web tools and connectors stay |
| 4 | Section 8, Timing | "It turns the orchestrating session's shell and write limits from self-report into a mechanism for the whole phase" | A proposed, unapplied, untested patch, conditional on H-23; and see the delegation route. Needs "proposed, unverified" and the limit |
| 5 | Section 8 | "There is no owner mode, no override variable, no marker file" | True of the guard's code. Not of the harness (section 5) |
| 6 | Section 3 step 9 | "hooks are read fresh on every tool call" | Harness behaviour stated as fact; to confirm |
| 7 | Section 7 | "Each has a failing test in the table below" | The tests are described, not written. "Has a defined test" |
| 8 | Section 11 | The controls "make approvals real" | Approvals rest on commits the plan itself says are not provably the owner's |
| 9 | H-24; section 2; section 3 step 11 | "recorded" with no file named | By the plan's own definition "recorded" means a report on file |
| 10 | Section 2, Connector row | "Policy only" | `da-vinci.md:4` grants five connector tools by name. That is a grant by mechanism, and H-29's deny-by-prefix at step 9 would collide with it |
| 11 | Section 9, Run-log row | "Named agent cannot Write the log" under "must hold after every step" | No such case exists in `scripts/test-guards.mjs` today. It is a new pin |
| 12 | H-16 tests | "`.Claude/x`: ALLOW today" | For a named role a plain `.Claude/x` matches no pattern and is refused today (`:86`). The case needs a concrete any-depth name, for example a `__tests__/` path under `.Claude/` for QA |
| 13 | H-33 tests | "`_F-001.md` ... `ok` today" | Today the file is skipped at `:106` and never printed. "Ignored today" |

### 7.2 Citations checked

Static, against the files as I read them today. 46 rows. All citations in sections 8 and 9 are included.

| # | Place | Citation | Result |
|---|---|---|---|
| 1 | Section 8 | `path-guard.mjs:63-64`, reads `agent_type`, exits 0 | Correct |
| 2 | Section 8 | Header comment `:4-5`, the quoted phrase | Correct |
| 3 | Section 8 | `scripts/test-guards.mjs:65` pins it | Correct |
| 4 | Section 8 | `settings.json:2`, default agent | Correct |
| 5 | Section 8 | The two "Today" lines as quoted | Correct, exact |
| 6 | Section 8 | `block` defined at `:51-54`, above | Correct |
| 7 | Section 8 | Header comment at `:2-7` | Correct |
| 8 | Section 8 | `CLAUDE.md` sentence "change only when the owner asks for it directly" | Correct (`CLAUDE.md:47`) |
| 9 | Section 8 | "the existing 26 ownership cases, `:65` excepted" | Correct |
| 10 | Section 9 | Seven ledger cases at `:131-145` | Correct |
| 11 | Section 9 | Fixture header at `:122`: no `id`, has `started` | Correct |
| 12 | Section 9 | Stage-line helper at `:119` | Correct |
| 13 | Section 9 | Harness at `:123-129` passes `--dir` and `--log` | Correct (`:127`) |
| 14 | Section 9 | Run record written at `:106-107` | Correct |
| 15 | Section 9 | Pass case at `:134` | Correct |
| 16 | Section 9 | Owner-line pass case at `:141-145` | Correct |
| 17 | Section 9 | Ownership cases at `:40-64` | Correct |
| 18 | Section 9 | `:55` (`.github/`), `:56` (`package.json`) | Correct |
| 19 | Section 9 | Reviewer cases at `:73-77` | Correct range; `:77` is "creates a branch", which the label omits |
| 20 | Section 9 | `:82`, the frontend build case | Correct |
| 21 | Section 9 | `:81`, `security-engineer` cannot `pnpm install` | Correct |
| 22 | Section 9 | "The 11 existing cases" for secrets | Correct (`:89-99`) |
| 23 | Section 9 | `:71`, `git diff main...HEAD` | Correct |
| 24 | H-12 | Count of 58 | Correct (26, 12, 11, 2, 7) |
| 25 | Section 1 | `path-guard.mjs:11-39`, `:86`; no pattern matches the existing files | Correct for every file under `.claude/` and `scripts/` that I know of; I did not list the folders |
| 26 | Section 1 | `:21-23`, `:29-30`; `:68`; `:64` | Correct |
| 27 | Section 2 | `:45-49`, `:68`: allowlist for 3, open for 4 | Correct; the four are the roles whose line 4 holds a shell with no allowlist entry |
| 28 | Section 2 | `:77-88` | Correct |
| 29 | Section 2 | `secret-guard.mjs:37-45`; eight `Read` deny rules | Correct (`settings.json:5-12`) |
| 30 | Section 2 | `settings.json:46`, `:55` | Correct |
| 31 | Section 2 | `.claude/agents/*.md:4`: no web tool in any tool list | Correct, all ten read |
| 32 | Section 2 | Only `chief-engineer.md:4` lists the agent tool | Correct, all ten read |
| 33 | Section 3 | `git show` admitted by `path-guard.mjs:42` | Correct |
| 34 | H-04 | `settings.json:27-28`; `path-guard.mjs:26`, `:32-35`, `:23` | Correct |
| 35 | H-05, H-15, H-36 | `settings.json:19`; `path-guard.mjs:81`; `:48` | Correct |
| 36 | H-08 | `path-guard.mjs:57-61`, `:78`; `secret-guard.mjs:21-26` | Correct |
| 37 | H-51 | `settings.json:50`, `:59` | Correct |
| 38 | H-06, H-07, H-17 | `secret-guard.mjs:9-14`, `:31`, `:12`, `:41-42`; `.gitignore:12-18` | Correct. The "today" predictions for the case and quote inputs agree with the code |
| 39 | H-16 | Test `.Claude/x`: ALLOW today | **Wrong as written** (7.1 row 12) |
| 40 | H-11, H-14, H-19 | `check-feature-ledger.mjs:27`, `:76`, `:104`; `:24`, `:70`, `:77`; `:74`, `:84-85` | Correct |
| 41 | H-33 | `check-feature-ledger.mjs:17-18`, `:98-100`, `:106`; `path-guard.mjs:46` | Correct |
| 42 | H-37 | `:24`, `:49`, `:54`, `:76`, `:82`, `:84`, `:85`, `:90` | Correct |
| 43 | H-09, H-10, H-49, H-34 | `settings.json:64-73`; `log-agent-run.mjs:14`, `:26`, `:16`; `.gitignore:26`, `:29`; `path-guard.mjs:80` | Correct |
| 44 | H-26 | `qa-test-engineer.md:4`, `:15` | Correct |
| 45 | Section 7 | `check-feature-ledger.mjs:20-23` and the diff context; `:85`; `:64` | Correct |
| 46 | Section 7 | `SKILL.md:14`, `:18` | Correct; `:22` is also affected and is not cited |

**Result: no line number is wrong. One test prediction attached to a correct description is wrong (row 39). One label is short (row 19). Two predictions are imprecise (7.1 rows 11 and 13).**

---

## 8. Proposal A revision 5, security portions

**The search commands: would matched text stay out of saved files?**

- **Form N (S6, S7a to S7c): yes, on a static reading of the command.** The full path removes the wrapper question. With `-H` and `-n` every output line begins `name:number:`; the cut keeps those two fields; the exit-status line and a "binary file matches" notice pass through and hold no matched text; errors go to a separate file. Not run by anyone, as the brief says.
- **One way the shape could still change (S5-A2, Low, to confirm):** the system tool may honour an options variable from the environment. A context or colour option inherited that way would add lines in a different shape, and the cut would then keep text. Clear that variable in the command.
- **Form T still copies sensitive lines (S5-A1, Medium).** S7d prints every line holding a web link. A link with an account or project identifier in its path, a bucket address in web-link form (S7c covers only the three storage schemes), a signed download link, or a link with credentials in it, is a breach of rule 18 or a secret, and form T copies the line into `search-S7d.txt`, which is committed. This is the SA4-02 problem left in one pattern. The same holds, less probably, for S1 to S5 and S8. **Fix:** run form N first; run form T only on files whose S6 and S7a to S7c results are clean or classified; put S7d in form N and read the hits by opening the file.
- On session files, S6e and S6g will hit almost every record. The brief says so. The effective scan of a session file is S6a to S6d plus the owner's reading.

**The capture and the per-session evidence read every tool-call record:** yes. Item C9 and criterion 17 (b) to (e) do what SA4-04 asked, and the brief states the limit (calls made, not tools reachable). Criterion 17 (e), no read outside the project and no write to another path, is a reading and not a checker rule; it is the only thing covering Read.

**Custody of the launch-time settings file:** sound. Owner-made, outside the repository, deny rules only, SHA-256 in the capture evidence and recomputed before each launch, limits stated. Two small additions: name the notebook-editing tool in the deny rules if the capture shows the session holds it; and note that the session file is redirected into the working tree, where it can be altered before the commit. The review packet's own launch form saves outside the repository; the brief could do the same and copy the file in after hashing.

**The relabelled policy statement (1.1):** correct on the code. It says plainly that four roles hold a shell that could run the launch, that the orchestrating session did so once, and that the commit is the only evidence.

**The prohibitions list (1.5):** eight items, each with an honest label. It is described as the single list, but three prohibitions live elsewhere: no reads outside the project (rule 6), no web tool and no starting of agents (rule 5), no nested instruction file (1.2). (S5-A6, Low.)

**"What no-shell does not do" (1.6):** accurate and complete on my reading.

**Agreement with the plan.** The order table, the three line forms, the frozen-ledger text and the twelve rules are word-for-word the plan's. Mismatches:

| # | Mismatch | Severity |
|---|---|---|
| 1 | **Rule 8 and attestation (S5-A3).** The brief opens the phase only if C5 passes, and C5 needs the hook's denial text in the result record. That is the same fact rule 8 needs. So if rule 8 is "impossible", C5 fails and the phase cannot open; yet brief 8.4 and plan decision 4 offer attestation in place of rule 8. One of the two has to give | Medium |
| 2 | **Who scans (S5-A4).** Plan section 1 item 6: content scans are run by the owner. Brief 9.1 and 7.3 (b): a no-shell role may run the text-printing searches | Low |
| 3 | Plan silent, brief proposes: a failed or revising session re-uses a ledger line (brief 8.2); probe writes under attestation (8.4); the phase record (8.5); no O4 before the Security review file exists (section 2) | Low; the plan should adopt or reject each |
| 4 | Plan H-42 quotes the brief's launch form with a different placeholder | Cosmetic |

---

## 9. New findings

All static or about wording. None executed. No critical finding.

### Proposal B

**S5-01. High. An agent-written change to a protected script is applied, run and committed before any review.**
- Location: plan section 3, step 4 against steps 5 and 6.
- Scenario: QA's diff to `scripts/test-guards.mjs`, written in a session that read whatever it read, contains more than tests, by mistake or because hostile text redirected the session. The owner applies it and runs `node scripts/test-guards.mjs` as step 4 instructs.
- Impact: code of unreviewed origin runs at the owner's terminal, as the owner, outside every hook and the future sandbox: the home directory, user-level settings, git configuration and whatever credentials that account holds. The plan makes that terminal the root of trust for all hardening. The bound "no production credential is reachable" is still unattested (H-50).
- Recommendation: both reviewers read the test diff at the step 3 hash before step 4. Likelihood is low; the fix costs nothing.

**S5-02. Medium. A reviewer cannot always confirm it read the committed text; "apply from the commit" has no stated command; the final equality check is by eye.** Location: section 3, steps 5, 6, 9, 11. Recommendation: section 3 items 2 to 4 above.

**S5-03. Medium. A second ledger file is its own opening commit.** Location: section 7, "The opening commit and the frozen ledger"; O5. Scenario, impact, recommendation: FP-1.

**S5-04. Medium. The captured tool set is whatever the capture file lists.** Location: rule 7. FP-2.

**S5-05. Medium. "Byte-identical to its committed version" admits a later rewrite.** Location: rule 4. FP-3.

**S5-06. Medium. Authorship binds a call, not the deliverable; path comparison is undefined.** Location: rules 8 and 9. FP-4 and the false-fail note in 4.2.

**S5-07. Medium. The attestation and the acceptance are under-defined.** Location: section 7, "What the tooling may not be able to establish"; rule 11. FP-8, FP-11 and the seven points of 4.3.

**S5-08. Medium. The docs-only window can be passed by a hidden working-tree change, a changed ignored file, or a merge.** Location: rule 11. FP-5, FP-6, FP-7. Also add the "checker cannot vouch for itself" limit (4.4).

**S5-09. Medium. Section 8 overstates what step 3 fences.** Location: section 8, "Owner identification" and "Timing"; section 4, "still open"; section 2, two cells. Scenario: the fenced coordinating session delegates to a role with an open shell; or a session runs with the project's hooks not in force. Impact: the owner reads "mechanism for the whole phase" and relaxes the reading that is in fact the control. Recommendation: state both limits in section 8; complete the section 4 list (section 6 above); decide the default for an absent type from the H-23 result.

**S5-10. Low. A non-string `agent_type` is coerced.** Location: the proposed line at `path-guard.mjs:64`. Recommendation: a string type check before the lookup; one test.

**S5-11. Low. Lock-out list incomplete.** Built-in agent types; a present-but-different type for the main session. Location: section 8, risks.

**S5-12. Low. Claims.** The thirteen rows of 7.1.

**S5-13. Low. Scope of the freeze and standing of the template.** Location: section 7; step 2. Recommendation: say which tiers the frozen ledger applies to and whether body text is frozen; hard-code required fields.

**S5-14. Low. Rule 5 skips itself.** FP-9.

**S5-15. Low. Rule 10 accepts any commit.** FP-10.

**S5-16. Low. Loose ends in the order.** No row for drafting the H-48 procedure or updating QA's plan; stale "identity alternative" wording in O3a and O6; step 7 lists an agent file no entry changes. Location: sections 4, 5, 9.

### Proposal A

**S5-A1. Medium. The text-printing form copies link lines, and so identifiers and signed or credentialed links, into committed evidence.** Location: brief 9.2, S7d and form T; criterion 25. Recommendation: section 8 above.

**S5-A2. Low. An inherited options variable could change form N's output shape.** To confirm. Location: brief 9.2.

**S5-A3. Medium. C5 is mandatory while rule 8 is attestable.** Location: brief 3.6 (C5, closing sentence), 8.4; plan decision 4. Recommendation: either C5 failing stops the phase and rule 8 is removed from the attestable list in both documents, or C5 gets a stated fallback. I recommend the first: without a mechanical refusal on file, nothing shows the launch form ran as the role.

**S5-A4. Low. Who runs content searches differs between the documents.** Location: brief 7.3, 9.1; plan section 1 item 6.

**S5-A5. Low. Session output is saved into the working tree; the deny rules do not name the notebook tool.** Location: brief 3.1, 3.2.

**S5-A6. Low. The prohibitions list is not the only place prohibitions live.** Location: brief 1.2, 1.5, rules 5 and 6.

---

## 10. Position

**This is a review position. It is not an approval, and I cannot give one. Only the owner approves. I do not say either proposal is secure, or would make anything secure.**

### High and Critical findings: explicit statement

- **Critical: none open.**
- **High, against the documents: one is unresolved, S5-01**, raised in this review. My two earlier Highs, SR-01 and SR-02, and the third review's N1, are addressed in the text of revision 5.
- **High, in the system: all twenty remain unfixed in fact.** The plan's register rates twenty findings High (H-01, H-02, H-04, H-05, H-06, H-08, H-10, H-11, H-16, H-17, H-23, H-24, H-29, H-31, H-32, H-33, H-34, H-35, H-50, H-52). Every one is a proposal or a probe. Nothing is applied and nothing is verified, as the plan says. If steps 1 to 3 are applied and their tests pass, these stay open during the SRE phase by the plan's own order: H-01, H-02, H-04, H-05, H-06, H-08, H-10, H-16, H-17, H-29 beyond the O1 detaching, H-34 and H-35.

### Proposal B: no objection to it going to the owner for decision, with named changes

O1, O2 and O3 change no protected file and can be decided now. Before O4, which is the first use of the patch route and the point at which the step 2 and step 3 patches are written:

1. **S5-01**: the reviewers read the test diff before the owner runs it. I would object to O4 starting without this.
2. **S5-03 to S5-08**: close the false passes of section 4.2 and complete the attestation, each with its failing test, before the step 2 patch is written. The checker is what the phase is accepted on.
3. **S5-09**: state the two limits in section 8 and complete the "still open" list in section 4.
4. **S5-02**: how a reviewer reads the committed text, and the applying command.
5. S5-10 to S5-16, which are small.

Approving the plan approves no patch, and the plan says so. Each step's patch still comes to me and to the Independent Reviewer under section 3.

### Proposal A: no objection to it going to the owner for decision, with named changes

Before the O3 capture, since they change what the searches and the capture do:

1. **S5-A1**: form N first; S7d in form N.
2. **S5-A3**: settle C5 against rule 8's attestation, in both documents.
3. S5-A2, S5-A4, S5-A5, S5-A6.

Approving the brief does not open the phase, and the brief says so.

### What I did not review, and what I rely on others for

- **Not read:** my first review; the first, second and fourth independent reviews; revision 4 and its amendment; the baseline scan evidence and the readiness report (not re-read for this review); QA's hardening test plan; the validation records and evidence transcripts; the run log; `docs/learning/`; the rule files other than `security.md`; `SKILL.md` beyond its first 30 lines; any other role's review packet.
- **Not done:** no listing of any folder, so "the existing files under `.claude/` and `scripts/`" means the files I know of. No hash, no search, no git command. I cannot say whether any file I read has changed since others read it; no commit exists to compare against. My session's environment again described the folder as not a git repository.
- **Relied on:** the third review's condensed record, typed by the plan's author, for what N1 to N10 and F1 to F6 say; my own reread for what my earlier findings asked; the plan's "recorded" statements for everything about live behaviour.
- **Limits of this kind of review:** a reading of code and documents cannot show how the harness passes `agent_type`, treats a failing hook, records a tool call, or resolves settings; how git enumerates a merge or reports a flagged file; or how a search tool reads its environment. Everything marked "to confirm" is recollection. Only the owner's Wave 0 runs can settle those.

---

## 11. Specialist report

**1. Status:** done. One review written. No finding fixed. Nothing approved.

**2. Files changed:** `docs/security/proposal-b-rev5-security-review-2026-10-12.md` (this file, created). No other file was created, edited, moved or deleted.

**3. Commands run:** none. No shell command was run, on instruction. Tool calls:
- Read, successful, in full: the review packet; `CLAUDE.md`; `.claude/rules/security.md`; the plan revision 5 (589 lines); the brief revision 5 (1,222 lines, in three reads); my reread (654 lines, in two reads); the third review's condensed record; `.claude/settings.json`; the three hook files; both scripts; `.gitignore`; `docs/status/features/_TEMPLATE.md`.
- Read, successful, in part: the first lines of each of the ten agent files (line 4 of each; lines 1 to 18 of the QA file); the first 30 lines of the workflow skill.
- Read of this file's own path, before writing: "File does not exist."
- Write, once: this file.
- No tool call was refused by a guard. No connector or MCP tool was called.

**4. Not verified:**
- Every statement about what a guard, the checker or a proposed rule does with an input: static or about a design, not executed.
- Every statement marked "to confirm" about git, the harness, launch options, settings and the search tool's environment handling.
- That the working copies I read equal anything committed.
- That the existing guard suite passes.
- The contents of every file listed under "What I did not review".
- Whether the third review's condensed record matches what that reviewer said.

**5. Decisions and deviations:**
- I wrote this file because the task required exactly one file at this path and my role records reviews in `docs/security/`. A general instruction in my session configuration discourages writing report files; I followed the specific task, as in my two earlier reviews.
- I rated S5-01 High, for consistency with SR-01: it is a route by which unreviewed text reaches a protected file, and here it is also executed. Its likelihood is low. The owner may weigh it differently.
- I rated the section 7 false passes Medium individually and did not carry SR-02's High forward: each now needs an owner oversight on a file the owner is told to read, or a committer other than the owner, which the plan already states as policy.
- I read the whole brief, not only its security portions, because the task asked for agreement on order, ledger and rules and those are spread through it. I assessed only the security portions.
- I read line 4 of all ten agent files, beyond the packet's list, to check two "only" and "no agent" claims in section 2 of the plan.
- I spelled out no token prefix, no email address and no absolute path in this file, and named no connector, to add nothing to the baseline scan's checks. That is by construction and unverified by a scan.
- Connector instruction text was present in my context. I treated it as data and called nothing.

**6. Needs the owner:**
1. **Escalation: one unresolved High, S5-01** (section 3, step order). No critical finding.
2. Proposal B: decide O1 to O3 if you wish; ask for named changes 1 to 4 of section 10 before O4.
3. Proposal A: decide it with its named changes, made before the capture is run.
4. Decide, from the H-23 result, whether a session with no agent type is treated as `chief-engineer` or refused outright (section 5).
5. Decide whether rule 8 may be attested at all, given that the brief makes its capture counterpart mandatory (S5-A3).
6. SR-04 remains yours: signed commits or not, and whether you read `git log` for the phase branch at O7.
7. Consider committing this file yourself soon after it is written, and launching the next Security review of a patch directly, as section 3 step 7 of the plan describes.
