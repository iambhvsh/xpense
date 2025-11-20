#!/usr/bin/env bash

set -euo pipefail

echo "Running pre-install script..."

# Use pnpm install without frozen lockfile in EAS Build
if [ "$EAS_BUILD" = "true" ]; then
  echo "EAS Build detected, will use --no-frozen-lockfile"
fi
