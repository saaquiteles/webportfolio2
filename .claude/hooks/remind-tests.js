// Stop: reminds the human when code changed after the last test run. Never blocks.
const fs = require('fs');
const path = require('path');

const root = path.resolve(process.env.CLAUDE_PROJECT_DIR || process.cwd());
const stateFile = path.join(root, '.claude', 'logs', 'state.json');

process.stdin.resume();
process.stdin.on('end', () => {
  try {
    const { lastEdit = 0, lastTest = 0 } = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
    if (lastEdit > lastTest) {
      process.stdout.write(
        JSON.stringify({ systemMessage: 'Code changed since the last test run. Run /test before you checkpoint.' })
      );
    }
  } catch {}
  process.exit(0);
});
