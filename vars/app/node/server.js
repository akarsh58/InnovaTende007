#!/usr/bin/env node
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { Gateway, Wallets } = require('fabric-network');

const ENH = 'EnhancedSmartContract:';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const AUTH_DISABLED = String(process.env.AUTH_DISABLED || '').toLowerCase() === 'true';

function readUsers(){
  try {
    const p = path.join(__dirname, 'users.json');
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, 'utf8')) || [];
  } catch { return [] }
}

function signToken(payload) { return jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' }); }
function verifyToken(req, _res, next) {
  if (AUTH_DISABLED) return next();
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return next(new Error('Unauthorized'));
  try { req.user = jwt.verify(token, JWT_SECRET); return next(); } catch { return next(new Error('Unauthorized')); }
}
function requireRole(roles) {
  return function(req, _res, next){
    if (AUTH_DISABLED) return next();
    if (!req.user || !roles.includes(req.user.role)) return next(new Error('Forbidden'));
    next();
  }
}

function resolveOrgFromRequest(req){
  const header = (req.headers['x-org'] || '').toString().toLowerCase();
  return header === 'org0' ? 'org0' : 'org1';
}

function getOrgConfig(org){
  if (org === 'org0') {
    const ccp = process.env.ORG0_CCP || process.env.CCP;
    const mspBase = process.env.ORG0_ADMIN_MSP;
    return { mspId: 'Org0MSP', ccpPath: ccp, mspBase };
  }
  const ccp = process.env.ORG1_CCP || process.env.CCP || process.env.CCP_FALLBACK;
  const mspBase = process.env.ORG1_ADMIN_MSP || process.env.ORG_ADMIN_MSP;
  return { mspId: 'Org1MSP', ccpPath: ccp, mspBase };
}

async function connect(org) {
  const { ccpPath, mspId, mspBase } = getOrgConfig(org || 'org1');
  const identityLabel = process.env.IDENTITY || `Admin@${org || 'org1'}.example.com`;
  const channelName = process.env.CHANNEL || 'tenderchannel';
  const chaincodeName = process.env.CHAINCODE || 'tendercc';
  if (!ccpPath || !fs.existsSync(ccpPath)) throw new Error('Connection profile not found: ' + ccpPath);
  const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
  const wallet = await Wallets.newInMemoryWallet();
  const base = mspBase || path.resolve(process.env.HOME || process.env.USERPROFILE, 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', `${org || 'org1'}.example.com`, 'users', `Admin@${org || 'org1'}.example.com`, 'msp');
  const cert = fs.readFileSync(path.join(base, 'signcerts', fs.readdirSync(path.join(base, 'signcerts'))[0]), 'utf8');
  const keyDir = path.join(base, 'keystore');
  const keyFile = fs.readdirSync(keyDir)[0];
  const key = fs.readFileSync(path.join(keyDir, keyFile), 'utf8');
  await wallet.put(identityLabel, { credentials: { certificate: cert, privateKey: key }, mspId, type: 'X.509' });
  const gateway = new Gateway();
  await gateway.connect(ccp, { wallet, identity: identityLabel, discovery: { enabled: false, asLocalhost: true } });
  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(chaincodeName);
  return { gateway, contract };
}

function ok(res, data) { res.json({ success: true, data }); }
function fail(res, err) { res.status(err.message === 'Unauthorized' ? 401 : err.message === 'Forbidden' ? 403 : 400).json({ success: false, error: err.message || String(err) }); }

async function withContract(handler, org) {
  const { gateway, contract } = await connect(org);
  try { return await handler(contract); }
  finally { await gateway.disconnect(); }
}

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));

// Auth
app.post('/auth/login', (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username) throw new Error('username required');
    if (!password) throw new Error('password required');

    const user = readUsers().find(u => u.username === username && u.password === password);
    if (!user) throw new Error('invalid credentials');

    const token = signToken({ sub: username, role: user.role });
    ok(res, { token, role: user.role, username });
  } catch (e) { fail(res, e); }
});

// Admin: seed demo data (3 tenders + bids)
app.post('/admin/seed', verifyToken, requireRole(['admin']), async (req, res) => {
  const org = resolveOrgFromRequest(req)
  const now = Date.now()
  const ids = [1,2,3].map(i => `RFQ-DEMO-${new Date(now).toISOString().slice(0,10).replace(/-/g,'')}-${i}`)
  function rfq(id){
    const issue = new Date(now - 60*60*1000).toISOString()
    const deadline = new Date(now + 7*24*60*60*1000).toISOString()
    return {
      id,
      title: `Demo Package ${id.slice(-1)}`,
      description: `Demonstration RFQ ${id}`,
      category: 'Civil Construction',
      location: 'Hyderabad',
      scope: { objectives: 'Road works', deliverables: 'As per specs', technicalSpecs: 'MORTH' },
      deadlines: { rfqIssueDate: issue, bidSubmissionDeadline: deadline }
    }
  }
  function bid(id){
    return {
      bidder: { name: 'Demo Contractor' },
      pricing: { basePrice: 100000 + Math.floor(Math.random()*50000) },
      documents: []
    }
  }
  try {
    const results = []
    for (const id of ids){
      // Create RFQ
      await withContract(c => c.submitTransaction(ENH + 'CreateEnhancedTender', JSON.stringify(rfq(id))), org)
      await withContract(c => c.submitTransaction(ENH + 'PublishTender', id), org)
      // Submit a bid using transient
      const bidId = `BID-${Math.floor(Math.random()*1e6)}`
      const payload = Buffer.from(JSON.stringify(Object.assign({}, bid(id), { tenderId: id, bidId })), 'utf8')
      await withContract(async c => { const tx = c.createTransaction(ENH + 'SubmitEnhancedBid'); tx.setTransient({ enhancedBid: payload }); await tx.submit(id, bidId); }, org)
      results.push({ tenderId: id, bidId })
    }
    ok(res, { created: results })
  } catch (e) { fail(res, e) }
});

// RFQ
app.post('/rfq', verifyToken, requireRole(['owner','admin']), async (req, res) => {
  try {
    const rfq = req.body; if (!rfq || !rfq.id) throw new Error('rfq.id required');
    await withContract(c => c.submitTransaction(ENH + 'CreateEnhancedTender', JSON.stringify(rfq)), resolveOrgFromRequest(req));
    ok(res, { tenderId: rfq.id });
  } catch (e) { fail(res, e); }
});

app.get('/tenders', verifyToken, async (req, res) => {
  try {
    const status = req.query.status || 'PUBLISHED';
    const data = await withContract(c => c.evaluateTransaction(ENH + 'GetTendersByStatus', status), resolveOrgFromRequest(req));
    ok(res, JSON.parse(data.toString() || '[]'));
  } catch (e) { fail(res, e); }
});

app.get('/tenders/:id', verifyToken, async (req, res) => {
  try {
    const data = await withContract(c => c.evaluateTransaction(ENH + 'GetEnhancedTender', req.params.id), resolveOrgFromRequest(req));
    ok(res, JSON.parse(data.toString() || '{}'));
  } catch (e) { fail(res, e); }
});

app.get('/tenders/:id/history', verifyToken, async (req, res) => {
  try {
    const data = await withContract(c => c.evaluateTransaction('GetTenderHistory', req.params.id), resolveOrgFromRequest(req));
    ok(res, JSON.parse(data.toString() || '[]'));
  } catch (e) { fail(res, e); }
});

app.post('/tenders/:id/publish', verifyToken, requireRole(['owner','admin']), async (req, res) => {
  try { await withContract(c => c.submitTransaction(ENH + 'PublishTender', req.params.id), resolveOrgFromRequest(req)); ok(res, {}); } catch (e) { fail(res, e); }
});

// Bids
app.post('/tenders/:id/bids', verifyToken, requireRole(['bidder','owner','admin']), async (req, res) => {
  try {
    const { bid } = req.body; if (!bid) throw new Error('bid required');
    const bidId = bid.bidId || 'BID-' + Date.now();
    const payload = Buffer.from(JSON.stringify(Object.assign({}, bid, { tenderId: req.params.id, bidId })), 'utf8');
    await withContract(async c => { const tx = c.createTransaction(ENH + 'SubmitEnhancedBid'); tx.setTransient({ enhancedBid: payload }); await tx.submit(req.params.id, bidId); }, resolveOrgFromRequest(req));
    ok(res, { bidId });
  } catch (e) { fail(res, e); }
});

app.get('/tenders/:id/bids', verifyToken, async (req, res) => {
  try { const data = await withContract(c => c.evaluateTransaction(ENH + 'ListBidsPublic', req.params.id), resolveOrgFromRequest(req)); ok(res, JSON.parse(data.toString() || '[]')); } catch (e) { fail(res, e); }
});

app.post('/tenders/:id/close', verifyToken, requireRole(['owner','admin']), async (req, res) => {
  try { await withContract(c => c.submitTransaction(ENH + 'CloseTenderEnhanced', req.params.id), resolveOrgFromRequest(req)); ok(res, {}); } catch (e) { fail(res, e); }
});

app.post('/tenders/:id/evaluate', verifyToken, requireRole(['owner','admin']), async (req, res) => {
  try { await withContract(c => c.submitTransaction(ENH + 'EvaluateBids', req.params.id), resolveOrgFromRequest(req)); ok(res, {}); } catch (e) { fail(res, e); }
});

app.post('/tenders/:id/award', verifyToken, requireRole(['owner','admin']), async (req, res) => {
  try { await withContract(c => c.submitTransaction(ENH + 'AwardBestBid', req.params.id), resolveOrgFromRequest(req)); ok(res, {}); } catch (e) { fail(res, e); }
});

// Milestones
app.post('/tenders/:id/milestones', verifyToken, requireRole(['owner','admin']), async (req, res) => {
  try {
    const { milestone } = req.body; if (!milestone) throw new Error('milestone required');
    const mid = milestone.milestoneId || 'MS-' + Date.now();
    const payload = Buffer.from(JSON.stringify(Object.assign({}, milestone, { tenderId: req.params.id, milestoneId: mid })), 'utf8');
    await withContract(async c => { const tx = c.createTransaction('SubmitMilestone'); tx.setTransient({ milestone: payload }); await tx.submit(req.params.id, mid); }, resolveOrgFromRequest(req));
    ok(res, { milestoneId: mid });
  } catch (e) { fail(res, e); }
});

app.post('/tenders/:id/milestones/:mid/approve', verifyToken, requireRole(['owner','admin']), async (req, res) => {
  try { await withContract(c => c.submitTransaction('ApproveMilestone', req.params.id, req.params.mid), resolveOrgFromRequest(req)); ok(res, {}); } catch (e) { fail(res, e); }
});

app.get('/tenders/:id/milestones', verifyToken, async (req, res) => {
  try { const data = await withContract(c => c.evaluateTransaction(ENH + 'ListMilestonesPublic', req.params.id), resolveOrgFromRequest(req)); ok(res, JSON.parse(data.toString() || '[]')); } catch (e) { fail(res, e); }
});

// Payments
app.post('/tenders/:id/milestones/:mid/partial', verifyToken, requireRole(['owner','admin']), async (req, res) => {
  try { const { amount } = req.body; if (!amount) throw new Error('amount required'); await withContract(c => c.submitTransaction(ENH + 'RecordPartialPayment', req.params.id, req.params.mid, String(amount)), resolveOrgFromRequest(req)); ok(res, {}); } catch (e) { fail(res, e); }
});

app.post('/tenders/:id/retention/release', verifyToken, requireRole(['owner','admin']), async (req, res) => {
  try { await withContract(c => c.submitTransaction(ENH + 'ReleaseRetention', req.params.id), resolveOrgFromRequest(req)); ok(res, {}); } catch (e) { fail(res, e); }
});

// Insights
app.get('/tenders/:id/stats', verifyToken, async (req, res) => {
  try { const data = await withContract(c => c.evaluateTransaction(ENH + 'GetTenderStatistics', req.params.id), resolveOrgFromRequest(req)); ok(res, JSON.parse(data.toString() || '{}')); } catch (e) { fail(res, e); }
});

app.get('/tenders/:id/financial-summary', verifyToken, async (req, res) => {
  try { const data = await withContract(c => c.evaluateTransaction(ENH + 'GetFinancialSummary', req.params.id), resolveOrgFromRequest(req)); ok(res, JSON.parse(data.toString() || '{}')); } catch (e) { fail(res, e); }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('API listening on port', port));
