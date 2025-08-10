#!/usr/bin/env bash

# Run the enhanced Node.js client inside Docker on the same network as Fabric

set -euo pipefail

WORKDIR=${WORKDIR:-/workspace/vars/app/node}
WALLET=${WALLET:-/workspace/vars/profiles/vscode/wallets/org0.example.com}
CCP=${CCP:-/workspace/vars/profiles/org0.example.com/connection.json}
ORG=${ORG:-org0.example.com}
CHANNEL=${CHANNEL:-tenderchannel}
CHAINCODE=${CHAINCODE:-tendercc}

if [[ -z "${1:-}" ]]; then
  echo "Usage: $0 <enhanced_client_args...>"
  echo "Examples:"
  echo "  $0 createSampleRFQ"
  echo "  $0 publishTender RFQ-2025-INFRASTRUCTURE-001"
  echo "  $0 submitSampleBid RFQ-2025-INFRASTRUCTURE-001"
  echo "  $0 evaluateBids RFQ-2025-INFRASTRUCTURE-001"
  exit 1
fi

docker run --rm --network mysite \
  -v "${PWD%/}:/workspace" \
  -w "$WORKDIR" \
  -e ORG="$ORG" -e CHANNEL="$CHANNEL" -e CHAINCODE="$CHAINCODE" \
  -e WALLET="$WALLET" -e CCP="$CCP" -e AS_LOCALHOST=false -e DISCOVERY=false \
  node:14 bash -lc "node enhanced_client.js $*"


