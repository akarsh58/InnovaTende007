#!/usr/bin/env bash
set -euo pipefail

NET=${NET:-fabric_test}
ROOT=/workspace

if [[ ! -f vars/app/node/enhanced_client.js ]]; then
  echo "enhanced_client.js not found" >&2; exit 1;
fi

docker run --rm --network ${NET} \
  -v "${PWD}:/workspace" \
  -v "${PWD}/connection-org1.json:/host_ccp/connection-org1.json:ro" \
  -v "${PWD}/host_msp:/host_msp:ro" \
  -w /workspace \
  -e CCP_FALLBACK="/host_ccp/connection-org1.json" \
  -e ORG1_ADMIN_MSP="/host_msp" \
  node:18 bash -lc "node vars/app/node/enhanced_client.js $*"

