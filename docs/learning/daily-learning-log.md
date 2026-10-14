# Daily learning log

Dated entries. Each says what was learned, what failed, what is still unverified and what is open. Detail lives in the documents referenced by path.

---

## 2026-10-11: validation of the engineering organization

**Subject.** Not a product feature. The machinery itself: ten agents in `.claude/agents/`, the guard hooks in `.claude/hooks/`, the permission rules in `.claude/settings.json`, the run log and `scripts/check-feature-ledger.mjs`.

**Sources.**

- Record: `docs/testing/setup-validation.md`, section "Foundation validation, 2026-10-11".
- Raw evidence: `docs/testing/evidence/foundation-validation-2026-10-11.md`.
- Review: `docs/status/foundation-validation-review-2026-10-11.md`. Recommendation: GO WITH CONDITIONS, six conditions. The owner decides; the reviewer does not.
- Explanations: `docs/learning/concepts.md`, concepts 1 to 8.

**Learning status.** Explanations written. The owner has not yet been asked anything, so nothing here is recorded as understood. Questions are in `docs/learning/understanding-checks.md`.

### What was validated (observed today)

| Result | Source |
|---|---|
| All ten roles ran in a real session | Evidence, role probes and Chief Engineer session |
| A command-line session with no `--agent` flag runs as `chief-engineer` | `path-guard` messages naming `chief-engineer` |
| The Chief Engineer delegated to all nine specialists | Nine records in `.claude/logs/agent-runs.jsonl`, 06:41:15 to 06:41:57 UTC |
| In-lane writes succeeded for nine roles | `File created successfully` tool messages |
| Out-of-lane writes were blocked by `path-guard` for eight roles, nine attempts | Verbatim hook messages |
| The reviewer holds `Read` and `Bash` only | Harness start-up record |
| The reviewer's Bash allowlist blocks `node --version` | Review R17, the reviewer's own run |
| `Read` of `apps/api/.env` was refused for seven roles | Tool message from the permission layer |
| Nine of ten sensitive commands were refused for `devops-sre`, split cleanly between the `deny` and `ask` message forms | Harness `permission_denials` list |
| No push, deployment, release or destructive action took place | Same session; nothing reached a remote |
| `--model opus` billed `claude-opus-5`; `--model sonnet` billed `claude-sonnet-5` | Harness `modelUsage` field |
| `node scripts/test-guards.mjs`: exit 0, 58 pass, 0 fail | QA's own run in the record. The reviewer could not run it and only matched the 58 labels to the source. |

### What failed

| Failure | Source |
|---|---|
| The account's default model, Fable 5, is unusable: "requires usage credits". No model is pinned in the project. | Evidence section 2; record D3 |
| `--model claude-opus-5-5` is rejected by CLI 2.1.231 | Evidence section 2; record D4 |
| A long-running VS Code session did not know the project agents | Evidence section 7. Confounded: that session predates the configuration. |
| No command-line agent completed a Figma call, and no design reference exists in the repository | Record check 7, D6 |
| QA has no tool that can take a screenshot, though its agent file requires screenshots | Record D7 |
| Grep and Glob were not given to any role that holds Bash, though every agent file lists them | Harness record for two roles, self-report for five; record D1 |
| The record's highest-ranked finding (D1's conclusion) was wrong | Review R1. See `docs/learning/debugging-lessons.md`, lesson 1. |
| The record's remedy for the run log (D9, "clear the log") is unsafe if read as "delete" | Review R2. See `docs/learning/concepts.md`, concept 5. |

### What remains unverified

From the record's own list, adjusted by the review:

- An interactive permission prompt shown to a person, and whether approving it lets the command run.
- A freshly started VS Code extension session: does it start as `chief-engineer`, load `CLAUDE.md` and find the project agents?
- Live write blocking for `software-architect` (declined to try) and `independent-reviewer` (no `Write` tool).
- The file-tool branch of `secret-guard.mjs` firing in a real session. Its Bash branch has one prose line of evidence, no transcript (review R15).
- `Read(*.pem)` and `Read(*.key)` deny rules; why a bare `Read(.env)` rule covers a nested path (record D11).
- Secret protection for `backend-data-engineer` and `independent-reviewer` (both declined).
- Whether an unmatched Bash command runs freely after the first call. One trial only (review R14).
- `scripts/check-feature-ledger.mjs` against a real ledger. None exists.
- The model of the orchestrating session. Self-report only.
- The 13-step workflow end to end.
- **Every bypass input in the review (R3 to R13, R16) is static analysis. None was executed.** The exception is plain `rm`, which four roles ran on their own probe files.

No longer open: the reviewer's Bash fence (closed by review R17).

### Weaknesses the owner should carry into the next phase

Explained in `docs/learning/concepts.md`, concepts 4, 5 and 8.

1. Four roles hold unrestricted Bash: `frontend-engineer`, `backend-data-engineer`, `qa-test-engineer`, `devops-sre`. For them path ownership, the destructive-command gate and the dependency gate depend on the agent's restraint. `devops-sre` does the SRE work.
2. The run log proves a named agent finished as a delegated subagent on or after a date. It does not prove the run was for a given feature, it is ignored by git, and it can be appended to from a shell (predicted, not executed).
3. Both guards fail open on unreadable input.
4. No ledger tier fits documentation-only work (review R6).

### Open questions

For the owner to decide (from review section 5):

1. GO, GO WITH CONDITIONS or NO-GO for the SRE and DevOps architecture phase.
2. Pin a model in `.claude/settings.json`, or require `--model opus` in every brief?
3. Does the SRE phase get a ledger, and under which tier? Today it cannot pass the check without a false tick.
4. Should the phase open with `security-sensitive: yes`, given it will design secrets handling?
5. Confirm the brief-level fence on `devops-sre`: no installs, no `package.json` or `.npmrc` edits, no `rm` or `mv` outside its own output.
6. Empty the run log before the first real feature? If so: truncate, by the owner, never delete.
7. Schedule a hardening pass on `.claude/` and `scripts/` for the review's guard findings?

For investigation:

8. Why does the harness withhold Grep and Glob from roles with Bash? Can they be restored?
9. What is the real order of `deny` rules, hooks and `ask` rules? Today's evidence has the permission layer answering first for a `Read` of `.env` and the hook answering first for the Chief Engineer's `git push`. See `docs/learning/concepts.md`, concept 2.
10. Does a fresh VS Code session load the project agents?
11. Which model does the orchestrating session run, read from a harness field and not from its own statement?
12. A reported probe failure, "Input must be provided either through stdin or as a prompt argument", was suggested as a debugging lesson. I found no trace of that message in the record, the evidence or the review, so no lesson was written. If a transcript exists it should be added to the evidence file first. See the note at the end of `docs/learning/debugging-lessons.md`.

### Corrections to earlier learning notes

- `docs/learning/concepts.md`, 2026-10-11 correction block, said "Tool limits are enforced". Still true, but the tools an agent receives are not always the tools its file lists. Corrected in concept 1 of the same file.

---

## 2026-10-11 (later): before the owner decides on two proposals

**Subject.** Two proposals, both unapproved and unimplemented: Proposal A, a brief for a documentation-only SRE architecture phase (`docs/operations/sre-architecture-phase-brief.md`, revised); Proposal B, a security hardening plan (`docs/status/security-hardening-plan-2026-10-11.md`, revision 2).

**Phase.** Before. Everything described is proposed behaviour.

**Sources read.** Both proposals in full; the three specialist reviews of the first drafts (`docs/security/proposals-security-review-2026-10-11.md`, `docs/architecture/reviews/sre-phase-brief-architecture-review.md`, `docs/testing/hardening-test-plan-2026-10-11.md`); `.claude/hooks/path-guard.mjs`, `.claude/hooks/secret-guard.mjs`, `.claude/hooks/log-agent-run.mjs`, `scripts/check-feature-ledger.mjs`, `.claude/settings.json`, `.claude/rules/security.md`, `CLAUDE.md`, `.claude/logs/agent-runs.jsonl`; `scripts/test-guards.mjs` to line 90 only.

**Written.**

- `docs/learning/sre-and-hardening-proposals-before.md`: the concepts behind both proposals, a list of eight ideas to understand before approving, and the main decisions explained without recommendation.
- `docs/learning/debugging-lessons.md`, lessons 4 to 7: four defects the reviews found in proposed fixes.
- `docs/learning/understanding-checks.md`, check 2: six questions.

**Learning status.** Explanations written. The owner has not been asked anything. Nothing is recorded as understood. Check 1 (six questions) and check 2 (six questions) are both unanswered.

### What the material teaches (all proposed unless marked)

| Idea | Where explained |
|---|---|
| Approving Proposal A authorizes documents only; accepting a decision record approves a direction, not a purchase | Before file, A7, A8 |
| RPO and RTO as business choices; a backup is unproven until restored | A4 |
| Egress as cost and as attack; where the entitlement check sits with signed links | A6 |
| Rollback restores code, not data; expand then contract | A2 |
| Text matching versus filesystem enforcement | B1 |
| A strict allowlist behind a lenient "does this apply to you" test (lines 64 and 68 of `path-guard.mjs`, implemented) | B2 |
| A fix can open a hole; H-08 as the worked example | B3; lesson 4 |
| The run log corroborates; run-id binding proves a run ended, not what it did | B4; lesson 6 |
| Prompt injection; three threat cases | B5 |
| Prevention, detection, residual risk; accepting a risk in writing | B6 |
| Removing a tool is a control; a written rule is not | B7 |

### What I observed by reading today (implemented or verified)

- `.claude/settings.json` has no `sandbox` block. The only `rm` rule is `Bash(rm -rf *)`, line 19.
- `path-guard.mjs` line 64 exits 0 for a missing agent type and for any agent type that is not a key of `OWNED`. Line 68 exits 0 for any role with no `BASH_ALLOW` entry.
- `OWNED['devops-sre']` includes `.github/`, `package.json`, `.npmrc` and `.gitignore` (lines 26 and 32). Removing the shell does not change that.
- `check-feature-ledger.mjs` line 18 accepts `--log`; `path-guard.mjs` line 46 admits that command with any arguments.
- `scripts/test-guards.mjs` asserts exit status only (lines 20 to 24, 32).
- The run log holds 16 records: nine at 06:41 UTC and seven later.

### What remains unverified

- Everything in Proposal B: nothing was applied or run. Every weakness and every "after" result is static analysis.
- All sandbox behaviour, and whether settings above the project file can switch it off.
- Whether `--disallowedTools Bash` applies to a delegated run. The observation was of a direct launch, reported by the Chief Engineer; I have not seen the harness record.
- Whether a new VS Code session carries the `chief-engineer` agent type. Only the owner can run that checklist.
- Every vendor behaviour mentioned in Part A: egress charging, link expiry, webhook retries, backup features by plan.
- The Independent Reviewer's findings on either proposal. Not available to me.

### Open questions

Escalated to the Chief Engineer (detail in the before file, section E):

1. The hardening plan says the Independent Reviewer's report on revision 2 is saved at `docs/status/proposals-independent-review-2026-10-11.md`. The file was not in `docs/status/` when I listed it. Which statement is current?
2. The brief says "the tracking file exists". `docs/status/sre-architecture-phase.md` was not in my listing; the file that exists is the hardening plan. Should the wording be corrected?
3. Who implements Proposal B's changes to `.claude/` and `scripts/`, and how does the owner watch it? I did not find this written down.
4. Four review points I did not find answered in the revisions: "no connector tool use" in the fence; `.gitignore` in the `devops-sre` lane; content hashes for the H-03 snapshot; H-19 part (b) still in Wave 2.

For the owner:

5. In your own words, how much lost order data could the business tolerate? This is the input area D waits for.
6. With signed links, is it acceptable that a link already issued keeps working after a refund until it expires? For how long?
7. Is there to be a limit on downloads per purchase?
8. For a session with no agent type: fence it, leave it open and accept the risk in writing, or decide after your own checklist?
9. Will you answer check 1, at least questions 3 and 4, before deciding? They cover ground these decisions stand on.

For investigation:

10. How does the harness treat a hook that exits with a code other than 0 or 2, or that fails to start? Lesson 4 and section B3 both depend on the answer.
11. An inference of mine that nobody has reviewed: after a restore, an entitlement revoked following a refund would come back as granted. If right, it belongs in area D's restore procedure.

### Corrections to earlier learning notes

- `docs/learning/concepts.md`, concept 5, says the run log holds nine records. True when written; it holds 16 as read today. The reasoning in concept 5 is unaffected.
- The first entry in this log lists "four roles hold unrestricted Bash" as weakness 1 and proposes a brief-level fence on `devops-sre` (owner question 5). The revised brief replaces that written fence with launching the role without a shell. Explained in the before file, section B7.

---

## 2026-10-12: a study guide for the two understanding checks

**Subject.** The owner asked for help understanding the twelve questions in `docs/learning/understanding-checks.md`, with two conditions: SAGE does not answer them on the owner's behalf, and nothing is marked understood without the owner's demonstrated understanding.

**Written.** `docs/learning/understanding-checks-study-guide.md`. For each question: what it asks, the idea needed first, where to read, a worked example on a different input, three hints, a common mistake, and what the owner should be able to explain aloud. It also gives a suggested order, two ways to answer, and a glossary. It states no answer to any of the twelve. One pointer line was added at the top of `understanding-checks.md`; no answer or assessment field was touched.

**Learning status.** All twelve questions remain unanswered: check 1, questions 1 to 6, and check 2, questions 1 to 6. Nothing is recorded as understood. The learning gate is not passed for either check. The guide is an explanation, and an explanation is not an answer.

**Suggested first three**, because decisions in front of the owner rest on them: check 1 question 3, check 1 question 4, check 2 question 3.

**Read today.** `.claude/hooks/path-guard.mjs`, `.claude/hooks/secret-guard.mjs`, `.claude/hooks/log-agent-run.mjs`, `scripts/check-feature-ledger.mjs`, `.claude/settings.json`, `scripts/test-guards.mjs` lines 1 to 40, the plan's entries H-01 to H-05 and H-31 to H-33, the brief's sections 4 and 5, and the four learning files. I ran nothing. Every trace in the guide is static analysis, not executed.

### Things noticed while writing it

- Some sections of the notes trace inputs very close to the ones the questions ask (concept 2's table for check 1 question 1; concept 5's three-state table for check 1 question 3; the before file's section B3 for check 2 question 3; section A4 for check 2 question 2). An answer that reproduces those sections shows reading, not yet independent tracing. The guide tells the owner this, and whoever assesses should follow up with a changed input.
- Check 1 question 3 says the run log holds nine records. It held 16 when last read on 2026-10-11. I did not re-read the log today. The guide asks the owner to open it and count.
- Check 1 question 4 was written before the brief was revised. Section 5 of the brief now proposes launching `devops-sre` with no shell. The guide asks the owner to answer first and compare afterwards.
- `docs/status/proposals-independent-review-2026-10-11.md` is now present in my listing of `docs/status/`. The 2026-10-11 entry above and section E, item 1 of the before file record it as absent at that time. I have not read it, and the before file has not been revised against it.
- Connector instruction text was present in my context during this task. I treated it as data and called no connector tool. [self-report]

### Open questions

1. Which way will the owner answer: through the Chief Engineer, or in a direct session with SAGE? An interactive session started with `--agent sage` has not been observed in this repository.
2. Should the before file be revised against the Independent Reviewer's report now that the file exists?
3. Should check 1 question 3 be reworded for the current number of log records? I have left the question as written.
