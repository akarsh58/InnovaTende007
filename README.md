# InnovaTender — Construction Tender Management with Hyperledger Fabric

> **Construction technology portfolio project:** explores a blockchain-backed RFQ, bidding, award, milestone and payment workflow for civil-construction procurement.

## Recruiter snapshot

**Relevant roles:** AEC Automation Engineer · Construction Technology Engineer · Digital Engineering · Software Engineer (Construction Tech)

**What this repository demonstrates**
- Modeling construction procurement as an end-to-end digital workflow.
- Integrating a React UI, Express REST API and Hyperledger Fabric chaincode.
- Representing RFQs, contractor bids, awards, project milestones and payment events.
- Exploring bid confidentiality with Fabric private data collections and ledger-backed audit records.
- Documenting multi-component environments, API workflows and deployment constraints.

**Stack:** JavaScript · React · Node.js · Express · Hyperledger Fabric · Go chaincode · Docker / Docker Compose

## Architecture

```text
Owner / Bidder / Administrator
             |
         React UI
             |
       Express REST API
             |
        Fabric SDK
             |
     tendercc (Go chaincode)
             |
   Ledger + private data
```

## Construction workflow

1. Project owner creates and publishes an RFQ.
2. Contractors submit bids.
3. Owner closes, evaluates and awards the tender.
4. Awarded work is tracked through milestones and approvals.
5. Payments and retention releases are recorded.
6. Reports expose tender history, financial summaries and audit information.

The repository includes workflow documentation and a demo script. Functionality depends on configuring a local Hyperledger Fabric network and the project's API/UI environment.

## Where to start

- [Manager overview](MANAGER_OVERVIEW.md) — architecture, responsibilities, key capabilities and known limitations.
- [User guide](USER_GUIDE.md) — application workflow.
- [RFQ creation guide](RFQ_CREATION_GUIDE.md) — tender creation.
- [Quick reference](QUICK_REFERENCE.md) — UI workflow and local demo details.
- [Project record](PROJECT_RECORD.md) — implementation history and technical decisions.
- [Docker Compose](docker-compose.yml) — API and UI service definitions.
- [Demo tender flow](demo_tender_flow.sh) — workflow example.

## Local setup

The application requires a configured Hyperledger Fabric test network, connection profile and identities. See [MANAGER_OVERVIEW.md](MANAGER_OVERVIEW.md) and the project guides before running the local scripts. Do not use the example development credentials or Compose secrets in a deployed environment.

## Current limitations

This is a development/portfolio project, **not a production procurement service**. The manager overview identifies additional work on server-side authentication and RBAC, multi-organization identities, production deployment, automated testing and CI. Any claims about confidentiality, production readiness or compliance require a separate security and deployment review.

## Related AEC automation projects

- [BOQ Automation from PDF/Drawing](https://github.com/akarsh58/BOQ-Automation-from-PDF-Drawing) — quantity takeoff and drawing processing.
- [TenderRisk](https://github.com/akarsh58/tender-risk) — clause-grounded construction tender risk analysis.
- [Structural Crack Detector](https://github.com/akarsh58/Crack-Detection-Project) — computer vision for infrastructure inspection.
