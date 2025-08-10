#!/usr/bin/env bash
set -euo pipefail
FILE=${1:-env.example}
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
ENV_FILE="$SCRIPT_DIR/$FILE"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "Env file not found: $ENV_FILE" >&2
  exit 1
fi
# shellcheck source=/dev/null
set -a
source "$ENV_FILE"
set +a
# echo exported values
echo "Exported CCP=$CCP"
echo "Exported ORG1_ADMIN_MSP=$ORG1_ADMIN_MSP"
echo "Exported CHANNEL=${CHANNEL:-} CHAINCODE=${CHAINCODE:-} IDENTITY=${IDENTITY:-}"
