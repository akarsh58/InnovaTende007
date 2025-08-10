import React, { useMemo, useState } from 'react'
import { useToast } from '../components/ToastProvider'
import { getDemoRFQ } from '../data/demoData'

const API = (path) => (import.meta.env.VITE_API_BASE || 'http://localhost:3000') + path

export default function RFQWizard(){
  const toast = useToast()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(()=>({
    id: 'RFQ-' + new Date().toISOString().replace(/[-:.TZ]/g,''),
    projectScope: {
      description: '',
      objectives: [],
      deliverables: [],
      technicalSpecs: [],
      qualityStandards: [],
      geographicalConstraints: '',
      operationalConstraints: [],
      assumptions: [],
      exclusions: [],
      budget: {
        currency: 'USD',
        estimatedMin: 0,
        estimatedMax: 0,
        paymentTerms: 'Net 30',
        paymentSchedule: []
      }
    },
    deadlines: {
      rfqIssueDate: new Date().toISOString(),
      questionsDeadline: new Date(Date.now()+3*864e5).toISOString(),
      bidSubmissionDeadline: new Date(Date.now()+7*864e5).toISOString(),
      projectStartDate: new Date(Date.now()+14*864e5).toISOString(),
      projectEndDate: new Date(Date.now()+90*864e5).toISOString(),
      milestoneDeadlines: []
    },
    evaluationCriteria: [
      { id: 'PRICE', name: 'Total Cost', weight: 40, type: 'QUANTITATIVE', scoringMethod: 'LOWEST_PRICE', description: 'Overall project cost', mandatoryRequirement: false },
      { id: 'TECHNICAL', name: 'Technical Approach', weight: 35, type: 'QUALITATIVE', scoringMethod: 'HIGHEST_SCORE', description: 'Technical methodology and approach', mandatoryRequirement: false },
      { id: 'EXPERIENCE', name: 'Team Experience', weight: 25, type: 'QUALITATIVE', scoringMethod: 'HIGHEST_SCORE', description: 'Relevant project experience', mandatoryRequirement: false }
    ],
    bidRequirements: {
      requiredDocuments: [],
      technicalRequirements: [],
      financialRequirements: {
        minTurnover: 0,
        minNetWorth: 0,
        auditedFinancials: true,
        yearsOfFinancials: 3,
        currency: 'USD'
      },
      experienceRequirements: {
        minYearsInBusiness: 5,
        similarProjectsMin: 1,
        relevantSectors: [],
        keyPersonnelReqs: []
      },
      certificationRequirements: [],
      submissionFormat: {
        method: 'ONLINE',
        fileFormats: ['PDF'],
        maxFileSize: 50,
        encryptionReq: false,
        digitalSignature: false,
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
        currency: 'USD'
      },
      disputeResolution: {
        method: 'ARBITRATION',
        jurisdiction: 'Local',
        governingLaw: 'Local Law'
      },
      termination: {
        terminationForCause: true,
        terminationForConvenience: true,
        noticePeriod: 30
      }
    },
    complianceRequirements: [],
    ownerDetails: {
      organizationName: '',
      legalEntity: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: ''
      },
      contactPerson: {
        name: '',
        title: '',
        email: '',
        phone: ''
      },
      authorizedBy: {
        name: '',
        title: '',
        authorityLevel: 'Executive',
        date: new Date().toISOString()
      }
    }
  }))

  const update = (path, value) => {
    const parts = path.split('.')
    setForm(prev=> {
      const next = { ...prev }
      let obj = next
      for(let i=0;i<parts.length-1;i++){ const k = parts[i]; obj[k] = { ...(obj[k]||{}) }; obj = obj[k] }
      obj[parts[parts.length-1]] = value
      return next
    })
  }

  const preview = useMemo(()=> form, [form])

  const createRFQ = async () => {
    try {
      const res = await fetch(API('/rfq'), { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(preview) })
      const j = await res.json(); if(!j.success) throw new Error(j.error)
      toast.success('Enhanced RFQ created successfully!')
    } catch(e){ toast.error(e.message) }
  }

  const loadDemoData = () => {
    const demoData = getDemoRFQ();
    setForm(demoData);
    toast.success('Demo data loaded! 🚀');
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3>Create Enhanced RFQ (Wizard)</h3>
        <button 
          onClick={loadDemoData}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#10b981', 
            color: 'white', 
            border: 'none', 
            borderRadius: 8,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          🚀 Load Demo Data
        </button>
      </div>
      <Stepper step={step} setStep={setStep} />
      {step===1 && (
        <Section title="Project Basics & Owner Details">
          <Field label="RFQ ID" value={form.id} onChange={v=> update('id', v)} />
          <Field 
            label="Project Description" 
            value={form.projectScope.description} 
            onChange={v=> update('projectScope.description', v)} 
            type="textarea" 
          />
          <Field 
            label="Organization Name" 
            value={form.ownerDetails.organizationName} 
            onChange={v=> update('ownerDetails.organizationName', v)}
            suggestions={[
              'Mumbai Metropolitan Development Authority',
              'National Highway Authority of India',
              'Delhi Development Authority',
              'Bangalore Development Authority',
              'Hyderabad Metropolitan Development Authority',
              'Chennai Corporation',
              'Pune Municipal Corporation',
              'Kolkata Port Trust',
              'Airport Authority of India',
              'Indian Railways Construction'
            ]}
          />
          <Field 
            label="Contact Person Name" 
            value={form.ownerDetails.contactPerson.name} 
            onChange={v=> update('ownerDetails.contactPerson.name', v)}
            suggestions={[
              'Rajesh Kumar Singh',
              'Priya Sharma',
              'Amit Patel',
              'Sunita Verma',
              'Vikram Reddy',
              'Kavitha Nair',
              'Arjun Gupta',
              'Meera Joshi'
            ]}
          />
          <Field 
            label="Contact Email" 
            value={form.ownerDetails.contactPerson.email} 
            onChange={v=> update('ownerDetails.contactPerson.email', v)}
            suggestions={[
              'project.manager@mmda.gov.in',
              'procurement@nhai.gov.in',
              'tenders@dda.org.in',
              'contracts@bmda.gov.in'
            ]}
          />
          <Field 
            label="Contact Phone" 
            value={form.ownerDetails.contactPerson.phone} 
            onChange={v=> update('ownerDetails.contactPerson.phone', v)}
            suggestions={[
              '+91-22-2345-6789',
              '+91-11-2876-5432',
              '+91-80-4321-9876',
              '+91-40-5678-1234'
            ]}
          />
        </Section>
      )}
      {step===2 && (
        <Section title="Project Scope & Budget">
          <ArrayField 
            label="Objectives" 
            value={form.projectScope.objectives} 
            onChange={v=> update('projectScope.objectives', v)}
            suggestions={[
              'Construct 4-lane highway with median',
              'Build earthquake-resistant structure',
              'Implement sustainable construction practices',
              'Ensure minimal environmental impact',
              'Complete project within specified timeline',
              'Achieve IS 456 compliance standards',
              'Integrate smart traffic management systems',
              'Provide 24/7 emergency access routes',
              'Install solar-powered street lighting',
              'Create pedestrian-friendly infrastructure'
            ]}
          />
          <ArrayField 
            label="Deliverables" 
            value={form.projectScope.deliverables} 
            onChange={v=> update('projectScope.deliverables', v)}
            suggestions={[
              'Completed road construction as per drawings',
              'Quality assurance test reports',
              'As-built drawings and documentation',
              'Environmental clearance certificates',
              'Safety compliance certificates',
              'Maintenance manual and warranty',
              'Traffic management plan implementation',
              'Utility relocation completion',
              'Drainage system installation',
              'Road marking and signage installation'
            ]}
          />
          <ArrayField 
            label="Technical Specs" 
            value={form.projectScope.technicalSpecs} 
            onChange={v=> update('projectScope.technicalSpecs', v)}
            suggestions={[
              'IRC 37-2018 for flexible pavement design',
              'IS 2386 for aggregate testing',
              'MORTH specifications for road construction',
              'IS 1200 for measurement standards',
              'IRC 21-2000 for geometric design',
              'IS 456-2000 for concrete structures',
              'IRC 6-2017 for loads and stresses',
              'IS 383-2016 for coarse and fine aggregates',
              'IRC SP 20-2002 for rural road construction',
              'IS 73-2013 for pozzolanic materials'
            ]}
          />
          <Field 
            label="Currency" 
            value={form.projectScope.budget.currency} 
            onChange={v=> update('projectScope.budget.currency', v)}
            suggestions={['INR', 'USD', 'EUR', 'GBP']}
          />
          <Field 
            label="Min Budget" 
            value={form.projectScope.budget.estimatedMin} 
            onChange={v=> update('projectScope.budget.estimatedMin', Number(v))} 
            type="number" 
          />
          <Field 
            label="Max Budget" 
            value={form.projectScope.budget.estimatedMax} 
            onChange={v=> update('projectScope.budget.estimatedMax', Number(v))} 
            type="number" 
          />
        </Section>
      )}
      {step===3 && (
        <Section title="Timeline & Deadlines">
          <Field label="RFQ Issue Date" value={form.deadlines.rfqIssueDate?.split('T')[0]} onChange={v=> update('deadlines.rfqIssueDate', v+'T12:00:00Z')} type="date" />
          <Field label="Questions Deadline" value={form.deadlines.questionsDeadline?.split('T')[0]} onChange={v=> update('deadlines.questionsDeadline', v+'T12:00:00Z')} type="date" />
          <Field label="Bid Submission Deadline" value={form.deadlines.bidSubmissionDeadline?.split('T')[0]} onChange={v=> update('deadlines.bidSubmissionDeadline', v+'T12:00:00Z')} type="date" />
          <Field label="Project Start Date" value={form.deadlines.projectStartDate?.split('T')[0]} onChange={v=> update('deadlines.projectStartDate', v+'T12:00:00Z')} type="date" />
          <Field label="Project End Date" value={form.deadlines.projectEndDate?.split('T')[0]} onChange={v=> update('deadlines.projectEndDate', v+'T12:00:00Z')} type="date" />
        </Section>
      )}
      {step===4 && (
        <Section title="Evaluation Criteria">
          <div style={{ marginBottom: 16 }}>
            <h4>Evaluation Criteria (Total Weight: {form.evaluationCriteria.reduce((sum, c) => sum + c.weight, 0)}%)</h4>
            {form.evaluationCriteria.map((criterion, i) => (
              <div key={i} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8, borderRadius: 4 }}>
                <Field label="Name" value={criterion.name} onChange={v=> update(`evaluationCriteria.${i}.name`, v)} />
                <Field label="Weight (%)" value={criterion.weight} onChange={v=> update(`evaluationCriteria.${i}.weight`, Number(v))} type="number" />
                <Field label="Description" value={criterion.description} onChange={v=> update(`evaluationCriteria.${i}.description`, v)} />
              </div>
            ))}
          </div>
        </Section>
      )}
      {step===5 && (
        <Section title="Bid Requirements">
          <Field label="Min Years in Business" value={form.bidRequirements.experienceRequirements.minYearsInBusiness} onChange={v=> update('bidRequirements.experienceRequirements.minYearsInBusiness', Number(v))} type="number" />
          <Field label="Min Similar Projects" value={form.bidRequirements.experienceRequirements.similarProjectsMin} onChange={v=> update('bidRequirements.experienceRequirements.similarProjectsMin', Number(v))} type="number" />
          <Field label="Min Turnover" value={form.bidRequirements.financialRequirements.minTurnover} onChange={v=> update('bidRequirements.financialRequirements.minTurnover', Number(v))} type="number" />
          <Field label="Min Net Worth" value={form.bidRequirements.financialRequirements.minNetWorth} onChange={v=> update('bidRequirements.financialRequirements.minNetWorth', Number(v))} type="number" />
        </Section>
      )}

      <div style={{ display:'flex', gap:8, marginTop:12 }}>
        <button disabled={step===1} onClick={()=> setStep(s=> Math.max(1, s-1))}>Back</button>
        <button disabled={step===5} onClick={()=> setStep(s=> Math.min(5, s+1))}>Next</button>
        {step===5 && <button onClick={createRFQ} style={{ marginLeft:'auto' }}>Create Enhanced RFQ</button>}
      </div>

      <div style={{ marginTop:16 }}>
        <h4>Preview</h4>
        <pre style={{ background:'#0b1020', color:'#a7f3d0', padding:12, borderRadius:8 }}>{JSON.stringify(preview, null, 2)}</pre>
      </div>
    </div>
  )
}

function Stepper({ step, setStep }){
  const steps = ['Basics', 'Scope', 'Timeline', 'Criteria', 'Requirements'];
  return (
    <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:12, flexWrap: 'wrap' }}>
      {[1,2,3,4,5].map(n=> (
        <button key={n} onClick={()=> setStep(n)} style={{ padding:'8px 12px', borderRadius:20, border:'1px solid #cbd5e1', background: step===n ? '#2563EB' : '#fff', color: step===n ? '#fff' : '#1e293b', fontSize: '12px' }}>
          {n}. {steps[n-1]}
        </button>
      ))}
    </div>
  )
}

function Section({ title, children }){
  return (
    <div style={{ border:'1px solid #e5e7eb', borderRadius:12, padding:14, marginTop:8 }}>
      <h4 style={{ marginTop:0 }}>{title}</h4>
      <div style={{ display:'grid', gap:10 }}>{children}</div>
    </div>
  )
}

function Field({ label, value, onChange, type, suggestions }){
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = React.useState([]);
  
  React.useEffect(() => {
    if (suggestions && value) {
      const filtered = suggestions.filter(s => 
        s.toLowerCase().includes(value.toLowerCase()) && s.toLowerCase() !== value.toLowerCase()
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(suggestions || []);
    }
  }, [value, suggestions]);

  const handleInputChange = (newValue) => {
    onChange(newValue);
    setShowSuggestions(!!suggestions && newValue.length > 0);
  };

  const selectSuggestion = (suggestion) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <label style={{ display:'grid', gap:6, position: 'relative' }}>
      <span style={{ color:'#374151', fontSize:12 }}>{label}</span>
      {type==='textarea' ? (
        <textarea 
          value={value} 
          onChange={e=> onChange(e.target.value)} 
          style={{ padding:10, border:'1px solid #cbd5e1', borderRadius:8, minHeight:80 }} 
        />
      ) : (
        <>
          <input 
            type={type || 'text'}
            value={value} 
            onChange={e=> handleInputChange(e.target.value)}
            onFocus={() => suggestions && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            style={{ padding:10, border:'1px solid #cbd5e1', borderRadius:8 }} 
          />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              zIndex: 10,
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {filteredSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => selectSuggestion(suggestion)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderBottom: index < filteredSuggestions.length - 1 ? '1px solid #f3f4f6' : 'none',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </label>
  )
}

function ArrayField({ label, value, onChange, suggestions = [] }) {
  const [inputValue, setInputValue] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  
  const addItem = () => {
    if (inputValue.trim()) {
      onChange([...value, inputValue.trim()]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };
  
  const removeItem = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const selectSuggestion = (suggestion) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
  };

  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(inputValue.toLowerCase()) && 
    !value.includes(s) && 
    s.toLowerCase() !== inputValue.toLowerCase()
  );
  
  return (
    <div style={{ marginBottom: 16, position: 'relative' }}>
      <label style={{ display: 'block', marginBottom: 4, color:'#374151', fontSize:12 }}>{label}</label>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => setShowSuggestions(inputValue.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder={`Add ${label.toLowerCase()}`}
            style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 8 }}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
          />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              zIndex: 10,
              maxHeight: '150px',
              overflowY: 'auto'
            }}>
              {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => selectSuggestion(suggestion)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderBottom: index < Math.min(filteredSuggestions.length, 5) - 1 ? '1px solid #f3f4f6' : 'none',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <button onClick={addItem} style={{ padding: '10px 16px', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: 8 }}>
          Add
        </button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {value.map((item, index) => (
          <div key={index} style={{ 
            backgroundColor: '#f3f4f6', 
            padding: '6px 10px', 
            borderRadius: 6, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 6,
            fontSize: 14
          }}>
            <span>{item}</span>
            <button 
              onClick={() => removeItem(index)}
              style={{ 
                backgroundColor: 'transparent', 
                border: 'none', 
                color: '#ef4444', 
                cursor: 'pointer',
                fontSize: '16px',
                lineHeight: 1
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
