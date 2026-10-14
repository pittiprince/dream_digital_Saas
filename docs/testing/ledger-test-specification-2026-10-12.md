# Ledger checker: false-acceptance test specification

Date: 2026-10-12. Author: QA and Test Engineer. Written for `docs/status/final-closure-amendment-2026-10-12.md` section 3, as the failing-first case list for hardening step 2 (`scripts/check-feature-ledger.mjs`).

**State of this file.**

| | Count |
|---|---|
| Cases defined | 122: 103 expected to fail (exit 1; two of them conditionally), 3 expected to exit with status 3, 13 pass cases, 3 pins of documented limits |
| Cases written as test code | 0 |
| Cases executed | 0 |
| Results seen | 0 |

This is a specification. No test code exists, nothing was run, and no prediction below has been observed. Every statement about what the present checker does is **predicted, not run**, from reading `scripts/check-feature-ledger.mjs` (119 lines) and `scripts/test-guards.mjs:103-148`.

**Three things the reader must know before using it.**

1. **The cases run ahead of the plan.** Revision 5 of the plan (`docs/status/security-hardening-plan-rev5-2026-10-12.md`, section 7) holds rules 1 to 12. Many findings below were raised *against* revision 5, and their fixes are in the reviews, not in the plan. For those, the expected behaviour is taken from the reviewer's stated fix and the last column says "not in rev5". Section 4 lists what the plan must adopt or decide. A case marked **provisional** depends on such a decision and its expected text may change; its expected *exit status* does not.
2. **The session-record format is unverified** until the owner's capture at O3 (plan section 7, "What the tooling may not be able to establish"). All cases that read a session file use the provisional format in 1.5. The format must be replaced by what the capture reports, and the cases for any rule the capture shows to be impossible move to the attestation cases.
3. **The message texts are proposed here.** The plan gives no message for any rule. Each fail case names a substring the checker's output must contain. They are a contract for the patch author to implement exactly, and for the reviewers to change before the test diff is written, not after.

Sources read: plan revision 5 sections 6 (ledger entries), 7 and 9; the amendment sections 2 and 3; the Security review of revision 5, sections 2, 4 and 9 (`docs/security/proposal-b-rev5-security-review-2026-10-12.md`); the fourth review, sections 1 and 4 (`docs/status/proposals-fourth-review-2026-10-12.md`); the third review's F1 to F6 table (`docs/status/proposals-third-review-2026-10-12.md`); the checker; the guard test file; `.claude/hooks/log-agent-run.mjs` for the run-record fields.

---

## 1. Fixture

Each case builds its own temporary directory, so no case depends on another. Nothing touches the real repository, the real run log or the real ledger folder.

### 1.1 The temporary repository

Helper `makeRepo()`:

1. `mkdtemp` under the OS temporary directory. Call the result `R`.
2. In `R`: `git init -b main`; set `user.name` and `user.email` in the repository's own config to fixture values; set `commit.gpgsign false`. No global config is read or written (`GIT_CONFIG_GLOBAL` and `GIT_CONFIG_SYSTEM` point at an empty file for every git call the test and the checker make).
3. Every commit is made with `GIT_AUTHOR_DATE` and `GIT_COMMITTER_DATE` set to the fixed time given below, so no case depends on the clock.
4. The checker is **copied** to `R/scripts/check-feature-ledger.mjs` and run as `node scripts/check-feature-ledger.mjs` with working directory `R` and **no arguments** (plan H-33: no `--dir`, no `--log`).
5. The case records exit status and the whole of standard output and standard error.
6. `R` is removed in a `finally` block.

### 1.2 Files and commits of the base fixture (BASE)

All times are 2026-01-01, UTC. Every commit is on `main`, each the child of the one before.

| Name | Time | Adds or changes | Message (exact lines that matter) |
|---|---|---|---|
| **K0** baseline | 10:00 | `.gitignore` (lines: `.claude/logs/`, `.claude/settings.local.json`, `.DS_Store`, `.vscode/*`); `scripts/check-feature-ledger.mjs`; `.claude/hooks/path-guard.mjs` (one comment line; stands for any tracked file outside `docs/`); `docs/status/features/_TEMPLATE.md` (copy of the real template as changed by step 2); `docs/status/pre-existing.md` (one line) | `baseline` |
| **K1** capture | 10:10 | `docs/testing/evidence/capture/capture.jsonl` (1.5) | `capture` |
| **OPEN** | 11:00 | `docs/status/features/D-900-fixture.md` (1.3) **and nothing else** | Subject `open D-900`; body line `Ignored-files-present: none` (provisional, section 4 item NR-05) |
| **APPROVE** | 11:10 | `docs/status/d900-plan.md` (one line) | A line that is exactly `Approved-by-owner: D-900 plan-approved` |
| **S1** | 12:00 | `docs/operations/sessions/d900-a1.jsonl`; `docs/operations/d900-a.md` | `session a1` |
| **S2** | 12:10 | `docs/operations/sessions/d900-a2.jsonl`; `docs/operations/d900-b.md` | `session a2` |
| **DOCS** | 12:20 | `docs/learning/d900-before.md`; `docs/security/d900-review.md`; `docs/status/d900-review.md`; `docs/learning/d900-after.md` (one line each) | `deliverables` |
| **TICK** | 13:00 | The ledger, ticked and filled as in 1.3 | `tick` |
| **ACCEPT** | 14:00 | The ledger: `accepted: no` becomes `accepted: yes`. Nothing else | A line that is exactly `Accepted-by-owner: D-900` (provisional, NR-06) |

After ACCEPT the working tree is clean and the only ignored file present is the run log.

**Terms, as used in every case.**

- **The opening commit** is OPEN: the earliest commit that added the ledger file.
- **The accepting commit** is ACCEPT: the commit that first sets `accepted: yes` in the ledger.
- **The window** is every commit from OPEN to ACCEPT inclusive, plus the working tree and the ignored files present when the checker runs. Before an accepting commit exists, the window runs from OPEN to `HEAD` plus the working tree.
- "At X" means the case stops building after commit X and runs the checker there. "TICK′" means the case commits a different ledger text in place of TICK's. Unless a row says otherwise, later BASE commits are made unchanged.

### 1.3 The opening ledger

`docs/status/features/D-900-fixture.md` as committed in OPEN. `<K1>` is the full hash of commit K1. `-` is the placeholder for a value not yet set (provisional, NR-14).

```
# D-900: fixture

id: D-900
tier: design
ui: no
security-sensitive: yes
no-shell: devops-sre
capture: docs/testing/evidence/capture/capture.jsonl@<K1>
attested-rules: none
accepted: no
learning-complete: no

## Stages

- [ ] sage-before | agent: sage | item: docs/learning/d900-before.md | run: - | evidence: -
- [ ] plan-approved | agent: owner | commit: - | evidence: -
- [ ] authoring | agent: devops-sre | item: docs/operations/d900-a.md | session: - | file: - | commit: - | probe: apps/web/_probe-d900-a1.txt | evidence: -
- [ ] authoring | agent: devops-sre | item: docs/operations/d900-b.md | session: - | file: - | commit: - | probe: apps/web/_probe-d900-a2.txt | evidence: -
- [ ] security | agent: security-engineer | item: docs/security/d900-review.md | run: - | evidence: -
- [ ] review | agent: independent-reviewer | item: docs/status/d900-review.md | run: - | evidence: -
- [ ] sage-after | agent: sage | item: docs/learning/d900-after.md | run: - | evidence: -
- [ ] understanding-check | agent: sage | item: docs/learning/d900-check.md | run: - | evidence: -
```

`attested-rules:` is a provisional header field (NR-06; Security review 4.3 point 1). Eight frozen stage lines.

**The ledger as committed in TICK.** Header unchanged. Lines 1 to 7 ticked, with:

| Line | Values set |
|---|---|
| `sage-before` | `run: run-sage-1`, `evidence: docs/learning/d900-before.md` |
| `plan-approved` | `commit: <APPROVE>`, `evidence: approved in commit` |
| `authoring` a | `session: sess-a1`, `file: docs/operations/sessions/d900-a1.jsonl`, `commit: <S1>`, `evidence: docs/operations/d900-a.md` |
| `authoring` b | `session: sess-a2`, `file: docs/operations/sessions/d900-a2.jsonl`, `commit: <S2>`, `evidence: docs/operations/d900-b.md` |
| `security` | `run: run-sec-1`, `evidence: docs/security/d900-review.md` |
| `review` | `run: run-rev-1`, `evidence: docs/status/d900-review.md` |
| `sage-after` | `run: run-sage-2`, `evidence: docs/learning/d900-after.md` |
| `understanding-check` | left unticked, all values `-` |

### 1.4 The run log

`R/.claude/logs/agent-runs.jsonl`, ignored by K0's `.gitignore`, written by the test after OPEN. One JSON object per line with the four fields the logging hook writes (`time`, `agent`, `agentId`, `session`):

| `time` | `agent` | `agentId` | `session` |
|---|---|---|---|
| `2026-01-01T11:20:00.000Z` | `sage` | `run-sage-1` | `log-1` |
| `2026-01-01T11:30:00.000Z` | `security-engineer` | `run-sec-1` | `log-2` |
| `2026-01-01T11:40:00.000Z` | `independent-reviewer` | `run-rev-1` | `log-3` |
| `2026-01-01T11:50:00.000Z` | `sage` | `run-sage-2` | `log-4` |

### 1.5 Session files (provisional format)

One JSON object per line. `<R>` is the absolute path of the temporary repository, so targets are absolute, as the Write tool records them.

`docs/operations/sessions/d900-a1.jsonl`:

| # | Record |
|---|---|
| 1 | `type: "system"`, `subtype: "init"`, `session_id: "sess-a1"`, `agent: "devops-sre"`, `started: "2026-01-01T11:45:00Z"`, `tools: ["Read","Write","Edit","Grep","Glob"]` |
| 2 | `type: "tool_use"`, `id: "t1"`, `name: "Write"`, `input.file_path: "<R>/apps/web/_probe-d900-a1.txt"` |
| 3 | `type: "tool_result"`, `tool_use_id: "t1"`, `is_error: true`, `content:` the path guard's text for that agent and path: `path-guard: devops-sre does not own apps/web/_probe-d900-a1.txt.` followed by the guard's fixed second sentence |
| 4 | `type: "tool_use"`, `id: "t2"`, `name: "Write"`, `input.file_path: "<R>/docs/operations/d900-a.md"`, `input.content:` the exact bytes of the committed `docs/operations/d900-a.md` |
| 5 | `type: "tool_result"`, `tool_use_id: "t2"`, `is_error: false` |

`d900-a2.jsonl` is the same with `sess-a2`, `started` 11:55, probe `apps/web/_probe-d900-a2.txt`, item `docs/operations/d900-b.md`.

`docs/testing/evidence/capture/capture.jsonl` (committed in K1): first record `session_id: "sess-cap"`, `agent: "devops-sre"`, `started: "2026-01-01T10:05:00Z"`, the same five tools; then a denied write to `apps/web/_probe-capture.txt` with the guard's text naming `devops-sre`. No write to any `item:` path. **The captured set** is therefore `Read, Write, Edit, Grep, Glob`.

### 1.6 What the checker prints (proposed contract)

- Per ledger, one of `ok    <file>`, `FAIL  <file>`, `ATTESTED  <file>`, then one line per problem.
- Per ledger, an integrity line: `opening commit <hash>, frozen ledger blob <hash>, <n> frozen lines` (plan, "Integrity verification"), and `complete: yes` or `complete: no` (fourth review, R4-01).
- A last line `<n> ledger(s) checked, <f> with problems, <a> attested.`
- Exit status: 1 if any ledger has a problem; otherwise 3 if any ledger has an attested stage; otherwise 0. **Fail dominates** (Security review 4.3 point 4).

Every fail case asserts **both** exit status 1 and the named substring. Every case, pass or fail, also asserts that the output does not contain the tier message of the present checker (`tier must be`), so a case cannot go green on an unrelated failure.

---

## 2. Fail cases and status-3 cases

### 2.0 What the present checker does with every design-tier input

Predicted, not run. Three facts decide almost every row:

- **PB-1.** `design` is not a key of `REQUIRED`, so `checkLedger` returns at `:65` with the single problem `tier must be "substantial" or "small", found "design"`. Exit status 1. The checker stops there: it never looks at the stage lines, the header, or anything else. So today every case below that keeps `tier: design` **exits 1 for a reason unrelated to the input.** A test that asserted only the exit status would pass today without the rule existing. That is why every row asserts a message.
- **PB-2.** The present checker never calls git and never opens a session file, a deliverable, or a commit message. It reads the working copy of each ledger and the run log. It has no notion of an opening commit, a window, a probe, an item or an approval line. So, the tier line apart, none of the inputs below is something it could detect.
- **PB-3.** A stage line in the new form does not match the pattern at `:24`, which requires `evidence:` directly after `agent:`. Such lines are not parsed as stages at all.

"Present" column codes: **PB-1** as above (exit 1, tier message only, input not examined). Other outcomes are written out. In the failing-first run, every row marked PB-1 is expected to **fail its test on the message assertion**, with status 1 observed.

Column "Plan row" says which row of the plan's section 7 test table the case matches, counted from the top (1 to 19), or "none".

### 2.1 The frozen ledger and how ledgers are found

| Case | Source | Input (change to BASE) | Present (predicted, not run) | Expected after the change | Rule tested; plan row |
|---|---|---|---|---|---|
| LT-01 | F1, N1 | TICK′: header line becomes `no-shell: -`; `authoring` a line becomes `- [x] authoring \| agent: devops-sre \| item: docs/operations/d900-a.md \| run: run-sre-1 \| evidence: docs/operations/d900-a.md`. Run log gains `devops-sre`, `run-sre-1`, 11:42. S1 not made; the item is committed in DOCS. At TICK′ | PB-1 | Fail. `header field "no-shell" differs from the opening commit` | Frozen header; rule 3. Row 1 |
| LT-02 | F1 | As LT-01 but the header is left unchanged | PB-1 | Fail. `stage line set differs from the opening commit` (the line lost its `probe:`, so it is a different line) | Frozen line set. None |
| LT-03 | F1 | OPEN′: the opening ledger itself holds `authoring` a in the run form of LT-01 (no `probe:`), with `no-shell: devops-sre`. TICK′ ticks it with `run-sre-1` and its log record | PB-1 | Fail. `devops-sre is listed under no-shell and may hold stage "authoring" only through a session line` | Rule 3. Row 4 |
| LT-04 | F2, N2 | S2 not made. TICK′: the `authoring` b line is absent; everything else as TICK. ACCEPT made | PB-1 | Fail. `stage line set differs from the opening commit` and `missing: authoring` | Frozen line set. Row 2, first half |
| LT-05 | F2, N2 | TICK′ adds `- [x] review \| agent: independent-reviewer \| item: docs/status/d900-review-2.md \| run: run-rev-2 \| evidence: x`, with the file and a log record | PB-1 | Fail. `stage line set differs from the opening commit` and `added: review` | Frozen line set. Row 2, second half |
| LT-06 | F2 | S2 not made. TICK′ leaves `authoring` b unticked. ACCEPT made | PB-1 | Fail. `marked accepted but stage "authoring" is not complete` | Rule 1. Row 3 |
| LT-07 | N1 | At TICK, then in the working copy only: `tier: design` becomes `tier: trivial` | **Exit 0, `ok`.** `:64` returns no problems for `trivial` whatever else the file says. This is a live false acceptance today | Fail. `header field "tier" differs from the opening commit` | Frozen header. None |
| LT-08 | N1, S5-04 | At TICK, working copy only: the `capture:` line names `docs/testing/evidence/capture/other.jsonl@<K1>` | PB-1 | Fail. `header field "capture" differs from the opening commit` | Frozen header. None |
| LT-09 | N1 | At TICK, working copy only: `security-sensitive: yes` becomes `no` | PB-1 | Fail. `header field "security-sensitive" differs from the opening commit` | Frozen header. None |
| LT-10 | S5-03 (FP-1) | After TICK, one commit CK adds `docs/status/features/D-901-shadow.md` **and** `docs/status/note.md`. D-901: `id: D-901`, `tier: design`, `no-shell: -`, one line `- [x] authoring \| agent: devops-sre \| item: docs/operations/d900-a.md \| run: run-sre-1 \| evidence: x`, `accepted: no`; matching log record | PB-1 for both files | Fail. `opening commit of D-901-shadow.md touches paths other than that ledger`. The last line reads `2 ledger(s) checked` | Not in rev5; fix from S5-03. None |
| LT-11 | S5-03 (FP-1) | As LT-10, but CK adds only the second ledger, and its header says `id: D-900` | PB-1 for both | Fail. `two ledgers share id "D-900"` | Not in rev5; S5-03. None |
| LT-12 | S5-03 (FP-1) | OPEN′: the file is named `D-900-fixture.md` and its header says `id: D-901` | PB-1 | Fail. `file name does not begin with the ledger id` | Not in rev5; S5-03. None |
| LT-13 | S5-03, SR-07 | OPEN′ adds the ledger and also `docs/status/d900-note.md` | PB-1 | Fail. `opening commit of D-900-fixture.md touches paths other than that ledger` | Not in rev5; S5-03. None |
| LT-14 | N1 (plan text) | After OPEN: commit X1 deletes the ledger; commit X2 adds it again with `no-shell: -` | PB-1 | Fail. `ledger was deleted and re-added` | Plan section 7, opening commit. None |
| LT-15 | R4-04 | At TICK, working tree only: the ledger is renamed `D-900-fixture.txt` | **Exit 0.** `:106` keeps `.md` names not beginning with `_`; none is left; prints `0 ledger(s) checked, 0 with problems.` | Fail. `no ledger found` | Not in rev5; R4-04. None |
| LT-16 | R4-04 | A second valid ledger `D-902-other.md` is opened alone in its own commit after OPEN. Then, working tree only, `D-900-fixture.md` is deleted | Exit 1 by PB-1 on D-902 only; D-900's absence is not noticed | Fail. `ledger tracked at HEAD is missing from the working tree: D-900-fixture.md` | Not in rev5; R4-04. None |
| LT-17 | S5-13 | K0′: `_TEMPLATE.md` has no `security-sensitive` line. OPEN′: the ledger has none either | PB-1 | Fail. `missing header field "security-sensitive"` (the field list is in the checker, not read from the template) | Not in rev5; S5-13, with H-37. None |
| LT-18 | S5-13 | BASE complete. Then one commit in the window (before ACCEPT) rewrites `_TEMPLATE.md` to hold one header field only | PB-1 | Not a fail: exit 0, same output as P-01. Listed here because it guards the same fix: the template is not an input | Not in rev5; S5-13. None |

### 2.2 `run:` lines

| Case | Source | Input (change to BASE) | Present | Expected after | Rule; plan row |
|---|---|---|---|---|---|
| LT-19 | H-14 | TICK′: `security` cites `run: run-none`; no such record | PB-1 | Fail. `run "run-none" is not in the run log` | Rule 2. Row 5 |
| LT-20 | H-14 | TICK′: `sage-after` cites `run-sage-1`, already cited by `sage-before` | PB-1 | Fail. `run "run-sage-1" is cited more than once` | Rule 2. Row 5 |
| LT-21 | H-14 | Log: the security record has `agentId: null`. TICK′: `security` cites `run: null` | PB-1 | Fail. `run id is null` | Rule 2. Row 5 |
| LT-22 | H-14 | Log: the security record's `time` is `2026-01-01T10:30:00.000Z`, before OPEN | PB-1 | Fail. `run "run-sec-1" is dated before the opening commit` | Rule 2. Row 5 |
| LT-23 | H-14 | TICK′: `security` cites `run-rev-1`, a record of another agent; `review` cites `run-sec-1` | PB-1 | Fail. `run "run-rev-1" is not a run of security-engineer` | Rule 2. None |
| LT-24 | H-11 | The run log file does not exist. At TICK | PB-1. (With a known tier: exit 0 and a note, `:76`, `:104`) | Fail. `no run log` | Rule 2. None (plan section 9) |
| LT-25 | R4-02 | DOCS′ does not add `docs/security/d900-review.md`. TICK unchanged, so `security` is ticked with a valid run | PB-1 | Fail. `item "docs/security/d900-review.md" does not exist` | Not in rev5; R4-02. None |
| LT-26 | R4-02 | The `review` line's `item:` at OPEN′ is `docs/status/pre-existing.md`, which K0 added | PB-1 | Fail. `item "docs/status/pre-existing.md" was not added in the window` | Not in rev5; R4-02. None |

### 2.3 `session:` lines: the file and its commit (rules 4, 5, 6)

| Case | Source | Input (change to BASE) | Present | Expected after | Rule; plan row |
|---|---|---|---|---|---|
| LT-27 | SR-02 | After S1, working tree only: `d900-a1.jsonl` is deleted | PB-1 | Fail. `session file "docs/operations/sessions/d900-a1.jsonl" is missing` | Rule 4. Row 6 |
| LT-28 | SR-02 | After ACCEPT, working tree only: one byte appended to `d900-a1.jsonl` | PB-1 | Fail. `session file "…d900-a1.jsonl" differs from the blob in commit` | Rule 4. Row 6 |
| LT-29 | N4 | `d900-a1.jsonl` is added by a commit between K1 and OPEN; S1 adds only the deliverable; the line cites that earlier commit | PB-1 | Fail. `is not a descendant of the opening commit` | Rule 4. Row 6 |
| LT-30 | N4 | OPEN′ adds the ledger and `d900-a1.jsonl` together; the line cites OPEN′ | PB-1 | Fail. `session file may not be added by the opening commit` | Rule 4. Row 6 |
| LT-31 | SR-02 | TICK′: `authoring` a cites `commit: <S2>` | PB-1 | Fail. `commit … did not first add "…d900-a1.jsonl"` | Rule 4. Row 6 |
| LT-32 | S5-05 (FP-3) | After S1, commit S1b replaces `d900-a1.jsonl` with a different valid-looking file (same session id; the write to the item removed, or any other byte change). Line cites `<S1>`. Working tree equals `HEAD` | PB-1 | Fail. `session file "…d900-a1.jsonl" was changed by a later commit` | Rule 4 as corrected by S5-05; not in rev5 as worded. None (row 6 covers a working-tree change only) |
| LT-33 | F3 | S1′ adds `docs/operations/sessions/d900-a1.jsonl` as a byte copy of `capture.jsonl`, and the deliverable. TICK′: `authoring` a cites `session: sess-cap`, that file, `<S1′>` | PB-1 | Fail, and the output contains **all three**: `session "sess-cap" started before the opening commit`; `no denied write to probe path "apps/web/_probe-d900-a1.txt"`; `no successful write to item "docs/operations/d900-a.md"` | Rules 5, 8, 9. Row 7 |
| LT-34 | F3 (fourth review: "reopens if rule 8 is attested") | As LT-33, with `attested-rules: 8` in OPEN′ and S1′'s message carrying `Attested-by-owner: sess-cap devops-sre docs/operations/d900-a.md` | PB-1 | Fail, exit 1, never 3. Contains the rule 5 and rule 9 messages of LT-33 | Rules 5, 9; fail dominates. None |
| LT-35 | S5-14 (FP-9) | `d900-a1.jsonl` first record has `started: "2026-01-01T10:30:00Z"`; all else valid, including the unique probe | PB-1 | Fail. `session "sess-a1" started before the opening commit` | Rule 5. None |
| LT-36 | S5-14 (FP-9) | `d900-a1.jsonl` first record has **no** `started` field; all else valid; `attested-rules: none` | PB-1. (Under rev5 as worded this input passes: "if the record holds one") | Fail. `first record of "…d900-a1.jsonl" holds no start time` | Rule 5 as corrected by S5-14; not in rev5 as worded. None |
| LT-37 | SR-02 | `d900-a1.jsonl` first record has `session_id: "sess-zz"`; the line cites `sess-a1` | PB-1 | Fail. `first record of "…d900-a1.jsonl" does not carry session "sess-a1"` | Rule 5. Row 8 |
| LT-38 | SR-02 | TICK′: `authoring` b cites `session: sess-a1`, file `d900-a1.jsonl`, `<S1>` (the same as line a) | PB-1 | Fail. `session "sess-a1" is cited more than once` | Rule 6. Row 8 |

### 2.4 `session:` lines: tools, identity, authorship (rules 7, 8, 9)

All provisional on the record format (NR-04).

| Case | Source | Input (change to BASE) | Present | Expected after | Rule; plan row |
|---|---|---|---|---|---|
| LT-39 | SR-02 | `d900-a1.jsonl` first record `tools` also lists `Bash` | PB-1 | Fail. `tool "Bash" is not in the captured set` | Rule 7. Row 9 |
| LT-40 | SR-02 | First record unchanged; a further `tool_use` record names `Bash` | PB-1 | Fail. `tool call names "Bash", which is not in the captured set` | Rule 7. Row 9 |
| LT-41 | S5-04 (FP-2) | K1′: the capture's first record lists `Bash` as a sixth tool. `d900-a1.jsonl` lists and calls `Bash` | PB-1. (Under rev5 as worded this passes: the session is a subset of the captured set) | Fail. `captured set for a no-shell agent contains "Bash"` | Not in rev5; S5-04. None |
| LT-42 | S5-04 (FP-2) | As LT-41 with `Agent` in place of `Bash` | PB-1 | Fail. `captured set for a no-shell agent contains "Agent"` | Not in rev5; S5-04. Provisional on the tool list, NR-10 |
| LT-43 | S5-04 (FP-2) | As LT-41 with `WebFetch` | PB-1 | Fail. `captured set for a no-shell agent contains "WebFetch"` | As LT-42 |
| LT-44 | S5-04 (FP-2) | As LT-41 with a tool whose name begins `mcp__` (fixture name `mcp__fixture__send`) | PB-1 | Fail. `captured set for a no-shell agent contains "mcp__fixture__send"` | As LT-42 |
| LT-45 | S5-04 (FP-2) | The capture is committed as KX on a branch `side` forked from K0 and never merged; OPEN′ on `main` names `capture.jsonl@<KX>` | PB-1 | Fail. `capture commit is not an ancestor of the opening commit` | Not in rev5; S5-04. None |
| LT-46 | S5-04 (FP-2) | BASE, then a commit in the window rewrites `capture.jsonl` so its tool list includes `Bash`; `d900-a2.jsonl` (S2′) lists and calls `Bash` | PB-1 | Fail. `tool "Bash" is not in the captured set` (the set is read from the blob at `<K1>`, not the working file) | Not in rev5; S5-04. None |
| LT-47 | SR-03 | `d900-a1.jsonl`: records 2 and 3 removed. Added: a `Read` call on `docs/status/pre-existing.md` whose result `content` holds the guard's full sentence for `devops-sre` and the probe path | PB-1 | Fail. `no denied write to probe path "apps/web/_probe-d900-a1.txt"` | Rule 8. Row 10 |
| LT-48 | SR-03, S5-07 | Record 3's `content` names `chief-engineer` in place of `devops-sre` | PB-1 | Fail. `denial for probe path "apps/web/_probe-d900-a1.txt" does not name devops-sre` | Rule 8. None |
| LT-49 | F3 | Record 2 targets `<R>/apps/web/_probe-d900-a2.txt` (the other line's probe), with a matching denial | PB-1 | Fail. `no denied write to probe path "apps/web/_probe-d900-a1.txt"` | Rule 8. None |
| LT-50 | F3 | OPEN′: both `authoring` lines carry `probe: apps/web/_probe-d900-a1.txt` | PB-1 | Fail. `probe path "apps/web/_probe-d900-a1.txt" is not unique to one line` | Rule 8. None |
| LT-51 | SR-03 | Record 3 has `is_error: false` and `content` "File created successfully" (the write to the probe path succeeded) | PB-1 | Fail. `write to probe path "apps/web/_probe-d900-a1.txt" was not denied` | Rule 8. None |
| LT-52 | H-14 | `d900-a1.jsonl`: records 4 and 5 removed | PB-1 | Fail. `no successful write to item "docs/operations/d900-a.md"` | Rule 9. Row 11 |
| LT-53 | H-14 | Record 5 has `is_error: true` | PB-1 | Fail. `no successful write to item "docs/operations/d900-a.md"` | Rule 9. None |
| LT-54 | S5-06 (path comparison) | Record 4 targets `/other-root/docs/operations/d900-a.md`: an absolute path outside `<R>` with the same ending | PB-1 | Fail. `no successful write to item "docs/operations/d900-a.md"` | Rule 9 with the stated normalisation; not in rev5. None |
| LT-55 | Security 4.4 (structured records) | Records 4 and 5 removed. Added: a `Read` call whose result `content` is a string holding the JSON text of records 4 and 5 | PB-1 | Fail. `no successful write to item "docs/operations/d900-a.md"` | Rule 9, top-level records only; not in rev5. None |
| LT-56 | S5-06 (FP-4) | Record 4's `input.content` is one line, `draft`. The committed `docs/operations/d900-a.md` in S1 holds different text | PB-1 | **Conditional, NR-07.** If the capture shows written content is recorded: fail, `deliverable "docs/operations/d900-a.md" does not equal the session's last successful write`. If not: this becomes a pin of a documented limit (exit 0) and joins section 4 | Not in rev5; S5-06. None |
| LT-57 | S5-06 (FP-4) | As BASE, then a commit in the window, after S1, changes `docs/operations/d900-a.md` | PB-1 | Conditional, as LT-56, same message | Not in rev5; S5-06. None |

### 2.5 The owner's approval line (rule 10)

| Case | Source | Input (change to BASE) | Present | Expected after | Rule; plan row |
|---|---|---|---|---|---|
| LT-58 | F5 | APPROVE′'s message is `plan ok` only. TICK cites it | PB-1 | Fail. `commit … does not carry the line "Approved-by-owner: D-900 plan-approved"` | Rule 10. Row 12 |
| LT-59 | F5 | TICK′: `plan-approved` ticked with `commit: -` | PB-1 | Fail. `stage "plan-approved" is ticked but cites no commit` | Rule 10. Row 12 |
| LT-60 | F5 | TICK′: `plan-approved` cites forty hex characters that name no commit | PB-1 | Fail. `commit … does not exist` | Rule 10. None |
| LT-61 | S5-15 (FP-10) | K0′'s message carries the approval line; APPROVE not made; TICK′ cites `<K0′>` | PB-1 | Fail. `approval commit … is not a descendant of the opening commit` | Not in rev5; S5-15. None |
| LT-62 | S5-15 (FP-10) | APPROVE is made on branch `side` forked from OPEN and never merged; TICK′ cites it | PB-1 | Fail. `approval commit … is not in the window` | Not in rev5; S5-15. None |
| LT-63 | S5-15 (FP-10) | APPROVE not made at 11:10. A commit after ACCEPT carries the approval line; a further commit edits the ledger to cite it | PB-1 | Fail. `approval commit … is not in the window` (and LT-91's message, since the ledger changed after acceptance) | Not in rev5; S5-15. None |
| LT-64 | S5-15 (FP-10) | OPEN′ has two `plan-approved` lines (items differ by an added `item:` value); TICK′ ticks both citing `<APPROVE>` | PB-1 | Fail. `commit … is cited more than once` | Not in rev5; S5-15. Provisional: whether two owner lines may exist at all |
| LT-65 | R4-06 | APPROVE′'s message line is `Not yet Approved-by-owner: D-900 plan-approved, pending the review` | PB-1 | Fail. Message of LT-58 (whole-line match) | Not in rev5; R4-06. None |
| LT-66 | R4-06 | APPROVE′'s message line is `Approved-by-owner: D-9001 plan-approved` | PB-1 | Fail. Message of LT-58 | Rule 10 with whole-line match. None |
| LT-67 | R4-06 | APPROVE is made after S1 and S2 (at 12:15) | PB-1 | Fail. `approval commit … is not an ancestor of session commit` | Not in rev5; R4-06. None |

### 2.6 Attestation, acceptance and completeness

`attested-rules:` and the acceptance line are provisional (NR-06). "A1" below is the attested fixture: OPEN′ has `attested-rules: 8`; `d900-a1.jsonl` has records 2 and 3 removed (the format is taken not to carry the denial); S1′'s message carries the exact line `Attested-by-owner: sess-a1 devops-sre docs/operations/d900-a.md`; `d900-a2.jsonl` and S2 likewise for `sess-a2` and its item.

| Case | Source | Input | Present | Expected after | Rule; plan row |
|---|---|---|---|---|---|
| LT-68 | N7; plan fallback | A1, complete to ACCEPT, with ACCEPT's message also recording the status-3 decision (text: NR-06) | PB-1 | **Exit 3.** `ATTESTED  D-900-fixture.md`; both `authoring` lines reported `attested, not verified`; never `ok` | Attestation fallback. Row 17 |
| LT-69 | S5-07 (4.3 point 4) | A1 complete, and a second ledger `D-902-other.md`, valid and fully verified, opened alone in its own commit | PB-1 | **Exit 3.** One `ATTESTED`, one `ok` | Attestation fallback. None |
| LT-70 | S5-14 with S5-07 | OPEN′ `attested-rules: 5`; `d900-a1.jsonl` first record has no `started`; S1′ carries the attestation line for `sess-a1`; `d900-a2.jsonl` holds a valid start time and S2 carries no such line | PB-1 | **Exit 3.** Only `authoring` a is reported attested; b is verified | Rule 5 by attestation. None |
| LT-71 | S5-07 (FP-8) | BASE (`attested-rules: none`), with LT-48's change (denial names another agent) and S1′ carrying the attestation line | PB-1 | Fail, exit 1. LT-48's message, and `rule 8 is not an attested rule for this ledger` | Not in rev5; S5-07 points 1, 2. None |
| LT-72 | S5-07 (4.3 point 1) | A1 at TICK, then in the working copy of the ledger only: `attested-rules: 8` becomes `attested-rules: 8, 9`. No other file changes | PB-1 | Fail. `header field "attested-rules" differs from the opening commit` | Frozen header. None |
| LT-73 | S5-07 (4.3 point 3) | A1, but the attestation line for `sess-a1` is in DOCS′'s message, not in S1′'s | PB-1 | Fail. `no attestation for session "sess-a1" in the commit that added its file` | Not in rev5; S5-07. None |
| LT-74 | S5-07 (4.3 point 3) | A1, but S2′'s message repeats the line for `sess-a1` and carries none for `sess-a2` | PB-1 | Fail. `no attestation for session "sess-a2"` | Not in rev5; S5-07. None |
| LT-75 | S5-07 | A1, but S1′'s line reads `Attested-by-owner: sess-a1 sage docs/operations/d900-a.md` | PB-1 | Fail. `no attestation for session "sess-a1"` | Attestation fallback, exact line. None |
| LT-76 | S5-07 | A1, but S1′'s line names `docs/operations/d900-b.md` | PB-1 | Fail. `no attestation for session "sess-a1"` | Attestation fallback, exact line. None |
| LT-77 | R4-06 | A1, but S1′'s line reads `Not Attested-by-owner: sess-a1 devops-sre docs/operations/d900-a.md yet` | PB-1 | Fail. `no attestation for session "sess-a1"` | Not in rev5; R4-06. None |
| LT-78 | S5-07 (4.3 point 4) | A1 complete, with LT-52's change on `d900-a2.jsonl` (no write to the item; rule 9 is not attested) | PB-1 | Fail, **exit 1, not 3**. LT-52's message for item b | Fail dominates. None |
| LT-79 | S5-07 (4.3 point 4) | A1 complete, and a second ledger `D-902-other.md` opened alone with one ticked `run:` line citing an unknown id | PB-1 | Fail, **exit 1, not 3**. One `ATTESTED`, one `FAIL` | Fail dominates. None |
| LT-80 | Amendment 2.1 | OPEN′ `attested-rules: 7`; session first records list tools as in BASE | PB-1 | Fail. `rule 7 may not be attested when the first record lists tools` | Amendment 2.1, last bullet. None |
| LT-81 | Amendment 2.1 | A1, and after S1′ the working copy of `d900-a1.jsonl` is deleted | PB-1 | Fail. LT-27's message. Exit 1, not 3 | Amendment 2.1, last bullet. None |
| LT-82 | S5-07 (FP-11) | BASE, but ACCEPT′'s message is `checkpoint` only | PB-1 | Fail. `accepting commit … does not carry the line "Accepted-by-owner: D-900"` | Not in rev5; S5-07. None |
| LT-83 | S5-07 (FP-11) | BASE, but ACCEPT′ carries the line and also adds `docs/status/checkpoint.md` | PB-1 | Fail. `accepting commit … touches paths other than the ledger` | Not in rev5; S5-07. None |
| LT-84 | S5-07 (FP-11) | TICK′ sets the ticks **and** `accepted: yes` in one commit, message `tick` | PB-1 | Fail. LT-82's message | Not in rev5; S5-07. None |
| LT-85 | S5-07 (4.3 point 5) | LT-68's fixture, but ACCEPT′ carries only `Accepted-by-owner: D-900` with no status-3 decision text | PB-1 | Fail. `accepting commit … does not record the decision to accept attested stages` | Plan fallback, last sentence; text undefined, NR-06 |
| LT-86 | R4-01 | At TICK with `authoring` b unticked, then working copy only: `accepted: yes` | PB-1 | Fail. LT-06's message, and `complete: no` | Rule 1. None |
| LT-87 | R4-01, N3 | S2 not made; TICK′ leaves `authoring` b unticked; ACCEPT made (with its line). Then S2 and a commit that ticks `authoring` b | PB-1 | Fail. `ledger changed after acceptance other than understanding-check and learning-complete`, and LT-06's message is **not** required. This pins that a premature acceptance cannot be repaired silently | Rule 11, after-acceptance sentence. Row 16 |

### 2.7 The docs-only window (rule 11)

| Case | Source | Input (change to BASE) | Present | Expected after | Rule; plan row |
|---|---|---|---|---|---|
| LT-88 | F4, H-38 | A commit between S1 and S2 changes `.claude/hooks/path-guard.mjs` | PB-1 | Fail. `commit … in the window touches a path outside docs/: .claude/hooks/path-guard.mjs` | Rule 11. Row 13 |
| LT-89 | F4 | Two commits between S1 and S2: the first changes `.claude/hooks/path-guard.mjs`, the second restores its K0 bytes | PB-1 | Fail. Same message, naming the first of the two commits | Rule 11, per commit. Row 13 |
| LT-90 | F4, H-34 | After TICK, the test creates `.claude/settings.local.json` (ignored by K0's rules), uncommitted | PB-1 | Fail. `ignored file present that the opening commit did not record: .claude/settings.local.json` | Rule 11, ignored list. Row 13 |
| LT-91 | N3 | After ACCEPT, a commit changes the `evidence:` value of the `review` line | PB-1 | Fail. `ledger changed after acceptance other than understanding-check and learning-complete` | Rule 11. Row 16 |
| LT-92 | F4 | After TICK, an untracked, non-ignored file `apps/web/x.txt` is created | PB-1 | Fail. `working tree holds a path outside docs/: apps/web/x.txt` | Rule 11, working tree. None |
| LT-93 | F4 | After TICK, working copy only: one byte appended to `.claude/hooks/path-guard.mjs` | PB-1 | Fail. `tracked file outside docs/ differs from HEAD: .claude/hooks/path-guard.mjs` | Rule 11, working tree. None |
| LT-94 | S5-08 (FP-5) | After TICK: `git update-index --skip-worktree .claude/hooks/path-guard.mjs`, then one byte appended to it. `git status` then reports a clean tree (to confirm when run) | PB-1 | Fail. LT-93's message, or `index flag set on .claude/hooks/path-guard.mjs`; the test accepts either and requires exit 1 | Not in rev5; S5-08. None |
| LT-95 | S5-08 (FP-5) | As LT-94 with `--assume-unchanged` | PB-1 | As LT-94 | Not in rev5; S5-08. None |
| LT-96 | S5-08 (FP-6) | Before OPEN the test creates `.vscode/settings.json` (ignored). OPEN′'s message records it by name and SHA-256 (format: NR-05). After TICK its content is changed | PB-1 | Fail. `ignored file changed since the opening commit: .vscode/settings.json` | Not in rev5; S5-08. Provisional on the format |
| LT-97 | S5-08 (FP-7) | Branch `side` forks from K1, before OPEN, and commits a change to `.claude/hooks/path-guard.mjs`. After S1, `side` is merged into `main` with a merge commit and no conflict | PB-1 | Fail. `merge commit … in the window` | Not in rev5; S5-08. None |
| LT-98 | S5-08 (FP-7) | As LT-97, but `side` changes only `docs/status/side.md` | PB-1 | Fail. Same message: any merge commit in the window fails | Not in rev5; S5-08. None |
| LT-99 | R4-03; amendment 2.3 | A commit between S1 and S2 adds `docs/status/CLAUDE.md` | PB-1 | Fail. `instruction file under docs/: docs/status/CLAUDE.md` | Rule 11 as amended (2.3). None |
| LT-100 | R4-03; amendment 2.3 | A commit between S1 and S2 adds `docs/learning/.claude/settings.json` | PB-1 | Fail. `.claude folder under docs/: docs/learning/.claude/settings.json` | Rule 11 as amended. None |
| LT-101 | R4-03 | After TICK, `docs/operations/CLAUDE.md` is created and left **uncommitted** | PB-1 | Fail. LT-99's message for that path | Rule 11 as amended, working tree. None |
| LT-102 | R4-03 (QA's extension) | A commit between S1 and S2 adds `docs/status/claude.md` (lower case). The project's file system does not distinguish case | PB-1 | Fail. LT-99's message. **Provisional:** neither review names the case variant; QA proposes the name match be case-insensitive (NR-12) | Rule 11 as amended. None |
| LT-103 | R4-05 | A commit between S1 and S2 adds a symbolic link `docs/status/link.md` pointing at `../../.claude/hooks/path-guard.mjs` (mode 120000) | PB-1 | Fail. `non-regular file mode under docs/: docs/status/link.md` | Not in rev5; R4-05. None |
| LT-104 | R4-05 | A commit between S1 and S2 adds a gitlink entry `docs/vendor` (mode 160000), made with `git update-index --add --cacheinfo`; no network, no clone | PB-1 | Fail. `non-regular file mode under docs/: docs/vendor` | Not in rev5; R4-05. None |
| LT-105 | R4-05 | A commit between S1 and S2 adds `docs/.gitattributes` | PB-1 | Fail. `git control file under docs/: docs/.gitattributes` | Not in rev5; R4-05. None |
| LT-106 | R4-05 | A commit between S1 and S2 adds `docs/status/.gitignore` | PB-1 | Fail. `git control file under docs/: docs/status/.gitignore` | Not in rev5; R4-05. None |
| LT-107 | H-13 (plan) | A second ledger `T-001-trivial.md`, opened alone: `tier: trivial`, `accepted: yes` | PB-1 on D-900; the trivial ledger itself is `ok` today (`:64`) | Fail. `tier "trivial" may not be marked accepted` | Plan section 7, tier paragraph. Row 19 |

Note on the numbering: of the 107 rows LT-01 to LT-107, one is a pass case kept beside the finding it guards (LT-18), three expect exit status 3 (LT-68, LT-69, LT-70), and 103 expect exit 1. Two of the 103 are conditional (LT-56, LT-57).

---

## 3. Pass cases that must keep passing

A rule satisfied by failing everything is not a rule. Each of these must exit 0 after the change, with `ok`, and without the string `FAIL`. Under the present checker every one that uses `tier: design` exits 1 (PB-1), so in the failing-first run all of these **fail**, as they should.

| Case | Input | Must also show | Guards against |
|---|---|---|---|
| P-01 | BASE, complete to ACCEPT. Plan row 18 | The integrity line with OPEN's hash, the frozen blob's hash and `8 frozen lines`; `complete: yes`; `1 ledger(s) checked` | Every rule over-firing |
| P-02 | At OPEN: nothing ticked, `accepted: no`. The existing "in-progress ledger passes" case, restated | `complete: no` (R4-01: a 0 here must not read as ready) | Rule 1 firing without `accepted: yes` |
| P-03 | At TICK: seven lines ticked, `accepted: no` | `complete: yes` | R4-01 |
| P-04 | BASE, then a commit **after ACCEPT** that changes `.claude/hooks/path-guard.mjs`. Plan row 14 | | Rule 11 reaching past the accepting commit |
| P-05 | BASE, then after ACCEPT: a commit adding `docs/learning/d900-check.md`, a log record `run-sage-3`, and a commit that ticks `understanding-check` and sets `learning-complete: yes`. Plan row 15 | | N3; rule 11's after-acceptance sentence |
| P-06 | BASE with every `input.file_path` in both session files written repository-relative instead of absolute | | The false fail in Security review 4.2: path normalisation (S5-06) |
| P-07 | BASE, plus in `d900-a1.jsonl` a `Read` call whose result `content` is a string holding the JSON text of a `tool_use` record naming `Bash` | | Rule 7 reading inside strings (Security 4.4) |
| P-08 | BASE, plus in `d900-a1.jsonl` a `Read` result holding the guard's sentence, **in addition to** the genuine records 2 and 3 | | Rule 8 failing on a harmless extra phrase |
| P-09 | BASE, plus a commit in the window adding `docs/operations/notes/claude-notes.md` and `docs/operations/claude/readme.md` | | R4-03's fix over-matching: only the names `CLAUDE.md` and `.claude` are refused |
| P-10 | LT-96's opening (an ignored `.vscode/settings.json` recorded in OPEN′'s message), content **unchanged**; and the run log grows by two records after TICK | | S5-08 FP-6 fix failing on an unchanged file; the run log is exempt |
| P-11 | BASE complete, and a second design ledger `D-902-other.md`, opened alone in its own commit, valid and complete | `2 ledger(s) checked` | S5-03's fix refusing every second ledger. See NR-01 for what this leaves open |
| P-12 | A second ledger `T-001-trivial.md`, `tier: trivial`, `accepted: no`, `learning-complete: no`, beside BASE | | The trivial rule firing without acceptance |

LT-18 (template rewritten in the window) is a thirteenth pass, counted with its finding in 2.1.

**The seven existing ledger cases** (`scripts/test-guards.mjs:131-145`) keep their outcomes and are restated on the new fixture under the plan's section 9. They are not redefined here: P-02 is the first of them; the other six belong to the step 2 test diff and to the update of `docs/testing/hardening-test-plan-2026-10-11.md`, which is not yet done.

**Pins of documented limits** (expected exit 0; each is named as a limit in the test, so that closing the limit later flips the pin deliberately):

| Pin | Source | Input | Why it passes by design |
|---|---|---|---|
| LIM-01 | F6, first half | BASE, where the security record in the run log was appended by the test as a bare line, exactly as any shell could | Plan section 7, limits, third bullet: a `run:` line is satisfied by a record an open shell appended. Owner reads the log at O7 |
| LIM-02 | F6, second half | BASE unchanged. The fixture cannot express "launched by another shell": a genuine session file is identical whoever launched it | Plan section 7, limits, second bullet: "owner-launched" cannot be established by tooling. The pin exists only to carry the label |
| LIM-03 | R4-02, second half | BASE, where `run-rev-1` is a record of an unrelated reviewer run in the window (for example a listing run), not the review of the item | No rule can tie a run record to an item. Fourth review: state the limit; the owner maps each id at O7 |

---

## 4. Findings that need a rule first

Each of these cannot become a settled test until something is decided. Where a provisional case exists, its id is given.

| Id | Finding | Why it cannot be settled as a test | What must be decided, and by whom |
|---|---|---|---|
| NR-01 | **F1 as first stated; S5-03 residue** | F1's input was a ledger whose `no-shell:` line *omits* the main author. The frozen ledger stops the entry being removed after opening (LT-01). It does nothing if the **opening** ledger omits it: that ledger passes on its own terms with a `run:` line for the author. The same holds for a second ledger opened alone with a different id (P-11). The plan's only control is the owner reading the file before committing it | Plan: either a checkable rule (for example, in the `design` tier every agent holding an `authoring` line must be listed under `no-shell:`; or a fixed set of expected ledger ids), or state it as a limit resting on the owner's reading. If a rule is chosen, QA adds two fail cases |
| NR-02 | **The fixes of the Security review and the fourth review are not in revision 5** | 44 of the 107 LT rows are marked "not in rev5" (LT-42 to LT-44 by reference to LT-41). Four more (LT-99 to LT-102) rest on the amendment's section 2.3, which is itself proposed and unreviewed. The amendment's section 3 says the findings become test cases; it does not say the plan adopts each stated fix. A developer can write the tests, but the patch has no plan text to implement | Plan's next revision: adopt, change or reject the fix for each of S5-03, S5-04, S5-05, S5-06, S5-07, S5-08, S5-13, S5-14, S5-15, R4-01 to R4-06. Owner approves |
| NR-03 | **Message texts and output lines** | The plan names no message. Section 1.6 and every "Expected" cell are QA's proposal | Patch author and both reviewers agree the strings before the test diff is written |
| NR-04 | **The session-record format** (rules 5, 7, 8, 9) | Unverified until the O3 capture. LT-33 to LT-57, P-06 to P-08 and the attestation cases use an invented format | Owner's capture at O3 and the O3a choice per rule. QA then rewrites 1.5 and moves cases for any impossible rule under attestation |
| NR-05 | **The ignored-file list in the opening commit's message** (rule 11; S5-08 FP-6) | No syntax is defined: not the line's name, not how several files are listed, not whether a hash is recorded. LT-90, LT-96 and P-10 use a provisional line. Also undefined: whether `.DS_Store`, which the file manager creates unasked, is exempt. As written rule 11 fails on it (Security 4.2, false fail); an exemption would be an unchecked file | Plan: the exact syntax, with or without SHA-256; and one decision on `.DS_Store`. No case is defined for `.DS_Store` until then |
| NR-06 | **S5-07: attestation and acceptance** | Undefined: the name and syntax of the frozen header field that lists attested rules; that the attestation line belongs to the commit that first adds the session file; the exact acceptance line (Security gives one "for example"); the text that records the decision to accept a status-3 ledger. LT-68 to LT-85 are provisional on all four. **Not testable at all:** point 6 (the attestation is only as strong as "a commit is the owner's": a statement for the plan's limits), and point 7 (anything consuming the exit status treats 3 as not passed: nothing consumes it today) | Plan and owner (O3a). One more decision: if a rule is listed as attested but the session file **does** hold a record that contradicts the attestation (for example a denial naming another agent), is that exit 1 or exit 3? QA recommends exit 1 and will add the case |
| NR-07 | **S5-06 (FP-4): the deliverable is not what the session wrote** | The fix is conditional on whether the record holds written content. Also undefined: whether an Edit call counts as a write for rule 9, and what "last successful write" means when writes and edits are mixed. LT-56 and LT-57 are conditional | O3 capture; then the plan: equality check, or a stated limit. Say whether Edit counts |
| NR-08 | **S5-13: scope of the freeze** | Not stated: whether the frozen ledger and rules 2 to 12 apply to the `substantial` and `small` tiers; whether a ledger's body text (scope, criteria, findings) is frozen. No case can assert either. Only the template half is covered (LT-17, LT-18) | Plan. If body text is frozen, QA adds a fail case for a changed body and a pass case for an unchanged one; if tiers are in scope, the base fixture is repeated per tier |
| NR-09 | **R4-01: the order at O7** | The fix has the owner set `accepted: yes` uncommitted, run the checker, and commit only on 0 or a decided 3. That conflicts with the fix for FP-11, under which acceptance needs a line in the accepting commit, which does not yet exist at that moment. What the checker returns for an **uncommitted** `accepted: yes` with every stage complete is undefined. LT-86 covers only the incomplete form | Plan: define the result for an uncommitted, complete `accepted: yes` (QA suggests exit 0 with a line `accepted: yes is not yet committed`), then QA adds the case |
| NR-10 | **S5-04: which tools a no-shell capture may not contain** | Security names kinds, not names: "the shell, an agent tool, a web tool or any connector-prefixed tool". LT-41 to LT-44 use one example of each. The real names (the agent tool's name on the installed version, the second web tool, the notebook tool) are not listed anywhere | Plan, after the capture shows the actual tool names: a hard-coded list |
| NR-11 | **R4-04, remainder** | Covered: zero ledgers; a tracked ledger missing from the working tree. Not defined: a ledger removed or renamed **by a commit** while other ledgers remain. The plan fails "deleted and re-added" (LT-14) and says nothing of deleted and not re-added | Plan: whether any ledger ever opened must still exist |
| NR-12 | **R4-03 and R4-05, edges** | Not stated: whether the instruction-file name is matched without regard to case (LT-102 is QA's proposal); whether an executable bit on a file under `docs/` counts as a "non-regular mode" | Plan |
| NR-13 | **S5-08, the limit "the checker cannot vouch for itself"; Security 4.4, self-declared times** | Neither is an input the checker can refuse: a modified checker prints what it likes, and commit and record times are whatever the committer set. A test run by that same script proves nothing about it | Plan: add both to the stated limits. Owner-side control: comparing the script and hooks with their committed versions before O7 by a means that does not trust the index |
| NR-14 | **Small syntax** | Undefined: the placeholder for a value not yet set (`-` here); whether a cited commit must be a full hash; whether `evidence:` may stay empty on an unticked line | Plan, with the line forms |
| NR-15 | **Amendment 2.1: the capture's own probe** | The amendment makes the capture's refused probe mandatory and not attestable, as a condition of opening the phase. Whether the **checker** verifies it in the capture file, or only the owner reads it at O3, is not said. No case is defined | Plan. If the checker verifies it, QA adds one fail case (capture without a refusal naming the agent) |
| NR-16 | **F6** | Both halves are limits by the plan's own statement, policy until steps 3 and 7. Pinned as LIM-01 and LIM-02, not tested as failures | Owner, in the residual-risk register (amendment section 4, row H-10) |

---

## 5. Coverage

Every source finding against the cases that cover it. "Partly" means part of the finding has no settled case; the NR item says which part.

### Security review of revision 5

| Finding | What it is | Cases | State |
|---|---|---|---|
| FP-1 / S5-03 | A second ledger is its own opening commit | LT-10, LT-11, LT-12, LT-13; P-11 | Partly: a second ledger opened alone with its own id passes. NR-01 |
| FP-2 / S5-04 | The captured set is whatever the capture lists | LT-08, LT-41, LT-42, LT-43, LT-44, LT-45, LT-46 | Covered, provisional on the tool list. NR-10 |
| FP-3 / S5-05 | Session file rewritten by a later commit | LT-32; LT-28 for the working-tree form | Covered |
| FP-4 / S5-06 | Deliverable is not what the session wrote | LT-56, LT-57 | Partly: conditional. NR-07 |
| S5-06, second part | Path comparison undefined (false fail) | LT-54, P-06 | Covered |
| FP-5 / S5-08 | Change hidden from git by an index flag | LT-94, LT-95; LT-93 | Covered. Git's behaviour to confirm when run |
| FP-6 / S5-08 | Ignored file changed after opening | LT-96, P-10; LT-90 | Covered, provisional on the format. NR-05 |
| FP-7 / S5-08 | Change brought in by a merge | LT-97, LT-98 | Covered |
| S5-08, limit | The checker cannot vouch for itself | none | **Uncovered: cannot be a test.** NR-13 |
| FP-8 / S5-07 | Attestation where the rule was checkable and failed | LT-71, LT-34, LT-78 | Partly: the contradiction case is undecided. NR-06 |
| FP-9 / S5-14 | Rule 5 skips itself | LT-35, LT-36, LT-70 | Covered |
| FP-10 / S5-15 | Approval line in any commit | LT-61, LT-62, LT-63, LT-64 | Covered |
| FP-11 / S5-07 | `accepted: yes` not bound to the owner | LT-82, LT-83, LT-84, LT-85 | Covered, provisional on the line's text. NR-06 |
| S5-07, 4.3 point 1 | Attested rules as a frozen header field | LT-72, LT-71 | Covered, provisional |
| S5-07, 4.3 point 2 | Attestation never replaces a failed checkable rule | LT-71, LT-34 | Partly. NR-06 |
| S5-07, 4.3 point 3 | Which commit carries the line; used once | LT-73, LT-74, LT-75, LT-76 | Covered, provisional |
| S5-07, 4.3 point 4 | Fail dominates | LT-78, LT-79, LT-34; LT-69 for 0 with 3 | Covered |
| S5-07, 4.3 point 5 | The accepting text | LT-82, LT-85 | Covered, provisional |
| S5-07, 4.3 point 6 | The attestation line is policy | none | **Uncovered: a statement, not an input.** NR-06 |
| S5-07, 4.3 point 7 | Consumers treat 3 as not passed | LT-68 asserts the status is 3 and the word is never `ok` | **Uncovered beyond that: nothing consumes the status.** NR-06 |
| S5-13 | Scope of the freeze; standing of the template | LT-17, LT-18 | Partly: tiers and body text undecided. NR-08 |
| S5-14 | See FP-9 | LT-35, LT-36, LT-70 | Covered |
| S5-15 | See FP-10 | LT-61 to LT-64 | Covered |
| 4.2 false fail, `.DS_Store` | Rule 11 fails on a file the OS creates | none | **Uncovered: needs a rule first.** NR-05 |
| 4.4, structured records | Calls inside strings must not count | LT-47, LT-55, P-07, P-08 | Covered, provisional on the format |
| 4.4, self-declared times | Times are as strong as the clock | none | **Uncovered: cannot be a test.** NR-13 |

### Fourth review

| Finding | Cases | State |
|---|---|---|
| R4-01 | P-02, P-03, LT-86, LT-87 | Partly: the uncommitted, complete `accepted: yes` is undecided. NR-09 |
| R4-02 | LT-25, LT-26; LIM-03 | Partly: an unrelated in-window run is a limit, pinned, not failed |
| R4-03 | LT-99, LT-100, LT-101, LT-102; P-09 | Covered. Case variant provisional, NR-12 |
| R4-04 | LT-15, LT-16 | Partly: committed removal with other ledgers present is undecided. NR-11 |
| R4-05 | LT-103, LT-104, LT-105, LT-106 | Covered. Executable bit undecided, NR-12 |
| R4-06 | LT-65, LT-66, LT-67, LT-77 | Covered |

### Third review

| Finding | Cases | State |
|---|---|---|
| F1 | LT-01, LT-02, LT-03 | Partly: the opening ledger that omits the entry passes. NR-01 |
| F2 | LT-04, LT-05, LT-06 | Covered |
| F3 | LT-33, LT-34, LT-49, LT-50 | Covered, provisional on the format |
| F4 | LT-88, LT-89, LT-90, LT-92, LT-93 | Covered |
| F5 | LT-58, LT-59, LT-60 | Covered |
| F6 | LIM-01, LIM-02 | **Uncovered as a failure: a stated limit.** NR-16 |
| N1 (with F1) | LT-01, LT-07, LT-08, LT-09, LT-14 | Covered |
| N2 (with F2) | LT-04, LT-05 | Covered |
| N3 | P-05, LT-87, LT-91 | Covered |
| N4 | LT-29, LT-30 | Covered |

### The plan's own table, row by row

| Plan row | Cases |
|---|---|
| 1 | LT-01 |
| 2 | LT-04, LT-05 |
| 3 | LT-06 |
| 4 | LT-03 |
| 5 | LT-19, LT-20, LT-21, LT-22 |
| 6 | LT-27, LT-28, LT-29, LT-30, LT-31 |
| 7 | LT-33 |
| 8 | LT-37, LT-38 |
| 9 | LT-39, LT-40 |
| 10 | LT-47 |
| 11 | LT-52 |
| 12 | LT-58, LT-59 |
| 13 | LT-88, LT-89, LT-90 |
| 14 | P-04 |
| 15 | P-05 |
| 16 | LT-91, LT-87 |
| 17 | LT-68 |
| 18 | P-01 |
| 19 | LT-107 |

---

## 6. Counts, and the three states

**Cases defined: 122.** The row counts were taken from this file with a count-only search after it was written (107 LT rows, 12 P rows, 3 LIM rows, 16 NR rows).

- LT-01 to LT-107: 107 rows. Of these, 103 expect exit 1 (two of them, LT-56 and LT-57, conditionally); 3 expect exit 3 (LT-68, LT-69, LT-70); 1 expects exit 0 (LT-18).
- P-01 to P-12: 12 rows expecting exit 0. With LT-18, 13 pass cases.
- LIM-01 to LIM-03: 3 pins expecting exit 0.
- 107 + 12 + 3 = 122.

**Needs a rule first: 16 items**, NR-01 to NR-16 in section 4.

**Findings with no covering case:** S5-08's "cannot vouch for itself" limit; S5-07 points 6 and 7; the `.DS_Store` false fail; self-declared times; F6 as a failure. Each has a row in section 4.

**Findings covered in part:** FP-1/S5-03, FP-4/S5-06, FP-8/S5-07, S5-13, R4-01, R4-02, R4-04, F1.

**Cases written as test code: none.** **Cases executed: none.** **Results seen: none.** No prediction in the "Present" columns has been observed. LT-94, LT-95, LT-97 and LT-104 also rest on git behaviour that is to be confirmed when the cases are first run.
