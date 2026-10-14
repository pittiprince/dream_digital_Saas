# Learning Concept: Role-Based Instructions vs. Independently Executing Agents

## Verified Capability: Role-Based Instructions (Current Configuration)
In this Cline session, the `.clinerules` directory contains **specialized operating instructions** for the AI coding assistant. These files (e.g., `00-team-charter.md`, `01-architecture.md`, etc.) are **not independent agents**. They are:
- **Guidance documents** that the lead coding assistant (Cline) reads and follows when prompted.
- **Static markdown files** that provide role-specific responsibilities, workflows, and best practices.
- **Invoked by the orchestrator role** (via the 09-orchestration.md workflow) to select relevant specialist instructions for a task.
- **Verified to exist and be readable** in the repository (as confirmed by file inspection).

### Evidence from the configuration:
- The team charter (00-team-charter.md) states: "In the VS Code extension, treat the roles in this folder as specialized operating instructions for the current assistant, **not as nine automatically independent agents**."
- The Sage role file (11-sage-mentor-knowledge-engineer.md) ends with: "SAGE is a role instruction in this project configuration. **Do not claim it is an independently running agent unless the active Cline environment proves that capability**."
- No mechanism exists in this session for the roles to spawn independently, execute in parallel, or maintain state without the orchestrator explicitly invoking them via the provided tools (e.g., `team_spawn_teammate` would be required to create a teammate, but that has not been done in this session).

## Unverified Claim: Independently Executing Agents
An independently executing agent would imply:
- Each role operates as a separate AI instance with its own memory, context, and ability to act without direct orchestration.
- Roles could communicate, delegate tasks, and make decisions autonomously.
- The system would support true parallel execution of role-specific work.

### Why this is not verified in the current configuration:
- The charter explicitly denies autonomous parallel execution unless the environment demonstrably supports it.
- No team members have been spawned in this session (we used only file reads and commands; no `team_spawn_teammate` calls were made).
- The available tools allow for spawning teammates (via `team_spawn_teammate`) but that action has not been exercised in this workflow test.
- Therefore, the claim that the nine roles are independent agents is **not supported by the current setup**; they are presently **role-based instructions** only.

## Connection to This Session
In this controlled workflow test:
- We read the role files to understand responsibilities (Orchestrator and SAGE roles).
- We created documentation (README.md and concepts.md) following the orchestration workflow.
- We did **not** spawn any teammates; thus, no role acted independently.
- The learning concept documented here is based on the actual evidence: the files exist and are readable, and the charter's wording about non-independence.

## Takeaway
Role-based instructions provide a structured way to guide a single AI assistant through diverse engineering perspectives without requiring multiple autonomous agents. This approach is verifiable, safe, and aligned with the current Cline configuration.
---

## Correction for this repository (2026-10-11)

The note above was written for a Cline session and is kept as a record. It is not accurate for DreamDigital, which uses Claude Code.

What is different here, checked against the Claude Code documentation on 2026-10-11:

- **The ten roles are real subagents.** Each file in `.claude/agents/` defines an agent that runs in its own context window with its own tool list. The Chief Engineer, running as the main session, starts one with the Agent tool.
- **A subagent starts with no memory of the conversation.** It knows only its definition, `CLAUDE.md`, and the brief it is given. It hands back one final report.
- **Defining an agent does not make it run.** An agent runs only when the main session delegates to it or the owner starts a session as that agent.
- **Tool limits are enforced; path limits are added by a hook.** An agent without the Edit tool cannot edit. Which folders an agent may write to is checked by `.claude/hooks/path-guard.mjs`.

Status: the first two points are documented behavior. The run of each agent in this repository is recorded in `docs/testing/setup-validation.md`.

---

# How the engineering organization works, and where it is weak (after the validation of 2026-10-11)

Written by SAGE after reading the configuration, the validation record, the raw evidence and the Independent Reviewer's report. Sources, referenced and not copied:

- Validation record: `docs/testing/setup-validation.md`, section "Foundation validation, 2026-10-11". Called "the record" below.
- Raw evidence: `docs/testing/evidence/foundation-validation-2026-10-11.md`. Called "the evidence" below.
- Review: `docs/status/foundation-validation-review-2026-10-11.md`, findings R1 to R20. Called "the review" below.

**How to read the status tags.** Every claim carries one of these:

| Tag | Meaning |
|---|---|
| **[implemented]** | The code or configuration says this. I read the file and symbol named. Nobody necessarily watched it happen. |
| **[verified: source]** | It was observed happening today, and the named source holds the observation. |
| **[inference]** | A conclusion drawn from observations. Reasonable, but nobody observed the conclusion itself. |
| **[static analysis, not executed]** | Someone read the code and predicted what an input would do. The input was never run. Every bypass input in the review is in this category; the reviewer says so in its own "Not verified" section. |
| **[unverified]** | Not tested, or the test produced no result. |
| **[proposed]** | A recommendation. Nothing has been changed. |

One correction to the note above this line: "Tool limits are enforced" is true, but "the agent file's tool list is what the agent gets" is not. See concept 1.

## 1. What a subagent is here, and how one actually gets run

**Plain language.** A subagent is a separate worker with its own instructions, its own short list of tools and an empty memory. You hand it a written brief, it works, and it hands back one report. It does not see the conversation that led to the brief.

**Technical terms.** Each worker is defined by a Markdown file in `.claude/agents/`. The top of the file (the "frontmatter") has `name:`, `description:` and `tools:`. The rest of the file is the system prompt, the standing instructions the worker always has.

**In this repository.**

- Ten files define ten roles. [implemented] I listed `.claude/agents/` and read the `name:` and `tools:` lines of all ten, and the full text of `chief-engineer.md`, `independent-reviewer.md`, `sage.md` and `devops-sre.md`.
- Only one role may start other agents. The `tools:` line of `.claude/agents/chief-engineer.md` contains `Agent(software-architect, da-vinci, ...)` naming the nine specialists. No other agent file lists an agent tool. [implemented]

There are three ways an agent gets run. Defining an agent runs nothing.

| Way | What makes it happen | Status |
|---|---|---|
| **Default agent** | `.claude/settings.json` line 2: `"agent": "chief-engineer"`. A session started with no agent named becomes the Chief Engineer. | [verified: evidence, Chief Engineer session] for the command line. In a session started with no `--agent` flag, two blocked writes came back as `path-guard: chief-engineer does not own ...`. The guard read the name `chief-engineer` from the harness, so the setting took effect. [unverified] for a freshly started VS Code extension session. |
| **Delegation** | The Chief Engineer calls its agent tool with a brief. The harness starts the specialist, and a `SubagentStop` hook fires when it finishes. | [verified: `.claude/logs/agent-runs.jsonl`] I read the log: nine records, one per specialist, `06:41:15.849Z` to `06:41:57.095Z`, all in one session. |
| **Direct start** | `claude -p --model opus --agent sage "<brief>"`. `-p` means non-interactive: it runs once and exits. `--agent` picks the role for the whole session. | [verified: evidence, role probes] All ten roles ran this way or by default. |

Three things the owner should hold on to:

1. **The tool list in the agent file is a request, not a guarantee.** All ten agent files list `Grep` and `Glob` [implemented]. The harness start-up record for `independent-reviewer` shows it was given `Read, Bash` only, and `chief-engineer` was given `Task, Read, Bash, Write, Edit, Skill, TodoWrite` [verified: evidence section 3]. In every observation, a role that holds Bash did not receive Grep or Glob. For five further roles that pattern rests on the agents' own statements [self-report, record O1]. Why the harness withholds them is [unverified]. The agent tool also shows up under the name `Task`, and the Chief Engineer's `AskUserQuestion`, `EnterPlanMode` and `ExitPlanMode` were absent in the non-interactive session [verified: evidence section 3].
2. **A non-interactive session cannot ask you anything.** A rule that says "ask the owner" becomes a refusal. See concept 2.
3. **A direct start leaves no run-log record.** The logger is attached to `SubagentStop` in `.claude/settings.json`, which fires for delegated subagents. The nine direct role probes left no records [verified: record O5]. See concept 5.

One observed failure that is not yet explained: a long-running VS Code extension session returned `Agent type 'software-architect' not found` and listed only six built-in agents [verified: evidence section 7]. That session started before the configuration existed, so this says something about that one aged session and nothing reliable about the extension [record O4].

## 2. The three layers that restrict an agent

**Plain language.** Think of a building. First, which keys were you issued? Second, is there a rule at the front desk that says "nobody takes this door" or "call the owner before this door opens"? Third, is there a guard at the door who looks at who you are and where you are going? An agent meets all three, and they are separate mechanisms with separate weaknesses.

| Layer | Technical term | Where it lives | Keyed by role? |
|---|---|---|---|
| 1 | Tool list | `tools:` line in each `.claude/agents/*.md`, then filtered by the harness | Yes |
| 2 | Permission rules | `permissions.deny` and `permissions.ask` in `.claude/settings.json` | No. One list for every session and every role |
| 3 | PreToolUse hooks | `hooks.PreToolUse` in `.claude/settings.json`, running `.claude/hooks/secret-guard.mjs` and `.claude/hooks/path-guard.mjs` | `path-guard.mjs` yes; `secret-guard.mjs` no |

A hook is a small program the harness runs before a tool call. The harness sends it a JSON description of the call on standard input. Both guards block by writing a message to standard error and exiting with code 2 (the `block()` function in each file) [implemented].

`deny` means refuse outright. `ask` means stop and show the owner a prompt.

**Which layer stopped what today.**

| What was attempted | What came back | Layer | Status |
|---|---|---|---|
| Reviewer asked to use `Write` | Nothing. The tool does not exist for it, so no call was made | Tool list | [verified: evidence section 3, start-up record `Read, Bash`] This proves tool absence. It proves nothing about `path-guard`, because nothing reached it. |
| `Read` on `apps/api/.env`, seven roles | `File is in a directory that is denied by your permission settings.` | Permission rules, `deny` | [verified: evidence section 6] for the message. [inference] for the layer; see the worked example. |
| `git push --force --dry-run origin main`, `git reset --hard --help`, `git clean -n`, `rm -rf /tmp/...` in the `devops-sre` session | `Permission to use Bash with command ... has been denied.` | Permission rules, `deny` | [verified: evidence section 5; harness `permission_denials` list] |
| `git push --dry-run origin main`, `git merge -h`, `pnpm add --help`, `vercel --version`, `aws --version` in the same session | `Claude requested permissions to use Bash, but you haven't granted it yet.` | Permission rules, `ask`, degraded to refusal because `-p` cannot prompt | [verified: same]. An actual prompt shown to a person is [unverified]. |
| Out-of-lane `Write`, eight roles, nine attempts | `PreToolUse:Write hook error: ... path-guard: <agent> does not own <path>` | Hook, `path-guard.mjs` | [verified: evidence, role probes] |
| Chief Engineer runs `git push --dry-run origin main` | `PreToolUse:Bash hook error: ... path-guard: chief-engineer may only run its allowlisted read-only commands, one at a time.` | Hook, `path-guard.mjs`, Bash allowlist | [verified: evidence, Chief Engineer session step 7] |
| Reviewer runs `node --version` | `path-guard: independent-reviewer may only run its allowlisted read-only commands ...` | Hook, `path-guard.mjs`, Bash allowlist | [verified: review R17, the reviewer's own run] |
| `ls apps/api/.env` in the VS Code session | `... secret-guard: the command names a secret file (.env). ...` | Hook, `secret-guard.mjs`, Bash branch | Weaker than it looks. The only source is one prose line in the evidence with the message partly elided, not a transcript [review R15]. |

There is a fourth thing that is **not** a layer: the agent declining. `software-architect` declined the out-of-lane write, `independent-reviewer` declined the `touch`, and two roles declined the `.env` read. A refusal is good behavior and zero evidence that any control works. The record counts these as not observed, which is correct.

**Worked example: the order, using the secret-file result.**

Two mechanisms were both configured to stop a `Read` of `apps/api/.env`:

- Layer 2: `"Read(.env)"` in `permissions.deny`, `.claude/settings.json`.
- Layer 3: `secret-guard.mjs`. Its loop over `['file_path', 'notebook_path', 'path', 'glob', 'pattern']` takes `path.basename("apps/api/.env")`, which is `.env`, and `isSecretName('.env')` returns `true`, so it would call `block()` with `.env is a secret file. Secret files are never read, searched or edited by an agent.` [implemented]

Seven roles got the layer 2 message. None got the layer 3 message, and none of the seven messages carried the `PreToolUse:Read hook error:` prefix that every hook block in the evidence carries [verified: evidence section 6 and role probes].

Conclusion: for this call the permission rule answered and the hook's verdict never surfaced. [inference] Nobody observed the order directly. The record grades it the same way (O3).

Two consequences that matter more than the order itself:

1. **The file-tool branch of `secret-guard.mjs` has never been seen firing in a real session.** Its standing rests on the script cases in `scripts/test-guards.mjs` (I did not read that script; the count and labels are in the evidence). [unverified live]
2. **When two layers cover one thing, you only ever test the one in front.** If the front layer has a gap, the one behind it is untested exactly where you need it. The review gives a predicted example: `apps/api/.ENV` in capitals passes `isSecretName` because line 11 of `secret-guard.mjs` compares with `===` and `startsWith`, both case-sensitive, and the deny patterns are lower-case too. On a case-insensitive disk that would open the real file [review R7; static analysis, not executed].

**Do not over-learn "permissions run before hooks."** The evidence holds a second ordering observation that points the other way. `Bash(git push *)` is on the `ask` list, so the permission layer had something to say about the Chief Engineer's `git push --dry-run origin main`. What came back was the `path-guard` hook message, not the "haven't granted it yet" message that the same command produced for `devops-sre`. So in that call the hook answered ahead of the `ask` rule. Both observations fit "a `deny` rule on a file answers before hooks, and hooks answer before an `ask` prompt", but that is my [inference] from two data points and it has not been tested. Treat the order as something to observe per case, not a rule to rely on.

## 3. How `path-guard.mjs` decides

**Plain language.** The guard holds a table: for each role, the folders it owns. When an agent tries to write a file, the guard works out where that file sits relative to the project folder and checks whether the role's table has a matching entry. No match, no write.

**Technical terms.** The table is the constant `OWNED`, an object whose keys are agent names and whose values are lists of regular expressions (text patterns). `^` in a pattern means "at the very start".

**The steps, in file order** [implemented, `.claude/hooks/path-guard.mjs`]:

1. Parse the JSON from standard input into `input`. If parsing fails, `process.exit(0)`, which allows the call. See concept 8.
2. `agent = input.agent_type`. If there is no agent, or the name is not a key of `OWNED`, exit 0. A plain session with no agent is deliberately unrestricted.
3. If `input.tool_name === 'Bash'`, take the Bash branch (concept 4) and stop.
4. `target = input.tool_input.file_path` (or `notebook_path`). None: exit 0.
5. `root` = the project folder, from the `CLAUDE_PROJECT_DIR` environment variable.
6. `relative` = the path from `root` to `target`, normalised and with forward slashes. `path.resolve` collapses any `..` segments first.
7. If `relative` starts with `..`, the target is outside the project: `block()`.
8. If no pattern in `OWNED[agent]` matches `relative`: `block()` with `<agent> does not own <relative>. Report the needed change to the Chief Engineer instead of making it.`
9. Otherwise exit 0.

**Trace of an allowed write** [verified: evidence, SAGE role probe step 4].

| Variable | Value |
|---|---|
| `input.agent_type` | `sage` |
| `input.tool_name` | `Write` |
| `target` | the path of `docs/learning/_probe-sage.txt` |
| `relative` | `docs/learning/_probe-sage.txt` |
| `OWNED['sage']` | `[/^docs\/learning\//]` |
| Step 7 | does not start with `..`, continue |
| Step 8 | the pattern matches the start of `relative`, so `.some(...)` is `true` |
| Result | exit 0. Tool returned `File created successfully at: .../docs/learning/_probe-sage.txt` |

**Trace of a blocked write** [verified: evidence, SAGE role probe step 5].

| Variable | Value |
|---|---|
| `input.agent_type` | `sage` |
| `target` | the path of `.claude/_probe-sage.txt` |
| `relative` | `.claude/_probe-sage.txt` |
| Step 8 | `/^docs\/learning\//` does not match, `.some(...)` is `false` |
| Result | `block()`, exit 2. Tool returned `path-guard: sage does not own .claude/_probe-sage.txt. Report the needed change to the Chief Engineer instead of making it.` |

The message in the evidence is exactly the string built on the `block(...)` call in step 8, with `agent` and `relative` filled in. That match between code and observed output is why this result is trustworthy.

**What the traces do not cover.**

- Two roles have no live block result: `software-architect` declined to try, and `independent-reviewer` has no `Write` tool. `OWNED['independent-reviewer']` is `[]`, so `.some(...)` would always be `false` [implemented], but it has not been observed [unverified].
- The guard compares text, not the real location on disk. `path.resolve` does not follow symbolic links, so a link inside an owned folder that points elsewhere would pass [review R10; static analysis, not executed].
- Some patterns are not anchored to a folder. `/\.(test|spec)\.[cm]?[jt]sx?$/` and `/(^|\/)__tests__\//` in `OWNED['qa-test-engineer']`, and `/(^|\/)Dockerfile[^/]*$/` in `OWNED['devops-sre']`, match anywhere in the project, including under `.claude/`, which `CLAUDE.md` says nobody owns [review R11; static analysis, not executed].

## 4. Why a guard on the Write tool does not cover the shell

**Plain language.** The Write tool is a form with one box labelled "file path". A guard can read the box. A shell command is a sentence. `rm x`, `mv a b`, `echo hi > x`, `find . -delete` and a thousand other sentences all change files, and the file names can be assembled, abbreviated with wildcards or computed while the command runs. A program that reads the sentence beforehand cannot reliably tell which files it will touch.

**Technical terms.** There are two strategies for guarding free text:

- **Allowlist**: name the few commands that are permitted and refuse everything else. Safe by default, restrictive.
- **Denylist**: name the dangerous commands and permit everything else. Convenient, and only as good as your imagination.

**In this repository, both are in use, on different roles.**

Allowlist, three roles. In `path-guard.mjs` the Bash branch reads `BASH_ALLOW[agent]`. It exists for `chief-engineer`, `independent-reviewer` and `security-engineer` only. For those roles the command must match one pattern, and the variable `chained` rejects any command containing `; & | < > $` a backtick, a backslash, a newline, or the text `--output`. [implemented] Observed working for the Chief Engineer and the reviewer [verified: concept 2 table].

Nothing, for the rest. The line `if (!allow) process.exit(0);` means any role without a `BASH_ALLOW` entry passes every Bash command through `path-guard` untouched. The Bash branch never looks at `OWNED` at all, for any role. [implemented] Four roles hold Bash and have no entry: `frontend-engineer`, `backend-data-engineer`, `qa-test-engineer`, `devops-sre`. The file's own header says "Not a security boundary: an agent that holds unrestricted Bash can still write files through the shell."

Denylist, everyone. The only thing left for those four roles is the `deny` and `ask` lists in `.claude/settings.json`.

**What that means in practice.**

Observed: all four roles ran a plain `rm` on a real file with no guard message and no prompt [verified: evidence, role probes step 7b, four transcripts]. The files were their own probe files, so no harm was done. The point is that nothing checked.

Predicted by the reviewer, not run:

- **Destructive commands (`CLAUDE.md` gate 5).** The only `rm` pattern in `deny` is `Bash(rm -rf *)`. The review lists inputs that match no rule: `rm -r docs/`, `mv docs docs.old`, `: > CLAUDE.md`, `find . -name '*.md' -delete`, `git rm -r --cached .` [review R5; static analysis, not executed, apart from the plain `rm` above].
- **Dependency installs (`CLAUDE.md` gate 2).** `ask` holds `Bash(pnpm add *)` and `Bash(npm install *)`. The review lists `pnpm install`, `pnpm i react`, `yarn add x` and `npx <anything>` as matching neither. It also notes that `OWNED['devops-sre']` contains `package.json` (I confirmed the pattern on line 32), so that role could edit the manifest with the Write tool and then run `pnpm install`: two individually permitted steps that add up to an unapproved dependency [review R4; static analysis, not executed].

**The judgment to take from this.** For those four roles, path ownership and gates 2 and 5 hold because the agent chooses to respect its instructions, not because anything stops it. That is a legitimate design for a trust-based system, but it must be known. The reviewer's condition for the next phase follows directly: `devops-sre` is one of the four and is the role doing the SRE work, so its brief must say in words what the guards do not enforce (no installs, no manifest edits, no `rm` or `mv` outside its own output) [proposed, review section 5 condition 4].

One more denylist lesson from the same evidence: a pattern matches text, not intent. `git merge -h` and `aws --version` are harmless and were refused, because they match `Bash(git merge *)` and `Bash(aws *)` [verified: evidence section 5]. Whether an unmatched command runs freely was shown only once, by `node --version`, which was also the first command in the session; the reviewer points out this cannot rule out "only the first Bash call is free" and asks for one more trial [review R14; unverified].

## 5. What the run log and the ledger check prove, and what they cannot

**Plain language.** The ledger is a checklist for one feature, with a tick box per stage. Anyone who can edit the file can tick a box. So there is a second record, written by the system and not by an agent, of which agents actually ran. A script compares the two.

**The pieces.**

- **Run log.** `.claude/hooks/log-agent-run.mjs` runs on the `SubagentStop` event. It appends one line to `.claude/logs/agent-runs.jsonl` with four fields: `time`, `agent`, `agentId`, `session`. [implemented] Nine such lines exist [verified: I read the file].
- **Ledger.** `docs/status/features/<id>.md`, from `docs/status/features/_TEMPLATE.md`. Header fields `tier`, `ui`, `security-sensitive`, `started`, `accepted`, `learning-complete`, then stage lines of the form `- [ ] qa | agent: qa-test-engineer | evidence:`. No real ledger exists yet [verified: record, own run].
- **Check.** `scripts/check-feature-ledger.mjs`. The function `checkLedger(file, runs)` returns a list of problems. [implemented] It has only ever run against synthetic ledgers; today's real run printed `0 ledger(s) checked, 0 with problems.` [verified: record, own run].

**What the check proves when it passes** [implemented, `checkLedger`]:

1. Every ticked stage has some text after `evidence:`.
2. For each agent named on a ticked stage, the log has at least one record with that agent name and a `time` on or after the ledger's `started` date. The test is `runs.some((run) => run.agent === agent && Date.parse(run.time) >= started)`.
3. If `accepted: yes`, every stage in `REQUIRED[tier]` is ticked, plus `design-spec` and `visual-review` when `ui: yes`, plus `security` when `security-sensitive: yes`.
4. If `learning-complete: yes`, `sage-after` and `understanding-check` are ticked.

**What it cannot prove.**

| Limit | Why | Status |
|---|---|---|
| That the run was for this feature | Rule 2 matches on agent name and date only. Nothing links a record to a ledger. | [implemented]. Made concrete today: the nine probe records are dated 2026-10-11, so a ledger with `started: 2026-10-11` could tick every specialist stage and pass on probes alone [record D9; inference from the code, not executed]. |
| That the work was any good | The script's own header says so. | [implemented] |
| That the evidence exists | Any non-empty text passes. The script never opens the path. | [review R16a; static analysis, not executed] |
| A specialist the owner started directly | No `SubagentStop`, no record. The nine direct role probes left none. | [verified: record O5]. Separately, the QA session that wrote today's validation record also left no log line [verified: review R20; I read the log and it still holds only the nine 06:41 records]. How that QA session was started is not established, so the reason for its missing record is [unverified]. |
| That the record is genuine | `.gitignore` line 26 ignores `.claude/logs/`, so the log has no history, and any of the four unrestricted-Bash roles could append a line with a shell command. | `.gitignore` line [implemented, I read it]. The forgery [review R3; static analysis, not executed]. |
| That a security review was needed | `security-sensitive` is typed into the ledger by hand. `no` skips the `security` stage. | [review R16b; static analysis, not executed] |
| Anything, for `tier: trivial` | `if (tier === 'trivial') return problems;` returns before every check. | [implemented]. Consequence noted in [review R6]. |
| Documentation-only work | Both `REQUIRED.substantial` and `REQUIRED.small` include `implementation` and `qa`. A design phase with no code cannot be accepted without a false tick. | [review R6; static analysis, not executed]. This bears directly on the SRE and DevOps architecture phase. |

**Why deleting the log is worse than leaving probe records in it.**

Follow the function `readRuns()` for three states of the file:

| State of `.claude/logs/agent-runs.jsonl` | `readRuns()` returns | Effect inside `checkLedger` |
|---|---|---|
| Nine probe records (today) | an array of nine | Rule 2 runs. It is too easy to satisfy, but it runs. |
| Empty file (truncated) | `[]`, because `''.split('\n').filter(Boolean)` is empty | Rule 2 runs and **fails every ticked specialist stage** until a real run is logged. This is the strict state. |
| File missing (deleted) | `null`, from `if (!existsSync(logPath)) return null;` | The line `if (agent === 'owner' \|\| runs === null \|\| Number.isNaN(started)) continue;` skips rule 2 for every agent. The script prints one `Note:` line and can still exit 0. |

So: probe records make the check too generous, an empty file makes it strict, and a missing file switches it off. The record's D9 says "clear the log", which a reader could carry out by deleting it. The review corrects this: truncate to an empty file, done by the owner, never delete [review R2]. The three-row table above is my reading of the code [implemented]; the delete scenario itself was [static analysis, not executed].

As of my reading today, `docs/testing/setup-validation.md` still carries the original D9 wording. `.claude/` belongs to nobody, so emptying the log is the owner's action alone.

## 6. Three kinds of evidence: the harness, a tool's message, a model's word

**Plain language.** Ask "who is telling me this, and could they be wrong without knowing it?"

| Kind | Who is speaking | Can a model be mistaken about it? | Example from today |
|---|---|---|---|
| **Harness record** | The runtime that hosts the agents | No. It is produced outside the model. | The `permission_denials` field of the `devops-sre` session's JSON result listed exactly the nine refused commands [evidence section 5]. Also: the `init` record giving the reviewer `Read, Bash`. |
| **Tool message** | A tool or hook, replying to a real call | The text is machine-made, but a model copied it into its report. | `path-guard: sage does not own .claude/_probe-sage.txt. ...` [evidence, SAGE probe]. Trustworthy here because it matches the string in `path-guard.mjs` character for character. |
| **Self-report** | The model, describing itself or its conclusions | Yes, and it happened. | `da-vinci` listed its tools, then disclosed its first list was wrong and had left out five Figma tools [evidence, da-vinci probe step 2]. |

Two more self-reports from today that deserve a second look:

- The `devops-sre` agent concluded Bash was "broadly gated after the first call". The record disagrees and shows the refusals line up with the `ask` and `deny` patterns. The reviewer then notes the record's own correction rests on a single unmatched command [review R14]. Three parties, one data set, and the honest position is "one more trial needed".
- "The orchestrating VS Code session reports itself as Opus 5.5" sits in the evidence next to rows backed by `modelUsage`. It is a self-report [record O7; unverified].

Two rules the record applies, worth adopting as habits:

1. A step an agent declined produced **no evidence of any kind**. Never a pass.
2. A table column can look observed and be derived. The "Matching rule" column in evidence section 5 came from reading `.claude/settings.json`, because the refusal messages do not name the rule that fired [record O2].

The record uses a fourth grade above these, "own run": a command the author ran with the output in front of them. The same idea applies to you. The strongest evidence you will ever have is a command you ran yourself.

## 7. Why the default model failed, and what the `opus` alias tells you

**Plain language.** Two separate things went wrong or sideways, and they are easy to mix up.

**First: the default.** If you do not say which model to use, Claude Code uses your account's default. On this account that is Fable 5, and the run returned `Fable 5 requires usage credits. Run /usage-credits to continue or switch models with /model.` [verified: evidence section 2]. It is a billing condition on that model for this account, not a bug in the project.

The project does nothing to prevent it. `.claude/settings.json` has three top-level keys, `agent`, `permissions` and `hooks`, and no model setting. None of the ten agent files has a `model:` line. [implemented: I read the settings file and searched the agent files.] So every `claude -p` command that omits `--model` fails before doing any work [record D3]. Whether to pin a model in settings is the owner's decision [proposed].

**Second: the alias.** `opus` is a nickname, an alias. The software translates it into a full model ID at the moment you run the command.

| Asked for | Got | Source |
|---|---|---|
| `--model opus` | billed as `claude-opus-5` | `modelUsage` field, harness record [verified: evidence section 2] |
| `--model sonnet` | billed as `claude-sonnet-5` | same |
| `--model claude-opus-5-5` | `API Error: 400 Claude Code 2.1.231 does not support this model; version 2.1.280` (the capture cut the message at 80 characters) | tool message [verified: evidence section 2] |

What this means:

1. **An alias is not a version.** "We ran on Opus" does not say which Opus. The only reliable statement of the model is the `modelUsage` field of a finished run.
2. **The installed command-line tool caps what you can reach.** Version 2.1.231 refused `claude-opus-5-5`. The cut-off message mentions 2.1.280; reading that as "upgrade to 2.1.280 and it works" is an [inference] nobody tested.
3. **The orchestrator and the specialists may not be on the same model.** Command-line specialists demonstrably ran on `claude-opus-5`. The orchestrating session says it is Opus 5.5, which is a self-report [unverified]. If both are true, the session judging the work is on a different model from the workers, including the Independent Reviewer [record D4]. This matters for how much weight a review carries, and it is not settled.
4. **Only four sessions have a harness model reading.** "Every agent session used `--model opus`" is the orchestrating session's account of its own commands, not a per-session reading [review R19].

## 8. Fail open and fail closed

**Plain language.** When a lock breaks, does the door stay shut or swing open? A fire exit should fail open: if the lock dies, people must get out. A bank vault should fail closed. Neither is right everywhere. The mistake is not knowing which one you built.

**Technical terms.** A control **fails closed** if an error inside it leads to a refusal. It **fails open** if an error leads to permission.

**In this repository** [implemented, read in both hook files]:

```
let input;
try {
  input = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0);
}
```

This block appears in `path-guard.mjs` and `secret-guard.mjs`. If the guard cannot understand what it was sent, it exits 0, and 0 means "allow". Both guards block only through `block()`, which exits 2.

The review's finding [R9]:

- Unreadable input: exit 0, allowed. [implemented]
- Any other crash inside the guard: Node exits with a non-zero code that is not 2. The reviewer states that only exit 2 blocks, so the call proceeds. [review R9; I did not verify the harness's handling of other exit codes]
- A concrete crash: `agent in OWNED` on line 64 of `path-guard.mjs` also finds names inherited by every JavaScript object, such as `constructor`. For an agent with that name the check passes, then `OWNED['constructor'].some(...)` throws. It needs an agent literally named `constructor`, so the practical risk is low. [review R9; static analysis, not executed]
- The real worry is ordinary breakage: a wrong `CLAUDE_PROJECT_DIR`, a Node upgrade, a typo in a future edit. Every write and every Bash call would then be allowed, and nothing would announce that the guards are down. [review R9; inference]

The reviewer's proposed fix: `Object.hasOwn(OWNED, agent)`, wrap the body so any unexpected error exits 2, and add a test that malformed input is blocked [proposed; nothing changed].

The same idea shows up in three other places. Recognising the pattern is the skill:

| Place | Behaviour | Open or closed |
|---|---|---|
| `path-guard.mjs` line 64, no `agent_type` | exit 0 | Open, on purpose: the owner's own plain session is not restricted |
| `log-agent-run.mjs`, write error | prints a message, exit 0 | Open, sensible for a logger: a logging failure should not stop work. The cost is a missing record. |
| `check-feature-ledger.mjs`, missing log | `readRuns()` returns `null`, cross-check skipped | Open. This is concept 5's delete problem, and the reviewer proposes making a missing log a failure [review R2; proposed] |
| `ask` rule in a `-p` session | refusal | Closed. Safe, and it will block an already-approved install or merge with no way to reach the owner [record D12; verified for five commands] |

The question to ask of any control before relying on it: "If this breaks tonight, will I find out because work stops, or will I not find out at all?"
