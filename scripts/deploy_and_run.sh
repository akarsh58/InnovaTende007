#!/usr/bin/env bash
set -euo pipefail

# Deploy tendercc v2.0 to test-network and run the civil tender flow

cd ~/fabric-samples/test-network
export PATH="$HOME/fabric-samples/bin:$PATH"
export FABRIC_CFG_PATH="$HOME/fabric-samples/config"

export CHANNEL=tenderchannel
export CC_NAME=tendercc
export CC_VER=2.0
export CC_SEQUENCE=${CC_SEQUENCE:-1}
export ORDERER_CA=$PWD/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

echo "== PACKAGE"
export CC_LABEL=tendercc_2.0
export CC_PKG=/tmp/${CC_LABEL}.tar.gz
export CC_PATH=/mnt/d/InnovaTende007/chaincode/tendercc/go
export CC_COLL=/mnt/d/InnovaTende007/chaincode/tendercc/collections_config.json
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
PKG_LINE=$(grep "Label: ${CC_LABEL}" /tmp/qinstalled.txt | head -1 || true)
PKG_ID=$(echo "$PKG_LINE" | sed -E 's/^Package ID: ([^,]+),.*/\1/')
if [[ -z "$PKG_ID" ]]; then
  echo "Failed to extract PACKAGE_ID for label ${CC_LABEL}. Installed list:" >&2
  cat /tmp/qinstalled.txt >&2
  exit 1
fi
echo "PKG_ID=$PKG_ID"

echo "== APPROVE ORG1"
peer lifecycle chaincode approveformyorg --channelID "$CHANNEL" --name "$CC_NAME" --version "$CC_VER" --package-id "$PKG_ID" --sequence "$CC_SEQUENCE" --collections-config "$CC_COLL" --tls --cafile "$ORDERER_CA" --orderer localhost:7050

echo "== APPROVE ORG2"
export CORE_PEER_LOCALMSPID=Org2MSP
export CORE_PEER_MSPCONFIGPATH=$PWD/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
peer lifecycle chaincode approveformyorg --channelID "$CHANNEL" --name "$CC_NAME" --version "$CC_VER" --package-id "$PKG_ID" --sequence "$CC_SEQUENCE" --collections-config "$CC_COLL" --tls --cafile "$ORDERER_CA" --orderer localhost:7050

echo "== COMMIT"
export CORE_PEER_LOCALMSPID=Org1MSP
export CORE_PEER_MSPCONFIGPATH=$PWD/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
peer lifecycle chaincode commit --channelID "$CHANNEL" --name "$CC_NAME" --version "$CC_VER" --sequence "$CC_SEQUENCE" --collections-config "$CC_COLL" --tls --cafile "$ORDERER_CA" --orderer localhost:7050 \
  --peerAddresses localhost:7051 --tlsRootCertFiles $PWD/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
  --peerAddresses localhost:9051 --tlsRootCertFiles $PWD/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
peer lifecycle chaincode querycommitted --channelID "$CHANNEL" --name "$CC_NAME"

echo "== RUN CIVIL FLOW"
bash /mnt/d/InnovaTende007/scripts/run_civil_flow_wsl.sh

