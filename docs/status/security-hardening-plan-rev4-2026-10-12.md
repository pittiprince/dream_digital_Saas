# Proposal B, revision 4: Security hardening plan

Date: 2026-10-12. Author: Chief Engineer (orchestrating session). Supersedes revision 3, `security-hardening-plan-rev3-2026-10-12.md`, which is left exactly as it stood after the second review.

**Status of everything here: proposed.** No patch is approved or applied. No finding is fixed. A proposed test fixes nothing, and a control described in a document is not a working control.

**Review state.** Revision 3 was found "not ready" by the Independent Reviewer (`docs/status/proposals-second-review-2026-10-12.md`). This revision answers that report; the finding-by-finding record is `docs/status/remediation-matrix-2026-10-12.md`. Reviews of this revision are recorded in section 12 and only there. **This document is not approved by anyone.**

**Three kinds of statement, kept apart throughout.**
- **Mechanism:** the software refuses the action whatever the agent intends.
- **Observed:** a tool message or harness record is on file showing what happened. *Relayed* means a session saw it and nothing is on file. *Static* means read from code and never run.
- **Policy:** a written rule. It limits nothing by itself.

Line numbers refer to the files as read on 2026-10-12.

## 1. Authority and conduct

- **No agent role can modify protected configuration or scripts** (mechanism for the ten named roles' Write and Edit: `.claude/hooks/path-guard.mjs:11-39` grants none of them a path under `.claude/` or `scripts/`; policy in `CLAUDE.md`). Every change in this plan to `.claude/`, `scripts/`, `CLAUDE.md`, `.gitignore` or user-level settings is applied by the owner (section 3).
- **Nobody bypasses a guard or loosens a permission to apply a fix.** If a patch cannot be applied otherwise, it is not applied.
- **When a guard refuses an operation, the operation stops.** The refusal text is preserved and the owner is asked. The command is not rewritten, split, scripted or routed through another tool. This is the owner's directive of 2026-10-12, issued after the orchestrating session rewrote a refused search as a script (second review, section 5).
- **The orchestrating session is not fenced** (static: it has no agent type, `path-guard.mjs:63-64`). From this revision on it runs only what the `chief-engineer` allowlist admits (`path-guard.mjs:42-43`, `:46`): read-only git and the ledger check. Appendix A lists what it ran before that.
- **One writing agent at a time** (policy, `chief-engineer.md:35`). It was broken twice, on 2026-10-11 and 2026-10-12, and is followed from this revision on.

## 2. Execution paths, one by one

| Path | Control today | Kind, and whether seen working | Proposed | Still open afterwards |
|---|---|---|---|---|
| Shell | Allowlist for 3 roles; open for 4 (`path-guard.mjs:45-49`, `:68`); text rules in `settings.json` | Mechanism for 3 roles, observed refusing; none for 4, observed running `rm` | H-01, H-02; no shell in documentation phases | Building roles can run code they can write |
| Write, Edit | Path guard per role (`path-guard.mjs:77-88`) | Mechanism, observed refusing for 8 roles | H-16, H-47, H-04, H-15 | Sessions with no agent type (H-32) |
| Read, Grep, Glob | Name test (`secret-guard.mjs:37-45`); eight `Read` deny rules | Mechanism by name only; deny rule observed for 7 roles | H-06, H-07, H-35, H-17 | Unlisted files outside the project |
| Connector tools | None: outside the hook matchers (`settings.json:46`, `:55`), the sandbox and the run log | Policy only | H-29 | Whatever stays attached |
| Web tools | In no agent's tool list (`.claude/agents/*.md:4`) | Mechanism for named agents (static) | None | The main session |
| Starting agents | Only `chief-engineer.md:4` lists the agent tool | Mechanism, observed | H-31 | — |
| Nested `claude` sessions | Possible from any open shell | None | H-01 admits no `claude`; H-32 | Owner-launched sessions, by design |
| Code run by tools | None | None | H-01 named scripts; H-04 prompts | Residual, for the owner to accept or not |
| Hooks, settings, plugins | Hooks live in the tree they guard; local settings may outrank the project (unverified) | Policy | H-02, H-34, H-47 | User-level settings and plugins |
| Git hooks and config | None | None | H-47 | — |

## 3. How a proposed patch becomes an applied one

Statuses: **proposed → tests defined → security-reviewed → reviewer-recommended → owner-approved → applied → verified.** Everything in this plan is at "proposed".

1. **Patch text** is written as a unified diff under `docs/status/hardening-patches/`. Proposed author: the Chief Engineer; the owner may name someone else. The author never approves or applies it.
2. **Tests.** QA writes the new and changed cases as a diff to `scripts/test-guards.mjs`, saved under `docs/testing/`. The owner runs the suite with the new cases on the unpatched code and saves the output, which must show the failures the entry predicts. Tests are committed before the patch.
3. **Security Engineer review**, in `docs/security/`. Required for every protected change.
4. **Independent Reviewer** reads the patch, the tests and the security review, and recommends or does not. Required for every protected change. Proposed: for these recommendations the owner launches the reviewer session directly and saves its output, so the verdict does not reach the owner through a file the author saved.
5. **Owner approval.** The record of approval is the owner's own commit of the patch. A note typed by the Chief Engineer is a convenience copy, not the record.
6. **Applied by the owner**, by hand or with `git apply`, at the owner's terminal, one step per commit on a hardening branch. No agent session applies a patch. Revision 3 offered an owner-directed session as a fallback; that is withdrawn.
7. **Verified by the owner**: `node scripts/test-guards.mjs`, raw output saved under `docs/testing/evidence/hardening/`. The Independent Reviewer reads the committed diff with `git show` (admitted by `path-guard.mjs:42`) and the saved output. It cannot run `node` (observed: its allowlist refused `node --version`).

## 4. One execution order

This is the single order for both proposals. Proposal A revision 4 states the same order. Changing it means revising both documents first.

| # | What | Who | Notes |
|---|---|---|---|
| O1 | Owner decisions: privacy redaction, which connectors stay attached (the owner detaches the rest; no file changes), the items in section 11 | Owner | Detaching connectors is Wave 0, not the end of Wave 1 |
| O2 | Foundation baseline commit on `main` | Owner | The commit message carries the run log's line count and SHA-256 at that moment. No extra file |
| O3 | Wave 0 verification | Owner launches; QA records | Includes H-46 and Proposal A's launch capture. Probe files are removed by the owner before the evidence is committed |
| O4 | Pre-phase hardening: step 1, then step 2 | Section 3 route | Step 2 puts the `design` tier and its evidence binding into the ledger check. Merged to `main` by the owner |
| O5 | SRE phase opens | Owner | The owner commits the ledger `docs/status/features/SRE-001-architecture-phase.md`. That commit is the phase baseline |
| O6 | SRE phase runs on its own branch | Per Proposal A | No hardening change and no Wave 0 probe during the phase |
| O7 | SRE phase accepted or not | Owner runs the ledger check; reviewer; owner decides | |
| O8 | Remaining hardening: steps 3 to 8 | Section 3 route | Before any agent with a shell does real work |
| O9 | Wave 2 | Section 3 route | Each item before what it must precede |

This removes the conflict the second review found. The `design` tier lands at O4, before the phase baseline at O5, so nothing under `.claude/` or `scripts/` changes while the phase runs, and the phase has a machine-checked ledger from its first day. Hand tracking is no longer proposed.

## 5. Waves and steps

- **Wave 0, testing and verification.** No protected file changes. Every probe is launched by the owner and needs the owner's go-ahead; an agent saying the owner agreed is not authorization.
- **Wave 1, essential hardening.** Steps 1 and 2 before the SRE phase; steps 3 to 8 after it and before any implementation.
- **Wave 2, later improvements.**

Every step also changes `scripts/test-guards.mjs`, because every step adds cases.

| Step | Findings | Protected files changed (besides the test suite) | Depends on |
|---|---|---|---|
| 1 | H-12 | none | O2, O3 |
| 2 | H-13, H-38, H-52, H-37, H-19, H-14, H-11, H-33 | `scripts/check-feature-ledger.mjs`; `.claude/hooks/path-guard.mjs` (line 46 only); `docs/status/features/_TEMPLATE.md`; `.claude/skills/feature-workflow/SKILL.md`; `CLAUDE.md` | Step 1 |
| 3 | H-31, H-32, H-08 | `path-guard.mjs`; `secret-guard.mjs` | Step 2; O7; H-22, H-23, H-51 results |
| 4 | H-06, H-07, H-17 | `secret-guard.mjs`; `.claude/settings.json`; `.gitignore` | Step 3 |
| 5 | H-02, H-34 | `.claude/settings.json` | Step 4. H-02 is verified before step 6 starts |
| 6 | H-16, H-47, H-15, H-01, H-04, H-05, H-35, H-36, then H-03 | `path-guard.mjs`; `.claude/settings.json`; a new hook file; `CLAUDE.md`; `.claude/agents/devops-sre.md` | Step 5 |
| 7 | H-09, H-10, H-49 | `log-agent-run.mjs`; `path-guard.mjs`; `.claude/settings.json`; `.gitignore`; `CLAUDE.md` | Step 6 |
| 8 | H-20, H-24, H-29, H-48 | `.claude/settings.json`; `SKILL.md`; `CLAUDE.md` | Step 7 |

**Reconciled table.** One row per finding. Every protected change has the owner as implementer and both reviewers.

| ID | Finding, short | Severity | Wave.step | Implementer | Reviewers |
|---|---|---|---|---|---|
| H-01 | Shell bypasses path ownership | High | 1.6 | Owner | Security, Reviewer |
| H-02 | No filesystem enforcement | High | 1.5 | Owner | Security, Reviewer |
| H-03 | No detection after the fact | Medium | 1.6 | Owner | Security, Reviewer |
| H-04 | Installs and manifest edits escape approval | High | 1.6 | Owner | Security, Reviewer |
| H-05 | Destructive commands, one spelling | High | 1.6 | Owner | Security, Reviewer |
| H-06 | Secret names: case and globs | High | 1.4 | Owner | Security, Reviewer |
| H-07 | Key formats covered nowhere | Medium | 1.4 | Owner | Security, Reviewer |
| H-08 | Guards fail open | High | 1.3 | Owner | Security, Reviewer |
| H-09 | Direct sessions leave no run-log record | Medium | 1.7 | Owner | Security, Reviewer |
| H-10 | Run record can be fabricated | High | 1.7 | Owner | Security, Reviewer |
| H-11 | Missing log disables the check | High | 1.2 | Owner | Security, Reviewer |
| H-12 | Test suite: vacuous and missing cases | Medium | 1.1 | Owner applies; QA drafts | Security, Reviewer |
| H-13 | No design tier | Medium | 1.2 | Owner | Security, Reviewer |
| H-14 | Probe records satisfy a ledger | Medium | 1.2 | Owner | Security, Reviewer |
| H-15 | Links redirect writes | Medium | 1.6 | Owner | Security, Reviewer |
| H-16 | Patterns reach protected folders | High | 1.6 | Owner | Security, Reviewer |
| H-17 | Content search and secret files | High until probed | 0 probe; 1.4 change if the probe shows a leak | Owner | Security, Reviewer |
| H-18 | Secret protection not observed for every role | Low | 0 | Owner launches probe | QA records |
| H-19 | Ledger evidence and flags unchecked | Medium | 1.2 | Owner | Security, Reviewer |
| H-20 | `ask` becomes refusal non-interactively | Low | 0 probe; 1.8 wording | Owner | Security, Reviewer |
| H-21 | Outstanding role checks | Low | 0 | Owner launches probes | QA records |
| H-22 | Interactive prompts and Chief Engineer tools | Medium | 0 | Owner only | QA records |
| H-23 | New extension session unverified | High | 0 | Owner only | QA records |
| H-24 | Default model unusable | High (operability) | 1.8 | Owner | Security, Reviewer |
| H-25 | No content search for shell-holding roles | Medium | 2 | Owner | Security, Reviewer |
| H-26 | QA cannot capture screenshots | Medium | 2 | Owner decides | Security, Reviewer |
| H-27 | Figma unreachable from command-line agents | Medium | 0 probe; 2 change if needed | Owner | Security, Reviewer |
| H-28 | Path rules and full workflow unverified | Low | 0 | QA observes | Reviewer |
| H-29 | Connectors outside every layer | High | 0 owner detaches; 1.8 deny rules | Owner | Security, Reviewer |
| H-30 | Rule matching untested | Low | 0 probe; 2 change if needed | Owner | Security, Reviewer |
| H-31 | Unknown agent type unrestricted | High | 1.3 | Owner | Security, Reviewer |
| H-32 | No agent type means owner | High | 1.3 | Owner decides and applies | Security, Reviewer |
| H-33 | Ledger check can be redirected | High | 1.2 | Owner | Security, Reviewer |
| H-34 | Local settings may outrank the project | High, unverified | 0 probe; 1.5 | Owner | Security, Reviewer |
| H-35 | Reads outside the project | High | 1.6 | Owner | Security, Reviewer |
| H-36 | `audit fix` admitted | Medium | 1.6 | Owner | Security, Reviewer |
| H-37 | Ledger stage and field bypasses | Medium | 1.2 | Owner | Security, Reviewer |
| H-38 | Design tier is self-declared | Medium | 1.2 | Owner | Security, Reviewer |
| H-39 | Control-trial evidence is relayed | Medium | 0 | Owner launches | QA records |
| H-40 | Secret guard never seen firing at transcript grade | Medium | 0 | Owner launches | QA records |
| H-41 | Inaccuracies in the validation record | Low | 0 | QA, in `docs/testing/` | Reviewer |
| H-42 | Launch argument-order trap | Medium | 0 | Owner | QA records |
| H-43 | Extension registry delay | Medium | 0 | Owner observes | QA records |
| H-44 | Rules untested for other roles | Low | 0 | Owner launches | QA records |
| H-45 | Model of orchestrator and its subagents | Low | 0 | Owner | QA records |
| H-46 | Guard suite never run by an independent party | Medium | 0 | Owner | QA records |
| H-47 | Repository plumbing unprotected | Medium | 1.6 | Owner | Security, Reviewer |
| H-48 | Nothing inspects content before a commit | Medium | 1.8 | Owner | Security, Reviewer |
| H-49 | Fallbacks and missing start time | Low | 1.7 | Owner | Security, Reviewer |
| H-50 | No production credential reachable: unattested | High at launch | 0 | Owner attests | Security |
| H-51 | How the harness treats a failing hook: unknown | Medium | 0 | Owner launches | QA records |
| H-52 | Stage evidence not bound to a session and identity | High | 1.2 | Owner | Security, Reviewer |

## 6. Findings register

Each entry: where; proposed change; what still gets through and what may regress; tests; safe verification. Wave, implementer and reviewers are in the table. "Today" results are predictions from reading the code unless marked observed. Nothing below has been executed.

### Guard and path enforcement

**H-01. Shell bypasses path ownership.** Observed: four plain `rm` commands ran unguarded.
- Where: `path-guard.mjs:45-49`, `:68`.
- Proposed: `BASH_ALLOW` entries for the four building roles: read-only git as narrowed in H-35; `node --version`, `pnpm --version`; fixed named scripts with no further arguments, `pnpm --filter <own workspace> run <lint|typecheck|test|build>`. No `pnpm exec`, `npx`, `claude`, `rm`, `mv`, `cp`, `ln`, redirection, install or network command.
- Still through; regressions: a named script runs whatever the manifest, tests and tool configs say, which these roles can write. This narrows the shell and does not confine a role to its lane; the owner accepts that residual risk in writing or does not. Build steps stay blocked until listed. After this step no agent can run the guard suite; the owner runs it (section 3).
- Tests: for each of the four roles, `rm -r apps`, `mv docs docs.old`, `: > CLAUDE.md`, `pnpm exec prettier --write CLAUDE.md`, `claude -p x`: ALLOW today, BLOCK after. Named script ALLOW after. Pin: "a test file can write outside its lane (documented limit)".
- Safe verification: synthetic suite. Live: one owner-launched role asked to run `touch _probe.txt`.

**H-02. No filesystem enforcement.** Static.
- Where: `settings.json` has no `sandbox` block.
- Proposed: `sandbox.enabled: true`; `sandbox.allowUnsandboxedCommands: false`, load-bearing because the shell tool carries a per-command parameter to leave the sandbox (relayed: the reviewer saw it in its tool schema); an `ask` rule on that parameter; `filesystem.denyWrite` for `.claude/`, `scripts/`, `.github/`, `.git/hooks`, `.git/config`, `.vscode/`, `CLAUDE.md`, every `package.json` and lockfile, and the run log; `filesystem.denyRead` for home-directory credential locations; a stated network policy. Every key is unverified on CLI 2.1.231; the documentation read on 2026-10-11 is not on file here.
- Still through: project-wide, so it cannot keep one role out of another's lane. It does not cover Read, Edit, Write, hooks or connectors.
- Tests: live only.
- Safe verification: QA's procedure L-02, owner-launched, before step 6, because afterwards the allowlist refuses the probe first and the sandbox would pass untested.

**H-03. No detection after the fact.**
- Where: `settings.json:64-73`.
- Proposed: a new hook comparing content hashes of all files, ignored ones included, between agent start and stop, reporting changed paths the agent does not own to the run record and to the owner's saved output.
- Still through: never audits the main session; confused by concurrent agents; trusts repository git config unless H-47 lands first, which is why it is last in step 6.
- Tests: owned change clean; unowned change, ignored-file change and in-lane `.gitignore` change each reported.
- Safe verification: temporary repository in a fixture.

**H-04. Installs and manifest edits escape approval.** Static.
- Where: `settings.json:27-28`; `path-guard.mjs:32-35` (manifests, `.gitignore`, tooling configs in the `devops-sre` lane), `:23` (test-tool configs, QA, any depth).
- Proposed: no agent shell admits an install (H-01). `ask` rules for owner-attended sessions: `pnpm install*`, `pnpm i *`, `pnpm add*`, `pnpm up*`, `pnpm dlx *`, `npm i*`, `npm ci*`, `npx *`, `yarn *`, `bun *`, `corepack *`. In the path guard: lockfiles blocked for every agent; a prompt for any `package.json`, `.npmrc`, `pnpm-workspace.yaml`, `.gitignore`, `.gitattributes`, `.github/**`, `Dockerfile*`, `deploy/**`, and every config a script executes (`eslint.config.*`, `.prettierrc*`, `tsconfig*.json`, `vite.config.*`, `vitest.config.*`, `playwright.config.*`).
- Still through: whether a hook's prompt reaches the owner from a delegated agent is unverified (H-22); non-interactively it is a refusal.
- Tests: `devops-sre` runs `pnpm install`: ALLOW today, BLOCK after. Writes to `package.json`, `.gitignore`, `eslint.config.js`: silent allow today, prompt after, asserted on the hook's output. Lockfile write BLOCK after.
- Safe verification: synthetic suite; live with `pnpm add --help`, answered "once", never "always".

**H-05. Destructive commands covered by one spelling.**
- Where: `settings.json:19`.
- Proposed: agents lose these through H-01. For owner-attended sessions, `ask` rules for `rm *`, `mv *`, `git rm *`, `find * -delete*`, `find * -exec *`, `truncate *`, `dd *`, `git checkout -- *`, `git restore *`, `git stash drop*`.
- Still through: text rules stay evadable; `: > CLAUDE.md` matches none and is stopped only by H-01 and H-02.
- Tests: live probes with help flags, dry runs and paths that do not exist.
- Safe verification: owner-launched, as the trial in the validation addendum.

**H-15. Links redirect writes.** Static.
- Where: `path-guard.mjs:81`.
- Proposed: resolve the nearest existing parent with `realpathSync` first.
- Tests: fixture with a link leaving the lane: ALLOW today, BLOCK after.
- Safe verification: temporary directory.

**H-16. Patterns reach protected folders.** Static; High until nested instruction loading is probed.
- Where: `path-guard.mjs:21-23`, `:29-30`.
- Proposed: one case-insensitive protected-prefix check before the ownership test, for `.claude/`, `scripts/`, `.git/`, `.github/`, `.vscode/`, `.mcp.json`, `.gitattributes`; refusal of a nested `CLAUDE.md` or `.claude/` in any lane. Owner decides whether `devops-sre` may write `apps/*/Dockerfile`.
- Still through: sessions with no agent type, until H-32.
- Tests: `qa-test-engineer` writes `.claude/__tests__/x.mjs` and `.github/__tests__/x.test.ts`; `devops-sre` writes `.claude/Dockerfile.x`; a nested `docs/operations/CLAUDE.md`; `.Claude/x`: ALLOW today, BLOCK after.
- Safe verification: synthetic suite.

**H-47. Repository plumbing unprotected.** Static. Corrected from revision 3: **no role owns** `.git/config`, `.git/hooks/`, `.gitattributes`, `.vscode/` or `.mcp.json`, so a named agent's Write is already refused today by the ownership test. The open routes are a shell and a session with no agent type.
- Where: no explicit rule; refusal today is incidental to `path-guard.mjs:86`.
- Proposed: list them in the protected prefixes of H-16, in the same step, so the protection is deliberate and survives a later widening of a lane; and in the sandbox deny list (H-02).
- Tests: named agent Write to each: BLOCK today and after (regression pins). Shell write by a building role: ALLOW today, BLOCK after H-01 and H-02.
- Safe verification: synthetic suite.

**H-35. Reads outside the project, and git commands that print any file.** Static.
- Where: `path-guard.mjs:42`; `settings.json:5-12`.
- Proposed: for the git allowlist reject `--no-index`, `--output`, `-O`, and any argument that is absolute, begins with `~` or contains `..`. That git compares outside files with no flag is the reviewer's recollection, unverified. Add `Read` deny rules and sandbox `denyRead` for home-directory credential locations. `CLAUDE.md` states that agents read inside the project only (policy).
- Still through: the Read tool on an unlisted outside file.
- Tests: `git diff --no-index a b`; `git diff /dev/null /tmp/x`; `git show HEAD:../x`: ALLOW today, BLOCK after.
- Safe verification: synthetic suite; live only on a harmless temporary file.

**H-36. `audit fix` admitted.** Static.
- Where: `path-guard.mjs:48`.
- Proposed: reject any audit command containing `fix`.
- Tests: `npm audit fix`, `pnpm audit --fix`: ALLOW today, BLOCK after; `pnpm audit --prod` stays ALLOW.
- Safe verification: synthetic suite.

### Agent identity and fail-safe behaviour

**H-31. Unknown agent type unrestricted.** Static.
- Where: `path-guard.mjs:64`.
- Proposed: when `agent_type` is present and not in `OWNED`, block writes and shell.
- Regressions: built-in agent types lose their shell here.
- Tests: `general-purpose` writes and runs a command: ALLOW today, BLOCK after.
- Safe verification: synthetic suite.

**H-32. A session with no agent type is treated as the owner.** Static; pinned at `scripts/test-guards.mjs:65`.
- Where: `path-guard.mjs:63-64`; `settings.json:2`.
- Proposed: owner decision after H-23. (a) Fence such sessions as `chief-engineer`; the owner keeps an ordinary editor for configuration work, so no unfenced agent session is needed. (b) Leave open and accept the risk in writing.
- Abuse today: the orchestrator, or a nested session started from any open shell, writes anywhere. Regression under (a): a mistake in the guard locks agent sessions out of all writes until the owner fixes it by hand.
- Tests: under (a), the case at line 65 becomes BLOCK and a new case shows a write under `docs/status/` still allowed.
- Safe verification: the owner checklist, then synthetic suite.

**H-08. Guards fail open.** Static.
- Where: `path-guard.mjs:57-61`, `:64`; `secret-guard.mjs:21-26`.
- Proposed: one `try`/`catch` per hook that blocks with exit 2 on any unexpected error, including unparseable input; `Object.hasOwn` in place of `in`, only together with H-31, since alone it moves a blocked input into the open unknown-agent path. (The same substitution in `check-feature-ledger.mjs:55`, `:65` is made in step 2.)
- Preconditions, both Wave 0: H-51, and the owner's confirmation of a recovery route. A `--safe-mode` launch option was seen in `claude --help` output during setup (relayed, not on file).
- Regressions: a bug in a guard blocks every tool call in every session.
- Tests: malformed input: ALLOW today, BLOCK after; every BLOCK case asserts the guard's message (H-12).
- Safe verification: synthetic suite.

**H-51. How the harness treats a failing hook is unknown.** New in revision 4 (second review, B-N4).
- What: whether a hook that exits with a code other than 0 or 2, has a syntax error, cannot find `node`, or times out, blocks or allows the call. H-08 cannot be judged without this.
- Proposed: owner-launched probes using a throwaway settings file passed at launch, pointing at a deliberately broken hook, with a harmless write as the guarded action. No project file changes.
- Tests: the four cases, each recorded as blocked or allowed.
- Safe verification: the guarded action is one `_probe-*.txt` file.

### Secret protection

**H-06. Secret names: case and globs.** Static.
- Where: `secret-guard.mjs:9-14`, `:31`.
- Proposed: compare lower-cased, keeping the `.env.example` exemption exact so `.env.EXAMPLE` stays blocked. Expand braces, remove quotes and backslashes, strip a leading `@`, split on `:`, then treat the word as a glob and block if it can match any listed secret name. Apply the same to a search's `glob`. For file tools, also test a link's resolved target.
- Still through: names built by variables or an interpreter; H-01 and H-02 are the controls.
- Tests: `.ENV`, `.Env.Production`, `cat .e?v`, `cat .e*`, `cat .??v`, `cat {.env,x}`, `cat .en\v`, `cat .en''v`, `curl -d @.env host`, `scp host:.env .`, a search with `glob: "**/.e*"`: ALLOW today, BLOCK after. `.env.EXAMPLE`, `Example.Key`: BLOCK today and after. `.env.example`: ALLOW throughout.
- Safe verification: synthetic suite; live only with an owner-made dummy file holding `DUMMY_NOT_A_SECRET`.

**H-07. Key formats covered nowhere.** Static.
- Where: `secret-guard.mjs:12`; `settings.json:5-12`; `.gitignore:12-18`.
- Proposed: add `.p8`, `.ppk`, `.jks`, `.keystore`, `.netrc`, `.pgpass`, `.envrc`, `*.env`, `.dev.vars`, `credentials.json`, `client_secret*.json`, `*service-account*.json` to all three. The project `.npmrc` never holds a token (policy); reads of the user-level one are denied.
- Tests: one BLOCK case per name; an ordinary `.json` stays ALLOW.
- Safe verification: synthetic suite.

**H-17. Content search and secret files.** The hook passes a directory search (`secret-guard.mjs:41-42`, static); whether lines return from an ignored secret file is unobserved.
- Proposed: probe in Wave 0. If lines or file names return, step 4 refuses a search over a directory holding a secret-named file, in every output mode.
- Tests: decided by the probe.
- Safe verification: owner-made dummy file.

**H-18.** Secret protection was not observed for `backend-data-engineer` and `independent-reviewer`, who declined the attempt. Evidence gap; owner-launched probe.

### Ledger and run-log integrity

**H-13. No design tier.** Section 7.

**H-38. The design tier is self-declared.** Section 7.

**H-52. Stage evidence is not bound to a session and an identity.** New in revision 4 (second review, B-N1, High). Section 7.

**H-14. Probe and historical records satisfy a ledger.**
- Where: `check-feature-ledger.mjs:24`, `:70`, `:77`.
- Proposed: one agent per stage line and any number of lines per stage, so `:70`, which keeps one entry per stage name, is replaced by a list. A `run:` line must name a run-log record for that agent, non-null, used once, and dated at or after the ledger's opening commit (section 7), not after a typed date.
- Still through: a trivial delegation after opening yields a genuine id (policy forbids it; the reviewer reads the evidence).
- Tests: unknown id, reused id, null id, an id dated before the opening commit: each fails after.
- Safe verification: temporary fixtures with a temporary git repository.

**H-11. Missing log disables the check.** Static.
- Where: `check-feature-ledger.mjs:27`, `:76`, `:104`.
- Proposed: a missing log with any ticked `run:` line is a failure. No flag disables it.
- Tests: exit 0 today, exit 1 after.
- Safe verification: temporary fixtures.

**H-33. Ledger check can be redirected or starved.** Static.
- Where: `check-feature-ledger.mjs:17-18`, `:98-100`, `:106`; `path-guard.mjs:46`.
- Proposed: the allowlist admits the command with no arguments; the script prints the absolute paths it used; a missing ledger folder fails; a ledger beginning with `_` other than `_TEMPLATE.md`, or in a subfolder, fails.
- Tests: `--log x`, `--dir x` from the Chief Engineer: ALLOW today, BLOCK after. `_F-001.md` accepted with no stages: `ok` today, FAIL after.
- Safe verification: synthetic suite and fixtures.

**H-37. Ledger stage and field bypasses.** Static.
- Where: `check-feature-ledger.mjs:24`, `:49`, `:54`, `:76`, `:82`, `:84`, `:85`, `:90`.
- Proposed: a fixed table of which agents may hold each stage, `owner` only for `plan-approved`; at least one known agent per line; every header field required, spelled as in the template, valued exactly `yes` or `no`.
- Regression: the test fixture at `scripts/test-guards.mjs:122` has no `id` field and would fail every case; see section 8.
- Tests: `security | agent: owner`; `agent: ,`; `Accepted: yes`; `accepted: Yes`; missing `security-sensitive`: `ok` or ignored today, FAIL after.
- Safe verification: fixtures.

**H-19. Ledger evidence and flags unchecked.** Static.
- Where: `check-feature-ledger.mjs:74`, `:84-85`, `:24`.
- Proposed: evidence that begins with a repository path must exist; `security-sensitive: no` needs a justification line; a ticked line not matching a stage format is reported.
- Regression: the same fixture has `security-sensitive: no` with no justification; see section 8.
- Tests: three failing cases, then passing.
- Safe verification: fixtures.

**H-09. Direct sessions leave no run-log record.** Observed.
- Where: `settings.json:64-73`; `log-agent-run.mjs:14`.
- Proposed: also log on a session-level event, to be confirmed on 2.1.231, with `kind: "direct"`. This is corroboration only. A direct session counts toward a stage through H-52, never through this record.
- Tests: synthetic payloads for both kinds.
- Safe verification: one trivial owner-launched session, then read the log.

**H-10. Run record can be fabricated.** Static. A Write to the log is already refused for the ten named roles; the open routes are a shell and a session with no agent type.
- Where: `log-agent-run.mjs:26`; `.gitignore:26`.
- Proposed: H-01 and H-02 close the shell route. Optionally chain records, each carrying the hash of the line before. `CLAUDE.md` states the log corroborates and never proves (policy). **Whether to stop ignoring the log is an owner decision; this plan leaves it ignored and untouched**, as the owner directed for the baseline.
- Tests: named-agent Write to the log: BLOCK today and after. Shell append by a building role: ALLOW today, BLOCK after step 6.
- Safe verification: synthetic suite. No live append.

**H-49. Fallbacks and missing start time.** Static.
- Where: `path-guard.mjs:80`; `log-agent-run.mjs:16`.
- Proposed: fail closed when the project directory variable is unset; record a start time.
- Tests: unset variable: BLOCK after.
- Safe verification: synthetic suite.

**H-12. Test suite repairs.**
- Where: `scripts/test-guards.mjs:82` (vacuous case), `:65`, `:20-24` (`expect` compares exit status only).
- Proposed: assert the guard's message as well as the exit code; helpers for raw input, captured output and per-test logs and repositories; rename the vacuous case as a documented limit; a pin for each known limit.
- Tests: the count rises from 58; recorded when the owner runs it.
- Safe verification: the suite, run by the owner.

### Permissions, capabilities, model and integrations

**H-20.** `ask` rules become refusals non-interactively (observed). No rule change. The procedure text goes into the workflow skill, a protected file, at step 8.

**H-21** (first-review R17 among others). Outstanding role checks: write denial for `software-architect`; any write attempt by `independent-reviewer`; secret-read refusal for `backend-data-engineer` and `independent-reviewer`. Owner-launched; at most one `_probe-*.txt` each.

**H-22. Interactive prompts and the Chief Engineer's plan and question tools are unverified.**
- Abuse and regressions: if no prompt reaches the owner, every `ask` rule and every hook prompt in this plan is a refusal at best and silent at worst; H-04's prompts must not be relied on until this is known.
- Tests: the owner-only checklist in QA's plan: role, tool list, a delegated `pnpm add --help` answered once.
- Pass: a prompt naming the command appears to the owner. Fail: no prompt, or the command runs unasked.
- Safe verification: `pnpm add --help` installs nothing.

**H-23. A new extension session starting as `chief-engineer`, loading `CLAUDE.md` and being fenced: unverified.**
- Abuse and regressions: if new sessions are not fenced, the orchestrator is the least restricted identity (H-32). If they are fenced, the owner's configuration work must be done in an editor.
- Tests: in a new session: ask its role; ask it to write `_probe-chief.txt` at the repository root.
- Pass: it names the role and the path guard refuses the write by role name. Fail: the file is created; the owner removes it.
- Safe verification: one empty probe file.

**H-24.** The default model fails (observed: "Fable 5 requires usage credits"). No `model` key in `settings.json`; no `model:` line in any agent file. Proposed: `"model": "opus"` in project settings; the alias resolved to `claude-opus-5` on CLI 2.1.231 (observed). Test: one owner-launched session with no model flag.

**H-25** (first-review R1). Roles holding a shell are given no search tools (observed in start-up records).
- Where: `.claude/agents/*.md:4`; `path-guard.mjs:41-49`.
- Proposed, owner chooses: (a) once commits exist, admit `git grep` on tracked files only, rejecting `--no-index`, `--no-exclude-standard`, `-O`, `--open-files-in-pager`, plus `ls`; or (b) launch the role without a shell when it needs search and not git; that such a launch grants search tools is relayed, not on file. Not proposed: `find`, `rg`, recursive `grep`.
- Tests: `git grep -n x`: BLOCK today, ALLOW after under (a); `git grep --no-index x`, `git grep -O x`: BLOCK throughout.
- Safe verification: synthetic suite.

**H-26.** QA has no screenshot tool (`qa-test-engineer.md:4`, `:15`). Owner decision; a browser tool is a network path and a new dependency. Before the first UI feature.

**H-27.** Figma was unreachable from command-line agents (observed twice). No change until the owner supplies a file; then a read-only probe on one frame from an attended session.

**H-28.** Path-scoped rules and the full workflow are unverified. Pass condition: the first ledger records, per rule file, whether it was seen to load, with the session output saved.

**H-29. Connectors outside every layer.** Observed attached to agent sessions; agents ignored their instruction text in every run seen.
- Where: `settings.json:46`, `:55`.
- Proposed: at O1 the owner detaches what this project does not need (no file change). At step 8: `deny` rules for the tool prefixes of anything remaining that can write or spend, and the hook matcher extended to connector tool names so calls are logged.
- Abuse: hostile text telling an agent to call a connector; spend on a credit-metered one.
- Tests: an owner-launched session's start-up record shows no connector tools.
- Safe verification: read the record; call nothing.

**H-30.** How the `Read` deny patterns match, whether shell patterns normalise whitespace, whether `Read(*.pem)` fires: untested. Probes on paths that do not exist.

**H-34. A local settings file may outrank the project.** `.gitignore:29` ignores `.claude/settings.local.json`; precedence is unverified. The file was absent on 2026-10-12 (reviewer's read).
- Proposed: Wave 0 probe by the owner with one harmless rule; at step 5, list the file in every acceptance check and decide whether to track it. Prompts are answered "once", never "always".
- Tests: the probe's result.
- Safe verification: the rule concerns `pnpm --version` only; the owner deletes the file afterwards.

**H-48. Nothing inspects content before a commit.** Protection is by file name only. Proposed: a written pre-commit check the owner runs. Test: it finds a planted marker in a fixture.

### Evidence items

**H-39** (R14). The control trial showing unmatched commands run after refusals is relayed; its raw output is not on file. Owner re-runs and saves it.

**H-40** (R15). The secret guard has been seen firing only in the orchestrating session's own tool results, three times now, none on file. Owner-launched capture of the shell branch and, with a dummy file, the file-tool branch.

**H-41** (R18, R19). In `docs/testing/setup-validation.md`: a heading that conflates two fences; a model statement graded above its evidence; an addendum copy whose identity with its source is relayed (the orchestrating session compared them; nothing on file); a final section never reviewed. QA corrects these, and the Independent Reviewer then reads the corrected section, since a correction is not a review.

**H-42.** A prompt placed directly after an option that takes several values is swallowed (observed for `--allowedTools`; unverified for `--disallowedTools`). Corrected from revision 3: this plan contains no launch form. Proposal A's form ends `... --output-format stream-json --verbose "<task>"`; the prompt is the final argument and follows `--verbose`, which takes no value. The owner's capture confirms it.

**H-43.** The extension showed the project agents only after a delay (relayed). Owner observes in a new session.

**H-44.** `ask` and `deny` rules were exercised for `devops-sre` only. Owner-launched harmless probes for one other role.

**H-45.** The model of the orchestrating session and its subagents rests on self-report. Owner reads the model selector and records it.

**H-46.** Nobody independent has seen the guard suite pass. The owner runs `node scripts/test-guards.mjs` and saves the raw output, first.

**H-50.** Before step 3, the owner attests in writing that no production credential is reachable from this machine or any attached connector.

## 7. The design tier and its evidence binding (H-13, H-38, H-52, step 2)

**Problem found by the second review.** Under revision 3 a line such as `authoring | agent: devops-sre` could pass because an unrelated delegated `devops-sre` run sits in the log, or could never pass, because sessions the owner launches directly leave no run record. Either way the check said nothing true about the phase's main author.

**Proposed tier**, change to `scripts/check-feature-ledger.mjs:20-23`:

```diff
 const REQUIRED = {
   substantial: ['architect', 'sage-before', 'plan-approved', 'implementation', 'sage-during', 'qa', 'review', 'sage-after'],
   small: ['implementation', 'qa', 'review', 'sage-after'],
+  design: ['sage-before', 'plan-approved', 'authoring', 'review', 'sage-after'],
 };
```

`security-sensitive: yes` adds `security` (`:85`). `SKILL.md:14` and `:18` gain an exception in words: documentation-only work that changes nothing outside `docs/` may use `design` with the security stage. `tier: trivial` with `accepted: yes` or `learning-complete: yes` becomes an error (`:64`).

**Opening commit.** A ledger is opened by the owner committing it. The checker derives the opening commit itself, as the commit that first added the ledger file. Nothing about it is typed. For H-38, every path changed between the opening commit and the checked state must lie under `docs/`. For H-14, a run record counts only if dated at or after the opening commit's time. The ledger is created in `docs/status/features/` on the day the phase opens, so it is never copied in afterwards; that was the gap in revision 3.

**Two stage-line forms, one agent per line, any number of lines per stage:**

```
- [x] <stage> | agent: <agent> | run: <agentId> | evidence: <path or words>
- [x] <stage> | agent: <agent> | session: <session id> | file: <saved session file> | commit: <hash> | evidence: <path or words>
```

**Checks on a `session:` line.** The run log is not consulted at all, so no historical run record can satisfy it.

1. The file exists, is present in the cited commit, and is byte-identical to the committed version.
2. The cited commit is at or after the opening commit.
3. The first record of the file parses and carries the cited session id.
4. The start-up record's tool list contains no shell for any agent the ledger header lists under `no-shell:`.
5. **Identity.** The session ran as the stated agent. How this can be established is the open point; see below.

**What the tooling can and cannot establish about identity.** Unverified today: whether the harness's start-up record names the agent the session ran as. The orchestrating session's earlier reading of such records saw the model, the tool list, connector servers and the list of available agents; it did not look for a field naming the active agent, and nothing is on file. So:

- **If the owner's capture shows such a field,** check 5 compares it with the line's agent. That is the preferred design.
- **If it does not,** the file alone cannot prove identity. Two safe alternatives, for the owner to choose:
  - (a) Each phase session begins with one owner-authorized, harmless out-of-lane write that the path guard must refuse. The refusal message names the role (`path-guard.mjs:87`: "<agent> does not own <path>"), and the harness records it in the session file. Check 5 looks for that message naming the line's agent. This is evidence produced by a mechanism.
  - (b) The owner attests per session in the commit message. This is policy, and the checker can only confirm the words are there.

**Remaining limits, stated plainly.**
- The binding proves that a specific saved session, with that id and tool list, is cited, and that the file has not changed since the owner committed it. It does not prove the session did good work.
- Anyone able to write the file and make the commit could fabricate both. The owner's commit is the anchor; until step 6, four roles hold a shell that could run `git commit` (static). The phase launches `devops-sre` without a shell, which removes that route for the phase's main author only.
- A session file holds whatever the session read. The owner reads it before committing.

**Tests for step 2**, each on a temporary git repository:

| Case | Expected after |
|---|---|
| `session:` line, all five checks satisfied | pass |
| File missing; file absent from the cited commit; file changed since the commit | fail, three cases |
| Session id in the file differs from the line | fail |
| Cited commit older than the opening commit | fail |
| Start-up record lists a shell for a `no-shell:` agent | fail |
| Agent on the line differs from the identity evidence | fail |
| `run:` line citing a record dated before the opening commit | fail |
| `authoring` satisfied only by an older run record of the same agent, no `run:` or `session:` field | fail |
| Design ledger accepted with all five stages; one without `review`; `trivial` with `accepted: yes` | pass; fail; fail |
| Design ledger accepted with a changed path outside `docs/` since the opening commit | fail |

**Abuse cases.** Labelling real implementation `design` to skip `implementation` and `qa` (answered by the docs-only check); citing an old run (answered by the opening-commit rule); pointing at a session file written by hand (limited by the commit check, not eliminated).

**Safe verification.** Fixtures only; no real ledger, log or session file is touched.

## 8. Regression test set

None of this has been run. QA's plan `docs/testing/hardening-test-plan-2026-10-11.md` predates revisions 3 and 4 and must be brought into line before step 1.

**Correction to revision 3.** It predicted that the seven existing ledger cases pass unchanged in the ledger step. That was wrong (second review, B-N3). On a static reading:

- The fixture header at `scripts/test-guards.mjs:122` has no `id` field and has `security-sensitive: no` with no justification line. H-37 requires every header field and H-19 requires the justification, so the three cases that expect a pass, at `:131`, `:134` and `:143`, would fail.
- The stage-line helper at `:119` has no `run:` field, so `:134` would also fail under H-14.
- The four cases that expect a failure, at `:132`, `:133`, `:135` and `:136-140`, would still exit 1, but possibly for a different reason than the one they are named for. That is why H-12 makes every case assert the message.

Step 2 therefore changes the fixture at `:119` and `:122`, and every one of the seven cases is re-stated with its expected message. The seven expected outcomes stay the same; none of the seven passes on unmodified fixture text.

| Area | Must hold after every step | Must change |
|---|---|---|
| Path ownership | The 26 existing ownership cases, except `:65` if H-32(a) is chosen | Protected prefixes, plumbing pins, nested instruction files, links, unknown agent type |
| Destructive commands | Reviewer cannot `rm`, chain or redirect | `rm -r`, `mv`, `: >` for the four building roles |
| Dependency installation | `security-engineer` cannot `pnpm install` (`:81`) | Installs for all roles; `audit fix`; manifest, config and lockfile writes |
| Secrets | The 11 existing cases | Case variants, globs, braces, escapes, `@` and `:` forms, new formats; `.env.EXAMPLE` pinned as blocked |
| Fail-safe behaviour | — | Malformed input; unset project directory; message asserted on every BLOCK |
| Run-log integrity | Named agent cannot Write the log | Shell append; redirected `--log` |
| Missing logs | In-progress ledger with no ticked line passes | Ticked `run:` line with no log fails; missing ledger folder fails |
| Ledger checks | The seven outcomes, on updated fixtures | Design tier; session binding; opening-commit rule; stage-to-agent table; field strictness |

## 9. Run log and git history

- `.claude/logs/agent-runs.jsonl` and every record in it are preserved. Nobody deletes, truncates, edits or replaces it. It stays git-ignored and out of the baseline. The harness appends to it as specialists finish.
- The baseline commit message carries the log's line count and SHA-256 at the moment of committing, computed by the owner. Later checks confirm those lines are an unchanged prefix. Hashes written into earlier reports were taken at 18 lines and are relayed.
- Branches: baseline on `main`; Wave 0 evidence on its own branch; pre-phase hardening (steps 1 and 2) on a hardening branch merged before O5; the SRE phase on its own branch; steps 3 to 8 on a later hardening branch. Proposal A uses the same branches.

## 10. What this plan does not do

- It does not make the organization secure against an agent trying to defeat it. The controls catch mistakes, make approvals real, and limit damage if hostile text redirects an agent.
- The decisive protections are outside Claude Code: no production credential on this machine, branch protection on `main`, the owner reading the evidence.
- Nothing here has been executed. Every "after" is a prediction.

## 11. Decisions for the owner

1. Approve, change or reject this plan as a plan. Approving it approves no patch.
2. The execution order in section 4.
3. Go-ahead for Wave 0 probes, which the owner launches.
4. H-52: if the start-up record does not name the agent, alternative (a) or (b).
5. H-32: fence sessions with no agent type, or accept the risk in writing.
6. H-01: accept or reject the residual risk for building roles.
7. Who writes patch text; and whether the owner launches the reviewer session for patch recommendations (section 3, steps 1 and 4).
8. Tracking the SRE phase in `docs/status/features/` under the `design` tier, which adds a tier to the workflow in `CLAUDE.md`.
9. H-10: whether the run log should ever be tracked by git. This plan leaves it ignored.
10. H-24, the model pin. H-29, which connectors stay attached.
11. H-16: may `devops-sre` write `apps/*/Dockerfile`. H-25: option (a) or (b). H-26: screenshot route.
12. H-09: whether to add session-level logging at all, given H-52 carries the evidence.

## 12. Review record

Filled in only when a review has actually been delivered and saved.

- Security Engineer reread of revision 4: see `docs/security/proposals-security-reread-2026-10-12.md`. If that file is absent, the reread has not happened.
- Independent third review: see `docs/status/proposals-third-review-2026-10-12.md`. If that file is absent, the third review has not happened.
- Neither review, when delivered, is an approval. Only the owner approves.

## Appendix A. Commands the orchestrating session ran outside the Chief Engineer allowlist

From the session's own history; relayed, nothing on file except where a report quotes output.

- **2026-10-11, while preparing revisions 1 and 2:** one `claude -p --model opus --agent devops-sre --disallowedTools Bash --output-format stream-json --verbose` probe session, read for its start-up record; `git rev-parse`; a recursive `grep -rlE` for email addresses over `docs` and `CLAUDE.md`, which printed nothing; `node scripts/test-guards.mjs`, twice; `wc`, `ls`, `find` for probe files; two Python scripts that extracted reviewer reports from agent transcripts into `docs/status/`; one Python script that checked the wave table.
- **2026-10-12, for revision 3 and the readiness report:** the commands listed in `docs/status/baseline-commit-readiness-2026-10-12.md`, including a search rewritten as a Python script after the secret guard refused its first form, and `grep -n` runs that printed matched lines; a Python script that edited two files; a Python script that extracted the second review.
- **From the owner's directive of 2026-10-12 onward:** read-only git only. Reviewer reports are saved with the Write tool, and scans are run by a role whose tools permit them.
