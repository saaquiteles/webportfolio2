// PostToolUse (Write|Edit|Bash): records the last code edit and the last test run.
// remind-tests.js reads this file when the session stops.
const fs = require('fs');
const path = require('path');

const root = path.resolve(process.env.CLAUDE_PROJECT_DIR || process.cwd());
const stateFile = path.join(root, '.claude', 'logs', 'state.json');

const chunks = [];
process.stdin.on('data', (c) => chunks.push(c));
process.stdin.on('end', () => {
  let input;
  try {
    input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    process.exit(0);
  }

  let state = {};
  try {
    state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  } catch {}

  const now = Date.now();
  const tool = input.tool_name;
  const toolInput = input.tool_input ?? {};

  if (tool === 'Write' || tool === 'Edit') {
    const rel = path.relative(root, path.resolve(root, toolInput.file_path ?? '')).split(path.sep).join('/');
    const isCode = /^(src|content|public)\//.test(rel) || /^(next\.config|tailwind\.config|velite\.config)/.test(rel);
    if (isCode) state.lastEdit = now;
  } else if (tool === 'Bash' && /\bnpm\s+(test|run\s+(build|typecheck|lint))\b/.test(toolInput.command ?? '')) {
    state.lastTest = now;
  }

  try {
    fs.mkdirSync(path.dirname(stateFile), { recursive: true });
    fs.writeFileSync(stateFile, JSON.stringify(state));
  } catch {}
  process.exit(0);
});
