# Security reread of Proposal A revision 4 and Proposal B revision 4

| | |
|---|---|
| Date | 2026-10-12 |
| Reviewer | `security-engineer`, briefed by the Chief Engineer on the owner's directive of 2026-10-12 |
| Subject A | `docs/operations/sre-architecture-phase-brief-rev4.md` (by `devops-sre`) |
| Subject B | `docs/status/security-hardening-plan-rev4-2026-10-12.md` (by the Chief Engineer, who also briefed this reread) |
| Kind of review | Planning and document review, with a reading of the guard code. **This is a review position. It approves nothing.** I fixed nothing. |

## 0. How to read this

**Method.** Read tool and one Write (this file). No shell command. No guard was probed, bypassed or tested. No connector or MCP tool was called. No tool call was refused by a guard. Two Reads returned "File does not exist" (section 8); those are not guard refusals.

**Labels, kept apart throughout.**

- **Mechanism**: the software refuses the action whatever the agent intends. Where I say a mechanism does or does not stop an input, that is **static**: read from the source today, never run.
- **Observed**: I read it in a named file, or in a tool result, in this session. Nothing I observed about my own session is on file anywhere except in this report, so for every other reader it is *relayed*.
- **Recorded**: another role wrote it in a report that is on file. Not re-checked by me unless I say so.
- **Policy**: a written rule. It limits nothing by itself.
- **To confirm**: my recollection of how git or the harness behaves. Not observed in this work.

**Headline.**

1. No critical finding. No credential, customer data or production system exists (recorded; I did not verify the machine).
2. **Two new high findings, both in Proposal B, both small to fix.** SR-01: nothing ties the patch text the reviewers read to the patch text the owner applies. SR-02: the evidence binding still accepts inputs that pass falsely, including a `run:` line for the role the phase declares `no-shell`. **Escalation to the owner, as my role requires.**
3. Proposal A: no objection to it going to the owner for decision, with named changes (section 7).
4. Proposal B: no objection to the owner deciding O1 to O3 now. **Objection to approving the plan as a whole as written**, with three blocking items (section 7).
5. Of my 66 earlier items: 29 addressed, 33 partially addressed, 1 unresolved, 3 requiring an owner decision.

**A caution about this file.** I was briefed by the author of Proposal B. My final message returns to that session, and this file sits in a tree that session can write, because it is not fenced (static, `path-guard.mjs:63-64`; that it has no agent type is inferred from recorded behaviour and is unverified, H-23). The owner may wish to commit this file promptly, or to compare it with my final message.

---

## 1. My earlier findings, one row each

Source: `docs/security/proposals-security-review-2026-10-11.md`. "Addressed" means revision 4 contains text that does what I asked. It never means implemented: nothing in either proposal is implemented. A promise in a sentence is "Partially addressed".

### 1.1 Proposal A findings (18 rows)

| ID | State | Checked at, and what remains |
|---|---|---|
| SA-01 | Addressed | A 1.1, 1.2, 1.3 shell row, 3.1, 3.6 C1, criterion 17, rules 1 to 8. No shell at launch; start-up record as evidence. Mechanism unverified until the O3 capture. A delegated `devops-sre` run with a shell is excluded by policy only |
| SA-02 | Partially addressed | A section 2 (O2, O5), criteria 2 and 3. `.gitignore`, `CLAUDE.md` and the local settings file are now listed. **`.git/config` and `.git/hooks/` are still in no criterion** (SR-05). Whether the folder is a git repository: my session's environment description again said it is not; QA's scan records `git status` succeeding. Still for O2 to settle |
| SA-03 | Partially addressed | Area B q10; area E q10, q17; area D restore reconciliation. Not required: an alert on signature failures, replay tolerance. No acceptance criterion names webhook content; criterion 13(b) is the only hook |
| SA-04 | Partially addressed | Area E q11; area F q5, q9; cost model "replayed-link case". Not required: no listing and no public access on the store, a separate upload identity, where a leaked link surfaces beyond logs. No criterion |
| SA-05 | Addressed | Area D "Backup isolation is a requirement"; criterion 20; disaster list. Access logging on backup reads is still absent (minor) |
| SA-06 | Addressed | Area E q5, q18; audit section required; criterion 21 |
| SA-07 | Partially addressed | Personal-data flag on every row; area E q12. Not required: how a deletion request is met beside retained order records; a statement that retention is provisional pending legal advice |
| SA-08 | Partially addressed | Area E q13; area B q7; "who can modify the job" column. Not required: read-only default token, private workspace packages, artefact integrity between test and deploy, no automatic merge |
| SA-09 | Partially addressed | Area E q14, q15. Not required: a database user per component, the database not publicly reachable, second-factor and recovery columns in the vendor register |
| SA-10 | Addressed | Row 10 lists Sec; criterion 13(a) covers rows 1 to 11; findings table; owner acceptance of a high (proposed, item 15) |
| SA-11 | Partially addressed | Area E q16 and the required "security alert list". The specific events I listed are not enumerated as required content |
| SA-12 | Addressed | Area A q9 to q12; area E q4 |
| SA-13 | Partially addressed | Criteria 2, 3, 9, 10, 13, 17 are now checkable. Still no criterion for webhook or signing-key rotation or second factor |
| SA-14 | Addressed | Criterion 2 names the six `docs/` folders |
| SA-15 | Addressed | Rule 18; criterion 25; S7. See SA4-02 on how S7 output is saved |
| SA-16 | Addressed | A 1.2, 1.3 rows for Read, connectors, web. Reads outside the project stay policy, and the brief says so |
| SA-17 | Unresolved | No deliverable in A 7.2 is a threat model. Low |
| SA-18 | Addressed | A section 2: no hardening change during the phase |

Counts: Addressed 9, Partially addressed 8, Unresolved 1, Requires owner decision 0.

### 1.2 Proposal B, the N- findings (18 rows)

| ID | State | Checked at, and what remains |
|---|---|---|
| N-01 | Addressed | H-31, step 3. Open during the SRE phase |
| N-02 | Requires owner decision | H-32, decision 5. Open during the phase whichever way it is decided |
| N-03 | Partially addressed | H-33, step 2. No-argument allowlist and printed paths adopted. The script still accepts `--dir` and `--log` and can exit 0 with them; the allowlist line does not bind a session with no agent type; paths resolve against the working directory (SR-15) |
| N-04 | Requires owner decision | H-01 "does not confine a role to its lane"; section 2 shell row; decision 6 |
| N-05 | Partially addressed | H-34: Wave 0 probe, listing in acceptance checks, "once, never always". No test that fails when the file exists; managed settings not discussed |
| N-06 | Partially addressed | H-29: owner detaches at O1; step 8 denies by prefix what "can write or spend". Not default-deny by exact name. Read-capable and persisting connectors stay. Only one owner-launched session's start-up record is checked; delegated runs are not |
| N-07 | Partially addressed | H-35 closes the git route as proposed (but see SR-10 on `..`). The Read tool outside the project stays policy plus a list |
| N-08 | Addressed | H-36 |
| N-09 | Addressed | H-37 stage-to-agent table (contents not printed, SR-08) |
| N-10 | Addressed | H-37 field strictness |
| N-11 | Addressed | H-16 refuses nested `CLAUDE.md` and `.claude/` in any lane. No Wave 0 probe says whether such files load. Open during the phase; A covers it by policy, deny rules (unverified) and criterion 23 |
| N-13 | Addressed | H-12 and H-08: message asserted on every BLOCK; H-04 asserts hook output |
| N-15 | Partially addressed | H-47 with H-02. Open and undetected during the phase, and step 2 makes the checker itself call git (SR-05) |
| N-16 | Addressed | H-04 prompt on `.gitignore`; H-03 reports an in-lane `.gitignore` change |
| N-17 | Partially addressed | QA's scan exists (section 5). No person has yet classified a hit. H-48 lands at step 8, after many commits (SR-13) |
| N-18 | Partially addressed | Section 3: the owner implements; reviewer session owner-launched (proposed, decision 7). For this plan itself the verdicts still pass through files the author's session can write. See SR-01 |
| N-19 | Addressed | H-49; H-33 |
| N-21 | Partially addressed | H-02 says every key is unverified and orders the probe before step 6. No Wave 0 written checklist of the sandbox assumptions |

Counts: Addressed 8, Partially addressed 8, Unresolved 0, Requires owner decision 2.

### 1.3 Proposal B, my per-finding objections to H-01 to H-30 (30 rows)

My first review raised objections against H-01 to H-30. H-31 to H-38 were created from my N- findings and are covered in 1.2.

| ID | State | Checked at, and what remains |
|---|---|---|
| H-01 | Partially addressed | `pnpm exec` removed; fixed named scripts; residual stated; decision 6. Still no patterns to review; "own workspace" is undefined for QA and `devops-sre` |
| H-02 | Partially addressed | `denyWrite` widened; `denyRead` added; probe ordered before step 6. "A stated network policy" is not stated. `.gitignore` and `.npmrc` are absent from the list. An `ask` rule "on that parameter" assumes rules can match a tool parameter (to confirm) |
| H-03 | Partially addressed | Content hashes, ignored files, `.gitignore` case adopted. Not answered: where the snapshot is stored; a background process writing after the stop hook; the ledger check failing on a cited run that carries a violation |
| H-04 | Partially addressed | Lockfiles blocked; executed configs prompted; H-30 first. Not answered: a flag before the subcommand; where the check sits relative to `path-guard.mjs:64` |
| H-05 | Partially addressed | Residual stated honestly. Git commands with an option before the subcommand are not mentioned. The tests line still says "paths that do not exist", which is unsafe for commands that create what they are given |
| H-06 | Addressed | Glob matching; every input I listed is a test; the `Example.Key` claim corrected |
| H-07 | Partially addressed | Seven of my names added. Default-deny for reads outside the project not adopted; the home-directory list is not printed; dump files and `*.tfvars` absent |
| H-08 | Partially addressed | H-51 added as a precondition. No proposed change yet for a hook that fails before its code runs. The exit at `path-guard.mjs:78` is not mentioned. Wording: section 2.6 below |
| H-09 | Addressed | "Corroboration only"; a direct session counts through H-52 only; start time in H-49 |
| H-10 | Partially addressed | Order fixed (step 7 after step 6). Chaining is "optional". Moving the log outside the repository and append-only storage are still not discussed. Under H-32(b) the Write route stays open and the entry does not say so |
| H-11 | Addressed | The disabling flag is dropped |
| H-12 | Addressed | Message assertions; QA drafts, owner applies |
| H-13 | Partially addressed | Docs-only check (H-38); step 2 before the phase; `trivial` plus `accepted` is an error. The security stage is still switched on by a typed header word |
| H-14 | Partially addressed | Non-null, used once, one agent per line, dated at or after the opening commit. Not adopted: session id and agent id matched as a pair; evidence path among the files the run changed |
| H-15 | Partially addressed | Now step 6. Still "nearest existing parent": a target that is itself an existing link is not covered |
| H-16 | Addressed | High, step 6, case-insensitive, nested instruction files, plumbing. See SR-11 on `.github/` |
| H-17 | Addressed | Wave 0 probe; "every output mode"; `glob` handled in H-06 |
| H-18 | Addressed | Wave 0; the wrong location text is gone |
| H-19 | Partially addressed | Part (b) moved to step 2. Still a self-declared justification line |
| H-20 | Partially addressed | Treated as a protected change at step 8. The procedure text does not forbid a permissive mode or a standing allow rule (A 3.1 does, for its own launch) |
| H-21 | Addressed | Owner-launched; "an agent saying the owner agreed is not authorization" |
| H-22 | Addressed | Answered "once"; abuse and pass conditions added |
| H-23 | Partially addressed | High; gates step 3. My two additions are absent: a shell command from the main session, and a guard denial for a subagent started from the extension |
| H-24 | Addressed | No security objection |
| H-25 | Addressed | Recursive search tools not proposed; `git grep` on tracked files with the dangerous flags rejected, or a no-shell launch. `ls` with a free path argument is a small residual |
| H-26 | Requires owner decision | My note on a separate browser profile is not carried |
| H-27 | Partially addressed | Read-only probe from an attended session. "Name the read tools exactly, never the prefix" is not carried |
| H-28 | Addressed | Pass condition added |
| H-29 | Partially addressed | As N-06. The memory plugin has dropped out of the entry |
| H-30 | Partially addressed | Wave 0, before H-04 and H-05. Case sensitivity of the `Read` deny rules is not among its probes |

Counts: Addressed 12, Partially addressed 17, Unresolved 0, Requires owner decision 1.

**Totals for item 1, 66 rows: Addressed 29, Partially addressed 33, Unresolved 1, Requires owner decision 3.**

The eight wrong or inconsistent statements in my first review's table 2.1 are all corrected in revision 4, with one replacement: the old sentence "every role that holds Bash gets a default-deny allowlist" is gone, and section 1 now carries a different overstatement (SR-09).

---

## 2. Proposal B revision 4

### 2.1 Section 7: the `design` tier and its evidence binding (H-52)

**Does the binding stop an unrelated historical run record from satisfying a stage?** For a `session:` line, yes on the design as written: the run log is not consulted. For the stage as a whole, **no**. Four inputs would still pass falsely. All static against the design in section 7; none can be run, because nothing is implemented.

1. **A `run:` line for the `no-shell` role.** Nothing in section 7 says an agent listed under `no-shell:` must use the `session:` form. Input: `- [x] authoring | agent: devops-sre | run: <agentId> | evidence: docs/operations/environment-strategy.md`, where the id belongs to any delegated `devops-sre` run that ended after the opening commit. Such runs are not hypothetical: each revision of the brief was written by one (recorded: A header; second review, log line 19), and a revision 5 during the phase would create another. It is genuine, non-null, used once and late enough. Check 4 never runs, because check 4 belongs to `session:` lines. The run held a shell. The stage ticks.
2. **A session file older than the phase, cited through a newer commit.** Check 1 asks that the file be "present in the cited commit"; check 2 asks that the cited commit be at or after the opening commit. Every later commit's tree contains every earlier file. Input: a `session:` line citing the O3 capture file (a real no-shell `devops-sre` session with a real path-guard refusal in it, made before the phase) together with the hash of any commit made after O5. All five checks pass. The rule the plan applies to the ledger, "the commit that first added the file", is not applied to the session file.
3. **One session cited many times, or for a document it did not write.** "Used once" is stated for `run:` ids and not for sessions. Nothing ties the session to the `evidence:` path. Input: seven `authoring` lines all citing one session file. Proposal A avoids this by policy (one deliverable per session) and says the plan is silent.
4. **Lines added but not all ticked.** With "any number of lines per stage", section 7 does not say when a stage is complete. If one ticked line completes `authoring`, a ledger with one of eleven lines ticked is accepted (SR-08).

Fixes are one sentence each: an agent under `no-shell:` may hold a stage only through a `session:` line; the session file's own first-adding commit must be at or after the opening commit and descend from it; a session id is cited once per ledger, and the file must contain a successful write to the `evidence:` path if capture item C8 shows paths are recorded; a stage is complete only when it has at least one line and every line is ticked.

**The identity question.** The plan is honest that it is unverified whether the start-up record names the active agent. Assessment of the alternatives:

- **Alternative (a), a guard refusal naming the role, is sound in principle and is the better of the two.** The refusal text is written by `path-guard.mjs:87` from the `agent_type` the harness passed to the hook, not by the model (mechanism, static). It also shows something a name field would not: that the project's hooks were actually wired into this launch form.
- **What defeats it.**
  - *A text match.* Section 7 says check 5 "looks for that message naming the line's agent". The phrase is in Proposal A (several places), in the plan, in this file, and will be in the Chief Engineer's task file that the session is told to read. A session file "holds whatever the session read" (the plan's own words). So a session of any identity, or none, that reads its task file contains the phrase. The model can also print it. **Check 5 must be structural**: the denied tool result of a write call, in the same file, whose target is the one named probe path, carrying the hook's text in whatever field the harness uses for a hook denial. Whether the record format allows that is unverified until capture item C8.
  - *A genuine session nobody authorized.* Any session holding a shell can run the same launch form and produce a completely genuine file with a genuine refusal. The check cannot tell who launched it. That rests on the commit (below).
  - *A hand-edited file before the commit.* Stated by the plan.
  - *One moment only.* The refusal proves the identity at the first call. That the agent type cannot change within a session is to confirm.
  - *Authorization by relay.* The out-of-lane attempt is "owner-authorized" by a sentence in a task file the Chief Engineer writes. That is the pattern I objected to under H-21. Put the instruction and the exact path in the owner's own prompt text.
- **Alternative (b)** is policy, as the plan says.
- **Check 4 is weaker than Proposal A's criterion 17.** "Contains no shell" passes a tool list holding an agent tool, a web tool or a connector tool. It should be an allowlist: the tool list is a subset of the set captured at O3. See also SA4-04 on tools that a start-up list may not show.

**Is "the owner's commit is the anchor" a fair statement of the trust model?** Only partly.

- It is fair that the plan says the file and the commit can both be fabricated, and that four roles hold a shell that could run `git commit` (static: `path-guard.mjs:45-49`, `:68`).
- It is **understated in two ways**. First, the sentence leaves out the fifth and most relevant actor: the orchestrating session, which is not fenced, holds a shell and types the ledger lines. Of the shell holders, it is the one actually present in the phase. Second, nothing distinguishes the owner's commit from any other commit. Git records whatever name the configuration gives; there is no signing, no protected remote, and the checker cannot tell. The accurate statement is: *a commit is the anchor; that it is the owner's is policy, until step 6 and H-32 remove the other committers.*
- The repository's own plumbing is also open during the phase (SR-05). A changed `.git/config` can alter what the owner's own git commands do. The anchor stands on files nothing protects or checks.
- Practical supports, for the owner to choose: at O7 the owner reads `git log` for the phase branch and confirms every commit is one they made; the owner inspects `.git/config` and `.git/hooks/` at O5 and O7; signed commits are an option and a decision of their own.

### 2.2 Section 4: the single execution order

**Is it safe to apply step 2 before steps 3 to 8?** As a matter of dependencies, yes on a static reading: nothing in step 2 needs a later step in order to be applied, and applying it early weakens no existing control. As a matter of what its result is worth, **the checker's pass at O7 is weaker than section 4 implies**, because step 2 makes the checker depend on three things the later steps protect:

| The step 2 checker relies on | Protected by | State during the phase |
|---|---|---|
| The run log, for every `run:` line (Architect, Security, SAGE, Reviewer) | H-10, H-01, H-02 (steps 5 to 7); H-32 | A line appended by an open shell or by an unfenced Write satisfies a `run:` check. Proposal A's criterion 22 detects changes to *earlier* lines only; an appended line passes it (static). SR-06 |
| Git history and git's own behaviour, for the opening commit, the docs-only check and the `session:` checks | H-47, H-01, H-02 (steps 5 and 6); H-32 | `.git/config` and `.git/hooks/` are writable by an open shell and by an unfenced Write, and no criterion looks at them. Step 2 is the first time the checker calls git. SR-05 |
| The allowlist line that admits the check with no arguments (`path-guard.mjs:46`) | H-32 (step 3) | Inert for a session with no agent type. The mitigation that works during the phase is the printed paths, read by the owner who runs the check |

**What else is exposed during the phase as a result of the order** (static, from the findings register): the unfenced orchestrating session (H-32) and unknown agent types (H-31); guards that fail open (H-08); any-depth patterns into `.claude/` and nested instruction files (H-16); secret-name gaps (H-06, H-07); reads of any file through `git diff --no-index` for the allowlisted roles, two of which work in the phase (H-35); `audit fix` on my own allowlist (H-36); local settings precedence (H-34); connectors beyond the O1 detaching (H-29).

**Is the exposure stated?** Not in section 4, which closes with "the phase has a machine-checked ledger from its first day". Parts are stated elsewhere: section 7's limits, section 1's fourth bullet, and Proposal A's section 1.4 and risk 12, which is the fullest statement. **Named change:** a short paragraph in section 4, "open between O5 and O7", listing the above and saying that a checker pass is necessary and never sufficient.

**An option the owner should see.** The largest single exposure in the phase is the unfenced coordinating session. H-31 and H-32(a) are a change of a few lines at `path-guard.mjs:63-64`, and H-23's result is available before O4. H-08's fail-closed change carries the lock-out risk and needs H-51, but only the `Object.hasOwn` substitution is tied to H-31. Splitting H-31 and H-32(a) out and applying them at O4 would turn the shell and write rows of Proposal A's section 1.4 into mechanisms. This changes the single order, so both documents would be revised. It is a recommendation for the owner to weigh, not a blocking item.

### 2.3 Section 3: the patch route

**Is the separation between author, reviewers, approver and applier real?** In roles, yes. In mechanics, not yet.

- **Reviewed text is not tied to applied text (SR-01, high).** The patch is a file under `docs/status/hardening-patches/`, in the author's own lane, untracked until the owner commits something. The Security Engineer and the Independent Reviewer read it; later the owner runs `git apply` on whatever the file then holds. An edit between review and application, including an honest "small fix after review", is applied with a complete approval trail and no reviewer ever saw it. The Reviewer's final `git show` cannot catch it, because the reviewed version no longer exists anywhere. The same holds for QA's test diff under `docs/testing/`.
- **"The owner's own commit of the patch" is ambiguous** (step 5). It can mean committing the diff file or committing the applied change. The first, done *before* review, is exactly the binding that is missing.
- **The reviewers are not independent of the author in practice.** The author briefs the Security Engineer and chooses what it reads (true of this reread). The security review lands in `docs/security/`, which the unfenced author session can write. The plan proposes an owner-launched session for the Reviewer only.
- **The applier sees a diff they may not be able to evaluate.** Nothing asks the owner to compare the files a patch touches with the step table before applying.
- **QA drafts tests at O4 while holding an open shell** (static: no allowlist entry for QA). Section 4 says steps 3 to 8 come "before any agent with a shell does real work"; O4 already has one.

Named changes: (1) the owner commits the patch file and the test diff first, unapplied; (2) both reviews cite that commit hash and the file path; (3) the owner applies from that commit and the applying commit's message cites the reviewed hash; (4) the Reviewer's final check is that the applied diff equals the reviewed one; (5) before applying, the owner lists the files the patch touches and compares them with the step table; (6) the security review for a patch is either owner-launched like the Reviewer's or read by the owner from an owner-committed copy; (7) QA's drafting sessions are launched without a shell, or the residual is stated; (8) no agent session is open while a patch is being applied, since the hooks are read fresh on every tool call.

### 2.4 Section 1 conduct rules and Appendix A

**Section 1.**

- **First bullet, wrong on the code.** "`path-guard.mjs:11-39` grants none of them a path under `.claude/` or `scripts/`." Static: line 21 gives QA any path containing `__tests__/`; line 22 any `*.test.*` or `*.spec.*` file; line 23 two config names at any depth; lines 29 and 30 give `devops-sre` `Dockerfile*` and `docker-compose*` at any depth. `.claude/rules/__tests__/x.md` and `scripts/x.test.mjs` are both allowed today. The plan's own H-16 says so and tests for it. Existing guard files cannot be overwritten this way; new files can be added. The bold lead sentence, "No agent role can modify protected configuration or scripts", is also untrue for the four open-shell roles, for unknown agent types and for a session with no agent type. It should read as policy with a partial mechanism.
- **Fourth bullet.** "From this revision on it runs only what the `chief-engineer` allowlist admits" is policy and a self-report, and is not labelled as either. The bullet covers the shell only. Proposal A's rules 22 and 23 also bind the session's Write (to `docs/status/`) and its connectors and web tools; the plan's section 1 has no such rule, although the plan's own section 2 lists the main session as open for both.
- **Fifth bullet.** "Is followed from this revision on" is a statement about conduct nobody can check. I cannot tell whether another writing agent ran while I did.

**Appendix A. Understated in five places.**

1. **The 2026-10-11 probe session.** The orchestrating session launched a `devops-sre` session itself. That is the act Proposal A now reserves to the owner, it is the only source of the "five tools" statement, and Wave 0 now says every probe is owner-launched. The appendix lists it as a command among others. It does not say whether the owner authorized it, what the session wrote, or whether connectors were attached.
2. **"Two Python scripts that extracted reviewer reports from agent transcripts."** Agent transcripts are not project files. This was a read outside the project and a write through the shell, by the party under review, of the verdict on its own proposal. The appendix does not characterize it.
3. **"A Python script that edited two files."** The files are not named. The second review (B-N7) found a "Superseded" line added to a revision 2 file under `docs/operations/`, which is not the Chief Engineer's lane, and recorded that nobody had said who added it. If this is that script, it was an out-of-lane write. Unverified; the appendix should name the files.
4. **Not listed at all:** the deletion of the run log with `rm` by the set-up session, which my first review recorded from QA's addendum. If that was a different session, the appendix should say its scope excludes it.
5. **"Scans are run by a role whose tools permit them."** That role is QA with an unrestricted shell, delegated by the session whose own search the secret guard refused. The rule in section 1 forbids routing a refused operation "through another tool". Delegating it to a role with an open shell is the same route unless the owner personally asked for it; the owner's directive is relayed. The second review asked that the owner run the re-check. Proposal A declines QA-with-a-shell for its searches (7.3, option c). The appendix presents as settled practice what both proposals otherwise avoid.

### 2.5 Every High finding: does the proposed change close it, and is the residual stated?

"Closes" is a prediction from reading; nothing has been run.

| ID | Closes as proposed? | Residual stated? | Claims more than a proposal? |
|---|---|---|---|
| H-01 | Partly. Typing errors, yes; the capability, no | Yes, plainly; decision 6 | No. "Observed: four plain `rm` commands" carries no file reference |
| H-02 | Partly, if every key behaves as hoped | Yes: project-wide, no file tools | "A stated network policy" is a promise. H-10 leans on H-02 to "close" a route while H-02 calls every key unverified |
| H-04 | Partly | Partly. A flag before the subcommand, and placement relative to line 64, are not stated | No |
| H-05 | No, and it says so | Yes for redirection. Not for git options before the subcommand | The safe-verification wording is unsafe as written |
| H-06 | The named inputs, yes | Yes. A bare `*` would now block: over-blocking is not listed as a regression | No |
| H-08 | Partly; depends on H-51 | Partly. The exit at line 78 is not mentioned | "Moves a blocked input into the open path": today that input crashes the hook with a non-2 exit (static). Whether a crash blocks is H-51's own open question, so "blocked" is unverified |
| H-10 | For a shell append by a named role | Not for H-32(b). The logger hook must itself write the log under the sandbox: regression not stated | "H-01 and H-02 close the shell route" is too strong. Step 7 lists `.gitignore` as changed while the entry says the plan leaves it untouched |
| H-11 | Deletion case, yes | Substitute and forged logs are under H-33 and H-10 | No |
| H-16 | Yes for named agents | Yes | `.github/` as a protected prefix contradicts the `devops-sre` lane, H-04's prompt, and the existing test at `test-guards.mjs:55` (SR-11). No probe is named for whether nested files load |
| H-17 | Decided by the probe | Yes | No. A hook that walks a directory tree can time out; interplay with H-51 not stated |
| H-23 | It is a probe | n/a | No |
| H-24 | Operability | n/a | "(observed)" with no file reference |
| H-29 | Partly | "Whatever stays attached" | The step 8 rule covers "write or spend"; reading and persisting are not covered |
| H-31 | Yes for the path guard | Regression stated | No |
| H-32 | Under (a), yes | Yes | Section 2 marks "Starting agents" and "Git hooks and config" as fully closed ("—"); with H-23 unverified and H-32(b) possible, that is too strong |
| H-33 | Partly | No: flags still work for anyone outside the allowlist; inert for the unfenced session | No |
| H-34 | It is a probe plus a listing | User-level settings stated as open | No |
| H-35 | The git route, with a regression (SR-10) | Yes for the Read tool | No |
| H-50 | An attestation | It is policy and says so | Timing: "before step 3" is after the phase. It belongs at O1 with the connector decision (SR-14) |
| H-52 | Partly (2.1) | Three limits stated; four false-pass inputs not | "No historical run record can satisfy it" holds for the line form, not for the stage. "Evidence produced by a mechanism" holds only if check 5 is structural |

**Other entries that claim or imply more than exists.**

- The header says the finding-by-finding record "is `docs/status/remediation-matrix-2026-10-12.md`". **Observed: a Read of that path returned "File does not exist".** Revision 3 had an answer table inside the document; revision 4 points to a file that is not there. Section 2.8 below stands in for it.
- Section 4: "the phase has a machine-checked ledger from its first day" describes a future that depends on step 2 being applied and working.
- "Observed" is defined in the plan as "on file". Four uses carry no file reference: H-01, H-24, section 2's "observed refusing for 8 roles", and section 3's "observed: its allowlist refused `node --version`".

### 2.6 The corrected statements, checked against the code

**H-47. Correct in substance, imprecise for folders.** For the files that matter (`.git/config`, a hook under `.git/hooks/` with a name git runs, `.gitattributes`, `.vscode/tasks.json` and `settings.json`, `.mcp.json`), no pattern in `path-guard.mjs:11-39` matches, so line 86 refuses a named agent's Write (static). But "no role owns `.git/hooks/` or `.vscode/`" is not strictly true: the any-depth patterns at lines 21 to 23 and 29 to 30 match some file names inside those folders, for example a `__tests__/` subfolder. On my reading none is a name git or the editor would act on. The list of open routes omits an unknown agent type (line 64).

**H-42. Correct in substance, inexact as a quotation.** Proposal A's form does end with the prompt as the final argument, after `--verbose`. The plan prints the placeholder as `<task>`; the brief prints `<brief>`, has `--strict-mcp-config` before `--output-format`, and ends with a redirect to a file. "This plan contains no launch form" is true of its proposals; Appendix A does quote one historical command. That `--verbose` takes no value is harness behaviour I did not verify.

**Section 8's corrected prediction. Right as far as it goes; incomplete; and the same kind of error remains in the table beneath it.**

- Correct (static): the fixture at `test-guards.mjs:122` has no `id` and has `security-sensitive: no`; the helper at `:119` emits no `run:` field; the three pass-expecting cases are at `:131`, `:134` and the statement spanning `:141-145` (cited as `:143`); the four fail-expecting cases at `:132`, `:133`, `:135`, `:136-140` would still exit 1. Seven cases; 58 in total (26, 12, 11, 2, 7).
- Incomplete: "step 2 therefore changes the fixture at `:119` and `:122`" is not enough. The opening commit is derived from git, so `checkWith` at `:123-129` must build a temporary repository and commit the ledger. The one run record the pass case relies on is written at `:106-107`, *before* any fixture ledger exists, so it would be dated before the opening commit and the case at `:134` would fail under the plan's own H-14 rule unless the order or the record changes.
- Still wrong in the "must hold after every step" column (SR-10): the 26 ownership cases are said to hold except `:65`, but `:56` (`devops-sre` writes `package.json`) becomes a prompt under H-04, and `:55` (`devops-sre` writes `.github/`) becomes a block under H-16 or a prompt under H-04. With H-12 asserting messages, neither holds unchanged. Among the shell cases, `:71` is `git diff main...HEAD`, and H-35 rejects "any argument that contains `..`", so the Reviewer's most ordinary command would be blocked; `:82` changes under H-01.

### 2.7 Citation check

Static, against the files as I read them today. 44 checked.

| # | Place | Citation | Result |
|---|---|---|---|
| 1 | Section 1 | `path-guard.mjs:11-39` | Line range correct. **The claim attached to it is wrong** (2.4) |
| 2 | Section 1 | `path-guard.mjs:63-64` | Correct |
| 3 | Section 1 | `path-guard.mjs:42-43`, `:46` | Correct |
| 4 | Section 2 | `path-guard.mjs:45-49`, `:68` | Correct |
| 5 | Section 2 | `path-guard.mjs:77-88` | Correct |
| 6 | Section 2 | `secret-guard.mjs:37-45`; eight `Read` deny rules | Correct (`settings.json:5-12`) |
| 7 | Section 2 | `settings.json:46`, `:55` | Correct |
| 8 | Section 3 | `git show` admitted by `path-guard.mjs:42` | Correct |
| 9 | H-01 | `path-guard.mjs:45-49`, `:68` | Correct |
| 10 | H-02 | No `sandbox` block in `settings.json` | Correct |
| 11 | H-03 | `settings.json:64-73` | Correct |
| 12 | H-04 | `settings.json:27-28` | Correct |
| 13 | H-04 | `path-guard.mjs:32-35`, `:23` | Correct |
| 14 | H-05 | `settings.json:19` | Correct |
| 15 | H-15 | `path-guard.mjs:81` | Correct |
| 16 | H-16 | `path-guard.mjs:21-23`, `:29-30` | Correct |
| 17 | H-47 | `path-guard.mjs:86` | Correct |
| 18 | H-35 | `path-guard.mjs:42`; `settings.json:5-12` | Correct |
| 19 | H-36 | `path-guard.mjs:48` | Correct |
| 20 | H-31 | `path-guard.mjs:64` | Correct |
| 21 | H-32 | `path-guard.mjs:63-64`; `settings.json:2`; `test-guards.mjs:65` | Correct |
| 22 | H-08 | `path-guard.mjs:57-61`, `:64` | Correct |
| 23 | H-08 | `secret-guard.mjs:21-26` | Correct |
| 24 | H-08 | `check-feature-ledger.mjs:55`, `:65` | Correct |
| 25 | H-06 | `secret-guard.mjs:9-14`, `:31` | Correct. `.env.EXAMPLE` and `Example.Key` are blocked today, as stated |
| 26 | H-07 | `secret-guard.mjs:12`; `.gitignore:12-18` | Correct |
| 27 | H-17 | `secret-guard.mjs:41-42` | Correct |
| 28 | H-14 | `check-feature-ledger.mjs:24`, `:70`, `:77` | Correct |
| 29 | H-11 | `check-feature-ledger.mjs:27`, `:76`, `:104` | Correct |
| 30 | H-33 | `check-feature-ledger.mjs:17-18`, `:98-100`, `:106`; `path-guard.mjs:46` | Correct |
| 31 | H-37 | `check-feature-ledger.mjs:24`, `:49`, `:54`, `:76`, `:82`, `:84`, `:85`, `:90` | Correct |
| 32 | H-19 | `check-feature-ledger.mjs:74`, `:84-85` | Correct |
| 33 | H-09 | `log-agent-run.mjs:14` | Correct |
| 34 | H-10 | `log-agent-run.mjs:26`; `.gitignore:26` | Correct |
| 35 | H-49 | `path-guard.mjs:80`; `log-agent-run.mjs:16` | Correct |
| 36 | H-12 | `test-guards.mjs:82`, `:65`, `:20-24`; 58 cases | Correct |
| 37 | H-34 | `.gitignore:29` | Correct |
| 38 | H-24 | No `model` key in `settings.json` | Correct. Agent files not checked |
| 39 | Section 7 | `check-feature-ledger.mjs:20-23`, `:85`, `:64` | Correct |
| 40 | Section 7 | `path-guard.mjs:87`, "<agent> does not own <path>" | Correct. The full text begins `path-guard:`, uses the project-relative path and continues with a second sentence |
| 41 | Section 8 | `test-guards.mjs:122`, `:119` | Correct |
| 42 | Section 8 | `:131`, `:134`, `:143`; `:132`, `:133`, `:135`, `:136-140` | Correct; `:143` is the middle line of a statement at `:141-145` |
| 43 | Section 8 | `:81`, `security-engineer` cannot `pnpm install` | Correct |
| 44 | H-42 | Description of Proposal A's launch form | Correct in substance; the quoted placeholder differs (2.6) |

Not checked, because I did not read the files: `chief-engineer.md:35` and `:4`, `.claude/agents/*.md:4`, `qa-test-engineer.md:4` and `:15`, `SKILL.md:14` and `:18`, `_TEMPLATE.md`. H-51 cites no code; the lines that bear on it are the two hook commands at `settings.json:50` and `:59`, which run `node` with no wrapper.

**Result: no line number is wrong. One claim attached to a correct range is wrong (row 1). One quotation is inexact (row 44).**

### 2.8 The second review's items for Proposal B

Included because the remediation matrix the plan cites is absent. One line each.

| Item | State | Where |
|---|---|---|
| B-N1 (High) | Partially addressed | Section 7; decision 12. See 2.1 and SR-02 |
| B-N2 | Partially addressed | Opening commit derived; ledger never copied in. No end bound; a deleted and re-added ledger is not handled (SR-07) |
| B-N3 | Partially addressed | Section 8 corrected; see 2.6 |
| B-N4 | Addressed | Step table; H-47 with H-16 in step 6; H-34 and H-51 in Wave 0 |
| B-N5 | Addressed | Every protected row lists Security and Reviewer |
| B-N6 | Addressed | Fallback applier withdrawn |
| B-N7 | Partially addressed | Wording corrected. Who edited the revision 2 brief is still unrecorded (2.4) |
| B-N8 | Addressed, ambiguously | Section 3 step 5; see 2.3 |
| B-N9 | Addressed | One agent per line |
| B-N10 | Addressed | Section 3 step 2 |

---

## 3. Proposal A revision 4, security and secrets portions

### 3.1 The pre-phase capture (section 3.6)

**It now establishes the three things asked.** Identity: C3 (a record field, if one exists) and C5 (W2 refused by the path guard naming the role). A succeeding authorized write: C4 and W1. A failing prohibited write with a stated source: C5 for the path guard, C6 for a launch-time deny rule, with a bare refusal not counting. The combination is well designed: if `--agent` had no effect and the session had no agent type, W2 would succeed and C5 fail; if it ran as the settings default `chief-engineer`, W1 would be refused and C4 fail (static, `path-guard.mjs:12`, `:28`, `:64`, `:86`). I checked the three probe paths against lines 25 to 36: W1 is in the lane, W2 matches no `devops-sre` pattern, W3 matches line 27. Correct.

**What could still make it pass wrongly.**

1. **C5 judged by text.** The phrase "devops-sre does not own" is in the brief the session reads. C5 must be read from the denied tool result of the W2 write call, not from anything the session read or said (as 2.1).
2. **A start-up tool list that does not show everything callable (SA4-04).** Observed in my own session: my instructions state that some tools are deferred and not listed, and become callable when surfaced later; instruction text from four connectors (the same four named in the brief's header paragraph) was present in my context although my listed tools were four built-in ones. I called none. If a `-p` session behaves the same way, C1 and C2 can pass on the first record while a connector tool is reachable later. The brief's section 1.3 already says a connector call "anywhere in the session file" is a breach; criterion 17 and C1, C2 read only the first record. They should also require that every tool-call record in the file names one of the captured tools.
3. **One deny rule tested out of about sixteen.** W3 tests the `deploy/` rule. It says nothing about the syntax of the others, least of all the two that matter most, a nested `CLAUDE.md` or `.claude/` under `docs/operations/`. Those stay policy plus criterion 23 unless tested.
4. **The guard at O3 is not the guard during the phase.** Step 2 changes `path-guard.mjs` (one line) after the capture, and the CLI may be updated in between. Record the CLI version in the capture and in each session's first record if it is there, and capture again if it changes.
5. **If C4 fails,** the likely repair is a permissive mode or a launch-time allow rule. The brief rightly proposes neither. Any such change should come back for review before it is used, and note the option-ordering trap of H-42 for a multi-valued allow option.
6. **C1's "expected five tools"** may fail for a harmless reason if the harness lists other built-in tools. The security condition is "no shell, agent, web or connector tool, and the full list recorded". Stating it that way avoids pressure to loosen the item.

### 3.2 The Chief Engineer's session (section 1.4)

**Accurate in the main, and conservative where it should be.** On a static reading the allowlist at `path-guard.mjs:46` and the ownership test at lines 83 to 88 are never reached by a session with no agent type (line 64). The brief is right that the controls on that session during the phase are written rules plus detection, and it is right to list H-23 as unverified. That the session has no agent type is an inference from recorded behaviour, not something a reading of the guard can show; the brief's last column handles that correctly.

**Understated in four places.**

1. **Outside the working tree.** The shell row says "anything the owner's account can do in the working tree". A shell, and for this session the Write tool as well (the outside-project test at line 83 comes after the exit at line 64), reach the home directory: user-level settings, shell profiles, global git configuration. Nothing in criteria 2, 3 or 22 looks there.
2. **Inside `.git/`.** Not visible to `git status`, not in criterion 3 (SR-05).
3. **Starting agents.** "Each delegated role is itself fenced" omits built-in and unknown agent types, which are not fenced at all until H-31 (static, line 64), and omits a nested session started from the shell.
4. **The other delegated roles have no table.** The Architect, the Security Engineer, SAGE and the Reviewer work in the phase by delegation. For them the path guard is a mechanism for writes, but connectors are policy only (rule 19), reads outside the project are policy only, and no start-up record is saved by the owner. My own run today is an example: connector instruction text reached it.

**One error in the other direction.** "None is a mechanism" is slightly too strong. The text deny and ask rules in `settings.json:13-40` apply to every session including this one, and so does the secret guard. They are weak mechanisms, but they are mechanisms.

### 3.3 The corrected S2 and S6 patterns and commands

**S2.** The word boundaries fix the fault. The self-check is sensible. No objection.

**S6. As written, I cannot say it keeps matched text out of the saved output on this machine.**

- **Which `grep` runs (SA4-01).** The S6 commands call bare `grep`. Recorded in QA's scan evidence: in this machine's shell the bare name resolves to a shell function wrapping a different search tool, and QA called the system tool by full path for that reason. Agent shells are initialized from the user's profile, so the owner's terminal very probably has the same function (unverified). The brief's commands assume the output shape `file:line:text` and exact case handling. A wrapper may add its own options. If it prints a file heading on its own line followed by `line:text`, then `cut -d: -f1,2` keeps the line number **and the text up to the next colon**, which is the matched text. Use the full path to the system tool in all six commands.
- **With the system tool,** `-Hn` followed by `cut -d: -f1,2` keeps the name and the line number and drops the text (static reading of the command; not run). A "binary file matches" notice has no colon and passes through whole; it holds a file name only.
- **Errors look like "no hit".** Stated by the brief. Better: save the search tool's exit status into the same evidence file (1 is no match, 2 is an error), so the distinction is on file and not only on the owner's screen.

**Patterns that would leak or miss.**

- **S7 leaks by design (SA4-02).** S7a to S7c look for personal email addresses, account numbers, bucket addresses and internal addresses. They run in the generic form, which saves the matched line. A hit, which is exactly a breach of rule 18, is copied into `search-S7.txt` and committed. S7a to S7c should use the S6 form. S7d (public links) can stay as it is.
- **S6b will hit honest documents.** Its alternatives are mostly bare prefixes with no length. Criterion 10 demands no hit. The operational security document must list secret-bearing formats, and the phase's security review (row 12, in scope) must discuss S6 hits. QA's scan shows this already: its equivalent check hit three documents that merely list such prefixes, including the brief. Either give each bare prefix a minimum tail (ten or more token characters), or treat S6b hits as S6e hits are treated, listed with a reason.
- **S6e misses standard base64.** Its character class has no `/` and no `-`, so a key in the standard base64 alphabet breaks into short runs and is not found. Adding both characters would hit every file path; a second pattern for forty or more characters of `[A-Za-z0-9+/]` covers the gap at a tolerable cost.
- **S6f misses most Markdown placements.** It is anchored at the start of a line. `export NAME=value`, a list item, a table cell and inline code all escape. The deliverables are Markdown.
- **S6 scope excludes the files most likely to hold stray content (SR-13).** The deliverable set is rows 1 to 13. The session files, which hold everything a session read, are committed one per session and are scanned by nothing; the brief relies on the owner reading each raw file.

### 3.4 The capability-by-capability table (section 1.3)

The six rows are labelled accurately. Every proposed mechanism is marked unverified, the Read boundary is called a written rule, and the connector row does not overclaim. Three points:

- **Section 1.1, a rule in a mechanism's wording.** "On the guards as they stand, no fenced role can launch it." Static: the four roles with no allowlist entry (`path-guard.mjs:45-49`, `:68`) can run the launch command from their shells, and the unfenced orchestrating session did launch such a session on 2026-10-11 (recorded: plan Appendix A). That only the owner launches is policy, and its evidence is the commit, with the limits in 2.1.
- **Deferred tools,** as 3.1 item 2.
- **Option 7.3(b),** QA launched without a shell, has no launch-time deny rules for QA's own any-depth patterns (lines 21 to 23), which reach into `.claude/` (H-16, open until O8). If (b) is chosen, add them or state that criterion 3 is the only control.

### 3.5 Anything that exceeds documentation-only scope or weakens a control

Nothing in the brief authorizes a change outside `docs/`, and nothing weakens an existing control. Four things to tighten:

1. **Custody of the launch-time settings file and the task file (SA4-05).** Section 3.2 adds a `--settings` option and says nothing about where that file lives or who can write it. The plan's H-51 shows the owner expects such a file to be able to define hooks. If it sits in the repository tree, the unfenced session can write it, and a hook or allow rule placed there runs at the owner's next launch. Keep it outside the repository, owner-made, with its hash recorded in the capture evidence. The task file under `docs/status/` can likewise change between the owner reading it and the session reading it; the session file records what was read, which the owner should compare.
2. **Identity alternative (a)** makes an out-of-lane write attempt part of every phase session, on the strength of a sentence in a task file. Put it in the owner's own prompt (2.1).
3. **W3** may create `deploy/` if the rules do not work. It is an owner-authorized probe, labelled as such, with clean-up stated. No objection.
4. **Row 14:** the Chief Engineer saves the Reviewer's text. Item 13 offers the owner-launched route. I recommend option (a) there.

---

## 4. Consistency between the two

The two documents now agree on the order O1 to O9, the ledger path and tier, the text of the two stage-line forms, preserving the run log, connectors at O1, and the branch list. Mismatches and shared gaps:

| # | Topic | Mismatch |
|---|---|---|
| 1 | Execution order, O1 | B places "the items in section 11" at O1, which includes decision 4 (identity alternative). A places that decision after O3 and before O4, because it needs the capture. B has no such exception |
| 2 | Execution order, O1 | B lists a privacy redaction decision at O1. A's O1 row does not mention it |
| 3 | Execution order | B puts the owner's credential attestation (H-50) "before step 3", after the phase. A's preconditions do not include it at all |
| 4 | Execution order, O4 | B says steps 3 to 8 come before any agent with a shell does real work. Its own section 3 has QA drafting tests at O4. A declines QA with a shell |
| 5 | Execution order, O6 | B: "no Wave 0 probe during the phase". A, under alternative (a), has a refused out-of-lane write in every session and says it is not a Wave 0 probe. B's O6 row does not carve it out |
| 6 | Phase baseline | A records the run log's count and hash in the O5 commit message as well as O2. B prints it for O2 only. A says so itself |
| 7 | Phase baseline | Neither says the O5 commit must contain the ledger and nothing else. Anything else in that commit is inside the baseline and invisible to the docs-only check |
| 8 | Phase baseline | B's checker requires changed paths under `docs/`; A's criterion 2 names six folders. Stated by A; not a conflict. Neither gives the comparison an end (SR-07) |
| 9 | Ledger content | A needs four extra sections, a `no-shell:` header and an owner `plan-approved` line. B specifies none of them, and B's rule that header fields are "valued exactly `yes` or `no`" contradicts its own `no-shell:` field. A lists this as unverified |
| 10 | Ledger content | Whether the typed `started` field survives step 2 is stated in neither |
| 11 | Stage-line forms | Both say "two forms". There is a third: an owner line with neither `run:` nor `session:`, which B's section 8 keeps as a passing test. It is the least bound line in the ledger (SR-08) |
| 12 | Stage-line forms | A relies on one line per deliverable making a missing document "visible". B does not say that an unticked line fails the stage |
| 13 | Stage-line forms | A cites one session per deliverable by policy; B has no reuse rule for sessions |
| 14 | Run-log rule | Both forbid a hollow delegation and preserve the log. Neither says that an appended forged line satisfies a `run:` check and passes criterion 22 (SR-06) |
| 15 | Connectors at O1 | Both rely on the owner detaching. Evidence that it took effect exists only for the `devops-sre` capture (A, C2) and one owner-launched session (B, H-29). Nothing shows the state of the delegated specialists' sessions or the orchestrating session |
| 16 | Branches | B does not say on which branch the O5 commit is made, or whether the Wave 0 evidence branch is merged before O5. A proposes the first and lists both as open |
| 17 | Branches | Neither says what happens to the accepted ledger when steps 3 to 8 reach the same branch (SR-07) |
| 18 | Conduct of the orchestrating session | A binds its shell, its writes, its connectors and its commits (rules 21 to 24). B's section 1 binds its shell only |
| 19 | Who runs content scans | A: the owner, and for S6 only the owner. B, Appendix A: "a role whose tools permit them" |
| 20 | The plan's step 3 | A calls step 3 "the mechanism for this session". In B, H-32 is an owner choice between fencing and accepting the risk |
| 21 | Launch form | B quotes A's form with a different placeholder and without `--strict-mcp-config`. Cosmetic |

---

## 5. The baseline scan evidence

Subject: `docs/testing/evidence/baseline-scan-2026-10-12.md`.

**Is the method sound?** Yes, for what it is. The file set is taken from git's own listing with null separators; the search tool is called by full path; `-c` makes it emit a count per file and nothing else; binary skipping was checked with a separate count and found not to have dropped any file. The limits section is candid.

**Does it avoid exposing matched text?** By construction of the stated commands, yes: a count-only search cannot print a line. Two qualifications. The results are tables typed by the agent, not raw output, and no session record is on file, so that these were the commands actually run is QA's statement (recorded, not verifiable). And the form has no `-H`; with a single file in a batch the tool would print a bare count with no name. With 48 files that did not arise.

**Who ran it.** QA, holding an unrestricted shell, launched by the Chief Engineer on a relayed directive. The second review asked that the owner run the re-check. This is useful triage. It is not the owner's scan, and nobody independent has seen it run.

**What it does not cover.**

- Files created after the list was taken: the scan file itself, this reread, and whatever follows. Observed: the remediation matrix the plan cites is not among the 48 and does not exist.
- The run log (ignored, not committed).
- **Identifiers of 32 to 39 characters.** Check 7 starts at 40; Proposal A's own S6e starts at 32. Many API keys and account identifiers are exactly 32 hexadecimal characters. Check 10a finds only the dashed form. My first review noted that the evidence transcripts record account-level details from connector calls.
- The shapes in Proposal A's S7b and S7c: twelve-digit account numbers, bucket addresses, internal addresses.
- Names, and any occurrence of the operating-system account name outside an absolute path.
- Values split across lines or encoded. Stated by the scan.
- **Classification.** No hit was opened, by design, so no hit has been judged by anyone.

**The hits.**

- *Check 2, three files, one line each.* Two of the three are files I read in full for this review. In the revision 4 brief I saw exactly one line carrying such prefixes, the S6b pattern list. In my own first review I saw exactly one, an illustrative search expression inside the H-17 note. Each matches the scan's count of one. On my reading both are pattern text, and neither holds a credential. The third file, the revision 3 brief, I did not read; the second review describes its S6b line the same way (recorded). I quote none of them.
- *Check 7, three files, four lines.* Not read by me. Two lines are in the readiness report, which the plan says carries run-log hashes (inference, unverified). The other two, in one agent definition and one evidence file, need the owner's eye.
- *Checks 9, 10a and 11.* The operating-system account name on 27 lines; four session-style identifiers; connector and account words on 43 lines, 15 of them in one evidence file. These are privacy matters, not secrets.

**Is anything a reason not to commit, or to redact first?** Nothing in the results is a reason, by itself, to refuse a local baseline commit in a repository with no remote. Three things should happen first, and they are small:

1. **The owner looks at the seven lines of checks 2 and 7**, by opening each file at the hit. An agent's inference from a file name is not a classification. (The scan gives no line numbers; the owner can get them with the names-and-numbers command form.)
2. **The owner decides the privacy question before committing, not after.** Git history is permanent. Removing the account name, the identifiers or the account metadata later means rewriting history, which is a destructive action under `CLAUDE.md` gate 5. The plan correctly places this decision at O1. If the owner redacts, I agree with the second review: the owner makes the redaction or keeps an untouched copy outside the repository first, and each redaction is stated in the file.
3. **The scan is re-run by the owner at commit time over the final file set**, with check 7 lowered to 32 and the S7b and S7c shapes added.

Nothing should be pushed anywhere until those are done and the visibility of the remote is known.

**About this file.** I wrote it to add no hit to checks 2, 8, 9 or 12: no token prefix is spelled out, there is no email address, and paths are relative to the repository. That is by construction and unverified by a scan. It does add hits to check 10b.

---

## 6. New findings

All static unless marked. None executed. No critical finding.

### Proposal B

**SR-01. High. Reviewed patch text is not bound to applied patch text.**
- Location: plan section 3, steps 1 to 7.
- Scenario: the patch file is edited in the author's lane after both reviews, by mistake or otherwise, and the owner applies the edited file.
- Impact: an unreviewed change to guard code, carrying a full approval trail. This is the route by which every guard change will land.
- Recommendation: the eight changes at the end of 2.3. The first four are the binding.

**SR-02. High. The evidence binding accepts false passes.** Continues the second review's B-N1.
- Location: plan section 7, checks 1 to 5; H-14.
- Scenario: the four inputs in 2.1. The first needs only that the Chief Engineer write a `run:` line where a `session:` line belongs.
- Impact: a tick on the main author's stage of a security-sensitive phase from a run that held a shell, or from a session made before the phase.
- Recommendation: the four one-sentence rules in 2.1, each with a failing test in the section 7 table.

**SR-03. Medium. Identity alternative (a) is defeated by a text match.**
- Location: plan section 7, check 5; brief 3.6 C5, 8.4, criterion 17.
- Scenario and recommendation: 2.1. Bind the check to the denied write call; put the instruction in the owner's prompt.

**SR-04. Medium. "The owner's commit" is "a commit".**
- Location: plan section 7 limits; section 3 step 5; brief 3.3, 3.7.
- Scenario: any shell-holding session, including the orchestrating one the sentence omits, commits a session file or ledger lines.
- Impact: the anchor of every `session:` check is unauthenticated until step 6 and H-32.
- Recommendation: state it as policy; the owner reviews `git log` at O7; commit signing as an owner option.

**SR-05. Medium. Repository plumbing is open and unchecked during the phase, and step 2 makes the checker depend on it.**
- Location: plan H-47 (step 6), section 4; brief criterion 3.
- Scenario: a write to `.git/config` by the unfenced session or an open shell. No exec bit is needed for configuration. To confirm: several configuration keys make ordinary git commands run a program. The phase has the owner committing after every session, the Reviewer running `git status` and `git diff` after every session, and the checker calling git at O7.
- Impact: code run at the owner's terminal; the commit anchor altered. `git status` does not show `.git/`, and criterion 3 does not list it.
- Recommendation: the owner reads `.git/config` and lists `.git/hooks/` at O5, before each checkpoint commit, and at O7; add both to criterion 3 as an owner check; say so in section 4.

**SR-06. Medium. A `run:` line can be satisfied by an appended record during the phase.**
- Location: plan H-10 (step 7), H-14 (step 2); brief criterion 22.
- Scenario: one line appended to the run log names any agent, any id and a current time. Prefix checks pass.
- Impact: the security, review and learning stages of the phase rest on corroboration only.
- Recommendation: say so in section 7; the owner reads the log's new lines at O7 against the delegations the phase actually made.

**SR-07. Medium. The docs-only check has no end, and its start can move.**
- Location: plan section 7, "Opening commit"; section 4 O7 to O8.
- Scenario: the SRE ledger is accepted at O7. At O8 the first hardening commit changes `.claude/`. The checker examines every ledger on every run (`check-feature-ledger.mjs:106-117`), so the accepted ledger fails from then on, and so will every later design ledger once code exists. Separately: a ledger deleted and re-added has two "first added" commits; "the checked state" is not defined as including uncommitted and untracked files.
- Impact: a permanently failing check invites the weakening it was built to prevent; or an empty window.
- Recommendation: bound the window at the commit that first set `accepted: yes`, and require the ledger to be unchanged after it; take the earliest adding commit and fail on deletion; define the checked state to include the working tree; require the opening commit to contain the ledger only.

**SR-08. Medium. Stage completion and the owner's line are unspecified.**
- Location: plan section 7; H-37.
- Scenario: one ticked line among several completes a stage; `- [x] plan-approved | agent: owner | evidence: approved` is typed by the coordinating session and passes.
- Impact: the owner's approval, the first gate in `CLAUDE.md`, is the least bound stage in the ledger.
- Recommendation: every line of a stage must be ticked; an owner line cites an owner commit whose message carries the approval; print the stage-to-agent table; except `no-shell:` from the yes-or-no rule.

**SR-09. Medium. Statements that claim more than the code or the file system supports.**
- Location: plan section 1 first bullet; header; section 2 "—" cells; four "observed" labels (2.4, 2.5).
- Impact: the plan's lead statement on what agents cannot do is false on the code it cites, and its record of answers to the last review does not exist.
- Recommendation: correct the bullet; create the matrix or remove the reference; give each "observed" a file or relabel it.

**SR-10. Medium. Regression predictions still wrong; one proposed rule breaks the Reviewer's normal command.**
- Location: plan section 8; H-35; `test-guards.mjs:55`, `:56`, `:71`, `:82`, `:106-107`, `:123-129`.
- Scenario: 2.6. In particular, rejecting any argument containing `..` blocks revision ranges.
- Recommendation: reject `..` only as a path component and after a colon in a revision-and-path argument; restate the "must hold" column case by case; list the full fixture changes.

**SR-11. Low. Internal contradictions.** `.github/` as a protected prefix in H-16 against the `devops-sre` lane and H-04's prompt. Step 7 lists `.gitignore` while H-10 says it is untouched. H-05's safe-verification wording. H-08's "blocked".

**SR-12. Medium. Appendix A understates what was done.** Location and detail: 2.4. Recommendation: name the two edited files; characterize the transcript extraction and the probe launch; say whether the set-up session's `rm` is in scope; replace "a role whose tools permit them" with "the owner".

**SR-13. Medium. Content is committed long before anything inspects content.**
- Location: plan H-48 (step 8); brief 3.3, 9.2 scope.
- Scenario: a `devops-sre` session reads a file it should not have, or connector text; the raw session file is committed after an owner read of a long machine record.
- Impact: sensitive text in permanent history.
- Recommendation: a written, owner-run, names-and-numbers scan (the S6 commands, corrected) over every file about to be committed, from O2 onward. As a procedure under `docs/testing/` it changes no protected file and need not wait for step 8.

**SR-14. Medium. The credential attestation is timed after the phase.** Location: H-50. Connectors are credentials attached to every session in the phase. Recommendation: move it to O1.

**SR-15. Low. The checker resolves its folders against the working directory** (`check-feature-ledger.mjs:17-18`). Run from another directory it reads another tree with no flag. Recommendation: resolve against the script's own location; the printed paths in H-33 are the interim control.

### Proposal A

**SA4-01. Medium. S6 runs whichever `grep` the owner's shell provides.** Location: brief 9.2. Scenario and recommendation: 3.3. Impact: matched secret text in a committed evidence file, or a case-sensitive pattern run without case.

**SA4-02. Medium. S7a to S7c save the matched identifier.** Location: brief 9.2, criterion 25. Recommendation: the S6 form.

**SA4-03. Low. S6b, S6e and S6f over-match or miss.** Location and recommendation: 3.3.

**SA4-04. Medium. A start-up tool list may not show every callable tool.** Location: brief 3.6 C1 and C2, criterion 17; plan check 4. Basis: observed in my own session and unverified for the launch form. Recommendation: every tool-call record in a session file must name a captured tool; the capture notes whether a deferred-tool notice appears.

**SA4-05. Medium. Custody of the launch-time settings file and the task file is unstated.** Location: brief 3.1, 3.2. Recommendation: 3.5 item 1.

**SA4-06. Low to medium. The Chief Engineer table understates reach; the other delegated roles have no table.** Location: brief 1.4. Detail: 3.2.

**SA4-07. Low. "No fenced role can launch it" is not what the code says.** Location: brief 1.1. Detail: 3.4.

**SA4-08. Low. One deny rule tested; none for QA under option 7.3(b).** Location: brief 3.2, 3.6, 7.3.

**SA4-09. Low. Criterion 3 omits `.git/config` and `.git/hooks/`.** With SR-05.

### The scan

**SC-01. Medium. The scan's long-run check starts above the length of common identifiers, and the scan set is already stale.** Location: scan check 7; "Coverage and limits". Recommendation: section 5, items 1 to 3.

**SC-02. Low. Run by an open-shell role on a relayed directive; results typed, not raw; no `-H`.**

---

## 7. My position

**This is a review position. It is not an approval, and I cannot give one. Only the owner approves. I do not say either proposal is secure, or would make anything secure.**

### Proposal A: no objection to it going to the owner for decision, with named changes

To be made before the O3 capture is run, since most of them change what the capture and the searches do:

1. SA4-01 and SA4-02: full path to the system search tool; exit status saved; S7a to S7c in the names-and-numbers form.
2. SA4-04 and SR-03: C1, C2, C5 and criterion 17 read tool-call records, not text and not the first record alone.
3. SA4-05: the launch-time settings file lives outside the repository; the out-of-lane instruction is in the owner's prompt.
4. SR-05 and SA4-09: `.git/config` and `.git/hooks/` in criterion 3, as an owner check.
5. SR-13: session files are scanned before they are committed.
6. Section 1.4: the four understatements in 3.2. Section 1.1: the launch statement relabelled as policy.
7. The mismatches in section 4 that are A's to fix: 2, 3, 15.

Approving the brief does not open the phase, and the brief says so. Until the capture, every statement about the launch form is unverified.

### Proposal B: objection to approving the plan as a whole as written. No objection to the owner deciding O1 to O3 now

O1 (decisions, including connectors and privacy), O2 (the baseline commit, after section 5's three items) and O3 (owner-launched Wave 0) change no protected file and can go to the owner today.

Blocking items for the rest, all changes of wording or of a rule, none of them large:

1. **SR-01.** Bind reviewed text to applied text in section 3. Without it the patch route does not deliver the separation it describes, and O4 is the first use of that route.
2. **SR-02,** with SR-07 and SR-08. Close the false passes in section 7 and add their tests. Step 2 is the checker the phase is to be accepted on.
3. **SR-09.** Correct section 1's first bullet against the code, and create the remediation matrix or remove the reference to it.

Named changes that I would not treat as blocking, provided they are made before O4: SR-03 to SR-06, SR-10 to SR-15; the "open between O5 and O7" paragraph in section 4; the mismatches in section 4 of this report that are B's to fix (1, 4, 5, 6, 7, 9 to 14, 16 to 20).

**For the owner to weigh:** bringing H-31 and H-32(a) forward to O4 (2.2).

**No critical finding is open.** Two high findings are, and my role requires me to escalate them: SR-01 and SR-02.

### What I did not review

- The agent files, the workflow skill, the ledger template, the other rule files, QA's hardening test plan, the readiness report, the revision 3 texts, the validation records and evidence transcripts, `docs/learning/`, and the run log. Statements that depend on them are marked recorded or unverified.
- The non-security parts of Proposal A (scenarios, sequence, deliverable composition) beyond reading them.
- Any behaviour of the harness, of git or of any search tool. Everything marked "to confirm" is recollection.
- Whether anything in either proposal was produced the way its authors say.
- The remediation matrix, which does not exist.

A code-level and document-level reading cannot show how the harness treats a hook's exit code, a launch option, a deferred tool or a settings conflict. Only the owner's Wave 0 runs can.

---

## 8. Specialist report

**1. Status:** done. One reread written. No finding fixed. Nothing approved.

**2. Files changed:** `docs/security/proposals-security-reread-2026-10-12.md` (this file, created). No other file was created, edited, moved or deleted.

**3. Commands run:** none. No shell command was run, on instruction. Tool calls:
- Read, successful, on: `CLAUDE.md`; `.claude/rules/security.md`; both revision 4 proposals in full; my first review in full; the second review in full; `.claude/settings.json`; the three hook files; both scripts; `.gitignore`; the baseline scan evidence.
- Read of `docs/status/remediation-matrix-2026-10-12.md` → "File does not exist."
- Read of `docs/security/proposals-security-reread-2026-10-12.md`, before writing → "File does not exist."
- Write, once, this file.
- No tool call was refused by a guard. No connector or MCP tool was called.

**4. Not verified:**
- Every statement about what a guard, the checker or a proposed check does with an input: static, not executed.
- Every statement marked "to confirm" about git, the harness, launch options, deferred tools, settings precedence and search-tool output formats.
- Whether the owner's terminal resolves `grep` as QA's shell did.
- The contents of the files listed under "What I did not review", including the citations into them.
- The four check 7 hit lines and the revision 3 check 2 hit line in the scan.
- Whether the working directory is a git repository: my session's environment description says it is not; QA's scan records git commands succeeding.
- Whether the guard suite passes; whether any earlier file has changed since it was reviewed.

**5. Decisions and deviations:**
- I wrote this file because the brief required exactly one file at this path, my role records reviews in `docs/security/`, and the third review is to read it. A general instruction in my session configuration discourages writing report files; I followed the specific brief, as in the first review.
- I made two Reads beyond the brief's list, both of paths that turned out not to exist: the remediation matrix, because the plan cites it as the record of this revision and it bears on the scan's coverage; and this file's own path, to confirm I was not overwriting anything.
- I rated SR-01 and SR-02 high. SR-01 for consistency with N-03 (one write in the author's own lane defeats the control). SR-02 because it continues a high finding of the second review.
- I rated nothing critical, because no asset exists yet.
- I reported what I saw on two of the three check 2 hit files because I had to read those files in full for this review. I quoted no line and no value.
- I named no connector in this file and spelled out no token prefix, to avoid adding hits to the baseline scan's checks.
- I added section 2.8, which was not asked for, because the plan's own record of its answers to the second review is absent.
- Connector instruction text from four connectors was present in my context. I treated it as data and called nothing.
- The option of bringing H-31 and H-32(a) forward is offered to the owner as a consideration, not as a condition.

**6. Needs the owner:**
1. **Escalation: two high findings in Proposal B, SR-01 and SR-02.** No critical finding.
2. Proposal B: decide O1 to O3 if you wish; ask for the three blocking items before approving the plan as a whole.
3. Proposal A: decide it with the seven named changes, which should be made before the capture is run.
4. Before the baseline commit: open the seven hit lines of scan checks 2 and 7 yourself; decide the privacy question first; re-run the scan yourself over the final file set.
5. Decide whether H-31 and H-32(a) should move ahead of the phase.
6. Move the credential attestation (H-50) to O1, alongside the connector decision.
7. Consider committing this file yourself soon after it is written, and receiving the third review directly rather than through a file saved by the author of Proposal B.
8. Judge Appendix A with the five points in 2.4 in mind.
