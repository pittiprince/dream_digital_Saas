# Architecture review: Proposal A, SRE and DevOps Architecture Phase Brief

| | |
|---|---|
| Status | **Review. Advisory only.** Nothing here is approved, and nothing here approves the brief. |
| Reviewed document | `docs/operations/sre-architecture-phase-brief.md` (406 lines, drafted by `devops-sre`) |
| Reviewer | `software-architect`, on the Chief Engineer's task, 2026-10-11 |
| Scope | Architecture boundaries and technical coherence of the brief. Not the SRE architecture itself. |
| Technology choices made here | None |

**Labels.** *Observed*: read in this repository in this session. *Proposed*: a suggestion of this review, awaiting the owner. *Unverified*: an assumption nobody has checked, including product behaviour I believe to be true but did not check against the vendor's documentation.

**How to read the references.** "L233" means line 233 of the brief. "Row 9" means row 9 of the deliverables table in section 3 of the brief. "Criterion 12" means item 12 of section 4.

**Severity.** *High*: left as is, the phase is likely to produce a recommendation that has to be redone, or an approval that means something other than what the owner thinks. *Medium*: causes rework, duplicated writing or an unreliable check. *Low*: wording or tidiness.

---

## 1. Verdict

The brief is careful, honest about what it does not know, and well fenced. Its question set for areas A to E is sound for a one-person shop. I would not advise the owner to reject it.

I would advise changes before it is approved. Five matter most:

1. **The file path into and out of the system is under-specified (F-01, F-02).** The product is large protected files. The brief asks how files are downloaded but never how the admin uploads them, and it compares download options on bandwidth cost only. Those two questions decide which hosting options are even possible.
2. **Payment webhooks do not appear anywhere in the brief (F-03).** Observed: a search of the brief for "webhook" returns nothing. "Paid but no entitlement" is the most damaging failure this business can have, and it is an operational concern as much as a coding one.
3. **The brief excludes the application layout and then asks questions that cannot be answered without one (D-01).** Hosting, the pipeline shape and the variable inventory all presuppose a web front end plus one API.
4. **Decision records and options documents will say the same thing twice, and in one case three times (B-01).** The split needs one rule.
5. **Several acceptance criteria cannot pass as written (A-01, A-02).** Criteria 2 and 3 fail by construction if the hardening pass runs in parallel, and criterion 12 requires a list that has no path.

---

## 2. Question 1: boundaries between options analysis and decision record

### B-01. The same options and the same recommendation are written in up to three places. Severity: medium.

**Location.** L44 and L45 (every option table carries a recommendation and its reason); L261 (area F document must contain "an options comparison per service with at least two alternatives and a labelled recommendation"); L281, row 9 evidence, inherited by rows 10 to 14 ("options and consequences listed"); L293 ("decision records drafted alongside by the Architect from the options documents"); L312, criterion 12 (every owner decision "in a single numbered list with its options").

**Observed.** For hosting, MongoDB hosting, Redis, storage and delivery, and the CI platform, the brief requires: an options table with a recommendation in a `docs/operations/` document; a decision record listing options and consequences; and a single numbered list of decisions with their options.

**Why it matters.** Three copies drift. When they disagree, the owner cannot tell which one is the proposal. It also triples the review load, since rows 9 to 14 each carry four or five reviewers. L293 describes my role as drafting "from the options documents", which is transcription.

**Proposed split.** One rule: *analysis is written once, in the operations document; the decision is written once, in the decision record; neither restates the other.*

| Content | Lives in | Written by |
|---|---|---|
| Options, how each works operationally, cost drivers, operational burden on one person, failure modes, exit cost, what each option would need approved later (accounts, installs, spending) | Operations document | `devops-sre` |
| An operational ranking of the options with reasons | Operations document | `devops-sre` |
| Requirements the decision must satisfy, including constraints from the application side (file sizes, entitlement check placement, data consistency, contracts) | Decision record, "decision drivers" | `software-architect` |
| Options by name only, each with a link to the section that analyses it | Decision record | `software-architect` |
| The single recommendation put to the owner, and the reason | Decision record | `software-architect` |
| Consequences for component boundaries, the data model and API contracts; what the decision blocks and depends on; the trigger for revisiting it | Decision record | `software-architect` |
| The owner's decision, its date and where it was given | Decision record status line | `software-architect`, recording the owner's words |

Under this rule the "single numbered list" of criterion 12 becomes an index of the decision records, not a third copy of their options.

**Recommended changes to the brief.**
- L45: change so that an operations document states an *operational ranking*, and the recommendation to the owner is stated in the decision record for those topics that have one.
- L281: replace "options and consequences listed" with "options named and linked, not restated; decision drivers, recommendation, consequences, dependencies and revisit trigger present".
- L293: replace "drafted alongside by the Architect from the options documents" with an explicit order (see section 4 below).
- L312: say the list is an index.

**Alternative (proposed, not recommended).** Keep the recommendation in the operations document and make the decision record a short record of what the owner decided. This is simpler to write but leaves the architectural consequences with no home.

### B-02. Two of the six decision records have no architectural content. Severity: medium.

**Location.** Row 9, L281 (environments and configuration); row 14, L286 (CI/CD platform and release control).

**Observed.** `.claude/agents/devops-sre.md` gives that role environment separation and CI/CD proposals. `.claude/agents/software-architect.md` gives this role component boundaries, contracts and the data model. Which environments exist at launch and which CI platform is used change no component boundary, contract or data shape.

**Why it matters.** I would add nothing to those two records except formatting. That is the duplication in B-01 in its purest form.

**Recommended change.** See S-01 in section 6, which says exactly which rows to merge. One part of row 9 is architectural and should not be lost: how the application loads and validates configuration (L59), and the fact that front-end configuration is public (T-09). That belongs with the application layout decision, which the brief excludes.

### B-03. Review is circular for the rows that feed decision records. Severity: low.

**Location.** Rows 1, 2, 4 and 7 list Arch as reviewer (L273, L274, L276, L279). Rows 9 to 14 list `devops-sre` as reviewer (L281 to L286).

**Observed.** I review the options document, then write the record derived from it, which its author then reviews.

**Why it matters.** Each role is checking its own input. This is tolerable if the Independent Reviewer and the owner are the real check, and the brief does make them so. It should be said plainly.

**Recommended change.** State in section 3 that the Arch review of rows 1, 2, 4 and 7 is limited to architectural constraints and consistency with the decision records, and that the `devops-sre` review of a decision record is limited to checking that the operational analysis is represented correctly.

### B-04. Reviewer gaps on documents that define application behaviour. Severity: medium.

**Location.** Row 3, L275 (reviewers: Sec for redaction, IR); L149 (the document must contain a logging standard with fields and a correlation identifier, and health and readiness check definitions); L104 and L115 (migration ordering and rollback); row 4, L276.

**Observed.** The logging fields, the correlation identifier and the health endpoints are things the application implements. Health endpoints are API surface, which this role's file places in `docs/api/`. Migration ordering and restore are data-model matters, which this role's file says are reviewed "with the Backend and Data Engineer". `backend-data-engineer` appears nowhere in the brief.

**Why it matters.** An operations document can set a standard that the application design has not agreed to carry.

**Recommended change.** Add Arch as a reviewer of row 3. For rows 2 and 4, either add `backend-data-engineer` as a reviewer of the migration and restore sections, or state that the Arch review covers the data-model angle and records open questions for that role. I recommend the second, to keep the review count down.

### B-05. The split between rows 5 and 6 puts one runbook in each. Severity: low.

**Location.** L223; rows 5 and 6, L277 and L278.

**Observed.** L223 lists a secret exposure runbook and an incident response runbook. Row 6 is "Incident response runbook". Row 5 covers "exposure response".

**Recommended change.** Row 5 holds policy (identities, access, rotation, dependency policy, release controls). Row 6 holds both runbooks, since both are opened under stress and should be findable in one place.

---

## 3. Question 2: decision-record convention

Observed: `docs/architecture/` did not exist before this review file was written. The brief leaves the convention to this role (L267, L400). The following is **proposed** and awaits the owner. This review does not create the folder, the index or the template; that is a separate task.

**Term.** "Decision record" in prose, "ADR" in file names and cross-references. They mean the same thing.

**Path and name.** `docs/architecture/decisions/ADR-NNNN-short-kebab-title.md`. This matches what the brief already proposes (L281 to L286), so no path in the brief changes for that reason. The title names the question, not the answer: `asset-storage-and-delivery`, not the name of a product.

**Numbering.**
- Four digits, zero padded, starting at 0001.
- A number is assigned when the file is created, in order of creation. Numbers show order of writing, not importance or dependency.
- Numbers are never reserved in advance, never reused and never changed, including for rejected records.
- Consequence for the brief: rows 9 to 14 should name each record by its title and say "number assigned at creation". Pre-printing ADR-0001 to ADR-0006 (L281 to L286) fixes numbers before it is known which records will exist. See S-01.

**Status values.** One of:

| Status | Meaning | Who sets it |
|---|---|---|
| Proposed | Written, awaiting the owner. The default for everything this role writes. | `software-architect` |
| Accepted | The owner decided in favour. Carries the date and the place the decision was given. | Recorded by `software-architect`, only on the owner's own statement |
| Rejected | The owner decided against. The record stays, with the reason. | As above |
| Deferred | The owner chose not to decide yet. Carries the trigger that reopens it. | As above |
| Superseded by ADR-NNNN | A later record replaces it. | As above |

Two qualifiers sit beside the status, not instead of it:
- **Provisional: depends on ...** A record whose recommendation rests on something undecided says what, and what would change if that went another way. A record can be Accepted and still provisional.
- **Design decision only.** Every record states that acceptance approves a design direction. It does not approve an account, an install, a dependency or any spending. Those remain separate approvals under `CLAUDE.md` gates 2, 4 and 6. See X-01.

**Changing a record.** A Proposed record may be edited freely. Once the owner has decided, the body is not rewritten; a new record supersedes it. Only the status line and a dated note change.

**Sections of a record (proposed).**
1. Title, status, date, qualifiers.
2. Context: the question in two or three sentences, with links to the analysis.
3. Decision drivers: the requirements the answer must meet, each labelled observed, proposed or unverified.
4. Options considered: names and links only.
5. Recommendation and reason; after the owner decides, the decision.
6. Consequences: what becomes easier, what becomes harder, what it constrains in the layout, data model and contracts.
7. Depends on, and blocks.
8. Revisit trigger.
9. What acceptance would later require: accounts, installs, dependencies, spending, each with its gate.

**Index.** `docs/architecture/decisions/README.md` lists every record with number, title, status and date. This can be the "single numbered list" that criterion 12 asks for (see A-02).

---

## 4. Question 3: dependencies and ordering

### D-01. The brief excludes the application layout, then asks questions that need one. Severity: high.

**Location.** L32 (application layout is out of scope); L81 (variable inventory with "the owning component"); L89 (one build artefact or several); L125 ("a single API"); L234 ("Where do the web front end and the API run?"); L248 option (c) ("static hosting for the front end with a separate API host").

**Observed.** `CLAUDE.md` line 10 calls the layout `apps/web`, `apps/api`, `packages/shared`, `e2e` provisional and says this role must propose the real layout for owner approval before any scaffold. No such proposal exists. The brief's questions assume a client-rendered front end plus one API throughout.

**Why it matters.** L248 option (c) is not only a hosting option; choosing it decides the application's shape. Three things that the layout settles change the hosting answer:
- Whether catalogue pages are rendered in the browser only, or on a server or at build time. A store's catalogue normally needs to be found by search engines and to show link previews. Whether that matters to this owner is **unverified**; it has not been asked. If it does, a static host alone may not be enough and a Node process serves pages as well as the API.
- Whether the front end and the API share a site or sit on different ones. This interacts with the authentication approach (cookies versus tokens), which is also excluded.
- Whether there is a separate background process (see T-04) and a separate admin surface.

**Recommended change.** Put this to the owner as a decision in section 7. Options: (a) authorize a short, provisional system context from this role before area F starts: one page naming the components, the data flows and the two file paths (upload and download), marked provisional and not a layout approval; (b) proceed without one, and require every operations document to state at its head "assumes the provisional layout in `CLAUDE.md`; unverified", with the hosting record unable to move beyond Proposed until the layout is decided; (c) decide the layout first, as a separate phase. Recommendation, awaiting owner approval: (a). It is the smallest thing that removes the contradiction. It adds one deliverable; section 6 removes three.

### D-02. What each excluded decision blocks. Severity: medium.

**Location.** L32; risk 3 at L388, which names the problem but not the affected questions.

**Proposed map.** The brief should carry this table, or its own version of it, so that provisional sections are known in advance instead of discovered.

| Excluded decision | Questions that cannot be answered finally | What can still be written |
|---|---|---|
| Application layout | A4 owning component (L57, L81); B1 to B3 pipeline and artefact shape (L87 to L89); B5 where migrations run (L91); C7 health checks (L127); F6 hosting of web and API (L234) | Requirements each option must meet; the options themselves at the level of category |
| Authentication approach | A4 and E3 secret names for sessions, signing or an identity provider (L57, L197); E1 the admin identity (L195); F3 whether Redis is needed for sessions and login rate limiting (L231); C1 the sign-in journey and its third-party dependency (L121); D1 whether accounts are held here or by a provider, which changes backup scope (L155); F6 whether web and API must share a site (L234); F7 any identity or email cost line (L235) | Rules that hold whatever is chosen: no secret in the repository, rate limiting required, admin actions logged |
| Payment provider | A2 sandbox mode (L55); A7 local onboarding, because receiving provider callbacks on a development machine usually needs a tunnel or a provider tool, which is an install (L60); A4 and E3 secret names (L57, L197); C1 and C8 the pay-to-entitlement journey and its alerts (L121, L128); D2 whether the provider is a reconciliation source (L156, L183); D6 retention, if the provider handles tax and invoicing (L160); F7 fee lines in the cost model (L235) | The requirement that a reconciliation source exists; the alert that matters (T-03); the public reachability requirement for the callback endpoint |

Unverified, and worth a question to the owner: whether the kind of payment product the owner has in mind also takes on tax handling, invoicing or file delivery. If it did, parts of areas D and F would change shape. This review does not assert that any product does.

### D-03. The sequence is workable only with a decision point in the middle. Severity: high.

**Location.** L293; open question 2 at L401; L378.

**Observed.** The sequence is: area F and area A; then B, C, D, E; decision records alongside; reviews; then owner decisions, all at the end.

**Why it matters.** Areas B, C, D and E all depend on the hosting, database and storage answers. If the owner decides those only at the end, B to E are written against a recommendation. If the owner then chooses differently, four documents are rewritten. The brief's own L293 says the others "depend on" F and A, then does not act on it.

There is a second ordering problem inside the first step. Area F compares hosting and storage options, but the requirements those options must meet come from area D (what data exists, what losing it costs, L155 to L162) and from the owner's inputs in decision 7 (L371). L244 already notes that backup features differ by plan. Options cannot be compared before the requirements are written.

**Proposed sequence.** No new work; the same content in a different order.

0. Owner supplies the planning inputs in decision 7 (L371). Without file sizes, volume and a cost ceiling, area F can produce structure but no ranking. The brief should say that area F does not start until these are given or explicitly marked unknown.
1. SAGE before.
2. Requirements pass: the provisional system context (D-01, if approved); the data classification and loss tolerance from area D (L155, L156, L162); the critical journeys from area C (L121).
3. Area F and area A, then the decision records that rest on them: hosting, database hosting, storage and delivery, background work.
4. **Owner checkpoint 1.** The owner decides those records, or expressly gives a direction at the level of category (for example, managed platform or own server; direct-from-storage delivery or proxied), or expressly declines. Whatever is declined is carried as provisional.
5. Areas B, C, the rest of D, and E, written against the outcome of checkpoint 1.
6. Security review; Independent review; SAGE after.
7. **Owner checkpoint 2.** Remaining decisions and acceptance of the phase.

**Recommended change.** Replace L293 with this order, and answer open question 2 (L401) with "in two groups".

### D-04. "One writing agent at a time" contradicts "drafted alongside". Severity: low.

**Location.** L293, both phrases in the same paragraph.

**Recommended change.** The sequence in D-03 removes the contradiction: decision records follow the document they rest on.

### D-05. What must be provisional. Severity: medium.

**Proposed list.** These should be marked provisional in whichever document carries them, with the undecided item named beside each:

- The environment variable inventory and the secret inventory, wherever a name depends on authentication, payment, email or storage (L81, L223).
- The identity and permission matrix, for application-level identities (L223).
- The pipeline's artefact shape and the migration step (L115).
- Health and readiness definitions (L149).
- The record on Redis or background work, until the authentication approach is known (row 12).
- The hosting record, until the layout is decided (row 10).
- Backup scope for accounts and for payment records (L187).
- Alerts and objectives for sign-in and for pay-to-entitlement (L149).
- Every cost line for authentication, email and payment fees (L261).

No acceptance criterion checks that provisional sections are marked. See A-04.

---

## 5. Question 4: technical coherence for a store selling large protected files

### T-01. The upload path is absent. Severity: high if files are large; low if they are not. File size is unverified (L255).

**Location.** L121 names "admin publishes an asset" as a critical journey. Area F (L229 to L237, table at L243 to L248) asks about storing and delivering files and has no question and no option row on how they arrive. L248 mentions "request-size and duration limits that matter for large files" as a hosting trade-off only. Observed: a search of the brief for "upload" returns nothing.

**Why it matters.** There are two ways for a large file to reach storage: through the API process, or directly from the admin's browser to storage with a short-lived permission issued by the API. The first is constrained by the host's request-size and duration limits and by the API's memory. The second needs the storage option to support it, including resuming a broken upload. That is a selection criterion for both hosting and storage, and the brief does not ask for it. `.claude/rules/security.md` (line 9) also requires type allowlists, size limits and content validation on uploads, which is harder when the file never passes through the API.

Three further consequences follow and are also unasked:
- **Consistency between the file and its record.** A file can land in storage without a catalogue record, or a record can exist without its file. Something has to detect and clean up orphans.
- **Processing after upload.** Checksums, and any preview or thumbnail generation, are work that happens after the upload request ends. That is background work (T-04).
- **Two classes of stored file.** Protected masters and public preview images have opposite access rules and opposite cost shapes (few very large transfers; many small ones). The brief treats "assets" as one thing (L232).

**Recommended change.** Add to area F: a question "How does a large file get from the admin to storage, and what does each option require of the host and the store?"; an option row "Upload path: (a) through the API; (b) direct to storage with a short-lived permission; (c) out of band by the owner, with the application registering a file already placed"; a question on orphan detection; and a statement that masters and previews are analysed separately.

### T-02. Download delivery is compared on cost only; the placement of the entitlement check is not examined. Severity: high.

**Location.** L233; L247.

**Observed.** L233 quotes the rule "authorized per request and links expire". L247 compares (a) signed links direct from storage, (b) proxying through the API, (c) a CDN with signed access, and gives one trade-off: bandwidth and API load.

**Why it matters.** The options differ in *where and when the entitlement check happens*, and that is the security property the product depends on.
- With (b), the API checks entitlement and then streams every byte. The check and the delivery are the same request.
- With (a) and (c), the API checks entitlement when it issues a link. After that the link itself is the permission until it expires. Anyone holding it can use it. "Authorized per request" then means the request for a link, not the request for the file. The brief should say which meaning it intends, and the Security Engineer should confirm it.

Questions that follow, none of which the brief asks:
- How long must a link live for a large file on a slow connection, and does expiry apply at the start of a transfer or throughout? **Unverified** and store-dependent.
- What happens to a resumed or ranged download after the link expires?
- After a refund or chargeback, a link already issued stays valid until expiry. Is that acceptable, and for how long?
- Where are downloads counted and audited: in the API (it sees link issuance only) or in storage access logs (a second log source, which area C does not mention)?
- Is there a limit on downloads per purchase? This is a product question for the owner, and it is also the main control on the cost risk in T-06.
- The store's master files must not be publicly listable or reachable without a link, in every environment.

**Recommended change.** Add these to area F question 5. Add a column or a paragraph to the L247 row stating, for each option, where the entitlement check sits and what a leaked link allows. Add link lifetime and download limits to the owner's inputs (L371).

**Wording defect in the same row.** L247 says option (b) "pays for bandwidth twice". That is a cost claim stated as fact. Whether transfer between a store and an application host is charged depends on the vendors and on whether they are in the same place; it is **unverified**. The brief's own rule at L46 forbids this. Severity: low. Reword to "may be charged for transfer twice; unverified".

### T-03. Payment webhooks are not mentioned. Severity: high.

**Location.** L121 ("pay, receive entitlement"); L128 and L149 (alerts); L156 and L183 (reconciliation source); area A question 7, L60 (local onboarding). Observed: no occurrence of "webhook" or "idempot" in the brief.

**Observed.** `.claude/rules/security.md` (line 7) requires that webhooks are verified by signature, duplicates handled idempotently, and an entitlement granted only after verified payment. So the system will have an inbound call from the payment provider, whichever provider is chosen.

**Why it matters.** Between "customer paid" and "customer can download" sits a call from a third party to a public endpoint. Operationally:
- **Reachability during deployment.** If the API restarts while the provider calls, the call fails. Whether and how long a provider retries is **unverified** and provider-dependent. The deployment design in area B should state what happens to calls that arrive mid-release.
- **The alert that matters most.** "A payment exists with no entitlement after N minutes" is the condition that produces an angry customer and a refund. It is not in the alert candidates. Detecting it needs either a periodic comparison against the provider or a record of received-but-unprocessed events.
- **Reconciliation as a routine job, not only a disaster tool.** L156 and L183 treat the provider as a recovery source after data loss. The same comparison is the everyday safety net for missed calls. It is scheduled work (T-04).
- **Hosting constraints.** An endpoint that must answer quickly and reliably is affected by cold starts and execution limits, which L248 mentions for large files but not for this.
- **Local development.** Receiving provider calls on a development machine usually needs a tunnel or a provider tool. That is an install, so it needs approval and belongs in the onboarding analysis at L60.
- **Data model.** Idempotent handling means storing the provider's event identifier under a unique index. That is a data-model requirement this role will carry into the contract and model review; the operations documents need only state the requirement.

**Recommended change.** Add a question to area C ("How is a payment that did not produce an entitlement detected, and how fast?"), one to area B ("What happens to inbound provider calls during a release?"), and a note to area A question 7. Add "inbound provider calls" to the provisional list tied to the payment decision.

### T-04. The Redis question is the wrong question; the right one is what work runs outside a request. Severity: medium.

**Location.** L231; L245; L195 (a "backup job" identity is assumed); row 12, L284.

**Observed.** L231 asks whether Redis is justified and lists sessions, rate limiting, queues and caching. L245 places the burden of proof on including it. That starting position is right and matches this role's standard: no queue without a concrete reason.

**Why it matters.** The brief never lists the work that would use a queue, so the question cannot be answered. Candidates, all **proposed** as things to consider, not requirements: processing after upload (T-01); sending email (T-05); the reconciliation comparison (T-03); cleaning up abandoned orders and orphaned files; backups, if they are logical dumps (L168). Some of these are *scheduled* rather than *queued*. Whether a host offers a scheduler, and whether it offers a second always-running process, are hosting selection criteria that L248 does not list.

Background work does not by itself imply a queue. At small scale, a collection in the existing database holding pending work, read by one worker, or doing the work in the request with safe retries, may be enough. That analysis belongs in the phase; the conclusion is not drawn here.

One hidden assumption should be made explicit. L245 option (a), "in-process or database-backed alternatives", is two different things. In-process state (rate-limit counters, sessions in memory) is correct only while exactly one API process runs. A platform that starts a second copy during a release, or restarts on deploy, breaks it. Database-backed state does not have that limit.

**Recommended change.** Reframe area F question 3 and row 12 from "Redis at launch" to "Ephemeral state and background work at launch": first list the work and the state, then ask for the smallest mechanism for each, then ask whether any of them justifies Redis. Split L245 option (a) into "in-process, single instance only" and "database-backed". Add "scheduled jobs" and "a second process" to the hosting criteria at L248.

### T-05. Transactional email is omitted. Severity: medium.

**Location.** Area F (L229 to L237); the secret inventory (L57, L197); the cost drivers (L250). Observed: no occurrence of "email" in the brief.

**Why it matters.** A store sends receipts and, depending on the authentication approach, verification and password-reset messages. That is very likely another vendor, another secret, another cost line, DNS records for the sending domain, and a dependency of the purchase journey. Whether the owner wants email at launch is **unverified**; it has not been asked. Leaving it out means the "full approval list" promised at L261 is incomplete.

**Recommended change.** Add email delivery as a backing service in area F, provisional on the authentication decision, with "none at launch" as an option to weigh.

### T-06. Egress is modelled as a cost but not treated as a risk. Severity: medium.

**Location.** L232 (egress modelled explicitly); L128 and L149 (alerts); L235 (cost at three volumes).

**Why it matters.** For this product the largest variable cost is driven by an action outside the owner's control: someone downloading. A shared link, a scripted client or a hostile visitor can turn a file into a bill. The brief models the expected case at three volumes and has no question on the abnormal case.

**Recommended change.** Add to area C an alert candidate on abnormal transfer volume or spend, and to area F a question: "What limits or caps does each option offer on spend or transfer, and what happens to customers when one is hit?" Vendor capabilities here are **unverified**. Tie it to the download limit question in T-02.

### T-07. Backup and restore have data-model consequences the brief does not name. Severity: medium.

**Location.** Area D, L155 to L187, especially L156, L161, L169 and L187.

**Observed.** Area D treats the database and the stored files as two things to back up. It does not ask what state the system is in after one of them is restored and the other is not.

**Why it matters.** These are requirements on the data model that must be known before it is designed. I am listing them as requirements for area D to state, not as solutions.

1. **Database and file store cannot be restored to the same instant.** After a database restore, records may point at files deleted since the backup; after a file restore, the reverse. Two design rules reduce this, both **proposed** for analysis: a stored file is never overwritten in place (a new version gets a new key), and a file removed from the catalogue is not physically deleted until after the longest backup retention period.
2. **Rebuilding orders and entitlements from the provider** (L156) works only if every order stores the provider's reference under a unique index, and if what is sent to the provider carries enough to identify the product and the customer. That must be decided when the order model is designed, not at restore time.
3. **A restore replays the past.** Emails may be sent again and provider calls redelivered. The same idempotency that T-03 requires is what makes a restore safe.
4. **Deleted customer data comes back.** If a customer's data is erased on request and an older backup is later restored, the erasure is undone. L160 raises retention but not this. Whether such a duty applies is **unverified** (L219).
5. **Old data, new code.** A restored backup may predate the current schema. This links area D to the migration options at L104 and should be said in both.
6. **Multi-document atomicity and local parity.** `.claude/rules/backend.md` (line 14) requires transaction boundaries for critical workflows; granting an entitlement on payment is one. My understanding, **unverified** against the documentation for whatever MongoDB version is chosen, is that multi-document transactions need a replica set and are not available on a plain standalone server. If so, the local options at L243 are not equivalent: a native install or an in-memory test server must be set up in that mode or the code that matters most cannot be exercised locally. The brief compares local options on "parity with production" (L243) without naming this as the parity point.

**Recommended change.** Add a question to area D: "After each disaster in question 7, what is inconsistent between the database, the file store and the payment provider, and how is it detected and repaired?" Add the transaction requirement to the comparison at L243 as a named criterion, marked for verification.

### T-08. The migration options mix two different things. Severity: low.

**Location.** L104.

**Observed.** Option (c), "no migration tool, schema enforced in code", is not an alternative to (a) and (b). With a schema library the schema is in code in every case; the question of how existing documents are changed remains.

**Recommended change.** Split into two rows: compatibility strategy ((a) expand then contract; (b) downtime), and mechanism (a migration tool; hand-run scripts; change on read).

### T-09. "One artefact promoted through environments" needs a front-end caveat. Severity: low.

**Location.** L89; L57 (which variables are secrets).

**Why it matters.** My understanding, **unverified** against the documentation of the planned build tool, is that a browser bundle has its configuration values written into it when it is built. If so, the front end cannot be built once and promoted unchanged unless configuration is supplied at run time by design, and every front-end variable is public by definition and must never be flagged as a secret.

**Recommended change.** Area B question 3 asks the artefact question separately for the front end and the API. The variable inventory at L81 gains a column "visible to the browser: yes or no".

### T-10. Domain and origin layout is treated only as an environment difference. Severity: low.

**Location.** L55 (domains differ by environment); L25 (domains and DNS are out of scope as implementation).

**Why it matters.** How many hostnames exist and which component sits on which is a design question that interacts with authentication (D-02) and with whether downloads and uploaded content are served from a host separate from the one that carries the session. The design question is in scope even though registering anything is not.

**Recommended change.** Add one question to area A or F: "What is the proposed hostname layout, and what does each authentication approach require of it?" Mark it provisional.

### T-11. A single availability target is asked for. Severity: low.

**Location.** L129 ("What availability target is proposed"); L149 uses the plural.

**Recommended change.** Ask for an objective per critical journey. Browsing, paying and downloading depend on different third parties and deserve different targets.

---

## 6. Question 5: scale fit

### S-01. Seventeen rows is more than one owner needs; fourteen do the same job. Severity: medium.

**Location.** Section 3, L271 to L289; risk 11 at L396; decision 10 at L374.

**Observed.** Seventeen rows produce nineteen files, since row 16 is three files (L288). Rows 9 to 14 each need four or five reviewers. The brief itself names the volume as a risk.

**Proposed merges, by row.**

| Change | Rows | Reason |
|---|---|---|
| Merge row 8 into row 7 | 7, 8 | The cost and vendor register is the evidence table of the cost model. As a section of the same document it cannot drift from the model it supports. If the owner chooses decision 6 option (c) at L370, the register would be almost empty. |
| Withdraw row 9 as a decision record; carry its decisions in row 1 | 1, 9 | B-02. No architectural content. The decisions appear in the index and in a closing "decisions for the owner" section of the row 1 document. |
| Withdraw row 14 as a decision record; carry its decisions in row 2 | 2, 14 | B-02. Same reason. |
| Keep rows 10, 11, 13 as separate records | 10, 11, 13 | Each is a distinct decision with its own revisit trigger. Narrow row 11 to production hosting; local MongoDB is an environment matter and moves to row 1. Widen row 13 to "asset storage, upload and download delivery" (T-01). |
| Keep row 12, reframed | 12 | T-04: "Ephemeral state and background work at launch". |
| Keep rows 5 and 6 separate, with the runbooks together | 5, 6 | B-05. |
| Add one short document, if the owner approves D-01 option (a) | new | Provisional system context, `docs/architecture/`, by this role, about one page. |

**Result.** Seventeen rows become fourteen, or fifteen with the system context. Nineteen files become sixteen or seventeen. Decision records fall from six to four.

**Alternative for the owner (proposed, not recommended).** Keep all six records but make each short under the rule in B-01. This keeps every decision in one folder and costs two more documents and their reviews.

Recommendation, awaiting owner approval: the merges in the table.

### S-02. The operability standard has no test. Severity: low.

**Location.** L48 ("A design a single owner cannot operate is a defect"); risk 6 at L391.

**Why it matters.** The standard is right and nothing checks it.

**Recommended change.** Each operations document ends with a short "what the owner does" section: the recurring tasks the design asks of the owner and how often. A design is then judged on a list the owner can read. See A-04.

---

## 7. Question 6: acceptance criteria that cannot be checked objectively as written

Of the eighteen, I judge criteria 4, 6, 7, 13, 14 and 18 checkable as written. The rest have the problems below.

### A-01. Criteria 2 and 3 fail by construction under the brief's own proposals. Severity: high.

**Location.** L302, L303; decision 11 option (a) at L375; decision 6 option (b) at L370; section 6 at L357; risk 1 at L386.

**Observed.**
- Criterion 3 requires `.claude/` and `scripts/` unchanged. Decision 11 option (a) proposes running the hardening pass in parallel, and that pass changes `.claude/` and `scripts/` (the hardening plan, section 4, lists a change to `scripts/check-feature-ledger.mjs` and to a file under `.claude/skills/`).
- The hardening plan (section 4) records that `.claude/logs/agent-runs.jsonl` gains a record for agent runs. If so, `.claude/` changes whenever an agent runs, and criterion 3 cannot be met during any phase that uses agents.
- Criterion 2 allows changes only at "the section 3 paths". The tracking file the Chief Engineer recommends, `docs/status/sre-architecture-phase.md`, is not a section 3 path. Row 17's file has no name (L289). The list criterion 12 requires has no path.
- Decision 6 option (b) gives an agent a web tool. Agent tools are set in `.claude/agents/`, so that option is itself a `.claude/` change.
- The check depends on a baseline. Observed in this session: a file `.git/HEAD` exists in the working directory, while the environment description given to this session says the directory is not a git repository. I have no shell and could not run a command. Whether `git status` works here, and whether any commit exists, is **unverified**. This is the same conflict the brief records at L386.

**Recommended change.** Criterion 2: "No file was created, changed, moved or deleted outside this allowlist", followed by an explicit list: the section 3 paths, the tracking file, the Independent Reviewer's report under `docs/status/`, and `.claude/logs/agent-runs.jsonl` (append only). Criterion 3: exclude that log, and state that changes made by the owner's hardening pass are identified separately and are not failures of this phase. Name who captures the baseline and when; I recommend the owner or the Chief Engineer, not the role being fenced.

### A-02. Criterion 12 requires a list that has no home. Severity: medium.

**Location.** L312.

**Observed.** "Every decision that needs the owner is in a single numbered list". No path is given and no row in section 3 produces it. "Every decision that needs the owner" cannot be checked for completeness by anyone.

**Recommended change.** Name the file (the decision index proposed in section 3 of this review, or the tracking file). Replace "every decision that needs the owner" with "every decision record and every item listed under 'decisions for the owner' in rows 1 to 7".

### A-03. Other criteria that depend on judgement or on an undefined term. Severity: medium for the group.

| Criterion | Location | Problem | Recommended change |
|---|---|---|---|
| 1 | L301 | Row 17's path is unspecified, so its existence "at its listed path" cannot be checked. "A reason the owner has accepted" has no recorded place. | Name the file. Say where the owner's acceptance of an absence is recorded. |
| 5 | L305 | A recommendation that lacks the label cannot be found by searching for the label. "Describes a choice as made" is a reading judgement. | Require every recommendation to sit under a fixed heading, so their number can be counted and each checked for the label. |
| 8 | L308 | "Cost statement" is undefined. A search for currency symbols misses figures written as bare numbers or words, and misses quotas and limits, which L46 and rule 14 (L346) also forbid. | Define the check as: every numeral followed by a unit of money, storage, transfer, requests, time or seats, in the rows 1 to 7 documents, has a source and date or the word "unverified" on the same line. |
| 9 | L309 | "Every statement of fact" is unbounded, and "at least at section level" makes the criterion pass if each section carries one label. | "Every section carries a label, and any sentence whose label differs from its section's is labelled individually." Accept that this checks form, not truth, and say so. |
| 10 | L310 | A negative cannot be proven. The Independent Reviewer has no content search (L395). | Define the scan: a named pattern list, who runs it, and that a clean scan means "none found by this scan". |
| 11 | L311 | "Or equivalent" is a judgement. | Give the exact sentence. |
| 15 | L315 | "Reported separately" does not say where. | Name the place. |
| 16 | L316 | Applies to "each deliverable", which includes the security review, the learning records and the reviewer's report, where it has no meaning. | Limit to rows that carry a recommendation, and allow an explicit "none". |
| 17 | L317 | Specialist reports are messages, not files; unless saved they cannot be inspected later. The command list is self-reported, so the criterion tests the report, not the behaviour. Risk 2 (L387) admits this. | Say where reports are kept. Reword to "the report lists no such command", and state that this is a declaration, not proof. |

### A-04. Things the brief asks for that no criterion checks. Severity: medium.

**Observed.** Risk 3 (L388) says provisional sections "must be marked and revisited"; L48 sets the operability standard; L44 requires "do nothing or defer" where realistic. None has a criterion. Criterion 18 (L318) lists the undecided items from `CLAUDE.md` but not the application layout, which L32 excludes and L388 names.

**Recommended additions.**
- Every section that depends on an undecided item is marked provisional and names the item. Checked against the table in D-02.
- Every operations document ends with the "what the owner does" list (S-02).
- No decision record restates an option table (B-01). Checked by reading for tables in the "options considered" section.
- Add "application layout" to criterion 18.

---

## 8. Question 7: where the brief exceeds a documentation-only authorization

The brief's fence is strong and I found no place where it authorizes implementation. The items below are places where approving it could be read as approving more than documents.

### X-01. Accepting a decision record could be read as approval to sign up or spend. Severity: medium.

**Location.** L378 ("Each comes to the owner at the end of the phase as a decision record with options"); rows 10 to 14.

**Why it matters.** If the owner accepts "hosting target", has the owner approved creating an account? The brief does not say. `CLAUDE.md` gates 2 and 4 require approval for dependencies and paid services "every time", and L31 excludes signing up, but a later reader could treat an accepted record as that approval.

**Recommended change.** One sentence in section 1 and in every record: acceptance approves a design direction only; each account, install, dependency and item of spending is approved separately when it is about to happen. This is the "design decision only" qualifier in section 3 of this review.

### X-02. Verifying prices is network activity inside a phase described as writing documents. Severity: medium.

**Location.** L250 ("Verifying current pricing from each vendor's own page, with the date, is a task of the phase"); decision 6 at L370.

**Observed.** L21 says approval authorizes "writing the documents listed in section 3 ... Nothing else". L250 makes web verification a task of the phase. Decision 6 option (b) gives an agent a web tool, which is a change under `.claude/` and so conflicts with criterion 3.

**Why it matters.** The brief does route this to the owner, correctly. The contradiction is between L21 and L250: approving the brief "as written" (decision 1 option (a), L365) leaves it unclear whether web access was approved.

**Recommended change.** L250: "Verification is a task of the phase only if the owner chooses option (a) or (b) in decision 6." State that option (b) is a configuration change made by the owner and is outside the phase's own authorization.

### X-03. The baseline may require repository actions nobody has listed. Severity: medium.

**Location.** Decision 5 at L369; risk 1 at L386.

**Observed.** Decision 5 option (a) is an initial commit by the owner. Whether a working repository exists is unverified (A-01). If it does not, creating one is a further step that appears nowhere.

**Recommended change.** Resolve the repository question with one command run by the owner or the Chief Engineer before the brief is approved, and record the result. Add "create the repository" to decision 5 if it is needed.

### X-04. The brief sets working rules and deliverables for roles other than its author. Severity: low.

**Location.** L341 to L349 (rules for all agents); rows 9 to 17.

**Observed.** A document drafted by `devops-sre` assigns six deliverables to this role, one to the Security Engineer and one to SAGE, and binds every agent to working rules. `CLAUDE.md` gives coordination to the Chief Engineer. The brief says it was drafted on the Chief Engineer's brief (L6), and it is a proposal.

**Recommended change.** State in section 5 that rules 9 to 17 are the Chief Engineer's rules for the phase, carried in this document for convenience.

### X-05. Shell access is not needed to write documents. Severity: low.

**Location.** Fence, L326 to L335; decision 2 option (b) at L366.

**Observed.** The fence lists forbidden commands. A list of forbidden commands is harder to check than no commands at all, and risk 2 (L387) admits the fence is a rule, not a mechanism.

**Recommended change.** I would point the owner toward decision 2 option (b), no shell use by `devops-sre` during the phase, since nothing in section 3 needs one. This is the Security Engineer's and the Independent Reviewer's area more than mine; I raise it and leave it with them.

### X-06. Two items are outside the phase's purpose. Severity: low.

**Location.** L237 and decision 12 at L376 (screenshot tooling for QA); L342 and decision 4 at L368 (model flag).

**Observed.** Neither is operational architecture for the product. Both are correctly marked as owner decisions.

**Recommended change.** Take decision 12 option (b), a separate proposal. Move the model flag to the Chief Engineer's tracking file.

### X-07. Two requested items cannot be produced without doing something. Severity: low.

**Location.** L60 ("how long should they take", for onboarding steps); L111 (whether the owner's GitHub plan supports the proposed protections).

**Why it matters.** A duration for steps never run is a guess. The owner's plan can be known only from the owner's account.

**Recommended change.** L60: ask for the steps and mark any duration unverified. L111: add to the owner's inputs at L371.

---

## 9. Notes on the tracking recommendation

Read: `docs/status/security-hardening-plan-2026-10-11.md`, section 4 only.

- **Observed.** The file exists. This answers the brief's open question 6 (L405) and the note at L359.
- **Observed.** The proposed `design` tier has stages `sage-before`, `plan-approved`, `authoring`, `review`, `sage-after`, with `security` added when the phase is security-sensitive. It has no `architect` stage, while the existing `substantial` tier does.
- **Low severity.** A single `authoring` stage covers work by four roles in this phase. In the hand-tracked file, I suggest one line per deliverable row instead of one line for authoring, so that a missing document is visible. This is a suggestion to the Chief Engineer, whose file it is.
- **Medium severity, already raised in A-01.** The recommended tracking file is not on the list of paths criterion 2 allows.
- Tracking outside the ledger until the tier exists, marked "tracked by hand; not machine-checked", is coherent with the brief and I have no objection to it.

---

## 10. Findings summary

| ID | Severity | Location | Finding |
|---|---|---|---|
| T-01 | High (if files are large) | L121, L229 to L248 | Upload path absent |
| T-02 | High | L233, L247 | Entitlement check placement not examined; delivery compared on cost only |
| T-03 | High | L121, L128, L149, L60 | Payment webhooks absent |
| D-01 | High | L32 against L81, L89, L234, L248 | Layout excluded, then presupposed |
| D-03 | High | L293, L401 | No owner decision point between F/A and B to E |
| A-01 | High | L302, L303, L370, L375 | Criteria 2 and 3 fail by construction |
| B-01 | Medium | L44, L45, L261, L281, L293, L312 | Options and recommendation written up to three times |
| B-02 | Medium | Rows 9, 14 | Two decision records without architectural content |
| B-04 | Medium | Rows 2, 3, 4 | Reviewer gaps on application-facing standards |
| D-02 | Medium | L32, L388 | No map of what each excluded decision blocks |
| D-05 | Medium | L81, L115, L149, L187, L223 | Provisional items not enumerated |
| T-04 | Medium | L231, L245, row 12 | Redis asked before the work it would serve is listed |
| T-05 | Medium | Area F | Transactional email absent |
| T-06 | Medium | L232, L128 | Egress modelled as cost, not as risk |
| T-07 | Medium | L155 to L187, L243 | Data-model consequences of restore not named |
| S-01 | Medium | Section 3 | Seventeen rows; fourteen suffice |
| A-02 | Medium | L312 | Required list has no path |
| A-03 | Medium | L301 to L317 | Nine criteria depend on judgement or undefined terms |
| A-04 | Medium | L48, L388, L318 | Stated requirements with no criterion |
| X-01 | Medium | L378 | Record acceptance could be read as spending approval |
| X-02 | Medium | L21 against L250, L370 | Price verification is outside "writing documents" |
| X-03 | Medium | L369, L386 | Repository state unresolved |
| B-03, B-05, D-04, T-08 to T-11, S-02, X-04 to X-07 | Low | As given above | Wording, ordering and tidiness |

---

## 11. Report

1. **Status**: done.

2. **Files changed**: `docs/architecture/reviews/sre-phase-brief-architecture-review.md` created. No other file created or edited. The brief was not edited.

3. **Commands run**: none. This role has no shell. Tools used were file reads and searches only:
   - Read in full: `docs/operations/sre-architecture-phase-brief.md`, `CLAUDE.md`, `.claude/agents/software-architect.md`, `.claude/agents/devops-sre.md`, `.claude/rules/security.md`, `.claude/rules/backend.md`.
   - Read lines 347 to 380 only of `docs/status/security-hardening-plan-2026-10-11.md` (section 4), plus a search for its headings.
   - Search of the brief for `webhook`, `upload`, `email`, `queue`, `worker`, `scheduled`, `cron`, `idempot`, `render`, `SEO`, `CORS`, `cookie`, `transaction`, `replica`, case-insensitive. Result: `scheduled` at L138, L168, L170, L211; `queue` at L231; no other matches.
   - File listing for `docs/**`: twelve files, none under `docs/architecture/` before this one.
   - File listing for `.git/HEAD`: the file exists.

4. **Not verified**:
   - Whether the working directory is a functioning git repository and whether any commit exists. `.git/HEAD` exists; the session environment says it is not a repository; no command could be run.
   - `docs/status/foundation-validation-review-2026-10-11.md` and the findings the brief cites from it (R4, R5, R6, R8, R16b, D3, D7, D12) were not read. I relied on the brief's description of them.
   - The hardening plan outside section 4 was not read, as instructed.
   - Every statement about product behaviour: MongoDB transactions and replica sets (T-07), build-time front-end configuration (T-09), link expiry behaviour (T-02), provider retry behaviour (T-03). All are marked unverified where they appear.
   - No vendor price, quota or limit was checked, and none is stated.
   - That `.claude/logs/agent-runs.jsonl` gains a record on every agent run is taken from the hardening plan, section 4; I did not read the log.

5. **Decisions and deviations**:
   - Kept the brief's `ADR-NNNN-title.md` naming so that no path changes for naming reasons; proposed that numbers are assigned at creation and not pre-printed.
   - Proposed that the single recommendation to the owner sits in the decision record and the operations document carries an operational ranking. The alternative is recorded in B-01.
   - Proposed reducing decision records from six to four and deliverable rows from seventeen to fourteen, with one optional addition. The alternative is recorded in S-01.
   - Read two rules files (`security.md`, `backend.md`) beyond the reading list, because the brief quotes one and both state requirements the review relies on. No other reading beyond the list.
   - Created the folder `docs/architecture/reviews/`, as the task directed. It is not mentioned in `CLAUDE.md`.
   - No technology was chosen and no decision record was written.

6. **Needs the owner**:
   - Whether to authorize a one-page provisional system context before area F (D-01).
   - Whether to decide in two groups, with a checkpoint after areas F and A (D-03).
   - Whether to accept the merges in S-01, in place of or alongside decision 10 of the brief.
   - Whether to accept the decision-record convention in section 3 of this review, including the "design decision only" qualifier (X-01).
   - Three inputs not currently requested: whether catalogue pages must be findable by search engines (D-01); whether there is a limit on downloads per purchase and an acceptable link lifetime (T-02); whether email is wanted at launch (T-05).
   - Resolution of the repository question before criteria 2 and 3 are relied on (A-01, X-03).
