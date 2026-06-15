#!/bin/bash
set -euo pipefail

# Only prepare dependencies in Claude Code on the web (remote) sessions.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Single source of truth for environment setup (also usable as the web "Setup script").
bash ./setup.sh
