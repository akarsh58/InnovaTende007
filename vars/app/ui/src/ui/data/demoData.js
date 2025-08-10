// Demo data for enhanced RFQ system

export const sampleRFQs = [
  {
    id: 'DEMO-HIGHWAY-2025-001',
    projectScope: {
      description: 'Construction of 4-lane divided highway connecting Mumbai-Pune Express corridor with advanced traffic management systems, eco-friendly design, and smart infrastructure integration.',
      objectives: [
        'Construct 85km 4-lane highway with median',
        'Build earthquake-resistant structures',
        'Implement sustainable construction practices',
        'Integrate smart traffic management systems',
        'Install solar-powered street lighting'
      ],
      deliverables: [
        'Completed highway construction as per drawings',
        'Quality assurance test reports',
        'As-built drawings and documentation',
        'Environmental clearance certificates',
        'Traffic management system installation'
      ],
      technicalSpecs: [
        'IRC 37-2018 for flexible pavement design',
        'MORTH specifications for road construction',
        'IS 456-2000 for concrete structures',
        'IRC 6-2017 for loads and stresses',
        'Smart traffic sensors integration'
      ],
      qualityStandards: ['IS 456-2000', 'IRC standards', 'MORTH compliance'],
      budget: {
        currency: 'INR',
        estimatedMin: 850000000,
        estimatedMax: 1200000000,
        paymentTerms: 'Net 30'
      }
    },
    deadlines: {
      rfqIssueDate: '2025-01-10T12:00:00Z',
      questionsDeadline: '2025-01-25T17:00:00Z',
      bidSubmissionDeadline: '2025-02-15T17:00:00Z',
      projectStartDate: '2025-03-01T09:00:00Z',
      projectEndDate: '2027-02-28T18:00:00Z'
    },
    evaluationCriteria: [
      { id: 'PRICE', name: 'Total Project Cost', weight: 35, type: 'QUANTITATIVE', scoringMethod: 'LOWEST_PRICE', description: 'Overall project cost including materials and labor' },
      { id: 'TECHNICAL', name: 'Technical Approach', weight: 30, type: 'QUALITATIVE', scoringMethod: 'HIGHEST_SCORE', description: 'Innovation in construction methodology and technology' },
      { id: 'EXPERIENCE', name: 'Relevant Experience', weight: 25, type: 'QUALITATIVE', scoringMethod: 'HIGHEST_SCORE', description: 'Previous highway construction projects' },
      { id: 'TIMELINE', name: 'Project Timeline', weight: 10, type: 'QUANTITATIVE', scoringMethod: 'LOWEST_DURATION', description: 'Proposed completion timeline' }
    ],
    ownerDetails: {
      organizationName: 'National Highway Authority of India',
      contactPerson: {
        name: 'Rajesh Kumar Singh',
        email: 'project.manager@nhai.gov.in',
        phone: '+91-11-2876-5432'
      }
    },
    status: 'PUBLISHED',
    blockchainStage: 'BIDDING_OPEN'
  },
  {
    id: 'DEMO-METRO-2025-002',
    projectScope: {
      description: 'Design and construction of 25km elevated metro rail corridor with 18 stations, including integrated transport hubs, parking facilities, and commercial spaces.',
      objectives: [
        'Build elevated metro corridor with modern stations',
        'Integrate with existing transport network',
        'Implement green building standards',
        'Ensure accessibility compliance',
        'Create commercial integration opportunities'
      ],
      deliverables: [
        'Completed metro corridor and stations',
        'Integrated transport hub facilities',
        'Safety and signaling systems',
        'Commercial space development',
        'Operations and maintenance manual'
      ],
      technicalSpecs: [
        'IS 456-2000 for concrete structures',
        'Metro rail construction guidelines',
        'Fire safety compliance systems',
        'Accessibility standards compliance',
        'Green building certification requirements'
      ],
      budget: {
        currency: 'INR',
        estimatedMin: 3500000000,
        estimatedMax: 4200000000,
        paymentTerms: 'Net 45'
      }
    },
    deadlines: {
      rfqIssueDate: '2025-01-15T12:00:00Z',
      questionsDeadline: '2025-02-05T17:00:00Z',
      bidSubmissionDeadline: '2025-03-01T17:00:00Z',
      projectStartDate: '2025-04-01T09:00:00Z',
      projectEndDate: '2028-03-31T18:00:00Z'
    },
    evaluationCriteria: [
      { id: 'PRICE', name: 'Total Cost', weight: 40, type: 'QUANTITATIVE', scoringMethod: 'LOWEST_PRICE', description: 'Complete project cost' },
      { id: 'TECHNICAL', name: 'Technical Excellence', weight: 35, type: 'QUALITATIVE', scoringMethod: 'HIGHEST_SCORE', description: 'Metro construction expertise' },
      { id: 'EXPERIENCE', name: 'Metro Experience', weight: 25, type: 'QUALITATIVE', scoringMethod: 'HIGHEST_SCORE', description: 'Previous metro projects completed' }
    ],
    ownerDetails: {
      organizationName: 'Mumbai Metropolitan Development Authority',
      contactPerson: {
        name: 'Priya Sharma',
        email: 'metro.projects@mmda.gov.in',
        phone: '+91-22-2345-6789'
      }
    },
    status: 'DRAFT',
    blockchainStage: 'BLOCKCHAIN_CREATED'
  },
  {
    id: 'DEMO-BRIDGE-2025-003',
    projectScope: {
      description: 'Construction of cable-stayed bridge across river with 800m main span, including approach roads, toll collection systems, and advanced monitoring infrastructure.',
      objectives: [
        'Build cable-stayed bridge with 800m span',
        'Construct approach roads and infrastructure',
        'Install advanced structural monitoring',
        'Implement toll collection systems',
        'Ensure environmental protection measures'
      ],
      deliverables: [
        'Completed cable-stayed bridge structure',
        'Approach roads and connecting infrastructure',
        'Toll collection and monitoring systems',
        'Environmental mitigation measures',
        'Structural health monitoring system'
      ],
      technicalSpecs: [
        'IRC 6-2017 for bridge loads and stresses',
        'IS 456-2000 for concrete structures',
        'Cable-stayed bridge design standards',
        'Seismic design requirements',
        'Environmental protection measures'
      ],
      budget: {
        currency: 'INR',
        estimatedMin: 1800000000,
        estimatedMax: 2400000000,
        paymentTerms: 'Net 30'
      }
    },
    deadlines: {
      rfqIssueDate: '2025-01-20T12:00:00Z',
      questionsDeadline: '2025-02-10T17:00:00Z',
      bidSubmissionDeadline: '2025-03-10T17:00:00Z',
      projectStartDate: '2025-04-15T09:00:00Z',
      projectEndDate: '2027-12-31T18:00:00Z'
    },
    evaluationCriteria: [
      { id: 'PRICE', name: 'Project Cost', weight: 30, type: 'QUANTITATIVE', scoringMethod: 'LOWEST_PRICE', description: 'Total bridge construction cost' },
      { id: 'TECHNICAL', name: 'Bridge Technology', weight: 40, type: 'QUALITATIVE', scoringMethod: 'HIGHEST_SCORE', description: 'Cable-stayed bridge expertise' },
      { id: 'EXPERIENCE', name: 'Bridge Experience', weight: 20, type: 'QUALITATIVE', scoringMethod: 'HIGHEST_SCORE', description: 'Previous major bridge projects' },
      { id: 'SAFETY', name: 'Safety Record', weight: 10, type: 'QUALITATIVE', scoringMethod: 'HIGHEST_SCORE', description: 'Construction safety performance' }
    ],
    ownerDetails: {
      organizationName: 'Bangalore Development Authority',
      contactPerson: {
        name: 'Vikram Reddy',
        email: 'bridge.projects@bda.gov.in',
        phone: '+91-80-4321-9876'
      }
    },
    status: 'PUBLISHED',
    blockchainStage: 'EVALUATION'
  }
];

export const getDemoRFQ = () => {
  return {
    id: 'RFQ-' + new Date().toISOString().replace(/[-:.TZ]/g,''),
    projectScope: {
      description: 'Smart City Infrastructure Development - Phase 2: Integrated urban development including smart traffic systems, waste management, and digital governance infrastructure.',
      objectives: [
        'Implement smart traffic management systems',
        'Deploy IoT-based waste management',
        'Build digital governance infrastructure'
      ],
      deliverables: [
        'Smart traffic control systems',
        'IoT waste monitoring network',
        'Digital citizen services platform'
      ],
      technicalSpecs: [
        'IoT device integration standards',
        'Cloud infrastructure requirements',
        'Data security compliance'
      ],
      qualityStandards: ['ISO 27001', 'Smart city guidelines'],
      geographicalConstraints: 'Urban area with existing infrastructure',
      operationalConstraints: ['Minimal service disruption', '24/7 system availability'],
      assumptions: ['Stable power supply', 'Internet connectivity available'],
      exclusions: ['Existing infrastructure maintenance'],
      budget: {
        currency: 'INR',
        estimatedMin: 250000000,
        estimatedMax: 350000000,
        paymentTerms: 'Net 30',
        paymentSchedule: []
      }
    },
    deadlines: {
      rfqIssueDate: new Date().toISOString(),
      questionsDeadline: new Date(Date.now()+7*864e5).toISOString(),
      bidSubmissionDeadline: new Date(Date.now()+21*864e5).toISOString(),
      projectStartDate: new Date(Date.now()+35*864e5).toISOString(),
      projectEndDate: new Date(Date.now()+365*864e5).toISOString(),
      milestoneDeadlines: []
    },
    evaluationCriteria: [
      { id: 'PRICE', name: 'Total Cost', weight: 35, type: 'QUANTITATIVE', scoringMethod: 'LOWEST_PRICE', description: 'Overall project cost', mandatoryRequirement: false },
      { id: 'TECHNICAL', name: 'Technical Innovation', weight: 40, type: 'QUALITATIVE', scoringMethod: 'HIGHEST_SCORE', description: 'Smart city technology implementation', mandatoryRequirement: false },
      { id: 'EXPERIENCE', name: 'Smart City Experience', weight: 25, type: 'QUALITATIVE', scoringMethod: 'HIGHEST_SCORE', description: 'Previous smart city projects', mandatoryRequirement: false }
    ],
    bidRequirements: {
      requiredDocuments: [],
      technicalRequirements: [],
      financialRequirements: {
        minTurnover: 500000000,
        minNetWorth: 200000000,
        auditedFinancials: true,
        yearsOfFinancials: 3,
        currency: 'INR'
      },
      experienceRequirements: {
        minYearsInBusiness: 10,
        similarProjectsMin: 3,
        relevantSectors: ['Smart Cities', 'IoT Implementation', 'Urban Infrastructure'],
        keyPersonnelReqs: []
      },
      certificationRequirements: [],
      submissionFormat: {
        method: 'ONLINE',
        fileFormats: ['PDF'],
        maxFileSize: 50,
        encryptionReq: false,
        digitalSignature: true,
        language: 'English'
      }
    },
    contractTerms: {
      contractType: 'FIXED_PRICE',
      paymentTerms: {
        paymentCycle: 'MILESTONE_BASED',
        paymentDays: 30,
        retentionPercentage: 10,
        retentionPeriod: 12,
        currency: 'INR'
      },
      disputeResolution: {
        method: 'ARBITRATION',
        jurisdiction: 'Mumbai',
        governingLaw: 'Indian Law'
      },
      termination: {
        terminationForCause: true,
        terminationForConvenience: true,
        noticePeriod: 30
      }
    },
    complianceRequirements: [],
    ownerDetails: {
      organizationName: 'Smart City Development Corporation',
      legalEntity: 'Government Corporation',
      address: {
        street: 'Smart City Complex, Sector 15',
        city: 'Gurgaon',
        state: 'Haryana',
        country: 'India',
        postalCode: '122001'
      },
      contactPerson: {
        name: 'Amit Patel',
        title: 'Project Director',
        email: 'director@smartcity.gov.in',
        phone: '+91-124-567-8900'
      },
      authorizedBy: {
        name: 'Dr. Sunita Verma',
        title: 'CEO',
        authorityLevel: 'Executive',
        date: new Date().toISOString()
      }
    }
  };
};
