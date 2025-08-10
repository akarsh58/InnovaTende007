#!/usr/bin/env node
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const ccpPath = process.env.CCP || path.resolve(process.env.CCP_FALLBACK || '');
    const identityLabel = process.env.IDENTITY || 'Admin@org1.example.com';
    const channelName = process.env.CHANNEL || 'tenderchannel';
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

    const { Gateway } = require('fabric-network');
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: identityLabel, discovery: { enabled: false, asLocalhost: true } });
    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);

    console.log(`Listening for events on ${channelName}/${chaincodeName}... (Ctrl+C to exit)`);
    await contract.addContractListener(async (event) => {
      try {
        const payload = event.payload ? event.payload.toString() : '';
        console.log(`[${new Date().toISOString()}] Event: ${event.eventName}`);
        if (payload) console.log(payload);
      } catch (e) {
        console.error('Listener error:', e.message);
      }
    });
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
})();
