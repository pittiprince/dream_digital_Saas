# Proposal B: Security hardening plan for the engineering organization

> Superseded by `security-hardening-plan-rev3-2026-10-12.md` on 2026-10-12. Kept as history; not updated further.

Date: 2026-10-11. Author: Chief Engineer (orchestrating session). Status: **proposal, nothing here is approved or applied.**

**Revision 2, same day.** Revised after the Security Engineer's review (`docs/security/proposals-security-review-2026-10-11.md`, ids N- and SA-) and QA's test plan (`docs/testing/hardening-test-plan-2026-10-11.md`). They found errors in the first draft: a proposed fix that opened a hole (H-08), a claim that was false as written (H-14), an allowlist that re-opened what it closed (H-01), and seven weaknesses nobody had raised (now H-31 to H-38). Corrections are made in place and marked "Rev 2". Section 7 records which reviews this text has and has not had.

Every change below touches `.claude/`, `scripts/`, `CLAUDE.md` or user-level settings and needs the owner's explicit approval before anyone implements it. No file under `.claude/` or `scripts/` was modified to write this plan, and the run log was not edited.

Sources: the validation record `docs/testing/setup-validation.md`, the evidence in `docs/testing/evidence/`, the Independent Reviewer's report `docs/status/foundation-validation-review-2026-10-11.md` (findings R1 to R20), and the code as read on 2026-10-11. Line numbers refer to the files as they are today.

Evidence grades used: **observed** (a tool message or harness record exists), **static** (read from the code, never executed), **unverified** (not tested either way).

## 1. The central problem

Two different kinds of control are in use, and only one of them is reliable.

- **Matching the text of a command.** The permission rules in `.claude/settings.json` and the Bash branch of both hooks look at the command string. A command can do the same thing under a different spelling (`rm -r` instead of `rm -rf`), so every such rule has an evasion. Claude Code's own documentation says a Bash rule "isn't a security boundary".
- **Enforcing on the filesystem.** The operating system refuses the write no matter how the command is spelled. Claude Code's Bash sandbox does this (Seatbelt on macOS) and applies to child processes. It is set per project, not per agent, and it does not cover the Read, Edit and Write tools or hooks.

The plan therefore uses three layers, in this order of trust:

1. **Remove the capability.** A role that has no general shell cannot misuse it. Every role that holds Bash gets a default-deny allowlist (H-01).
2. **Enforce on the filesystem** for the paths that must never be written from a shell: the sandbox (H-02).
3. **Detect afterwards.** After each agent run, compare what changed with what that agent owns (H-03).

Command-text rules stay as a fourth, weakest layer, useful for forcing a prompt in an owner-attended session.

**What the three layers still do not cover (Rev 2, from the Security review).** This is a direction, not a finished design.

- The Read, Edit and Write tools are outside the sandbox. They rest on hooks, which are scripts in the same tree they guard.
- A session with no agent type, and any agent type the guard does not know, is unrestricted today (H-31, H-32).
- Settings files that outrank the project file can undo any of it (H-34).
- Connector tools are outside the hooks, the sandbox and the run log (H-29).
- For the four building roles, layer 1 narrows the shell but does not remove it: `pnpm test` runs code those roles can write (H-01).
- The threat model must include prompt injection: an agent that reads a hostile file or web page may stop being cooperative. The first draft assumed cooperative agents only.

## 2. Priorities

- **Wave 0, verification only.** No configuration change. Closes the unverified items. Can run now.
- **Wave 1, prerequisites.** Must be approved, implemented and verified before any agent with a shell does real work: scaffold, install, CI, infrastructure or product code.
- **Wave 2, later improvements.** Before the first feature that needs them, as stated per item.

**The SRE phase and Wave 1 (Rev 2).** The first draft said the documentation-only phase needs none of Wave 1 "provided the working rules are followed". The Security Engineer called that circular, correctly: a rule nobody enforces is not a control. The phase can still start before Wave 1, because one control needs no configuration change: `devops-sre` sessions are launched with the shell removed. Observed on 2026-10-11: `claude -p --model opus --agent devops-sre --disallowedTools Bash` was given exactly Read, Grep, Glob, Write and Edit by the harness. The other preconditions are an owner-made baseline commit (so edits to existing files are detectable) and the tracking decision in section 4. H-13 (design tier) should land before the phase is accepted.

| Wave | Findings |
|---|---|
| 0 | H-17 (probe), H-18, H-20, H-21, H-22, H-23, H-27, H-28, H-30 |
| 1 | H-01, H-02, H-03, H-04, H-05, H-06, H-07, H-08, H-09, H-10, H-11, H-12, H-13, H-14, H-15, H-16, H-24, H-29, H-31, H-32, H-33, H-34, H-35, H-36, H-37, H-38 |
| 2 | H-17 (any change), H-19, H-25, H-26, H-27 (any change) |

Implementation order inside Wave 1, because later items rely on earlier ones (Rev 2):

1. The Wave 0 owner checklist (H-22, H-23) first: it settles whether the main session is fenced, which decides how H-31 and H-32 are designed.
2. H-12 (test-suite repairs, including checking the guard's message and not only its exit code), then H-31, H-32 and H-08 together (unknown and missing agent types, guards fail closed).
3. H-06, H-07 (secret guard).
4. H-02 (sandbox), verified **before** H-01, because once the allowlist exists it refuses the probe before the sandbox is reached.
5. H-16, H-15, H-01, H-04, H-36 (protected prefixes, links, shell allowlists, protected manifests, the audit-fix gap), then H-03 (ownership audit).
6. H-09, H-10, H-11, H-13, H-14, H-33, H-37 (run log and ledger), together, because they change one script and one hook.
7. H-24, H-29, H-34, H-35, H-38.

One open question blocks step 5: after H-01 no agent can run the guard suite, though every step says to run it. Either the owner runs it, or one role's allowlist names exactly `node scripts/test-guards.mjs`. And QA cannot write to `scripts/`, so whoever applies new test cases does so at the owner's direction.

Each step follows the same procedure: write the failing test first, apply the change, run `node scripts/test-guards.mjs`, have the Independent Reviewer read the diff, then the owner approves.

## 3. Findings register

Each entry gives: severity and why; the affected location; the proposed change; abuse cases and regressions; tests before and after; wave; reviewer and approval; and how to verify safely.

### Guard and path enforcement

**H-01. Bash bypasses path ownership for four roles.** (record D8, reviewer R5)
- Severity: **High.** `frontend-engineer`, `backend-data-engineer`, `qa-test-engineer` and `devops-sre` can write, move or delete any file through the shell. Observed: four plain `rm` commands ran with no guard message.
- Location: `.claude/hooks/path-guard.mjs:45-49` (`BASH_ALLOW` has entries for three roles only) and `:68` (`if (!allow) process.exit(0)`).
- Proposed change: give all four roles a `BASH_ALLOW` entry, so every agent shell is default-deny. Rev 2: the first draft's list included `pnpm exec <tool> ...`, which QA and Security showed re-opens the hole (`pnpm exec prettier --write CLAUDE.md`, `eslint --fix`, `tsc --outDir docs/status`, `playwright install`). The starting list is now narrower: read-only git (existing `READ_ONLY_GIT`, less `git diff --no-index`, see H-35); `node --version`, `pnpm --version`; and a fixed set of named scripts with no extra arguments, such as `pnpm --filter <own workspace> run <lint|typecheck|test|build>`. No `pnpm exec`, no `rm`, `mv`, `cp`, `ln`, redirection, install or network command for any agent. File removal is requested through the Chief Engineer and done by the owner. For a documentation-only phase, the role is launched with no shell at all.
- Abuse and regressions: a named script still executes whatever `package.json`, the test files and the tool configs say, and the building roles can write those. So for these four roles the allowlist narrows the shell and does not remove the capability; H-02, H-03 and H-04 are what limit the damage, and none of them confines a role to its own lane. This residual risk is accepted or not by the owner. Regression: legitimate build steps get blocked until listed; expect to tune the list during the first real feature. The four roles also have no content search until H-25 is decided, because the harness withholds Grep and Glob from any role that holds Bash.
- Tests: before, add cases that currently pass as ALLOW and should become BLOCK (`rm -r apps` and `mv docs docs.old` for each of the four roles). After, those cases report BLOCK and the build commands report ALLOW.
- Wave: 1.
- Reviewer and approval: Security Engineer and Independent Reviewer; owner approves.
- Safe verification: `node scripts/test-guards.mjs` uses synthetic input only. Live check: ask one role to run `touch _probe.txt` and expect the guard message; nothing is deleted.

**H-02. No filesystem-level enforcement exists.** (reviewer R3, R5, R10, R11)
- Severity: **High.** Everything today rests on text matching.
- Location: `.claude/settings.json` has no `sandbox` block.
- Proposed change: enable the Bash sandbox for the project: `sandbox.enabled: true`, `sandbox.allowUnsandboxedCommands: false`, and `sandbox.filesystem.denyWrite` for `.claude/`, `scripts/`, `.github/` and the run-log location. Per the documentation the sandbox already write-protects `.claude` settings, agents and hooks, and hooks run outside it, so the logging hook can still write the log. All of this must be confirmed on CLI 2.1.231 before relying on it; some sandbox keys state a minimum version.
- Abuse and regressions: the sandbox is project-wide, not per agent, so it cannot express "frontend may write only `apps/web/`". It can protect the shared, sensitive paths. Regression: tools that need to write outside the project, or that need the network (package installs), will fail inside the sandbox; installs then become an owner action, which is the intent.
- Rev 2 additions from the Security review: the four paths are too few. The deny list should also cover `CLAUDE.md`, every `package.json` and lockfile, `.git/` internals and `.vscode/`; a `denyRead` list for credential locations outside the project (see H-35); and a stated network policy. None of this confines a role to its own lane.
- Tests: before, a shell command writing a harmless file into a protected folder succeeds today for an unrestricted role (static; not executed). After, the same command fails with an operating-system error.
- Wave: 1, verified before H-01 is applied.
- Reviewer and approval: Security Engineer; owner approves.
- Safe verification: Rev 2. The first draft's probe (`touch scripts/_probe.txt`) would create a file in a protected folder if the control were broken, and would be refused by the allowlist, not the sandbox, once H-01 exists. Use QA's procedure L-02 in the test plan instead, run before H-01.

**H-03. Nothing detects an out-of-lane change after the fact.**
- Severity: **Medium.** If prevention fails, nobody is told.
- Location: `.claude/settings.json:64-73` (the only `SubagentStop` hook logs the run and checks nothing).
- Proposed change: a new hook script, run on `SubagentStop`, that lists changed files with `git status --porcelain --untracked-files=all`, compares them with a snapshot taken at `SubagentStart`, and reports any path the agent does not own. It appends the violation to the run record and returns it to the Chief Engineer. Detection only; it does not revert.
- Abuse and regressions: needs at least one commit to be precise; git-ignored files are invisible to it. Two agents running at once would be confused with each other, which is one more reason to keep writers sequential.
- Tests: before, none. After, synthetic cases: owned change reports clean; unowned change reports a violation naming the path.
- Wave: 1.
- Reviewer and approval: Independent Reviewer; owner approves.
- Safe verification: script tests with a temporary git repository.

**H-04. Dependency installs and manifest edits escape the approval gate.** (reviewer R4)
- Severity: **High.** `CLAUDE.md` gate 2 requires approval for new dependencies. Observed rules cover only two spellings.
- Location: `.claude/settings.json:27-28` (`Bash(pnpm add *)`, `Bash(npm install *)`); `.claude/hooks/path-guard.mjs:32` (`devops-sre` owns `package.json` and `.npmrc`) and `:26` (`.github/`).
- Proposed change, three parts:
  1. With H-01, no agent can run any install command, whatever its spelling.
  2. Widen the `ask` list for owner-attended sessions: `pnpm install*`, `pnpm i *`, `pnpm add*`, `pnpm up*`, `pnpm dlx *`, `npm i*`, `npm ci*`, `npx *`, `yarn *`, `bun *`, `corepack *`.
  3. In `path-guard.mjs`, make writes to manifests and delivery config a prompt instead of a silent allow: any `package.json`, any lockfile, `.npmrc`, `pnpm-workspace.yaml`, `.github/**`, `Dockerfile*`, `deploy/**`. The hook returns the `ask` decision, so the owner sees the exact file before it changes. In a non-interactive session an `ask` becomes a refusal, which is the safe direction.
- Abuse and regressions: a dependency can still arrive through an approved `package.json` edit followed by an owner-run install; that is the intended path. Regression: `devops-sre` loses silent write access to files its agent file says it owns; `devops-sre.md` and `CLAUDE.md` would need the wording "with owner confirmation".
- Tests: before, add `pnpm install` for `devops-sre` (today ALLOW; `scripts/test-guards.mjs:81` tests it only for `security-engineer`). After, BLOCK; and a write to `package.json` returns the ask decision.
- Wave: 1.
- Reviewer and approval: Security Engineer; owner approves.
- Safe verification: synthetic tests; live check with `pnpm add --help`, which installs nothing.

**H-05. Destructive commands are covered by one spelling.** (reviewer R5)
- Severity: **High** for agents until H-01 lands, then **Low**.
- Location: `.claude/settings.json:19` (`Bash(rm -rf *)` is the only `rm` rule).
- Proposed change: H-01 removes file-removing commands from every agent. For owner-attended sessions add `ask` rules for `rm *`, `mv *`, `git rm *`, `find * -delete*`, `find * -exec *`, `truncate *`, `dd *`, `git checkout -- *`, `git restore *`, `git stash drop*`. Keep the existing denies.
- Abuse and regressions: text rules remain evadable (`/bin/rm`, a script, an interpreter). They are a prompt, not a wall. Regression: more prompts in the owner's own session.
- Tests: Wave 0 live probe with harmless variants, as on 2026-10-11, extended to the new patterns.
- Wave: 1.
- Reviewer and approval: Security Engineer; owner approves.
- Safe verification: only help flags, dry runs and paths that do not exist, in the same shape as the trial recorded in `docs/testing/evidence/foundation-validation-2026-10-11-addendum.md`.

**H-15. Write ownership can be redirected through a symbolic link.** (reviewer R10; static)
- Severity: **Medium.** Needs a shell to create the link, which H-01 removes.
- Location: `.claude/hooks/path-guard.mjs:81` (`path.resolve` does not follow links).
- Proposed change: resolve the nearest existing parent directory with `realpathSync` before computing `relative`; block if the real path leaves the owned area.
- Abuse and regressions: a legitimate link inside the repo (none exists today) would be judged by its target.
- Tests: add a case with a temporary directory containing a link out of the owned path; expect BLOCK.
- Wave: 1 (Rev 2; was 2). The Security Engineer points out that a pnpm workspace creates links under `node_modules/` with no agent shell involved, so a write through such a link could land in another role's package.
- Reviewer and approval: Independent Reviewer; owner approves.
- Safe verification: temporary-directory test only.

**H-16. Two roles' filename patterns reach into protected folders.** (reviewer R11; SAGE's note on `Dockerfile`; static)
- Severity: **Medium.** `CLAUDE.md` says nobody owns `.claude/` or `scripts/`.
- Location: `.claude/hooks/path-guard.mjs:21-23` (QA patterns match at any depth) and `:29-30` (`Dockerfile` and compose patterns match at any depth, including under `apps/`).
- Proposed change: a single protected-prefix check ahead of the ownership test: any path under `.claude/` or `scripts/` is blocked for every named agent. Decide and document whether `devops-sre` may write `apps/*/Dockerfile`; today the code allows it and the agent file says it does not write in `apps/`.
- Abuse and regressions: none expected for the protected-prefix check.
- Rev 2: rated **High** by the Security Engineer, because files placed under `.claude/rules/` or `.claude/agents/` may be loaded as instructions (whether nested folders load is to be confirmed). The prefix check must compare case-insensitively, and must also refuse a nested `CLAUDE.md` or `.claude/` folder inside a role's own lane. H-10 depends on this item.
- Tests: add `qa-test-engineer` writing `.claude/__tests__/x.mjs` and `devops-sre` writing `.claude/Dockerfile.x`; expect BLOCK. Add a case variant and a nested `apps/web/CLAUDE.md`.
- Wave: 1 (Rev 2; was 2).
- Reviewer and approval: Independent Reviewer; owner approves.
- Safe verification: synthetic tests.

### Secret protection

**H-06. Secret filename matching is case-sensitive and glob-blind.** (reviewer R7; static)
- Severity: **High.** On a case-insensitive disk, `.ENV` names the same file as `.env`. Whether this volume is case-insensitive and how the `Read(.env)` deny rule treats case are both unverified.
- Location: `.claude/hooks/secret-guard.mjs:9-14` (`isSecretName`), `:31` (word splitting for Bash).
- Proposed change: lower-case the basename before testing; strip glob characters (`*?[]{}`) and quote characters before testing; treat any shell word containing `.env` followed by a glob character as a hit.
- Abuse and regressions: a shell can still build a name from pieces or read through a variable; the Bash branch stays best-effort, and H-01 is the real control. Rev 2 corrections: `Example.Key` is already blocked today (line 12 has the `i` flag), so that is not a regression. A real one: lower-casing makes `.env.EXAMPLE` allowed where it is blocked today; on a case-insensitive disk that is the same file as `.env.example`, so it is acceptable, and it gets a test that pins it. Still open after the change, per QA: `.envrc`, `prod.env`, `cat .e?v`, `cat {.env,x}`, and a `Grep` call with `glob: ".env*"`. The change list must add `*.env` and `.envrc` names and treat `?`, braces and brackets as glob characters.
- Tests: before, add `.ENV`, `.Env.Production`, `cat .en''v`, `cat .e?v`, `cat {.env,x}`, `prod.env`, `.envrc` and a `Grep` with `glob: ".env*"` as BLOCK cases (QA predicts they fail today; `cat .env.*` is already blocked). After, all pass.
- Wave: 1.
- Reviewer and approval: Security Engineer; owner approves.
- Safe verification: synthetic tests. A live check needs a dummy file the owner creates by hand containing only the text `DUMMY_NOT_A_SECRET`.

**H-07. Several key and credential formats are covered nowhere.** (reviewer R8; static)
- Severity: **Medium**, rising when payments, storage and hosting are chosen.
- Location: `.claude/hooks/secret-guard.mjs:12`; `.claude/settings.json:5-12`; `.gitignore:12-18`.
- Proposed change: add `.p8`, `.ppk`, `.jks`, `.keystore`, `.netrc`, `.pgpass` and `*service-account*.json` to all three lists in one pass. Treat `.npmrc` separately: a project `.npmrc` normally holds settings and is edited by `devops-sre`, while the user-level one can hold a registry token. Proposed rule: deny reads of `~/.npmrc`, `~/.netrc`, `~/.ssh/**`, `~/.aws/**` and `~/.config/gh/**`; and state in `.claude/rules/security.md` that a token never goes in the project `.npmrc`.
- Abuse and regressions: over-matching ordinary `.json` files; keep the service-account pattern narrow.
- Tests: add one BLOCK case per new extension and an ALLOW case for an ordinary `.json`.
- Wave: 1.
- Reviewer and approval: Security Engineer; owner approves.
- Safe verification: synthetic tests.

**H-08. Both guards allow the action when they fail.** (reviewer R9; static)
- Severity: **High.** A guard that crashes for any reason stops guarding, silently. How the harness treats a hook exit code other than 0 or 2 is unverified.
- Location: `.claude/hooks/path-guard.mjs:57-61` and `:64` (`agent in OWNED` consults inherited properties); `.claude/hooks/secret-guard.mjs:21-26`.
- Proposed change: wrap each hook body in one `try`/`catch` that blocks with exit code 2 and a clear message on any unexpected error, including unparseable input. Replace `agent in OWNED` with `Object.hasOwn(OWNED, agent)`. The same substitution applies at `scripts/check-feature-ledger.mjs:55` and `:65`.
- Abuse and regressions: a bug in a guard now blocks every tool call in every session, including the owner's. Mitigations: the test suite must pass before any guard change is accepted; and the owner needs a documented recovery path. `claude --help` on 2.1.231 lists a `--safe-mode` option that starts with customizations disabled; whether it disables project hooks must be confirmed before this change ships.
- Rev 2 correction. The first draft's own test was wrong: with `Object.hasOwn`, an agent named `constructor` becomes an unknown agent, and line 64 lets unknown agents through with exit 0, so one input that is blocked today would become allowed. The substitution is only safe together with H-31 (unknown agent types are denied by default). Also: a `try`/`catch` inside the script cannot catch a syntax error, a missing `node` or a hook timeout, so how the harness treats those must be tested, not assumed; and once guards exit 2 on any error, a test suite that checks only the exit code passes every BLOCK case for the wrong reason. H-12 must make the suite check the guard's message.
- Tests: before, add "malformed input is blocked" (fails today) and "unknown agent type is blocked" (fails today). After, both pass, and every BLOCK case asserts the expected message prefix.
- Wave: 1, with H-31 and after H-12.
- Reviewer and approval: Security Engineer and Independent Reviewer; owner approves.
- Safe verification: synthetic tests only.

**H-17. Content search can return lines from a secret file.** (reviewer R12; QA disputes it as untested)
- Severity: **Medium, unverified.** `Grep` over a directory is not checked for what the directory contains. Whether the search tool skips git-ignored files is untested.
- Location: `.claude/hooks/secret-guard.mjs:37-45`; the `deny` list at `.claude/settings.json:5-12` names `Read` only.
- Proposed change: first test it (Wave 0 style, with the owner's dummy file). If lines are returned, have the guard refuse a content-mode search over a directory that contains a secret-named file, or add `Grep` deny rules if the rule syntax supports them.
- Abuse and regressions: directory scans cost time on every search.
- Tests: the dummy-file probe decides whether a change is needed.
- Wave: 2, after the probe.
- Reviewer and approval: Security Engineer; owner approves.
- Safe verification: dummy file with a marker string, never a real secret.

**H-18. Secret protection was not observed for every role.**
- Severity: **Low.** The controls apply to every session and role by construction (`.claude/settings.json:44-53` runs the guard for seven named tools: Read, Edit, Write, NotebookEdit, Grep, Glob and Bash; connector tools are not among them, see H-29), so this is an evidence gap, not a known hole. `backend-data-engineer` and `independent-reviewer` declined the attempt; the hook's file-tool branch has never fired live because the permission rule answers first.
- Location: evidence only.
- Proposed change: none to code. Repeat the probe for the two roles.
- Tests: Wave 0 probe.
- Wave: 0 work, listed here for completeness; see H-21.
- Reviewer and approval: QA records; no approval needed beyond permission to run probes.
- Safe verification: the path does not need to exist for the refusal to show.

### Evidence integrity

**H-09. Direct agent sessions leave no run record.** (record D10, reviewer R20)
- Severity: **Medium.** The session that wrote the validation record is absent from the log while five-second probes are present.
- Location: `.claude/settings.json:64-73` (only `SubagentStop` is hooked); `.claude/hooks/log-agent-run.mjs:14`.
- Proposed change: also register the logging hook on a session-level event (`SessionEnd`, to be confirmed on 2.1.231) and record `kind: "direct"` when `agent_type` is present on a main session, `kind: "subagent"` otherwise.
- Abuse and regressions: a session that crashes may not fire the event.
- Tests: synthetic payloads for both kinds.
- Wave: 1.
- Reviewer and approval: Independent Reviewer; owner approves.
- Safe verification: one `claude -p --model opus --agent sage "Reply ok"` session, then read the log.

**H-10. A run record can be fabricated from a shell.** (reviewer R3; static)
- Severity: **High.** The log is the one artifact meant to come from the harness, it is git-ignored (`.gitignore:26`), and any role with an open shell can append a line.
- Location: `.claude/hooks/log-agent-run.mjs:26`; `.gitignore:26`.
- Proposed change: H-01 removes redirection from every agent shell; H-02 write-protects the log location from all shell commands. In addition, state in `CLAUDE.md` that the run log is corroboration and never the only evidence for a stage. A cryptographic signature is not proposed: an agent that can read the hook can read any key the hook uses.
- Abuse and regressions: the file tools are not covered by the sandbox, so `path-guard.mjs` must also block Write and Edit on the log path for every agent (covered by the protected-prefix check in H-16, since the log lives under `.claude/`).
- Tests: synthetic BLOCK cases for Write to the log path and for a shell append.
- Wave: 1.
- Reviewer and approval: Security Engineer; owner approves.
- Safe verification: synthetic tests; a live attempt would append a clearly marked probe line and must not be run without the owner saying so.

**H-11. A missing run log switches the cross-check off.** (reviewer R2; static, confirmed by QA's reading)
- Severity: **High.** Deleting the file turns "fails without a run" into "passes with a note".
- Location: `scripts/check-feature-ledger.mjs:27` (`readRuns` returns `null`), `:76` (the check is skipped when `runs === null`), `:104` (a note is printed and the exit code is unaffected).
- Proposed change: when the log is missing and any ledger has a ticked stage naming an agent, report a problem and exit 1. Rev 2: the `--no-run-log` flag proposed in the first draft is withdrawn (see H-33).
- Abuse and regressions: the first run on a fresh clone has no log; with no ticked stages that still passes.
- Tests: before, add "ticked agent stage with a missing log fails" (fails today). After, passes.
- Wave: 1.
- Reviewer and approval: Independent Reviewer; owner approves.
- Safe verification: test fixtures in a temporary directory; the real log is never touched.

**H-14. Probe records can satisfy a real ledger.** (record D9)
- Severity: **Medium.** Nine records from 06:41 UTC on 2026-10-11 came from a delegation probe. The check asks only "did this agent run since the start date" (`scripts/check-feature-ledger.mjs:77`).
- Location: `scripts/check-feature-ledger.mjs:24` (`STAGE_LINE`) and `:77`.
- Proposed change: bind each ticked stage to a specific run. The stage line gains a `run:` field holding the `agentId` the harness recorded. Rev 2: the first draft required only that the id exist with the same agent name, and the Security Engineer showed that citing a probe's id would satisfy that. The check must also require that the run's time is on or after the ledger's `started` date, that the id is not null, and that no id is used by more than one stage. Even then it proves only that a run by that agent ended, not what it did. No historical record needs deleting. Section 4 gives the interim rule.
- Abuse and regressions: the Chief Engineer must copy the id from each delegation result; older ledgers (none exist) would need the field.
- Tests: before, "ticked stage citing an unknown run id fails". After, passes.
- Wave: 1.
- Reviewer and approval: Independent Reviewer; owner approves.
- Safe verification: temporary fixtures.

**H-13. No ledger tier fits documentation or design work.** (reviewer R6)
- Severity: **Medium**, and it blocks honest acceptance of the SRE phase.
- Location: `scripts/check-feature-ledger.mjs:20-23` (`REQUIRED`), `:64` (`trivial` returns before any check), `:65`; `docs/status/features/_TEMPLATE.md:4`; `.claude/skills/feature-workflow/SKILL.md:14-16`.
- Proposed change: see section 4.
- Wave: 1, before the SRE phase is accepted.
- Reviewer and approval: Independent Reviewer; owner approves.

**H-19. Three further ledger weaknesses.** (reviewer R16; static)
- Severity: **Medium.**
- Location: `scripts/check-feature-ledger.mjs:74` (any non-empty evidence text passes), `:84-85` (`ui` and `security-sensitive` are typed in by the Chief Engineer), `:24` (a ticked line in another format is invisible).
- Proposed change: when evidence begins with a repository path, require the file to exist; require a one-line justification field when `security-sensitive: no`; report any `- [x]` line that does not match `STAGE_LINE`.
- Abuse and regressions: free-text evidence such as an owner approval quote must stay legal for `agent: owner`.
- Tests: three new failing cases, then passing.
- Wave: 2.
- Reviewer and approval: Independent Reviewer; owner approves.
- Safe verification: temporary fixtures.

**H-12. The guard test suite has a vacuous case and missing cases.** (reviewer R13)
- Severity: **Medium.** A green suite is being read as more than it shows.
- Location: `scripts/test-guards.mjs:82` (`frontend runs its build` passes because the role has no allowlist at all); no case for `tier: trivial`, a missing log, case variants, or `.claude/` writes by QA and DevOps.
- Proposed change: rename the vacuous case to state the limit it documents, and add a case that pins each known limit so a later change cannot widen it unnoticed. Add the cases named in H-01, H-04, H-06, H-07, H-08, H-11, H-13, H-14 and H-16.
- Abuse and regressions: none; tests only.
- Tests: the suite count rises from 58; record the new count when run.
- Wave: 1, first, with H-08.
- Reviewer and approval: QA authors the cases; Independent Reviewer reads them; owner approves the change to `scripts/`.
- Safe verification: the suite itself.

### Permissions and agent capabilities

**H-20. `ask` rules become refusals in non-interactive sessions.** (record D12; observed)
- Severity: **Low** as a security matter (it fails safe), **Medium** for workflow.
- Location: `.claude/settings.json:21-41`; behaviour of `claude -p`.
- Proposed change: no configuration change. Write the procedure down in the workflow: an approved install, merge or push is run by the owner, or in an owner-attended interactive session where the prompt appears. Delegated agents never run them.
- Abuse and regressions: none.
- Tests: Wave 0, with H-22.
- Wave: 0 (documentation of procedure needs owner approval because it edits the skill).
- Reviewer and approval: owner.
- Safe verification: `pnpm add --help` in an interactive session.

**H-25. Roles that hold Bash get no Grep or Glob.** (record D1 as corrected; observed in harness start-up records)
- Severity: **Medium.** The Chief Engineer, Independent Reviewer and Security Engineer can list files with `git status --porcelain --untracked-files=all` but cannot search file contents. The reviewer also cannot run the guard tests.
- Location: `.claude/agents/*.md:4` (all ten list Grep and Glob); `.claude/hooks/path-guard.mjs:41-49`.
- Proposed change: Rev 2. The first draft proposed adding `grep -rn`, `git grep --no-index` and `ls` to the allowlist. The Security Engineer showed that `grep -rn` and an unscoped `git grep --no-index` search git-ignored files too, which would hand the read-only roles a way to read secret files. Two safer options for the owner to choose between: (a) once there is a commit, allow plain `git grep` on tracked files only, rejecting `--no-index`, `--no-exclude-standard`, `-O` and `--open-files-in-pager`, plus `ls`; or (b) launch the role without a shell when the task needs search and not git, since the harness then grants Grep and Glob (observed for `devops-sre` with `--disallowedTools Bash`). Do not add `find`, `rg` or recursive `grep`. Separately consider letting the reviewer run `node scripts/test-guards.mjs` and `node scripts/check-feature-ledger.mjs`; that means the reviewer executes repository code, which is acceptable only because `scripts/` is a protected path.
- Abuse and regressions: every added command widens the allowlist; each needs its own BLOCK cases for dangerous flags. The secret guard still inspects each word.
- Tests: ALLOW for the three commands; BLOCK for `git grep -O`, for chaining, and for any search naming a secret file.
- Wave: 2, before the first real code review.
- Reviewer and approval: Security Engineer; owner approves.
- Safe verification: synthetic tests; live run of `git grep --no-index -n DreamDigital -- CLAUDE.md`.

**H-21. Outstanding role checks.** (record: unverified items)
- Severity: **Low.** Evidence gaps, not known defects: no live write denial for `software-architect` (it declined to try); no write attempt at all by `independent-reviewer`; secret-read refusal not observed for `backend-data-engineer` and `independent-reviewer`; the reviewer's shell fence not tested against a write-through-shell command at transcript grade.
- Location: evidence only.
- Proposed change: none to code. Re-run four short probes with the instruction that the owner authorises the out-of-lane attempt, capture raw output, QA records it.
- Wave: 0.
- Reviewer and approval: owner's go-ahead to run probes; QA records.
- Safe verification: each probe writes at most one file named `_probe-*.txt`, removed afterwards by the owner.

**H-22. Interactive prompts and the Chief Engineer's tools are unverified.** (record D2)
- Severity: **Medium.** The approval gate assumes the owner sees a prompt and that the Chief Engineer can enter plan mode and ask questions. In non-interactive sessions the harness gave it `Task, Read, Bash, Write, Edit, Skill, TodoWrite` only.
- Location: `.claude/agents/chief-engineer.md:4`.
- Proposed change: none until tested. If the interactive tools are absent in the extension too, the approval gate becomes: the plan is presented in the conversation, the owner types the approval, and the ledger's `plan-approved` line quotes it with the date.
- Tests: an owner-run checklist in a new extension session: ask the session its role; ask it to list its tools; ask it to delegate `pnpm add --help` to `devops-sre` and watch for a prompt; decline once, approve once.
- Wave: 0. Only the owner can run it.
- Reviewer and approval: owner; QA records what the owner reports.
- Safe verification: `pnpm add --help` prints help and installs nothing.

**H-23. A new VS Code session loading the configuration is unverified.** (record D5)
- Severity: **High** (Rev 2; was Medium), because of H-32: if the main session has no agent type, the guard treats it as the owner and the orchestrator is the least fenced identity in the organization. The long-running extension session picked up hooks, the skill and, after a delay, the agents. Nobody has seen a new session start as `chief-engineer` or load `CLAUDE.md`, and nobody has seen the guard fence that main session.
- Location: `.claude/settings.json:2`.
- Proposed change: none until tested; same owner-run checklist as H-22, plus asking the new session to write a file outside `docs/status/` and expecting the guard message.
- Wave: 0.
- Reviewer and approval: owner; QA records.
- Safe verification: the attempted write is one file named `_probe-chief.txt`.

**H-26. QA cannot produce screenshots.** (record D7)
- Severity: **Medium**, blocking for UI work only.
- Location: `.claude/agents/qa-test-engineer.md:4` and `:15`.
- Proposed change: an owner decision among: a browser-automation dependency such as Playwright; a browser connector driven from an interactive session; or screenshots the owner captures by hand and saves under `docs/testing/evidence/`. The first is a new dependency and needs approval and a plan.
- Wave: 2, before the first UI feature.
- Reviewer and approval: Software Architect and DevOps propose; owner approves.
- Safe verification: not applicable until chosen.

### Model and integration configuration

**H-24. The configured default model is unusable.** (record D3, D4; observed)
- Severity: **High** for operability. Any `claude -p` session without `--model` fails with "Fable 5 requires usage credits", and subagents inherit the session model. No agent file sets a model.
- Location: the owner's user-level settings (default model); `.claude/settings.json` has no `model` key; `.claude/agents/*.md` have no `model:` line.
- Proposed change: one of: (a) the owner changes the user-level default; (b) add `"model": "opus"` to `.claude/settings.json`; (c) add `model: opus` to each agent file. Recommended: (b), one line, project-wide. On CLI 2.1.231 the alias resolved to `claude-opus-5`; the CLI rejects `claude-opus-5-5` and names 2.1.280 as the version that supports it. Upgrading the CLI is a separate decision and would require re-running the whole validation.
- Abuse and regressions: a pinned model hides the fact that a stronger one exists; note it in `CLAUDE.md`.
- Tests: `claude -p --agent sage --output-format json "Reply ok"` with no `--model`; read `modelUsage`.
- Wave: 1.
- Reviewer and approval: owner.
- Safe verification: the one-line session above.

**H-27. Figma is not reachable from command-line agents.** (record D6; observed)
- Severity: **Medium**, blocking for UI work only. One `da-vinci` session listed five Figma tools and was refused permission; another held none; the start-up record showed the connector as `pending`. A second Figma server, `plugin:figma:figma`, showed `needs-auth`. The connector answered from the extension's main session. No Figma file is referenced anywhere in the repository.
- Location: `.claude/agents/da-vinci.md:4`; `docs/design/` (holds only `README.md`).
- Proposed change: none to code yet. Keep the existing policy that the repository snapshot is the authority. When the owner supplies a file, test from an interactive extension session whether `da-vinci` as a subagent can read one frame. If it can, add read-only Figma tools to the `allow` list; if not, DA VINCI works from exported references only.
- Wave: 0 for the test, once a file exists; 2 for any change.
- Reviewer and approval: owner supplies the file and approves any rule.
- Safe verification: read-only calls only.

**H-28. Path-scoped rules and the full workflow are unverified.**
- Severity: **Low.** No file exists under `apps/`, so `.claude/rules/frontend.md` and the others have never been seen to load. No feature has run through the 13 steps.
- Location: `.claude/rules/*.md`; `.claude/skills/feature-workflow/SKILL.md`.
- Proposed change: none. Treat the SRE phase as a partial rehearsal of the workflow and the first approved feature as the full one; record in its ledger whether each rule file was seen to load.
- Wave: 0, by observation during the next phases.
- Reviewer and approval: QA records.

**H-29. Connectors and a plugin inject instructions into every agent.** (observed)
- Severity: **High** (Rev 2; was Medium), becoming critical once a live credential or customer data is reachable. Connector tools are outside the hook matcher, the sandbox and the run log, so no guard in this repository sees them. Notion, Lovable, Canva, Gmail, Google Drive, Cloudflare and Claude Docs connectors showed as connected or pending in agent sessions; Lovable can spend workspace credits, which meets gate 4. The `claude-mem` plugin injects instructions naming tools the agents do not hold. Agents ignored all of it in every run observed.
- Location: the owner's account connectors and user-level plugin; nothing in the repository.
- Proposed change: an owner decision: disconnect what this project does not use, or add `deny` rules for the connector tool prefixes that can write or spend.
- Wave: 1 (Rev 2; was 2).
- Reviewer and approval: Security Engineer advises; owner decides.
- Safe verification: read a session start-up record and confirm the tools are absent.

**H-30. Rule-matching behaviour that nobody has tested.**
- Severity: **Low.** How the `Read` deny patterns match (record D11), whether Bash patterns normalise whitespace, and whether `Read(*.pem)` and `Read(*.key)` fire.
- Location: `.claude/settings.json:5-19`.
- Proposed change: none until probed; fold the probes into Wave 0.
- Wave: 0 probes, 2 for any change.
- Reviewer and approval: QA records; owner approves any rule change.
- Safe verification: paths that do not exist.

### Added in revision 2

These came from the Security Engineer's review (N-01 to N-07) and QA's test plan. All are static analysis; none was executed.

**H-31. An agent type the guard does not know is unrestricted.** (Security N-01, QA objection 1)
- Severity: **High.** Built-in types such as `general-purpose` and `Explore`, and any agent file added later, pass straight through.
- Location: `.claude/hooks/path-guard.mjs:64` (`if (!agent || !(agent in OWNED)) process.exit(0)`).
- Proposed change: when `agent_type` is present and not in `OWNED`, block writes and shell by default. The owner decides whether any built-in type gets an explicit, narrow entry.
- Abuse and regressions: a plain session that uses a built-in agent for search would lose its shell; read tools are unaffected.
- Tests: before, "unknown agent type writes a file" and "unknown agent type runs a shell command" are ALLOW today; after, BLOCK.
- Wave: 1, with H-08.
- Reviewer and approval: Security Engineer and Independent Reviewer; owner approves.
- Safe verification: synthetic tests.

**H-32. A session with no agent type is treated as the owner.** (Security N-02)
- Severity: **High.** The guard cannot tell the owner at the keyboard from a session that simply has no agent type, including a nested `claude -p` started by an agent. `scripts/test-guards.mjs:65` pins this as intended behaviour. This session, which orchestrated the validation and these proposals, runs unfenced for that reason.
- Location: `.claude/hooks/path-guard.mjs:63-64`; `.claude/settings.json:2`.
- Proposed change: an owner decision, after the Wave 0 checklist shows what a new extension session reports. Options: (a) fence a session with no agent type as `chief-engineer` by default, with a documented owner override for configuration work; (b) leave it open and accept the risk in writing; (c) refuse `claude` as a command in every agent allowlist so no agent can start a nested session (H-01 already implies this).
- Abuse and regressions: option (a) can lock the owner out of editing `.claude/` unless the override is designed first.
- Tests: depends on the option chosen; QA's plan marks these rows "decision needed".
- Wave: 1, decided first.
- Reviewer and approval: Security Engineer; owner decides.
- Safe verification: the owner checklist, then synthetic tests.

**H-33. The ledger check can be pointed at a different log or ledger folder.** (Security N-03, QA objection 3)
- Severity: **High.** The Chief Engineer owns `docs/status/` and its allowlist admits `node scripts/check-feature-ledger.mjs` with any arguments. Writing a log file there and passing `--log` bypasses H-10, H-11 and H-14, and the output does not say which log was used. The `--no-run-log` flag proposed in the first draft of H-11 had the same shape and is **withdrawn**: no existing fixture needs it.
- Location: `scripts/check-feature-ledger.mjs:17-18`; `.claude/hooks/path-guard.mjs:46`.
- Proposed change: the allowlist pattern admits the command with no arguments only; the script prints the absolute paths of the log and ledger folder it used; the test harness reaches the options through a separate, documented entry that the allowlist does not admit.
- Abuse and regressions: none expected.
- Tests: "chief runs the ledger check with `--log`" is ALLOW today; after, BLOCK.
- Wave: 1.
- Reviewer and approval: Independent Reviewer; owner approves.
- Safe verification: synthetic tests.

**H-34. A local settings file can override the project's controls.** (Security N-05; harness behaviour to confirm)
- Severity: **High, unverified.** `.claude/settings.local.json` is git-ignored (`.gitignore:29`) and is understood to outrank the project file. An "always allow" answer by the owner to a permission prompt is written there, invisibly to git.
- Location: `.gitignore:29`; the owner's user-level settings.
- Proposed change: confirm the precedence on CLI 2.1.231. Then: the owner checklist says to approve prompts once, never "always"; the ownership audit (H-03) and the acceptance checks list that file's existence and contents; consider not ignoring it.
- Abuse and regressions: tracking the file exposes personal preferences in git.
- Tests: live, by the owner, with a harmless rule.
- Wave: 1.
- Reviewer and approval: Security Engineer; owner decides.
- Safe verification: QA's test plan flags that approving `pnpm add --help` with "always allow" would itself create such a rule; follow its wording.

**H-35. Reads outside the project are unlimited, and one allowlisted command prints any file.** (Security N-07)
- Severity: **High**, becoming critical when real credentials exist on this machine. The Read tool is not limited to the project, and `git diff --no-index <a> <b>` is admitted by the read-only allowlist and prints arbitrary files.
- Location: `.claude/hooks/path-guard.mjs:42` (`git diff` with any arguments); `.claude/settings.json:5-12` (deny rules name project-relative files only).
- Proposed change: reject `--no-index` in the allowlist; add `Read` deny rules and sandbox `denyRead` entries for the home-directory credential locations listed in H-07; state in `CLAUDE.md` that agents read inside the project only.
- Abuse and regressions: QA warns that probing a deny rule against a real `~/.npmrc` risks a real token entering context; probe only paths that do not exist.
- Tests: "reviewer runs `git diff --no-index`" is ALLOW today; after, BLOCK.
- Wave: 1.
- Reviewer and approval: Security Engineer; owner approves.
- Safe verification: synthetic tests; live probes against missing paths only.

**H-36. The Security Engineer's allowlist admits a command that installs.** (QA objection 5, Security)
- Severity: **Medium.** `npm audit fix`, `npm audit fix --force` and `pnpm audit --fix` change dependencies.
- Location: `.claude/hooks/path-guard.mjs:48` (`/^(pnpm|npm) audit( |$)/`).
- Proposed change: reject any `audit` command containing `fix`.
- Tests: "security runs `npm audit fix`" is ALLOW today; after, BLOCK; `pnpm audit --prod` stays ALLOW.
- Wave: 1.
- Reviewer and approval: Independent Reviewer; owner approves.
- Safe verification: synthetic tests.

**H-37. Two ledger bypasses.** (QA objection 4, Security)
- Severity: **Medium.**
  - Any stage, including `review`, `qa` and `security`, can be ticked with `agent: owner`, and the run check is skipped (`scripts/check-feature-ledger.mjs:76`).
  - `accepted: Yes` or `security-sensitive: YES` is silently read as "no", because the comparison is `=== 'yes'` (`:82`, `:85`, `:90`).
- Proposed change: a fixed table of which agent may hold each stage, with `owner` valid only for `plan-approved`; normalise or reject field values that are not exactly `yes` or `no`.
- Tests: two new failing cases, then passing.
- Wave: 1, with the other ledger changes.
- Reviewer and approval: Independent Reviewer; owner approves.
- Safe verification: temporary fixtures.

**H-38. The design tier is self-declared.** (Security review of section 4)
- Severity: **Medium.** Once a lighter tier exists, labelling real implementation work `design` skips `implementation` and `qa`.
- Location: the proposed change in section 4.
- Proposed change: when a `design` ledger is accepted, the check also requires that every changed path lies under `docs/`. This needs a baseline commit to compare against.
- Tests: "design ledger with a change under `apps/` fails".
- Wave: 1, with H-13.
- Reviewer and approval: Independent Reviewer; owner approves.
- Safe verification: temporary git repository in a test fixture.

**Items the first draft missed from the earlier review, now recorded.**
- R15: a captured re-run of `secret-guard` firing has not been done. It joins Wave 0.
- A guard denial for a subagent started from the extension has not been observed. It joins the owner checklist.
- R5's `: > CLAUDE.md` matches no proposed text rule; only H-01 and H-02 address it.
- R3's stronger options for the run log (outside the repository, append-only at the filesystem level) were not discussed in the first draft. They remain options for the owner; H-02's write protection is the proposal.
- The rule that nobody deletes the run log is unenforced and undetectable, and the setup session broke it once. H-02 is the only proposed enforcement.

## 4. Ledger and run-log decision

**Recommendation for a documentation and design tier**

Change list for `scripts/check-feature-ledger.mjs`, not applied:

```diff
 const REQUIRED = {
   substantial: ['architect', 'sage-before', 'plan-approved', 'implementation', 'sage-during', 'qa', 'review', 'sage-after'],
   small: ['implementation', 'qa', 'review', 'sage-after'],
+  design: ['sage-before', 'plan-approved', 'authoring', 'review', 'sage-after'],
 };
```

- A new stage name, `authoring`, for the documents themselves. It is deliberately not called `implementation`, so nobody ticks a stage that claims code was built.
- `security-sensitive: yes` adds the `security` stage exactly as it does today (`:85`).
- `tier: trivial` with `accepted: yes` becomes an error: a trivial change has no ledger to accept (`:64`).
- The error text at `:65` lists the three valid tiers.
- `docs/status/features/_TEMPLATE.md` gains the `authoring` line; `.claude/skills/feature-workflow/SKILL.md` gains a `design` row in the tier table.

Safe introduction: add the failing tests first (a design ledger accepted with all five stages passes; one without `review` fails; `trivial` plus `accepted: yes` fails), apply the change, confirm the existing ledger cases still pass, Independent Reviewer reads the diff, owner approves. Rev 2: QA notes that if H-14 lands in the same step, the existing case at `scripts/test-guards.mjs:134` must change, so "all seven pass unchanged" holds only if the tier is introduced on its own first. Introduce the tier alone, then the run-id binding. H-38 adds the check that a design ledger changed documentation only.

**Recommendation for the run log**

- Nobody deletes, truncates or edits `.claude/logs/agent-runs.jsonl`. The nine records from 06:41:15 to 06:41:57 UTC on 2026-10-11 are probe runs and stay as history. Records after them are real work: the SAGE and QA runs of the validation, and the runs made while preparing these two proposals. The harness appends a record each time a delegated specialist finishes; that is the log working, not an edit.
- Direct sessions, including a `devops-sre` session launched with the shell removed, leave no record until H-09 lands. The hand-tracking file records their session ids and start-up tool lists instead.
- Until H-14 binds stages to run ids, the SRE phase is distinguished from the probes by its start date: it is opened with `started` no earlier than **2026-10-12**, so no record dated 2026-10-11 can count toward it.

**Recommendation for tracking the SRE phase honestly**

- Until the `design` tier is approved and applied, track the phase in `docs/status/sre-architecture-phase.md`, outside `docs/status/features/`, so the checker neither passes nor fails it by accident. Use the same stage-line format, and record the harness `agentId` of each run beside its stage.
- Mark that file plainly: "tracked by hand; not machine-checked".
- When the tier lands, move the file into `docs/status/features/` unchanged and run the checker on it. If the phase finishes first, the owner accepts it on the evidence, and the record says the check was not available.

## 5. What this plan does not do

- It does not make the organization secure against an agent that is trying to defeat it. The controls exist to catch mistakes, to make approvals real, and to limit what an agent can do if hostile text in a file or web page redirects it. They are not proof against that last case.
- The decisive protections remain outside Claude Code: no production credential on this machine, branch protection on `main`, and the owner reading the evidence.
- Nothing in it has been executed. Every "after" test is a prediction.

## 6. Decisions for the owner

1. Approve, change or reject each wave.
2. H-01: accept that agents lose `rm`, `mv` and installs entirely, and that file removal becomes an owner action.
3. H-02: enable the sandbox, after it is confirmed on CLI 2.1.231.
4. H-04: manifest and CI edits prompt the owner, even for `devops-sre`.
5. H-08: guards fail closed, with a confirmed recovery path first.
6. H-13 and section 4: the `design` tier, and hand tracking until it exists.
7. H-24: how to fix the default model; whether to upgrade the CLI later.
8. H-22 and H-23: run the owner-only checklist in a new extension session.
9. H-26, H-27, H-29: screenshot capability, a Figma file, and which connectors stay attached.
10. H-31 and H-32: what happens to an unknown agent type, and to a session with no agent type. These come first; other designs depend on them.
11. H-01: accept or reject the residual risk that the four building roles can still run code they can write.
12. Who runs the guard suite after H-01, and who applies new test cases to `scripts/`.
13. A baseline commit, made by the owner, before the SRE phase and before any hardening change. Before committing, someone should read `docs/testing/evidence/` for account details; a search on 2026-10-11 found no email address under `docs/`.
14. The "decision needed" rows in QA's test plan, including lockfile writes, compose files and `apps/*/Dockerfile`.

## 7. Review record

- Security Engineer: `docs/security/proposals-security-review-2026-10-11.md`. Verdict on the first draft: Wave 0 can proceed with additions; Wave 1 should be revised before approval. This revision answers that; the Security Engineer has not re-read it.
- QA: `docs/testing/hardening-test-plan-2026-10-11.md`. Tests defined; none executed.
- Independent Reviewer: reviewed revision 2. Verdict: **not ready as a whole; revise.** The report is saved verbatim at `docs/status/proposals-independent-review-2026-10-11.md`. **This text has not been revised in response.** Its findings are not folded in; read the report beside this plan. The reviewer found every sampled code citation correct, nine inconsistencies between the wave table and the entries, missing entries for R14, R15, R18 and R19, incomplete mitigations in H-04, H-06, H-33, H-35 and H-37, and no named implementer.
- SAGE: `docs/learning/sre-and-hardening-proposals-before.md`. SAGE caught an earlier version of this section stating the independent review as done before it was; corrected.
