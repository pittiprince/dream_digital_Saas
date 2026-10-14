# Proposal A: SRE and DevOps Architecture Phase Brief
> Superseded by sre-architecture-phase-brief-rev3.md on 2026-10-12. Kept as history.

| | |
|---|---|
| Status | **Proposal. Not approved.** Nothing in this document is authorized until the owner says so. |
| Drafted | 2026-10-11, by `devops-sre`, on the Chief Engineer's brief |
| Revised | 2026-10-11, by `devops-sre`, after three specialist reviews (change log below). **The revised brief has not yet been independently reviewed.** |
| Phase type | Documentation and design only |
| Security-sensitive | Yes (see section 5) |
| Phase owner | Chief Engineer coordinates; the owner decides |

**Labels used throughout.** *Observed*: read in this repository on 2026-10-11, or given as an observed fact by the Chief Engineer. *Proposed*: a suggestion of this brief, awaiting owner approval. *Unverified*: an assumption nobody has checked.

This brief frames the questions. It does not answer them. Where a recommendation appears it is marked as one and it awaits the owner.

## Change log

Revised after review by the Software Architect (`docs/architecture/reviews/sre-phase-brief-architecture-review.md`), the Security Engineer (`docs/security/proposals-security-review-2026-10-11.md`, Proposal A part) and QA (`docs/testing/hardening-test-plan-2026-10-11.md`, section 6). Line numbers quoted in those reviews refer to the first draft.

1. **Fence.** `devops-sre` holds no shell during the phase, enforced at launch; evidence is the harness tool list (SA-01). Section 5, decision 2.
2. **Preconditions.** A baseline commit or hash list is required before the phase opens, with three other preconditions (SA-02, X-03). New list below; old decision 5 retired.
3. **Acceptance criteria.** Section 4 replaced with QA's reworded checks: an explicit list of paths allowed to change, a named checker for each criterion, and new criteria for high findings, provisional sections, backup isolation and audit records.
4. **Missing content.** Upload path, the meaning of "authorized per request", payment webhooks, signing keys, backup isolation, audit integrity, personal data, CI supply chain, admin access, roots of trust, security monitoring, email, and background work added to the question lists and required content of section 2. None is answered here.
5. **Deliverables.** One rule against duplicated writing; decision records no longer pre-numbered; seventeen rows merged to fifteen, with four decision records instead of six (B-01, B-02, S-01).
6. **Sequence.** Owner's inputs first, an owner checkpoint after areas F and A, and a new decision on a provisional system context (D-01, D-03).
7. **Authorization.** Verifying vendor prices is not a task of the phase unless the owner chooses it (X-02). Accepting a decision record approves a design direction only.
8. **Owner inputs.** Three added to decision 7.

Facts settled since the draft are stated where they apply: the folder is a git repository with no commits (section 8, risk 1); the tracking file exists (section 6).

## Preconditions

All four are met before the phase opens. None is done by `devops-sre`.

- **P1. A baseline exists.** The owner makes an initial commit, or supplies a hash list of every file, ignored files included, kept where no agent can write. Without one, an edit to an existing file is undetectable and criteria 2 and 3 cannot be met. The Security Engineer advises reading the evidence transcripts for account details before a first commit (review item N-17); that is the owner's call.
- **P2. The owner's planning inputs** in decision 7 are supplied, or each is expressly marked unknown. Area F does not start without them.
- **P3. The tracking decision** (decision 3) is made.
- **P4. The phase is opened as security-sensitive**, with a `started` date no earlier than 2026-10-12, so that no run record dated 2026-10-11 counts toward it.

---

## 1. Purpose, authorization and exclusions

**Purpose (proposed).** Produce the written operational architecture for DreamDigital, so that every later infrastructure choice is made deliberately, with its cost and its trade-offs visible to the owner before any money or effort is spent.

**What approving this brief authorizes.** Writing the documents listed in section 3, at the paths listed there, by the agents named there. Nothing else. In particular:

- **Verifying vendor prices is not a task of the phase** unless the owner chooses option (a) or (b) in decision 6. Approving the brief "as written" approves no network access for any agent.
- **Accepting a decision record approves a design direction only.** It does not authorize sign-up, spending or implementation. Each account, install, dependency and item of spending is approved separately, when it is about to happen.

**Out of scope. Each item needs its own separate, explicit owner authorization:**

- Any infrastructure implementation: accounts, hosted databases, storage buckets, servers, domains, DNS.
- Any CI file or anything else under `.github/`.
- Any install of any kind: packages, runtimes, Docker, MongoDB, Redis, CLIs, editor tooling.
- Any change to `package.json`, `.npmrc`, a lockfile, `.gitignore`, `CLAUDE.md`, `.claude/`, `scripts/`, or any root tooling config.
- Any deployment, release, push, or merge to `main`.
- Any product code in `apps/` or `packages/`, and any repository scaffold.
- Signing up for any service, paid or free, and any spending.
- Choosing the payment provider, the authentication approach, or the application layout. The phase records what operations needs from those decisions; it does not make them.

**Why the exclusions are explicit (observed).** `CLAUDE.md` gates 2, 4, 5 and 6 require owner approval for dependencies, paid services, destructive commands and deployments. The Independent Reviewer's findings R4 and R5 (`docs/status/foundation-validation-review-2026-10-11.md`) show those gates have no technical enforcement for `devops-sre`. Section 5 is therefore the control.

**Starting state (observed).** Greenfield: no application code, no CI, no infrastructure. The folder is a git repository with no commits (risk 1). Planned but unapproved baseline: React, Vite, TypeScript, Tailwind, Node.js, Express, MongoDB with Mongoose, Redis only where justified, pnpm. Node 24 and pnpm 11 are installed locally. Docker, MongoDB, Redis and the GitHub CLI are not installed on the owner's machine. Undecided: payment provider, file storage, authentication approach, hosting target, how MongoDB and Redis run locally, and the application layout. The owner is one person, learning as the project is built, and cost-sensitive.

---

## 2. Scope: questions, options, assumptions and required content

Rules that apply to every area:

- Every option table names at least two alternatives, includes "do nothing or defer" where that is realistic, and is followed by a line beginning `Reason:`.
- **Analysis is written once, in the operations document; the decision is written once, in the decision record; neither restates the other.** For the four topics that have a decision record (section 3), the operations document gives the options and an operational ranking with reasons, and the record carries the single recommendation to the owner, naming options by link. For every other topic the operations document ends with a section "Decisions for the owner".
- Every recommendation is labelled "recommendation, awaiting owner approval".
- No price, quota or free-tier limit is stated as fact. Cost is described by driver and by relative size. Any figure carries the vendor's own page as source and the date it was checked, or is marked unverified.
- Products named below are examples of a category so the specialist knows what to compare. Naming one is not a selection.
- A section that depends on an undecided item begins `Provisional: depends on <item>`.
- "Appropriate to the project's scale" is the standard. A design a single owner cannot operate is a defect, not a strength.

### A. Environment strategy

**Questions to answer**

1. Which environments exist at launch: local, test (CI), staging, production? Is a staging environment justified on day one, or is it deferred with a stated trigger?
2. What differs between environments (data, credentials, third-party modes such as a payment sandbox, log level, domains) and what must be identical (runtime version, build artefact, schema)?
3. How is configuration separated? Where does each environment's configuration live and who can read it?
4. What is the naming convention and the inventory of environment variables, by name only? Which are secrets?
5. Where do secret values live for each environment, and how does a value get from there to a running process without touching the repository, a log or a command line?
6. How does the application fail when a required variable is missing: at start-up with a clear message, or later?
7. How does one developer on a new machine get to a running system, without Docker today? What are the exact steps and how long should they take?
8. How are runtime and package-manager versions pinned so the local machine, CI and production match?

**Options to weigh**

| Topic | Options | Trade-off to analyse |
|---|---|---|
| Environments at launch | (a) local and production only; (b) local, CI test, production; (c) all four | Fewer environments cost less and are simpler, but changes are first seen in production. Staging costs money and upkeep and drifts if neglected. |
| Local dependencies without Docker | (a) native install of the database; (b) install Docker later; (c) hosted development database; (d) in-memory database for tests only | Covered in area F; this area records the onboarding consequence of each. |
| Secret storage | (a) the hosting platform's own secret store; (b) a dedicated secret manager; (c) git-ignored local env files for local only, combined with (a) or (b) | Fewer systems versus central audit and rotation. Local files are simple and are the easiest to leak. |
| Version pinning | (a) a version file read by a version manager; (b) the `engines` and `packageManager` fields; (c) both | Each needs a file this phase does not create. The phase proposes; implementation is later. |

**Assumptions to confirm with the owner**

- One developer, one machine, macOS (unverified beyond today's session).
- Whether installing Docker is acceptable at all, now or later.
- No production credential ever sits on the development machine (observed rule in `CLAUDE.md`; the phase must say how production is then operated).
- Whether a real customer data copy may ever be used outside production (proposed default: never).

**The document must contain**

An environment matrix (environment by purpose, data, credentials, third-party mode, who can access). The configuration separation rules. An environment variable inventory by name, with a secret or non-secret flag and the owning component. The secret flow per environment. A proposed onboarding sequence written as a proposal, not executed. A list of what is blocked by each undecided item. A closing "Decisions for the owner" section for environments and configuration, which no longer have a decision record of their own.

### B. Deployment and delivery

**Questions to answer**

1. What is the shape of the pipeline: which checks run on a pull request, which on merge, which on release?
2. What are the gates, in order, and which are blocking: install from lockfile, type check, lint, unit and integration tests, build, dependency audit, secret scan, end-to-end tests?
3. Is one build artefact promoted through environments, or is each environment built separately?
4. What triggers a production deployment, and where is the owner's approval recorded? `CLAUDE.md` gate 6 makes this the owner's decision every time (observed).
5. How is a release rolled back? What is the procedure when the release included a database migration? What is the migration ordering rule?
6. How are development and production credentials kept apart in CI, so a pull-request job cannot reach production?
7. What does CI need permission to do, and what is the least it can be given? How are third-party CI actions pinned and reviewed?
8. What branch protections are wanted on `main`, and which of them can a one-person repository actually use?
9. How is the non-interactive limitation handled? Observed in the validation record (D12): `ask` rules become refusals in non-interactive sessions, so a delegated agent cannot run an approved install or merge.
10. **Payment webhooks.** What happens to a call from the payment provider that arrives while a release is in progress? How are such calls received on a development machine, given that a tunnel or provider tool would be an install? What retry behaviour is relied on? (Unverified and provider-dependent.)

**Options to weigh**

| Topic | Options | Trade-off to analyse |
|---|---|---|
| CI platform | (a) the CI built into the repository host; (b) a separate CI service; (c) local checks only for now | Integration and one fewer account versus features and portability. Usage-based minutes are a cost driver; verify, do not assume. |
| Deployment trigger | (a) manual, owner-run; (b) automated on merge with a required approval step; (c) fully automatic | Control and learning value versus speed. Gate 6 rules out (c) without a recorded owner approval step. |
| Rollback | (a) redeploy the previous artefact; (b) revert commit and rebuild; (c) platform-level instant rollback | Speed versus dependence on a platform feature. None of them rolls back data. |
| Migrations | (a) backwards-compatible "expand then contract" only; (b) migrate with downtime; (c) no migration tool, schema enforced in code | Safety and rollback freedom versus effort. |
| Credential separation | (a) per-environment secret scopes with approval on the production scope; (b) short-lived federated credentials instead of stored keys; (c) separate accounts per environment | Strength of separation versus setup effort and what the chosen host supports. |

**Assumptions to confirm with the owner**

- The owner is the only person who approves a production deployment.
- Whether the repository is public or private (unverified; it changes CI cost and the exposure of workflow logs).
- Whether the owner's GitHub plan supports the protections proposed (unverified; to be checked on the vendor's page with the date).

**The document must contain**

A pipeline diagram or ordered list with each gate marked blocking or advisory. The release procedure and the place approval is recorded. The rollback procedure, including the migration case and what rollback cannot undo. A CI permission table (job, credential, scope, environment, who can modify the job). The action-pinning and review rule. The treatment of inbound provider calls during a release and in local development. A list of every file that implementation would later create. A closing "Decisions for the owner" section for the CI platform and release control, which no longer have a decision record of their own.

### C. Reliability and observability

**Questions to answer**

1. What are the critical user journeys? Proposed candidates: browse, sign in, pay, receive entitlement, download a purchased file, admin publishes an asset. Which of them define "the service is up"?
2. What is logged by the application, in what structure, and what must never be logged (secrets, tokens, payment data, signed download links, personal data beyond need)?
3. What is logged by the infrastructure, where do logs go, and how long are they kept?
4. Which metrics matter at this scale, and which are noise?
5. Is tracing justified at launch for a single API, or deferred with a stated trigger?
6. How are errors captured and how does the owner find out?
7. What do liveness and readiness checks test? What does readiness depend on, and what must it not expose publicly?
8. What deserves an alert? Who receives it, by what channel, when one person is the whole on-call rotation and is sometimes asleep?
9. What availability target is proposed, and what does it assume about hosting, the owner's response time and third-party dependencies?
10. **Paid but no entitlement.** How is a payment that did not produce an entitlement detected, and how fast? It is an alert candidate. Does detection need a routine comparison against the provider, a record of received but unprocessed calls, or both?
11. **Admin publishes an asset.** What signal shows a large upload completed, and what detects a stored file with no catalogue record, or a record with no file?

**Options to weigh**

| Topic | Options | Trade-off to analyse |
|---|---|---|
| Log destination | (a) the host's built-in log view; (b) a hosted log service; (c) self-hosted | Zero setup and short retention versus search, retention and cost by volume. |
| Error monitoring | (a) logs only; (b) hosted error tracker; (c) self-hosted tracker | Cost and one more data processor versus finding failures before a customer reports them. |
| Metrics | (a) the host's built-in metrics; (b) hosted metrics service; (c) none beyond health checks at launch | Enough for launch versus cost by series and retention. |
| Uptime checking | (a) external uptime monitor; (b) none; (c) scheduled CI job as a probe | An external check is the only one that sees what a customer sees. |
| Tracing | (a) defer; (b) instrument with an open standard now, export nowhere yet; (c) full hosted tracing | Low value for one service versus cheap future-proofing. |

**Assumptions to confirm with the owner**

- No paid on-call service; the owner is the only responder, without a response-time guarantee.
- Expected traffic and sales volume at launch (unverified; currently unknown and it drives most of this area).
- Customer time zones and geography (unverified).

**The document must contain**

The critical journeys and the signal that shows each is healthy, including pay-to-entitlement and publish. A logging standard: fields, levels, correlation identifier, and a redaction list. Health and readiness check definitions. An alert table (condition, why it matters to a customer, channel, first action) that includes "paid but no entitlement". Proposed availability objectives, in one table, each with the assumption behind it and a statement of what happens to the target if the assumption is false. A "deferred, with trigger" list.

### D. Data protection and recovery

**Questions to answer**

1. What data exists and what does losing each kind cost: accounts, orders and payment records, entitlements, the catalogue, the master digital assets, logs?
2. Which data is the system of record, and which can be rebuilt from another source, for example payment records held by the provider or masters held on the owner's own disk?
3. How is the database backed up: by what mechanism, how often, stored where, in which account, encrypted how?
4. How are the stored digital assets protected? Is the owner's original copy a backup, and is that written down and tested?
5. How is a restore verified, how often, and into what target? Observed standard for this role: a backup is not proven until a restore has been tested, and the document must say which it is.
6. What is the retention period for backups and for customer data, and which legal or tax obligations affect it? (Unverified; depends on where the owner trades.)
7. What disasters are planned for: deleted database, deleted or corrupted assets, lost vendor account, compromised credentials, vendor outage, loss of the owner's own machine, compromise of that machine or of an agent session?
8. What Recovery Point Objective and Recovery Time Objective are proposed for each data class?
9. How is each of the three isolation requirements below met?

**Backup isolation is a requirement, not an option.** The design must show all three, and each has an acceptance check (criterion 20):

- **Who can delete backups.** No credential held by the application, by CI or by an agent session can delete or overwrite a backup. The document names the identity that can.
- **Encryption key custody.** Who holds the backup encryption key, where the key itself is backed up, and what the loss of the owner's machine does to it.
- **Protection of the restore target.** How the target of a restore drill is protected, and whether a drill runs under production-grade controls or on scrubbed data, given the proposed default that real customer data never leaves production.

**Options to weigh**

| Topic | Options | Trade-off to analyse |
|---|---|---|
| Database backup | (a) managed provider's built-in backups; (b) scheduled logical dumps to separate storage; (c) both | Convenience and a single point of failure versus independence, effort and storage cost. Whether point-in-time recovery is included on a given plan is unverified. |
| Asset protection | (a) object versioning; (b) a second copy in another region or provider; (c) the owner's offline master as the backup; (d) a combination | Protection against deletion versus protection against account loss. Storage is paid for twice with (b). |
| Restore verification | (a) scheduled manual drill; (b) automated restore into a scratch target; (c) none | Proof versus effort and cost. Option (c) means the backup is unproven and must be labelled so. |
| How isolation is achieved | (a) a separate account; (b) separate credentials with no delete permission; (c) a retention lock, where a vendor offers one (unverified) | Strength versus setup effort. Storage a production credential can delete is excluded by the requirement above. |

**How RPO and RTO must be written.** Each is a proposal, not a promise, in one table with these six columns:

> *Data class. Proposed RPO. Proposed RTO. Assumption behind each. What it costs to achieve. What breaks the assumption.*

An RTO that depends on the owner being awake and at a computer must say so.

**Assumptions to confirm with the owner**

- Whether the owner keeps original master files outside the platform, and where.
- How much lost order data the business can tolerate, in the owner's own words, before the specialist turns it into a number.
- Whether the payment provider, once chosen, can serve as a reconciliation source.

**The document must contain**

A data classification table with a personal-data flag on every row. The backup design per data class. The three isolation statements above. The restore procedure written as steps, including a reconciliation step against the payment provider, and carrying the exact sentences "No restore has been tested. This backup design is unproven." A retention table. Disaster scenarios with the response to each. The RPO and RTO table in the form above. A clear statement of which parts are designed only and which are proven. In this phase, all of it is designed only.

### E. Security and operations

The Security Engineer reviews every part of this area, and writes the review in `docs/security/`. `devops-sre` writes procedures; the Security Engineer does not review work it wrote.

**Questions to answer**

1. What identities exist (owner, CI, application runtime, backup job, each agent role) and what is the least each needs?
2. Who can reach production, by what path, with which second factor, and how is each access recorded?
3. What is the secret inventory by name, what is the rotation trigger and interval for each, and who performs the rotation? Observed rule: `devops-sre` does not rotate secrets without the owner's explicit approval for that action.
4. What is the response when a secret is exposed, for example committed, printed in a log or pasted in a chat? What is the order of actions and how fast?
5. What is audited: admin actions, entitlement grants and revocations, downloads, deployments, access to production, configuration and secret changes? What does each record hold, how long is it kept, and where is it kept so that neither the application nor one stolen owner credential can alter it?
6. What is the incident process for one person: severity levels, first actions, customer communication, the record written afterwards?
7. How are dependencies and vulnerabilities managed: lockfile policy, update cadence, audit in CI, response time by severity, handling of install scripts?
8. What release controls protect `main` and production?
9. Which secret-bearing file formats will this project likely introduce that the current guards do not cover? Observed in finding R8: `.p8`, `.ppk`, `.netrc`, `.npmrc` and service-account JSON appear in no guard list. The phase lists the formats its recommended options would bring; the guard change itself belongs to the owner's hardening pass.
10. **Webhook signing secret.** Is there one per environment, with test and live never shared? What is the rotation procedure and its overlap window? What guarantees the signature is checked against the unmodified request body, with no proxy or parser rewriting it? Where does the durable idempotency record live, across restarts and instances? How are entitlements reconciled with the provider after a restore?
11. **Signed-link keys.** Which identity signs download links, and is it limited to reading single objects, with no list, write or delete? How is the key rotated, and what happens to links already issued? Is there a kill switch that invalidates all outstanding links? A replayed link is an egress-cost attack: what limits it?
12. **Personal data.** Which data classes are personal, and which vendors would process them (host, database, mail, error tracker, payment provider)? Where does personal data appear in logs, error reports and backups?
13. **CI supply chain.** Are actions pinned by full commit hash? Can any secret reach a job triggered from a forked pull request? Who can change a workflow file?
14. **Application admin access.** How is the first admin account created? What second factor and session lifetime apply to the admin area?
15. **Roots of trust.** The owner's email account and the domain registrar can reset everything else. What second factor and recovery method protect each?
16. **Security monitoring and rate limiting.** Which security events raise an alert (repeated failed sign-ins, webhook signature failures, admin sign-ins, download spikes)? Where is rate limiting enforced and where do its counters live?

**Options to weigh**

| Topic | Options | Trade-off to analyse |
|---|---|---|
| Production access | (a) owner's personal account with a second factor; (b) separate operator identity; (c) no interactive access, changes through the pipeline only | Simplicity versus an audit trail and a smaller blast radius. |
| CI credentials | (a) long-lived stored keys; (b) short-lived federated tokens | Works everywhere versus nothing durable to steal; depends on the host. |
| Dependency updates | (a) manual, scheduled; (b) automated update pull requests; (c) automated with grouped, reviewed merges | Control and learning versus staying current. Every new dependency remains an owner decision under gate 2. |
| Vulnerability scanning | (a) the package manager's audit; (b) the repository host's built-in alerts; (c) third-party scanner | Free and limited versus coverage, noise and another vendor. |
| Secret scanning | (a) the repository host's push protection; (b) a local pre-commit scanner; (c) both | (b) is a new dependency and a hook, which needs approval and touches files outside this phase. |

**Assumptions to confirm with the owner**

- The owner's accounts for the repository host and any future vendor use a second factor (unverified).
- No second human has, or will soon have, access.
- Which jurisdictions' breach-notification and privacy duties apply (unverified; may need professional advice, which is outside this phase).

**The document must contain**

An identity and permission matrix. A production access procedure. A secret inventory by name with rotation triggers, including the webhook signing secret per environment and the link-signing key; no values anywhere. A secret exposure runbook. An incident response runbook with severity definitions. A dependency and vulnerability policy. A release control list. The list of secret-bearing file formats for the hardening pass. **An audit section** answering question 5 (criterion 21). The webhook requirements of question 10 and the signing-key requirements of question 11. A list of personal-data processors. The CI supply-chain rules of question 13. The admin access design. The roots of trust and their protection. A security alert list and the placement of rate limiting.

### F. Infrastructure and cost

**Questions to answer**

1. For each backing service, should development use a local install, a container, a hosted instance or an in-memory substitute, given that Docker is not installed today?
2. Where does MongoDB run in production, and what does each option cost to run and to operate?
3. **Ephemeral state and background work.** What short-lived state exists (sessions, rate-limit counters, idempotency records) and what work runs outside a request (processing after upload, email, reconciliation, clean-up, backups)? What is the smallest mechanism for each at launch scale? Does any of them justify Redis?
4. Where do large digital assets live? What does delivering them cost? Egress, meaning data transferred out to customers, is a primary cost driver for a download business and must be modelled explicitly.
5. **What does "authorized per request" mean for downloads** (observed rule in `.claude/rules/security.md`: authorized per request, links expire)? Where does the entitlement check sit: when a link is issued, or on every byte delivered? How long must a link live for a large file? What happens to a resumed download after expiry? What does a link already issued allow after a refund? Is there a download limit per purchase?
6. Where do the web front end and the API run?
7. What does the system cost per month at zero sales, at a first modest volume, and at a volume ten times that? Which line grows fastest?
8. What is the exit cost from each option: data export, egress on the way out, proprietary features?
9. Agenda item, not critical path (observed, reviewer section 5): QA has no screenshot tool (D7). The phase may propose options for one. It is a new dependency and needs an owner-approved plan.
10. **Upload path.** How does a large file get into storage when the admin publishes an asset: through the API, or direct to storage? What does each require of the host (request size and duration limits, memory) and of the store (direct upload, resuming a broken upload)?
11. **Transactional email.** Is email delivery a backing service at launch (receipts, and verification or reset messages depending on the authentication approach)? What would it add in vendors, secrets, cost lines and DNS records?

**Options to weigh**

| Topic | Options | Trade-off to analyse |
|---|---|---|
| Local MongoDB | (a) native install; (b) container, which requires installing Docker; (c) hosted development cluster; (d) in-memory server for tests only | Every option is an install, an account or a dependency. All need owner approval. Compare offline working, parity with production, and onboarding effort. |
| Production MongoDB | (a) managed service from the database vendor; (b) managed service from another host; (c) self-managed on a server | Operational burden on one person versus cost and control. Backup features by plan are unverified. |
| Ephemeral state and background work | (a) in-process, correct for a single instance only; (b) database-backed; (c) managed Redis; (d) self-managed Redis | Proposed starting position for the analysis: the burden of proof is on including Redis. Record the trigger that would justify adding it. |
| Asset storage | (a) hyperscale object storage; (b) S3-compatible storage with a different egress pricing model; (c) storage bundled with the application host | Vendors differ in whether and how they charge for egress, requests and minimum storage duration. All of it is unverified until checked. |
| Upload path | (a) through the API; (b) direct to storage with a short-lived permission issued by the API; (c) out of band by the owner, with the application registering a file already placed | (a) is bounded by the host's limits. (b) depends on what the store supports and makes upload validation harder. (c) is manual. |
| Download delivery | (a) signed, expiring links direct from storage; (b) proxied through the API; (c) a CDN with signed access | State for each where the entitlement check sits and what a leaked link allows. (b) may be charged for transfer twice (unverified) and ties up the API on very large files. (a) and (c) depend on what the chosen store supports. |
| Application hosting | (a) platform as a service; (b) a virtual server; (c) static hosting for the front end with a separate API host; (d) serverless functions | Operational burden, cost shape, cold starts, request-size and duration limits that matter for large files and for webhooks, scheduled jobs and a second process. Option (c) presupposes an application shape (decision 13). |
| Transactional email | (a) none at launch; (b) a hosted email service; (c) email bundled with another vendor | One more vendor and secret versus receipts and account recovery. |

**How cost must be written.** A cost model with named drivers (stored gigabytes, gigabytes transferred out, request counts, database size and tier, build minutes, log volume, seats) and stated volume assumptions. Each vendor figure carries a source link and the date checked, or the word "unverified". Verifying current pricing is a task of the phase **only if** the owner chooses option (a) or (b) in decision 6; otherwise cost stays relative and unverified. This brief was written without network access and no agent may assume it.

**Assumptions to confirm with the owner**

- A monthly cost ceiling for launch, and for the months before the first sale.
- Typical and maximum asset file size, catalogue size at launch, and a rough download volume (all unverified and all decisive).
- Customer geography, for region choice and data residency.
- Whether a single vendor for several services is preferred for simplicity, or avoided to limit dependence.

**The document must contain**

An options comparison per service with at least two alternatives and an operational ranking. The upload path analysis and how it constrains host and store. The download analysis of question 5. The list of ephemeral state and background work, with the mechanism proposed for each. The cost model with its assumptions and a sensitivity note on egress, including the replayed-link case. A cost and vendor register, as a section of this document, with source and date for every figure. A scaling note stating what changes at ten times the volume and what would force a re-architecture.

---

## 3. Deliverables

All paths are proposed.

**Decision records.** Records are not pre-numbered. The Software Architect assigns `ADR-NNNN-short-kebab-title.md` at creation. Status is one of Proposed, Accepted, Rejected, Deferred, Superseded. Every record from this phase carries the qualifier: "Design decision only: accepting it does not authorize sign-up, spending or implementation".

Reviewer roles: **Sec** is the Security Engineer; **IR** is the Independent Reviewer, who inspects every completed deliverable; **Arch** is the Software Architect; **CE** is the Chief Engineer; **Owner** approves.

| # | Document | Proposed path | Owning agent | Required reviewers | Evidence needed to accept |
|---|---|---|---|---|---|
| 1 | Environment strategy (area A), carrying the environments and configuration decisions | `docs/operations/environment-strategy.md` | `devops-sre` | Sec, Arch, IR | Environment matrix present; variable inventory by name only; "Decisions for the owner" section; Sec review on file; no secret value in the file |
| 2 | Delivery and release design (area B), carrying the CI platform and release control decisions | `docs/operations/delivery-and-release.md` | `devops-sre` | Sec, Arch, IR | Gate list with blocking or advisory marked; rollback procedure covers the migration case; CI permission table; "Decisions for the owner" section; Sec review on file |
| 3 | Observability and reliability design (area C) | `docs/operations/observability-and-reliability.md` | `devops-sre` | Sec (logging redaction), IR | Redaction list; alert table including "paid but no entitlement"; every availability objective has its assumption |
| 4 | Backup, restore and disaster recovery design (area D) | `docs/operations/backup-and-recovery.md` | `devops-sre` | Sec, Arch, IR | Every RPO and RTO in the required form; the three isolation statements; restore procedure marked untested in the exact words |
| 5 | Operational security procedures (area E): access, rotation, exposure response, dependency policy, audit | `docs/operations/operational-security.md` | `devops-sre` | Sec, IR | Identity and permission matrix; secret inventory by name; audit section; Sec review on file |
| 6 | Incident response runbook (area E) | `docs/operations/incident-response.md` | `devops-sre` | Sec, IR | Severity definitions; first-action steps; Sec review on file |
| 7 | Infrastructure options and cost model (area F), including the cost and vendor register | `docs/operations/infrastructure-options-and-cost.md` | `devops-sre` | Arch, Sec, IR | Two or more alternatives per table; ranking and reason; every figure has a source link and date, or the word "unverified" |
| 8 | Decision record: hosting target | `docs/architecture/decisions/`, number assigned at creation | `software-architect` | `devops-sre`, Sec, IR, Owner | Options named and linked, not restated; decision drivers, recommendation, consequences, dependencies and revisit trigger present; status line and qualifier present |
| 9 | Decision record: MongoDB hosting and local development | As row 8 | `software-architect` | `devops-sre`, Sec, IR, Owner | As row 8 |
| 10 | Decision record: ephemeral state and background work | As row 8 | `software-architect` | `devops-sre`, Sec, IR, Owner | As row 8 |
| 11 | Decision record: asset storage, upload and download delivery | As row 8 | `software-architect` | `devops-sre`, Sec, IR, Owner | As row 8; egress and the placement of the entitlement check treated explicitly |
| 12 | Security review of the phase | `docs/security/sre-architecture-phase-review.md` | `security-engineer` | IR | Coverage table and findings table as criterion 13 requires; states what was not reviewed |
| 13 | Learning record: before, during, after | `docs/learning/sre-architecture-phase-before.md`, `-during.md`, `-after.md` | `sage` | IR | Three files exist; comprehension check recorded separately from acceptance |
| 14 | Independent review report | `docs/status/sre-architecture-phase-independent-review.md` (name proposed; CE may change it before the phase opens) | `independent-reviewer` writes nothing; CE saves the report | Owner | Every row inspected; section 4 criteria reported one by one with the command or reading used |
| 15 | Hand-tracking file: stages, session ids, tool lists, the decision index, saved specialist reports, owner acceptances | `docs/status/sre-architecture-phase.md` | `chief-engineer` | IR, Owner | Marked "tracked by hand; not machine-checked"; holds the items criteria 1, 12, 13, 15, 17 and 18 name |

Fifteen rows, seventeen files. If the owner chooses decision 13 option (a), a one-page provisional system context by the Software Architect under `docs/architecture/` is added as a sixteenth row.

**QA and Test Engineer.** Proposed: no deliverable in this phase, because nothing is built and nothing can be executed. If the owner chooses decision 9 option (b), QA runs the content searches of section 4 and records them in `docs/testing/`; otherwise the owner runs them.

**Sequence (proposed).**

1. Preconditions P1 to P4 are met. The owner's planning inputs come first.
2. SAGE before.
3. The provisional system context, only if the owner authorized it (decision 13).
4. Areas F and A. Then the four decision records, each after the document it rests on.
5. **Owner checkpoint** on hosting, database and storage direction. The owner decides the records, gives a direction at the level of category, or expressly declines; whatever is declined is carried as provisional. Areas B to E are not written before this.
6. Areas B, C, D and E.
7. Security review; Independent review; SAGE after.
8. Remaining owner decisions and acceptance of the phase.

One writing agent at a time.

---

## 4. Acceptance criteria

Each is a yes or no check. The checker records the command or the reading used, and the tracking file records who checked what. "QA or owner" means QA if decision 9 option (b) is chosen, otherwise the owner: the Independent Reviewer has no content search. "Search" means a content search over the deliverable files of rows 1 to 13 only, never the whole tree.

1. **Files exist.** *IR.* Every file in section 3 exists at its listed path. Any absent file is listed in the tracking file with the owner's words and the date.
2. **Nothing else changed.** *IR if the baseline is a commit; the owner if it is a hash list.* Against the P1 baseline, the only paths created or changed are under `docs/operations/`, `docs/architecture/`, `docs/security/`, `docs/learning/`, `docs/status/`, and `docs/testing/` if QA takes part. `.claude/logs/agent-runs.jsonl` is excluded from the comparison, because the harness appends to it. If the owner runs a hardening pass in parallel, changes under `.claude/` and `scripts/` made by that pass are compared against the hardening approval, not this brief. Commands: `git status --porcelain --untracked-files=all --ignored` and `git diff --name-status <baseline>`.
3. **Protected files untouched.** *As criterion 2.* `package.json`, `.npmrc`, any lockfile, `.gitignore`, `CLAUDE.md`, `.github/`, `apps/`, `packages/` and `e2e/` are absent or unchanged. So are `.claude/` and `scripts/`, apart from the run log and the hardening clause in criterion 2.
4. **Option tables.** *IR, by reading.* Each of rows 1 to 7 carries a list of its option tables. Each listed table has at least two option rows and is followed by a line beginning `Reason:`.
5. **Recommendations are labelled; nothing reads as decided.** *Search: QA or owner. Status lines: IR.* A case-insensitive search for `recommend` finds no line whose own text or heading lacks "recommendation, awaiting owner approval". Each decision record has a status line with one of the five values and the qualifier from section 3; Accepted, Rejected and Deferred cite the date and place of the owner's statement. A search for `we will use`, `we chose`, `selected` and `decided` returns no line without such a citation.
6. **RPO and RTO.** *Table: IR. Search: QA or owner.* The table in row 4 has the six columns of area D and no empty cell. No RPO or RTO value appears outside it.
7. **Availability.** *Table: IR. Search: QA or owner.* Every availability objective is a row of one table in row 3 with a non-empty Assumption cell. None appears elsewhere.
8. **Cost figures.** *Search: QA or owner. IR then reads each hit.* A search for currency symbols and codes, `dollar`, `cent`, `per month`, `/mo`, `free tier`, and a digit followed by `GB`, `MB`, `TB`, `requests`, `minutes` or `seats` finds no line without a source link and date, or the word "unverified". This shows a source is cited, not that it is right.
9. **Evidence labels.** *IR.* Every second-level section begins with a line `Evidence: observed`, `proposed`, `unverified`, or `mixed, labelled inline`. This checks form, not truth.
10. **No secret values.** *Search: QA or owner. Reading: Sec.* A search for private-key headers, known key prefixes, connection strings holding credentials and long token-shaped strings returns no hit; every `NAME=` line has an empty value or one in angle brackets; and the security review states it read every deliverable for secret values. A clean result means "none found by this scan".
11. **Restore is unproven.** *IR.* Row 4 contains the exact sentences "No restore has been tested. This backup design is unproven."
12. **One decision index.** *IR.* The tracking file holds a single numbered list with one entry per decision record and one per item under "Decisions for the owner" in rows 1 to 7; the counts match. It is an index and restates no options. No decision record contains an option table.
13. **Security review.** *IR reads; Sec declares a finding resolved.* The review exists at its listed path, with a coverage table naming each row reviewed, at least rows 1, 2, 4, 5, 6 and 8 to 11, and a findings table with Severity and State. An unresolved **critical** finding blocks acceptance (observed rule, `.claude/rules/security.md`). An unresolved **high** finding needs the owner's explicit written acceptance, recorded in the tracking file by finding id. "Resolved" means re-verified by the Security Engineer, not by the author.
14. **Independent review report.** *The owner, or QA. Not the reviewer, which does not certify its own report.* The saved report has an entry for each row of section 3 and each criterion here, as met, not met or not checkable. If the raw session output was saved, it is cited; otherwise the copy is graded as relayed.
15. **Learning.** *IR.* The three learning files exist. The tracking file holds `accepted` and `learning-complete` as separate fields.
16. **Later requirements.** *IR.* Each of rows 1 to 11 has a section headed "What this would later require", with four lists: accounts, installs, dependencies, files. `none` is a valid entry.
17. **Fence evidence.** *CE records; IR reads.* For every `devops-sre` session of the phase, the tracking file holds the session id and the harness start-up tool list, and the list shows no shell. Each specialist report is saved under `docs/status/` and has the six sections of `CLAUDE.md`. A report's own "Commands run" list is supporting evidence only.
18. **Undecided items.** *Table: IR. Search: QA or owner.* One table in the tracking file has a row for each of: payment provider, file storage, authentication approach, hosting target, local MongoDB and Redis, application layout. Each row holds a decision reference, or `undecided` and what it blocks. A search for the product names used in the documents returns only lines inside an option table or marked as an example.
19. **Provisional sections.** *IR.* Every section that depends on an undecided item begins `Provisional: depends on <item>`, checked against the table in criterion 18.
20. **Backup isolation.** *IR reads; Sec confirms in its review.* Row 4 states (a) which identity can delete or overwrite a backup, and that it is not the application's, CI's or an agent session's; (b) who holds the backup encryption key and where the key is backed up; (c) how the restore target is protected, and whether a drill uses production-grade controls or scrubbed data.
21. **Audit records.** *IR reads; Sec confirms in its review.* Row 5 has an audit section stating the events in scope, what each record holds, the retention period, and where records are kept so that neither the application nor one stolen credential can alter them.

---

## 5. Working rules for the phase

These are binding for the duration of the phase. They are stricter than the role's standing permissions on purpose.

**The fence on `devops-sre`: no shell at all, enforced at launch.**

1. Every `devops-sre` session of the phase is started with the shell removed: `claude -p --model opus --agent devops-sre --disallowedTools Bash`. Observed by the Chief Engineer on 2026-10-11: a session launched this way was given exactly Read, Grep, Glob, Write and Edit. No configuration change is needed.
2. The Chief Engineer records the harness start-up tool list of each session in the tracking file. That record, not the specialist's own report, is the evidence (criterion 17).
3. If the shell is ever present in a session's tools, the session stops before writing anything and reports to the Chief Engineer. The same applies to any tool beyond the five named in rule 1.
4. `devops-sre` writes only under `docs/operations/`, by any tool.
5. It creates and edits no `package.json`, `.npmrc`, lockfile, `.gitignore`, root tooling config, or file under `.github/`, `deploy/`, `.claude/` or `scripts/`. Path ownership would permit some of these; the phase does not.
6. It proposes tooling, CI actions, runtimes, services and dependencies in writing, in its documents, for owner approval. It installs, enables and signs up for nothing.
7. Known side effect (observed, hardening plan H-09): a directly launched session is not recorded in `.claude/logs/agent-runs.jsonl`. The tracking file records its session id instead. Nobody edits the run log to compensate.
8. It stops and reports to the Chief Engineer if a task appears to need anything these rules exclude.

*Why (observed):* findings R4 and R5 show the dependency gate and the destructive-command gate are not technically enforced for this role, and the reviewer names the fence as the one condition it would not waive. The Security Engineer (SA-01) found that a list of forbidden command spellings can always be evaded. With no shell, that list is moot, so it has been removed.

**Rules for all agents in the phase**

9. Each agent writes only in its own area: `docs/operations/` for `devops-sre`, `docs/architecture/` for the Software Architect, `docs/security/` for the Security Engineer, `docs/learning/` for SAGE, `docs/status/` for the Chief Engineer, and `docs/testing/` for QA if it takes part. The Independent Reviewer writes nothing.
10. Command-line agent sessions use `--model opus`. Observed in the validation record: a session started without a model flag fails (D3). Whether to pin a model in settings instead is the owner's call and is outside this phase.
11. The phase is opened as **security-sensitive** (precondition P4). The Security Engineer's review is mandatory and is decided at the start, not at the end. *Why (observed):* finding R16b shows the security-sensitive flag is self-declared, so it must be set deliberately.
12. The Security Engineer reviews everything touching secrets, access, credentials and incident response. The author of a document does not review it.
13. SAGE explains the concepts before, during and after. The owner should not be asked to decide something that has not been explained.
14. No agent states a price, quota or free-tier limit as fact without a source and a date.
15. No agent treats another agent's recommendation, an earlier approval or silence as the owner's approval.
16. Evidence rules from `CLAUDE.md` apply: observed, proposed and unverified are kept apart; a restore is not proven until it has been run.
17. Secret values appear nowhere. Names only.

---

## 6. Tracking

Observed (finding R6): the current ledger checker, `scripts/check-feature-ledger.mjs`, has no tier for documentation-only work. A ledger for this phase cannot pass at acceptance under `substantial` or `small` without a false tick on `implementation` and `qa`, and `tier: trivial` skips every check.

Observed: `docs/status/security-hardening-plan-2026-10-11.md` exists, and its section 4 holds the Chief Engineer's recommendation. In short: until a `design` tier is approved and applied, track the phase by hand in `docs/status/sre-architecture-phase.md`, outside `docs/status/features/`, marked "tracked by hand; not machine-checked", with `started` no earlier than 2026-10-12. That file is row 15 of section 3.

This brief does not design the tracking. The owner decides it before the phase opens (decision 3, precondition P3). The Security Engineer notes that the date rule is typed in by hand and is a stop-gap, not a mechanism.

---

## 7. Decisions requiring the owner's approval

Numbers are unchanged from the first draft so that the reviews' references still hold. Number 5 is retired; number 13 is new. Twelve decisions remain.

1. **Start the phase.** Options: (a) approve this brief as written; (b) approve with changes; (c) reject or defer.
2. **Confirm the fence on `devops-sre`** in section 5: no shell at all, enforced by the launch form in rule 1, with the harness tool list recorded as evidence. Options: (a) as written. Recommendation, awaiting owner approval; this is what the Security Engineer asks for, and the Independent Reviewer says it would not waive the fence. (b) Weaker: keep a shell limited to read-only git commands, which needs an owner-directed change to the guard under `.claude/`. (c) Weakest: a written rule only, as in the first draft, with the specialist's own command list as evidence. Also to settle: who starts these sessions, since a direct launch is itself a shell command.
3. **Tracking for a documentation-only phase.** Options are in section 4 of `docs/status/security-hardening-plan-2026-10-11.md`: a new tier in the checker, which is a change to `scripts/` that only the owner can direct, or hand tracking as section 6 describes.
4. **Model flag.** Options: (a) `--model opus` written into this brief as a working rule, which is what section 5 proposes; (b) pin a model in `.claude/settings.json`, an owner-only change.
5. *Retired.* The baseline is no longer a choice; it is precondition P1. The owner chooses only its form: a commit or a hash list.
6. **Who verifies vendor pricing, and how.** Options: (a) the owner checks vendor pages and supplies figures; (b) an agent is given a web tool for this purpose and cites link and date, which is a configuration change made by the owner and outside this phase's own authorization; (c) cost stays relative and unverified in this phase, with verification moved to the moment of each purchase decision. Verification is a task of the phase only under (a) or (b). The Security Engineer prefers (a) or (c).
7. **Planning inputs only the owner can supply** (precondition P2). A monthly cost ceiling before and after launch; typical and largest file size; catalogue size at launch; rough expected download volume; customer geography; how much lost order data is tolerable; whether originals are kept outside the platform. Added on the Architect's advice: whether catalogue pages must be findable by search engines; the download limit per purchase and the acceptable link lifetime; whether email is wanted at launch.
8. **Constraints on options.** (a) Is installing Docker acceptable, now or later, or excluded? (b) Is a staging environment wanted at launch, or deferred? (c) Single vendor preferred or avoided? (d) Is the repository public or private?
9. **QA's role in this phase.** Options: (a) none, in which case the owner runs the content searches of section 4; (b) QA runs them and records the results in `docs/testing/`.
10. **Deliverable list and paths** in section 3. Options: (a) as listed, fifteen rows with four decision records, as the Architect proposes; (b) the first draft's seventeen rows with six decision records; (c) other additions or merges.
11. **Ordering against the hardening pass** on the guard findings. Options: (a) run in parallel, as the Independent Reviewer suggests; criterion 2 says how changes are then attributed; (b) hardening first; (c) hardening later. The Security Engineer advises against (a): sequential, never concurrent in one working tree (SA-18). The two reviewers disagree and this brief does not pick.
12. **Screenshot tooling for QA (D7).** Options: (a) include an options proposal in this phase; (b) leave it for a separate proposal before the first UI feature.
13. **A provisional system context before area F.** The hosting options presuppose an application shape (a web front end plus one API) that the phase is told not to decide. Options: (a) authorize a one-page provisional system context from the Software Architect, naming the components, the data flows and the upload and download paths, marked provisional and not a layout approval; (b) proceed without one, with every operations document stating that it assumes the provisional layout in `CLAUDE.md`, unverified, and the hosting record unable to move beyond Proposed; (c) decide the layout first, as a separate phase. The Architect recommends (a); recommendation, awaiting owner approval.

Not decisions of this brief, listed so they are not lost: the choice of hosting, database hosting, storage, CI platform, Redis, and every vendor. Each comes to the owner as a decision record or a "Decisions for the owner" item, in two groups: at the checkpoint and at the end. Payment provider and authentication approach remain undecided and are not made here.

---

## 8. Risks and open questions

**Risks**

1. **The change check depends on the baseline.** Observed by the Chief Engineer on 2026-10-11: the folder is a git repository (`git rev-parse --is-inside-work-tree` returned `true`) and `git status` reports "No commits yet on main". Agent sessions are told otherwise by a stale environment note; the note is wrong. With every file untracked, `git status` shows a new file and cannot show an edit to an existing one. Precondition P1 closes this. Not re-run by the revising session, which used no shell.
2. **The fence covers the shell, not the file tools.** Launching without a shell is a mechanism, and the tool list is harness-grade evidence. Write and Edit remain limited only by path ownership, which lets `devops-sre` write root tooling config and `.github/`. Rules 4 and 5 forbid that in words; criteria 2 and 3 detect it afterwards. Unverified: whether the launch flag also applies to a delegated run, as opposed to a direct one.
3. **Decisions depend on things not yet decided.** Payment provider, authentication approach and application layout shape the environment inventory, the secret list and the backup scope. Documents will carry provisional sections; they must be marked (criterion 19) and revisited.
4. **Cost figures go stale.** Vendor pricing and plan limits change. A dated register reduces this and does not remove it. Re-check at the moment of each purchase.
5. **Volume assumptions are guesses.** With no sales history, the cost model and the objectives rest on the owner's estimates. Egress is the line most sensitive to being wrong, and a replayed link can drive it deliberately.
6. **Over-engineering.** Six areas of enterprise practice applied to a one-person shop can produce a design nobody can operate. The standard is the smallest design that protects customers' purchases and the owner's files.
7. **Design is not proof.** Everything this phase produces is designed and untested. No backup, restore, rollback, alert or pipeline will have been run. The documents must not read as if they had.
8. **The security review flag is self-declared (R16b).** If the phase is not opened as security-sensitive, nothing forces the Security Engineer's review. Precondition P4 addresses this.
9. **Uncovered secret formats (R8).** Options the phase recommends may introduce key formats the guards do not recognise. The phase lists them; fixing the guards is the owner's hardening pass.
10. **Review limits.** Observed: the Independent Reviewer cannot execute most commands and has no content search. Section 4 names a checker for every criterion; the searches fall to QA or the owner.
11. **Document volume versus a learning owner.** Fifteen rows and seventeen files is still a lot to read and decide on. The checkpoint, the merges and SAGE's explanations are the mitigations.
12. **Direct sessions are not in the run log (H-09).** The hand-tracking file is the only record of them, and it is typed, not harness-written.

**Open questions**

1. Closed: the Software Architect assigns record numbers at creation (section 3).
2. Closed: decision records are put to the owner in two groups (section 3, sequence).
3. Which legal, tax and privacy obligations apply to the owner's business and customers? This affects retention and incident notification and may need advice outside the agents' competence.
4. Will the extension-hosted session or command-line sessions run the phase? Observed in the validation record: guard behaviour for subagents started from the extension is unverified. Rule 1 requires a direct command-line launch for `devops-sre`.
5. What is the trigger for the follow-on implementation phase, and is it one phase or several, for example local environment first and production later?
6. Closed: the tracking file named in section 6 exists.
7. Who launches the `devops-sre` sessions and saves each start-up tool list: the owner, or the Chief Engineer (decision 2)?
