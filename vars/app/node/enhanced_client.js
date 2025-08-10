#!/usr/bin/env node
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function connectGateway() {
  const ccpPath = process.env.CCP || path.resolve(process.env.CCP_FALLBACK || '');
  const walletPath = process.env.WALLET || path.resolve('wallet');
  const identityLabel = process.env.IDENTITY || 'Admin@org1.example.com';
  const channelName = process.env.CHANNEL || 'mychannel';
  const chaincodeName = process.env.CHAINCODE || 'tendercc';
  if (!fs.existsSync(ccpPath)) throw new Error('Connection profile not found: ' + ccpPath);
  const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
  const wallet = await Wallets.newInMemoryWallet();
  const base = process.env.ORG1_ADMIN_MSP || path.resolve(process.env.HOME || process.env.USERPROFILE, 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'users', 'Admin@org1.example.com', 'msp');
  const cert = fs.readFileSync(path.join(base, 'signcerts', fs.readdirSync(path.join(base, 'signcerts'))[0]), 'utf8');
  const keyDir = path.join(base, 'keystore');
  const keyFile = fs.readdirSync(keyDir)[0];
  const key = fs.readFileSync(path.join(keyDir, keyFile), 'utf8');
  await wallet.put(identityLabel, { credentials: { certificate: cert, privateKey: key }, mspId: 'Org1MSP', type: 'X.509' });
  const gateway = new Gateway();
  await gateway.connect(ccp, { wallet, identity: identityLabel, discovery: { enabled: true, asLocalhost: true } });
  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(chaincodeName);
  return { gateway, contract };
}

function usage() {
  console.log('Usage: node enhanced_client.js <cmd> [args]');
  console.log('  createSampleRFQ');
  console.log('  publishTender <tenderId>');
  console.log('  submitSampleBid <tenderId>');
  console.log('  closeTender <tenderId>');
  console.log('  evaluateBids <tenderId>');
  console.log('  awardBest <tenderId>');
  console.log('  submitMilestone <tenderId> <milestoneId> [jsonPath]');
  console.log('  approveMilestone <tenderId> <milestoneId>');
  console.log('  listMilestones <tenderId>');
  console.log('  getStats <tenderId>');
  console.log('  getFinancialSummary <tenderId>');
  console.log('  recordPartial <tenderId> <milestoneId> <amount>');
  console.log('  releaseRetention <tenderId>');
  console.log('  testConnection');
  console.log('  demoFull [tenderId]');
}

async function run() {
  const [cmd, ...args] = process.argv.slice(2);
  if (!cmd) return usage();
  const { gateway, contract } = await connectGateway();
  try {
    switch (cmd) {
      case 'createSampleRFQ': {
        const rfq = fs.readFileSync(path.resolve('../../../samples/rfq/construction-rfq-sample.json'), 'utf8');
        await contract.submitTransaction('EnhancedSmartContract:CreateEnhancedTender', rfq);
        console.log('RFQ created');
        break;
      }
      case 'publishTender': {
        const [tid] = args; if (!tid) return usage();
        await contract.submitTransaction('EnhancedSmartContract:PublishTender', tid);
        console.log('Published');
        break;
      }
      case 'submitSampleBid': {
        const [tid] = args; if (!tid) return usage();
        const bid = fs.readFileSync(path.resolve('../../../samples/bid/construction-bid-sample.json'), 'utf8');
        const tx = contract.createTransaction('EnhancedSmartContract:SubmitEnhancedBid');
        tx.setTransient({ bid: Buffer.from(bid) });
        await tx.submit(tid, 'BID-TECHCORP-001');
        console.log('Bid submitted');
        break;
      }
      case 'closeTender': {
        const [tid] = args; if (!tid) return usage();
        await contract.submitTransaction('EnhancedSmartContract:CloseTenderEnhanced', tid);
        console.log('Closed');
        break;
      }
      case 'evaluateBids': {
        const [tid] = args; if (!tid) return usage();
        await contract.submitTransaction('EnhancedSmartContract:EvaluateBids', tid);
        console.log('Evaluated');
        break;
      }
      case 'awardBest': {
        const [tid] = args; if (!tid) return usage();
        await contract.submitTransaction('EnhancedSmartContract:AwardBestBid', tid);
        console.log('Awarded');
        break;
      }
      case 'submitMilestone': {
        const [tid, mid, jsonPath] = args; if (!tid || !mid) return usage();
        const msPath = jsonPath || path.resolve('../../../samples/milestone/milestone-sample.json');
        const msObj = JSON.parse(fs.readFileSync(msPath, 'utf8'));
        msObj.tenderId = tid; msObj.milestoneId = mid;
        const tx = contract.createTransaction('SubmitMilestone');
        tx.setTransient({ milestone: Buffer.from(JSON.stringify(msObj), 'utf8') });
        await tx.submit(tid, mid);
        console.log('Milestone submitted');
        break;
      }
      case 'approveMilestone': {
        const [tid, mid] = args; if (!tid || !mid) return usage();
        await contract.submitTransaction('ApproveMilestone', tid, mid);
        console.log('Milestone approved');
        break;
      }
      case 'listMilestones': {
        const [tid] = args; if (!tid) return usage();
        const result = await contract.evaluateTransaction('ListMilestonesPublic', tid);
        console.log(JSON.parse(result.toString()));
        break;
      }
      case 'getStats': {
        const [tid] = args; if (!tid) return usage();
        const result = await contract.evaluateTransaction('EnhancedSmartContract:GetTenderStatistics', tid);
        console.log(result.toString());
        break;
      }
      case 'getFinancialSummary': {
        const [tid] = args; if (!tid) return usage();
        const result = await contract.evaluateTransaction('GetFinancialSummary', tid);
        console.log(result.toString());
        break;
      }
      case 'recordPartial': {
        const [tid, mid, amount] = args; if (!tid || !mid || !amount) return usage();
        await contract.submitTransaction('RecordPartialPayment', tid, mid, parseFloat(amount));
        console.log('Partial payment recorded');
        break;
      }
      case 'releaseRetention': {
        const [tid] = args; if (!tid) return usage();
        await contract.submitTransaction('ReleaseRetention', tid);
        console.log('Retention released');
        break;
      }
      case 'testConnection': {
        console.log('Testing connection to Fabric network...');
        const result = await contract.evaluateTransaction('Init');
        console.log('Connection successful! Response:', result.toString());
        break;
      }
      case 'demoFull': {
        const [tid] = args;
        const tenderId = tid || 'RFQ-2025-INFRASTRUCTURE-001';
        console.log('=== Full Enhanced RFQ Demo ===');
        
        // Create RFQ
        console.log('1. Creating RFQ...');
        const rfq = fs.readFileSync(path.resolve('../../../samples/rfq/construction-rfq-sample.json'), 'utf8');
        const rfqObj = JSON.parse(rfq);
        rfqObj.id = tenderId;
        await contract.submitTransaction('EnhancedSmartContract:CreateEnhancedTender', JSON.stringify(rfqObj));
        
        // Publish
        console.log('2. Publishing tender...');
        await contract.submitTransaction('EnhancedSmartContract:PublishTender', tenderId);
        
        // Submit bid
        console.log('3. Submitting bid...');
        const bid = fs.readFileSync(path.resolve('../../../samples/bid/construction-bid-sample.json'), 'utf8');
        const bidObj = JSON.parse(bid);
        bidObj.tenderId = tenderId;
        const tx = contract.createTransaction('EnhancedSmartContract:SubmitEnhancedBid');
        tx.setTransient({ bid: Buffer.from(JSON.stringify(bidObj)) });
        await tx.submit(tenderId, 'BID-TECHCORP-001');
        
        // Close
        console.log('4. Closing tender...');
        await contract.submitTransaction('EnhancedSmartContract:CloseTenderEnhanced', tenderId);
        
        // Evaluate
        console.log('5. Evaluating bids...');
        await contract.submitTransaction('EnhancedSmartContract:EvaluateBids', tenderId);
        
        // Award
        console.log('6. Awarding to best bid...');
        await contract.submitTransaction('EnhancedSmartContract:AwardBestBid', tenderId);
        
        // Get stats
        console.log('7. Getting statistics...');
        const stats = await contract.evaluateTransaction('EnhancedSmartContract:GetTenderStatistics', tenderId);
        console.log('Final Statistics:');
        console.log(stats.toString());
        
        console.log('=== Demo Complete ===');
        break;
      }
      default:
        usage();
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    gateway.disconnect();
  }
}

if (require.main === module) {
  run().catch(console.error);
}

module.exports = { connectGateway, run };

