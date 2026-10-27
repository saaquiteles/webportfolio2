# Shell and edits
- Edit files with the Edit tool. For multi-line text use a quoted heredoc (`<<'EOF'`), so the shell does not expand backticks or `$`.
- No regexes, backticks or `$` inside a double-quoted `node -e`. There is no working `python` on this machine (Windows opens a stub that hangs); use node.
- After a scripted edit, check `git diff` shows it landed. A silent no-op makes a "red" test run meaningless.
- Delete specific files (`rm file`, `rmdir dir`). Recursive force-delete is blocked by a hook.
