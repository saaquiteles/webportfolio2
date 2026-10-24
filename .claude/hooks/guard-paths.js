// PreToolUse (Write|Edit): blocks edits outside the workspace and in protected files.
// Exit code 2 = block, and stderr is shown to the model.
const os = require('os');
const path = require('path');

const root = path.resolve(process.env.CLAUDE_PROJECT_DIR || process.cwd());
const protectedPrefixes = ['.claude/hooks/', '.claude/settings.json', '.claude/settings.local.json'];
const allowedOutside = [
  path.join(os.homedir(), '.claude', 'projects', 'C--Users-squiteles-webportfolio2', 'memory'),
];

const chunks = [];
process.stdin.on('data', (c) => chunks.push(c));
process.stdin.on('end', () => {
  let target = '';
  try {
    target = JSON.parse(Buffer.concat(chunks).toString('utf8')).tool_input?.file_path ?? '';
  } catch {
    process.exit(0);
  }
  if (!target) process.exit(0);

  const resolved = path.resolve(root, target);
  const isInside = (dir) => {
    const r = path.relative(dir, resolved);
    return r !== '' && !r.startsWith('..') && !path.isAbsolute(r);
  };
  if (allowedOutside.some(isInside)) process.exit(0);

  const rel = path.relative(root, resolved).split(path.sep).join('/');

  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    process.stderr.write(`Blocked by guard-paths: ${resolved} is outside the workspace.\n`);
    process.exit(2);
  }
  if (protectedPrefixes.some((p) => rel === p || rel.startsWith(p))) {
    process.stderr.write(`Blocked by guard-paths: ${rel} is a lock file. The human edits it.\n`);
    process.exit(2);
  }
  if (/(^|\/)\.env(\.(?!example$)[\w-]+)?$/.test(rel)) {
    process.stderr.write('Blocked by guard-paths: real .env files are off limits. Use .env.example.\n');
    process.exit(2);
  }
  process.exit(0);
});
