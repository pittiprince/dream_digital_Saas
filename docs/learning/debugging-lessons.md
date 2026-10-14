# Debugging lessons

Each lesson: symptom, root cause, diagnosis, fix, prevention. Only lessons supported by evidence in this repository are recorded. Sources are referenced by path.

Abbreviations: "the record" is `docs/testing/setup-validation.md`; "the evidence" is `docs/testing/evidence/foundation-validation-2026-10-11.md`; "the review" is `docs/status/foundation-validation-review-2026-10-11.md`.

---

## Lesson 1 (2026-10-11): "It cannot be done" was concluded after trying two ways out of several

**Symptom.** The record's discrepancy D1 concluded: "The Independent Reviewer currently cannot enumerate the files it is meant to review", ranked it "Highest practical impact" and called the reviewer gate "not operable today".

**Root cause.** The facts were right and the conclusion did not follow from them.

- True: the reviewer was given `Read, Bash` and no Grep or Glob (harness start-up record, evidence section 3).
- True: the reviewer's Bash is limited to the read-only git list, the constant `READ_ONLY_GIT` in `.claude/hooks/path-guard.mjs`.
- True: the repository has no commits and every file is untracked, so `git ls-files` and `git diff` show nothing.
- Missed: the first pattern in `READ_ONLY_GIT` is `/^git (status|diff|log|show|ls-files|rev-parse|blame)( |$)/`. It allows `git status` with any flags after it. `git status --porcelain --untracked-files=all` lists every untracked file, and it contains none of the characters the `chained` test rejects.

The author checked two of the seven allowed subcommands and generalised to "no way exists".

**Diagnosis.** The Independent Reviewer ran `git status --porcelain --untracked-files=all` in its own session and received 29 files (review R1, and the command is listed in the review's "Commands run"). One successful command disproves a "cannot" claim. I confirmed by reading `path-guard.mjs` that the pattern admits the command; I did not run it, because SAGE holds no shell.

**Fix.** Correct D1's conclusion in the record. The accurate statement: the reviewer can list files; what it lacks is **content search** (no `grep`, and `git grep` is not on the allowlist). The reviewer rates that medium, not highest. Status: proposed by the review. When I read the record today it still carried the original wording. `docs/testing/` belongs to `qa-test-engineer`, so the correction is theirs to make on the owner's instruction.

**Prevention.**

1. Before writing "X cannot do Y", list every permitted route and try each one. Here that meant reading one regular expression and seven subcommand names.
2. Treat a negative claim as needing stronger evidence than a positive one. "It worked" needs one success. "It cannot work" needs every route exhausted.
3. Be most careful with the finding you rank highest. Acting on D1 would have meant changing `.claude/`, which only the owner may change, to fix a problem that did not exist.
4. This is what independent review is for. The reviewer found it by doing the thing the record said was impossible.

---

## Lesson 2 (2026-10-11): a finding that was really leftovers from someone else's test

**Symptom.** The `security-engineer` probe ran `git status`, saw an untracked `apps/` directory, and reported that `CLAUDE.md`'s "greenfield, no application code" statement might be stale (evidence, security-engineer probe, "Needs the owner").

**Root cause.** `apps/` existed only because the `frontend-engineer` and `backend-data-engineer` probes had just created probe files inside it. Removing a file with `rm` does not remove its folder, and the empty folders were cleaned up later by the orchestrating session (evidence section 8). The security probe observed the repository in between.

**Diagnosis.** Compare `git status` across sessions in the evidence: the Chief Engineer's and the reviewer's outputs list five top-level entries with no `apps/`; the security engineer's lists six. Then check the current state: the record reports `apps/` absent and `find . -name '_probe*'` empty (record check 1 and D13, QA's own run). The review re-verified it (review section 1, row 1).

**Fix.** None needed in the code or in `CLAUDE.md`. The record marks the finding resolved so it is not raised again (D13).

**Prevention.**

1. Tests that write files must clean up completely, folders included, before the next test reads the same tree.
2. Run probes that change shared state one at a time, or give each its own scratch location.
3. When a finding rests on a snapshot of shared state, ask what else was running at that moment before escalating.
4. The agent did the right thing by asking and not assuming. The lesson is about test hygiene, not about the agent.

---

## Lesson 3 (2026-10-11): crediting the wrong control for a refusal

**Symptom.** Seven roles tried `Read` on `apps/api/.env` and all were refused. It is tempting to write "the secret guard works".

**Root cause.** Two different controls cover that read: the `deny` rule `Read(.env)` in `.claude/settings.json`, and the hook `.claude/hooks/secret-guard.mjs`. Only one of them answered.

**Diagnosis.** Read the message, then read the code that could have produced it.

- Returned: `File is in a directory that is denied by your permission settings.`
- What `secret-guard.mjs` would have written, from its `block(...)` call in the file-tool loop: `.env is a secret file. Secret files are never read, searched or edited by an agent.`
- Every hook block in the evidence begins `PreToolUse:<Tool> hook error:`. These seven do not.

The strings do not match, so the hook did not produce the refusal. The permission layer did. This is an inference by elimination (record 4d and O3), a strong one.

**Fix.** No code change. The fix is to the claim: record that the permission rule was verified for seven roles, and that the file-tool branch of `secret-guard.mjs` has never been seen firing in a real session. The record does this.

**Prevention.**

1. Attribute a result to a control only when the message can be matched to that control's code.
2. When two controls overlap, design one test per control. To exercise the hook you need an input the front layer lets through.
3. Know why it matters: the review predicts that `apps/api/.ENV` in capitals would pass both layers on a case-insensitive disk (review R7; static analysis, not executed). An untested back layer is exactly where such a gap hides.

---

## Lessons 4 to 7 (2026-10-11): defects found in proposed fixes, before anything was applied

These four come from the specialist reviews of the first drafts of the two proposals. **Nothing was executed and nothing was changed.** Each "symptom" is a claim in a draft; each "diagnosis" is a trace by reading. They are recorded because they are cheap lessons: found on paper, not in production.

Sources: `docs/security/proposals-security-review-2026-10-11.md` ("the security review"), `docs/testing/hardening-test-plan-2026-10-11.md` ("the test plan"), `docs/status/security-hardening-plan-2026-10-11.md` revision 2 ("the plan"). Fuller explanation with the traces: `docs/learning/sre-and-hardening-proposals-before.md`, sections B1 to B4.

### Lesson 4: a correct fix that moved an input into an open default

**Symptom.** The first draft of H-08 proposed replacing `agent in OWNED` with `Object.hasOwn(OWNED, agent)` on line 64 of `.claude/hooks/path-guard.mjs`, and gave as its test "agent named `constructor` is blocked".

**Root cause.** Line 64 does two jobs: it recognises known roles, and it lets everyone else through with `process.exit(0)`. The fix corrected the first job and left the second untouched. An agent named `constructor` stopped being wrongly recognised and became an unknown agent, and unknown agents are allowed.

**Diagnosis.** Trace one input through lines 63 to 72, before and after. Today, `Bash` with `git status && touch x` for agent `constructor`: line 64 does not exit (the name is inherited), line 68 does not exit (`BASH_ALLOW['constructor']` is an inherited function), line 70 sets `chained`, line 71 blocks with exit 2. After the substitution alone: line 64 exits 0. A blocked input becomes an allowed one. QA wrote this as cases 08-06 to 08-08 and objection 1; the Security Engineer reached it independently (section 2.1). I re-traced it from the file. Static analysis, not executed.

**Fix (proposed, revision 2).** Apply the substitution only together with H-31, which makes an unknown agent type blocked by default.

**Prevention.**

1. When a fix changes which branch an input takes, read the branch it lands in. "No longer mishandled here" is not "handled safely there".
2. Write the test as an exact input with an exact expected result before the change. The stated test would have failed, which is how the flaw showed.
3. Have someone other than the author trace it. Here the fix came from one reviewer's suggestion and one author's draft, and it took a third and fourth reader.

### Lesson 5: an allowlist entry that admitted a general-purpose tool

**Symptom.** The first draft of H-01 gave the four building roles a shell allowlist to make their shell default-deny, and included `pnpm exec <tsc|eslint|prettier|vitest|playwright> ...`.

**Root cause.** The entry named the program and left its arguments free. Those programs write files and download things when told to. The allowlist was judged by the names on it, not by what each name can do.

**Diagnosis.** List, for each admitted command, an invocation that does something the list was meant to stop. The reviews give `pnpm exec prettier --write CLAUDE.md`, `pnpm exec eslint --fix`, `pnpm exec tsc --outDir docs/status` and `pnpm exec playwright install` (test plan cases 01-14 and 01-22, objection 6; security review H-01). Two entries in today's allowlists have the same shape: line 48 of `path-guard.mjs` admits `npm audit fix`, and line 42 admits `git diff --no-index`, which prints arbitrary files (plan H-36, H-35). I confirmed both patterns by reading the file. Static analysis, not executed.

**Fix (proposed, revision 2).** No `pnpm exec`. A fixed set of named scripts with no extra arguments. The plan states what remains: a named script still runs whatever the manifest and test files say, so for these roles the allowlist "narrows the shell and does not remove the capability".

**Prevention.**

1. An allowlist entry is a grant of everything that command can do with any arguments it accepts. Review the flags, not the name.
2. For each entry, write at least one "must be blocked" test for its most dangerous form.
3. If a role can both write code and run it, no command list removes the capability. Say so, and rely on a different kind of control.

### Lesson 6: a check that asked "does it exist" when the question was "is it the right one"

**Symptom.** The first draft of H-14 bound each ledger stage to a run id and claimed "a probe record then cannot stand in for real work".

**Root cause.** The proposed check required only that the cited id exist in the log with the matching agent name. The probe records exist in the log and have ids.

**Diagnosis.** Ask what the cheapest input is that satisfies the check without doing the work. Here: cite a probe record's id. `.claude/logs/agent-runs.jsonl` is readable by any role, and its first nine records, which the plan identifies as the delegation probe, each carry a non-null `agentId` (my own reading of the file). Security review H-14; test plan case 14-11 and objection 10. Static analysis, not executed.

**Fix (proposed, revision 2).** Also require that the run's time is on or after the ledger's `started` date, that the id is not null, and that no id serves more than one stage. The plan then states the limit: it proves "only that a run by that agent ended, not what it did".

**Prevention.**

1. For any check, write down what a passing result proves and what it does not, before relying on it.
2. Test a control with the laziest input that could pass it, not only with honest input.
3. Look for a way to avoid the check altogether. Here there was one: `scripts/check-feature-ledger.mjs` line 18 accepts `--log`, and the Chief Engineer's allowlist admits any arguments (plan H-33).

### Lesson 7: tests that would pass for the wrong reason

**Symptom.** Two verifications in the first draft would have reported success without testing the thing they were meant to test.

- H-02's check that the sandbox works: have an agent run `touch scripts/_probe.txt` and expect a refusal.
- H-08's check that guards fail closed: run the guard suite and expect the BLOCK cases to pass.

**Root cause.** In both, a different mechanism produces the same visible result.

- Once H-01's allowlist exists, `touch` is refused by `path-guard` before the command reaches the sandbox. The refusal appears; the sandbox was never exercised.
- `scripts/test-guards.mjs` compares exit codes only (`expect`, lines 20 to 24; `runHook` returns `result.status`, line 32; I read both). Once a guard exits 2 on any internal error, a guard that crashes on every input makes every BLOCK case pass.

**Diagnosis.** For each test, ask "what else could give this result?" Test plan objection 2 and flag F1; security review H-02 and H-08 (N-13). Static analysis, not executed. This is the same reasoning as lesson 3, where a refusal was credited to the wrong layer.

**Fix (proposed, revision 2).** Verify the sandbox before H-01 is applied, using QA's procedure L-02, and expect an operating-system error with no hook prefix. Make the suite assert the guard's message as well as its exit code (H-12), before H-08.

**Prevention.**

1. A test must be able to fail. Before trusting a pass, name the condition under which it would have failed, and check that condition is reachable.
2. Assert on something only the control under test can produce: its message, not just "refused".
3. Order matters. A control placed in front of another hides the one behind from every test.
4. A probe should be harmless if the control turns out to be broken. The original probe would have created a file inside `scripts/`.

---

## Candidate considered and not recorded

**Probe sessions exiting with "Input must be provided either through stdin or as a prompt argument", attributed to `--allowedTools` accepting several values and consuming the prompt that followed it.**

I searched the record, the evidence and the review for that message and for any account of it and found nothing. I cannot support the symptom, the cause or the fix from material in this repository, so it is not written up as a lesson.

The nearest thing in the evidence is different: the second `da-vinci` run was started with `--allowedTools mcp__claude_ai_Figma__whoami`, ran normally, and the agent reported holding no Figma tool. The record calls its own explanation of that "speculation" that "was not tested" (record check 7).

If the failure happened, the way to make it a lesson is to add the exact command line and the exact output to `docs/testing/evidence/`, after which SAGE can write it up against that source.
