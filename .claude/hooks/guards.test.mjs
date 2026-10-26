// Self-test for the guard hooks. A hook that crashes "fails open" (only exit code 2 blocks),
// so run this after every hook edit. Run from the project root: node --test .claude/hooks/guards.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

const root = process.cwd();
const memory = path.join(os.homedir(), '.claude', 'projects', 'C--Users-squiteles-webportfolio2', 'memory');

function run(hook, input) {
  const payload = typeof input === 'string' ? input : JSON.stringify(input);
  const result = spawnSync(process.execPath, [path.join(root, '.claude', 'hooks', hook)], {
    input: payload,
    encoding: 'utf8',
    cwd: root,
  });
  return result.status;
}

const edit = (file_path) => ({ tool_input: { file_path } });
const shell = (command) => ({ tool_input: { command } });

const pathCases = [
  ['a file outside the workspace is blocked', edit(path.resolve(root, '..', 'outside-the-workspace.txt')), 2],
  ['a hook script is a lock file', edit('.claude/hooks/guard-bash.js'), 2],
  ['settings.json is a lock file', edit('.claude/settings.json'), 2],
  ['settings.local.json is a lock file', edit('.claude/settings.local.json'), 2],
  ['.env is blocked', edit('.env'), 2],
  ['.env.local is blocked', edit('.env.local'), 2],
  ['.env.example is allowed', edit('.env.example'), 0],
  ['a normal source file is allowed', edit('src/app/page.tsx'), 0],
  ['an absolute path inside the project is allowed', edit(path.join(root, 'docs', 'spec.md')), 0],
  ['a file in the memory folder is allowed', edit(path.join(memory, 'x.md')), 0],
  ['a nested file in the memory folder is allowed', edit(path.join(memory, 'sub', 'y.md')), 0],
  ["another project's memory folder is blocked", edit(path.join(os.homedir(), '.claude', 'projects', 'other-project', 'memory', 'x.md')), 2],
  ['a file one level above the memory folder is blocked', edit(path.join(memory, '..', 'secret.md')), 2],
  ['a ../ path climbing out of the memory folder is blocked', edit(path.join(memory, '..', '..', '..', 'settings.json')), 2],
  ['the memory folder itself is blocked', edit(memory), 2],
  ['an empty input is allowed', {}, 0],
  ['invalid JSON is allowed (the hook does not crash)', 'not json', 0],
];

for (const [name, input, expected] of pathCases) {
  test(`guard-paths: ${name}`, () => {
    assert.equal(run('guard-paths.js', input), expected);
  });
}

const shellCases = [
  ['a force push is blocked', shell('git push --force origin main'), 2],
  ['git reset --hard is blocked', shell('git reset --hard HEAD~1'), 2],
  ['git clean -fd is blocked', shell('git clean -fd'), 2],
  ['rm -rf is blocked', shell('rm -rf node_modules'), 2],
  ['npm publish is blocked', shell('npm publish'), 2],
  ['reading a real .env with cat is blocked', shell('cat .env'), 2],
  ['git status is allowed', shell('git status'), 0],
  ['npm run check is allowed', shell('npm run check'), 0],
  ['an empty input is allowed', {}, 0],
  ['invalid JSON is allowed (the hook does not crash)', 'not json', 0],
];

for (const [name, input, expected] of shellCases) {
  test(`guard-bash: ${name}`, () => {
    assert.equal(run('guard-bash.js', input), expected);
  });
}
