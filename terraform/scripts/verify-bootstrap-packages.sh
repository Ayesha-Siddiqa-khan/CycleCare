#!/bin/bash
set -euo pipefail

echo "[TerraPilot][verify] Verifying required packages..."

REQUIRED_CMDS=(curl unzip git jq)

for CMD in "${REQUIRED_CMDS[@]}"; do
  if command -v "$CMD" >/dev/null 2>&1; then
    echo "[TerraPilot][verify] [OK] $CMD is available"
  else
    echo "[TerraPilot][verify] [WARN] $CMD not found"
  fi
done

echo "[TerraPilot][verify] Package verification finished."
