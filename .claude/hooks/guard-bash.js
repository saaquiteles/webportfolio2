// PreToolUse (Bash): blocks git writes and a few other dangerous commands.
// Exit code 2 = block, and stderr is shown to the model.
const chunks = [];
process.stdin.on('data', (c) => chunks.push(c));
process.stdin.on('end', () => {
  let command = '';
  try {
    command = JSON.parse(Buffer.concat(chunks).toString('utf8')).tool_input?.command ?? '';
  } catch {
    process.exit(0);
  }

  const rules = [
    [
       /\bgit\s+(?:-[^\s]+\s+)*(push\s+.*(--force|-f\b)|reset\s+--hard|clean\s+-\w*f)/,
  'Force-push, reset --hard and clean -f are blocked. Run them yourself if you mean it.',
    ],
    [/\bnpm\s+publish\b/, 'npm publish is blocked.'],
    [/\brm\s+(-[a-zA-Z]*r[a-zA-Z]*f|-[a-zA-Z]*f[a-zA-Z]*r)\b/, 'rm -rf is blocked. Delete specific files instead.'],
    [/\b(cat|type|Get-Content|more|less|head|tail)\b[^|;&]*\.env(\.[\w-]+)?\b(?!\.example)/, 'Reading real .env files is blocked.'],
  ];

  for (const [pattern, message] of rules) {
    if (pattern.test(command)) {
      process.stderr.write(`Blocked by guard-bash: ${message}\n`);
      process.exit(2);
    }
  }
  process.exit(0);
});
