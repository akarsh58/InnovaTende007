#!/usr/bin/env bash
set -euo pipefail

# Civil/Construction tender end-to-end flow on Fabric test-network (WSL)

RFQ_FILE=${RFQ_FILE:-/mnt/d/InnovaTende007/samples/rfq/construction-rfq-sample.json}
BID_FILE=${BID_FILE:-/mnt/d/InnovaTende007/samples/bid/construction-bid-sample.json}
MILE_FILE=${MILE_FILE:-/mnt/d/InnovaTende007/samples/milestone/milestone-sample.json}
CHANNEL=${CHANNEL:-tenderchannel}
CC_NAME=${CC_NAME:-tendercc}
# Always use a fresh tender id for a clean run
TENDER_ID="RFQ-$(date +%Y%m%d-%H%M%S)"
BID_ID=${BID_ID:-BID-TECHCORP-001}
MILE_ID=${MILE_ID:-MS-001}

LOG_DIR=/mnt/d/InnovaTende007/run_logs
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/civil_flow_$(date +%Y%m%d_%H%M%S).log"

cd ~/fabric-samples/test-network
export PATH="$HOME/fabric-samples/bin:$PATH"
export FABRIC_CFG_PATH="$HOME/fabric-samples/config"
export ORDERER_CA=$PWD/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

export CORE_PEER_LOCALMSPID=Org1MSP
export CORE_PEER_MSPCONFIGPATH=$PWD/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_TLS_ENABLED=true

# TLS certs for endorsement on both peers
ORG1_TLS=$PWD/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
ORG2_TLS=$PWD/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt

# Helper: common peer addresses for endorsement
PEER_FLAGS=(--peerAddresses localhost:7051 --tlsRootCertFiles "$ORG1_TLS" --peerAddresses localhost:9051 --tlsRootCertFiles "$ORG2_TLS")

echo "=== Civil Tender Flow ($(date))" | tee -a "$LOG_FILE"
ENCODER="python3"
command -v $ENCODER >/dev/null 2>&1 || { echo "python3 is required. Install with: sudo apt-get install -y python3" | tee -a "$LOG_FILE"; exit 1; }

echo "[1/8] CreateEnhancedTender ($TENDER_ID)" | tee -a "$LOG_FILE"
CREATE_CTOR=$(RFQ_PATH="$RFQ_FILE" TID="$TENDER_ID" $ENCODER - <<'PY'
import json, os
from datetime import datetime, timedelta, timezone

rfq_path = os.environ['RFQ_PATH']
with open(rfq_path, 'r', encoding='utf-8') as f:
    obj = json.load(f)

# Force the RFQ id to the desired tender id
obj['id'] = os.environ['TID']

now = datetime.now(timezone.utc)
obj.setdefault('deadlines', {})
obj['deadlines']['rfqIssueDate'] = (now - timedelta(hours=1)).isoformat().replace('+00:00', 'Z')
obj['deadlines']['questionsDeadline'] = (now + timedelta(days=7)).isoformat().replace('+00:00', 'Z')
obj['deadlines']['bidSubmissionDeadline'] = (now + timedelta(days=14)).isoformat().replace('+00:00', 'Z')
obj['deadlines']['projectStartDate'] = (now + timedelta(days=30)).isoformat().replace('+00:00', 'Z')
obj['deadlines']['projectEndDate'] = (now + timedelta(days=120)).isoformat().replace('+00:00', 'Z')
if 'milestoneDeadlines' in obj['deadlines'] and obj['deadlines']['milestoneDeadlines']:
    obj['deadlines']['milestoneDeadlines'][0]['deadline'] = (now + timedelta(days=60)).isoformat().replace('+00:00', 'Z')

ctor = {"Args": ["EnhancedSmartContract:CreateEnhancedTender", json.dumps(obj)]}
print(json.dumps(ctor))
PY
)
peer chaincode invoke -C "$CHANNEL" -n "$CC_NAME" -c "$CREATE_CTOR" \
  "${PEER_FLAGS[@]}" --tls --cafile "$ORDERER_CA" --orderer localhost:7050 | tee -a "$LOG_FILE"

sleep 2
echo "[2/8] PublishTender ($TENDER_ID)" | tee -a "$LOG_FILE"
peer chaincode invoke -C "$CHANNEL" -n "$CC_NAME" \
  -c '{"Args":["EnhancedSmartContract:PublishTender","'"$TENDER_ID"'"]}' \
  "${PEER_FLAGS[@]}" --tls --cafile "$ORDERER_CA" --orderer localhost:7050 | tee -a "$LOG_FILE"

sleep 2
echo "[3/8] SubmitEnhancedBid" | tee -a "$LOG_FILE"
BID_B64=$(BID_PATH="$BID_FILE" TID="$TENDER_ID" BID="$BID_ID" $ENCODER - <<'PY'
import json, os, base64
from datetime import datetime, timezone

with open(os.environ['BID_PATH'], 'r', encoding='utf-8') as f:
    bid = json.load(f)
# Force tenderId and bidId to match this run
bid['tenderId'] = os.environ['TID']
bid['bidId'] = os.environ['BID']
# Ensure submittedAt is now
bid['submittedAt'] = datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')

raw = json.dumps(bid).encode('utf-8')
print(base64.b64encode(raw).decode('ascii'))
PY
)
SUBMIT_CTOR=$(TID="$TENDER_ID" BID="$BID_ID" $ENCODER - <<'PY'
import json, os
ctor = {"Args": ["EnhancedSmartContract:SubmitEnhancedBid", os.environ['TID'], os.environ['BID']]}
print(json.dumps(ctor))
PY
)
peer chaincode invoke -C "$CHANNEL" -n "$CC_NAME" \
  --transient '{"enhancedBid":"'"$BID_B64"'"}' \
  -c "$SUBMIT_CTOR" \
  "${PEER_FLAGS[@]}" --tls --cafile "$ORDERER_CA" --orderer localhost:7050 | tee -a "$LOG_FILE"

sleep 2
echo "[4/8] CloseTenderEnhanced" | tee -a "$LOG_FILE"
peer chaincode invoke -C "$CHANNEL" -n "$CC_NAME" \
  -c '{"Args":["EnhancedSmartContract:CloseTenderEnhanced","'"$TENDER_ID"'"]}' \
  "${PEER_FLAGS[@]}" --tls --cafile "$ORDERER_CA" --orderer localhost:7050 | tee -a "$LOG_FILE"

sleep 2
echo "[5/8] EvaluateBids" | tee -a "$LOG_FILE"
peer chaincode invoke -C "$CHANNEL" -n "$CC_NAME" \
  -c '{"Args":["EnhancedSmartContract:EvaluateBids","'"$TENDER_ID"'"]}' \
  "${PEER_FLAGS[@]}" --tls --cafile "$ORDERER_CA" --orderer localhost:7050 | tee -a "$LOG_FILE"

sleep 2
echo "[6/8] AwardBestBid" | tee -a "$LOG_FILE"
peer chaincode invoke -C "$CHANNEL" -n "$CC_NAME" \
  -c '{"Args":["EnhancedSmartContract:AwardBestBid","'"$TENDER_ID"'"]}' \
  "${PEER_FLAGS[@]}" --tls --cafile "$ORDERER_CA" --orderer localhost:7050 | tee -a "$LOG_FILE"

sleep 2
echo "[7/8] SubmitMilestone (private)" | tee -a "$LOG_FILE"
MS_B64=$(MS_PATH="$MILE_FILE" TID="$TENDER_ID" MID="$MILE_ID" $ENCODER - <<'PY'
import json, os, base64
with open(os.environ['MS_PATH'], 'r', encoding='utf-8') as f:
    ms = json.load(f)
ms['tenderId'] = os.environ['TID']
ms['milestoneId'] = os.environ['MID']
raw = json.dumps(ms).encode('utf-8')
print(base64.b64encode(raw).decode('ascii'))
PY
)
MS_CTOR=$(TID="$TENDER_ID" MID="$MILE_ID" $ENCODER - <<'PY'
import json, os
ctor = {"Args": ["SubmitMilestone", os.environ['TID'], os.environ['MID']]}
print(json.dumps(ctor))
PY
)
peer chaincode invoke -C "$CHANNEL" -n "$CC_NAME" \
  --transient '{"milestone":"'"$MS_B64"'"}' \
  -c "$MS_CTOR" \
  "${PEER_FLAGS[@]}" --tls --cafile "$ORDERER_CA" --orderer localhost:7050 | tee -a "$LOG_FILE"

sleep 2
echo "[8/8] ApproveMilestone" | tee -a "$LOG_FILE"
APPROVE_CTOR=$(TID="$TENDER_ID" MID="$MILE_ID" $ENCODER - <<'PY'
import json, os
ctor = {"Args": ["ApproveMilestone", os.environ['TID'], os.environ['MID']]}
print(json.dumps(ctor))
PY
)
peer chaincode invoke -C "$CHANNEL" -n "$CC_NAME" \
  -c "$APPROVE_CTOR" \
  "${PEER_FLAGS[@]}" --tls --cafile "$ORDERER_CA" --orderer localhost:7050 | tee -a "$LOG_FILE"

sleep 1
echo "--- Public Milestones ---" | tee -a "$LOG_FILE"
peer chaincode query -C "$CHANNEL" -n "$CC_NAME" \
  -c '{"Args":["ListMilestonesPublic","'"$TENDER_ID"'"]}' | tee -a "$LOG_FILE"

sleep 1
echo "--- Tender Statistics ---" | tee -a "$LOG_FILE"
peer chaincode query -C "$CHANNEL" -n "$CC_NAME" \
  -c '{"Args":["EnhancedSmartContract:GetTenderStatistics","'"$TENDER_ID"'"]}' | tee -a "$LOG_FILE"

sleep 1
echo "--- Financial Summary (before partial/retention) ---" | tee -a "$LOG_FILE"
peer chaincode query -C "$CHANNEL" -n "$CC_NAME" \
  -c '{"Args":["EnhancedSmartContract:GetFinancialSummary","'"$TENDER_ID"'"]}' | tee -a "$LOG_FILE"

sleep 1
echo "[9/10] RecordPartialPayment 50000.00" | tee -a "$LOG_FILE"
PARTIAL_CTOR=$(TID="$TENDER_ID" MID="$MILE_ID" $ENCODER - <<'PY'
import json, os
ctor = {"Args": ["EnhancedSmartContract:RecordPartialPayment", os.environ['TID'], os.environ['MID'], "50000"]}
print(json.dumps(ctor))
PY
)
peer chaincode invoke -C "$CHANNEL" -n "$CC_NAME" -c "$PARTIAL_CTOR" \
  "${PEER_FLAGS[@]}" --tls --cafile "$ORDERER_CA" --orderer localhost:7050 | tee -a "$LOG_FILE"

sleep 1
echo "[10/10] ReleaseRetention" | tee -a "$LOG_FILE"
RET_CTOR=$(TID="$TENDER_ID" $ENCODER - <<'PY'
import json, os
ctor = {"Args": ["EnhancedSmartContract:ReleaseRetention", os.environ['TID']]}
print(json.dumps(ctor))
PY
)
peer chaincode invoke -C "$CHANNEL" -n "$CC_NAME" -c "$RET_CTOR" \
  "${PEER_FLAGS[@]}" --tls --cafile "$ORDERER_CA" --orderer localhost:7050 | tee -a "$LOG_FILE"

sleep 1
echo "--- Financial Summary (after partial/retention) ---" | tee -a "$LOG_FILE"
peer chaincode query -C "$CHANNEL" -n "$CC_NAME" \
  -c '{"Args":["EnhancedSmartContract:GetFinancialSummary","'"$TENDER_ID"'"]}' | tee -a "$LOG_FILE"

echo "Logs at: $LOG_FILE"

