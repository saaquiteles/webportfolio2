// Status line: shows how full the context is, so the human knows when to compact or /clear.
// Claude Code sends JSON on stdin; context_window.used_percentage can be null early in a session.
const COMPACT_AT = 65;
const WARN_AT = 50;
const colour = (code, text) => `\u001b[${code}m${text}\u001b[0m`;

const chunks = [];
process.stdin.on('data', (chunk) => chunks.push(chunk));
process.stdin.on('end', () => {
  let used = null;
  try {
    used = JSON.parse(Buffer.concat(chunks).toString('utf8')).context_window?.used_percentage ?? null;
  } catch {
    used = null;
  }

  if (typeof used !== 'number') {
    process.stdout.write('ctx --');
    return;
  }

  const percent = Math.round(used);
  if (percent >= COMPACT_AT) process.stdout.write(colour(31, `ctx ${percent}% compact soon`));
  else if (percent >= WARN_AT) process.stdout.write(colour(33, `ctx ${percent}%`));
  else process.stdout.write(colour(32, `ctx ${percent}%`));
});
