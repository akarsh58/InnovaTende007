'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

function getDefaults() {
  const org = process.env.ORG || 'org0.example.com';
  const base = path.resolve(__dirname, '..', '..', 'profiles');
  return {
    ccpPath: process.env.CCP || path.join(base, org, 'connection.json'),
    walletPath: process.env.WALLET || path.join(base, 'vscode', 'wallets', org),
    identity: process.env.IDENTITY || 'Admin',
    channel: process.env.CHANNEL || 'tenderchannel',
    chaincode: process.env.CHAINCODE || 'tendercc',
  };
}

async function main() {
  const { ccpPath, walletPath, identity, channel, chaincode } = getDefaults();
  const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  const gateway = new Gateway();
  await gateway.connect(ccp, { wallet, identity, discovery: { enabled: true, asLocalhost: false } });
  const network = await gateway.getNetwork(channel);
  const contract = network.getContract(chaincode);

  const listener = async (event) => {
    const name = event.eventName;
    let payload = '';
    try { payload = event.payload ? event.payload.toString() : ''; } catch (_) {}
    console.log(`[${new Date().toISOString()}] Event ${name}: ${payload}`);
  };

  await contract.addContractListener(listener, 'RFQCreated', 'BidSubmitted', 'BidWindowClosed', 'BidEvaluated', 'TenderAwarded', 'MilestoneSubmitted', 'MilestoneApproved', 'MilestoneRejected', 'PaymentReleased');
  console.log('Listening for contract events... Press Ctrl+C to exit');
}

main().catch(e => { console.error(e); process.exit(1); });


