# Session Logging (Public vs Private)

This repo is public. Keep sensitive data out of Git.

What goes to Git (public)
- Session summaries without secrets
- Decisions, architecture notes, high-level progress
- Command lists only if they do not contain tokens/keys/paths with PII

What stays private (local)
- Full chat exports
- Raw terminal logs
- Any secrets, API keys, tokens, credentials
- Personal data or private endpoints

Local folders (ignored by git)
- local/session-logs/
- local/terminal-logs/
- local/command-logs/
- local/chat-exports/

Start a private session log
- Run `bash scripts/new-session-log.sh`
- It creates a timestamped file in `local/session-logs/`

Start a terminal transcript
- Run `bash scripts/start-terminal-log.sh`
- It records everything in a subshell using `script`.
- Exit the subshell with `exit` to stop logging.

Optional: save zsh history to a private file
- Add to your `~/.zshrc`:
```sh
export HISTFILE="/Users/mac/Desktop/rork-kiku/local/command-logs/zsh_history"
setopt INC_APPEND_HISTORY
```
- This keeps command history in `local/command-logs/` (ignored by git).

Make a public summary
- Copy a redacted summary into `docs/development/SESSION_LOG_TEMPLATE.md` and commit it.
