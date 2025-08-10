/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

function usage() {
  console.log('Usage: node main.js <command> [...args]\n');
  console.log('Environment:');
  console.log('  ORG=org0.example.com  CCP=path/to/connection.json  IDENTITY=Admin  WALLET=path/to/wallet');
  console.log('\nCommands:');
  console.log('  createTender <tenderId> <description> <openAtRFC3339> <closeAtRFC3339> <criteria>');
  console.log('  getTender <tenderId>');
  console.log('  submitBid <tenderId> <bidId> <contractorId> <amount> <docsHash>');
  console.log('  listBids <tenderId>');
  console.log('  closeTender <tenderId>');
  console.log('  recordEval <tenderId> <bidId> <score> [notes]');
  console.log('  listEvals <tenderId>');
  console.log('  award <tenderId> <bidId>');
  console.log('  submitMilestone <tenderId> <milestoneId> <title> <evidenceHash> <amount> <details...>');
  console.log('  approveMilestone <tenderId> <milestoneId>');
  console.log('  listMilestones <tenderId>');
}

function getDefaultPaths() {
  const org = process.env.ORG || 'org0.example.com';
  const baseProfiles = path.resolve(__dirname, '..', '..', 'profiles');
  const defaultCcp = path.join(baseProfiles, org, 'connection.json');
  const defaultWallet = path.join(baseProfiles, 'vscode', 'wallets', org);
  return { org, defaultCcp, defaultWallet };
}

async function connectGateway() {
  const { defaultCcp, defaultWallet } = getDefaultPaths();
  let ccpPath = process.env.CCP || defaultCcp;
  const identityLabel = process.env.IDENTITY || 'Admin';
  const walletPath = process.env.WALLET || defaultWallet;
  const channelName = process.env.CHANNEL || 'tenderchannel';
  const chaincodeName = process.env.CHAINCODE || 'tendercc';
  const asLocalhost = String(process.env.AS_LOCALHOST || 'true').toLowerCase() === 'true';
  const useDiscovery = String(process.env.DISCOVERY || 'false').toLowerCase() === 'true';

  if (!fs.existsSync(ccpPath)) {
    // fallback to VSCode profile if present
    const vsCcp = path.join(path.resolve(__dirname, '..', '..', 'profiles'), 'vscode', 'connection.json');
    const altPerOrg = path.join(path.resolve(__dirname, '..', '..', 'profiles'), `${process.env.ORG || 'org0.example.com'}.json`);
    if (fs.existsSync(vsCcp)) ccpPath = vsCcp; else if (fs.existsSync(altPerOrg)) ccpPath = altPerOrg;
  }
  if (!fs.existsSync(ccpPath)) throw new Error(`Connection profile not found. Tried CCP=${process.env.CCP || ''} and defaults.`);

  const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  if (!await wallet.get(identityLabel)) {
    throw new Error(`Identity ${identityLabel} not found in wallet ${walletPath}`);
  }

  const gateway = new Gateway();
  await gateway.connect(ccp, { wallet, identity: identityLabel, discovery: { enabled: useDiscovery, asLocalhost } });
  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(chaincodeName);
  return { gateway, contract };
}

async function initWalletFromMSP() {
  const { defaultWallet } = getDefaultPaths();
  const walletPath = process.env.WALLET || defaultWallet;
  const identityLabel = process.env.IDENTITY || 'Admin';
  const mspPath = process.env.MSP_PATH || path.resolve(__dirname, '..', '..', 'keyfiles', 'peerOrganizations', process.env.ORG || 'org0.example.com', 'users', `Admin@${process.env.ORG || 'org0.example.com'}`, 'msp');
  const mspId = process.env.MSPID || (process.env.ORG === 'org1.example.com' ? 'org1-example-com' : 'org0-example-com');

  const wallet = await Wallets.newFileSystemWallet(walletPath);
  if (await wallet.get(identityLabel)) {
    console.log(`Identity ${identityLabel} already exists in wallet ${walletPath}`);
    return;
  }
  const cert = fs.readFileSync(path.join(mspPath, 'signcerts', fs.readdirSync(path.join(mspPath, 'signcerts'))[0]), 'utf8');
  const key = fs.readFileSync(path.join(mspPath, 'keystore', fs.readdirSync(path.join(mspPath, 'keystore'))[0]), 'utf8');
  const x509Identity = { credentials: { certificate: cert, privateKey: key }, mspId, type: 'X.509' };
  await wallet.put(identityLabel, x509Identity);
  console.log(`Imported ${identityLabel} into wallet at ${walletPath}`);
}

async function run() {
  const [,, cmd, ...args] = process.argv;
  if (!cmd) { usage(); process.exit(1); }
  if (cmd === 'initWallet') { await initWalletFromMSP(); return; }
  const { gateway, contract } = await connectGateway();
  try {
    switch (cmd) {
      case 'createTender': {
        const [id, description, openAt, closeAt, criteria] = args;
        if (!id || !description || !openAt || !closeAt || !criteria) return usage();
        await contract.submitTransaction('CreateTender', id, description, openAt, closeAt, criteria);
        console.log('OK');
        break;
      }
      case 'getTender': {
        const [id] = args; if (!id) return usage();
        const res = await contract.evaluateTransaction('GetTender', id);
        console.log(res.toString());
        break;
      }
      case 'submitBid': {
        const [tenderId, bidId, contractorId, amount, docsHash] = args;
        if (!tenderId || !bidId || !contractorId || !amount || !docsHash) return usage();
        const bid = { tenderId: tenderId, bidId: bidId, contractorId, amount: parseFloat(amount), docsHash };
        const tx = contract.createTransaction('SubmitBid');
        tx.setTransient({ bid: Buffer.from(JSON.stringify(bid)) });
        await tx.submit(tenderId, bidId);
        console.log('OK');
        break;
      }
      case 'listBids': {
        const [tenderId] = args; if (!tenderId) return usage();
        const res = await contract.evaluateTransaction('ListBidsPublic', tenderId);
        console.log(res.toString());
        break;
      }
      case 'closeTender': {
        const [tenderId] = args; if (!tenderId) return usage();
        await contract.submitTransaction('CloseTender', tenderId);
        console.log('OK');
        break;
      }
      case 'recordEval': {
        const [tenderId, bidId, scoreStr, ...noteParts] = args;
        if (!tenderId || !bidId || !scoreStr) return usage();
        const score = parseFloat(scoreStr); const notes = noteParts.join(' ');
        await contract.submitTransaction('RecordEvaluation', tenderId, bidId, String(score), notes);
        console.log('OK');
        break;
      }
      case 'listEvals': {
        const [tenderId] = args; if (!tenderId) return usage();
        const res = await contract.evaluateTransaction('ListEvaluations', tenderId);
        console.log(res.toString());
        break;
      }
      case 'award': {
        const [tenderId, bidId] = args; if (!tenderId || !bidId) return usage();
        await contract.submitTransaction('AwardTender', tenderId, bidId);
        console.log('OK');
        break;
      }
      case 'submitMilestone': {
        const [tenderId, milestoneId, title, evidenceHash, amountStr, ...detailsParts] = args;
        if (!tenderId || !milestoneId || !title || !evidenceHash || !amountStr) return usage();
        const details = detailsParts.join(' ');
        const payload = { tenderId, milestoneId, title, evidenceHash, amount: parseFloat(amountStr), details };
        const tx = contract.createTransaction('SubmitMilestone');
        tx.setTransient({ milestone: Buffer.from(JSON.stringify(payload)) });
        await tx.submit(tenderId, milestoneId);
        console.log('OK');
        break;
      }
      case 'approveMilestone': {
        const [tenderId, milestoneId] = args; if (!tenderId || !milestoneId) return usage();
        await contract.submitTransaction('ApproveMilestone', tenderId, milestoneId);
        console.log('OK');
        break;
      }
      case 'listMilestones': {
        const [tenderId] = args; if (!tenderId) return usage();
        const res = await contract.evaluateTransaction('ListMilestonesPublic', tenderId);
        console.log(res.toString());
        break;
      }
      default:
        usage();
    }
  } finally {
    await gateway.disconnect();
  }
}

run().catch(e => { console.error(e); process.exit(1); });