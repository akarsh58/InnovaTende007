#!/usr/bin/env bash
set -euo pipefail

cd ~/fabric-samples/test-network
export PATH="$HOME/fabric-samples/bin:$PATH"
export FABRIC_CFG_PATH="$HOME/fabric-samples/config"

CHANNEL=tenderchannel
CC_NAME=tendercc
CC_VER=2.0
ORDERER_CA=$PWD/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
CC_COLL=/mnt/d/InnovaTende007/chaincode/tendercc/collections_config.json

# Org1 env
export CORE_PEER_LOCALMSPID=Org1MSP
export CORE_PEER_MSPCONFIGPATH=$PWD/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_TLS_ENABLED=true

echo "== QueryInstalled (Org1)"
peer lifecycle chaincode queryinstalled | tee /tmp/qinstalled.txt | cat
PKG_ID=$(grep "Label: tendercc_2.0" /tmp/qinstalled.txt | sed -E 's/^Package ID: ([^,]+),.*/\1/' | head -1)
echo "PKG_ID=$PKG_ID"
if [[ -z "$PKG_ID" ]]; then
  echo "ERROR: Could not extract PKG_ID for label tendercc_2.0" >&2
  exit 1
fi

echo "== Approve Org1 (seq=2, collections)"
peer lifecycle chaincode approveformyorg \
  --channelID "$CHANNEL" --name "$CC_NAME" --version "$CC_VER" \
  --package-id "$PKG_ID" --sequence 2 --collections-config "$CC_COLL" \
  --tls --cafile "$ORDERER_CA" --orderer localhost:7050

echo "== Approve Org2 (seq=2, collections)"
export CORE_PEER_LOCALMSPID=Org2MSP
export CORE_PEER_MSPCONFIGPATH=$PWD/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
peer lifecycle chaincode approveformyorg \
  --channelID "$CHANNEL" --name "$CC_NAME" --version "$CC_VER" \
  --package-id "$PKG_ID" --sequence 2 --collections-config "$CC_COLL" \
  --tls --cafile "$ORDERER_CA" --orderer localhost:7050

echo "== Commit (seq=2, collections)"
export CORE_PEER_LOCALMSPID=Org1MSP
export CORE_PEER_MSPCONFIGPATH=$PWD/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
peer lifecycle chaincode commit \
  --channelID "$CHANNEL" --name "$CC_NAME" --version "$CC_VER" --sequence 2 \
  --collections-config "$CC_COLL" --tls --cafile "$ORDERER_CA" --orderer localhost:7050 \
  --peerAddresses localhost:7051 --tlsRootCertFiles $PWD/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
  --peerAddresses localhost:9051 --tlsRootCertFiles $PWD/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt

peer lifecycle chaincode querycommitted --channelID "$CHANNEL" --name "$CC_NAME" | cat

echo "== Run Civil Flow =="
bash /mnt/d/InnovaTende007/scripts/run_civil_flow_wsl.sh | cat
