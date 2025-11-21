#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Uso: $0 <script-npm> [args...]" >&2
  echo "Exemplos: rotacao:hibrida | rotacao:round-robin | rotacao:diaria-rr" >&2
  exit 1
fi

SCRIPT="$1"
shift

docker compose run --rm node npm run "$SCRIPT" -- "$@"
