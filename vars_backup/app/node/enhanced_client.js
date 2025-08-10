#!/usr/bin/env node

/**
 * Enhanced Fabric Client for Comprehensive RFQ Management
 * Supports the full RFQ specification with structured data
 */

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

// Sample comprehensive RFQ template
const sampleRFQ = {
  id: "RFQ-2025-INFRASTRUCTURE-001",
  projectScope: {
    description: "Enterprise Network Infrastructure Modernization",
    objectives: [
      "Upgrade network infrastructure to support 100Gbps backbone",
      "Implement zero-trust security architecture", 
      "Achieve 99.99% uptime SLA",
      "Reduce operational costs by 25%"
    ],
    deliverables: [
      "Network architecture design and documentation",
      "Hardware procurement and installation",
      "Software configuration and optimization", 
      "Security implementation and testing",
      "Staff training and knowledge transfer",
      "6-month warranty and support"
    ],
    technicalSpecs: [
      "Minimum 100Gbps core switching capacity",
      "Redundant power and cooling systems",
      "Support for IPv6 and MPLS protocols",
      "Integration with existing SIEM systems",
      "Compliance with NIST Cybersecurity Framework"
    ],
    qualityStandards: [
      "ISO 9001:2015 Quality Management",
      "ISO 27001:2013 Information Security",
      "IEEE 802.11 wireless standards"
    ],
    geographicalConstraints: "Work must be performed on-site at corporate headquarters in New York, NY",
    operationalConstraints: [
      "Work must be performed during designated maintenance windows",
      "No disruption to critical business operations",
      "Coordination with existing IT support teams required"
    ],
    assumptions: [
      "Client will provide temporary workspace for contractor team",
      "Existing network documentation is accurate and current",
      "Required permits and approvals will be obtained by client"
    ],
    exclusions: [
      "End-user device configuration",
      "Third-party software licensing costs",
      "Ongoing maintenance beyond warranty period"
    ],
    budget: {
      currency: "USD",
      estimatedMin: 500000,
      estimatedMax: 750000,
      paymentTerms: "Net 30 days after milestone completion",
      paymentSchedule: [
        { name: "Design Approval", percentage: 20, description: "Network design and architecture approval" },
        { name: "Hardware Delivery", percentage: 30, description: "Hardware delivered and inspected" },
        { name: "Installation Complete", percentage: 30, description: "Installation and initial configuration" },
        { name: "Testing Complete", percentage: 15, description: "Testing and optimization completed" },
        { name: "Project Closure", percentage: 5, description: "Documentation and training completed" }
      ]
    }
  },
  deadlines: {
    rfqIssueDate: new Date().toISOString(),
    questionsDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    bidSubmissionDeadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    projectStartDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    projectEndDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    milestoneDeadlines: [
      {
        name: "Design Phase",
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Complete network design and obtain client approval",
        critical: true
      },
      {
        name: "Procurement Phase", 
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Hardware procurement and delivery",
        critical: true
      },
      {
        name: "Implementation Phase",
        deadline: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Installation and configuration complete",
        critical: true
      }
    ]
  },
  evaluationCriteria: [
    {
      id: "TECHNICAL_APPROACH",
      name: "Technical Approach and Methodology",
      weight: 35.0,
      type: "QUALITATIVE",
      description: "Quality of technical solution, innovation, and implementation methodology",
      scoringMethod: "HIGHEST_SCORE",
      mandatoryRequirement: false,
      subCriteria: [
        { name: "Solution Architecture", weight: 40, description: "Quality and scalability of proposed architecture" },
        { name: "Implementation Plan", weight: 30, description: "Feasibility and detail of implementation approach" },
        { name: "Innovation", weight: 30, description: "Use of cutting-edge technologies and best practices" }
      ]
    },
    {
      id: "TOTAL_COST",
      name: "Total Project Cost",
      weight: 30.0,
      type: "QUANTITATIVE", 
      description: "Total cost of ownership including all project phases",
      scoringMethod: "LOWEST_PRICE",
      mandatoryRequirement: false
    },
    {
      id: "TEAM_EXPERIENCE",
      name: "Team Experience and Qualifications",
      weight: 25.0,
      type: "QUALITATIVE",
      description: "Relevant experience and certifications of proposed team members",
      scoringMethod: "HIGHEST_SCORE",
      mandatoryRequirement: false
    },
    {
      id: "PROJECT_TIMELINE",
      name: "Project Timeline and Delivery",
      weight: 10.0,
      type: "QUANTITATIVE",
      description: "Ability to meet project deadlines and delivery commitments",
      scoringMethod: "HIGHEST_SCORE", 
      mandatoryRequirement: false
    }
  ],
  bidRequirements: {
    requiredDocuments: [
      {
        name: "Executive Summary",
        description: "High-level overview of proposed solution (max 5 pages)",
        mandatory: true,
        format: "PDF",
        maxSizeMB: 5
      },
      {
        name: "Technical Proposal",
        description: "Detailed technical approach, architecture, and implementation plan",
        mandatory: true,
        format: "PDF",
        maxSizeMB: 20
      },
      {
        name: "Financial Proposal",
        description: "Detailed cost breakdown by phase and category",
        mandatory: true,
        format: "PDF",
        maxSizeMB: 10
      },
      {
        name: "Team Resumes",
        description: "Resumes and certifications for all key project team members",
        mandatory: true,
        format: "PDF",
        maxSizeMB: 15
      },
      {
        name: "Company Profile",
        description: "Company background, capabilities, and relevant case studies",
        mandatory: true,
        format: "PDF",
        maxSizeMB: 10
      },
      {
        name: "References",
        description: "At least 3 references for similar projects completed in last 3 years",
        mandatory: true,
        format: "PDF",
        maxSizeMB: 5
      }
    ],
    technicalRequirements: [
      {
        category: "Network Infrastructure",
        description: "Minimum 5 years experience with enterprise network design and implementation",
        standards: ["IEEE 802.1", "RFC 3031", "ANSI/TIA-568"],
        mandatory: true
      },
      {
        category: "Security",
        description: "Demonstrated expertise in network security and zero-trust architectures",
        standards: ["NIST Cybersecurity Framework", "ISO 27001"],
        mandatory: true
      }
    ],
    financialRequirements: {
      minTurnover: 2000000,
      minNetWorth: 1000000,
      auditedFinancials: true,
      yearsOfFinancials: 3,
      currency: "USD"
    },
    experienceRequirements: {
      minYearsInBusiness: 5,
      similarProjectsMin: 3,
      minProjectValue: 250000,
      relevantSectors: ["Financial Services", "Healthcare", "Government", "Education"],
      keyPersonnelReqs: [
        {
          role: "Project Manager",
          minExperience: 5,
          requiredSkills: ["PMP Certification", "Network Projects", "Team Leadership"],
          certificationsRequired: ["PMP", "ITIL"]
        },
        {
          role: "Network Architect",
          minExperience: 7,
          requiredSkills: ["Network Design", "Security Architecture", "Enterprise Systems"],
          certificationsRequired: ["CCIE", "CISSP"]
        }
      ]
    },
    certificationRequirements: [
      {
        name: "ISO 9001:2015",
        issuingBody: "Accredited Certification Body",
        mandatory: true
      },
      {
        name: "ISO 27001:2013", 
        issuingBody: "Accredited Certification Body",
        mandatory: true
      }
    ],
    bidSecurity: {
      required: true,
      type: "BANK_GUARANTEE",
      percentage: 2.0,
      currency: "USD",
      validityDays: 90
    },
    submissionFormat: {
      method: "ONLINE",
      fileFormats: ["PDF"],
      maxFileSize: 100,
      encryptionReq: true,
      digitalSignature: true,
      language: "English"
    }
  },
  contractTerms: {
    contractType: "FIXED_PRICE",
    paymentTerms: {
      paymentCycle: "MILESTONE_BASED",
      paymentDays: 30,
      retentionPercentage: 10.0,
      retentionPeriod: 12,
      currency: "USD"
    },
    performanceBond: {
      required: true,
      percentage: 10.0,
      validityDays: 365,
      type: "BANK_GUARANTEE"
    },
    warranties: [
      {
        type: "DEFECTS",
        period: 12,
        description: "Warranty against defects in materials and workmanship",
        coverage: "FULL"
      },
      {
        type: "PERFORMANCE",
        period: 6,
        description: "Warranty of system performance meeting specified requirements",
        coverage: "FULL"
      }
    ],
    penalties: [
      {
        type: "DELAY",
        percentage: 0.5,
        cap: 10.0,
        description: "Penalty for project delays (0.5% per week, max 10% of contract value)"
      }
    ],
    intellectualProperty: {
      ownershipOfWork: "CLIENT",
      existingIPHandling: "LICENSE",
      newIPOwnership: "CLIENT"
    },
    disputeResolution: {
      method: "ARBITRATION",
      jurisdiction: "New York, NY",
      governingLaw: "New York State Law"
    },
    termination: {
      terminationForCause: true,
      terminationForConvenience: true,
      noticePeriod: 30
    }
  },
  complianceRequirements: [
    {
      type: "ENVIRONMENTAL",
      standard: "ISO 14001",
      description: "Environmental management compliance",
      mandatory: false,
      evidence: ["ISO 14001 Certificate"],
      auditable: true
    },
    {
      type: "SAFETY",
      standard: "OHSAS 18001",
      description: "Occupational health and safety compliance",
      mandatory: true,
      evidence: ["Safety Training Records", "Incident Reports"],
      auditable: true
    },
    {
      type: "SECURITY",
      standard: "SOC 2 Type II",
      description: "Security controls audit",
      mandatory: true,
      evidence: ["SOC 2 Report"],
      auditable: true
    }
  ],
  ownerDetails: {
    organizationName: "InnovaTech Solutions Inc.",
    legalEntity: "Delaware Corporation",
    address: {
      street: "123 Innovation Drive, Suite 500",
      city: "New York",
      state: "NY",
      country: "United States",
      postalCode: "10001"
    },
    contactPerson: {
      name: "Sarah Johnson",
      title: "Chief Procurement Officer",
      email: "sarah.johnson@innovatech.com",
      phone: "+1-555-0123",
      mobile: "+1-555-0124",
      department: "Procurement & Strategic Sourcing"
    },
    alternateContacts: [
      {
        name: "Michael Chen",
        title: "IT Director",
        email: "michael.chen@innovatech.com", 
        phone: "+1-555-0125",
        department: "Information Technology"
      }
    ],
    authorizedBy: {
      name: "Robert Smith",
      title: "Chief Executive Officer",
      authorityLevel: "Executive",
      date: new Date().toISOString()
    },
    taxInfo: {
      taxId: "12-3456789",
      vatNumber: "US123456789",
      taxStatus: "C-Corporation"
    }
  }
};

// Sample comprehensive bid template
const sampleBid = {
  tenderId: "RFQ-2025-INFRASTRUCTURE-001",
  bidId: "BID-TECHCORP-001",
  contractorId: "TECHCORP-SOLUTIONS",
  totalAmount: 675000,
  currency: "USD",
  technicalProposal: {
    methodology: "Agile implementation with risk-based approach using industry best practices",
    timeline: {
      startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      phases: [
        {
          name: "Design and Planning",
          startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
          deliverables: ["Network Architecture", "Security Design", "Implementation Plan"],
          dependencies: ["Site Survey", "Requirements Confirmation"]
        },
        {
          name: "Procurement and Staging",
          startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 105 * 24 * 60 * 60 * 1000).toISOString(),
          deliverables: ["Hardware Delivery", "Software Licenses", "Staging Environment"],
          dependencies: ["Approved Design", "Purchase Orders"]
        },
        {
          name: "Implementation",
          startDate: new Date(Date.now() + 105 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 165 * 24 * 60 * 60 * 1000).toISOString(),
          deliverables: ["Installed Hardware", "Configured Systems", "Security Implementation"],
          dependencies: ["Hardware Delivery", "Maintenance Windows"]
        },
        {
          name: "Testing and Optimization",
          startDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          deliverables: ["Test Results", "Performance Optimization", "Documentation"],
          dependencies: ["Implementation Complete"]
        }
      ],
      criticalPath: ["Design Approval", "Hardware Delivery", "Core Switch Installation", "Security Configuration"]
    },
    teamComposition: [
      {
        name: "Alice Johnson",
        role: "Project Manager",
        experience: 8,
        skills: ["PMP", "Network Projects", "Risk Management", "Stakeholder Management"],
        certifications: ["PMP", "ITIL v4", "Agile Certified"],
        allocationPercentage: 50
      },
      {
        name: "Bob Wilson",
        role: "Senior Network Architect",
        experience: 12,
        skills: ["Network Design", "Security Architecture", "Cisco Technologies", "SD-WAN"],
        certifications: ["CCIE R&S", "CISSP", "CCNP Security"],
        allocationPercentage: 75
      },
      {
        name: "Carol Davis",
        role: "Security Specialist",
        experience: 10,
        skills: ["Zero Trust", "SIEM", "Threat Analysis", "Compliance"],
        certifications: ["CISSP", "CISM", "CEH"],
        allocationPercentage: 60
      }
    ],
    resources: [
      {
        type: "EQUIPMENT",
        name: "Network Analyzers",
        quantity: 2,
        duration: 30,
        cost: 5000
      },
      {
        type: "SOFTWARE",
        name: "Design Tools",
        quantity: 5,
        duration: 180,
        cost: 15000
      }
    ],
    qualityAssurance: {
      standards: ["ISO 9001:2015", "IEEE 802.11"],
      procedures: ["Code Review", "Test-Driven Development", "Continuous Integration"],
      testingPlan: "Comprehensive testing including unit, integration, and performance testing",
      documentation: "Complete documentation package including as-built drawings and operational procedures"
    },
    riskMitigation: [
      {
        risk: "Hardware delivery delays",
        probability: "MEDIUM",
        impact: "HIGH", 
        mitigation: "Pre-order critical components and maintain backup suppliers",
        contingency: "Temporary equipment rental if delays exceed 2 weeks"
      },
      {
        risk: "Network downtime during cutover",
        probability: "LOW",
        impact: "HIGH",
        mitigation: "Detailed cutover plan with rollback procedures",
        contingency: "24/7 support team during cutover period"
      }
    ],
    innovation: [
      {
        description: "AI-powered network optimization",
        benefits: ["Automated performance tuning", "Predictive maintenance", "Reduced operational costs"],
        implementation: "Deploy AI monitoring tools with machine learning algorithms"
      }
    ]
  },
  financialProposal: {
    breakdownByPhase: [
      { phase: "Design and Planning", cost: 135000, hours: 900 },
      { phase: "Procurement", cost: 270000, hours: 0 },
      { phase: "Implementation", cost: 202500, hours: 1350 },
      { phase: "Testing and Training", cost: 67500, hours: 450 }
    ],
    breakdownByCategory: [
      { category: "LABOR", cost: 405000, percentage: 60 },
      { category: "HARDWARE", cost: 202500, percentage: 30 },
      { category: "SOFTWARE", cost: 47250, percentage: 7 },
      { category: "MISC", cost: 20250, percentage: 3 }
    ],
    paymentSchedule: [
      { milestone: "Design Approval", percentage: 20, amount: 135000, deliverables: ["Architecture Design", "Implementation Plan"] },
      { milestone: "Hardware Delivery", percentage: 30, amount: 202500, deliverables: ["All Hardware Delivered"] },
      { milestone: "Implementation Complete", percentage: 30, amount: 202500, deliverables: ["System Installed", "Initial Testing"] },
      { milestone: "Final Acceptance", percentage: 20, amount: 135000, deliverables: ["Documentation", "Training", "Warranty"] }
    ],
    costAssumptions: [
      "Client provides workspace and basic utilities",
      "No custom development required",
      "Standard warranty periods apply"
    ],
    priceValidity: 60
  },
  complianceChecklist: {
    "ISO27001": true,
    "SAFETY": true,
    "SECURITY": true,
    "ENVIRONMENTAL": false
  },
  documentHashes: {
    "technicalProposal": "sha256:abc123def456...",
    "financialProposal": "sha256:def456ghi789...",
    "teamResumes": "sha256:ghi789jkl012...",
    "companyProfile": "sha256:jkl012mno345..."
  },
  submittedAt: new Date().toISOString(),
  validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
};

async function connectGateway() {
  const ccpPath = process.env.CCP || path.resolve(__dirname, '..', '..', 'profiles', 'org0.example.com', 'connection.json');
  const walletPath = process.env.WALLET || path.resolve(__dirname, '..', '..', 'profiles', 'vscode', 'wallets', 'org0.example.com');
  const identityLabel = process.env.IDENTITY || 'Admin';
  const channelName = process.env.CHANNEL || 'tenderchannel';
  const chaincodeName = process.env.CHAINCODE || 'tendercc';

  if (!fs.existsSync(ccpPath)) {
    throw new Error(`Connection profile not found: ${ccpPath}`);
  }

  const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  
  if (!await wallet.get(identityLabel)) {
    throw new Error(`Identity ${identityLabel} not found in wallet ${walletPath}`);
  }

  const gateway = new Gateway();
  await gateway.connect(ccp, { 
    wallet, 
    identity: identityLabel, 
    discovery: { enabled: false, asLocalhost: false } 
  });
  
  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(chaincodeName);

  return { gateway, contract };
}

function usage() {
  console.log('Enhanced Fabric RFQ Client');
  console.log('');
  console.log('Environment Variables:');
  console.log('  ORG=org0.example.com');
  console.log('  CHANNEL=tenderchannel');
  console.log('  CHAINCODE=tendercc');
  console.log('  WALLET=path/to/wallet');
  console.log('  CCP=path/to/connection.json');
  console.log('');
  console.log('Commands:');
  console.log('  createSampleRFQ              - Create sample comprehensive RFQ');
  console.log('  createRFQ <file.json>         - Create RFQ from JSON file');
  console.log('  publishTender <tenderId>      - Publish draft tender (make it live)');
  console.log('  updateTender <tenderId> <file.json> - Update draft tender');
  console.log('  getTender <tenderId>          - Get tender details');
  console.log('  getTenderStats <tenderId>     - Get tender statistics');
  console.log('  getTendersByStatus <status>   - Get tenders by status (DRAFT/OPEN/CLOSED/AWARDED)');
  console.log('  submitSampleBid <tenderId>    - Submit sample comprehensive bid');
  console.log('  submitBid <tenderId> <bidId> <file.json> - Submit bid from JSON file');
  console.log('  evaluateBids <tenderId>       - Run automated bid evaluation');
  console.log('  closeTender <tenderId>        - Close tender for submissions (enhanced)');
  console.log('  awardBest <tenderId>          - Auto-award best-scoring bid');
  console.log('  getEnhancedBid <tenderId> <bidId> - Get private bid details');
  console.log('  listBids <tenderId>           - List public bid references');
  console.log('  generateSampleRFQ             - Generate sample RFQ JSON file');
  console.log('  generateSampleBid             - Generate sample bid JSON file');
}

async function run() {
  try {
    const { gateway, contract } = await connectGateway();
    
    try {
      const [command, ...args] = process.argv.slice(2);

      switch (command) {
        case 'createSampleRFQ': {
          console.log('Creating comprehensive sample RFQ...');
          const tenderJSON = JSON.stringify(sampleRFQ, null, 2);
          await contract.submitTransaction('CreateEnhancedTender', tenderJSON);
          console.log(`✅ Sample RFQ created: ${sampleRFQ.id}`);
          console.log(`📋 Status: ${sampleRFQ.status || 'DRAFT'}`);
          console.log(`💰 Budget: ${sampleRFQ.projectScope.budget.currency} ${sampleRFQ.projectScope.budget.estimatedMin.toLocaleString()} - ${sampleRFQ.projectScope.budget.estimatedMax.toLocaleString()}`);
          console.log(`📅 Submission Deadline: ${new Date(sampleRFQ.deadlines.bidSubmissionDeadline).toLocaleDateString()}`);
          break;
        }

        case 'createRFQ': {
          const [filename] = args;
          if (!filename) return usage();
          const tenderJSON = fs.readFileSync(filename, 'utf8');
          await contract.submitTransaction('CreateEnhancedTender', tenderJSON);
          console.log(`✅ RFQ created from ${filename}`);
          break;
        }

        case 'publishTender': {
          const [tenderId] = args;
          if (!tenderId) return usage();
          await contract.submitTransaction('PublishTender', tenderId);
          console.log(`✅ Tender ${tenderId} published and open for bids`);
          break;
        }

        case 'updateTender': {
          const [tenderId, filename] = args;
          if (!tenderId || !filename) return usage();
          const tenderJSON = fs.readFileSync(filename, 'utf8');
          await contract.submitTransaction('UpdateTender', tenderId, tenderJSON);
          console.log(`✅ Tender ${tenderId} updated`);
          break;
        }

        case 'getTender': {
          const [tenderId] = args;
          if (!tenderId) return usage();
          const result = await contract.evaluateTransaction('GetEnhancedTender', tenderId);
          const tender = JSON.parse(result.toString());
          console.log(JSON.stringify(tender, null, 2));
          break;
        }

        case 'getTenderStats': {
          const [tenderId] = args;
          if (!tenderId) return usage();
          const result = await contract.evaluateTransaction('GetTenderStatistics', tenderId);
          console.log(result.toString());
          break;
        }

        case 'getTendersByStatus': {
          const [status] = args;
          if (!status) return usage();
          const result = await contract.evaluateTransaction('GetTendersByStatus', status);
          const tenders = JSON.parse(result.toString());
          console.log(`Found ${tenders.length} tender(s) with status: ${status}`);
          tenders.forEach(tender => {
            console.log(`- ${tender.id}: ${tender.projectScope.description}`);
          });
          break;
        }

        case 'submitSampleBid': {
          const [tenderId] = args;
          if (!tenderId) return usage();
          sampleBid.tenderId = tenderId;
          sampleBid.bidId = `BID-${Date.now()}`;
          const bidJSON = JSON.stringify(sampleBid);
          const tx = contract.createTransaction('SubmitEnhancedBid');
          tx.setTransient({ enhancedBid: Buffer.from(bidJSON) });
          await tx.submit(tenderId, sampleBid.bidId);
          console.log(`✅ Sample bid submitted: ${sampleBid.bidId}`);
          console.log(`💰 Total Amount: ${sampleBid.currency} ${sampleBid.totalAmount.toLocaleString()}`);
          console.log(`👥 Team Size: ${sampleBid.technicalProposal.teamComposition.length} members`);
          break;
        }

        case 'submitBid': {
          const [tenderId, bidId, filename] = args;
          if (!tenderId || !bidId || !filename) return usage();
          const bidJSON = fs.readFileSync(filename, 'utf8');
          const tx = contract.createTransaction('SubmitEnhancedBid');
          tx.setTransient({ enhancedBid: Buffer.from(bidJSON) });
          await tx.submit(tenderId, bidId);
          console.log(`✅ Bid ${bidId} submitted for tender ${tenderId}`);
          break;
        }

        case 'evaluateBids': {
          const [tenderId] = args;
          if (!tenderId) return usage();
          await contract.submitTransaction('EvaluateBids', tenderId);
          console.log(`✅ Automated evaluation completed for tender ${tenderId}`);
          break;
        }

        case 'closeTender': {
          const [tenderId] = args;
          if (!tenderId) return usage();
          await contract.submitTransaction('CloseTenderEnhanced', tenderId);
          console.log(`✅ Tender ${tenderId} closed for submissions`);
          break;
        }

        case 'awardBest': {
          const [tenderId] = args;
          if (!tenderId) return usage();
          await contract.submitTransaction('AwardBestBid', tenderId);
          console.log(`✅ Best bid awarded for tender ${tenderId}`);
          break;
        }

        case 'getEnhancedBid': {
          const [tenderId, bidId] = args;
          if (!tenderId || !bidId) return usage();
          const result = await contract.evaluateTransaction('GetEnhancedBidPrivate', tenderId, bidId);
          const bid = JSON.parse(result.toString());
          console.log(JSON.stringify(bid, null, 2));
          break;
        }

        case 'listBids': {
          const [tenderId] = args;
          if (!tenderId) return usage();
          const result = await contract.evaluateTransaction('ListBidsPublic', tenderId);
          const bids = JSON.parse(result.toString());
          console.log(`Found ${bids.length} bid(s) for tender ${tenderId}:`);
          bids.forEach(bid => {
            console.log(`- ${bid.bidId} by ${bid.contractorId} (Hash: ${bid.bidHash.substring(0, 16)}...)`);
          });
          break;
        }

        case 'generateSampleRFQ': {
          const filename = `sample-rfq-${Date.now()}.json`;
          fs.writeFileSync(filename, JSON.stringify(sampleRFQ, null, 2));
          console.log(`✅ Sample RFQ generated: ${filename}`);
          console.log('Edit this file and use with: createRFQ <filename>');
          break;
        }

        case 'generateSampleBid': {
          const filename = `sample-bid-${Date.now()}.json`;
          fs.writeFileSync(filename, JSON.stringify(sampleBid, null, 2));
          console.log(`✅ Sample bid generated: ${filename}`);
          console.log('Edit this file and use with: submitBid <tenderId> <bidId> <filename>');
          break;
        }

        default:
          usage();
      }
    } finally {
      await gateway.disconnect();
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  run();
}

module.exports = { sampleRFQ, sampleBid };
