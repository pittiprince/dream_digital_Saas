#!/usr/bin/env node
// Exercises the hook scripts and the ledger check with synthetic input.
//
//   node scripts/test-guards.mjs
//
// This tests the scripts themselves. It does not prove that Claude Code calls
// them; that needs a real agent run.
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const hook = (name) => path.join(root, '.claude', 'hooks', name);
const ALLOW = 0;
const BLOCK = 2;

let failures = 0;
function expect(label, actual, expected) {
  const ok = actual === expected;
  if (!ok) failures += 1;
  console.log(`${ok ? 'pass' : 'FAIL'}  ${label}${ok ? '' : ` (expected exit ${expected}, got ${actual})`}`);
}

function runHook(script, payload, projectDir = root) {
  const result = spawnSync('node', [hook(script)], {
    input: JSON.stringify(payload),
    env: { ...process.env, CLAUDE_PROJECT_DIR: projectDir },
    encoding: 'utf8',
  });
  return result.status;
}

const write = (agent, file) => ({ agent_type: agent, tool_name: 'Write', tool_input: { file_path: file } });
const bash = (agent, command) => ({ agent_type: agent, tool_name: 'Bash', tool_input: { command } });

console.log('path-guard: write ownership');
const writeCases = [
  ['sage writes docs/learning', write('sage', 'docs/learning/concepts.md'), ALLOW],
  ['sage writes apps/web', write('sage', 'apps/web/src/App.tsx'), BLOCK],
  ['sage writes .claude', write('sage', '.claude/settings.json'), BLOCK],
  ['frontend writes apps/web', write('frontend-engineer', path.join(root, 'apps/web/src/App.tsx')), ALLOW],
  ['frontend writes apps/api', write('frontend-engineer', 'apps/api/src/server.ts'), BLOCK],
  ['frontend writes packages/shared', write('frontend-engineer', 'packages/shared/src/types.ts'), BLOCK],
  ['backend writes apps/api', write('backend-data-engineer', 'apps/api/src/server.ts'), ALLOW],
  ['backend writes packages/shared', write('backend-data-engineer', 'packages/shared/src/types.ts'), ALLOW],
  ['backend writes apps/web', write('backend-data-engineer', 'apps/web/src/App.tsx'), BLOCK],
  ['architect writes docs/api', write('software-architect', 'docs/api/orders.md'), ALLOW],
  ['architect writes apps/api', write('software-architect', 'apps/api/src/server.ts'), BLOCK],
  ['da-vinci writes docs/design', write('da-vinci', 'docs/design/reviews/home.md'), ALLOW],
  ['da-vinci writes apps/web', write('da-vinci', 'apps/web/src/App.tsx'), BLOCK],
  ['qa writes a test file in apps/web', write('qa-test-engineer', 'apps/web/src/Cart.test.tsx'), ALLOW],
  ['qa writes product code', write('qa-test-engineer', 'apps/web/src/Cart.tsx'), BLOCK],
  ['devops writes .github', write('devops-sre', '.github/workflows/ci.yml'), ALLOW],
  ['devops writes root package.json', write('devops-sre', 'package.json'), ALLOW],
  ['devops writes apps/api', write('devops-sre', 'apps/api/src/server.ts'), BLOCK],
  ['security writes docs/security', write('security-engineer', 'docs/security/review-001.md'), ALLOW],
  ['security writes apps/api', write('security-engineer', 'apps/api/src/auth.ts'), BLOCK],
  ['reviewer writes anything', write('independent-reviewer', 'docs/status/features/F-001.md'), BLOCK],
  ['chief writes docs/status', write('chief-engineer', 'docs/status/features/F-001.md'), ALLOW],
  ['chief writes product code', write('chief-engineer', 'apps/api/src/server.ts'), BLOCK],
  ['chief writes scripts', write('chief-engineer', 'scripts/check-feature-ledger.mjs'), BLOCK],
  ['agent writes outside the project', write('sage', '../outside.md'), BLOCK],
  ['plain session with no agent', { tool_name: 'Write', tool_input: { file_path: 'apps/api/src/server.ts' } }, ALLOW],
];
for (const [label, payload, expected] of writeCases) expect(label, runHook('path-guard.mjs', payload), expected);

console.log('\npath-guard: Bash allowlist for read-only roles');
const bashCases = [
  ['reviewer runs git diff', bash('independent-reviewer', 'git diff main...HEAD'), ALLOW],
  ['reviewer runs git status', bash('independent-reviewer', 'git status -sb'), ALLOW],
  ['reviewer removes a file', bash('independent-reviewer', 'rm apps/api/src/server.ts'), BLOCK],
  ['reviewer chains a command', bash('independent-reviewer', 'git status && touch x'), BLOCK],
  ['reviewer redirects output', bash('independent-reviewer', 'git diff > out.patch'), BLOCK],
  ['reviewer uses --output', bash('independent-reviewer', 'git diff --output=out.patch'), BLOCK],
  ['reviewer creates a branch', bash('independent-reviewer', 'git branch new-branch'), BLOCK],
  ['chief runs git push', bash('chief-engineer', 'git push origin main'), BLOCK],
  ['chief runs the ledger check', bash('chief-engineer', 'node scripts/check-feature-ledger.mjs'), ALLOW],
  ['security runs pnpm audit', bash('security-engineer', 'pnpm audit --prod'), ALLOW],
  ['security runs pnpm install', bash('security-engineer', 'pnpm install'), BLOCK],
  ['frontend runs its build', bash('frontend-engineer', 'pnpm --filter web build'), ALLOW],
];
for (const [label, payload, expected] of bashCases) expect(label, runHook('path-guard.mjs', payload), expected);

console.log('\nsecret-guard');
const envFile = '.env';
const secretCases = [
  ['read env file', { tool_name: 'Read', tool_input: { file_path: `apps/api/${envFile}` } }, BLOCK],
  ['read env.production', { tool_name: 'Read', tool_input: { file_path: `${envFile}.production` } }, BLOCK],
  ['read env.example', { tool_name: 'Read', tool_input: { file_path: `${envFile}.example` } }, ALLOW],
  ['read a private key', { tool_name: 'Read', tool_input: { file_path: 'certs/server.pem' } }, BLOCK],
  ['edit env file', { tool_name: 'Edit', tool_input: { file_path: envFile } }, BLOCK],
  ['grep inside env file', { tool_name: 'Grep', tool_input: { pattern: 'KEY', path: `apps/api/${envFile}` } }, BLOCK],
  ['grep for the text "env"', { tool_name: 'Grep', tool_input: { pattern: 'process.env', path: 'apps/api' } }, ALLOW],
  ['bash prints env file', { tool_name: 'Bash', tool_input: { command: `cat apps/api/${envFile}` } }, BLOCK],
  ['bash copies env.example', { tool_name: 'Bash', tool_input: { command: `cp ${envFile}.example apps/api/config.sample` } }, ALLOW],
  ['bash runs tests', { tool_name: 'Bash', tool_input: { command: 'pnpm test' } }, ALLOW],
  ['read ordinary source', { tool_name: 'Read', tool_input: { file_path: 'apps/api/src/env.ts' } }, ALLOW],
];
for (const [label, payload, expected] of secretCases) expect(label, runHook('secret-guard.mjs', payload), expected);

const temp = mkdtempSync(path.join(os.tmpdir(), 'dd guards '));
try {
  console.log('\nlog-agent-run');
  const stop = { hook_event_name: 'SubagentStop', agent_type: 'sage', agent_id: 'a1', session_id: 's1' };
  expect('exits cleanly', runHook('log-agent-run.mjs', stop, temp), ALLOW);
  const logPath = path.join(temp, '.claude', 'logs', 'agent-runs.jsonl');
  let logged = null;
  try {
    logged = JSON.parse(readFileSync(logPath, 'utf8').trim());
  } catch {
    logged = null;
  }
  expect('writes one record naming the agent', logged?.agent === 'sage' ? 0 : 1, 0);

  console.log('\ncheck-feature-ledger');
  const ledgerDir = path.join(temp, 'ledgers');
  const stageLine = (done, name, agent, evidence) => `- [${done ? 'x' : ' '}] ${name} | agent: ${agent} | evidence: ${evidence}`;
  const ledger = (fields, stages) =>
    [`# F-900: fixture`, '', ...Object.entries(fields).map(([key, value]) => `${key}: ${value}`), '', '## Stages', '', ...stages, ''].join('\n');
  const base = { tier: 'small', ui: 'no', 'security-sensitive': 'no', started: '2020-01-01', accepted: 'no', 'learning-complete': 'no' };
  const checkWith = (text) => {
    rmSync(ledgerDir, { recursive: true, force: true });
    mkdirSync(ledgerDir, { recursive: true });
    writeFileSync(path.join(ledgerDir, 'F-900-fixture.md'), text);
    const result = spawnSync('node', [path.join(root, 'scripts', 'check-feature-ledger.mjs'), '--dir', ledgerDir, '--log', logPath], { encoding: 'utf8' });
    return result.status;
  };

  expect('in-progress ledger passes', checkWith(ledger(base, [stageLine(false, 'implementation', 'backend-data-engineer', '')])), 0);
  expect('accepted without stages fails', checkWith(ledger({ ...base, accepted: 'yes' }, [stageLine(false, 'implementation', 'backend-data-engineer', '')])), 1);
  expect('ticked stage without evidence fails', checkWith(ledger(base, [stageLine(true, 'sage-after', 'sage', '')])), 1);
  expect('ticked stage whose agent ran passes', checkWith(ledger(base, [stageLine(true, 'sage-after', 'sage', 'docs/learning/concepts.md')])), 0);
  expect('ticked stage whose agent never ran fails', checkWith(ledger(base, [stageLine(true, 'qa', 'qa-test-engineer', 'docs/testing/evidence/x.txt')])), 1);
  expect(
    'learning-complete without the understanding check fails',
    checkWith(ledger({ ...base, 'learning-complete': 'yes' }, [stageLine(true, 'sage-after', 'sage', 'docs/learning/concepts.md')])),
    1,
  );
  expect(
    'owner stage needs no run record',
    checkWith(ledger(base, [stageLine(true, 'plan-approved', 'owner', 'approved in session on 2020-01-02')])),
    0,
  );
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log(failures === 0 ? '\nAll guard tests passed.' : `\n${failures} guard test(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
