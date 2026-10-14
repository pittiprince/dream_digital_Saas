#!/usr/bin/env node
// Checks every feature ledger in docs/status/features/ for claims that the
// recorded stages do not support.
//
//   node scripts/check-feature-ledger.mjs [--dir <ledger dir>] [--log <run log>]
//
// It verifies that stages were recorded and that the named agents ran since the
// feature started. It cannot verify that the work itself was good.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(name);
  return index === -1 ? fallback : args[index + 1];
};
const ledgerDir = path.resolve(option('--dir', 'docs/status/features'));
const logPath = path.resolve(option('--log', '.claude/logs/agent-runs.jsonl'));

const REQUIRED = {
  substantial: ['architect', 'sage-before', 'plan-approved', 'implementation', 'sage-during', 'qa', 'review', 'sage-after'],
  small: ['implementation', 'qa', 'review', 'sage-after'],
};
const STAGE_LINE = /^- \[( |x)\] ([a-z-]+) \| agent: ([a-z, -]+?) \| evidence:(.*)$/;

function readRuns() {
  if (!existsSync(logPath)) return null;
  return readFileSync(logPath, 'utf8')
    .split('\n')
    .filter(Boolean)
    .flatMap((line) => {
      try {
        return [JSON.parse(line)];
      } catch {
        return [];
      }
    });
}

function parseLedger(text) {
  const fields = {};
  const stages = [];
  for (const line of text.split('\n')) {
    const stage = line.match(STAGE_LINE);
    if (stage) {
      stages.push({
        done: stage[1] === 'x',
        name: stage[2],
        agents: stage[3].split(',').map((agent) => agent.trim()).filter(Boolean),
        evidence: stage[4].trim(),
      });
      continue;
    }
    const field = line.match(/^([a-z-]+): (.+)$/);
    if (field && !(field[1] in fields)) fields[field[1]] = field[2].trim();
  }
  return { fields, stages };
}

function checkLedger(file, runs) {
  const { fields, stages } = parseLedger(readFileSync(file, 'utf8'));
  const problems = [];
  const tier = fields.tier;
  if (tier === 'trivial') return problems;
  if (!(tier in REQUIRED)) return [`tier must be "substantial" or "small", found "${tier ?? ''}"`];

  const started = Date.parse(fields.started ?? '');
  if (Number.isNaN(started)) problems.push('started must be a date in YYYY-MM-DD form');

  const byName = new Map(stages.map((stage) => [stage.name, stage]));
  const isDone = (name) => byName.get(name)?.done === true;

  for (const stage of stages.filter((entry) => entry.done)) {
    if (!stage.evidence) problems.push(`stage "${stage.name}" is ticked but has no evidence`);
    for (const agent of stage.agents) {
      if (agent === 'owner' || runs === null || Number.isNaN(started)) continue;
      const ran = runs.some((run) => run.agent === agent && Date.parse(run.time) >= started);
      if (!ran) problems.push(`stage "${stage.name}" is ticked but ${agent} has no recorded run since ${fields.started}`);
    }
  }

  if (fields.accepted === 'yes') {
    const required = [...REQUIRED[tier]];
    if (fields.ui === 'yes') required.push('design-spec', 'visual-review');
    if (fields['security-sensitive'] === 'yes') required.push('security');
    for (const name of required) {
      if (!isDone(name)) problems.push(`marked accepted but stage "${name}" is not complete`);
    }
  }
  if (fields['learning-complete'] === 'yes') {
    for (const name of ['sage-after', 'understanding-check']) {
      if (!isDone(name)) problems.push(`marked learning-complete but stage "${name}" is not complete`);
    }
  }
  return problems;
}

if (!existsSync(ledgerDir)) {
  console.log(`No ledger directory at ${ledgerDir}; nothing to check.`);
  process.exit(0);
}

const runs = readRuns();
if (runs === null) console.log(`Note: no run log at ${logPath}; agent runs were not cross-checked.`);

const files = readdirSync(ledgerDir).filter((name) => name.endsWith('.md') && !name.startsWith('_'));
let failed = 0;
for (const name of files) {
  const problems = checkLedger(path.join(ledgerDir, name), runs);
  if (problems.length === 0) {
    console.log(`ok    ${name}`);
    continue;
  }
  failed += 1;
  console.log(`FAIL  ${name}`);
  for (const problem of problems) console.log(`      - ${problem}`);
}
console.log(`${files.length} ledger(s) checked, ${failed} with problems.`);
process.exit(failed === 0 ? 0 : 1);
