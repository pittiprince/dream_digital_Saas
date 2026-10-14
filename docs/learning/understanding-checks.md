# Understanding checks

Help with understanding these questions, without answers: `docs/learning/understanding-checks-study-guide.md` (added 2026-10-12).

What the owner was asked, how the owner answered, and SAGE's assessment. A topic counts as understood only after the owner has answered and the answer has been assessed here. An explanation written by SAGE is not an answer.

---

## Check 1: the engineering organization and its guards

- **Prepared:** 2026-10-11, by SAGE, after the foundation validation.
- **Material:** `docs/learning/concepts.md`, concepts 1 to 8.
- **Status:** not yet answered. Nothing in this check is recorded as understood.
- **Purpose:** the owner is about to decide whether to start the SRE and DevOps architecture phase, staffed by `devops-sre`. Questions 3 and 4 bear directly on that decision.

**How to answer.** Open the files and read the code. Looking things up is the point. Answer in your own words; a short answer that shows the reasoning is better than a long one. Where a question asks for a prediction, say what you expect and which line makes you expect it. Do not run anything that changes or deletes files to find out.

**For whoever assesses.** Check each answer against the code and the sources named under "Check against". For each wrong answer, name the exact misconception and write the correction here. Leave a field blank until there is something real to put in it.

---

### Question 1. Explain: which layer answered, and how do you know?

Two refusals from today:

- (a) Seven agents tried to read `apps/api/.env` and got: `File is in a directory that is denied by your permission settings.`
- (b) The Chief Engineer tried `git push --dry-run origin main` and got: `PreToolUse:Bash hook error: ... path-guard: chief-engineer may only run its allowlisted read-only commands, one at a time.`

For each, say which of the three layers produced the refusal and what in the message tells you. Then, for (a), name the second control that was also set up to stop that read, and explain what today's result does and does not tell you about it.

- **Check against:** `.claude/settings.json` (`permissions.deny`, `permissions.ask`, `hooks.PreToolUse`); `.claude/hooks/secret-guard.mjs` (`isSecretName`, `block`); `.claude/hooks/path-guard.mjs` (`BASH_ALLOW`); `docs/learning/concepts.md` concept 2.
- **Owner's answer:**
- **Assessment:**
- **Misconception and correction, if any:**

### Question 2. Predict: what does `path-guard.mjs` do with these inputs?

Read `.claude/hooks/path-guard.mjs`. For each input, say whether the call is allowed or blocked, give the exact message if blocked, and name the variable or line that decides it.

- (a) Agent `sage` calls `Write` with `file_path` set to `docs/learning/../../CLAUDE.md`. Work out the value of `relative` first.
- (b) Agent `security-engineer` calls `Bash` with the command `git log --oneline | head -5`.
- (c) Agent `devops-sre` calls `Bash` with the command `mv docs docs.old`. Answer for `path-guard.mjs` only, then say whether anything in `.claude/settings.json` would stop it.

These are predictions from reading the code. None of the three has been run.

- **Check against:** `path-guard.mjs`: `OWNED`, `relative`, `BASH_ALLOW`, `chained`, the line `if (!allow) process.exit(0);`; `.claude/settings.json` `deny` and `ask` lists; `docs/learning/concepts.md` concepts 3 and 4.
- **Owner's answer:**
- **Assessment:**
- **Misconception and correction, if any:**

### Question 3. Trace: the run log in three states

A ledger has `tier: small`, `started: 2026-10-11`, and the line `- [x] qa | agent: qa-test-engineer | evidence: see report`. Trace `readRuns()` and `checkLedger()` in `scripts/check-feature-ledger.mjs` and say what the script reports about the `qa` stage when `.claude/logs/agent-runs.jsonl`:

- (a) is as it stands today, with nine probe records;
- (b) has been emptied but still exists;
- (c) has been deleted.

Then say which state is the most dangerous and why, and what you would instruct before the first real feature starts.

- **Check against:** `scripts/check-feature-ledger.mjs`: `readRuns`, the `runs === null` test, the `runs.some(...)` test; `.claude/logs/agent-runs.jsonl`; review R2; `docs/learning/concepts.md` concept 5.
- **Owner's answer:**
- **Assessment:**
- **Misconception and correction, if any:**

### Question 4. Justify a decision: briefing `devops-sre` for the next phase

`CLAUDE.md` says new dependencies of consequence (gate 2) and destructive commands (gate 5) need your approval every time. For the `devops-sre` role specifically:

- Give one command from today's evidence that was stopped, and say what stopped it.
- Give one command from today's evidence that ran with nothing checking it.
- Explain, from the code, why the dependency gate is weaker for this role than for `security-engineer`.

Then decide: what would you write into the `devops-sre` brief for a documentation-only phase, and what would you leave to the guards? Say which parts of your reasoning rest on something observed and which on the reviewer's untested predictions.

- **Check against:** evidence section 5 and the `devops-sre` role probe; `path-guard.mjs` `BASH_ALLOW` and `OWNED['devops-sre']`; `.claude/settings.json` `ask` list; review R4, R5 and section 5 condition 4; `docs/learning/concepts.md` concept 4.
- **Owner's answer:**
- **Assessment:**
- **Misconception and correction, if any:**

### Question 5. Explain: grade the evidence

Grade each claim as harness record, tool message or self-report. Then say how much you would rely on it and what single action would make it stronger.

- (a) "The `devops-sre` session had nine commands refused."
- (b) "DA VINCI holds five Figma tools."
- (c) "The orchestrating session runs Opus 5.5."
- (d) "The Software Architect cannot write to `apps/api/`."

One of these four has no evidence from today at all. Say which and why.

- **Check against:** evidence sections 2, 3, 4 and 5 and the `software-architect` and `da-vinci` probes; record "How evidence is graded here", O6 and O7; `docs/learning/concepts.md` concepts 6 and 7.
- **Owner's answer:**
- **Assessment:**
- **Misconception and correction, if any:**

### Question 6. Debug: the QA stage that will not pass

A week from now a feature ledger has `started: 2026-10-18`. You ran QA yourself from a terminal:

`claude -p --model opus --agent qa-test-engineer "<brief>"`

It did real work and wrote its evidence under `docs/testing/evidence/`. The Chief Engineer ticks the `qa` stage. The check prints:

`stage "qa" is ticked but qa-test-engineer has no recorded run since 2026-10-18`

1. What is the root cause? Name the setting and the hook involved.
2. How would you confirm it using only reading: which file would you open and what would you look for?
3. Someone suggests two quick fixes: delete the run log, or add a line to it by hand. Explain what each would actually do and why neither is acceptable.
4. What is the correct way to get the stage to pass?
5. Fail open or fail closed: which is the check doing here, and is that the behaviour you want?

- **Check against:** `.claude/settings.json` `hooks.SubagentStop`; `.claude/hooks/log-agent-run.mjs`; `scripts/check-feature-ledger.mjs` `readRuns` and `checkLedger`; record D10 and O5; review R2, R3 and R20; `docs/learning/concepts.md` concepts 1, 5 and 8.
- **Owner's answer:**
- **Assessment:**
- **Misconception and correction, if any:**

---

### Overall result for check 1

- **Date answered:**
- **Questions answered:**
- **Demonstrated:**
- **Gaps to revisit:**
- **Learning gate:** not passed. No answers received.

---

## Check 2: the SRE phase brief and the hardening plan, before deciding

- **Prepared:** 2026-10-11, by SAGE, before the owner decides on Proposal A and Proposal B.
- **Material:** `docs/learning/sre-and-hardening-proposals-before.md`; `docs/learning/debugging-lessons.md`, lessons 4 to 7; `docs/learning/concepts.md`, concepts 4, 5 and 8.
- **Status:** not yet answered. Nothing in this check is recorded as understood. Check 1 above is also still unanswered.
- **Purpose:** each question sits under a decision in one of the two proposals. Everything in both proposals is proposed; none of it is implemented.

**How to answer.** As for check 1: open the files, read the code, answer in your own words, and say which line makes you expect what you expect. Do not run anything that changes or deletes a file. Where a question asks you to decide, there is no single right answer; what is assessed is whether the reasons hold.

**For whoever assesses.** Check each answer against the sources under "Check against". Name the exact misconception for any wrong answer. Leave fields blank until there is something real to put in them. For questions 2 and 5, assess the reasoning, not the choice.

---

### Question 1. Work out: what would each rule stop, and what would it not?

Five actions, each of which changes or destroys something:

- (a) `devops-sre` runs `rm -rf docs/security` in its shell.
- (b) `devops-sre` runs `rm -r docs/security` in its shell.
- (c) `devops-sre` runs `: > CLAUDE.md` in its shell.
- (d) `qa-test-engineer` writes a test file in its own lane that deletes `scripts/check-feature-ledger.mjs` when run, then runs `pnpm test`.
- (e) `devops-sre` uses the Write tool on `.github/workflows/ci.yml`.

For each action, say whether it would be stopped by each of these, and by which line or rule:

1. the configuration as it is today (`.claude/settings.json` and `.claude/hooks/path-guard.mjs`);
2. the proposed wider `ask` list in H-05 (`rm *`, `mv *` and the rest), in a non-interactive session;
3. the proposed shell allowlist in H-01, as revision 2 describes it;
4. the proposed sandbox in H-02, with `scripts/`, `.claude/`, `.github/` and `CLAUDE.md` on its deny list;
5. launching the role with `--disallowedTools Bash`.

Then answer: which of the five actions is stopped by nothing proposed, and what would have to be true for you to find out afterwards that it had happened?

These are predictions from reading. None has been run, and rows 2 to 4 describe changes that do not exist yet.

- **Check against:** `.claude/settings.json` line 19 and the `ask` list; `path-guard.mjs` lines 25 to 36, 45 to 49, 64, 68 to 73; plan H-01, H-02, H-03, H-04, H-05; before file sections B1, B2, B6, B7.
- **Owner's answer:**
- **Assessment:**
- **Misconception and correction, if any:**

### Question 2. Decide: RPO and RTO for this shop

Use your own estimate of orders on an ordinary day. If you have none, say so and pick a number to reason with.

The database is lost at 14:00 on a weekday. The newest usable backup is from 02:00 that morning.

1. In your own words, what has been lost? Be specific about what the customers who bought between 02:00 and 14:00 experience, and about where their money is.
2. What would you need to already have in place to find those customers? Name the second source and the condition the order records must meet.
3. Name one thing that the restore brings *back* that you would not want back.
4. Now state the RPO you would ask for on orders and entitlements, and the RPO you would ask for on the master asset files. Give the reason they differ, or the reason they do not.
5. The failure happened at 02:30 at night instead. Walk through what has to happen before you are selling again, and say what an honest RTO would be. Which step depends on you being awake?
6. The design document says a nightly backup runs. Explain to a friend why that sentence does not yet tell you that you can recover.

- **Check against:** brief area D (questions 1, 2, 5 and 8, the six-column form, the three isolation requirements, criterion 11); architect's review T-07; before file section A4.
- **Owner's answer:**
- **Assessment:**
- **Misconception and correction, if any:**

### Question 3. Trace: one line, two fixes

Open `.claude/hooks/path-guard.mjs` and read lines 63 to 72.

1. An agent of type `general-purpose` calls `Bash` with `rm -r apps`. Trace it. What is the exit code and which line produces it?
2. An agent of type `constructor` calls `Bash` with `git status && touch x`. Trace it through lines 64, 67, 68, 70 and 71. Why does line 64 not exit? Why does line 68 not exit? What is the result?
3. Now suppose line 64 used `Object.hasOwn(OWNED, agent)` and nothing else changed. Trace both inputs again. What changed, and for which input?
4. The first draft's test for this change was "agent named `constructor` is blocked". Would that test have passed? What does your answer tell you about writing the test first?
5. What second change has to land in the same step for the substitution to be safe, and what does that second change do to input 1?
6. Once both guards exit 2 on any internal error, the existing test suite has a new problem. Read `expect` and `runHook` at the top of `scripts/test-guards.mjs` and say what it is.

Predictions from reading. Nothing here has been run.

- **Check against:** `path-guard.mjs` lines 45 to 49 and 63 to 72; `scripts/test-guards.mjs` lines 16 to 33; plan H-08, H-12, H-31; test plan cases 08-06 to 08-11 and objection 1; before file section B3; lesson 4 and lesson 7.
- **Owner's answer:**
- **Assessment:**
- **Misconception and correction, if any:**

### Question 4. Explain: what would a passing ledger check prove?

Suppose H-14 is in place as revision 2 describes it. A ledger has `started: 2026-10-20` and this line:

`- [x] security | agent: security-engineer | run: <an id> | evidence: docs/security/review-007.md`

The check passes.

1. List exactly what you now know to be true.
2. List three things you might be tempted to conclude that the check has not shown.
3. Read line 18 of `scripts/check-feature-ledger.mjs` and line 46 of `path-guard.mjs`. Describe how the check could pass without the real run log being read at all. Which finding covers this, and what does it propose?
4. The plan calls the run log "corroboration and never the only evidence". For the `security` stage above, what would you look at yourself before accepting the feature?
5. The plan decided against signing each log record with a secret key. Give its reason in your own words.

- **Check against:** `check-feature-ledger.mjs` lines 7 to 8, 17 to 18, 73 to 79; `log-agent-run.mjs` lines 20 to 26; `path-guard.mjs` line 46; plan H-10, H-14, H-33; before file section B4; lesson 6; `docs/learning/concepts.md` concept 5.
- **Owner's answer:**
- **Assessment:**
- **Misconception and correction, if any:**

### Question 5. Decide and justify: a leaked download link

A customer buys a large file. The shop gives them a signed link that works for 24 hours. Ten minutes later two things happen: the customer asks for and receives a refund, and the link is posted on a public forum.

1. Under "signed link direct from storage", what can a stranger from the forum do, for how long, and who pays for it? At what moment was the entitlement check made?
2. Under "proxied through the API", answer the same questions. What does this option cost you that the first does not?
3. The security baseline says "Downloads are authorized per request and links expire." Which of the two options meets that sentence as you read it? Is there a reading under which both do?
4. Name three controls from the brief that would reduce the damage under the signed-link option, and say what each costs an honest customer.
5. Which facts would you need before choosing between the options? Say which of them only you can supply and which depend on a vendor nobody has chosen.
6. Where must this link never appear, and why?

There is no approved answer to choose here. The brief asks these questions; it does not answer them.

- **Check against:** `.claude/rules/security.md` line 8; brief area F questions 4 and 5 and the download delivery row, area E question 11, area C question 2, decision 7; architect's review T-02 and T-06; security review SA-04; before file section A6.
- **Owner's answer:**
- **Assessment:**
- **Misconception and correction, if any:**

### Question 6. Debug: the file that changed with no shell

The SRE phase ran under the revised brief. Every `devops-sre` session was launched with the shell removed, and the tracking file shows each start-up tool list as Read, Grep, Glob, Write, Edit. At the end, the criterion 2 check reports that `.gitignore` changed during the phase. The `devops-sre` report says "Commands run: none".

1. Is the report's statement consistent with the change? Explain how the file could have changed with no shell.
2. Which guard did that write pass through, and why did the guard allow it? Name the line.
3. Which rule of the brief did it break? Is that rule prevention, detection, or neither?
4. What made it possible to notice the change at all? What would the same check have shown if that precondition had not been met?
5. Why is `.gitignore` a particularly bad file to have changed unnoticed?
6. Someone says "the fence failed". Is that accurate? State precisely what the fence covered and what it did not.
7. Propose one change that would turn this from detection into prevention, and name which proposal and finding it would belong to. Say what it would cost.

- **Check against:** `path-guard.mjs` lines 25 to 36 and 86; brief section 5 rules 1 to 5, preconditions P1, criteria 2, 3 and 17, risk 2; plan H-04 and H-16; security review SA-02 and N-16; before file sections B6 and B7.
- **Owner's answer:**
- **Assessment:**
- **Misconception and correction, if any:**

---

### Overall result for check 2

- **Date answered:**
- **Questions answered:**
- **Demonstrated:**
- **Gaps to revisit:**
- **Learning gate:** not passed. No answers received.
