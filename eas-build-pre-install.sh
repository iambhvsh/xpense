#!/usr/bin/env bash

set -euo pipefail

echo "Running pre-install script..."

# Remove incompatible lockfile and let pnpm regenerate it
if [ -f "pnpm-lock.yaml" ]; then
  echo "Removing incompatible pnpm-lock.yaml..."
  rm pnpm-lock.yaml
fi

echo "Will install with pnpm without frozen lockfile"
