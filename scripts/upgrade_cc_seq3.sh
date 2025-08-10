#!/usr/bin/env bash
set -euo pipefail

cd ~/fabric-samples/test-network
export PATH="$HOME/fabric-samples/bin:$PATH"
export FABRIC_CFG_PATH="$HOME/fabric-samples/config"

CHANNEL=tenderchannel
CC_NAME=tendercc
CC_VER=2.0
ORDERER_CA=$PWD/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
CC_PATH=/mnt/d/InnovaTende007/chaincode/tendercc/go
CC_LABEL=tendercc_2.1
CC_PKG=/tmp/${CC_LABEL}.tgz
CC_COLL=/mnt/d/InnovaTende007/chaincode/tendercc/collections_config.json

echo "== PACKAGE ${CC_LABEL}"
rm -f "$CC_PKG" || true
peer lifecycle chaincode package "$CC_PKG" --lang golang --path "$CC_PATH" --label "$CC_LABEL"

echo "== INSTALL ORG1"
export CORE_PEER_LOCALMSPID=Org1MSP
export CORE_PEER_MSPCONFIGPATH=$PWD/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_TLS_ENABLED=true
peer lifecycle chaincode install "$CC_PKG" || true

echo "== INSTALL ORG2"
export CORE_PEER_LOCALMSPID=Org2MSP
export CORE_PEER_MSPCONFIGPATH=$PWD/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
peer lifecycle chaincode install "$CC_PKG" || true

echo "== QUERYINSTALLED (Org1)"
export CORE_PEER_LOCALMSPID=Org1MSP
export CORE_PEER_MSPCONFIGPATH=$PWD/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
peer lifecycle chaincode queryinstalled | tee /tmp/qinstalled.txt

PKG_ID=$(python3 - <<'PY'
import re
pkg=None
for line in open('/tmp/qinstalled.txt'):
    m=re.match(r'^Package ID:\s*([^,]+),\s*Label:\s*tendercc_2\.1', line)
    if m:
        pkg=m.group(1)
        break
print(pkg or '')
PY
)

echo "PKG_ID=$PKG_ID"
if [[ -z "$PKG_ID" ]]; then
  echo "ERROR: PKG_ID not found for label ${CC_LABEL}" >&2
  exit 1
fi

echo "== APPROVE ORG1 (seq=3)"
peer lifecycle chaincode approveformyorg \
  --channelID "$CHANNEL" --name "$CC_NAME" --version "$CC_VER" \
  --package-id "$PKG_ID" --sequence 3 --collections-config "$CC_COLL" \
  --tls --cafile "$ORDERER_CA" --orderer localhost:7050

echo "== APPROVE ORG2 (seq=3)"
export CORE_PEER_LOCALMSPID=Org2MSP
export CORE_PEER_MSPCONFIGPATH=$PWD/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
peer lifecycle chaincode approveformyorg \
  --channelID "$CHANNEL" --name "$CC_NAME" --version "$CC_VER" \
  --package-id "$PKG_ID" --sequence 3 --collections-config "$CC_COLL" \
  --tls --cafile "$ORDERER_CA" --orderer localhost:7050

echo "== COMMIT (seq=3)"
export CORE_PEER_LOCALMSPID=Org1MSP
export CORE_PEER_MSPCONFIGPATH=$PWD/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
peer lifecycle chaincode commit \
  --channelID "$CHANNEL" --name "$CC_NAME" --version "$CC_VER" --sequence 3 \
  --collections-config "$CC_COLL" --tls --cafile "$ORDERER_CA" --orderer localhost:7050 \
  --peerAddresses localhost:7051 --tlsRootCertFiles $PWD/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
  --peerAddresses localhost:9051 --tlsRootCertFiles $PWD/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt

peer lifecycle chaincode querycommitted --channelID "$CHANNEL" --name "$CC_NAME"

echo "== RUN CIVIL FLOW (will print Financial Summary) =="
bash /mnt/d/InnovaTende007/scripts/run_civil_flow_wsl.sh | cat
