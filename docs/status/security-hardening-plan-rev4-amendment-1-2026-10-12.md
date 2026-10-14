# Proposal B, revision 4: amendment 1

Date: 2026-10-12. Author: Chief Engineer (orchestrating session). **Proposed, not approved, nothing applied.**

**Why this is a separate file.** The Security Engineer reread revision 4 (`docs/security/proposals-security-reread-2026-10-12.md`) and objected to approving it as written, with two new High findings. Revision 4 is left exactly as the Security Engineer read it, so the reread stays valid for that text. This amendment states the changes that answer the reread. Where the two differ, the amendment governs. **The Security Engineer has not read this amendment.** It is read together with revision 4 by the independent third review.

Statements are labelled **mechanism**, **observed**, **relayed**, **static** or **policy**, as in revision 4. Everything proposed here is unimplemented and untested.

## A1. Corrections of fact (SR-09, SR-12)

1. **Revision 4, section 1, first bullet is wrong** and is replaced by: "Changing protected configuration and scripts is reserved to the owner. That is **policy**, with a **partial mechanism**: for the ten named roles the path guard refuses Write and Edit on the existing files under `.claude/` and `scripts/`, because no ownership pattern matches them (static, `path-guard.mjs:11-39`, `:86`). It does not stop a new file there whose name matches an any-depth pattern (`:21-23` for QA, `:29-30` for `devops-sre`; finding H-16), and it does not apply at all to the four roles' open shells (`:68`), to an unknown agent type, or to a session with no agent type (`:64`)."
2. **The remediation matrix did not exist when revision 4 said it did.** The header cited `docs/status/remediation-matrix-2026-10-12.md` before the file was written. It is written after this amendment. If that file is absent, there is no matrix.
3. **Section 1, fourth and fifth bullets are policy and self-report**, and are now labelled so: that the orchestrating session runs only what the `chief-engineer` allowlist admits, and that one writer runs at a time, are statements nobody else can check. The rule is widened to match Proposal A's rules for the same session: it writes only under `docs/status/`, invokes no connector or web tool, and commits nothing.
4. **Four "observed" labels had no file behind them** and become "recorded" with their source: the four plain `rm` commands and the refusals for eight roles (`docs/testing/evidence/foundation-validation-2026-10-11.md`); the Reviewer's refused `node --version` (`docs/status/foundation-validation-review-2026-10-11.md`); the model failure message (the same evidence file).
5. **Section 2's "—" cells** for "Starting agents" and "Git hooks and config" are replaced by "open for a session with no agent type and for unknown agent types until step 3; open for any shell until step 6".
6. **Section 4's sentence** "the phase has a machine-checked ledger from its first day" is replaced by: "if step 2 is applied and its tests pass, the phase has a ledger the checker can read from its first day. A checker pass is necessary and never sufficient."
7. **Appendix A, corrected.**
   - The 2026-10-11 `claude -p ... --agent devops-sre --disallowedTools Bash` launch was made by the orchestrating session without the owner's authorization for that act. It is the only source of the "five tools" statement, which is why that statement is relayed. The prompt asked for a one-word reply; what connectors were attached was not recorded.
   - The "two Python scripts that extracted reviewer reports" read agent transcript files outside the project and wrote into `docs/status/` through the shell. The party under review thereby saved the verdict on its own proposal. A third such extraction saved the second review.
   - The "Python script that edited two files" changed `docs/status/security-hardening-plan-rev3-2026-10-12.md` (one line citation) and `docs/status/security-hardening-plan-2026-10-11.md` (a "Superseded" line). The "Superseded" line in `docs/operations/sre-architecture-phase-brief.md` was added by the delegated `devops-sre` run that wrote revision 3 of the brief, on the Chief Engineer's instruction.
   - Not listed before: during set-up on 2026-10-11 the same orchestrating session deleted `.claude/logs/agent-runs.jsonl` once with `rm`, and removed probe files and empty folders with `rm` and `rmdir`.
   - "Scans are run by a role whose tools permit them" is withdrawn. The scan of 2026-10-12 was run by QA, which holds an unrestricted shell, on the Chief Engineer's delegation. The Security Engineer's point stands: after a guard refused the orchestrating session's search, the same search reaching a shell through another role is the same route unless the owner asked for it personally. **From here on, content scans are run by the owner.** QA's scan is triage, not the owner's scan.

## A2. Patch route: reviewed text bound to applied text (SR-01, High)

Revision 4's section 3 is replaced by this sequence. Statuses are unchanged.

1. The patch diff and QA's test diff are written as files (author as in revision 4).
2. **The owner commits both files, unapplied.** That commit hash identifies the text under review.
3. The Security Engineer's review and the Independent Reviewer's recommendation each cite that hash and the file paths. A review that cites no hash recommends nothing.
4. Both reviews are obtained by sessions the owner launches and saves, or are read by the owner from a copy the owner has committed. The author does not brief the reviewers on what to read.
5. Before applying, the owner lists the files the patch touches and compares them with the step table.
6. **The owner applies from that commit**, with no agent session open, since hooks are read fresh on every tool call. The applying commit's message cites the reviewed hash.
7. The Independent Reviewer's final check is that the applied diff equals the reviewed diff, using `git show` on both commits.
8. QA's drafting of tests is done in a session launched without a shell, or the residual is recorded in the step's evidence.

"The owner's commit" in step 5 of revision 4 meant the applying commit. The record of approval is now two commits: the unapplied patch, then the application citing it.

## A3. Evidence binding (SR-02 High, SR-03, SR-07, SR-08)

These rules are added to revision 4, section 7. Each has a failing test, added to that section's table.

| # | Rule | Closes | Test, expected to fail before and pass after |
|---|---|---|---|
| R1 | An agent listed under `no-shell:` may hold a stage **only** through a `session:` line. A `run:` line for it fails | A delegated run that held a shell ticking the main author's stage | `authoring \| agent: devops-sre \| run: <any later id>` with `no-shell: devops-sre` |
| R2 | The commit that **first added** the session file must be the cited commit, and must be the opening commit or a descendant of it | The pre-phase capture file cited through a later commit | A session file first added before the opening commit, cited with a later hash |
| R3 | A session id is cited once per ledger. If the capture shows that write targets are recorded, the file must contain a successful write to the line's `evidence:` path | One session ticking many documents, or a document it did not write | Two lines citing one session id; a line whose evidence path the session never wrote |
| R4 | A stage is complete only when it has at least one line and **every** line of it is ticked | One ticked line of many completing a stage | `authoring` with eleven lines, one ticked, `accepted: yes` |
| R5 | Check 4 is an allowlist: the session's tool list is a subset of the set captured at O3, and every tool-call record in the file names a tool in that set | A tool list with an agent, web or connector tool; a tool that appears only later | A start-up list holding one extra tool; a later call to a tool not in the list |
| R6 | Check 5 is structural: a **denied write call** in the file, targeting the one named probe path, whose result carries the path guard's text naming the agent. A phrase anywhere else in the file does not count. The instruction to attempt that write is in the owner's own prompt, not in a task file | The phrase "does not own" appearing in text the session merely read | A file containing the phrase only inside a read result |
| R7 | The docs-only window runs from the opening commit to the commit that first sets `accepted: yes`. The ledger must be unchanged after that commit. The opening commit contains the ledger file and nothing else. The earliest adding commit is used; a ledger that was deleted and re-added fails. The checked state includes the working tree | An accepted ledger failing forever once hardening resumes; a moved start | An accepted design ledger followed by a later commit under `.claude/`: passes. A path outside `docs/` inside the window: fails |
| R8 | An owner line (`plan-approved`) cites an owner commit whose message carries the approval | The approval gate being a line typed by the coordinating session | An owner line with no commit |
| R9 | The `no-shell:` header field holds agent names and is exempt from the yes-or-no rule. The typed `started` field is removed; the opening commit replaces it | A contradiction inside revision 4 | A ledger with `no-shell: devops-sre` parses |

**Whether R3's second half, R5's second half and R6 can be implemented depends on what the session file records.** That is unverified until the owner's capture. If the file does not record tool calls with their targets and results, identity and authorship **cannot be established by tooling**, and the safe alternative is: the owner attests per session in the commit message (policy), and the ledger check reports those stages as "attested, not verified" instead of passing them silently. The owner chooses after the capture.

**What stays true after all nine rules (limits).**
- **"The owner's commit" is a commit.** Nothing distinguishes it from a commit made by any session holding a shell, including the orchestrating session, until step 6 and H-32. That it is the owner's is policy. Supports for the owner to choose: read `git log` for the phase branch at O7 and confirm every commit; signed commits.
- **A `run:` line can be satisfied by a line appended to the run log** by an open shell or an unfenced write (SR-06). The prefix check does not see an append. The stages held by delegated roles therefore rest on corroboration. At O7 the owner reads the log's new lines against the delegations the phase made.
- **Git plumbing is open during the phase** (SR-05). The checker calls git from step 2 on. The owner reads `.git/config` and lists `.git/hooks/` at O5, before each checkpoint commit, and at O7.
- **The checker resolves its folders against the working directory** (SR-15, `check-feature-ledger.mjs:17-18`). Step 2 resolves them against the script's own location.

## A4. Execution order (SR-14, consistency rows 1 to 7, 16, 17)

Revision 4's section 4 table is amended as follows. The order itself does not change.

- **O1** also holds the owner's credential attestation (H-50 moves from "before step 3" to O1) and the privacy redaction decision. The identity alternative (decision 4) is **not** at O1: it is decided after the O3 capture and before O4.
- **O4.** QA drafts tests without a shell (A2 item 8). Revision 4's phrase "before any agent with a shell does real work" excepted nothing; it now excepts nothing.
- **O5.** The opening commit contains the ledger only, is the first commit of the phase branch, and its message carries the run log's line count and SHA-256, as the O2 message does. The Wave 0 evidence branch is merged into `main` before O5, so the capture file is readable from the phase branch.
- **O6.** "No Wave 0 probe during the phase" excepts exactly one thing if the owner chooses identity alternative (a): the single refused out-of-lane write at the start of each owner-launched session.
- **Open between O5 and O7**, stated here because revision 4 did not: the unfenced orchestrating session and unknown agent types (H-31, H-32); guards that fail open (H-08); any-depth patterns and nested instruction files (H-16); secret-name gaps (H-06, H-07); `git diff` reads outside the project for allowlisted roles (H-35); `audit fix` (H-36); local settings precedence (H-34); connectors beyond the O1 detaching (H-29); the run log and git plumbing (above).
- **An option for the owner, not adopted here:** the Security Engineer recommends weighing whether H-31 and H-32(a), a change of a few lines at `path-guard.mjs:63-64`, should be split from H-08 and applied at O4, which would fence the coordinating session before the phase. Adopting it changes the order and means revising both documents.

## A5. Other corrections

- **H-35** (SR-10): reject `..` only as a path component, and after the colon of a revision-and-path argument. A revision range such as `main...HEAD` stays allowed; the existing case at `scripts/test-guards.mjs:71` is a regression pin for that.
- **Section 8** (SR-10): the "must hold" column was still wrong in places. `:55` (`devops-sre` writes `.github/`) and `:56` (`devops-sre` writes `package.json`) change under H-04 and H-16; `:82` changes under H-01; `:71` must keep passing. For step 2, the fixture changes are not only `:119` and `:122`: the helper at `:123-129` must build a temporary git repository and commit the ledger, and the run record written at `:106-107` must be created after that commit, or the pass case at `:134` fails under H-14.
- **H-16 and `.github/`** (SR-11): `.github/` is removed from the blanket protected prefixes. It stays in the `devops-sre` lane behind H-04's prompt. The protected prefixes are `.claude/`, `scripts/`, `.git/`, `.vscode/`, `.mcp.json`, `.gitattributes`.
- **Step 7 and `.gitignore`** (SR-11): step 7 does not change `.gitignore`. The run log stays ignored unless the owner decides otherwise.
- **H-05** (SR-11): its safe verification is "help flags and dry runs only; never a real path".
- **H-08** (SR-11): "an input that is blocked today" is corrected to "an input that today makes the hook exit with a non-blocking error code; whether that blocks the call is exactly what H-51 will show".
- **H-47**: the open routes also include an unknown agent type (`path-guard.mjs:64`).
- **H-42**: Proposal A's form is `... --strict-mcp-config --output-format stream-json --verbose "<brief>" > <file>`. That `--verbose` takes no value is unverified.
- **H-48 and SR-13**: the written, owner-run, names-and-numbers content scan does not wait for step 8. As a procedure under `docs/testing/` it changes no protected file and applies from O2, to every file about to be committed, session files included.
- **H-29**: the step 8 deny rules also cover connector tools that read or persist, not only those that write or spend.

## A6. Still open after this amendment

- Everything marked unverified in revision 4.
- The Security Engineer's findings on Proposal A (SA4-01 to SA4-05) are accepted and **not yet applied to the brief**. They must be applied before the O3 capture is run. See the remediation matrix.
- This amendment has not been read by the Security Engineer.
