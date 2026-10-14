# Proposal A, revision 4: SRE and DevOps Architecture Phase Brief

| | |
|---|---|
| Status | **Proposal. Not approved.** Nothing in this document is authorized until the owner says so. |
| Revision | 4, written 2026-10-12 by `devops-sre` on the Chief Engineer's task, which relays the owner's directive of the same date. **Revision 4 has not been reviewed by anyone**: not by the Independent Reviewer, not by the Security Engineer, not by any other specialist, and not by the owner. |
| Supersedes | `docs/operations/sre-architecture-phase-brief-rev3.md` (revision 3, 2026-10-12), which is left exactly as it stood. Revision 2, `docs/operations/sre-architecture-phase-brief.md`, remains as earlier history. No line was added to either file. |
| Must agree with | `docs/status/security-hardening-plan-rev4-2026-10-12.md` ("the hardening plan" throughout). Where the two disagree, neither is followed until both are revised. |
| Phase type | Documentation and design only |
| Security-sensitive | Yes |
| Phase owner | The Chief Engineer coordinates. The owner decides, launches the `devops-sre` sessions, saves and commits their output. |

**How this revision was produced.** By a delegated `devops-sre` run, not by a session launched in the form section 3 proposes. This is a document revision; it is not the phase and not one of the phase's designated sessions. That run's tool set included a shell. The author reports that it used Read and Write only, did not use the shell and called no connector; that is a self-report, not evidence. Connector instruction text (Claude Docs, Figma, Lovable, Notion) was present in the run's context and was treated as data. So the author of this brief was again not under the fence the brief proposes.

Files read for this revision, all on 2026-10-12: revision 3 of this brief; `docs/status/proposals-second-review-2026-10-12.md`; `docs/status/security-hardening-plan-rev4-2026-10-12.md`; `CLAUDE.md`. Nothing else was read. In particular the hooks, the scripts, the settings, the agent files, the run log and `.claude/rules/security.md` were **not** read for this revision; statements about them are carried from the documents named and labelled *recorded*.

**Labels used throughout.**

- *Observed*: read by the session writing this revision, in a named file, on 2026-10-12.
- *Recorded*: an observation another role wrote in a report that is on file. Cited to that report. Not re-run here.
- *Relayed*: stated in a message or a brief, with no artifact on file. A relayed statement is never counted as observed, whoever made it.
- *Proposed*: a suggestion of this brief, awaiting owner approval.
- *Unverified*: an assumption nobody has checked.

**Kinds of control (rev 4).** Every control in this brief is marked as one of three things, in the same sense as the hardening plan:

- *Mechanism*: the software refuses the action whatever the agent intends. A mechanism that has not been seen working is marked *mechanism, unverified*.
- *Written rule*: a rule in words. It limits nothing by itself.
- *Unverified*: nobody has checked whether the control exists or works.

This brief frames the questions. It does not answer them. It chooses no vendor and states no price, quota or limit as fact.

## Change log

**Revision 2 (2026-10-11)**, after reviews by the Software Architect, the Security Engineer and QA: the no-shell fence; preconditions; reworded acceptance criteria; missing content on uploads, webhooks, signing keys, backup isolation, audit, personal data, CI supply chain, admin access, roots of trust, security monitoring, email and background work; one rule against duplicated writing; fifteen deliverable rows; an owner checkpoint after areas F and A; price verification made conditional.

**Revision 3 (2026-10-12)**, after the Independent Reviewer's report (`docs/status/proposals-independent-review-2026-10-11.md`), which recommended "approve with named changes (revise)":

1. **Controls for this phase** (new section 1): only the owner launches the designated session; one row per capability; confinement to `docs/operations/`; nested instruction files forbidden.
2. **Evidence.** The five-tool observation is relabelled *relayed*. The label definitions no longer count a Chief Engineer statement as observed. An owner-run capture is a precondition.
3. **Launch and tracking** (new section 3): the launch form with the prompt position stated; the owner-saved session file as the record; how the report reaches the Chief Engineer; hollow delegations forbidden; the run log preserved as an unchanged prefix.
4. **Tracking** (section 8): an explicit `design` tier; a hand ledger file, stated as not yet existing; the date rule stated as having no mechanical effect.
5. **Acceptance criteria** (section 9): each has a pass condition, an exact check, a runner who can actually run it, and saved evidence. Search patterns are in the brief. Criteria 10, 13, 17 and 19 are rewritten. Five criteria are added (22 to 26).
6. **Preconditions** (section 2): six, including the capture and the connector decision. Hardening is not run in parallel with the phase.
7. **Missing content** from the reviewer's table A1 added to section 6 as questions and required content.
8. **Planning scenarios** (new section 4), on the owner's instruction: three labelled scenarios replace the long list of owner inputs. The owner is asked only for inputs that change the architecture.
9. **Deliverables** (section 7): every row has an exact file name; the four owner decisions are named; the attribution of the deliverable composition is corrected.
10. **Appendix**: one row per reviewer item, with where it is answered.

Corrections of fact made in revision 3: revision 2 said twice that the tracking file exists. It did not (a read of `docs/status/sre-architecture-phase.md` by revision 3's author returned "File does not exist"; the second review's listing also found it absent).

**Revision 4 (2026-10-12)**, after the Independent Reviewer's second report (`docs/status/proposals-second-review-2026-10-12.md`), which recommended "ready with named minor changes" for this proposal, and to bring the brief into line with revision 4 of the hardening plan. **Revision 4 has not been reviewed by anyone.**

*The named corrections*

1. **The intended role is checked before launch (A-N1).** The launch capture must show the session ran as `devops-sre`, not merely that its tool list looks right: the start-up record's field naming the active agent, if one exists, and one owner-authorized out-of-lane write that the path guard must refuse naming the role (section 3.6). The same identity requirement is added to criterion 17.
2. **One write that must succeed and prohibited writes whose refusal states its source (A-N2).** A session that refuses every write cannot pass as a working fence (section 3.6).
3. **Search patterns corrected.** S2 uses word boundaries, so `undecided` no longer matches (A-N3). S6 has exact owner commands that save file names and line numbers only, in a case-insensitive and a case-sensitive form (A-N4). Section 9.2.
4. **The Chief Engineer's session (A-N5)** is stated to belong to the phase and to sit outside the confinement boundary, with its own table (section 1.4), rules 21 to 24 and risk 12.
5. **Order of the four closing sections made explicit (A-N6)** in section 6, and criterion 24 reworded to match.
6. **Hostname layout added to area A's required content (T-10).**

*Reconciliation with the hardening plan, revision 4*

7. **One execution order, O1 to O9** (section 2), replacing preconditions P1 to P6. It is the plan's section 4 and is the single order for both documents.
8. **Phase baseline.** Criteria 2, 3 and 23 compare against the phase-opening commit (O5), not the foundation baseline.
9. **Ledger, not hand tracking.** The phase is tracked in `docs/status/features/SRE-001-architecture-phase.md` under the proposed `design` tier. The hand ledger `docs/status/sre-architecture-phase.md` is removed from every section, from deliverable row 15 and from every criterion.
10. **Stage evidence** uses the plan's two stage-line forms, with the five checks, their stated limits, and the identity alternatives as an owner decision (section 8).
11. **Run log.** The proposed file `baseline-run-log.txt` is dropped. The line count and SHA-256 are recorded by the owner in two commit messages (section 3.5, criterion 22).
12. **Connectors** are decided at O1, and the capture's start-up record must show the result.
13. **Branches.** The phase branch is named, and checkpoint commits are stated as the owner's (section 3.7).
14. Every reference to the hardening plan points at revision 4.

*Owner inputs and record keeping*

15. The current answer to each of the five owner inputs is recorded as `unknown` (section 4.4).
16. *Observed* labels that revision 3 attached to files this revision's author did not read are relabelled *recorded*.
17. A second appendix table maps each second-review item for Proposal A to where revision 4 answers it.

Not changed: the labels, the planning scenarios, the six scope areas (apart from items 5 and 6 above), the deliverable composition of fifteen rows and seventeen files, the numbering of the 26 acceptance criteria, and the first appendix table.

---

## 1. Controls for this phase

Evidence: mixed, labelled inline.

### 1.1 Who launches the designated session

**Only the owner can authorize and launch the designated `devops-sre` session.** On the guards as they stand, no fenced role can launch it (recorded: first review section A4, citing `path-guard.mjs:46`), and the Chief Engineer does not. The owner launches each session at their own terminal, in the form given in section 3, saves its output and commits the saved file. A session started any other way is not a session of this phase, and nothing it writes counts toward a deliverable. Kind of control: written rule. The evidence that it was followed is the owner's own commit of each session file.

### 1.2 Confinement

**`devops-sre` is confined to `docs/operations/` for the whole phase.** During the phase it makes:

- no connector or MCP invocation of any kind;
- no package or manifest modification (`package.json`, `.npmrc`, lockfiles, workspace file, tooling config);
- no installation of anything;
- no infrastructure mutation, no deployment, no spending, no external account change;
- no state-changing git.

**A nested `CLAUDE.md` or `.claude/` folder inside `docs/operations/` is forbidden**, at any depth. The Independent Reviewer checks the file listing after each `devops-sre` session, not only at the end (section 3.4, criterion 23).

The one exception, and only if the owner chooses identity alternative (a) in section 8.4: each phase session begins with a single attempt to write one named file outside `docs/operations/`, which the path guard must refuse. That attempt is owner-authorized, is named in the task file, and is expected to create nothing.

**The confinement boundary described in sections 1.2 and 1.3 is drawn around `devops-sre` only.** The Chief Engineer's session is inside the phase and outside this boundary. Section 1.4 says what applies to it.

### 1.3 Each capability considered separately: `devops-sre`

**Removing the shell does not by itself restrict connector access, the file-writing tools, or access to project configuration.** The table takes each capability on its own.

| Capability | What the role could do with it | Control that applies | Mechanism, written rule, or unverified | What detects a breach | Still unverified |
|---|---|---|---|---|---|
| Shell | Anything: delete or rewrite any file including the guards and the run log, install packages, run git, start a nested session. | Removed at launch with `--disallowedTools Bash`. | Proposed as a mechanism; **unverified**. Its effect is relayed, not on file: the Chief Engineer reported that a session launched this way was given Read, Grep, Glob, Write and Edit. No artifact of that exists. | The first record of the owner-saved session file lists the tools. The O3 capture is the first such record. The proposed ledger check 4 (section 8.3) refuses a session file whose tool list holds a shell. | Everything, until the O3 capture. Also whether the option applies to a delegated run; this brief does not rely on that, because the phase uses direct launches only. |
| Write and Edit | Write any path the path guard allows the role. Recorded (revision 3's author read `.claude/hooks/path-guard.mjs` lines 25 to 36; not re-read here): `.github/`, `deploy/`, all of `docs/operations/`, `Dockerfile` names at any depth (so also inside `.claude/`), `docker-compose` files at any depth, `.env.example`, `package.json`, `pnpm-workspace.yaml`, `.npmrc`, `.nvmrc`, `.editorconfig`, `.gitignore`, `tsconfig*.json`, the ESLint config and `.prettierrc*`. With no shell, all of these are still writable. Line 28 also admits `docs/operations/CLAUDE.md` and `docs/operations/.claude/`. | (1) The path guard, for every path the role does not own. (2) The written rule in 1.2, for the paths the role owns outside `docs/operations/`. (3) Proposed additional control: launch-time deny rules passed with the `--settings` launch option, denying edits to those owned paths for that session only, with no change to project configuration (section 3.2). | (1) Mechanism, recorded as seen refusing for eight roles (hardening plan section 2); **whether it applies to a session launched in this form is unverified** until capture item C5. (2) Written rule only. (3) **Unverified; to be tested by the owner in the capture** (item C6). Until tested, the control on the role's other owned paths is the written rule plus detection against the phase baseline. | The file listing against the phase-opening commit after every session (criteria 2, 3, 23). The tool-call records in the session file. | Whether launch-time deny rules work as described, and their exact syntax. Whether a nested instruction file would load (recorded as unverified by the first review). Whether the session file records every tool call with its target path. |
| Read, Grep and Glob | Read any file the machine user can read, inside or outside the project, and so bring its content into the session and into the saved session file. | Reads stay inside the project **by rule**. Secret-named files are blocked by the existing deny rules and the secret guard (recorded: hardening plan section 2; the guard itself was not read for this revision). | Written rule for the project boundary: **nothing enforces it**. Mechanism for secret-named files only, and only by name. | The owner or a reviewer reading the tool-call records in the session file for any path outside the project. | Whether the name-based guard has the gaps the reviews predict (static analysis, never executed). Whether Grep and Glob are granted at all. |
| Connector and MCP tools | Create or change resources in an external account, send mail, spend credits. None of this needs a shell. Recorded (hardening plan section 2 and H-29): the hook matchers name built-in tools only, so no guard sees a connector call, and the run log does not record one. | The rule in words: **no connector invocation of any kind during the phase.** At O1 the owner decides which connectors stay attached and detaches the rest (no file changes). Proposed: launch with `--strict-mcp-config` so no connector is attached to the session. | Written rule. The O1 detaching is an owner action outside the repository. The launch option is proposed and **unverified**. | The saved start-up record must show which connector servers and tools the session had (capture item C2; criterion 17). Pass means none. Any tool call whose name marks it as a connector tool, anywhere in the session file, is a breach. | Whether `--strict-mcp-config` removes connectors attached at account level. Whether connector instruction text still reaches the session when no connector tool does. |
| Web tools | Fetch pages, and send data out inside a requested address. | Expected absent: the relayed tool list holds none. If the capture shows any, the owner adds it to `--disallowedTools` and captures again. No agent verifies prices in this phase (section 5). | Unverified until the capture. Then a mechanism for the tools named. | The start-up tool list in each session file. | Whether any web tool is attached by default in this launch form. |
| Starting other agents or nested sessions | Hand work to an unfenced session, or to an agent type the guard does not know. | Impossible without a shell or an agent tool. | Mechanism, if the tool list holds neither; unverified until the capture. **The saved tool list is the evidence.** | The start-up tool list in each session file. | Whether a skill or plugin can start work without appearing in the tool list. |

If a session finds a shell, a connector tool, a web tool, an agent tool, or any tool beyond the set captured at O3, it stops before writing anything and says so in its report. The owner then decides.

### 1.4 The Chief Engineer's session (rev 4)

**The Chief Engineer's coordinating and review session belongs to the phase but sits outside the confinement boundary drawn for `devops-sre`.** It writes the task files, delegates to the Software Architect, the Security Engineer, SAGE and the Independent Reviewer, reads every report and maintains the ledger's lines. Nothing in section 1.3 applies to it.

On the guards as they stand it has no agent type, so the path guard does not fence it, and it holds a shell and connectors (recorded: hardening plan section 1 and finding H-32, static, citing `path-guard.mjs:63-64`; second review A-N5). Fencing such sessions is the hardening plan's step 3, which comes at O8, after the phase. **During the phase the controls on this session are a written rule plus detection after the fact. None is a mechanism.**

| Capability | What the session could do with it | Control during the phase | Mechanism, written rule, or unverified | What detects a breach | Still unverified |
|---|---|---|---|---|---|
| Shell | Anything the owner's account can do in the working tree: change guards, scripts, settings, the run log, git state. | It runs only what the `chief-engineer` allowlist admits: read-only git and the ledger check (hardening plan section 1). | **Written rule.** The allowlist exists in the path guard but is not applied to a session with no agent type (static, recorded). | Criteria 2 and 3 against the phase-opening commit, for tracked and untracked files. Criterion 22 for the run log. | Whether a new session actually starts as `chief-engineer` and is fenced (hardening plan H-23). Any command that changes nothing in the tree leaves no trace these criteria can see. |
| Write and Edit | Write any path, including `.claude/`, `scripts/`, `CLAUDE.md` and another role's deliverable. | It writes only under `docs/status/`. | **Written rule.** | Criteria 2 and 3. A change to another role's deliverable under `docs/` is inside the allowed folders and is **not** caught by criterion 2; it is visible only in `git diff` against the owner's checkpoint commits (section 3.7), read by the Independent Reviewer. | Whether the path guard would fence it; static reading says not. |
| Read, Grep and Glob | Read any file the machine user can read. | It reads inside the project only. | **Written rule** for the project boundary; mechanism by name for secret-named files (recorded). | Nothing on file: this session's tool calls are not saved by the owner in the way `devops-sre` session files are. | Everything. |
| Connector and MCP tools | Create or change external resources; spend credits. | It invokes no connector. Whatever the owner leaves attached at O1 remains callable. | **Written rule.** The O1 detaching reduces what is reachable; it is an owner action. | Nothing in the repository. No guard sees a connector call and the run log does not record one (recorded). | Which connectors remain attached to this session after O1. |
| Web tools | Fetch pages; send data out inside a requested address. | Not used during the phase. | **Written rule.** The hardening plan lists the main session as still open for web tools. | Nothing on file. | Whether this session holds a web tool. |
| Starting agents | Delegate to the nine specialist roles. This is its intended function. | It delegates only to the roles named in section 7.2, one writing agent at a time, and never delegates merely to create a run record (section 3.5). It does not launch `devops-sre` for phase work. | **Written rule** for which roles and when. Each delegated role is itself fenced by the path guard under its own agent type (mechanism, recorded as seen refusing for eight roles). | The run log, which records delegated runs and is a corroborating record only. Criterion 22 keeps its earlier lines unchanged. | Whether a delegated role holding a shell stays in its lane; the hardening plan treats that at O8. |
| Response to a guard refusal | Rewrite, split or script the refused command, or route it through another tool. | **It stops the operation, preserves the refusal text, and asks the owner.** | **Written rule** (the owner's directive of 2026-10-12, recorded in the hardening plan section 1). | The owner, and the Independent Reviewer's reading of what was reported. | Nothing mechanical enforces it. |

The owner is asked to accept this in writing or to decide otherwise (section 11, item 16). The only alternative that makes any row a mechanism is to bring the hardening plan's step 3 forward of the phase, which changes the single order and so means revising both documents.

---

## 2. Execution order and preconditions

Evidence: proposed. The order is taken from the hardening plan, section 4 (observed there on 2026-10-12).

**This is the single order for both documents.** The hardening plan revision 4 states the same order. **Changing it means revising both documents first.**

| # | What | Who | What it means for this brief |
|---|---|---|---|
| O1 | Owner decisions, **including which connectors stay attached** (the owner detaches the rest; no file changes). | Owner | The connector decision is made here, before anything else, not at the end of the hardening work. The decisions this brief asks for in section 11 are taken here too, except the two that depend on what the capture shows (items 6 and 7), which are taken after O3 and before O4. The five inputs of section 4.4 are answered here or left `unknown`. |
| O2 | Foundation baseline commit on `main`. | Owner | The commit message carries the run log's line count and SHA-256 at that moment. No extra file. |
| O3 | Wave 0 verification, **which includes this brief's launch capture** (section 3.6). | Owner launches; the plan assigns the recording of Wave 0 results to QA | For the capture, the record is the owner-saved session file itself; nothing typed afterwards substitutes for it. Probe and throwaway files are removed by the owner before the evidence is committed. |
| O4 | Pre-phase hardening: step 1, then step 2, by the route in the plan's section 3. Merged to `main` by the owner. | Owner applies | **Step 2 puts the `design` tier and its evidence binding into the ledger check.** Until step 2 is applied and its tests have been run by the owner, the tier does not exist. |
| O5 | **The owner opens the phase by committing the ledger** `docs/status/features/SRE-001-architecture-phase.md`. | Owner | **That commit is the phase baseline.** Its message also carries the run log's line count and SHA-256 at that moment. The ledger header marks the phase `security-sensitive: yes`, so the Security Engineer's review is decided at the start. |
| O6 | The phase runs on its own branch (section 3.7). | Per this brief | **No hardening change and no Wave 0 probe happens during the phase.** |
| O7 | The phase is accepted or not. | Owner runs the ledger check; Independent Reviewer; owner decides | Section 9. |
| O8 | Remaining hardening: steps 3 to 8. | Plan's section 3 route | After the phase. Before any agent with a shell does real work. |
| O9 | Wave 2 of the hardening plan. | Plan's section 3 route | Outside this brief. |

**Preconditions of the phase: O1 to O4, in that order. All four are owner actions. None is done by `devops-sre`.** O5 is the act of opening. The phase does not open unless:

- every O1 decision this brief needs has been taken or expressly deferred, and the connector decision has been taken;
- the foundation baseline commit exists;
- the launch capture has passed every item of section 3.6 that applies;
- **steps 1 and 2 have been applied by the owner and the owner's own run of the guard suite shows the step 2 tests passing.**

**The `design` tier and its checks are proposed in the hardening plan. They are not implemented. Nothing in this brief has seen them work.** If step 2 is not applied, or its tests do not pass, the phase does not open; this brief offers no fallback to hand tracking.

**No hardening change and no Wave 0 probe happens during the phase** (written rule; detected by criteria 2 and 3). Any change under `.claude/` or `scripts/` between O5 and O7 fails those criteria. Because steps 1 and 2 are merged before O5, the criteria need no exception for hardening.

How revision 3's six preconditions map onto this order: P1 (baseline commit) is O2; P2 (owner inputs), P3 (approval of the brief and the tracking method) and P6 (connectors) are O1; P5 (capture) is part of O3; P4 (security-sensitive from the start) is the ledger header committed at O5.

---

## 3. Launch and tracking of directly launched sessions

Evidence: proposed throughout, except where labelled.

### 3.1 Launch form

The owner launches each `devops-sre` session in this form:

```
claude -p --model opus --agent devops-sre --disallowedTools Bash --strict-mcp-config --output-format stream-json --verbose "<brief>" > docs/testing/evidence/sre-phase/<date>-devops-sre-<n>.jsonl
```

**The prompt is last, and never directly after an option that accepts several values.** Recorded (first review A3 item 5; hardening plan H-42): a prompt placed directly after the multi-valued `--allowedTools` was swallowed as a tool name; the same behaviour for `--disallowedTools` is unverified. In the form above the prompt follows `--verbose`, which takes no value.

| Option | Intended effect | Status |
|---|---|---|
| `-p` | Non-interactive run that prints its output | Unverified until the O3 capture |
| `--model opus` | Names the model; recorded in the validation record that a session without a model flag failed | Unverified until the O3 capture |
| `--agent devops-sre` | Runs as the role, so the path guard applies | Unverified until the O3 capture, items C3 and C5. A tool list that looks right does not show this. |
| `--disallowedTools Bash` | Removes the shell | Unverified until the O3 capture, item C1 |
| `--strict-mcp-config` | Attaches no connector, since no connector configuration is passed | Unverified until the O3 capture, item C2 |
| `--output-format stream-json` | Emits the harness's own records, one per line | Unverified until the O3 capture |
| `--verbose` | Required for the full record stream in this output format (unverified) | Unverified until the O3 capture |
| `> <file>` | The owner's shell saves the output; no agent writes it | Unverified until the O3 capture |

`<brief>` is proposed to be one sentence pointing at a task file the Chief Engineer has written under `docs/status/` and the owner has read. That keeps the prompt short and avoids quoting problems. The owner creates the evidence folder before the first launch.

Unverified, and capture item C4 will show it: whether Write succeeds in a non-interactive session launched this way without a permission prompt. If it does not, the owner chooses the change. This brief proposes no permissive mode and no standing allow rule.

### 3.2 Launch-time deny rules (proposed, unverified)

If the owner adopts them, a `--settings` option is added before `--output-format`, carrying deny rules for Edit and Write on: `.github/`, `deploy/`, any `Dockerfile*`, any `docker-compose*` file, `.env.example`, `package.json`, `pnpm-workspace.yaml`, `.npmrc`, `.nvmrc`, `.editorconfig`, `.gitignore`, `tsconfig*.json`, the ESLint config, `.prettierrc*`, and any `CLAUDE.md` or `.claude/` path under `docs/operations/`. The exact rule syntax is unverified and is the owner's to establish. Nothing in project configuration changes.

The test of these rules is item C6 of the capture (section 3.6). Recorded (second review, A3 item 2): on a static reading the list covers every `devops-sre` pattern at `path-guard.mjs:25-36`; the rules themselves are unverified.

### 3.3 The saved file is the record

- The saved file is the harness's own output. Its first record lists the session id, the model, the tools and the connector servers. Its last record holds the specialist's report. (Record contents are unverified until the capture. Whether the first record also carries a field naming the active agent is unverified; see C3.)
- **The owner saves it. No agent types it.**
- **The owner reads it, then commits it.** The commit hash is what the ledger line cites (section 8.2). The owner's commit is the anchor of the evidence.
- The owner tells the Chief Engineer the path, the session id and the commit hash. The Chief Engineer reads the report from that file and checks the file listing.
- Limits, stated plainly: nothing proves the file was not edited between saving and committing. After the commit, a change is detectable (ledger check 1, once it exists). The file holds everything the session read, so the owner reads it before committing it.

### 3.4 After every `devops-sre` session

1. The owner reads and commits the saved file, and gives the Chief Engineer its path, session id and commit hash.
2. The Chief Engineer reads the first and last records and the file listing.
3. The Independent Reviewer, by delegation, checks the listing against the phase-opening commit: every new or changed path is under `docs/operations/` (or is the committed session file under `docs/testing/evidence/sre-phase/`, or a Chief Engineer file under `docs/status/`), and none is named `CLAUDE.md` or lies under a `.claude/` folder. It also reads the start-up record.
4. The result goes into the ledger before the next session is launched: the stage line for the deliverable (section 8.2) and one entry in the ledger's `Session checks` section (section 8.5).

One limit: a file created during the phase is untracked until the owner commits it, so a later edit to it is invisible to git until then. Checkpoint commits are covered in section 3.7.

### 3.5 The ledger and the run log

- Each stage line in the ledger cites **either** the run-log `agentId` of a delegated run **or** an owner-saved, owner-committed session file, in the two forms of section 8.2. Delegated runs are used for the other roles; session files for `devops-sre`.
- **Nobody runs a trivial delegation merely to create a run record. That is forbidden.** A directly launched session leaves no run record and has no `agentId` (recorded: hardening plan H-09). Under the plan's proposal a `session:` line is checked without consulting the run log at all, so no run record is needed for the phase's main author and no historical run record can satisfy its lines.
- The run log `.claude/logs/agent-runs.jsonl` and all its existing records are preserved. **Nobody deletes, truncates, edits or replaces it.** It stays git-ignored and untouched, and is not part of any commit. The harness appends to it as delegated specialists finish.
- **There is no baseline file for the run log.** Revision 3 proposed `docs/testing/evidence/sre-phase/baseline-run-log.txt`; that file is dropped and is not created. Instead **the owner records the log's line count and SHA-256 in the commit message of the foundation baseline (O2) and again in the commit message of the phase-opening commit (O5)**, each computed by the owner at the moment of committing.
- At acceptance, the lines counted at O2 and the lines counted at O5 must each still be an unchanged prefix of the file (criterion 22). Hashes written into earlier reports were taken at 18 lines and are relayed (hardening plan section 9); they are not used.

The hardening plan states the commit-message record for the baseline. Recording it a second time at O5 is added here on the Chief Engineer's task for this revision; it is consistent with the plan's sentence "Later checks confirm those lines are an unchanged prefix", but the plan's O5 row does not print it. If the plan's next revision differs, both documents are aligned before O5.

### 3.6 The launch capture, part of O3 (rev 4)

One trivial session, launched by the owner in the exact form of section 3.1 (with the `--settings` option added if the owner is testing launch-time deny rules), saved raw. It is a Wave 0 item: it needs the owner's express go-ahead, an agent saying the owner agreed is not authorization, and it happens before O4. **The capture must show that the session really ran as `devops-sre`, not merely that its tool list looks right.**

The capture's task asks the session to report its tools and then to attempt three writes, each to a single named throwaway file:

| Write | Named throwaway file | Required outcome |
|---|---|---|
| W1, authorized | `docs/operations/_capture-authorized-write.txt` | **Must succeed.** |
| W2, out of lane | `_probe-sre-out-of-lane.txt` at the repository root: outside `docs/operations/`, outside every protected folder (`.claude/`, `scripts/`, `.git/`, `.github/`, `.vscode/`), and outside every path the launch-time deny rules name | **Must be refused by the path guard, naming the role.** |
| W3, deny-rule test; only if the owner is adopting the rules of section 3.2 | `deploy/_probe-sre-deny-rule.txt`: inside the role's own lane as the path guard sees it, so the path guard would allow it | **Must be refused, and the refusal must name the launch-time deny rule as its source.** |

Whether a non-interactive session continues after a refused write is unverified. If it does not, the owner runs one capture session per write and saves each.

**Pass conditions. The phase opens only if every applicable item holds.**

- **C1. Tools.** The start-up record shows no shell, no agent tool, no web tool, and the expected five tools: Read, Grep, Glob, Write, Edit.
- **C2. Connectors.** The start-up record **shows the result of the O1 connector decision**. For a `devops-sre` session the pass condition is: no connector server and no connector tool. If connectors the owner chose to keep at account level still appear in this session, `--strict-mcp-config` does not do what is intended; the phase does not open until the owner has decided what to change and captured again.
- **C3. Identity, by record.** **If the start-up record carries a field naming the active agent, it must say `devops-sre`.** Whether such a field exists is unverified, and the capture will show it. A field that names any other agent, or none where the field exists, is a fail. If no such field exists, C3 is recorded as "no field" and identity rests on C5 for the capture and on the owner's decision in section 8.4 for the phase's sessions.
- **C4. An authorized write succeeds.** W1's tool result shows success and the file appears in the listing. **A session that refuses every write cannot pass as a working fence.** The owner removes the file afterwards.
- **C5. Identity, by mechanism.** W2 is refused, the refusal recorded in the session file is the path guard's and **names the role**, in the form "devops-sre does not own <path>" (the form is recorded from the hardening plan section 7, citing `path-guard.mjs:87`; not read here), and no such file exists in the listing. **If the write succeeds, the session was not fenced as the role: the owner removes the file and the phase does not open.** A refusal that names a different role, or no role, or comes from somewhere other than the path guard, does not pass C5.
- **C6. Deny rules, if adopted.** W3 is refused, no such file exists, and **the saved refusal states its source: the named launch-time deny rule.** For any prohibited write the source must be stated: the path guard by role name (C5), or the named launch-time deny rule (C6). **A bare "permission not granted" does not count as a pass for the deny-rule test**: it could equally come from a session that refuses every write, and C4 exists to rule that reading out. If W3 creates the file, the rules do not work as launched; the owner removes the file (and the `deploy/` folder, if the write created it) and the control on those paths stays a written rule. If W3 is refused without a stated source, the test is inconclusive and the control likewise stays a written rule. Neither outcome of C6 alone stops the phase opening; it decides which kind of control section 1.3 may claim.
- **C7. Prompt position.** The session's first input is the capture's task text, showing that the prompt was not swallowed by an option (hardening plan H-42).
- **C8. Record contents.** The first record carries the session id, the model, the tool list and the connector servers; the last carries the report; and it is noted whether each tool-call record carries its target path. Criterion 17 and ledger check 3 depend on the first of these.

**Housekeeping.** The owner removes all three throwaway files before the capture's evidence is committed, so none of them exists at O5. If W2 is refused as required and W3 is refused, only W1's file ever existed. The removal is the owner's own action at the owner's terminal.

One caution about W2's location. That the role owns no file of that name at the repository root is a reading of the ownership list recorded by revision 3, not an observation of this revision. If the path guard unexpectedly allows W2 because the name falls inside a pattern the role owns, the test is void, not passed; the owner picks another path outside the lane and repeats it.

If the capture shows anything other than a pass on C1 to C5, C7 and C8, the phase does not open until the owner has decided what to change and captured again.

### 3.7 Branches and commits (rev 4)

Recorded (hardening plan section 9): baseline on `main`; Wave 0 evidence on its own branch; pre-phase hardening (steps 1 and 2) on a hardening branch merged before O5; the SRE phase on its own branch; steps 3 to 8 on a later hardening branch. This brief uses the same branches.

- **Phase branch name (proposed):** `phase/sre-001-architecture`. The hardening plan says the phase runs on its own branch and does not name it; the name is this brief's proposal and the owner may choose another.
- **Proposed:** the owner creates the branch from `main` after the step 1 and step 2 merge, and makes the phase-opening commit (O5) as the first commit on it. The plan does not say on which branch the O5 commit is made; this is for the owner to decide (section 11, item 14). The proposed ledger check derives the opening commit as the commit that first added the ledger file, wherever that commit sits.
- **Every commit during the phase is the owner's.** No agent commits, and `devops-sre` has no shell with which to try. This is a written rule for the other sessions: the hardening plan records that four roles still hold a shell that could run `git commit` until step 6 (static).
- **Checkpoint commits.** The owner's commit of each saved session file is required by the `session:` stage-line form, so it is not optional. Proposed: in the same checkpoint the owner also commits the deliverable files that session wrote and the Chief Engineer's ledger lines, so that any later edit to them shows in `git diff`. Whether to commit at other moments is the owner's choice.
- Nothing is merged to `main`, pushed or released during the phase. A merge to `main` after acceptance is a separate owner decision under `CLAUDE.md` gate 6.

---

## 4. Planning scenarios

Evidence: proposed. Every figure in this section is an illustrative assumption.

The owner has not supplied traffic, file sizes, catalogue size, download volume or recovery requirements, and none may be invented. The phase works from three labelled scenarios: **low**, **base** and **high**. Every analysis states which scenario it is written for.

### 4.1 The scenario table

The structure is fixed: five rows, three scenarios. The values are placeholders so that the documents have something to reason against. The owner may replace any of them at any time; a replaced value is then labelled "supplied by the owner" with the date.

| Row | Low | Base | High |
|---|---|---|---|
| Monthly operating cost ceiling | 25 currency units (illustrative assumption, not supplied by the owner) | 100 currency units (illustrative assumption, not supplied by the owner) | 400 currency units (illustrative assumption, not supplied by the owner) |
| Typical and maximum digital-asset size | typical 50 MB, maximum 300 MB (illustrative assumption, not supplied by the owner) | typical 200 MB, maximum 1 GB (illustrative assumption, not supplied by the owner) | typical 1 GB, maximum 5 GB (illustrative assumption, not supplied by the owner) |
| Number of published products | 50 (illustrative assumption, not supplied by the owner) | 500 (illustrative assumption, not supplied by the owner) | 5,000 (illustrative assumption, not supplied by the owner) |
| Monthly downloads and traffic | 200 downloads, 5,000 visits (illustrative assumption, not supplied by the owner) | 2,000 downloads, 50,000 visits (illustrative assumption, not supplied by the owner) | 20,000 downloads, 500,000 visits (illustrative assumption, not supplied by the owner) |
| Acceptable order-data loss and recovery time | up to 24 hours of order data re-created from the payment provider's records; service restored within 2 days (illustrative assumption, not supplied by the owner) | up to 1 hour re-created; restored within 8 hours (illustrative assumption, not supplied by the owner) | up to 5 minutes re-created; restored within 1 hour (illustrative assumption, not supplied by the owner) |

### 4.2 What holds in every scenario

- **Confirmed order and payment records are treated as high-integrity data in every scenario.** The last row describes how much recent data may need re-creating from another source after a failure. It never means a confirmed order may be permanently lost.
- **Final recovery objectives and cost commitments are not set in this phase without the owner reviewing the trade-offs.**
- **Every RPO and RTO is a proposal per scenario.**

### 4.3 How the four owner decisions depend on the scenarios

The last column is an expectation to be tested by the phase, not a finding. All of it is unverified.

| Owner decision | Scenario rows it depends on | Would the recommended option be expected to differ between low and high? |
|---|---|---|
| 1. Hosting and deployment environment | Cost ceiling; asset size (request size and duration, if uploads or downloads pass through the host); downloads and traffic; recovery time | Expected yes. A low ceiling may rule out anything always running; high volume may need a second process and more than one instance. |
| 2. MongoDB operating model | Cost ceiling; order-data loss and recovery time; downloads and traffic; number of products (slightly) | Expected partly. The size and backup features wanted would differ. Whether one person should operate a database themselves is expected to have the same answer in all three. |
| 3. Whether Redis is necessary | Downloads and traffic; the number of running instances, which follows from decision 1 | Expected the same in low and base. It may differ in high, if more than one instance must share short-lived state. |
| 4. Object storage, large-file delivery and download authorization, including the upload path | Asset size; downloads and traffic; cost ceiling; number of products | Expected yes. This is the decision most sensitive to maximum file size and download volume, because data transferred out is the main variable cost. |

Each decision record carries a section "Scenario sensitivity": the recommendation under low, base and high, and the single input that would change it.

### 4.4 The only inputs asked of the owner (O1)

These five materially change the architecture. Each may be answered "unknown", in which case the phase analyses both answers.

1. **Roughly how large is the largest file you expect to sell: hundreds of megabytes, or several gigabytes?** It decides whether a file can pass through the application at all, and how long a download link must live.
2. **Before the first sale, must running costs be close to nothing?** A yes removes every option that charges while idle.
3. **Must catalogue pages be findable by search engines and show link previews?** It changes the shape of the application, and so what kind of host is possible.
4. **Do you keep the original master files somewhere outside the platform?** It decides whether storage is the only copy, which changes the backup design.
5. **Is installing Docker acceptable, now or later?** It decides which local database options exist and how close local development can be to production.

**Current answers (rev 4).** None of the five has been answered. Each is recorded as `unknown` until the owner says otherwise; when the owner answers, the cell is replaced with the owner's words and the date.

| # | Input | Current answer | Basis |
|---|---|---|---|
| 1 | Largest supported file size | `unknown` | no evidence on file as of 2026-10-12 |
| 2 | Acceptable operating cost before the first sale | `unknown` | no evidence on file as of 2026-10-12 |
| 3 | Search-engine discoverability requirement | `unknown` | no evidence on file as of 2026-10-12 |
| 4 | Whether original assets are retained outside DreamDigital | `unknown` | no evidence on file as of 2026-10-12 |
| 5 | Whether Docker is acceptable | `unknown` | no evidence on file as of 2026-10-12 |

On input 5: it is recorded, and not observed by this revision's author, that an earlier validation session found Docker not installed on the owner's machine (as stated in the Chief Engineer's task for this revision; the validation record was not read here). That says what is installed. **Whether Docker is acceptable remains unknown.**

With all five `unknown`, the phase analyses both answers to each, and no document may write as though any of them had been answered.

**Everything else proceeds on the scenarios.** Customer geography, download limits per purchase, link lifetime, email at launch, a staging environment at launch and single-vendor preference are analysed as options under each scenario and come back to the owner inside the documents. Whether the repository is public is not asked: every deliverable is written as if it were (rule 18).

---

## 5. Purpose, authorization and exclusions

Evidence: mixed, labelled inline.

**Purpose (proposed).** Produce the written operational architecture for DreamDigital, so that every later infrastructure choice is made deliberately, with its cost and trade-offs visible to the owner before any money or effort is spent.

**What approving this brief authorizes.** Writing the documents listed in section 7, at the paths listed there, by the roles named there. Nothing else. Approving the brief does not open the phase (section 2), authorizes no hardening patch, and authorizes no probe; the launch capture needs its own go-ahead (section 11, item 5).

- **No agent verifies vendor prices in this phase.** Cost is described by driver and relative size. If the owner supplies a figure from a vendor's page, it is recorded with the link and the date.
- **Accepting a decision record approves a design direction only.** It does not authorize sign-up, spending or implementation. Each account, install, dependency and item of spending is approved separately, when it is about to happen.

**The scope is documentation-only.** `devops-sre` writes only under `docs/operations/`. There are no connectors, no package changes, no installations, no infrastructure changes, no deployment, no spending and no account changes.

**Out of scope. Each item needs its own separate, explicit owner authorization:**

- Any infrastructure implementation: accounts, hosted databases, storage buckets, servers, domains, DNS.
- Any CI file or anything else under `.github/`.
- Any install of any kind.
- Any change to `package.json`, `.npmrc`, a lockfile, `.gitignore`, `CLAUDE.md`, `.claude/`, `scripts/`, or any root tooling config.
- Any deployment, release, push, or merge to `main`.
- Any product code in `apps/` or `packages/`, and any repository scaffold.
- Signing up for any service, paid or free, and any spending.
- Choosing the payment provider, the authentication approach, or the application layout. The phase records what operations needs from those decisions; it does not make them.
- Screenshot tooling for QA. Revision 2 offered it as an agenda item; it is removed and belongs in a separate proposal.

**Why the exclusions are explicit.** Observed: `CLAUDE.md` gates 2, 4, 5 and 6 require owner approval for dependencies, paid services, destructive commands and deployments. Recorded (foundation validation review, findings R4 and R5, as cited by revision 2; not re-read here): those gates have no technical enforcement for `devops-sre`.

**Starting state.** Observed in `CLAUDE.md`: greenfield, no application code. Planned but unapproved baseline: React, Vite, TypeScript, Tailwind, Node.js, Express, MongoDB with Mongoose, Redis where justified, pnpm. Undecided: payment provider, file storage, authentication approach, hosting target, how MongoDB and Redis run locally, and the application layout. Recorded (both reviews): the folder is a git repository with no commits. One discrepancy, unresolved: the start-up context of the session that wrote this revision described the working directory as not a git repository; that is a harness statement, not a check this session ran, and both reviewers ran `git status` there. The owner's O2 will show which is right. Unverified by this session and by the reviewers: that MongoDB, Redis and the GitHub CLI are not installed on the owner's machine; for Docker see section 4.4. The owner is one person, learning as the project is built, and cost-sensitive.

---

## 6. Scope: questions, options, assumptions and required content

Evidence: proposed. Items marked **(rev 3)** were added in revision 3 from the first review's table A1. Items marked **(rev 4)** were added or changed in this revision. They are questions and required content. None is answered here.

Rules that apply to every area:

- Every option table has `Option` as its first column heading, names at least two alternatives, includes "do nothing or defer" where realistic, and is followed by a line beginning `Reason:`.
- **Analysis is written once, in the operations document; the decision is written once, in the decision record; neither restates the other.** For the four topics with a decision record, the operations document gives the options and an operational ranking; the record carries the single recommendation.
- Every recommendation line contains the words "awaiting owner approval".
- No price, quota or free-tier limit is stated as fact. A figure carries the vendor's page and the date checked, or the word "unverified", or a scenario label.
- A product named is an example of a category. Naming one is not a selection.
- A section that depends on an undecided item begins `Provisional: depends on <item>` (map in 6.G).
- "Appropriate to the project's scale" is the standard. A design a single owner cannot operate is a defect.
- **(rev 3, order made explicit in rev 4)** Every operations document (rows 1 to 7 of section 7.2) closes with four sections under these exact second-level headings, **in this order, as its last four sections, with nothing after them**:
  1. `Decisions for the owner`
  2. `What the owner does`
  3. `What this would later require`
  4. `Products named`

  So `Decisions for the owner` is fourth from the end, `What the owner does` is third from the end, `What this would later require` is second from the end, and `Products named` is the final section of the document. "What the owner does" lists each recurring task the design asks of the owner and how often. `none` is a valid entry in any of the four. Criterion 24 checks the second of these and its position; criterion 16 checks the third; pattern S8 relies on the fourth.

### A. Environment strategy

**Questions to answer**

1. Which environments exist at launch: local, test (CI), staging, production? Is staging justified on day one, or deferred with a stated trigger?
2. What differs between environments (data, credentials, third-party modes such as a payment sandbox, log level, domains) and what must be identical (runtime version, build artefact, schema)?
3. How is configuration separated? Where does each environment's configuration live and who can read it?
4. What is the naming convention and the inventory of environment variables, by name only? Which are secrets?
5. Where do secret values live for each environment, and how does a value reach a running process without touching the repository, a log or a command line?
6. How does the application fail when a required variable is missing: at start-up with a clear message, or later?
7. How does one developer on a new machine get to a running system, without Docker today? What are the exact steps? **(rev 3)** No duration is asked for: the steps will not have been run, so any duration given is marked unverified.
8. How are runtime and package-manager versions pinned so the local machine, CI and production match?
9. **(rev 3)** Which variables are visible to the browser? What rule keeps a secret from carrying the client-side prefix of whichever build tool is used?
10. **(rev 3)** Should the application refuse to start with a live key outside production, and with a test key inside it?
11. **(rev 3)** If a host creates a preview deployment per pull request, which secrets does it receive?
12. **(rev 3)** Given that a local env file on the development machine must be assumed readable by any code an agent runs there, what may such a file ever hold?
13. **(rev 3)** What is the proposed hostname layout, and what does each authentication approach require of it?

**Options to weigh**

| Option topic | Options | Trade-off to analyse |
|---|---|---|
| Environments at launch | (a) local and production only; (b) local, CI test, production; (c) all four | Fewer environments cost less and are simpler, but changes are first seen in production. Staging costs money and upkeep and drifts if neglected. |
| Secret storage | (a) the hosting platform's own secret store; (b) a dedicated secret manager; (c) git-ignored local env files for local only, combined with (a) or (b) | Fewer systems versus central audit and rotation. Local files are simple and the easiest to leak. |
| Version pinning | (a) a version file read by a version manager; (b) the `engines` and `packageManager` fields; (c) both | Each needs a file this phase does not create. |

**Assumptions to confirm with the owner.** One developer, one machine. No production credential ever sits on the development machine (observed rule in `CLAUDE.md`; the phase must say how production is then operated). Proposed default: a real customer data copy is never used outside production.

**The document must contain.** An environment matrix (environment by purpose, data, credentials, third-party mode, who can access). The configuration separation rules. A variable inventory by name with three flags: secret or not, **visible to the browser or not (rev 3)**, owning component. The secret flow per environment. The answers to questions 10 to 12 **(rev 3)**. **The proposed hostname layout and what each authentication approach would require of it, answering question 13; because the authentication approach is undecided, that section begins `Provisional: depends on authentication approach` (rev 4).** A proposed onboarding sequence, written as a proposal, not executed. A list of what each undecided item blocks.

### B. Deployment and delivery

**Questions to answer**

1. What is the shape of the pipeline: which checks run on a pull request, which on merge, which on release?
2. What are the gates, in order, and which are blocking: install from lockfile, type check, lint, unit and integration tests, build, dependency audit, secret scan, end-to-end tests?
3. Is one build artefact promoted through environments, or is each environment built separately? **(rev 3)** Asked separately for the front end and the API, since a browser bundle may have configuration written in at build time (unverified).
4. What triggers a production deployment, and where is the owner's approval recorded? `CLAUDE.md` gate 6 makes this the owner's decision every time (observed).
5. How is a release rolled back? What is the procedure when the release included a database migration? What is the migration ordering rule?
6. How are development and production credentials kept apart in CI, so a pull-request job cannot reach production?
7. What does CI need permission to do, and what is the least it can be given? How are third-party CI actions pinned and reviewed?
8. What branch protections are wanted on `main`, and which can a one-person repository actually use? Whether the owner's plan on the repository host supports them is unverified and can only be known from the owner's account.
9. How is the non-interactive limitation handled? Recorded in the validation record (D12) and the hardening plan (H-20): `ask` rules become refusals in non-interactive sessions.
10. **Payment webhooks.** What happens to a call from the payment provider that arrives while a release is in progress? How are such calls received on a development machine, given that a tunnel or provider tool would be an install? What retry behaviour is relied on? (Unverified and provider-dependent.)

**Options to weigh**

| Option topic | Options | Trade-off to analyse |
|---|---|---|
| CI platform | (a) the CI built into the repository host; (b) a separate CI service; (c) local checks only for now | Integration and one fewer account versus features and portability. Usage-based minutes are a cost driver; unverified. |
| Deployment trigger | (a) manual, owner-run; (b) automated on merge with a required approval step; (c) fully automatic | Control and learning value versus speed. Gate 6 rules out (c) without a recorded owner approval step. |
| Rollback | (a) redeploy the previous artefact; (b) revert commit and rebuild; (c) platform-level instant rollback | Speed versus dependence on a platform feature. None rolls back data. |
| Migration compatibility **(rev 3, split)** | (a) backwards-compatible "expand then contract" only; (b) migrate with downtime | Safety and rollback freedom versus effort. |
| Migration mechanism **(rev 3, split)** | (a) a migration tool; (b) hand-run scripts; (c) change on read | Repeatability versus one more dependency. |
| Credential separation | (a) per-environment secret scopes with approval on the production scope; (b) short-lived federated credentials; (c) separate accounts per environment | Strength of separation versus setup effort and what a host supports. |

**The document must contain.** A pipeline list with each gate marked blocking or advisory. The release procedure and the place approval is recorded. The rollback procedure, including the migration case and what rollback cannot undo. A CI permission table (job, credential, scope, environment, who can modify the job). The action-pinning and review rule. The treatment of inbound provider calls during a release and in local development. A list of every file implementation would later create.

### C. Reliability and observability

**(rev 3) Written in two passes.** The section `Critical journeys` is written first, in the requirements pass before area F (section 7.4). The rest follows the owner checkpoint.

**Questions to answer**

1. What are the critical user journeys? Proposed candidates: browse, sign in, pay, receive entitlement, download a purchased file, admin publishes an asset. Which define "the service is up"?
2. What does the application log, in what structure, and what must never be logged (secrets, tokens, payment data, signed download links, personal data beyond need)?
3. What does the infrastructure log, where do logs go, and how long are they kept?
4. Which metrics matter at this scale, and which are noise?
5. Is tracing justified at launch for a single API, or deferred with a stated trigger?
6. How are errors captured and how does the owner find out?
7. What do liveness and readiness checks test? What must readiness not expose publicly?
8. What deserves an alert? Who receives it, by what channel, when one person is the whole rotation and is sometimes asleep?
9. What availability objective is proposed **for each critical journey (rev 3)**, and what does each assume about hosting, the owner's response time and third-party dependencies?
10. **Paid but no entitlement.** How is a payment that produced no entitlement detected, and how fast?
11. **Admin publishes an asset.** What signal shows a large upload completed, and what detects a stored file with no catalogue record, or a record with no file?
12. What alert covers abnormal transfer volume or spend?

**Options to weigh**

| Option topic | Options | Trade-off to analyse |
|---|---|---|
| Log destination | (a) the host's built-in log view; (b) a hosted log service; (c) self-hosted | Zero setup and short retention versus search, retention and cost by volume. |
| Error monitoring | (a) logs only; (b) hosted error tracker; (c) self-hosted tracker | Cost and one more data processor versus finding failures before a customer reports them. |
| Metrics | (a) the host's built-in metrics; (b) hosted metrics service; (c) none beyond health checks at launch | Enough for launch versus cost by series and retention. |
| Uptime checking | (a) external uptime monitor; (b) none; (c) scheduled CI job as a probe | An external check is the only one that sees what a customer sees. |
| Tracing | (a) defer; (b) instrument with an open standard now, export nowhere yet; (c) full hosted tracing | Low value for one service versus cheap future-proofing. |

**The document must contain.** The critical journeys and the signal that shows each is healthy. A logging standard: fields, levels, correlation identifier, redaction list. Health and readiness check definitions. An alert table (condition, why it matters to a customer, channel, first action) including "paid but no entitlement". One table of availability objectives, one row per journey and scenario, each with its assumption and what happens if the assumption is false. A "deferred, with trigger" list.

### D. Data protection and recovery

**(rev 3) Written in two passes.** The section `Data classification` is written first, in the requirements pass before area F. The rest follows the owner checkpoint.

**Questions to answer**

1. What data exists and what does losing each kind cost: accounts, orders and payment records, entitlements, the catalogue, the master digital assets, the public previews, logs? **(rev 3)** Master files and public previews are separate classes: opposite access rules and opposite cost shapes.
2. Which data is the system of record, and which can be rebuilt from another source?
3. How is the database backed up: mechanism, frequency, location, account, encryption?
4. How are the stored digital assets protected? Is the owner's original copy a backup, and is that written down and tested?
5. How is a restore verified, how often, and into what target?
6. What is the retention period for backups and for customer data, and which legal or tax obligations affect it? (Unverified; depends on where the owner trades.)
7. What disasters are planned for: deleted database, deleted or corrupted assets, lost vendor account, compromised credentials, vendor outage, loss of the owner's machine, compromise of that machine or of an agent session?
8. What RPO and RTO are proposed for each data class, in each scenario?
9. How is each of the three isolation requirements below met?
10. **(rev 3)** After each disaster in question 7, what is inconsistent between the database, the file store and the payment provider, and how is it detected and repaired?

**Backup isolation is a requirement, not an option** (criterion 20):

- **Who can delete backups.** No credential held by the application, by CI or by an agent session can delete or overwrite a backup. The document names the identity that can.
- **Encryption key custody.** Who holds the backup encryption key, where the key itself is backed up, and what the loss of the owner's machine does to it.
- **Protection of the restore target.** How the target of a restore drill is protected, and whether a drill runs under production-grade controls or on scrubbed data.

**Options to weigh**

| Option topic | Options | Trade-off to analyse |
|---|---|---|
| Database backup | (a) a managed provider's built-in backups; (b) scheduled logical dumps to separate storage; (c) both | Convenience and a single point of failure versus independence, effort and storage cost. Plan features are unverified. |
| Asset protection | (a) object versioning; (b) a second copy in another region or provider; (c) the owner's offline master as the backup; (d) a combination | Protection against deletion versus protection against account loss. |
| Restore verification | (a) scheduled manual drill; (b) automated restore into a scratch target; (c) none | Proof versus effort and cost. Option (c) means the backup is unproven and must be labelled so. |
| How isolation is achieved | (a) a separate account; (b) separate credentials with no delete permission; (c) a retention lock, where a vendor offers one (unverified) | Strength versus setup effort. |

**How RPO and RTO must be written.** One table, seven columns, one row per data class and scenario:

> *Data class. Scenario. Proposed RPO. Proposed RTO. Assumption behind each. What it costs to achieve. What breaks the assumption.*

An RTO that depends on the owner being awake and at a computer must say so.

**The document must contain.** A data classification table with a personal-data flag on every row and masters and previews as separate rows. The backup design per data class. The three isolation statements. The restore procedure written as steps, including a reconciliation step against the payment provider, and the exact sentences "No restore has been tested. This backup design is unproven." A retention table. Disaster scenarios with the response to each and the answer to question 10. The RPO and RTO table. A statement of which parts are designed only and which are proven. In this phase, all of it is designed only.

### E. Security and operations

The Security Engineer reviews every part of this area and writes the review in `docs/security/`. The author of a document does not review it.

**Questions to answer**

1. What identities exist (owner, CI, application runtime, backup job, each agent role) and what is the least each needs?
2. Who can reach production, by what path, with which second factor, and how is each access recorded?
3. What is the secret inventory by name, the rotation trigger and interval for each, and who performs the rotation? Rule in the `devops-sre` role definition (present in this session's own instructions; the agent file was not read for this revision): `devops-sre` rotates nothing without the owner's explicit approval for that action.
4. What is the response when a secret is exposed? **(rev 3)** Does "read into an agent's context, a session transcript or a memory plugin" count as an exposure that triggers rotation?
5. What is audited: admin actions, entitlement grants and revocations, downloads, deployments, production access, configuration and secret changes? What does each record hold, how long is it kept, and where, so that neither the application nor one stolen owner credential can alter it?
6. What is the incident process for one person: severity levels, first actions, customer communication, the record written afterwards?
7. How are dependencies and vulnerabilities managed: lockfile policy, update cadence, audit in CI, response time by severity, install scripts?
8. What release controls protect `main` and production?
9. Which secret-bearing file formats would the recommended options introduce that the current guards do not cover? The guard change itself belongs to the owner's hardening work (`docs/status/security-hardening-plan-rev4-2026-10-12.md`, H-07), not to this phase.
10. **Webhook signing secret.** One per environment, test and live never shared? Rotation and its overlap window? What guarantees the signature is checked against the unmodified request body? Where does the durable idempotency record live? How are entitlements reconciled with the provider after a restore?
11. **Signed-link keys.** Which identity signs download links, and is it limited to reading single objects? How is the key rotated, and what happens to links already issued? Is there a kill switch? A replayed link is an egress-cost attack: what limits it?
12. **Personal data.** Which data classes are personal, and which vendors would process them? Where does personal data appear in logs, error reports and backups?
13. **CI supply chain.** Are actions pinned by full commit hash? Can any secret reach a job triggered from a forked pull request? Who can change a workflow file?
14. **Application admin access.** How is the first admin account created? What second factor and session lifetime apply?
15. **Roots of trust.** The owner's email account and the domain registrar can reset everything else. What protects each?
16. **Security monitoring and rate limiting.** Which security events raise an alert? Where is rate limiting enforced and where do its counters live?
17. **(rev 3) Card-data scope.** What is the intended card-data scope, and how does it constrain each hosting and logging option? The document states the intended scope as awaiting the owner's decision; it does not decide it.
18. **(rev 3) Manual production data change.** What is the procedure for a change made by hand in production, such as granting an entitlement? `CLAUDE.md` gate 5 makes it an owner decision (observed). How is it approved, performed and recorded?

**Options to weigh**

| Option topic | Options | Trade-off to analyse |
|---|---|---|
| Production access | (a) owner's personal account with a second factor; (b) separate operator identity; (c) no interactive access, changes through the pipeline only | Simplicity versus an audit trail and a smaller blast radius. |
| CI credentials | (a) long-lived stored keys; (b) short-lived federated tokens | Works everywhere versus nothing durable to steal. |
| Dependency updates | (a) manual, scheduled; (b) automated update pull requests; (c) automated with grouped, reviewed merges | Control and learning versus staying current. |
| Vulnerability scanning | (a) the package manager's audit; (b) the repository host's built-in alerts; (c) third-party scanner | Free and limited versus coverage, noise and another vendor. |
| Secret scanning | (a) the repository host's push protection; (b) a local pre-commit scanner; (c) both | (b) is a new dependency and a hook, which needs approval. |

**The documents must contain.** In `operational-security.md` (policy): the identity and permission matrix; the production access procedure; the secret inventory by name with rotation triggers, including the webhook signing secret per environment and the link-signing key; the dependency and vulnerability policy; the release control list; the list of secret-bearing file formats; **an audit section** answering question 5; the webhook and signing-key requirements; the personal-data processors; the CI supply-chain rules; the admin access design; the roots of trust; the security alert list and placement of rate limiting; the card-data scope statement **(rev 3)**; the manual production data change procedure **(rev 3)**. In `incident-response.md` **(rev 3: both runbooks together)**: the incident runbook with severity definitions, and the secret exposure runbook including the answer to question 4.

### F. Infrastructure and cost

Area F starts only after the requirements pass (section 7.4).

**Questions to answer**

1. For each backing service, should development use a local install, a container, a hosted instance or an in-memory substitute?
2. Where does MongoDB run in production, and what does each option cost to run and to operate?
3. **Ephemeral state and background work.** What short-lived state exists (sessions, rate-limit counters, idempotency records) and what work runs outside a request (processing after upload, email, reconciliation, clean-up, backups)? What is the smallest mechanism for each in each scenario? Does any of them justify Redis?
4. Where do large digital assets live, and what does delivering them cost? Data transferred out to customers is a primary cost driver and must be modelled for each scenario. **(rev 3)** Masters and public previews are analysed separately.
5. **What does "authorized per request" mean for downloads** (rule in `.claude/rules/security.md`, recorded by revision 3; not read for this revision)? Where does the entitlement check sit: when a link is issued, or on every byte? How long must a link live for a large file? What happens to a resumed download after expiry? What does an issued link allow after a refund? Is there a download limit per purchase?
6. Where do the web front end and the API run?
7. What does the system cost per month in each scenario? Which line grows fastest?
8. What is the exit cost from each option?
9. What limits or caps does each option offer on spend or transfer, and what happens to customers when one is hit? (Unverified.)
10. **Upload path.** How does a large file get into storage: through the API, or direct to storage? What does each require of the host and of the store?
11. **Transactional email.** Is email delivery a backing service at launch? What would it add in vendors, secrets, cost lines and DNS records?

**Options to weigh**

| Option topic | Options | Trade-off to analyse |
|---|---|---|
| Local MongoDB | (a) native install; (b) container, which requires Docker; (c) hosted development cluster; (d) in-memory server for tests only | Every option is an install, an account or a dependency. Compare offline working, onboarding effort and parity with production. **(rev 3) Transaction support is a named parity criterion:** whether each option can run the multi-document transactions the critical workflows need, in the mode production would use. Unverified for any MongoDB version; to be checked against the vendor's documentation. |
| Production MongoDB | (a) managed service from the database vendor; (b) managed service from another host; (c) self-managed on a server | Operational burden on one person versus cost and control. |
| Ephemeral state and background work | (a) in-process, correct for a single instance only; (b) database-backed; (c) managed Redis; (d) self-managed Redis | The burden of proof is on including Redis. Record the trigger that would justify adding it. |
| Asset storage | (a) hyperscale object storage; (b) S3-compatible storage with a different egress pricing model; (c) storage bundled with the application host | Vendors differ in whether and how they charge for transfer, requests and minimum storage duration. All unverified. |
| Upload path | (a) through the API; (b) direct to storage with a short-lived permission issued by the API; (c) out of band by the owner, with the application registering a file already placed | (a) is bounded by the host's limits. (b) depends on the store and makes upload validation harder. (c) is manual. |
| Download delivery | (a) signed, expiring links direct from storage; (b) proxied through the API; (c) a CDN with signed access | State for each where the entitlement check sits and what a leaked link allows. (b) may be charged for transfer twice (unverified). |
| Application hosting | (a) platform as a service; (b) a virtual server; (c) static hosting for the front end with a separate API host; (d) serverless functions | Operational burden, cost shape, cold starts, request limits, scheduled jobs and a second process. Option (c) presupposes an application shape. |
| Transactional email | (a) none at launch; (b) a hosted email service; (c) email bundled with another vendor | One more vendor and secret versus receipts and account recovery. |

**How cost must be written.** A cost model with named drivers (stored gigabytes, gigabytes transferred out, request counts, database size and tier, build minutes, log volume, seats), computed against the three scenarios. Every figure carries a scenario label, or a source link and date, or the word "unverified".

**The document must contain.** The scenario table as it stood when the document was written, with every cell labelled as supplied by the owner or illustrative. An options comparison per service with an operational ranking per scenario. The upload path analysis. The download analysis of question 5. The list of ephemeral state and background work with the mechanism proposed for each. The cost model with a sensitivity note on transfer, including the replayed-link case. A cost and vendor register with source and date for every figure. A scaling note stating what changes between scenarios and what would force a re-architecture.

### G. Sections that must be marked provisional

**(rev 3)** Criterion 19 is checked against this fixed map. An author may mark more sections; a section on this map may not be left unmarked while its item is undecided. The map is unchanged in revision 4. The hostname layout section of area A is marked provisional under the general rule above and is not a row of this map.

| Document | Section heading | Depends on |
|---|---|---|
| `environment-strategy.md` | Environment variable inventory | payment provider; authentication approach; file storage |
| `environment-strategy.md` | Onboarding sequence | local MongoDB and Redis; payment provider |
| `delivery-and-release.md` | Pipeline and artefacts | application layout |
| `delivery-and-release.md` | Migrations and rollback | application layout |
| `delivery-and-release.md` | Inbound provider calls | payment provider |
| `observability-and-reliability.md` | Health and readiness checks | application layout |
| `observability-and-reliability.md` | Alerts | payment provider; authentication approach |
| `observability-and-reliability.md` | Availability objectives | payment provider; authentication approach |
| `backup-and-recovery.md` | Backup design per data class | authentication approach; payment provider |
| `operational-security.md` | Identity and permission matrix | authentication approach; application layout |
| `operational-security.md` | Secret inventory | payment provider; authentication approach; file storage |
| `infrastructure-options-and-cost.md` | Application hosting | application layout |
| `infrastructure-options-and-cost.md` | Ephemeral state and background work | authentication approach |
| `infrastructure-options-and-cost.md` | Cost model | payment provider; authentication approach |
| Decision record: hosting and deployment environment | whole record | application layout |
| Decision record: ephemeral state and background work | whole record | authentication approach |

---

## 7. Deliverables, the four owner decisions and sequence

Evidence: proposed.

### 7.1 The four owner decisions the phase must bring back

Each comes back as a decision record by the Software Architect. Every record carries the words: **"Design decision only: accepting it does not authorize sign-up, spending or implementation."**

1. **Hosting and deployment environment.**
2. **MongoDB operating model**, in production and in local development.
3. **Whether Redis is necessary**, analysed as ephemeral state and background work.
4. **Object storage, large-file delivery and download authorization, including the upload path.**

**Decision record names.** `docs/architecture/decisions/ADR-NNNN-<title>.md`. **The number is assigned at creation** by the Software Architect, in order of creation; it is not printed here. The title part is fixed below, so the file can be found without knowing the number. Status is one of Proposed, Accepted, Rejected, Deferred, Superseded.

### 7.2 Deliverable table

Reviewer roles: **Sec** is the Security Engineer; **Arch** is the Software Architect; **IR** is the Independent Reviewer, who inspects every row; **CE** is the Chief Engineer; **Owner** approves. The Arch review of an operations document is limited to architectural constraints, consistency with the decision records, and the data-model angle of migration and restore; it records open questions for the Backend and Data Engineer, who has no part in this phase. The `devops-sre` review of a decision record is limited to checking that the operational analysis is represented correctly.

| # | Document | Exact file | Owner | Reviewers | Acceptance evidence |
|---|---|---|---|---|---|
| 1 | Environment strategy (area A) | `docs/operations/environment-strategy.md` | `devops-sre` | Sec, Arch, IR | Criteria 4, 5, 9, 10, 16, 19, 24, 25; environment matrix; inventory with the three flags; hostname layout |
| 2 | Delivery and release design (area B) | `docs/operations/delivery-and-release.md` | `devops-sre` | Sec, Arch, IR | Criteria 4, 5, 9, 16, 19, 24; gates marked blocking or advisory; CI permission table |
| 3 | Observability and reliability design (area C) | `docs/operations/observability-and-reliability.md` | `devops-sre` | Sec, **Arch**, IR | Criteria 4, 7, 9, 16, 19, 24; redaction list; alert table including "paid but no entitlement" |
| 4 | Backup, restore and disaster recovery design (area D) | `docs/operations/backup-and-recovery.md` | `devops-sre` | Sec, Arch, IR | Criteria 4, 6, 9, 11, 16, 19, 20, 24 |
| 5 | Operational security policy (area E) | `docs/operations/operational-security.md` | `devops-sre` | Sec, IR | Criteria 4, 9, 10, 16, 19, 21, 24, 25 |
| 6 | Incident response and secret exposure runbooks (area E) | `docs/operations/incident-response.md` | `devops-sre` | Sec, IR | Criteria 9, 16, 24; severity definitions; both runbooks present |
| 7 | Infrastructure options and cost model (area F), with the cost and vendor register | `docs/operations/infrastructure-options-and-cost.md` | `devops-sre` | Sec, Arch, IR | Criteria 4, 8, 9, 16, 18, 19, 24, 26 |
| 8 | Decision record: hosting and deployment environment | `docs/architecture/decisions/ADR-NNNN-hosting-and-deployment-environment.md` | `software-architect` | `devops-sre`, Sec, IR, Owner | Criteria 5, 12, 16, 19, 26; options named and linked, not restated; qualifier present |
| 9 | Decision record: MongoDB operating model | `docs/architecture/decisions/ADR-NNNN-mongodb-operating-model.md` | `software-architect` | `devops-sre`, Sec, IR, Owner | As row 8 |
| 10 | Decision record: ephemeral state and background work (whether Redis is necessary) | `docs/architecture/decisions/ADR-NNNN-ephemeral-state-and-background-work.md` | `software-architect` | `devops-sre`, Sec, IR, Owner | As row 8 |
| 11 | Decision record: object storage, delivery and download authorization, including upload | `docs/architecture/decisions/ADR-NNNN-asset-storage-delivery-and-download-authorization.md` | `software-architect` | `devops-sre`, Sec, IR, Owner | As row 8; placement of the entitlement check treated explicitly |
| 12 | Security review of the phase | `docs/security/sre-architecture-phase-review.md` | `security-engineer` | IR | Criterion 13 |
| 13 | Learning record | `docs/learning/sre-architecture-phase-before.md`, `docs/learning/sre-architecture-phase-during.md`, `docs/learning/sre-architecture-phase-after.md` | `sage` | IR | Criterion 15 |
| 14 | Independent review report | `docs/status/sre-architecture-phase-independent-review.md` | `independent-reviewer` writes nothing; CE saves the text | Owner | Criterion 14 |
| 15 | Phase ledger, `design` tier | `docs/status/features/SRE-001-architecture-phase.md` | **The owner creates and commits it at O5.** `chief-engineer` adds lines within `docs/status/`; each addition counts only once the owner has committed it. | IR, Owner | Criteria 1, 12, 13, 14, 15, 17, 18, 23, 24; the ledger check run by the owner at O7. The tier and the check are proposed in the hardening plan and are not implemented as of this revision. |

**Fifteen rows, seventeen files.** The count was re-examined in revision 3 and again here, and is kept: rows 1 to 12 are one file each, row 13 is three files, rows 14 and 15 one each. Row 15 changes its file and its owner; it does not change the count. The requirements pass and the planning scenarios are written into documents that already exist (rows 3, 4 and 7) and add no file. Four decision records are fixed by the owner's instruction, and the two runbooks stay in a file of their own because they are opened under stress; nothing else could be merged without hiding a document a reviewer must inspect separately.

Not counted as deliverables: the owner-saved session files and search outputs under `docs/testing/evidence/sre-phase/`, and the Chief Engineer's task files under `docs/status/`. If the owner authorizes a provisional system context (section 11, item 11), it is a sixteenth row: `docs/architecture/provisional-system-context.md`, by the Software Architect, reviewed by `devops-sre`, Sec and IR.

**On who proposed this composition.** Revision 2 said its fifteen rows were "as the Architect proposes". That overstated it. The Architect proposed fourteen rows with a different composition: local MongoDB moved into the environment document and the database record narrowed to production. Revision 2 did not follow that, and revisions 3 and 4 do not either, because the owner has named the MongoDB operating model as one decision. The composition here is this brief's own proposal.

### 7.3 QA's role and the content searches

Recorded (first review A4; hardening plan H-25): Grep and Glob are withheld from roles that hold a shell, so QA can search content only through its unrestricted shell. Using QA as it stands would put an unfenced shell role inside the phase, and it would stop working once the hardening plan (`docs/status/security-hardening-plan-rev4-2026-10-12.md`, H-01) restricts that shell. Three options:

- **(a) The owner runs the searches** with the patterns and commands in section 9.2 and saves the output. Recommendation, awaiting owner approval.
- **(b) QA is launched by the owner without a shell**, in the form of section 3.1 with `--agent qa-test-engineer`. The grant of search tools to such a session is itself relayed and must be shown by that session's start-up record. The session file is then the evidence of each search and its result. QA writes only under `docs/testing/`. **Option (b) does not cover S6**: a content search made with a search tool places the matched text in the session file, which is exactly what S6 must not do. S6 is run by the owner in either case (section 9.2).
- **(c) QA by ordinary delegation, with its shell.** Not proposed.

QA has no other deliverable: nothing is built and nothing can be executed.

### 7.4 Sequence

1. The order O1 to O5 of section 2. The phase is open only after O5.
2. SAGE before.
3. The provisional system context, only if the owner authorized it.
4. **Requirements pass (rev 3).** `devops-sre` writes the `Data classification` section of row 4 and the `Critical journeys` section of row 3. Arch reads both. Options cannot be ranked before it is written down what data exists and which journeys matter. **(rev 4)** Proposed: two sessions, one per document, so that each session file is cited for one deliverable (section 8.2).
5. Areas F and A. Then the four decision records, each after the document it rests on.
6. **Owner checkpoint** on the four decisions. The owner decides the records, gives a direction at the level of category, or expressly declines; whatever is declined is carried as provisional.
7. Areas B, the rest of C, the rest of D, and E.
8. Security review; independent review; SAGE after.
9. Remaining "Decisions for the owner" items, and acceptance of the phase (O7).

One writing agent at a time. Recorded (both reviews; hardening plan section 1): writing specialists very probably ran concurrently while revision 2 was produced, and the rule was broken again on 2026-10-12.

---

## 8. Tracking

Evidence: mixed, labelled inline.

### 8.1 Where the phase is tracked

- **The phase is tracked in `docs/status/features/SRE-001-architecture-phase.md` under the `design` tier.** The file is **created and committed by the owner at O5**. That commit opens the phase and is the phase baseline.
- **There is no hand ledger.** Revision 3 proposed `docs/status/sre-architecture-phase.md`, "tracked by hand; not machine-checked". That file is withdrawn. It was never created (recorded: second review, repository state) and is not to be.
- **The `design` tier and its checks are proposed in the hardening plan (`docs/status/security-hardening-plan-rev4-2026-10-12.md`, section 7; findings H-13, H-38, H-52, H-14; step 2). They are not implemented.** Observed in the plan: "No patch is approved or applied." **The phase does not open until step 2 has been applied by the owner and its tests have been run by the owner and passed.**
- Observed in `CLAUDE.md`: the workflow section knows substantial features, small changes and trivial edits, and no tier for documentation-only work. Using `design` adds a tier to that workflow. It is the hardening plan's decision 8 and this brief's item 3 in section 11: an explicit departure the owner is asked to approve.
- The tier's stages (observed in the plan, section 7): `sage-before`, `plan-approved`, `authoring`, `review`, `sage-after`. The ledger header's `security-sensitive: yes` adds `security`. The header also lists `devops-sre` under `no-shell:` (check 4 below) and keeps `accepted` and `learning-complete` as separate fields. The exact header is whatever the template holds after step 2; it was not read for this revision.
- **The opening commit is derived, not typed.** Under the plan, the checker finds the commit that first added the ledger file. Every path changed between that commit and the checked state must lie under `docs/`. A delegated run counts only if dated at or after that commit's time. Revision 3's remark that a typed `started` date has no mechanical effect is superseded by this.
- The ledger is created in `docs/status/features/` on the day the phase opens and is never copied in afterwards (the plan's answer to the second review's B-N2).

### 8.2 Stage evidence: the two line forms

The hardening plan's two forms, exactly as written there, **one agent per line, any number of lines per stage**:

```
- [x] <stage> | agent: <agent> | run: <agentId> | evidence: <path or words>
- [x] <stage> | agent: <agent> | session: <session id> | file: <saved session file> | commit: <hash> | evidence: <path or words>
```

- **Within `authoring`, one line per deliverable**, rows 1 to 11 of section 7.2, so that a missing document is visible. The `evidence:` field names the deliverable file.
- **For `devops-sre` the `session:` form is used**: the session id, the saved session file under `docs/testing/evidence/sre-phase/`, and the owner's commit of that file. Rows 1 to 7.
- For the Software Architect (rows 8 to 11), the Security Engineer (`security`), SAGE (`sage-before`, `sage-after`) and the Independent Reviewer (`review`), the `run:` form is used, citing the run-log `agentId` of the delegated run. Under the plan (H-14) a run record must be for that agent, non-null, used once, and dated at or after the opening commit.
- A deliverable written over more than one session (rows 3 and 4, because of the requirements pass) gets one line per session that wrote in it, so every writing session is cited.
- Proposed: the Chief Engineer's task files give each `devops-sre` session exactly one deliverable file. The plan does not say whether one session id may be cited on two lines; this avoids depending on the answer.
- The `plan-approved` line is the owner's. The plan restricts that stage to `owner` (H-37) and does not print how such a line is evidenced; it takes whatever form step 2, as applied, requires.

### 8.3 The five checks on a `session:` line, and what they cannot prove

As the plan states them. **The run log is not consulted at all for a `session:` line, so no historical run record can satisfy it.** All five are proposed and unimplemented.

1. The file exists, is present in the cited commit, and is byte-identical to the committed version.
2. The cited commit is at or after the opening commit.
3. The first record of the file parses and carries the cited session id.
4. The start-up record's tool list contains no shell for any agent the ledger header lists under `no-shell:`.
5. **Identity.** The session ran as the stated agent. How this can be established is the open point (section 8.4).

**The plan's own statement of what they cannot prove**, carried here without softening:

- The binding shows that a specific saved session, with that id and tool list, is cited, and that the file has not changed since the owner committed it. **It does not prove the session did good work.**
- **Anyone able to write the file and make the commit could fabricate both.** The owner's commit is the anchor. Until the plan's step 6, four roles hold a shell that could run `git commit` (static). The phase launches `devops-sre` without a shell, which removes that route for the phase's main author only.
- A session file holds whatever the session read. The owner reads it before committing.

To which this brief adds: nothing in the five checks reads the deliverable. Whether a document is adequate is decided by the reviewers and the owner against section 9.

### 8.4 Identity: an owner decision

Unverified today: whether the harness's start-up record names the agent the session ran as. Capture item C3 will show it.

- **If the capture shows such a field**, check 5 compares it with the line's agent. The plan calls this the preferred design, and criterion 17 then requires the field to say `devops-sre` in every cited session file.
- **If it does not**, the file alone cannot prove identity. The plan offers two alternatives, **for the owner to choose** (plan decision 4; this brief's item 6):
  - **(a)** Each phase session begins with one owner-authorized, harmless out-of-lane write that the path guard must refuse. The refusal message names the role, in the form "devops-sre does not own <path>", and the harness records it in the session file. Check 5 looks for that message naming the line's agent. **This is evidence produced by a mechanism.**
  - **(b)** The owner attests per session in the commit message. **This is a written statement**, and the checker can only find that the words are there.

Consequences for this brief if (a) is chosen: the attempt is the one exception stated in section 1.2; the proposed target is the same named file as capture write W2, `_probe-sre-out-of-lane.txt` at the repository root; a refusal creates nothing. If the write ever succeeds, a file exists outside `docs/` and the session was not fenced as the role: the session stops, nothing it wrote counts, the owner removes the file, and the phase halts for the owner's decision. This is the plan's identity step for a phase session; it is not a Wave 0 probe, and it is the only attempted write outside `docs/operations/` that any `devops-sre` session makes.

This decision is taken after O3, when the capture has shown whether the field exists, and before O4, because step 2 is where check 5 is implemented.

### 8.5 Other content of the ledger

Several criteria need a place for things that are not stage lines. Proposed: plain sections in the same ledger, none of them written as ticked stage lines, so that none can satisfy a stage:

- `Session checks`: one entry per `devops-sre` session, with the Independent Reviewer's listing result and the `agentId` of that reviewer run (criterion 23).
- `Decision index`: one numbered entry per decision record and per item under `Decisions for the owner` in rows 1 to 7 (criterion 12).
- `Undecided items`: the six-row table of criterion 18.
- `Owner statements`: the owner's words, with dates, for criteria 1, 13, 14 and 24.

**Unverified:** whether the checker, once step 2 is applied, accepts a ledger carrying such sections. The plan specifies the header and the stage lines and says a ticked line that matches no stage format is reported; it says nothing about other sections. If the applied checker rejects them, nothing is worked around: the owner decides where they go and both documents are revised.

### 8.6 Who writes the ledger, and its limits

- The owner creates the file and commits it. After that the Chief Engineer adds lines, within its own lane `docs/status/`. A line is part of the record only once the owner has committed it.
- The lines are typed by the role that coordinates the phase, in a session that is not fenced (section 1.4). What a reviewer can rely on is not the typing but what each line points to: an owner-committed session file, or a run-log record written by the harness.
- **At O7 the owner runs the ledger check** (the Chief Engineer's allowlist also admits that command, on a static reading recorded in the plan). Its pass is the plan's step and is necessary for acceptance; it is not sufficient. The 26 criteria of section 9 still apply, and the check reads none of the deliverables.
- **Nobody cites the checker's output for this phase before step 2 has been applied and its tests have passed.** Before that, a pass would say nothing true about the phase.

---

## 9. Acceptance criteria

Evidence: proposed.

### 9.1 Who can actually run a check

- **The Independent Reviewer** has Read and a few read-only git commands. It has no content search, cannot hash a file, and cannot run `node` (recorded: its own reports). It can read files and listings.
- **Content searches** are run by the owner, or, for every pattern except S6, by a role launched without a shell (section 7.3 option b). In the second case the grant of search tools is relayed and must appear in that session's start-up record. **S6 is run by the owner only.**
- **Hashes** are computed by the owner.
- **The ledger check** is run by the owner at O7.
- **The Security Engineer** reads; its statement that a finding is resolved is its own re-verification.

Numbers 1 to 26 are kept from revision 3 so that earlier references still hold. No criterion is added or removed in revision 4. In the table, **"the ledger"** means `docs/status/features/SRE-001-architecture-phase.md`, and **"the phase-opening commit"** means the O5 commit that first added it.

### 9.2 Search scope and patterns

**Scope.** The "deliverable set" is the files of rows 1 to 13 and nothing else. Never the whole tree.

**Form for S1 to S5, S7 and S8.** Extended regular expressions, case-insensitive unless stated. The runner records the tool and the exact command with the output. The proposed owner form is `grep -nEi '<pattern>' <files>`, redirected to `docs/testing/evidence/sre-phase/search-<id>.txt`. An empty output file means no hit. Whether each pattern behaves identically in every search tool is unverified; the saved command settles what was actually run. **This form is not used for S6**, for the reasons given below.

```
S1  recommend
S2  \b(we will use|we chose|we have chosen|will be used|selected|decided)\b
S3  \bRPO\b|\bRTO\b|recovery point|recovery time
S4  availab|uptime|[0-9]{2}(\.[0-9]+)? ?%
S5  [$€£₹]|\b(USD|EUR|GBP|INR)\b|dollar|\bcents?\b|per month|/mo\b|free tier|[0-9][0-9,.]* ?(KB|MB|GB|TB|requests|minutes|hours|seats)\b
```

**S2, corrected in revision 4.** Revision 3's S2 had no word boundaries, so the alternative `decided` also matched "undecided", a word area A is required to use; every such line would have failed criterion 5. The whole alternation is now enclosed in `\b( ... )\b`. Checking the other alternatives for the same fault: `selected` had it too (it matched inside "unselected", "deselected" and "preselected") and is now bounded; the four phrases beginning `we` or `will` gain a leading boundary, which stops a match that begins inside a longer word. Two limits remain. A hyphenated "un-decided" still matches, because the hyphen is a word boundary; authors write `undecided`. And a phrase such as "not yet decided" is a true hit, which is the pattern's purpose; authors write `undecided` for an open item.

A check the owner can run before relying on S2, which creates no file (written here, not run by this revision's author):

```
printf '%s\n' 'undecided' 'decided' | grep -nEi '\b(we will use|we chose|we have chosen|will be used|selected|decided)\b'
```

The intended output is the second line only. Whether `\b` is honoured by the owner's `grep` is unverified; S3 and S5 already depended on it in revision 3.

The other patterns were read for the same fault. S1 and S4 use stems on purpose (`recommend` is meant to catch "recommended" and "recommendation"; `availab` is meant to catch "available" and "availability"). S3 and S5 are bounded where a boundary matters. No other change is made.

**S6, the secret-pattern list (criterion 10).** For S6 only, **the saved output holds file names and line numbers and never the matching text**, so a real hit is not copied into an evidence file. **S6c, S6d and S6e are case-sensitive. S6a, S6b and S6f are not.**

```
S6a  -----BEGIN [A-Z ]*PRIVATE KEY-----
S6b  sk_live_|sk_test_|pk_live_|rk_live_|whsec_|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|github_pat_|xox[baprs]-|AIza[0-9A-Za-z_-]{20,}
S6c  [a-z][a-z0-9+.-]*://[^/[:space:]:@]+:[^/[:space:]@]+@
S6d  eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.
S6e  [A-Za-z0-9+=_]{32,}
S6f  ^[[:space:]]*[A-Z][A-Z0-9_]{2,}=[^<[:space:]]
```

S6b lists well-known key prefixes so that a scan can find them. Listing a prefix selects no vendor. S6e is the definition of a "long token-shaped string": any unbroken run of 32 or more of those characters. S6f finds a `NAME=` line whose value is neither empty nor in angle brackets.

**The exact owner commands for S6 (rev 4).** The generic form `grep -nEi` must not be used for S6: it prints the matched text, and it ignores case, which is wrong for S6c to S6e. Each S6 command pipes to a step that keeps only the file name and the line number **before anything is saved**. `<files>` is the list of deliverable files of rows 1 to 13.

For the case-insensitive patterns, S6a, S6b and S6f (shown for S6a; the output file is named for the pattern):

```
LC_ALL=C grep -HnEi -e '<pattern>' <files> | cut -d: -f1,2 > docs/testing/evidence/sre-phase/search-S6a.txt
```

For the case-sensitive patterns, S6c, S6d and S6e (shown for S6c):

```
LC_ALL=C grep -HnE -e '<pattern>' <files> | cut -d: -f1,2 > docs/testing/evidence/sre-phase/search-S6c.txt
```

What each part is for:

- `-H` prints the file name even when one file is given, so the first field is always a name.
- `-n` prints the line number as the second field.
- `-i` is present in the first form and **absent in the second**. That is the only difference between them.
- `-e` is required because S6a begins with hyphens and would otherwise be read as an option.
- `cut -d: -f1,2` keeps the first two colon-separated fields, the file name and the line number, and discards the matched text. The text passes through the pipe and is neither displayed nor saved. No deliverable file name contains a colon.
- `LC_ALL=C` makes the letter ranges mean exactly the letters written, so that case-sensitivity is real. It is used for S6 only; S5 contains currency symbols outside that character set.
- Six commands, six files: `search-S6a.txt` to `search-S6f.txt`. An empty file means no hit.

Limits, stated plainly. These commands were written for this revision and **have not been run by anyone**. An empty output file means "no hit" only if `grep` printed no error to the terminal; an error also leaves the file empty, and the owner is the only one who sees it. The owner does not re-run a hit with a form that prints text in order to look at it; the owner opens the named file at the named line.

```
S7a  [A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}
S7b  \b[0-9]{12}\b
S7c  s3://|gs://|r2://|\b[0-9]{1,3}(\.[0-9]{1,3}){3}\b
S7d  https?://
```

**S8, product names (criterion 18).** Each operations document's final section is `Products named` (section 6), listing every product or vendor name it uses. S8 is the union of those lists, joined as alternatives. The names in the planned baseline in `CLAUDE.md` are exempt.

### 9.3 The criteria

| # | Pass condition | Exact check | Who runs it | Evidence saved |
|---|---|---|---|---|
| 1 | Every file in section 7.2 exists at its exact name. For rows 8 to 11, exactly one file in `docs/architecture/decisions/` ends with the stated title. An absent file is listed in the ledger's `Owner statements` with the owner's words and the date. | Read of each path; listing of the decisions folder with `git status --porcelain --untracked-files=all` | IR | IR's report |
| 2 | **Against the phase-opening commit (O5)**, every created or changed path is under `docs/operations/`, `docs/architecture/`, `docs/security/`, `docs/learning/`, `docs/status/` or `docs/testing/`. No exception for hardening is needed or made: steps 1 and 2 are merged before O5. The run log is checked by criterion 22. This is narrower than the proposed ledger check, which requires only that changed paths lie under `docs/`. | `git status --porcelain --untracked-files=all --ignored` and `git diff --name-status <phase-opening commit>` | IR. The first command is recorded as admitted for IR; the second is admitted on a static reading only and is unverified. | Both outputs in IR's report |
| 3 | `package.json`, `.npmrc`, any lockfile, `.gitignore`, `CLAUDE.md`, `.github/`, `deploy/`, `apps/`, `packages/`, `e2e/`, `.claude/` (apart from the run log) and `scripts/` are absent or unchanged **against the phase-opening commit**. `.claude/settings.local.json` is absent. No `_probe` or `_capture` throwaway file exists anywhere. | The outputs of criterion 2; a Read of `.claude/settings.local.json` returning "does not exist" | IR | IR's report |
| 4 | Each of rows 1 to 5 and 7 contains an option table for every option topic that section 6 lists for its area. Every table whose first column heading is `Option` has at least two option rows and is followed by a line beginning `Reason:`. | Reading, against the topic lists in section 6 | IR | IR's report, one line per topic |
| 5 | Every S1 hit line contains "awaiting owner approval". Every S2 hit line is inside a decision record whose status is Accepted, Rejected or Deferred and which cites the date and place of the owner's statement. Each decision record has a status line with one of the five values and the qualifier of section 7.1. | Searches S1 and S2 (S2 as corrected in section 9.2); reading of each status line | Searches: owner or no-shell searcher. Status lines: IR. | `search-S1.txt`, `search-S2.txt`; IR's report |
| 6 | The RPO and RTO table in row 4 has the seven columns of area D and no empty cell. Every S3 hit that states a value is inside that table. | Reading; search S3 | Table: IR. Search: owner or no-shell searcher; IR reads each hit. | `search-S3.txt`; IR's report |
| 7 | Every availability objective is a row of one table in row 3, with a journey, a scenario and a non-empty assumption. Every S4 hit that states a target is inside that table. | Reading; search S4 | As criterion 6 | `search-S4.txt`; IR's report |
| 8 | Every S5 hit line carries a source link and a date, or the word "unverified", or a scenario label (low, base or high). This shows a source or label is present, not that the figure is right. | Search S5; reading of each hit | Search: owner or no-shell searcher. Reading: IR. | `search-S5.txt`; IR's report |
| 9 | In rows 1 to 12, the first line under every second-level heading is `Evidence:` followed by one of: observed, recorded, relayed, proposed, unverified, or "mixed, labelled inline". This checks form, not truth. | Reading | IR | IR's report |
| 10 | S6a to S6d and S6f return no hit. Every S6e hit is listed in the security review with a reason it is not a secret. The security review states that every file of rows 1 to 11 was read for secret values. A pass means "none found by this scan", not "none exists". | Search S6 with the two command forms of section 9.2, file names and line numbers only; reading | Search: **the owner only**. Reading and the S6e list: Sec. | `search-S6a.txt` to `search-S6f.txt`, with the six commands as run; the security review |
| 11 | Row 4 contains the exact sentences "No restore has been tested. This backup design is unproven." | Reading | IR | IR's report |
| 12 | The ledger's `Decision index` holds one numbered entry per decision record and one per item under `Decisions for the owner` in rows 1 to 7, and the counts match. No decision record contains a table whose first column heading is `Option`. | Reading and counting | IR | IR's report, with both counts |
| 13 | The security review exists at its exact name and holds: (a) a coverage table with one line for **every row that lists Sec as a reviewer, which is rows 1 to 11**, each marked "read in full", "read in part" with the part named, or "not reviewed"; none may be "not reviewed" at acceptance; (b) a table mapping each line of `.claude/rules/security.md` to the section that addresses it; (c) a findings table with Severity and State. "Resolved" means re-verified by the Security Engineer. The rule, quoted from `.claude/rules/security.md` line 13 (recorded: the second review read the file and found the quotation exact; not read for this revision), is: "An unresolved critical finding blocks a release recommendation." That rule speaks of releases, not of this phase. **This brief proposes, for the owner to approve:** an unresolved critical finding blocks acceptance of the phase, and an unresolved high finding needs the owner's written acceptance, recorded in the ledger's `Owner statements` by finding id. | Reading | IR reads. Sec declares a finding resolved. The owner accepts a high finding. | The security review; ledger entries by finding id |
| 14 | The saved independent review has an entry for each row of section 7.2 and each criterion here, as met, not met or not checkable. If the reviewer's raw session output was saved by the owner, the ledger cites it; otherwise the saved copy is labelled relayed. | Reading | The owner. Not the reviewer, which does not certify its own report. | The owner's note in the ledger's `Owner statements` |
| 15 | The three learning files exist. The ledger header holds `accepted` and `learning-complete` as separate fields. | Reading | IR | IR's report |
| 16 | Each of rows 1 to 11 has a section headed `What this would later require` with four lists: accounts, installs, dependencies, files. `none` is valid. In rows 1 to 7 it is the second-to-last section (section 6). | Reading | IR | IR's report |
| 17 | For every `devops-sre` line in the ledger, which is every `authoring` line for rows 1 to 7, the line is in the `session:` form and there is an **owner-saved, owner-committed session file** under `docs/testing/evidence/sre-phase/`, cited by session id, path and commit hash. Its first record shows the same session id, a tool list equal to the set captured at O3 with no shell, and no connector server or connector tool. **Identity (rev 4): the file shows the session ran as `devops-sre`.** If the O3 capture showed that the start-up record carries a field naming the active agent, that field says `devops-sre`. If it showed no such field, the evidence is the one the owner chose in section 8.4: under (a), a path-guard refusal recorded in the file in the form "devops-sre does not own <path>"; under (b), the owner's attestation in the commit message of that file, which is a written statement and is reported as such. A tool list that merely looks right does not satisfy this. Its last record holds a report with the six sections of `CLAUDE.md`. A list typed into the ledger is not evidence. A report's own "Commands run" is supporting only. | Read of the first and last records of each cited file, and of the refusal record under (a); `git show` of the cited commit's message under (b) | IR. The owner, if a record is too large for IR to read. Byte-identity with the committed version is the ledger check's (check 1), run by the owner. | The session files themselves; IR's report naming each and stating which identity evidence it found |
| 18 | The ledger's `Undecided items` table has a row for each of: payment provider, file storage, authentication approach, hosting target, local MongoDB and Redis, application layout. Each holds a decision reference, or `undecided` and what it blocks. Every S8 hit line is inside an option table, or contains the word "example", or is in a `Products named` section. A name left off every `Products named` list escapes the search; IR's reading is the only backstop. | Reading; search S8 | Table: IR. Search: owner or no-shell searcher. | `search-S8.txt`; IR's report |
| 19 | For every row of the map in section 6.G whose item is still `undecided` in the criterion 18 table, the named section exists and its first line after the `Evidence:` line begins `Provisional: depends on` and names that item. This checks the fixed map only. A dependency outside the map can be found only by reading, and the criterion does not claim otherwise. | Reading, row by row against 6.G | IR | IR's report, one line per map row |
| 20 | Row 4 states (a) which identity can delete or overwrite a backup, and that it is not the application's, CI's or an agent session's; (b) who holds the backup encryption key and where the key is backed up; (c) how the restore target is protected, and whether a drill uses production-grade controls or scrubbed data. | Reading | IR reads; Sec states its agreement or disagreement in its review | IR's report; the security review |
| 21 | Row 5 has an audit section stating the events in scope, what each record holds, the retention period, and where records are kept so that neither the application nor one stolen credential can alter them. | Reading | IR reads; Sec states its agreement or disagreement in its review | IR's report; the security review |
| 22 | **Two prefix checks.** The first N2 lines of `.claude/logs/agent-runs.jsonl` have the SHA-256 that the owner recorded, with N2, in the commit message of the foundation baseline (O2). The first N5 lines have the SHA-256 recorded, with N5, in the commit message of the phase-opening commit (O5). N5 is not less than N2, and the file has N5 lines or more. The log itself is git-ignored, untouched and preserved. | `git log -1 --format=%B <commit>` for each of the two commits, to read N and the recorded hash; then `head -n <N> .claude/logs/agent-runs.jsonl \| shasum -a 256` for each N | The owner. IR cannot hash. | The four commands and their output, saved as `run-log-check.txt` in the evidence folder. There is no `baseline-run-log.txt`. |
| 23 | No file named `CLAUDE.md` and no `.claude/` folder exists anywhere under `docs/operations/`. The check was made after **each** `devops-sre` session, and the ledger's `Session checks` section has one entry per session. | `git status --porcelain --untracked-files=all --ignored`, read for those names | IR, by delegation after each session | One `Session checks` entry per session, citing the run-log `agentId` of the IR run |
| 24 | Each of rows 1 to 7 has a section headed `What the owner does`, placed as **the second of the four closing sections in the order fixed in section 6**, so it is the third section from the end and is followed only by `What this would later require` and `Products named`. It lists each recurring task with how often, or `none`. The owner states in writing that the combined list is one they can carry, or names what must be cut. | Reading of the last four second-level headings of each document; the owner's statement | IR for presence and position. The owner for operability. | IR's report; the owner's words in the ledger's `Owner statements` |
| 25 | S7a, S7b and S7c return no hit. Every S7d hit is a vendor's public documentation page cited as a source, or a reserved example domain. No account identifier, bucket name, project identifier, internal address or personal email appears in any deliverable. | Search S7; reading of each S7d hit | Search: owner or no-shell searcher. Reading: IR. | `search-S7.txt`; IR's report |
| 26 | Row 7 contains the scenario table with every cell labelled "supplied by the owner" with a date, or "illustrative assumption, not supplied by the owner". Each of rows 8 to 11 has a section `Scenario sensitivity` giving the recommendation under low, base and high. No document describes a recovery objective or a cost ceiling as final or committed. | Reading | IR | IR's report |

---

## 10. Working rules for the phase

Evidence: proposed. Rules 9 to 24 are the Chief Engineer's rules for the phase, carried here for convenience; a brief drafted by one specialist does not bind the others on its own authority. Every rule in this section is a written rule. Where a mechanism also applies, section 1 says so.

**For `devops-sre`**

1. Every session is launched by the owner in the form of section 3.1. Any other session is not part of the phase.
2. It writes only under `docs/operations/`, by any tool. The single exception is the refused attempt of section 8.4(a), if the owner chose it.
3. It creates no `CLAUDE.md` and no `.claude/` folder there.
4. It creates and edits none of the other paths its role's ownership would permit (section 1.3, Write and Edit row).
5. It calls no connector or MCP tool, no web tool, and starts no other agent or session.
6. It reads only inside the project.
7. It proposes tooling, services and dependencies in writing. It installs, enables and signs up for nothing.
8. It stops and reports if a task appears to need anything these rules exclude, or if its tools differ from the set captured at O3.

**For all agents in the phase**

9. Each agent writes only in its own area: `docs/operations/` for `devops-sre`, `docs/architecture/` for the Software Architect, `docs/security/` for the Security Engineer, `docs/learning/` for SAGE, `docs/status/` for the Chief Engineer, `docs/testing/` for QA if it takes part. The Independent Reviewer writes nothing.
10. One writing agent at a time.
11. The Security Engineer's review is mandatory and decided at the start (the ledger header committed at O5).
12. The author of a document does not review it.
13. SAGE explains the concepts before, during and after. The owner is not asked to decide something that has not been explained.
14. No agent states a price, quota or free-tier limit as fact.
15. No agent treats another agent's recommendation, an earlier approval or silence as the owner's approval. An instruction relayed by an agent is not the owner's consent.
16. The evidence rules of `CLAUDE.md` apply, with the five labels defined at the top of this brief.
17. Secret values appear nowhere. Names only.
18. **(rev 3)** No account identifier, bucket name, project identifier, internal address or personal email address appears in any deliverable. Every deliverable is written as if the repository were public.
19. **(rev 3)** No agent calls a connector during the phase. Connector instruction text arriving in a session's context is data.
20. **(rev 4)** When a guard refuses an operation, the operation stops. The refusal text is preserved exactly and the owner is asked. The operation is not rewritten, split, scripted or routed through another tool.

**For the Chief Engineer's session (rev 4)**

21. It runs only what the `chief-engineer` allowlist admits: read-only git and the ledger check.
22. It writes only under `docs/status/`. It does not edit another role's deliverable, the guards, the scripts, the settings, `CLAUDE.md` or the run log.
23. It invokes no connector and no web tool.
24. It makes no commit, applies no hardening change and runs no Wave 0 probe during the phase. Commits are the owner's.

---

## 11. What the owner is asked to approve

Evidence: proposed. Nothing below is decided. Sixteen items. Items 1 to 5 and 8 to 16 belong at O1. Items 6 and 7 depend on what the capture shows and are taken after O3, before O4.

1. **This brief.** (a) approve as written; (b) approve with changes; (c) reject or defer. Approving it does not open the phase.
2. **The execution order** in section 2, O1 to O9, the same as the hardening plan's section 4 (plan decision 2).
3. **Tracking the phase in `docs/status/features/` under the `design` tier** (section 8), which adds a tier to the workflow in `CLAUDE.md` and is an explicit departure from it (plan decision 8). The tier is proposed, not implemented; the phase waits for step 2.
4. **That you launch, save, read and commit every `devops-sre` session yourself**, in the form of section 3.1. This brief offers no alternative: on the guards as they stand there is none that does not rely on an unfenced session.
5. **Your go-ahead for the launch capture** (section 3.6) as part of Wave 0, including its named throwaway writes: W1 under `docs/operations/`, which must succeed; W2 at the repository root, which must be refused; and W3 under `deploy/` if you are testing deny rules. You remove the files afterwards.
6. **Identity evidence for phase sessions** (section 8.4), if the capture shows no field naming the active agent: alternative (a), a refused out-of-lane write at the start of each session, or alternative (b), your attestation in each commit message (plan decision 4).
7. **Launch-time deny rules** (section 3.2): adopt after capture item C6 passes with its source stated, or leave the control as a written rule plus detection.
8. **Which connectors stay attached** to sessions in this project, decided at O1 before anything else (plan decision 10).
9. **Prices.** (a) you supply any figure you want used, with the vendor's page and date; (c) cost stays relative and unverified, checked at the moment of each purchase. Revision 2's option (b), a web tool for an agent, is withdrawn for this phase.
10. **Who runs the content searches** (section 7.3): (a) you; (b) QA launched by you without a shell, for every pattern except S6, which you run in either case.
11. **A provisional system context before area F.** The hosting options presuppose an application shape the phase is told not to decide. (a) authorize a one-page provisional context from the Software Architect, marked provisional and not a layout approval; (b) proceed without, with every operations document stating that it assumes the provisional layout in `CLAUDE.md`, and the hosting record unable to move beyond Proposed; (c) decide the layout first, as a separate phase. The Architect recommended (a); recommendation, awaiting owner approval.
12. **The deliverable list** in section 7.2.
13. **How the Independent Reviewer's final report reaches you.** (a) you launch that reviewer session yourself and save its raw output, so the report does not pass through a file the reviewed party saves; (b) delegated as usual, with the saved copy labelled relayed.
14. **The phase branch and its commits** (section 3.7): the name `phase/sre-001-architecture` or another of your choosing; whether the phase-opening commit is the first commit on that branch; and that every commit during the phase, including each checkpoint, is yours.
15. **The acceptance rule proposed in criterion 13**: a critical finding blocks acceptance; a high finding needs your written acceptance.
16. **The Chief Engineer's session during the phase** (section 1.4): that it works under written rules and after-the-fact detection, with no mechanism, until the hardening plan's step 3 at O8. Accept that in writing, or decide otherwise; deciding otherwise changes the single order and means revising both documents.

Not decisions of this brief: the four in section 7.1, which come back as decision records, and every vendor. Payment provider and authentication approach remain undecided and are not made here. The five inputs of section 4.4 are not approvals; each stays `unknown` until you answer it.

---

## 12. Risks and open questions

Evidence: mixed, labelled inline.

**Risks**

1. **The whole fence rests on a capture not yet made.** Until the O3 capture, every statement about what the launch form does is relayed or proposed, including whether the session runs as `devops-sre` at all.
2. **Three of the six capability controls on `devops-sre` are written rules.** Reads outside the project, writes to the role's other owned paths, and connector use are limited by words unless the capture and the O1 decision show a mechanism. Detection is after the fact.
3. **Detection depends on the phase baseline and on the owner.** Hashes, searches, session files, commits and the ledger check are all owner actions. That is more work for one person than revision 2 implied, and revision 4 adds to it: a commit per session and two commit-message records of the run log.
4. **The session file can hold whatever the session read.** It sits in the repository tree. The owner reads it before committing it.
5. **Illustrative values can anchor.** A placeholder repeated across seven documents may start to read as a requirement. Criterion 26 keeps the label on every cell; it cannot stop a reader skimming past it. All five owner inputs are `unknown`, which makes the placeholders carry more weight.
6. **Decisions depend on things not yet decided.** Payment provider, authentication approach and application layout shape the inventories and the backup scope. The map in 6.G marks the known cases only.
7. **Design is not proof.** No backup, restore, rollback, alert or pipeline will have been run. The documents must not read as if they had.
8. **Over-engineering.** Six areas of practice applied to a one-person shop can produce a design nobody can operate. Criterion 24 asks the owner directly.
9. **Volume.** Seventeen files is a lot to read and decide on. The checkpoint and SAGE's explanations are the mitigations; they do not shrink the reading.
10. **The ledger tier is proposed and does not exist.** The phase cannot open until the hardening plan's step 2 is applied by the owner and its tests pass. If step 2 is delayed or changes shape, the phase waits. Section 8 describes checks nobody has seen run, and the ledger's lines are still typed by an unfenced session; what holds is what each line points to.
11. **This revision is unreviewed by anyone**, and its author held a shell.
12. **The Chief Engineer's session is inside the phase and outside the confinement boundary (rev 4).** It has no agent type, so the path guard does not fence it, and it holds a shell and connectors (hardening plan H-32, static). During the phase it is governed by written rules: only what the `chief-engineer` allowlist admits (read-only git and the ledger check), writes only under `docs/status/`, no connector, stop and ask the owner when a guard refuses. **Its file changes are caught only after the fact, by criteria 2, 3 and 22 comparing against the phase baseline.** Three things those criteria do not catch: an edit to another role's deliverable inside `docs/`, which shows only in a diff against the owner's checkpoint commits; a connector call, which leaves nothing in the repository; and a read outside the project. The mechanism for this session is the plan's step 3, which the single order places after the phase.
13. **Two documents now share one order.** A change to either that touches O1 to O9 leaves them inconsistent until both are revised. Neither is followed while they disagree.
14. **Identity alternative (b) is a written statement.** If the start-up record has no agent field and the owner chooses (b), the identity of every phase session rests on the owner's words in a commit message, not on a mechanism.

**Open questions**

1. Which legal, tax and privacy obligations apply to the owner's business? This affects retention and incident notification and may need professional advice outside the agents' competence.
2. What is the trigger for the follow-on implementation phase, and is it one phase or several?
3. Does the start-up record carry a field naming the active agent? Unverified; capture item C3 will show it. Revision 3's question here, whether the checker would accept an owner-saved session file in place of an `agentId`, is answered as a proposal by the hardening plan's section 7.
4. The first review counted 39 files where its earlier record implied 40. The second review suggests the 39 was a miscount and says it cannot prove it. Needs the owner, or someone with the earlier raw listing.
5. Both reviews asked the owner to judge how the earlier revisions and the hardening plan were produced: commands outside the Chief Engineer's allowlist, an unrecorded probe session, and a refused command rewritten as a script. Not a matter this brief can settle.
6. The hardening plan puts Wave 0 evidence on its own branch and does not say whether that branch is merged before O5. Criterion 17 compares each session's tool list with the set captured at O3, so the capture file must be readable from the phase branch. Needs the owner; if the answer changes the plan, both documents are revised.
7. On which branch is the O5 commit made? Proposed in section 3.7; the plan is silent.
8. Will the applied checker accept the extra ledger sections of section 8.5, a `plan-approved` line for the owner, and one session id on more than one line? All three are unverified until step 2 exists.
9. The working directory was described to this revision's author as not a git repository, against both reviewers' successful `git status` runs. Unresolved; O2 will show it.
10. Has the Security Engineer re-read this proposal? The second review recorded that it had not re-read revision 3. Revision 4 has been re-read by nobody.

---

## Appendix 1: first-review items and where each was answered in revision 3

Source: `docs/status/proposals-independent-review-2026-10-11.md`. "Needs the owner" means the item cannot be closed by a document.

**This table is kept from revision 3 unchanged.** Its section references still hold in revision 4 except where revision 4 replaced the thing referred to. Read them as follows: `P1` is now O2, and for comparisons the phase-opening commit O5; `P5` is the launch capture of section 3.6, part of O3; `P6` is the connector decision at O1; "section 8" hand tracking and "the hand ledger" are replaced by the ledger of section 8; `baseline-run-log.txt` is replaced by the two commit-message records of section 3.5; "section 11 item 3" is now item 4, and "item 6" is now item 9.

| Item | What the reviewer raised | Outcome in revision 3 |
|---|---|---|
| A1-1 | SA-16, SA-01 item 4: no fence rule on connectors, network, out-of-project reads, nested sessions, state-changing git | Sections 1.2, 1.3; rules 5, 6, 19 |
| A1-2 | SA-12: browser-visible flag; live-key refusal; preview secrets; local env files; context as exposure | Area A questions 9 to 12 and required content; area E question 4 |
| A1-3 | SA-03: intended card-data scope | Area E question 17 and required content |
| A1-4 | SA-06: manual production data change | Area E question 18 and required content |
| A1-5 | SA-15: no account identifiers, bucket names, personal emails | Rule 18; criterion 25; patterns S7 |
| A1-6 | SA-10: coverage for rows 3 and 7 | Criterion 13(a): rows 1 to 11 |
| A1-7 | T-07: inconsistency after each disaster; transaction parity | Area D question 10; area F, Local MongoDB row |
| A1-8 | T-01: masters and previews as separate classes | Area D question 1 and required content; area F question 4 |
| A1-9 | B-04: Arch on row 3; `backend-data-engineer` nowhere | Section 7.2, row 3 and the note on the Arch review |
| A1-10 | D-03 step 2: requirements pass before area F | Section 7.4 step 4; areas C and D headers |
| A1-11 | S-02: "what the owner does" and an operability criterion | Section 6 common rules; criterion 24 |
| A1-12 | T-08: migration options mix two things | Area B, two migration rows |
| A1-13 | T-10: hostname layout | Area A question 13 |
| A1-14 | T-11: one availability target | Area C question 9; criterion 7 |
| A1-15 | B-05: one runbook in each of rows 5 and 6 | Area E required content; row 6 |
| A1-16 | X-04: rules bind roles other than the author | Section 10, opening line |
| A1-17 | X-07: a duration for steps never run; the owner's plan | Area A question 7; area B question 8 |
| A2-1 | The five-tool observation has no artifact | Section 1.3, Shell row: relayed; P5 |
| A2-2 | The label definition hides this | Labels at the top: Relayed added, Observed narrowed |
| A2-3 | "Exactly five tools" doubtful if connectors are attached | Section 1.3, connector row; P5; P6; rule 8 |
| A2-4 | "The tracking file exists" is wrong | Change log, corrections of fact; section 8 |
| A2-5 | "No configuration change is needed" holds only if someone outside the guards launches | Section 1.1; section 11 item 3 |
| A2-6 | "As the Architect proposes" overstated | Section 7.2, "On who proposed this composition" |
| A2-7 | Criterion 13 misquotes the security rule | Criterion 13: exact quotation, and the proposal stated as a proposal |
| A2-8 | "Docker, MongoDB, Redis and the GitHub CLI are not installed" unverified | Section 5, starting state: labelled unverified |
| A3-1 | Connectors: a no-shell session can still call one | Section 1.3, connector row; P6; criterion 17 |
| A3-2 | File tools: manifests, `.github/`, `Dockerfile` names, nested `CLAUDE.md` still writable | Section 1.3, Write and Edit row; section 3.2; criteria 3 and 23 |
| A3-3 | Run log excluded from comparison | Section 3.5; P1; criterion 22 |
| A3-4 | Fence evidence is a typed transcription | Section 3.3; criterion 17 |
| A3-5 | Launch form gives no prompt position | Section 3.1 |
| A4-1 | Who can launch the no-shell session | Section 1.1; section 11 item 3 |
| A4-2 | Reports do not flow back | Sections 3.3, 3.4 |
| A4-3 | The Chief Engineer cannot obtain a start-up tool list | Section 3.3: the owner saves it |
| A4-4 | Searches assigned to QA need its unrestricted shell | Section 7.3; section 9.1 |
| A4-5 | Decisions 2(b) and 6(b) need `.claude/` changes (stated correctly) | Both options withdrawn: section 11 items 3 and 6 |
| A4-6 | Lane assignments match `CLAUDE.md` | No change needed; rule 9 |
| A5-1 | Criterion 1: rows 8 to 11 have no file name; row 14's may change | Section 7.2: exact names; criterion 1 |
| A5-2 | Criteria 2, 3: only with a commit; hardening carve-out not checkable | P1 is a commit; carve-out removed; criteria 2 and 3 |
| A5-3 | Criterion 4: a table left off the document's own list escapes | Criterion 4 checks against the brief's topic lists and the `Option` column heading |
| A5-4 | Criterion 5: "nothing reads as decided" partly objective | Criterion 5 reduced to two searches and the status line |
| A5-5 | Criteria 6, 7: "none elsewhere" needs a search | Criteria 6 and 7; patterns S3, S4; runner named |
| A5-6 | Criterion 8: shows a citation exists, not that it is right | Criterion 8 says so; scenario label added |
| A5-7 | Criteria 9, 11, 15, 16, 20, 21: presence checks | Kept as presence checks, stated as such |
| A5-8 | Criterion 10: pattern list undefined and not in the brief | Section 9.2, S6; criterion 10 |
| A5-9 | Criterion 12: only once the tracking file exists | Section 8: created at opening; criterion 12 |
| A5-10 | Criterion 13: "resolved" rests on the Security Engineer's word | Criterion 13 states that plainly. Not removable: someone must hold that judgement. |
| A5-11 | Criterion 14: owner or QA | Criterion 14: the owner |
| A5-12 | Criterion 17: checks a typed record | Criterion 17: owner-saved session file |
| A5-13 | Criterion 18: "product names" has no list | `Products named` sections; pattern S8; the remaining gap stated |
| A5-14 | Criterion 19: "depends on" is a judgement | Section 6.G fixed map; criterion 19, with its limit stated |
| A6 | Nothing in the text exceeds documentation-only | No change needed. The production process: needs the owner (open question 5) |
| R-1 | Launch route | Sections 1.1, 3.1, 3.3 |
| R-2 | Fence scope | Section 1.3; P6; criterion 17 |
| R-3 | Evidence for the fence | Labels; section 1.3; P5 |
| R-4 | Tracking conflict; forbid the hollow delegation | Section 3.5; section 8 |
| R-5 | Correct "the tracking file exists" | Change log; section 8 |
| R-6 | Run log as append-only prefix, with hash and line count | P1; section 3.5; criterion 22 |
| R-7 | Name nested `CLAUDE.md` and `.claude/`; check after each session | Section 1.2; section 3.4; criterion 23 |
| R-8 | QA's shell and its consequences; patterns in the brief | Section 7.3; section 9.2 |
| R-9 | Add the missing content in A1 | Rows A1-1 to A1-17 above |
| R-10 | Requirements pass before area F | Section 7.4 step 4 |
| R-11 | The date rule does nothing while tracked by hand | Section 8 |
| R-12 | Decision 10 attribution; criterion 13 wording; file names for rows 8 to 11; low items | Section 7.2; criterion 13; rows A1-12 to A1-17 |
| RS-1 | The author of Proposal A was not under the fence; "used no shell" is a self-report | Header, "How this revision was produced"; risk 11. Still true of revision 3. |
| RS-2 | Writing specialists probably ran concurrently | Section 7.4, last line; rule 10. Whether it happened: needs the owner |
| RS-3 | Whether any existing file was edited cannot be determined | P1. The past is not recoverable: needs the owner |
| RS-4 | 39 files against 40 | Needs the owner (open question 4) |
| RS-5 | The orchestrating session ran commands outside its allowlist | Needs the owner (open question 5) |
| D-1 | Hardening in parallel: reviewer sides with Security and withdraws | Section 2, last paragraph |
| D-2 | No shell for `devops-sre` | Section 1.3 |
| D-3 | Fence scope: add connectors, network, reads | Section 1.3 |
| D-4 | Baseline captured by the owner only | P1 |
| D-5 | Requirements pass before area F | Section 7.4 step 4 |

No first-review item was recorded as "not adopted". RS-1 is also still true of revision 4.

## Appendix 2: second-review items for Proposal A and where revision 4 answers each

Source: `docs/status/proposals-second-review-2026-10-12.md`, part "PROPOSAL A" (A.1 to A.4) and section 4. "Answered" means revision 4 contains text addressing the item. It does not mean the reviewer or anyone else has read that text and agreed; nobody has. "Needs the owner" means the item cannot be closed by a document.

**New problems (A.3)**

| Item | What the reviewer raised | Where revision 4 answers it |
|---|---|---|
| A-N1 | The capture does not show the session is fenced as `devops-sre`; it checks only the tool list and connectors | Section 3.6, items C3 (agent field, if one exists) and C5 (out-of-lane write refused naming the role; if it succeeds the phase does not open); section 3.1, `--agent` row; criterion 17, identity requirement; section 8.4. Whether the field exists, and the capture itself: needs the owner |
| A-N2 | The deny-rule test can pass because the session refuses every write | Section 3.6: W1 must succeed (C4); the refusal must state its source, the path guard by role name (C5) or the named deny rule (C6); a bare "permission not granted" is not a pass. The capture itself: needs the owner |
| A-N3 | Pattern S2 matches "undecided" | Section 9.2: S2 enclosed in word boundaries; `selected` found to have the same fault and bounded; remaining limits stated; an owner self-check given, not run |
| A-N4 | No exact command for S6; `grep -nEi` prints text and ignores case | Section 9.2: two command forms, case-insensitive for S6a, S6b, S6f and case-sensitive for S6c to S6e, each piping to `cut -d: -f1,2` before saving; criterion 10; S6 run by the owner only (sections 7.3, 9.1). The commands have not been run |
| A-N5 | The orchestrating session is inside the phase and outside the fence | Section 1.4 with its own table; section 1.2, last paragraph; rules 21 to 24; risk 12; section 11 item 16, tied to hardening plan H-32. Accepting it or changing the order: needs the owner |
| A-N6 | "Ends with" four sections against criterion 24's "end with" one | Section 6, common rules: the order of the four closing sections fixed and numbered; criterion 24 reworded to position; criterion 16 and S8 aligned |

**Rows the review marked "partially addressed"**

| Item | What the reviewer said | Where revision 4 answers it |
|---|---|---|
| A1, T-10 | Area A question 13 asks for the hostname layout but the required-content list does not | Area A, "The document must contain": hostname layout added, marked provisional on the authentication approach; row 1's acceptance evidence |
| A3-1 | Connectors: a written rule; `--strict-mcp-config` unverified | Section 1.3, connector row; O1 decision moved to the front (section 2); capture item C2 must show the result. Still a written rule until the capture: needs the owner |
| A3-2 | File tools: deny list complete on a static reading, rules unverified | Section 1.3, Write and Edit row; section 3.2; capture item C6 with its source requirement. Still unverified until the capture: needs the owner |
| A5, criterion 5 | Reduced to searches, but S2 is faulty | Section 9.2, S2 corrected; criterion 5 cites the corrected pattern |
| Recommendation 4 | The tracking conflict with the plan's checker is still open | Sections 3.5 and 8: hand ledger removed; the plan's `session:` line form and five checks adopted; hollow delegation still forbidden. The tier is proposed, not implemented, and the phase waits for step 2: needs the owner |

**Verdict items (A.4)**

| Item | What the reviewer asked | Where revision 4 answers it |
|---|---|---|
| A.4-1 | Fix A-N1 and A-N2 in the capture | Section 3.6 |
| A.4-2 | Fix A-N3 and A-N4 | Section 9.2 |
| A.4-3 | Add the A-N5 statement | Section 1.4; risk 12 |
| A.4-4 | Reconcile with Proposal B on the points of the review's section 4 | The table below |
| A.4-5 | Add the T-10 required-content line | Area A required content |
| A.4-6 | Have the Security Engineer re-read the revision before approval | Needs the owner. No re-read of revision 4 has happened (open question 10) |

**Consistency between A and B (the review's section 4), one row per row of its table**

| Topic | What the reviewer found | Where revision 4 answers it |
|---|---|---|
| `design` tier stages | Same in effect; A listed `security` as a stage, B adds it through the header | Section 8.1: five stages, with `security` added by `security-sensitive: yes`, as the plan has it |
| Lines within `authoring` | Mismatch: A wanted one line per deliverable; the checker kept one entry per stage name | Section 8.2: one agent per line, any number of lines per stage, one line per deliverable, as the plan's H-14 proposes. The checker change is unimplemented: needs the owner (step 2) |
| Tracking file | Match on a hand file that did not exist | Superseded. Section 8.1: hand file withdrawn; ledger at `docs/status/features/SRE-001-architecture-phase.md`, created and committed by the owner at O5; row 15 |
| Two kinds of stage evidence | Match in words; gap: criterion 17 did not require the start-up record to show the agent identity | Section 8.2 (the two forms); criterion 17, identity requirement; section 8.4 |
| Checker acceptance of a session file | Open, no mechanism | Section 8.3: the plan's five checks, stated as proposed and unimplemented, with their limits. Applying step 2: needs the owner |
| Run-log rule | Match on preserving and on hollow delegations; mismatch on the baseline record | Section 3.5; criterion 22: `baseline-run-log.txt` dropped; line count and SHA-256 in the commit messages of O2 and O5, computed by the owner; earlier 18-line hashes not used. The O5 record is this brief's addition to what the plan prints; see section 3.5 |
| Launch form | Only A has one; B misdescribed it | Section 3.1, unchanged: the prompt is the final argument and follows `--verbose`. The plan's H-42 now describes it the same way |
| Preconditions: connectors | Mismatch: A needed the decision before the phase; B placed it at the end of Wave 1 | Section 2, O1; section 1.3, connector row; capture item C2; section 11 item 8. The decision: needs the owner |
| Preconditions: step 6a | Mismatch: A failed criteria 2 and 3 on any hardening change; B offered the tier step before acceptance | Section 2: steps 1 and 2 at O4, merged before O5; criteria 2 and 3 compare against the phase-opening commit and need no exception; no hardening change during the phase |
| Preconditions: hand tracking as a departure | A asked the owner; B did not | Hand tracking is withdrawn. The departure the owner is now asked to approve is the `design` tier: section 8.1; section 11 item 3; plan decision 8. Needs the owner |
| Overall order | Neither document stated it; Wave 0 probes would trip criterion 2 | Section 2: O1 to O9, the single order for both documents; no Wave 0 probe during the phase; probe and throwaway files removed before O5; criterion 3 |
| Branches | B used separate branches; A never mentioned them | Section 3.7: the plan's branches, a proposed name for the phase branch, checkpoint commits are the owner's; section 11 item 14. Where the O5 commit sits and whether the Wave 0 branch is merged: needs the owner (open questions 6 and 7) |

No second-review item for Proposal A is recorded as "not adopted". Five things in revision 4 go beyond what the review named and have been examined by nobody: the single-deliverable-per-session proposal (section 8.2), the extra ledger sections (section 8.5), the owner-only rule for S6 (sections 7.3, 9.1), the second run-log record at O5 (section 3.5), and the proposed branch name and opening-commit placement (section 3.7).
