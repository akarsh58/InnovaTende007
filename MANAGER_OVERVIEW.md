### Manager Overview – Tender Platform (Hyperledger Fabric)

Purpose
- A blockchain-backed RFQ → Bidding → Award → Project Execution platform tailored for civil construction. Ensures integrity, transparency, and controlled confidentiality (private data) for bids and milestones.

What’s inside
- Blockchain: Hyperledger Fabric (2 orgs), channel `tenderchannel`, smart contract `tendercc`.
- Smart Contract: Enhanced civil-construction model, events, private data for bids/milestones.
- API: Express (Node.js) provides clean REST endpoints over the contract.
- UI: React app with role-based navigation for Owners, Bidders, Admins.
- One-click launcher: Starts API + UI and opens the browser.

Key capabilities
- RFQ lifecycle: Create → Publish → Close → Evaluate → Award.
- Bids: Confidential submission with on-chain public references; evaluation support.
- Projects: Milestones (private data), approvals, partial payments, retention release.
- Insights: Tender statistics, financial summary, audit trail.
- Exports: CSV (tables), PDF (Audit Trail, Financial Summary).

How to run (Windows)
1) Ensure Fabric test network is up and `vars/app/node/env.example` points to your Org1 connection profile (absolute WSL path) and Admin MSP.
2) Double-click desktop shortcut “Tender Platform” (or run `D:\InnovaTende007\start_tender_platform.ps1`).
3) UI will open at `http://localhost:5174` (API at `http://localhost:3000`).

Using the UI
- Settings: Choose a role; set the working Tender ID (persists).
- RFQs: Create (wizard) and Publish RFQs.
- Bids: Submit bids (Bidder), or Close/Evaluate/Award (Owner).
- Projects: Load milestones, Approve, Partial Pay, Release Retention; view Financial Summary; export PDF.
- Reports: View Published RFQs and Bids (search, sort, paginate, CSV export). Load Audit Trail and export PDF.

Security & Trust
- TLS-secured Fabric network; identities via Org MSPs.
- Private Data Collections for bids and milestones protect sensitive content while keeping verifiable references on-chain.
- Audit Trail: Complete on-chain history per tender with TxIDs and timestamps.

Architecture at a glance
- UI (React) → REST API (Express) → Fabric SDK → Smart Contract (`EnhancedSmartContract`) → Ledger & Private Data.
- Events emitted for each stage enable external monitoring/notifications.

API surface (selected)
- RFQ: `POST /rfq`, `POST /tenders/:id/publish`, `GET /tenders?status=...`, `GET /tenders/:id`
- Bids: `POST /tenders/:id/bids`, `GET /tenders/:id/bids`, `POST /tenders/:id/close`, `POST /tenders/:id/evaluate`, `POST /tenders/:id/award`
- Milestones/Payments: `POST /tenders/:id/milestones`, `GET /tenders/:id/milestones`, `POST /tenders/:id/milestones/:mid/approve`, `POST /tenders/:id/milestones/:mid/partial`, `POST /tenders/:id/retention/release`
- Insights/Audit: `GET /tenders/:id/stats`, `GET /tenders/:id/financial-summary`, `GET /tenders/:id/history`

Roles
- Owner: Full control (RFQs, Awards, Projects, Reports).
- Bidder: RFQ browsing and Bid submission; Reports.
- Admin: Governance/Reports.

Limitations and next steps (Top 5 TODOs)
1) Authentication/RBAC: Add login and enforce roles server-side (JWT + Fabric attributes).
2) Production deploy: Docker Compose for API/UI, resolve host DNS issues, health checks.
3) Multi-org identities: Wallet support and identity-switching in UI; per-org private data access.
4) Advanced analytics: Bids comparison matrix, dashboards; scheduled PDF reports.
5) Automated testing & CI: Chaincode unit tests, API contract tests, UI e2e; CI pipeline.

Where to learn more
- Detailed project record: `PROJECT_RECORD.md` (history, decisions, runbooks).
- Chaincode: `chaincode/tendercc/go` (types and functions).
- API: `vars/app/node/server.js`; UI: `vars/app/ui`.
