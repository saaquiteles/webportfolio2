# Git
- Commit only when the human explicitly asks. Never push, force-push, `reset --hard` or `clean -f` unless asked in that moment.
- When committing, follow the human's global atomic-commit rule: one logical change per commit, Conventional Commits format, explain why.
- Start every shell command from the project root (`cd` there, or use absolute paths). The shell's folder can persist between commands, and a `git` command run inside the nested `agentic-workflow-matt/` repo would act on the wrong project.
