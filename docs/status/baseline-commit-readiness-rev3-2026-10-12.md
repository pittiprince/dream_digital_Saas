# Baseline commit readiness, revision 3: exact manifest

Date: 2026-10-12. Prepared by the Chief Engineer (orchestrating session). Supersedes revision 2, which is kept. **Read-only. Nothing was staged, committed, pushed, deleted, redacted or rewritten, and no permission was changed.** The commit waits for the owner's explicit approval.

## 1. What was actually done for this report

- **By the orchestrating session**, read-only git inside the `chief-engineer` allowlist: `git status --porcelain --untracked-files=all --ignored` and `git diff --cached --name-only`, run after QA finished.
- **By QA, on delegation,** holding a shell: a count-only triage scan of the 63 files that existed at the time, recorded in `docs/testing/evidence/baseline-scan-rev2-2026-10-12.md`. QA reports that no matched text was printed or saved and that no guard refused a command. QA did not see the owner's directive; it was relayed.
- **Not done by anyone:** the owner's own scan; any hash or file-size check; any test run; any check of the remote.

## 2. Repository state

| Item | Result |
|---|---|
| Branch | `main`, no commits (QA: `git rev-parse --abbrev-ref HEAD` fails for lack of a commit) |
| Tracked files | 0 (QA: `git ls-files`) |
| Staged | Nothing |
| Untracked, not ignored | **65 files**, listed in section 3; this report makes 66 |
| Ignored and present | 1: `.claude/logs/agent-runs.jsonl`, not read, scanned or touched |

**Reconciliation with the manifest of 61.** All 61 are present under the same names. Added in this pass: `docs/status/final-closure-amendment-2026-10-12.md`; `docs/status/review-packets/direct-review-final-2026-10-12.md`; `docs/testing/ledger-test-specification-2026-10-12.md`; `docs/testing/evidence/baseline-scan-rev2-2026-10-12.md`; and this report. Whether any earlier file's content changed cannot be determined without a commit.

## 3. Exact proposed commit manifest: 66 files

**Root (2)**
- `.gitignore`
- `CLAUDE.md`

**`.claude/` (20)**
- `.claude/agents/backend-data-engineer.md`
- `.claude/agents/chief-engineer.md`
- `.claude/agents/da-vinci.md`
- `.claude/agents/devops-sre.md`
- `.claude/agents/frontend-engineer.md`
- `.claude/agents/independent-reviewer.md`
- `.claude/agents/qa-test-engineer.md`
- `.claude/agents/sage.md`
- `.claude/agents/security-engineer.md`
- `.claude/agents/software-architect.md`
- `.claude/hooks/log-agent-run.mjs`
- `.claude/hooks/path-guard.mjs`
- `.claude/hooks/secret-guard.mjs`
- `.claude/rules/backend.md`
- `.claude/rules/design-fidelity.md`
- `.claude/rules/frontend.md`
- `.claude/rules/security.md`
- `.claude/rules/testing.md`
- `.claude/settings.json`
- `.claude/skills/feature-workflow/SKILL.md`

**`scripts/` (2)**
- `scripts/check-feature-ledger.mjs`
- `scripts/test-guards.mjs`

**`docs/architecture/`, `docs/design/` (2)**
- `docs/architecture/reviews/sre-phase-brief-architecture-review.md`
- `docs/design/README.md`

**`docs/learning/` (6)**
- `docs/learning/concepts.md`
- `docs/learning/daily-learning-log.md`
- `docs/learning/debugging-lessons.md`
- `docs/learning/sre-and-hardening-proposals-before.md`
- `docs/learning/understanding-checks-study-guide.md`
- `docs/learning/understanding-checks.md`

**`docs/operations/` (4)**
- `docs/operations/sre-architecture-phase-brief.md`
- `docs/operations/sre-architecture-phase-brief-rev3.md`
- `docs/operations/sre-architecture-phase-brief-rev4.md`
- `docs/operations/sre-architecture-phase-brief-rev5.md`

**`docs/security/` (3)**
- `docs/security/proposals-security-review-2026-10-11.md`
- `docs/security/proposals-security-reread-2026-10-12.md`
- `docs/security/proposal-b-rev5-security-review-2026-10-12.md`

**`docs/status/` (20)**
- `docs/status/features/_TEMPLATE.md`
- `docs/status/foundation-validation-review-2026-10-11.md`
- `docs/status/proposals-independent-review-2026-10-11.md`
- `docs/status/proposals-second-review-2026-10-12.md`
- `docs/status/proposals-third-review-2026-10-12.md`
- `docs/status/proposals-fourth-review-2026-10-12.md`
- `docs/status/security-hardening-plan-2026-10-11.md`
- `docs/status/security-hardening-plan-rev3-2026-10-12.md`
- `docs/status/security-hardening-plan-rev4-2026-10-12.md`
- `docs/status/security-hardening-plan-rev4-amendment-1-2026-10-12.md`
- `docs/status/security-hardening-plan-rev5-2026-10-12.md`
- `docs/status/final-closure-amendment-2026-10-12.md`
- `docs/status/remediation-matrix-2026-10-12.md`
- `docs/status/owner-decision-register-2026-10-12.md`
- `docs/status/baseline-commit-readiness-2026-10-12.md`
- `docs/status/baseline-commit-readiness-rev2-2026-10-12.md`
- `docs/status/baseline-commit-readiness-rev3-2026-10-12.md`
- `docs/status/review-packets/security-review-packet-2026-10-12.md`
- `docs/status/review-packets/independent-review-packet-2026-10-12.md`
- `docs/status/review-packets/direct-review-final-2026-10-12.md`

**`docs/testing/` (7)**
- `docs/testing/setup-validation.md`
- `docs/testing/hardening-test-plan-2026-10-11.md`
- `docs/testing/ledger-test-specification-2026-10-12.md`
- `docs/testing/evidence/foundation-validation-2026-10-11.md`
- `docs/testing/evidence/foundation-validation-2026-10-11-addendum.md`
- `docs/testing/evidence/baseline-scan-2026-10-12.md`
- `docs/testing/evidence/baseline-scan-rev2-2026-10-12.md`

**Excluded**
- `.claude/logs/agent-runs.jsonl`: stays git-ignored, untouched, out of the commit. Its line count and SHA-256 go into the commit message, computed by the owner at that moment.
- `.claude/settings.local.json`, `CLAUDE.local.md`, env files, key files: none exists by QA's reading of the listing. They stay ignored.

## 4. Scan status

Source: QA's triage scan, `docs/testing/evidence/baseline-scan-rev2-2026-10-12.md`. Fourteen checks over 63 files, counts only.

| Check | Whole set (files / lines) | The 15 files the earlier scan had not covered |
|---|---|---|
| Private key header; credentials in a URL; JWT shape; a name assigned a long literal; database connection string; email address; repository host account; twelve-digit number | 0 / 0 each | 0 / 0 each |
| Token prefixes | 5 / 5 | 2 / 2 |
| Run of 32 characters or more | 3 / 4 | 0 / 0 |
| OS account name in a path | 4 / 27 | 0 / 0 |
| Session-style hex identifier | 1 / 4 | 0 / 0 |
| Connector and account words | 20 / 55 | 4 / 12 |
| Object-storage address shape | 3 / 3 | 1 / 1 |

**The thirteen files named in revision 2 as uncovered are now covered** by this triage scan, with two more that existed by then (fifteen in all). Eleven of the fifteen had no hit in any check.

**The two previously unclassified hits, opened and classified by QA without quoting:**
- `docs/operations/sre-architecture-phase-brief-rev3.md`, line 594: search-pattern text, the brief's own list of prefixes to scan for.
- `docs/testing/evidence/foundation-validation-2026-10-11.md`, line 340: tool names, in a table of the tools a probe session reported. Not a credential. It names a connector product, which is a privacy point, not a secret.

**Still unopened, for the owner's inspection:**
- Token-prefix check: one line each in the brief's revisions 4 and 5 and in `docs/security/proposals-security-review-2026-10-11.md`. The third review read revision 4's line and the Security Engineer read two of these; all were described as pattern text. QA did not open them.
- Long-run check: `.claude/agents/da-vinci.md` (1 line) and `docs/status/baseline-commit-readiness-2026-10-12.md` (2 lines). The third review classified these as long tool names and two run-log hashes.
- Storage-address check: one line each in the brief's revisions 3, 4 and 5. Consistent with pattern text by the files' purpose; not opened.

**Not covered by any scan:** three files written after it (`docs/testing/ledger-test-specification-2026-10-12.md`, `docs/testing/evidence/baseline-scan-rev2-2026-10-12.md`, and this report); the run log; anything outside the repository. The scan evidence file quotes the search patterns and will be a hit for a prefix search.

**Limits.** This is triage by an agent holding a shell, not the owner's scan. A clean result means these shapes were not found on a single line; it does not mean no sensitive text exists.

## 5. Privacy status

- OS account name in absolute paths: 27 lines in 4 files, the heaviest being the raw evidence file (15) and the second review (9).
- Session-style identifiers: 4 lines in `docs/testing/setup-validation.md`.
- Connector and account words: 55 lines in 20 files; the check over-reports, since it also counts ordinary mentions of connectors as a topic.
- No email address and no repository host account name in any scanned file.

**Redactions: proposed, not made.** The proposal and the four-step procedure for preserving originals are in revision 2 of this report, section 6, and are unchanged: copy the working tree to a private location; redact in the working tree; mark each redacted file at its top; commit the redacted tree. No sanitized copy was produced, because producing one needs a shell or writes outside `docs/status/`, and the reviews advised that evidence not be redacted by an agent before the original is fixed somewhere.

**Repository visibility: unknown.** It was not verified and no method was attempted. The owner can verify by opening the repository page while signed out, or in the repository's settings. If it is or may become public: redact before the first commit, read the evidence files in full, and weigh that these documents describe this project's guard weaknesses in detail.

## 6. Before the owner commits

1. Verify the repository's visibility.
2. Decide the redaction; if redacting, keep an untouched copy outside the repository first.
3. Open the unopened hit lines in section 4.
4. Run the content scan yourself over all 66 files, with the system search tool by full path, names and line numbers only.
5. Run `node scripts/test-guards.mjs` and keep the output. No independent party has seen it pass.
6. Read `.git/config` and list `.git/hooks/`.
7. Re-run `git status --porcelain --untracked-files=all --ignored` and compare with section 3; confirm nothing is staged.
8. Compute the run log's line count and SHA-256 for the commit message.
9. Commit. Do not push until visibility is settled and the remote is confirmed empty.

## 7. Not verified

The content of any file against any earlier state; file sizes and hashes; whether the remote is public or still empty; that the guard suite passes; that QA ran exactly the commands it reports; the three files written after the scan.
