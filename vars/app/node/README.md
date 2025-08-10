# Enhanced Client CLI

This CLI drives the enhanced tender flow against the Fabric test-network.

## Prerequisites
- Fabric test-network is up with channel `tenderchannel` and chaincode `tendercc` committed
- Admin MSP from test-network available locally
- Node >= 16

## Environment variables
- CCP: Path to connection profile (e.g. ~/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json)
- ORG1_ADMIN_MSP: Path to Org1 admin MSP (e.g. ~/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp)
- CHANNEL (optional): defaults to tenderchannel
- CHAINCODE (optional): defaults to tendercc

## Commands
- createSampleRFQ
- publishTender <tenderId>
- submitSampleBid <tenderId>
- closeTender <tenderId>
- evaluateBids <tenderId>
- awardBest <tenderId>
- submitMilestone <tenderId> <milestoneId> [jsonPath]
- approveMilestone <tenderId> <milestoneId>
- listMilestones <tenderId>
- getStats <tenderId>
- getFinancialSummary <tenderId>
- recordPartial <tenderId> <milestoneId> <amount>
- releaseRetention <tenderId>
- demoFull [tenderId] (runs full E2E and prints financial summary)

## Quick start
```bash
export CCP=~/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json
export ORG1_ADMIN_MSP=~/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
node enhanced_client.js demoFull
```
