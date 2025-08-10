import React from 'react'

const WORKFLOW_STAGES = [
  {
    id: 'DRAFT',
    name: 'Draft Creation',
    description: 'RFQ drafted in system',
    icon: '📝',
    color: '#f59e0b',
    bgColor: '#fffbeb',
    borderColor: '#fed7aa'
  },
  {
    id: 'BLOCKCHAIN_CREATED',
    name: 'Blockchain Record',
    description: 'Created on Hyperledger Fabric',
    icon: '⛓️',
    color: '#3b82f6',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe'
  },
  {
    id: 'PUBLISHED',
    name: 'Published',
    description: 'Open for bidding',
    icon: '📢',
    color: '#10b981',
    bgColor: '#f0fdf4',
    borderColor: '#dcfce7'
  },
  {
    id: 'BIDDING_OPEN',
    name: 'Bidding Active',
    description: 'Receiving bids on chain',
    icon: '💼',
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
    borderColor: '#e9d5ff'
  },
  {
    id: 'EVALUATION',
    name: 'Evaluation',
    description: 'Smart contract evaluation',
    icon: '🔍',
    color: '#f97316',
    bgColor: '#fff7ed',
    borderColor: '#fed7aa'
  },
  {
    id: 'AWARDED',
    name: 'Contract Awarded',
    description: 'Winner selected on blockchain',
    icon: '🏆',
    color: '#dc2626',
    bgColor: '#fef2f2',
    borderColor: '#fecaca'
  },
  {
    id: 'EXECUTION',
    name: 'Project Execution',
    description: 'Milestone tracking active',
    icon: '🚧',
    color: '#059669',
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0'
  },
  {
    id: 'COMPLETED',
    name: 'Completed',
    description: 'Final settlement on chain',
    icon: '✅',
    color: '#065f46',
    bgColor: '#ecfdf5',
    borderColor: '#6ee7b7'
  }
];

export default function BlockchainWorkflow({ currentStage, rfqId, showDetails = true }) {
  const currentIndex = WORKFLOW_STAGES.findIndex(stage => stage.id === currentStage);
  
  const getStageStatus = (index) => {
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'current';
    return 'pending';
  };

  const getBlockchainInfo = (stage) => {
    const mockTxIds = {
      'DRAFT': null,
      'BLOCKCHAIN_CREATED': '0xa7b3c8d9e4f2',
      'PUBLISHED': '0x1e2f3d4c5b6a',
      'BIDDING_OPEN': '0x9f8e7d6c5b4a',
      'EVALUATION': '0x5d4c3b2a1f0e',
      'AWARDED': '0x2a1b3c4d5e6f',
      'EXECUTION': '0x7e8f9a0b1c2d',
      'COMPLETED': '0x4f5e6d7c8b9a'
    };
    
    return {
      txId: mockTxIds[stage],
      blockHeight: stage === 'DRAFT' ? null : Math.floor(Math.random() * 50000) + 100000,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  };

  return (
    <div style={{ 
      backgroundColor: 'white', 
      border: '1px solid #e5e7eb', 
      borderRadius: 12, 
      padding: showDetails ? 20 : 16,
      marginBottom: 16 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: showDetails ? 20 : 16 }}>
        <div style={{ 
          width: 40, 
          height: 40, 
          backgroundColor: '#f3f4f6', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '18px'
        }}>
          ⛓️
        </div>
        <div>
          <h4 style={{ margin: 0, color: '#111827' }}>
            Blockchain Workflow {rfqId && `- ${rfqId}`}
          </h4>
          <p style={{ margin: '2px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
            Hyperledger Fabric Tender Management Chain
          </p>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        {/* Progress Line */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          height: '2px',
          backgroundColor: '#e5e7eb',
          zIndex: 1
        }}>
          <div style={{
            height: '100%',
            backgroundColor: '#10b981',
            width: `${(currentIndex / (WORKFLOW_STAGES.length - 1)) * 100}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Workflow Steps */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 2
        }}>
          {WORKFLOW_STAGES.map((stage, index) => {
            const status = getStageStatus(index);
            const info = getBlockchainInfo(stage.id);
            
            return (
              <div key={stage.id} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                flex: 1,
                maxWidth: showDetails ? '140px' : '100px'
              }}>
                {/* Stage Icon */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: status === 'completed' ? '#10b981' : 
                                 status === 'current' ? stage.color : '#f3f4f6',
                  border: `2px solid ${status === 'completed' ? '#10b981' : 
                                     status === 'current' ? stage.color : '#e5e7eb'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  color: status === 'pending' ? '#9ca3af' : 'white',
                  transition: 'all 0.3s ease',
                  marginBottom: '8px'
                }}>
                  {status === 'completed' ? '✓' : stage.icon}
                </div>

                {/* Stage Info */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: showDetails ? '12px' : '10px', 
                    fontWeight: '600',
                    color: status === 'current' ? stage.color : 
                           status === 'completed' ? '#10b981' : '#9ca3af',
                    marginBottom: '2px'
                  }}>
                    {stage.name}
                  </div>
                  
                  {showDetails && (
                    <>
                      <div style={{ 
                        fontSize: '10px', 
                        color: '#6b7280',
                        marginBottom: '4px',
                        lineHeight: 1.2
                      }}>
                        {stage.description}
                      </div>
                      
                      {info.txId && (status === 'completed' || status === 'current') && (
                        <div style={{ 
                          fontSize: '9px', 
                          color: '#9ca3af',
                          fontFamily: 'monospace',
                          backgroundColor: '#f9fafb',
                          padding: '2px 4px',
                          borderRadius: '3px',
                          border: '1px solid #f3f4f6'
                        }}>
                          {info.txId}
                        </div>
                      )}
                      
                      {info.blockHeight && (status === 'completed' || status === 'current') && (
                        <div style={{ 
                          fontSize: '9px', 
                          color: '#9ca3af',
                          marginTop: '2px'
                        }}>
                          Block #{info.blockHeight}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showDetails && currentStage && (
        <div style={{ 
          marginTop: 16, 
          padding: 12, 
          backgroundColor: '#f9fafb', 
          borderRadius: 8,
          border: '1px solid #f3f4f6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: '16px' }}>📊</span>
            <strong style={{ fontSize: '14px', color: '#111827' }}>Current Status Details</strong>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, fontSize: '12px' }}>
            <div>
              <strong>Network:</strong> test-network<br/>
              <strong>Channel:</strong> mychannel<br/>
              <strong>Chaincode:</strong> tendercc v1.0
            </div>
            <div>
              <strong>Organizations:</strong> Org1MSP, Org2MSP<br/>
              <strong>Consensus:</strong> Raft Ordering<br/>
              <strong>State DB:</strong> CouchDB
            </div>
            <div>
              <strong>Private Data:</strong> Enabled<br/>
              <strong>Smart Contracts:</strong> Active<br/>
              <strong>Last Updated:</strong> {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
