# Study guide for the understanding checks

| | |
|---|---|
| Written | 2026-10-12, by SAGE, on the Chief Engineer's task at the owner's instruction |
| For | The twelve questions in `docs/learning/understanding-checks.md`: check 1 (six questions) and check 2 (six questions) |
| What this is | Help with understanding the questions. It contains **no answers**. |
| Learning status | All twelve questions are unanswered. Nothing is recorded as understood. Reading this guide does not change that; only your own answers, assessed, can. |

**How I wrote it.** I hold no shell. I ran nothing. Every trace in this guide is from reading the code on 2026-10-12 and is **[static analysis, not executed]** unless it says otherwise. Line numbers refer to the files as I read them today: `.claude/hooks/path-guard.mjs`, `.claude/hooks/secret-guard.mjs`, `.claude/hooks/log-agent-run.mjs`, `scripts/check-feature-ledger.mjs`, `.claude/settings.json`, and lines 1 to 40 of `scripts/test-guards.mjs`. Where a question points at a file I did not read today, I say so and name it.

**Names used below.** "C1-Q3" means check 1, question 3. "Concept 5" means `docs/learning/concepts.md`, concept 5. "Before file" means `docs/learning/sre-and-hardening-proposals-before.md`. "Lessons" means `docs/learning/debugging-lessons.md`. "The plan" is `docs/status/security-hardening-plan-2026-10-11.md`. "The brief" is `docs/operations/sre-architecture-phase-brief.md`.

---

## 1. How to use this guide

### The method, once

Almost every question here is answered the same way:

1. Open the file the question names. Do not work from memory or from the notes alone.
2. Write down the input: who is acting, with which tool, on what.
3. Go line by line. At each `if`, write the value being tested and whether the branch is taken.
4. Stop at the first line that ends the program (`process.exit(...)`, `block(...)`, `return`).
5. Say what you concluded and which line made you conclude it.

Each block below has a **worked example on a different input**. It shows the method on something the question does not ask. You cannot copy its result across, because the input differs in the place that matters. Do the worked example with the file open beside you, then do the question.

Use the hint ladder only when stuck, one rung at a time. If you needed all three rungs, say so in your answer. That is useful information, not a failure.

### One honest warning about the notes

The learning notes were written before the questions and some sections trace inputs very close to the ones asked. Reading a trace and reproducing it shows that you read it. It does not show that you can do the next one alone. So after using a section of the notes, close it and explain the reasoning aloud, as if to a friend. If you cannot, read it again. Expect a follow-up question on a changed input.

### Suggested order, easiest first

The times are my estimates for a first attempt with the files open. They are guesses, not targets.

| Order | Question | What kind of work | Estimate |
|---|---|---|---|
| 1 | C1-Q1 Which layer answered | Reading two messages closely | 15 min |
| 2 | C1-Q5 Grade the evidence | Sorting four claims by who is speaking | 15 min |
| 3 | C1-Q2 Predict `path-guard` | Three short traces in one file | 25 min |
| 4 | C1-Q3 The run log in three states | One trace repeated three times, then a judgment | 25 min |
| 5 | C2-Q2 RPO and RTO | No code. Reasoning about your own business | 30 min |
| 6 | C1-Q6 The QA stage that will not pass | Debugging by reading | 30 min |
| 7 | C2-Q5 A leaked download link | No code. Comparing two designs | 30 min |
| 8 | C2-Q4 What a passing check proves | Two short readings and careful listing | 30 min |
| 9 | C1-Q4 Briefing `devops-sre` | Evidence plus code plus a decision | 35 min |
| 10 | C2-Q6 The file that changed with no shell | Debugging across the brief and the guard | 35 min |
| 11 | C2-Q3 One line, two fixes | A trace before and after a change | 45 min |
| 12 | C2-Q1 What each rule stops | A five-by-five table | 60 min |

About six hours in total. There is no need to do it in one sitting, and no need to finish all twelve before answering any.

### The three to do first

These come first because decisions in front of you rest on them, not because they are the easiest.

1. **C1-Q3, the run log in three states.** It ends with an instruction only you can give before the first real feature, and Proposal A's decision 3 and Proposal B's decision 6 are about the same checker.
2. **C1-Q4, briefing `devops-sre`.** It is the reasoning underneath Proposal A's decision 2, the fence on the role that would do the SRE phase.
3. **C2-Q3, one line, two fixes.** Line 64 of `path-guard.mjs` is what Proposal B's decisions 5 and 10 change, and the plan says decision 10 comes before the other designs.

If tracing code is new to you, spend ten minutes on part (a) of C1-Q2 before these three. It is the gentlest trace in the set.

---

## 2. The twelve questions

---

### C1-Q1. Which layer answered, and how do you know?

**What it is really asking.** Two things were refused. For each, which mechanism did the refusing, and what in the wording of the refusal proves it? Then: when two mechanisms guard the same thing and only one speaks, what have you learned about the silent one?

**The idea you need first.** An agent is restricted by three separate mechanisms: the tools it was given, the permission rules, and the hook scripts. Each one refuses in its own way. A hook's refusal is text that the hook's own `block()` function writes, so the words can be found in the hook's file. Read concept 2, the table "The three layers that restrict an agent" and the paragraph under it about how a hook blocks.

**Where to look.**

- `.claude/settings.json` lines 4 to 20 (`deny`), 21 to 41 (`ask`), 44 to 63 (which hooks run before which tools). Notice which tools each hook is attached to.
- `.claude/hooks/secret-guard.mjs` lines 9 to 14 (`isSecretName`), 16 to 19 (`block`), 37 to 45. Notice the exact sentence it would write.
- `.claude/hooks/path-guard.mjs` lines 51 to 54 (`block`) and line 72. Notice the exact sentence it would write.

**Worked example on a different input.** The Independent Reviewer was asked to use the `Write` tool (concept 2, first row of the table "Which layer stopped what today").

- What came back: nothing. No call was made.
- Is the wording in a hook file? There is no wording to look for.
- Was a permission message shown? No.
- What the harness start-up record says: the reviewer was given `Read, Bash` and nothing else. [verified: concept 2, citing evidence section 3]
- Conclusion: the tool list answered. The tool was not there to be called.
- Now the second half of the method. Another control also covers a reviewer write: `OWNED['independent-reviewer']` on line 37 of `path-guard.mjs` is an empty list. Did today's result exercise it? No call reached line 86, so today's result says nothing about it, in either direction. It may work perfectly. Nobody saw it work.

The question asks you to apply the same two steps to two different refusals.

**Hint ladder.**

1. Each message was written by a piece of software. For each one ask: could I find these words in a file under `.claude/hooks/`?
2. Compare how the two messages begin. One of them announces where it came from.
3. For the last part of (a): besides the settings file, "Where to look" lists two files. One of them has a rule about files with this kind of name. Find the sentence it would have written, and put it beside the sentence that actually came back. Then ask what a control has proved on a day when its sentence never appeared.

**A common mistake.** Crediting a control because it exists and covers the case, not because its message came back. Lesson 3 is about exactly this habit.

**You have understood it when** you can explain aloud how to tell the three layers apart from a refusal message alone, and why "it was refused" and "the control I am thinking of works" are different statements.

---

### C1-Q2. Predict: what does `path-guard.mjs` do with these inputs?

**What it is really asking.** Can you run the guard in your head? Three inputs, three walks through one 90-line file. Part (c) adds: when this guard says nothing, is there anything else that would?

**The idea you need first.** The guard has two branches. File tools go one way: the path is turned into a clean path relative to the project folder and compared with the role's list of owned patterns. Shell commands go another way and never look at owned paths at all. Read concept 3, "The steps, in file order", and concept 4 up to "In this repository, both are in use".

**Where to look.**

- Line 64: who is checked at all.
- Lines 66 to 75: the shell branch. Notice the order of lines 67, 68, 70 and 71.
- Lines 77 to 89: the file branch. Notice that line 81 builds `relative` and that lines 83 and 86 print different variables in their messages.
- Lines 11 to 39 (`OWNED`) and 41 to 49 (`READ_ONLY_GIT`, `BASH_ALLOW`).
- For part (c) only: `.claude/settings.json` lines 4 to 41. Read every entry that starts `Bash(`.

**Worked examples on different inputs.**

*File branch, an input that is allowed.* Agent `da-vinci` calls `Write` with `file_path` set to `docs/design/tokens/../../design/spec.md`.

| Step | Value |
|---|---|
| Line 64 | `da-vinci` is a key of `OWNED`. No exit. |
| Line 66 | Tool is `Write`, not `Bash`. Skip the shell branch. |
| Collapsing `..` | Each `..` cancels the folder name before it. `docs/design/tokens/..` is `docs/design`. `docs/design/..` is `docs`. Then `design/spec.md` is added. |
| `relative` (line 81) | `docs/design/spec.md` |
| Line 83 | Does not start with `..`. Continue. |
| Line 86 | `/^docs\/design\//` matches the start of `relative`. |
| Result | Line 89, exit 0. Allowed. |

*File branch, an input that leaves the project.* Same agent, `file_path` set to `docs/design/../../../notes.md`. Three `..` after two folder names: the third one climbs out of the project. `relative` becomes `../notes.md`. Line 83 is true, so `block()` runs with the message built on line 84, exit 2. Notice that this message prints `target`, the path as it was typed, not `relative`.

*Shell branch, blocked by the list.* Agent `chief-engineer` calls `Bash` with `git branch -D old`.

| Step | Value |
|---|---|
| Line 67 | `BASH_ALLOW['chief-engineer']` is a list of three patterns. |
| Line 68 | `allow` exists. No exit. |
| Line 70 | The command contains none of the listed characters and no `--output`. `chained` is `false`. |
| Line 71 | First pattern needs one of seven subcommands after `git`; `branch` is not among them. Second pattern allows `git branch` alone or with one of five flags, then the end of the text; `-D old` is none of them. Third pattern is for a `node` command. No match. |
| Result | `block()` with the message on line 72, ending `Blocked: git branch -D old`. Exit 2. |

*Shell branch, allowed.* Agent `security-engineer` calls `Bash` with `pnpm why react`. Not chained. The pattern `/^pnpm (ls|why|outdated)( |$)/` on line 48 matches. Exit 0 on line 74.

*Reading the settings file.* For any role, `git rebase main`: no `deny` entry matches; line 25, `Bash(git rebase *)`, is on the `ask` list. These lists are not keyed by role (concept 2, layer table).

None of the three inputs in the question follows the same route as any of these.

**Hint ladder.**

1. For each part, decide first which branch it takes: file or shell. Then ignore the other branch completely.
2. Part (a): count the folder names and the `..` segments, and cancel them in pairs, before deciding anything. Part (b): line 70 runs before the patterns are consulted; read its character list against the command one character at a time. Part (c): write down what `BASH_ALLOW[agent]` evaluates to for that role.
3. Part (a): once you have `relative`, there are two tests left, lines 83 and 86; only one of them can be the one that decides. Part (c): after you know what line 68 does, go through the `Bash(` entries in the settings file and test each against the exact text of the command.

**A common mistake.** Deciding from what the command *would do* instead of from what the code *tests*. The guard does not know that a command is harmless or harmful. It compares text.

**You have understood it when** you can take an input nobody has shown you, say allowed or blocked, quote the message, and name the deciding line, without opening the notes.

---

### C1-Q3. Trace: the run log in three states

**What it is really asking.** The checker compares a ticked box with a log of which agents ran. What does it say when that log is normal, when it is empty, and when it is gone? Which of those three should worry you most, and what would you tell people to do about it?

**The idea you need first.** A function can return different kinds of "nothing", and the code that receives them can treat each kind differently. Read concept 5, from "The pieces" to the end, and concept 8 for the vocabulary you will want for the last part.

**Where to look.** `scripts/check-feature-ledger.mjs`:

- Lines 26 to 38, `readRuns`. Notice that it has two `return` statements, and what each one returns.
- Lines 73 to 79. Notice everything line 76 tests, and what line 74 tests about the evidence text.
- Lines 103 to 104. Notice what is printed and whether the script stops.
- Line 119. Notice what decides the exit code.

The question says the log holds nine records. When I last read `.claude/logs/agent-runs.jsonl`, on 2026-10-11, it held 16 (before file, section B4). Open it and count before you answer part (a), and look at the `agent` and `time` fields of the lines.

**Worked example on a different input.** A ledger with `tier: small`, `started: 2026-10-14`, and the line

`- [x] implementation | agent: frontend-engineer, backend-data-engineer | evidence: PR notes`

The log exists and holds two records: `frontend-engineer` at `2026-10-15T10:00:00.000Z` and `backend-data-engineer` at `2026-10-13T10:00:00.000Z`.

| Step | Value |
|---|---|
| `readRuns`, line 27 | The file exists. Not this return. |
| Lines 28 to 37 | Two lines, both valid JSON. Returns an array of two records. |
| Line 64, 65 | Tier is `small`. Neither early return. |
| Line 67 | `started` is midnight UTC at the start of 14 October. |
| Line 74 | Evidence is `PR notes`, not empty. No problem recorded. |
| Line 49 | The stage names two agents, so the loop on line 75 runs twice. |
| Line 76, first agent | Not `owner`; `runs` is an array, not `null`; `started` is a real date. No skip. |
| Line 77, first agent | A record with that name exists and its time is after `started`. `ran` is `true`. |
| Line 77, second agent | A record with that name exists, but its time is before `started`. The `&&` needs both halves. `ran` is `false`. |
| Line 78 | One problem: `stage "implementation" is ticked but backend-data-engineer has no recorded run since 2026-10-14` |
| Result | `FAIL` for this ledger, exit code 1. |

This is a fourth state: a log with real records, one of them too old. The question asks about three others.

**Hint ladder.**

1. Do `readRuns` first, alone, three times. Write down exactly what it hands back in each state before you look at `checkLedger`.
2. Two of your three results are different kinds of "nothing". Carry each one, separately, to line 76 and then to line 77.
3. For "most dangerous": for each state, ask whether a person looking only at the exit code and the list of `ok` lines would know that anything was unusual.

**A common mistake.** Treating "the file is empty" and "the file is not there" as the same situation because both contain no records.

**You have understood it when** you can explain aloud, to someone who has not seen the code, why two of these states look alike to a person and are not treated alike by the script, and what instruction follows from that.

---

### C1-Q4. Justify a decision: briefing `devops-sre` for the next phase

**What it is really asking.** `CLAUDE.md` says two things need your approval every time: new dependencies and destructive commands. For this one role, which parts of those two promises are held up by something that actually refuses, and which only by the agent choosing to obey? Then write the brief accordingly, and be honest about which of your reasons were seen happening and which were only predicted.

**The idea you need first.** A rule that reads a file path can be exact. A rule that reads a shell command is reading a sentence, and sentences can be reworded. Read concept 4 in full, and the "Which layer stopped what today" table in concept 2.

**Where to look.**

- `.claude/hooks/path-guard.mjs` lines 25 to 36: what this role may write with the file tools. Read every pattern.
- Lines 45 to 49: which roles have a shell list. Lines 66 to 68: what happens with and without one.
- `.claude/settings.json` lines 4 to 20 and 21 to 41. Find the entries about `rm`, and the entries about installing packages. Count the spellings.
- `docs/testing/evidence/foundation-validation-2026-10-11.md`, section 5 and the `devops-sre` role probe. I did not read this file today; the check names it as the source, and concept 2 and concept 4 summarise it.
- `docs/status/foundation-validation-review-2026-10-11.md`, findings R4 and R5 and section 5, condition 4. Also not read by me today.

One thing to know: this question was written before the brief was revised. Section 5 of the brief now proposes a different fence from the one the question has in mind. Write your own answer first. Then read section 5 of the brief and section B7 of the before file, and say whether you would change anything.

**Worked example on a different role.** The same analysis for `chief-engineer`.

- *A command that was stopped, and what stopped it.* `git push --dry-run origin main`. The refusal carried the `path-guard` wording that line 72 builds. [verified: concept 2 table, citing the Chief Engineer session]
- *A command that ran with nothing checking it.* I know of none recorded for this role. For the role in the question the notes do record one.
- *The dependency gate, shell route.* `Bash` with `pnpm add left-pad`. Line 67: the role has a list. Line 68: no exit. Line 70: not chained. Line 71: none of the three patterns matches. Blocked, exit 2. The same happens for `pnpm install`, `yarn add x` or any other spelling, because the test is "is it on the list", not "is it a known bad word".
- *The dependency gate, file route.* `Write` on `package.json`. `relative` is `package.json`. `OWNED['chief-engineer']` is one pattern, `/^docs\/status\//`. No match on line 86. Blocked.
- *So for this role* both routes to a new dependency end at a line of the guard, whatever the wording.

Now run the same two traces, shell route and file route, for the two roles the question compares, and put the results side by side.

**Hint ladder.**

1. Make a small table for each role: "may it write the manifest with the file tools?" and "what does the guard do with a shell command from this role?" Fill it from lines 11 to 49 only.
2. For the role in the question, think about two steps done one after the other, each of which is individually permitted.
3. For the brief: list what you want to be true during the phase. Beside each item write "something refuses this" or "only the agent's obedience". The second column is what the brief has to say in words. Then mark each row "seen happening" or "predicted by a reader".

**A common mistake.** Reading the long `deny` and `ask` lists and concluding that the gate is well covered. The length of a list of forbidden phrases says nothing about the phrases that are not on it.

**You have understood it when** you can explain aloud why two roles under the same `CLAUDE.md` rule are held to it by different things, and can say for each sentence of your brief whether it is doing a job that nothing else does.

---

### C1-Q5. Explain: grade the evidence

**What it is really asking.** Four statements about the system. For each: who is actually telling you this, could they be wrong without knowing, and what would make it firmer? One of the four has nothing behind it at all.

**The idea you need first.** Three grades. A harness record is produced by the runtime, outside the model. A tool message is machine-made text that a model then copied into a report. A self-report is the model describing itself or its conclusions. Read concept 6 in full, and concept 7 for the part about models.

**Where to look.**

- Concept 6, the three-row table and the "two rules" at the end.
- Concept 2, the last paragraph before the worked example: "There is a fourth thing that is not a layer."
- Concept 3, "What the traces do not cover".
- `docs/testing/evidence/foundation-validation-2026-10-11.md` sections 2 to 5 and the `software-architect` and `da-vinci` probes. Not read by me today; named by the check.

For each claim, find the place in the evidence it rests on and ask what kind of thing that place is.

**Worked example on three different claims.**

| Claim | Who is speaking | Grade | How far to rely on it | What would make it stronger |
|---|---|---|---|---|
| "The Independent Reviewer was given `Read` and `Bash` only." | The harness, in its start-up record for that session | Harness record | Heavily, for that session | A second session's record, since one record describes one session |
| "SAGE's write to `.claude/_probe-sage.txt` was blocked by `path-guard`." | The hook, quoted by a model in its report | Tool message | Well, because the quoted text matches the string built on line 87 of `path-guard.mjs` character for character | The raw transcript saved, or you running the same harmless probe yourself |
| "Bash is broadly gated after the first call." | The `devops-sre` agent, drawing a conclusion | Self-report | Little. The record disagrees with it, and the record's own correction rests on one command (concept 6) | One more trial with a second unmatched command |

**Hint ladder.**

1. For each claim, finish the sentence "I know this because ... said so". Name the speaker before you name the grade.
2. Check each of the four for a speaker who is describing itself, and for a speaker that sits outside every model.
3. For the claim with no evidence: look for a step that an agent was asked to try and did not try. Then apply the first of the two rules at the end of concept 6.

**A common mistake.** Grading a claim by how plausible it sounds or by whether the configuration says it should be true. "The code says this would be blocked" and "this was seen being blocked" are different grades.

**You have understood it when** you can take a sentence from any report in this project and say aloud who is really speaking, and can explain why an agent politely declining to try something is not a test result.

---

### C1-Q6. Debug: the QA stage that will not pass

**What it is really asking.** Real work was done, the box was ticked, and the checker still complains. Why? How would you confirm the cause by reading only? Why are the two tempting shortcuts wrong? And is the checker's behaviour here a fault or a feature?

**The idea you need first.** There is more than one way to start an agent, and the run log is written by one specific event. Read concept 1, the table "three ways an agent gets run" and the three numbered points under it; then concept 5, the table "What it cannot prove"; then concept 8.

**Where to look.**

- `.claude/settings.json` lines 64 to 73. Notice the name of the event the logger is attached to.
- `.claude/hooks/log-agent-run.mjs` lines 2 to 4 and 14 to 26. Notice what it records and when it runs.
- `scripts/check-feature-ledger.mjs` lines 26 to 38 and 73 to 79.
- `.claude/logs/agent-runs.jsonl`. Read it; change nothing.
- The command in the question itself. Read each flag.

**Worked example on a different fault.** A ledger has `started: 2026-10-20`. The Chief Engineer delegated to `security-engineer` on the evening of 19 October; the review was real. The `security` stage is ticked. The check prints:

`stage "security" is ticked but security-engineer has no recorded run since 2026-10-20`

1. *Find where the message is made.* Line 78. It is pushed when `ran` is `false`.
2. *Find what makes `ran` false.* Line 77: no record satisfies **both** `run.agent === agent` **and** `Date.parse(run.time) >= started`.
3. *Decide which half failed, by reading.* Open the run log and look for lines whose `agent` is `security-engineer`. There is one, with `time` `2026-10-19T21:15:00.000Z`. So the name half is true.
4. *Check the other half.* `started` is midnight UTC at the start of the 20th. The record is earlier. That half is false.
5. *Root cause.* The run is in the log, but it finished before the date typed into the ledger.
6. *What is the right response?* Here it is a question for a person, not a patch: is the `started` date wrong, or was the review done before the feature's work existed and so needs doing again? The two shortcuts in the question would be just as tempting here. I leave them for you.

The symptom is the same message as in the question. The cause in the question is a different one. The six steps are the same.

**Hint ladder.**

1. Do step 3 of the worked example for the question's case. What would you expect to find in the log, and what would it mean if you did not?
2. Compare the command in the question with the three rows of the table in concept 1. Which row is it? Then read the numbered points under that table.
3. For the two shortcuts, do not reason in general. Take each one to `readRuns` and to line 76 and 77 and trace what the script would then do. For the last part, ask: did the checker stop work, or did it let something through?

**A common mistake.** Concluding that the checker is broken because the work was genuinely done. The checker does not test whether work was done.

**You have understood it when** you can explain aloud what the run log is actually a record *of*, why honest work can be invisible to it, and why making the message go away is not the same as fixing the cause.

---

### C2-Q1. Work out: what would each rule stop, and what would it not?

**What it is really asking.** Five ways of damaging something, set against five controls: today's configuration and four proposals. Fill in a five-by-five table. Then find the action that slips past every proposal, and say how you would ever learn that it had happened.

**The idea you need first.** Ask of every control: is it reading what was *said*, or controlling what can *happen*? Read the before file, section B1 (the library sign and the gate), B2 (guest list and banned list), B7 (not bringing the saw), and B6 for the final part.

**Where to look.**

- Row 1: `.claude/settings.json` line 19 and lines 21 to 41; `path-guard.mjs` lines 25 to 36, 45 to 49, 64, 68 to 73.
- Row 2: the plan, H-05, "Proposed change". Read the list of patterns and the sentence after it.
- Row 3: the plan, H-01, "Proposed change" and "Abuse and regressions". Read what is on the starting list and what the second paragraph admits.
- Row 4: the plan, H-02, and the table "What the gate would and would not do" in section B1 of the before file. Read both columns.
- Row 5: the before file, section B7, including "What it does not cover".
- The check also names H-03 and H-04. Read them before the final part.

Rows 2 to 4 describe things that do not exist. Everything you write for them is a prediction about a proposal.

**Worked example on a sixth action.** `frontend-engineer` runs `find .claude -name '*.mjs' -delete` in its shell. This is not one of the five.

| Row | Would it be stopped? | By what | Status |
|---|---|---|---|
| 1. Today | No | `path-guard.mjs`: line 64 passes (a known role); line 67 finds no list for this role; read line 68. Settings: no `deny` or `ask` entry contains `find`. | Static analysis, not executed |
| 2. H-05 wider `ask` list, non-interactive | Yes, as written | The proposed pattern `find * -delete*` matches this text. In a session that cannot prompt, an `ask` comes back as a refusal (concept 2, table row for `git merge -h`). The plan adds that a reworded command would not match. | Proposed |
| 3. H-01 allowlist | Yes | The role gains a list. `find` is not on the starting list, so line 71 would block. | Proposed |
| 4. H-02 sandbox with that deny list | Yes | `.claude/` is on the list, so the operating system would refuse the delete however it is worded. | Proposed, and unverified on the installed version |
| 5. `--disallowedTools Bash` | Yes | There is no shell tool to issue the command with. | Verified for a direct launch, as reported by the Chief Engineer (before file, B7); unverified for a delegated run |

So this sixth action is stopped by everything proposed. None of the five in the question has this row pattern.

Notice the two questions I asked in every row: *which tool or program is doing the damage*, and *does this control look at that tool at all*.

**Hint ladder.**

1. Before filling any cell, write beside each of the five actions: who or what performs the damaging step. A typed command? A program that a typed command starts? A file tool?
2. Two of the five actions are not a typed command that names what it destroys. For those, go row by row and ask whether the control even looks in that direction.
3. For row 4, check the target of each action against the deny list the question gives, path by path. For the final part: find the action whose row is empty for rows 2 to 5, then read the first paragraph of B6 and ask what would need to exist beforehand for a comparison to be possible.

**A common mistake.** Treating "the command is on a forbidden list" as "the thing cannot happen". A second one: assuming a control that covers the shell also covers the file tools, or the other way round.

**You have understood it when** you can explain aloud why adding lines to a list of forbidden phrases never finishes the job, and can say for each of the five controls what it is blind to.

---

### C2-Q2. Decide: RPO and RTO for this shop

**What it is really asking.** If the database vanished and you had to go back to this morning's copy, what exactly would be gone, who would be hurt, how would you find them, and how long before you could sell again? There is no code and no single right number. What is assessed is whether your reasons hold.

**The idea you need first.** Two separate questions about a disaster: how much recent work may be lost (RPO), and how long may the shop be closed (RTO). A backup and a recovery are different things. Read the before file, section A4, all of it.

**Where to look.**

- The before file, A4: the definitions, the table of data classes, the list of what the RTO clock includes, and "Why a backup is unproven until a restore is tested".
- The brief, area D (it starts at the heading "D. Data protection and recovery"): questions 1, 2, 5 and 8, the six-column form, the three isolation requirements. Criterion 11 in section 4.
- `docs/architecture/reviews/sre-phase-brief-architecture-review.md`, item T-07. Not read by me today; named by the check.

The worked example in A4 uses orders. Use it to learn the method, then do the question with your own numbers and the question's own times.

**Worked example on a different kind of data.** The catalogue: titles, prices, descriptions. The numbers are made up to show the reasoning.

The database is lost on Friday at 14:00. The newest usable backup is from Sunday at 02:00. On Wednesday you changed 30 prices. On Thursday you unpublished one product.

- *What changed in the window?* Thirty prices and one product's visibility. Nothing else in the catalogue.
- *What does a customer see after the restore?* Last week's prices. A product that should not be on sale.
- *Is there a second source?* Only if you keep one: a spreadsheet, or the document you worked from. If the database was the only place the prices lived, the second source is your memory.
- *What does the restore bring back that you do not want?* The unpublished product, on sale again.
- *What RPO does that suggest for this data?* It changes only when you edit, perhaps a few times a week. A window of a day loses, at worst, one day's editing, which you can redo if you kept notes. So the tolerable window depends on your editing habits and on whether a second copy exists.
- *RTO arithmetic, for a daytime failure.* The clock starts at the failure, not when you notice. Suppose: 20 minutes to notice, 20 to decide what happened, 30 to find credentials and the key, 60 to restore, 30 to check. That is two hours and forty minutes before you could reopen, and every one of those figures is a guess until a restore has actually been timed.

Catalogue data behaves differently from the data in the question in one important way: how often it changes and who is affected by each change. Finding that difference is part of the question.

**Hint ladder.**

1. Draw a line from 02:00 to 14:00. Write on it what happened in the shop during those hours, from the customer's side: they chose, they paid, they received something. Then ask which of those facts lived only in the lost database.
2. More than one organisation keeps a record of a sale. For part 2, ask who else knows, and what your own records would need to contain for the two to be matched up.
3. For part 3, think of something you *undid* during the window, and what going back in time does to it. For part 5, list the steps in order and put a time beside each, starting from the failure and not from the moment you wake.

**A common mistake.** Thinking of the loss as lost money. Work out where the money is before you write anything else. A second one: quoting an RTO that silently assumes you are awake and at a computer.

**You have understood it when** you can explain aloud to a friend, without jargon, why "a backup runs every night" and "I can recover" are different sentences, and can defend the two RPO figures you chose with a reason that comes from how each kind of data behaves.

---

### C2-Q3. Trace: one line, two fixes

**What it is really asking.** One line of the guard decides who is checked at all. A tidy-looking correction to it was proposed. Trace two inputs through the line as it is and as it would be, and discover what the correction does to each. Then say what that teaches about testing a fix, and what the correction needs beside it to be safe.

**The idea you need first.** Two small pieces of JavaScript, and one design idea.

- Every JavaScript object carries some names it never defined itself: they are inherited. `in` answers "does this name exist on the object, including inherited ones?" `Object.hasOwn` answers "did this object define this name itself?"
- A value that exists counts as "truthy" in an `if`, whatever it is. A function is a value that exists.
- The design idea: a strict rule can sit behind a lenient test of "does this rule apply to you?"

A neutral illustration, nothing to do with the guard: given `const box = { lid: 1 }`, the test `'lid' in box` is true and `Object.hasOwn(box, 'lid')` is true. The test `'toString' in box` is also true, because every object inherits `toString`; `Object.hasOwn(box, 'toString')` is false; and `box['toString']` is a function, so `if (!box['toString'])` does not fire.

Read concept 8, then the before file, sections B2 and B3, then lesson 4 and lesson 7.

**Where to look.**

- `path-guard.mjs` line 64. It has two halves joined by `||`. Read each half separately.
- Lines 67 and 68. Notice what `allow` is being tested for: existence, not kind.
- Line 70. Read the character list.
- Line 71. Notice the method that is called on `allow`, and what kind of value has that method.
- Lines 45 to 49: the three real entries.
- For part 6: `scripts/test-guards.mjs` lines 16 to 17 (`ALLOW`, `BLOCK`), 20 to 24 (`expect`) and 26 to 33 (`runHook`). Notice what `runHook` returns and what `expect` compares. Notice what neither of them looks at.
- For part 5: the plan, H-31, "Proposed change", and H-08.

**Worked example on a different input.** Agent `sage` calls `Bash` with `rm -r apps`. (SAGE holds no shell in practice; this is an exercise.)

*As the file is today.*

| Line | Value |
|---|---|
| 64 | `agent` is `sage`, so `!agent` is false. `'sage' in OWNED` is true, because `sage` is a real key on line 38. So `!(…)` is false. Neither half fires. No exit. |
| 66 | Tool is `Bash`. Enter the branch. |
| 67 | `BASH_ALLOW['sage']`: there is no such entry. `allow` is `undefined`. |
| 68 | `!undefined` is true. `process.exit(0)`. |
| Result | Exit 0, from line 68. |

*With line 64 changed to `Object.hasOwn(OWNED, agent)` and nothing else.*

| Line | Value |
|---|---|
| 64 | `Object.hasOwn(OWNED, 'sage')` is true: `sage` is the object's own key. No exit. |
| 67, 68 | As before. |
| Result | Exit 0, from line 68. Nothing changed for this input. |

What the example shows: the substitution only matters for a name on which the two tests *disagree*. For `sage` they agree. Part of the question is finding out, for each of its two inputs, whether they agree, and where the input goes next if they do not.

**Hint ladder.**

1. For each of the two agent names in the question, answer two yes-or-no questions before tracing anything: is it one of the ten keys typed on lines 12 to 38? Is `name in OWNED` true anyway?
2. For input 2, apply the same two questions to `BASH_ALLOW` on line 67, then decide what line 68 sees. Then read line 70 against the command.
3. For parts 3 to 5: after the substitution, one of the two inputs takes a different route at line 64. Read what the exit code there means. Then ask what would have to be different about *that exit* for the substitution to be harmless. For part 6: imagine a guard so broken that every run throws an error, with the "exit 2 on any error" wrapper in place. Write down what `runHook` returns, then what `expect` prints for a case labelled `BLOCK`.

**A common mistake.** Checking that the fix repairs the thing it was aimed at, and stopping there. Follow the input to wherever it goes next.

**You have understood it when** you can explain aloud why a change can be correct and still make the system less safe, why the test should be written down as an exact input and exact expected result before the change, and what a test that looks only at an exit code can and cannot tell you.

---

### C2-Q4. Explain: what would a passing ledger check prove?

**What it is really asking.** Under the proposed stricter check, a stage is ticked, a run id is cited, and the check passes. What do you now actually know? What might you wrongly assume? Is there a way to get a pass without the real log being consulted? And what would *you* look at before trusting the stage?

**The idea you need first.** Corroboration supports a claim. Proof means the claim could not be false. The difference is whether the party being checked could have produced the evidence. Read the before file, section B4, then concept 5 ("What the check proves when it passes" and "What it cannot prove"), then lesson 6.

**Where to look.**

- `scripts/check-feature-ledger.mjs` lines 7 to 8 (what the script says about itself), lines 13 to 18 (how options are read), and lines 73 to 79.
- `.claude/hooks/log-agent-run.mjs` lines 20 to 26. List the four fields. Notice what is *not* among them.
- `path-guard.mjs` line 46. Read the end of the last pattern on that line, the part in brackets, and say in words what it permits after the script's name.
- The plan, entries H-10, H-14 and H-33. Read the "Proposed change" of each.

**Worked example on different inputs.**

*What a pass proves, under today's rule and for a different stage.* A ledger has `started: 2026-10-11` and the line `- [x] review | agent: independent-reviewer | evidence: looked fine`. The check prints `ok`.

What you know:

- the tier is `small` or `substantial`, or it is `trivial`, in which case line 64 returned before checking anything;
- if not trivial: the text after `evidence:` is not empty (line 74);
- if not trivial, and line 76 did not skip the test: at least one record has `agent` equal to `independent-reviewer` and a `time` on or after the start date (line 77).

One thing it has not shown: that this record is not the very same one that satisfies another stage, or another ledger started the same day. Line 77 asks "is there any such record?", so one record can be counted any number of times. There are more; find them for the question's case yourself, under the proposed rule, which closes some gaps and leaves others.

*How an option changes what the script reads, using the other option.* Line 17 reads `--dir`:

- `option('--dir', 'docs/status/features')` looks for the text `--dir` among the arguments (line 14).
- Not found: it returns the fallback, the real ledger folder.
- Found: it returns whatever argument comes next (line 15).

So if the script is started with `--dir` pointing at a folder that contains no ledgers, line 106 finds no files, line 118 prints `0 ledger(s) checked, 0 with problems.` and line 119 exits 0. The output looks clean and the real ledgers were never opened. [static analysis, not executed]

Line 18 is the line the question asks about. Trace it yourself in the same way, then read line 46 of the guard.

**Hint ladder.**

1. For part 1, write only sentences of the form "a record exists that says ...". If a sentence starts "the security review was ...", it belongs in part 2.
2. For part 2, look at the four fields the logger writes and ask what you would *want* to know about a security review that none of the four can tell you.
3. For part 3, combine two facts: who is permitted to run this script, with what after its name; and where that same role is permitted to create files (line 12 of the guard). For part 5, ask who can read the file in which a key would have to be kept.

**A common mistake.** Reading "the check passed" as "the stage was done". The check compares two records with each other. It does not look at the work.

**You have understood it when** you can explain aloud what the phrase "corroboration and never the only evidence" obliges *you* to do at acceptance, and can name the things you would open and read for a security stage.

---

### C2-Q5. Decide and justify: a leaked download link

**What it is really asking.** Two ways of delivering a paid file. In one, your server hands out a temporary address and the storage service does the rest. In the other, every byte goes through your server. A link leaks and the sale is refunded. Under each design: who can download, for how long, at whose cost? There is no approved answer; the brief asks these questions and does not answer them.

**The idea you need first.** The moment at which "is this person entitled?" is asked. Asked once when a link is issued, the link itself becomes the permission. Asked on every download, there is nothing to leak that works alone. Also: sending a file out costs money each time. Read the before file, section A6: "Egress", "Signed, expiring links" and "Where the entitlement check happens", including the list of questions at the end of that subsection.

**Where to look.**

- `.claude/rules/security.md` line 8. Read the sentence slowly and ask which *request* it means. I did not re-read this file today; the before file quotes the line.
- The brief, area F (heading "F. Infrastructure and cost"), questions 4 and 5 and the download delivery row; area E question 11; area C question 2; decision 7 in section 7.
- The architect's review, items T-02 and T-06, and the security review, SA-04. Not read by me today.

**Worked example on a different threat.** No leak and no refund. A customer with a perfectly valid purchase runs a script that downloads their own file 500 times in an hour.

- *Signed link from storage.* Each time the script asks for a link, the entitlement check runs and passes, correctly: this customer is entitled. Each link works. The storage service sends the file 500 times. The shop pays for 500 transfers.
- *Proxied through the API.* Each download is checked by the server and passes, correctly, for the same reason. The server streams the file 500 times and is occupied for the length of every one. The shop pays for the transfers, and possibly twice if the path from storage to server is also charged [unverified, depends on vendor].
- *What this shows.* Where the entitlement check sits makes no difference to this threat, because the person is entitled every time. What limits it is a different sort of control altogether: one that counts, not one that asks "who are you?". The brief lists such things; look for them in the questions at the end of the "entitlement check" subsection of A6.
- *Who can supply the missing facts?* How large the files are and how many times an honest customer needs to download are facts only the owner has. What a transfer costs depends on a vendor nobody has chosen.

The leaked-link case in the question is the reverse situation: there, the person downloading is *not* entitled. So the reasoning comes out differently, and that difference is the question.

**Hint ladder.**

1. For each design, find the exact moment the shop last asked "is this customer entitled?" Put the refund and the forum post on the same timeline.
2. For part 3, read the security sentence twice, once taking "request" to mean a request for a link and once a request for the file. Does each design satisfy each reading?
3. For part 4, every control that shortens or narrows what a link is good for also takes something from an honest customer on a slow connection or a second device. Name both sides for each. For part 6, think about every place where a web address gets written down automatically.

**A common mistake.** Assuming a refund reaches out and cancels a link. Check what, in each design, a refund actually changes and what it cannot touch.

**You have understood it when** you can explain aloud what a signed link *is* in one sentence a non-technical friend would follow, and can say which facts you would want in hand before choosing and who has to supply each one.

---

### C2-Q6. Debug: the file that changed with no shell

**What it is really asking.** The phase ran with the role's shell taken away. A file the role was told not to touch changed anyway, and the role's report says it ran no commands. Is the report lying? Which protections were real, which were only words, and what made the change visible at all?

**The idea you need first.** A fence covers what it covers and nothing else. And there are three kinds of protection: one that stops a thing, one that tells you afterwards, and a sentence that asks nicely. Read the before file, sections B7 (especially "What it does not cover") and B6.

**Where to look.**

- `path-guard.mjs` lines 25 to 36 and line 86. Read each pattern in the role's list. Line 32 lists several file names in one pattern.
- The tool list in the question itself. Read all five names.
- The brief, section 5, rules 1 to 5. For each rule, ask: is this enforced by something, or is it an instruction?
- The brief, "Preconditions", P1; section 4, criteria 2, 3 and 17; section 8, risk 2.
- The plan, H-04 part 3 (the list of files that would prompt) and H-16.
- The security review, SA-02 and N-16. Not read by me today; item 4 of section E in the before file summarises N-16.

**Worked example on a different incident.** Same phase, a different role. QA took part, and one `qa-test-engineer` session held the tools Read, Write, Edit and Bash. At the end, the check reports that `scripts/check-feature-ledger.mjs` changed. The QA report says "Commands run: none".

1. *List what the session could act with.* Four tools. Ask of each whether it can change a file.
2. *Take each one that can through the guard.*
   - Write or Edit on `scripts/check-feature-ledger.mjs`: `relative` is that path. Go down `OWNED['qa-test-engineer']` pattern by pattern, lines 19 to 23. None matches. Line 86 would block. So the file tools could not have done it.
   - Bash: line 64 passes. Line 67 looks for this role in `BASH_ALLOW` and finds no entry. Read line 68 for what follows. The shell branch never consults `OWNED`.
3. *Is the report consistent with the change?* No. With these tools, only one route could have made this change, and the report says that route was not used. The report is a self-report (concept 6).
4. *Which rule broke, and what kind of rule is it?* Rule 9 of the brief: each agent writes only in its own area. For this role and this route, nothing in the guard enforces it, so here it is an instruction.
5. *Is "the fence failed" accurate?* No. The fence in rules 1 to 3 is about `devops-sre` sessions. QA was never inside it.

In the question the role is the fenced one, the tool list shows no shell, and a different file changed. Do steps 1 and 2 again for the question's tool list, the question's role and the question's file. They do not come out the same way.

**Hint ladder.**

1. Do step 1 for the question's tool list. How many of the five tools can change a file?
2. Do step 2 for the question's file name, pattern by pattern. Then go to section 5 of the brief and find the rule that mentions this file, and read its last sentence.
3. For part 4, ask what the criterion compares the present state *against*, and what the result would be if that thing had never been made. For part 5, ask what this particular file tells git to do, and which command in criterion 2 depends on git's view of the folder. For part 7, look at the list in H-04 part 3 and at what is and is not on it.

**A common mistake.** Reading "commands run: none" as "nothing was changed". Ask what the phrase "commands run" covers and what it leaves out.

**You have understood it when** you can explain aloud, for each rule in section 5 of the brief, whether it prevents, detects, or only instructs, and can say what a control was and was not responsible for before judging whether it failed.

---

## 3. How to answer

There are two ways. Use whichever is easier; you can mix them.

**Option 1: answer in your conversation with the Chief Engineer.**

- Write your answer there and say which question it is for, for example "check 2, question 3, part 1".
- The Chief Engineer passes your words to SAGE unchanged. SAGE checks them against the code and the sources listed under "Check against", then writes the question, your answer and the assessment into `docs/learning/understanding-checks.md`.
- If something is wrong or incomplete, SAGE names the exact misunderstanding and sends back a correction and usually a follow-up question, again through the Chief Engineer.
- What it involves: one extra step in each direction. Ask the Chief Engineer to relay your wording as you wrote it, not a summary. A summary is the Chief Engineer's answer, not yours.

**Option 2: open a session directly with SAGE.**

- Start a session as the `sage` agent and answer there. The form recorded as working in this repository is the one-shot command `claude -p --model opus --agent sage "<your message>"` [verified for one-shot use: concept 1]. A back-and-forth conversation needs the same command without `-p`; I have not seen that form observed here [unverified]. A session started without `--model` fails on this account (concept 7).
- What it involves: no relay, and follow-up questions come immediately, which suits the tracing questions. SAGE starts each session with no memory of earlier ones, so say which question you are answering; the record in `understanding-checks.md` is what carries over.
- How a session is started affects what the system records about it. C1-Q6 is about that, so I say no more here. Nothing depends on it today: I listed `docs/status/features/` and it holds only the template, so there is no ledger for these checks.

**In either case.**

- **Rough is fine.** Three sentences that show your reasoning are better than a polished page. Write the way you would explain it aloud.
- **A wrong answer is useful.** It shows exactly which idea needs another look, which a blank cannot. Nothing is marked against you. The only thing recorded is what you said and what was found.
- **"I do not know, and here is where I got stuck" is an answer.** Say which line or which idea stopped you.
- **One question at a time is fine.** So is one part of one question.
- **Say which hints you used.**
- **Do not run anything that changes or deletes a file to find out.** Reading is the method.
- Nothing is recorded as understood until you have answered and the answer has been assessed. SAGE will not fill in an answer for you.

---

## 4. Glossary

One plain sentence each. These are definitions, not answers.

| Term | Meaning |
|---|---|
| Agent, role | A separate worker with its own instructions and its own tools, defined by a file in `.claude/agents/`. |
| Harness | The Claude Code runtime that hosts the agents, runs their tools and writes its own records. |
| Layer | One of the separate mechanisms that restrict an agent: tool list, permission rules, hooks. |
| Tool list | The set of tools an agent was actually given when its session started. |
| Permission rule | A line in `.claude/settings.json` that matches a tool call by its text. |
| `deny` | A permission rule that refuses outright. |
| `ask` | A permission rule that stops and shows the owner a prompt. |
| Non-interactive session, `-p` | A session that runs once and exits, with nobody there to answer a prompt. |
| Hook | A small program the harness runs at a set moment, such as before a tool call. |
| `PreToolUse` | The moment just before a tool call, when the two guard hooks run. |
| `SubagentStop` | A harness event to which the logging hook is attached in `.claude/settings.json`. |
| Guard | Here, one of the two hook scripts: `path-guard.mjs` or `secret-guard.mjs`. |
| Exit code | The number a program hands back when it ends; for these hooks 0 means allow and 2 means block. |
| `block()` | The function in each guard that writes a message and ends with exit code 2. |
| Allowlist | A list of what is permitted, with everything else refused. |
| Denylist | A list of what is refused, with everything else permitted. |
| Default-deny, default-allow | What happens to something nobody listed: refused, or permitted. |
| Pattern, regular expression | A compact description of a shape of text, used to test whether some text fits. |
| Anchored | Said of a pattern that must match at the very start (`^`) or the very end (`$`) of the text. |
| `OWNED` | The table in `path-guard.mjs` from each role to the path patterns it may write. |
| `BASH_ALLOW` | The table in `path-guard.mjs` from some roles to the shell commands they may run. |
| `relative` | In `path-guard.mjs`, the cleaned-up path from the project folder to the target file. |
| `..` | In a path, "go up one folder". |
| `chained` | In `path-guard.mjs`, true when a command contains characters that join or redirect commands. |
| Lane | The set of folders a role is meant to write in. |
| Delegation | The Chief Engineer starting a specialist through its agent tool. |
| Direct start | The owner starting a session as a specialist from the command line. |
| Run log | `.claude/logs/agent-runs.jsonl`, the file to which the logging hook appends one line each time it runs. |
| Ledger | A checklist file for one feature, with a tick box per stage. |
| Stage | One line of a ledger: a step, the agent responsible and the evidence. |
| Tier | A ledger's size label, which decides which stages are required. |
| Probe | A small harmless test action made to see how the system responds. |
| Fail open | An error inside a control leads to permission. |
| Fail closed | An error inside a control leads to refusal. |
| Harness record | Evidence produced by the runtime, outside any model. |
| Tool message | Machine-made text returned by a tool or hook, usually seen as quoted in a report. |
| Self-report | A model describing itself or stating its own conclusion. |
| Static analysis | Reading code and predicting what it would do, without running it. |
| Gate | A step that needs the owner's approval before it may happen, as numbered in `CLAUDE.md`. |
| Manifest | A file such as `package.json` that lists what the project depends on. |
| Dependency | Someone else's code that the project installs and relies on. |
| Inherited property | A name that exists on a JavaScript object without the object having defined it. |
| Sandbox | A proposed setting in which the operating system itself refuses certain writes from the shell. |
| Prevention | A control that stops a thing from happening. |
| Detection | A control that tells you afterwards that a thing happened. |
| Residual risk | What remains possible after the controls are in place. |
| Baseline | A fixed record of the state of every file, against which later changes can be seen. |
| Fence | Here, the set of limits placed on `devops-sre` for the phase. |
| Corroboration | Evidence that supports a claim without making it certain. |
| RPO | Recovery Point Objective: how much recent data you are prepared to lose, measured in time. |
| RTO | Recovery Time Objective: how long you are prepared to be unable to sell. |
| Backup | A stored copy of data from some earlier moment. |
| Restore | Putting a backup back so that the system runs from it. |
| Reconciliation | Comparing your records with someone else's to find what is missing. |
| Entitlement | The shop's record that a particular customer may download a particular file. |
| Signed link | A web address that carries its own expiry time and a signature the storage service checks. |
| Proxy | Here, your own server passing the file along to the customer byte by byte. |
| Egress | Data leaving a provider towards the internet, usually charged by size. |
| Webhook | A call from an outside service to your server to announce that something happened. |
