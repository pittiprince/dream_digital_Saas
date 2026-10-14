# Owner decision register, baseline manifest and blocked actions

Date: 2026-10-12. Prepared by the Chief Engineer (orchestrating session). Nothing here is decided. Nothing was staged or committed.

## 1. Review status, exactly

| Document | Security Engineer | Independent Reviewer | Approved by the owner |
|---|---|---|---|
| Proposal A revision 4 (`docs/operations/sre-architecture-phase-brief-rev4.md`) | Reread: no objection to it going to the owner, with named changes (not yet applied) | Third review: ready with named minor changes (not yet applied) | No |
| Proposal B revision 4 (`security-hardening-plan-rev4-2026-10-12.md`) | Reread: objection to approving as written; two High findings | Third review, with amendment 1: not ready as a whole; one new High (N1) | No |
| Proposal B amendment 1 | **Not read** | Read in the third review | No |
| Remediation matrix | Not read | Checked: several dispositions too favourable; rows missing | Not applicable |

Review files: `docs/security/proposals-security-reread-2026-10-12.md` (written by the Security Engineer itself); `docs/status/proposals-third-review-2026-10-12.md` (a condensed record typed by the Chief Engineer, not the reviewer's verbatim text).

**Neither proposal is approved, and Proposal B is not review-complete.** Outstanding for B: the third review's five blocking items and a Security read of the amendment. Outstanding for A: the five named changes, to be made before the capture.

## 2. Decisions for the owner

| # | Decision | Options | Needed before |
|---|---|---|---|
| D1 | Revise Proposal B again (consolidating the amendment and fixing N1 to N10), then a Security read and a fourth review | Yes; or stop here | Any hardening step |
| D2 | Revise the brief to revision 5 (the five named changes, alignment with the amended plan) | Yes; or stop here | The launch capture |
| D3 | Launch reviewer and Security sessions yourself and save their output, so verdicts do not pass through the author | Yes; or keep delegation and accept relayed records | The next review |
| D4 | Fence sessions that have no agent type, including the Chief Engineer's, before the SRE phase (apply H-31 and H-32(a) at the pre-phase step) | Bring forward; keep after the phase; accept the risk in writing | Fixing the execution order |
| D5 | Privacy: commit the evidence as it is, or redact first | As is (private repository only); redact personally; keep an untouched copy outside the repository | The baseline commit |
| D6 | Is the GitHub repository public or private | **Unknown.** Not established: no authorized method was available to this session. Please check in your GitHub account | Any push |
| D7 | The foundation baseline commit | Commit after your own inspection; or defer | Everything else |
| D8 | Which connectors stay attached (section 4) | Per connector | The launch capture |
| D9 | Go-ahead for the verification probes, which you launch | Yes; no; a subset | Pre-phase hardening |
| D10 | Identity evidence for sessions you launch, if the start-up record does not name the agent | A refused out-of-lane write naming the role; or your attestation per session | After the capture |
| D11 | Residual risk that building roles can run code they can write (H-01) | Accept in writing; or reject | Hardening step 6 |
| D12 | The five SRE inputs (section 5) | Answer, or leave unknown | Opening the phase |
| D13 | The learning questions in `docs/learning/understanding-checks.md` | Answer in conversation or in a direct SAGE session | Nothing blocks on it; no item is marked understood |
| D14 | Judge the orchestrating session's conduct: commands outside its allowlist, a refused command rewritten as a script, a scan delegated to an open shell, an earlier revision edited after review, the run log deleted once during set-up | Your judgement | — |

## 3. Blocked actions and the approval each needs

| Action | Blocked by | Exact approval needed |
|---|---|---|
| Stage or commit anything | The owner's directive | Your explicit instruction naming what to commit; or you commit yourself |
| Push | Remote visibility unknown; directive | D6 answered, then your explicit instruction |
| Launch the `devops-sre` phase session, or the launch capture | Reserved to you | You launch it at your terminal |
| Run any verification probe | Reserved to you | D9, and you launch each |
| Apply any hardening patch, or edit `.claude/`, `scripts/`, `CLAUDE.md`, `.gitignore` | No agent may; plan not review-complete | Per patch: Security review, reviewer recommendation, your commit of the unapplied patch, then your own application |
| Open the SRE phase | Proposals not approved; pre-phase steps not done | Your approval of both proposals, then O1 to O4 completed |
| Invoke or change any connector | Directive | Not requested; D8 is your own action in your account settings |
| Run a content scan from the orchestrating session | Outside its allowlist; a guard refused one form | You run the scan; or you tell this session, in your own words, to run named commands |
| Save a reviewer's report verbatim | The reviewer has no write tool; extraction by script is outside the allowlist | D3; or your instruction to extract by script |
| Establish whether the repository is public | No authorized method | You check; or you authorize a named command |
| Touch `.claude/logs/agent-runs.jsonl` | Directive | None sought. It stays untouched and ignored |
| Install anything, change infrastructure, deploy, spend, change accounts | Not authorized | Not requested |

## 4. Connectors: what is attached and the proposed minimum

Source: the tool list presented to the orchestrating session. **Relayed; nothing on file. No connector was invoked in this task and no attachment was changed.** What delegated agents' sessions hold is not shown by anything on file; several reported connector instruction text in their context.

| Connector | What its tools can do | Proposed for this project now |
|---|---|---|
| Cloudflare Developer Platform | Create, change and delete databases, key-value stores, storage buckets and connection configs; run database queries; read workers | **Detach.** It can change infrastructure |
| Lovable | Create and deploy projects, send build messages that spend workspace credits, query and enable databases, change visibility | **Detach.** It can spend and publish |
| Gmail | Read and search mail; send, reply, forward, draft, label, trash | **Detach.** It can send external mail |
| Google Drive | Read and search files; create, update, share, trash | **Detach** |
| Notion | Search and read; create and update pages and databases; start sessions | **Detach** |
| Canva | Read designs; create, edit, export, upload; generate images | **Detach** |
| Claude Docs | Create, update and delete documents | **Detach** |
| Figma | Read design context, screenshots, metadata, variables; also create and edit files | **Detach for now.** Reattach read-only use when design work starts, by your decision |
| Amazon Selling Partner, Microsoft 365 | Listed as needing authentication; not usable | Leave unauthenticated |
| Plugin servers (Atlassian, Intercom, Linear, Slack) | Listed as needing authentication | Leave unauthenticated |
| `claude-mem` plugin (user level) | Captures session content into a local memory store; injects instructions | Your decision: it records what sessions read |

Proposed minimum for the planning work and the SRE documentation phase: **no connector attached.** No deliverable in either proposal needs one.

## 5. The five SRE inputs

Recorded as `unknown` unless evidence exists. No value is invented.

| Input | Current answer | Evidence |
|---|---|---|
| Largest supported file size | `unknown` | None on file |
| Acceptable operating cost before the first sale | `unknown` | None on file. Relayed context only: the owner asked that no paid service be chosen without approval |
| Search-engine discoverability requirement | `unknown` | None on file |
| Whether original assets are retained outside DreamDigital | `unknown` | None on file |
| Whether Docker is acceptable | `unknown` | Whether it is acceptable: none. Relayed, from the set-up session: Docker was not installed on this machine on 2026-10-11 |

## 6. Proposed foundation baseline: file manifest

Source: `git status --porcelain --untracked-files=all --ignored`, run by the Independent Reviewer in the third review (52 untracked, 1 ignored), plus the two files written afterwards. Branch `main`, no commits, nothing tracked, nothing staged. **Re-list immediately before committing.**

**Include (54 files).**

- Root (2): `.gitignore`, `CLAUDE.md`
- `.claude/agents/` (10): `backend-data-engineer.md`, `chief-engineer.md`, `da-vinci.md`, `devops-sre.md`, `frontend-engineer.md`, `independent-reviewer.md`, `qa-test-engineer.md`, `sage.md`, `security-engineer.md`, `software-architect.md`
- `.claude/hooks/` (3): `log-agent-run.mjs`, `path-guard.mjs`, `secret-guard.mjs`
- `.claude/rules/` (5): `backend.md`, `design-fidelity.md`, `frontend.md`, `security.md`, `testing.md`
- `.claude/` other (2): `settings.json`, `skills/feature-workflow/SKILL.md`
- `scripts/` (2): `check-feature-ledger.mjs`, `test-guards.mjs`
- `docs/architecture/reviews/` (1): `sre-phase-brief-architecture-review.md`
- `docs/design/` (1): `README.md`
- `docs/learning/` (6): `concepts.md`, `daily-learning-log.md`, `debugging-lessons.md`, `sre-and-hardening-proposals-before.md`, `understanding-checks.md`, `understanding-checks-study-guide.md`
- `docs/operations/` (3): `sre-architecture-phase-brief.md`, `sre-architecture-phase-brief-rev3.md`, `sre-architecture-phase-brief-rev4.md`
- `docs/security/` (2): `proposals-security-review-2026-10-11.md`, `proposals-security-reread-2026-10-12.md`
- `docs/status/` (12): `features/_TEMPLATE.md`, `foundation-validation-review-2026-10-11.md`, `proposals-independent-review-2026-10-11.md`, `proposals-second-review-2026-10-12.md`, `proposals-third-review-2026-10-12.md`, `security-hardening-plan-2026-10-11.md`, `security-hardening-plan-rev3-2026-10-12.md`, `security-hardening-plan-rev4-2026-10-12.md`, `security-hardening-plan-rev4-amendment-1-2026-10-12.md`, `remediation-matrix-2026-10-12.md`, `baseline-commit-readiness-2026-10-12.md`, `owner-decision-register-2026-10-12.md`
- `docs/testing/` (5): `setup-validation.md`, `hardening-test-plan-2026-10-11.md`, `evidence/foundation-validation-2026-10-11.md`, `evidence/foundation-validation-2026-10-11-addendum.md`, `evidence/baseline-scan-2026-10-12.md`

**Exclude.**

- `.claude/logs/agent-runs.jsonl`: stays git-ignored and untouched. It held 24 lines at the third review and grows with every delegated run. Record its line count and SHA-256 in the commit message, computed by you at that moment.
- `.claude/settings.local.json`, `CLAUDE.local.md`, env files, key files: none exists (the reviewer's read of the first returned "does not exist"). They stay ignored.
- Nothing outside the repository. The parent folder's Cline rules were not touched.

No probe, temporary, backup or OS metadata file is present (QA's reading of the listing).

## 7. Scan evidence, scope and limits

Evidence file: `docs/testing/evidence/baseline-scan-2026-10-12.md`, written by QA.

- **Scope:** 48 untracked, non-ignored files as they stood when QA ran it. Count-only searches with the system search tool called by full path. No matched text was printed or saved.
- **Results:** no private-key header, credential in a URL, JWT shape, assigned secret, connection string or email address in any file. Token-prefix pattern: one line in each of three files, all documents that list such prefixes as search patterns by their purpose; the reviewer confirmed one, the Security Engineer confirmed two by reading; **the revision 3 brief's line is classified by reading by nobody.** Long unbroken runs: four lines in three files; three classified by the reviewer as hashes and tool names; **one line in the evidence file is unclassified.**
- **Privacy items, not secrets:** the OS account name in absolute paths, 27 lines in 4 files; four session-style identifiers in the validation record; connector and account words on 43 lines in 16 files.
- **Not covered:** the six files written after the scan (the scan file, the Security reread, the amendment, the matrix, the third-review record, this register); the run log; identifiers of 32 to 39 characters; account-number and storage-address shapes; names; values split across lines or encoded.
- **Who ran it:** QA, holding an unrestricted shell, by delegation. It is triage. It is not your scan, and nobody independent saw it run.
- **A clean result means these shapes were not found. It does not mean no sensitive text exists.**

## 8. Before you commit

1. Decide the privacy question (D5) and check the repository's visibility (D6).
2. Open the two unclassified hit lines and read `docs/testing/evidence/` once.
3. Re-run the scan yourself over the final file set, with the system search tool by full path.
4. Run `node scripts/test-guards.mjs` and keep the output.
5. Compute the run log's line count and SHA-256 for the commit message.
6. Read `.git/config` and list `.git/hooks/`.
7. Confirm `git status` shows nothing staged and no file you do not recognise.
8. Commit. Do not push.
