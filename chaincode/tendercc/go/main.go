package main

import (
    "crypto/sha256"
    "encoding/hex"
    "encoding/json"
    "fmt"
    "math"
    "time"

    "google.golang.org/protobuf/types/known/timestamppb"
    "github.com/hyperledger/fabric-contract-api-go/contractapi"
)

const (
    privateCollectionName        = "bidsCollection"
    milestonePrivateCollection   = "milestonesCollection"
)

type SmartContract struct {
    contractapi.Contract
}

// EnhancedSmartContract with comprehensive RFQ support
type EnhancedSmartContract struct {
    contractapi.Contract
}

// Enhanced Tender structure with comprehensive RFQ requirements
type EnhancedTender struct {
	ID                 string              `json:"id"`
	ProjectScope       ProjectScope        `json:"projectScope"`
	Deadlines          TenderDeadlines     `json:"deadlines"`
	EvaluationCriteria []EvalCriterion     `json:"evaluationCriteria"`
	BidRequirements    BidRequirements     `json:"bidRequirements"`
	ContractTerms      ContractTerms       `json:"contractTerms"`
	ComplianceReqs     []ComplianceReq     `json:"complianceRequirements"`
	OwnerDetails       OwnerInfo           `json:"ownerDetails"`
	Status             string              `json:"status"` // DRAFT, OPEN, CLOSED, AWARDED, CANCELLED
	AwardedBidID       string              `json:"awardedBidId,omitempty"`
	CreatedAt          string              `json:"createdAt"`
	UpdatedAt          string              `json:"updatedAt"`
	Version            int                 `json:"version"`
	DocumentHashes     map[string]string   `json:"documentHashes,omitempty"`
    RetentionReleased  bool                `json:"retentionReleased,omitempty"`
    RetentionReleasedAt string             `json:"retentionReleasedAt,omitempty"`
}

// Comprehensive project scope definition
type ProjectScope struct {
	Description             string   `json:"description"`
	Objectives              []string `json:"objectives"`
	Deliverables            []string `json:"deliverables"`
	TechnicalSpecs          []string `json:"technicalSpecs"`
	QualityStandards        []string `json:"qualityStandards"`
	GeographicalConstraints string   `json:"geographicalConstraints,omitempty"`
	OperationalConstraints  []string `json:"operationalConstraints,omitempty"`
	Assumptions             []string `json:"assumptions,omitempty"`
	Exclusions              []string `json:"exclusions,omitempty"`
	Budget                  Budget   `json:"budget,omitempty"`
}

// Budget information
type Budget struct {
	Currency         string  `json:"currency"`
	EstimatedMin     float64 `json:"estimatedMin,omitempty"`
	EstimatedMax     float64 `json:"estimatedMax,omitempty"`
	PaymentTerms     string  `json:"paymentTerms"`
	PaymentSchedule  []PaymentMilestone `json:"paymentSchedule,omitempty"`
}

type PaymentMilestone struct {
	Name        string  `json:"name"`
	Percentage  float64 `json:"percentage"`
	Description string  `json:"description"`
}

// Comprehensive deadline management
type TenderDeadlines struct {
	RFQIssueDate          string `json:"rfqIssueDate"`          // When RFQ was published
	QuestionsDeadline     string `json:"questionsDeadline"`     // Last date for clarification questions
	BidSubmissionDeadline string `json:"bidSubmissionDeadline"` // Final bid submission deadline
	ProjectStartDate      string `json:"projectStartDate"`      // Expected project start
	ProjectEndDate        string `json:"projectEndDate"`        // Expected project completion
	MilestoneDeadlines    []MilestoneDeadline `json:"milestoneDeadlines,omitempty"`
}

type MilestoneDeadline struct {
	Name        string `json:"name"`
	Deadline    string `json:"deadline"`
	Description string `json:"description"`
	Critical    bool   `json:"critical"` // If missing this affects overall timeline
}

// Structured evaluation criteria with weights
type EvalCriterion struct {
	ID                  string  `json:"id"`
	Name                string  `json:"name"`
	Weight              float64 `json:"weight"`              // Percentage weight (total should be 100)
	Type                string  `json:"type"`                // QUANTITATIVE, QUALITATIVE, PASS_FAIL
	Description         string  `json:"description"`
	ScoringMethod       string  `json:"scoringMethod"`       // LOWEST_PRICE, HIGHEST_SCORE, WEIGHTED_AVERAGE
	PassFailThreshold   float64 `json:"passFailThreshold,omitempty"`
	SubCriteria         []SubCriterion `json:"subCriteria,omitempty"`
	MandatoryRequirement bool   `json:"mandatoryRequirement"`
}

type SubCriterion struct {
	Name        string  `json:"name"`
	Weight      float64 `json:"weight"`
	Description string  `json:"description"`
}

// Comprehensive bid requirements
type BidRequirements struct {
	RequiredDocuments    []DocumentReq       `json:"requiredDocuments"`
	TechnicalRequirements []TechnicalReq     `json:"technicalRequirements"`
	FinancialRequirements FinancialReq       `json:"financialRequirements"`
	ExperienceRequirements ExperienceReq     `json:"experienceRequirements"`
	CertificationRequirements []CertificationReq `json:"certificationRequirements"`
	BidSecurity          BidSecurity         `json:"bidSecurity,omitempty"`
	SubmissionFormat     SubmissionFormat    `json:"submissionFormat"`
}

type DocumentReq struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Mandatory   bool   `json:"mandatory"`
	Format      string `json:"format"` // PDF, DOC, etc.
	MaxSizeMB   int    `json:"maxSizeMB,omitempty"`
}

type TechnicalReq struct {
	Category    string   `json:"category"`
	Description string   `json:"description"`
	Standards   []string `json:"standards,omitempty"`
	Mandatory   bool     `json:"mandatory"`
}

type FinancialReq struct {
	MinTurnover          float64 `json:"minTurnover,omitempty"`
	MinNetWorth          float64 `json:"minNetWorth,omitempty"`
	CreditRating         string  `json:"creditRating,omitempty"`
	AuditedFinancials    bool    `json:"auditedFinancials"`
	YearsOfFinancials    int     `json:"yearsOfFinancials"`
	Currency             string  `json:"currency"`
}

type ExperienceReq struct {
	MinYearsInBusiness   int              `json:"minYearsInBusiness"`
	SimilarProjectsMin   int              `json:"similarProjectsMin"`
	MinProjectValue      float64          `json:"minProjectValue,omitempty"`
	RelevantSectors      []string         `json:"relevantSectors,omitempty"`
	GeographicalExp      []string         `json:"geographicalExp,omitempty"`
	KeyPersonnelReqs     []PersonnelReq   `json:"keyPersonnelReqs,omitempty"`
}

type PersonnelReq struct {
	Role            string   `json:"role"`
	MinExperience   int      `json:"minExperience"` // years
	RequiredSkills  []string `json:"requiredSkills"`
	CertificationsRequired []string `json:"certificationsRequired,omitempty"`
}

type CertificationReq struct {
	Name        string `json:"name"`
	IssuingBody string `json:"issuingBody"`
	Mandatory   bool   `json:"mandatory"`
	ValidUntil  string `json:"validUntil,omitempty"`
}

type BidSecurity struct {
	Required    bool    `json:"required"`
	Type        string  `json:"type"`        // BANK_GUARANTEE, CASH, BOND
	Amount      float64 `json:"amount"`
	Percentage  float64 `json:"percentage"`  // Alternative to fixed amount
	Currency    string  `json:"currency"`
	ValidityDays int    `json:"validityDays"`
}

type SubmissionFormat struct {
	Method          string   `json:"method"`          // ONLINE, PHYSICAL, HYBRID
	FileFormats     []string `json:"fileFormats"`     // PDF, DOC, XLS, etc.
	MaxFileSize     int      `json:"maxFileSize"`     // MB
	EncryptionReq   bool     `json:"encryptionReq"`
	DigitalSignature bool    `json:"digitalSignature"`
	Language        string   `json:"language"`
}

type ContractTerms struct {
	ContractType        string              `json:"contractType"`        // FIXED_PRICE, TIME_MATERIAL, etc.
	PaymentTerms        PaymentTermsDetail  `json:"paymentTerms"`
	PerformanceBond     PerformanceBond     `json:"performanceBond,omitempty"`
	Warranties          []Warranty          `json:"warranties,omitempty"`
	Penalties           []Penalty           `json:"penalties,omitempty"`
	IntellectualProperty IPTerms            `json:"intellectualProperty,omitempty"`
	DisputeResolution   DisputeResolution   `json:"disputeResolution"`
	Termination         TerminationClause   `json:"termination"`
	Confidentiality     ConfidentialityTerms `json:"confidentiality,omitempty"`
}

type PaymentTermsDetail struct {
	AdvancePayment      float64 `json:"advancePayment,omitempty"`      // Percentage
	PaymentCycle        string  `json:"paymentCycle"`                  // MONTHLY, MILESTONE_BASED, etc.
	PaymentDays         int     `json:"paymentDays"`                   // Days after invoice
	RetentionPercentage float64 `json:"retentionPercentage,omitempty"`
	RetentionPeriod     int     `json:"retentionPeriod,omitempty"`     // Months
	Currency            string  `json:"currency"`
}

type PerformanceBond struct {
	Required     bool    `json:"required"`
	Percentage   float64 `json:"percentage"`
	ValidityDays int     `json:"validityDays"`
	Type         string  `json:"type"` // BANK_GUARANTEE, INSURANCE, CASH
}

type Warranty struct {
	Type        string `json:"type"`        // DEFECTS, PERFORMANCE, etc.
	Period      int    `json:"period"`      // Months
	Description string `json:"description"`
	Coverage    string `json:"coverage"`    // FULL, PARTIAL, SPECIFIC
}

type Penalty struct {
	Type        string  `json:"type"`        // DELAY, PERFORMANCE, QUALITY
	Amount      float64 `json:"amount,omitempty"`
	Percentage  float64 `json:"percentage,omitempty"`
	Cap         float64 `json:"cap,omitempty"` // Maximum penalty amount
	Description string  `json:"description"`
}

type IPTerms struct {
	OwnershipOfWork      string `json:"ownershipOfWork"`      // CLIENT, CONTRACTOR, SHARED
	ExistingIPHandling   string `json:"existingIPHandling"`   // LICENSE, OWNERSHIP, etc.
	NewIPOwnership       string `json:"newIPOwnership"`
	LicenseTerms         string `json:"licenseTerms,omitempty"`
}

type DisputeResolution struct {
	Method      string `json:"method"`      // ARBITRATION, LITIGATION, MEDIATION
	Jurisdiction string `json:"jurisdiction"`
	GoverningLaw string `json:"governingLaw"`
	Venue       string `json:"venue,omitempty"`
}

type TerminationClause struct {
	TerminationForCause     bool   `json:"terminationForCause"`
	TerminationForConvenience bool `json:"terminationForConvenience"`
	NoticePeriod            int    `json:"noticePeriod"` // Days
	TerminationPenalty      float64 `json:"terminationPenalty,omitempty"`
}

type ConfidentialityTerms struct {
	Required        bool   `json:"required"`
	Duration        int    `json:"duration"` // Years
	Scope           string `json:"scope"`
	Exceptions      []string `json:"exceptions,omitempty"`
}

type ComplianceReq struct {
	Type        string   `json:"type"`        // ENVIRONMENTAL, SAFETY, LABOR, etc.
	Standard    string   `json:"standard"`    // ISO14001, OHSAS18001, etc.
	Description string   `json:"description"`
	Mandatory   bool     `json:"mandatory"`
	Evidence    []string `json:"evidence"`    // Required proof documents
	Auditable   bool     `json:"auditable"`
}

type OwnerInfo struct {
	OrganizationName string        `json:"organizationName"`
	LegalEntity      string        `json:"legalEntity"`
	Address          Address       `json:"address"`
	ContactPerson    ContactPerson `json:"contactPerson"`
	AlternateContacts []ContactPerson `json:"alternateContacts,omitempty"`
	AuthorizedBy     AuthorizedPerson `json:"authorizedBy"`
	TaxInfo          TaxInfo       `json:"taxInfo,omitempty"`
}

type Address struct {
	Street     string `json:"street"`
	City       string `json:"city"`
	State      string `json:"state,omitempty"`
	Country    string `json:"country"`
	PostalCode string `json:"postalCode"`
}

type ContactPerson struct {
	Name        string `json:"name"`
	Title       string `json:"title"`
	Email       string `json:"email"`
	Phone       string `json:"phone"`
	Mobile      string `json:"mobile,omitempty"`
	Department  string `json:"department,omitempty"`
}

type AuthorizedPerson struct {
	Name           string `json:"name"`
	Title          string `json:"title"`
	SignatureHash  string `json:"signatureHash,omitempty"`
	AuthorityLevel string `json:"authorityLevel"`
	Date           string `json:"date"`
}

type TaxInfo struct {
	TaxID       string `json:"taxId"`
	VATNumber   string `json:"vatNumber,omitempty"`
	TaxStatus   string `json:"taxStatus"`
}

type EnhancedBidPrivate struct {
	TenderID         string                 `json:"tenderId"`
	BidID            string                 `json:"bidId"`
	ContractorID     string                 `json:"contractorId"`
	TotalAmount      float64                `json:"totalAmount"`
	Currency         string                 `json:"currency"`
	TechnicalProposal TechnicalProposal     `json:"technicalProposal"`
	FinancialProposal FinancialProposal     `json:"financialProposal"`
	ComplianceChecklist map[string]bool     `json:"complianceChecklist"`
	DocumentHashes   map[string]string      `json:"documentHashes"`
	SubmittedAt      string                 `json:"submittedAt"`
	ValidUntil       string                 `json:"validUntil"`
}

type TechnicalProposal struct {
	Methodology      string            `json:"methodology"`
	Timeline         ProjectTimeline   `json:"timeline"`
	TeamComposition  []TeamMember      `json:"teamComposition"`
	Resources        []Resource        `json:"resources"`
	QualityAssurance QAProcess         `json:"qualityAssurance"`
	RiskMitigation   []RiskMitigation  `json:"riskMitigation"`
	Innovation       []Innovation      `json:"innovation,omitempty"`
}

type ProjectTimeline struct {
	StartDate    string      `json:"startDate"`
	EndDate      string      `json:"endDate"`
	Phases       []Phase     `json:"phases"`
	CriticalPath []string    `json:"criticalPath"`
}

type Phase struct {
	Name        string `json:"name"`
	StartDate   string `json:"startDate"`
	EndDate     string `json:"endDate"`
	Deliverables []string `json:"deliverables"`
	Dependencies []string `json:"dependencies,omitempty"`
}

type TeamMember struct {
	Name         string   `json:"name"`
	Role         string   `json:"role"`
	Experience   int      `json:"experience"` // years
	Skills       []string `json:"skills"`
	Certifications []string `json:"certifications,omitempty"`
	AllocationPercentage float64 `json:"allocationPercentage"`
}

type Resource struct {
	Type        string  `json:"type"`        // EQUIPMENT, SOFTWARE, FACILITY
	Name        string  `json:"name"`
	Quantity    int     `json:"quantity"`
	Duration    int     `json:"duration"`    // days
	Cost        float64 `json:"cost,omitempty"`
}

type QAProcess struct {
	Standards    []string `json:"standards"`
	Procedures   []string `json:"procedures"`
	TestingPlan  string   `json:"testingPlan"`
	Documentation string  `json:"documentation"`
}

type RiskMitigation struct {
	Risk        string `json:"risk"`
	Probability string `json:"probability"` // LOW, MEDIUM, HIGH
	Impact      string `json:"impact"`      // LOW, MEDIUM, HIGH
	Mitigation  string `json:"mitigation"`
	Contingency string `json:"contingency,omitempty"`
}

type Innovation struct {
	Description string   `json:"description"`
	Benefits    []string `json:"benefits"`
	Implementation string `json:"implementation"`
}

type FinancialProposal struct {
	BreakdownByPhase []PhaseCosting `json:"breakdownByPhase"`
	BreakdownByCategory []CategoryCosting `json:"breakdownByCategory"`
	PaymentSchedule  []PaymentRequest `json:"paymentSchedule"`
	CostAssumptions  []string         `json:"costAssumptions,omitempty"`
	PriceValidity    int              `json:"priceValidity"` // days
}

type PhaseCosting struct {
	Phase  string  `json:"phase"`
	Cost   float64 `json:"cost"`
	Hours  int     `json:"hours,omitempty"`
}

type CategoryCosting struct {
	Category string  `json:"category"` // LABOR, MATERIAL, EQUIPMENT, etc.
	Cost     float64 `json:"cost"`
	Percentage float64 `json:"percentage"`
}

type PaymentRequest struct {
	Milestone   string  `json:"milestone"`
	Percentage  float64 `json:"percentage"`
	Amount      float64 `json:"amount"`
	Deliverables []string `json:"deliverables"`
}

// Legacy types for backward compatibility
type Tender struct {
    ID            string `json:"id"`
    Description   string `json:"description"`
    OpenAt        string `json:"openAt"`
    CloseAt       string `json:"closeAt"`
    Criteria      string `json:"criteria"`
    Status        string `json:"status"` // OPEN, CLOSED, AWARDED
    AwardedBidID  string `json:"awardedBidId,omitempty"`
}

type BidRef struct {
    TenderID     string `json:"tenderId"`
    BidID        string `json:"bidId"`
    ContractorID string `json:"contractorId"`
    BidHash      string `json:"bidHash"` // hash of private bid JSON
}

type BidPrivate struct {
    TenderID     string  `json:"tenderId"`
    BidID        string  `json:"bidId"`
    ContractorID string  `json:"contractorId"`
    Amount       float64 `json:"amount"`
    DocsHash     string  `json:"docsHash"`
}

// Evaluation holds an off-chain computed score recorded on-chain
type Evaluation struct {
    TenderID string  `json:"tenderId"`
    BidID    string  `json:"bidId"`
    Score    float64 `json:"score"`
    Notes    string  `json:"notes,omitempty"`
}

// MilestoneRef is the public reference/metadata of a milestone submission
type MilestoneRef struct {
    TenderID      string `json:"tenderId"`
    MilestoneID   string `json:"milestoneId"`
    Title         string `json:"title"`
    EvidenceHash  string `json:"evidenceHash"`
    Status        string `json:"status"` // SUBMITTED, APPROVED, REJECTED
    PaymentReleased bool   `json:"paymentReleased"`
}

// MilestonePrivate is the confidential payload
type MilestonePrivate struct {
    TenderID     string  `json:"tenderId"`
    MilestoneID  string  `json:"milestoneId"`
    Title        string  `json:"title"`
    EvidenceHash string  `json:"evidenceHash"`
    Amount       float64 `json:"amount"`
    Details      string  `json:"details"`
    PaidAmount   float64 `json:"paidAmount,omitempty"`
}

func tenderKey(tenderID string) string {
    return fmt.Sprintf("TENDER_%s", tenderID)
}

func bidRefKey(tenderID, bidID string) string {
    return fmt.Sprintf("BIDREF_%s_%s", tenderID, bidID)
}

func bidPrivKey(tenderID, bidID string) string {
    return fmt.Sprintf("BID_%s_%s", tenderID, bidID)
}

func evalKey(tenderID, bidID string) string {
    return fmt.Sprintf("EVAL_%s_%s", tenderID, bidID)
}

func milestoneRefKey(tenderID, milestoneID string) string {
    return fmt.Sprintf("MSREF_%s_%s", tenderID, milestoneID)
}

func milestonePrivKey(tenderID, milestoneID string) string {
    return fmt.Sprintf("MS_%s_%s", tenderID, milestoneID)
}

func parseRFC3339(ts string) (time.Time, error) {
    return time.Parse(time.RFC3339, ts)
}

func (s *SmartContract) CreateTender(ctx contractapi.TransactionContextInterface, tenderID, description, openAt, closeAt, criteria string) error {
    exists, err := s.assetExists(ctx, tenderKey(tenderID))
    if err != nil {
        return err
    }
    if exists {
        return fmt.Errorf("tender %s already exists", tenderID)
    }
    if openAt == "" || closeAt == "" {
        return fmt.Errorf("openAt and closeAt must be RFC3339 timestamps")
    }
    openT, err := parseRFC3339(openAt)
    if err != nil {
        return fmt.Errorf("invalid openAt: %v", err)
    }
    closeT, err := parseRFC3339(closeAt)
    if err != nil {
        return fmt.Errorf("invalid closeAt: %v", err)
    }
    if !closeT.After(openT) {
        return fmt.Errorf("closeAt must be after openAt")
    }
    t := Tender{
        ID:          tenderID,
        Description: description,
        OpenAt:      openAt,
        CloseAt:     closeAt,
        Criteria:    criteria,
        Status:      "OPEN",
    }
    bytes, _ := json.Marshal(t)
    if err := ctx.GetStub().PutState(tenderKey(tenderID), bytes); err != nil {
        return err
    }
    _ = ctx.GetStub().SetEvent("RFQCreated", bytes)
    return nil
}

func (s *SmartContract) GetTender(ctx contractapi.TransactionContextInterface, tenderID string) (*Tender, error) {
    data, err := ctx.GetStub().GetState(tenderKey(tenderID))
    if err != nil {
        return nil, err
    }
    if data == nil {
        return nil, fmt.Errorf("tender %s not found", tenderID)
    }
    var t Tender
    if err := json.Unmarshal(data, &t); err != nil {
        return nil, err
    }
    return &t, nil
}

func (s *SmartContract) SubmitBid(ctx contractapi.TransactionContextInterface, tenderID, bidID string) error {
    t, err := s.GetTender(ctx, tenderID)
    if err != nil {
        return err
    }
    if t.Status != "OPEN" {
        return fmt.Errorf("tender %s not open for bids", tenderID)
    }

    // enforce time window: tx timestamp must be within [openAt, closeAt]
    txTs, err := ctx.GetStub().GetTxTimestamp()
    if err == nil && txTs != nil {
        txTime := timestamppb.New(time.Unix(txTs.Seconds, int64(txTs.Nanos))).AsTime()
        openT, _ := parseRFC3339(t.OpenAt)
        closeT, _ := parseRFC3339(t.CloseAt)
        if txTime.Before(openT) || !txTime.Before(closeT) {
            return fmt.Errorf("submission window closed for tender %s", tenderID)
        }
    }

    transient, err := ctx.GetStub().GetTransient()
    if err != nil {
        return fmt.Errorf("failed to get transient: %v", err)
    }
    bidBytes, ok := transient["bid"]
    if !ok {
        return fmt.Errorf("transient map must contain 'bid'")
    }
    var bid BidPrivate
    if err := json.Unmarshal(bidBytes, &bid); err != nil {
        return fmt.Errorf("invalid bid json: %v", err)
    }
    if bid.TenderID != tenderID || bid.BidID != bidID {
        return fmt.Errorf("tenderId/bidId mismatch")
    }

    exists, err := s.assetExists(ctx, bidRefKey(tenderID, bidID))
    if err != nil {
        return err
    }
    if exists {
        return fmt.Errorf("bid %s already exists for tender %s", bidID, tenderID)
    }

    hash := sha256.Sum256(bidBytes)
    hashHex := hex.EncodeToString(hash[:])

    if err := ctx.GetStub().PutPrivateData(privateCollectionName, bidPrivKey(tenderID, bidID), bidBytes); err != nil {
        return fmt.Errorf("failed to put private bid: %v", err)
    }

    ref := BidRef{
        TenderID:     tenderID,
        BidID:        bidID,
        ContractorID: bid.ContractorID,
        BidHash:      hashHex,
    }
    refBytes, _ := json.Marshal(ref)
    if err := ctx.GetStub().PutState(bidRefKey(tenderID, bidID), refBytes); err != nil {
        return err
    }
    _ = ctx.GetStub().SetEvent("BidSubmitted", refBytes)
    return nil
}

func (s *SmartContract) ListBidsPublic(ctx contractapi.TransactionContextInterface, tenderID string) ([]*BidRef, error) {
    iter, err := ctx.GetStub().GetStateByRange("BIDREF_"+tenderID+"_", "BIDREF_"+tenderID+"_~")
    if err != nil {
        return nil, err
    }
    defer iter.Close()
    var out []*BidRef
    for iter.HasNext() {
        kv, err := iter.Next()
        if err != nil {
            return nil, err
        }
        var r BidRef
        if err := json.Unmarshal(kv.Value, &r); err == nil {
            out = append(out, &r)
        }
    }
    return out, nil
}

func (s *SmartContract) ReadBidPrivate(ctx contractapi.TransactionContextInterface, tenderID, bidID string) (*BidPrivate, error) {
    data, err := ctx.GetStub().GetPrivateData(privateCollectionName, bidPrivKey(tenderID, bidID))
    if err != nil {
        return nil, err
    }
    if data == nil {
        return nil, fmt.Errorf("private bid not found")
    }
    var b BidPrivate
    if err := json.Unmarshal(data, &b); err != nil {
        return nil, err
    }
    return &b, nil
}

func (s *SmartContract) AwardTender(ctx contractapi.TransactionContextInterface, tenderID, bidID string) error {
    t, err := s.GetTender(ctx, tenderID)
    if err != nil {
        return err
    }
    if t.Status == "AWARDED" {
        return fmt.Errorf("tender already awarded")
    }
    refData, err := ctx.GetStub().GetState(bidRefKey(tenderID, bidID))
    if err != nil {
        return err
    }
    if refData == nil {
        return fmt.Errorf("bid %s not found for tender %s", bidID, tenderID)
    }
    t.AwardedBidID = bidID
    t.Status = "AWARDED"
    bytes, _ := json.Marshal(t)
    if err := ctx.GetStub().PutState(tenderKey(tenderID), bytes); err != nil {
        return err
    }
    _ = ctx.GetStub().SetEvent("TenderAwarded", bytes)
    return nil
}

// CloseTender moves a tender from OPEN to CLOSED; no more bids accepted
func (s *SmartContract) CloseTender(ctx contractapi.TransactionContextInterface, tenderID string) error {
    t, err := s.GetTender(ctx, tenderID)
    if err != nil {
        return err
    }
    if t.Status != "OPEN" {
        return fmt.Errorf("tender %s not open", tenderID)
    }
    t.Status = "CLOSED"
    bytes, _ := json.Marshal(t)
    if err := ctx.GetStub().PutState(tenderKey(tenderID), bytes); err != nil {
        return err
    }
    _ = ctx.GetStub().SetEvent("BidWindowClosed", bytes)
    return nil
}

// RecordEvaluation stores an AI/off-chain computed score for a bid
func (s *SmartContract) RecordEvaluation(ctx contractapi.TransactionContextInterface, tenderID, bidID string, score float64, notes string) error {
    // ensure bid exists
    exists, err := s.assetExists(ctx, bidRefKey(tenderID, bidID))
    if err != nil {
        return err
    }
    if !exists {
        return fmt.Errorf("bid %s not found for tender %s", bidID, tenderID)
    }
    e := Evaluation{TenderID: tenderID, BidID: bidID, Score: score, Notes: notes}
    b, _ := json.Marshal(e)
    if err := ctx.GetStub().PutState(evalKey(tenderID, bidID), b); err != nil {
        return err
    }
    _ = ctx.GetStub().SetEvent("BidEvaluated", b)
    return nil
}

// ListEvaluations returns all evaluation scores for a tender
func (s *SmartContract) ListEvaluations(ctx contractapi.TransactionContextInterface, tenderID string) ([]*Evaluation, error) {
    iter, err := ctx.GetStub().GetStateByRange("EVAL_"+tenderID+"_", "EVAL_"+tenderID+"_~")
    if err != nil {
        return nil, err
    }
    defer iter.Close()
    var out []*Evaluation
    for iter.HasNext() {
        kv, err := iter.Next()
        if err != nil {
            return nil, err
        }
        var e Evaluation
        if err := json.Unmarshal(kv.Value, &e); err == nil {
            out = append(out, &e)
        }
    }
    return out, nil
}

// SubmitMilestone stores milestone private data and a public ref
func (s *SmartContract) SubmitMilestone(ctx contractapi.TransactionContextInterface, tenderID, milestoneID string) error {
    // ensure tender exists
    if _, err := s.GetTender(ctx, tenderID); err != nil {
        return err
    }

    transient, err := ctx.GetStub().GetTransient()
    if err != nil {
        return fmt.Errorf("failed to get transient: %v", err)
    }
    msBytes, ok := transient["milestone"]
    if !ok {
        return fmt.Errorf("transient map must contain 'milestone'")
    }
    var ms MilestonePrivate
    if err := json.Unmarshal(msBytes, &ms); err != nil {
        return fmt.Errorf("invalid milestone json: %v", err)
    }
    if ms.TenderID != tenderID || ms.MilestoneID != milestoneID {
        return fmt.Errorf("tenderId/milestoneId mismatch")
    }

    exists, err := s.assetExists(ctx, milestoneRefKey(tenderID, milestoneID))
    if err != nil {
        return err
    }
    if exists {
        return fmt.Errorf("milestone %s already exists for tender %s", milestoneID, tenderID)
    }

    // store private document
    if err := ctx.GetStub().PutPrivateData(milestonePrivateCollection, milestonePrivKey(tenderID, milestoneID), msBytes); err != nil {
        return fmt.Errorf("failed to put private milestone: %v", err)
    }

    ref := MilestoneRef{
        TenderID:     tenderID,
        MilestoneID:  milestoneID,
        Title:        ms.Title,
        EvidenceHash: ms.EvidenceHash,
        Status:       "SUBMITTED",
        PaymentReleased: false,
    }
    refBytes, _ := json.Marshal(ref)
    if err := ctx.GetStub().PutState(milestoneRefKey(tenderID, milestoneID), refBytes); err != nil {
        return err
    }
    _ = ctx.GetStub().SetEvent("MilestoneSubmitted", refBytes)
    return nil
}

func (s *SmartContract) ReadMilestonePrivate(ctx contractapi.TransactionContextInterface, tenderID, milestoneID string) (*MilestonePrivate, error) {
    data, err := ctx.GetStub().GetPrivateData(milestonePrivateCollection, milestonePrivKey(tenderID, milestoneID))
    if err != nil {
        return nil, err
    }
    if data == nil {
        return nil, fmt.Errorf("private milestone not found")
    }
    var m MilestonePrivate
    if err := json.Unmarshal(data, &m); err != nil {
        return nil, err
    }
    return &m, nil
}

func (s *SmartContract) ListMilestonesPublic(ctx contractapi.TransactionContextInterface, tenderID string) ([]*MilestoneRef, error) {
    iter, err := ctx.GetStub().GetStateByRange("MSREF_"+tenderID+"_", "MSREF_"+tenderID+"_~")
    if err != nil {
        return nil, err
    }
    defer iter.Close()
    var out []*MilestoneRef
    for iter.HasNext() {
        kv, err := iter.Next()
        if err != nil {
            return nil, err
        }
        var r MilestoneRef
        if err := json.Unmarshal(kv.Value, &r); err == nil {
            out = append(out, &r)
        }
    }
    return out, nil
}

// ApproveMilestone marks a milestone approved and releases payment flag
func (s *SmartContract) ApproveMilestone(ctx contractapi.TransactionContextInterface, tenderID, milestoneID string) error {
    data, err := ctx.GetStub().GetState(milestoneRefKey(tenderID, milestoneID))
    if err != nil {
        return err
    }
    if data == nil {
        return fmt.Errorf("milestone not found")
    }
    var ref MilestoneRef
    if err := json.Unmarshal(data, &ref); err != nil {
        return err
    }
    ref.Status = "APPROVED"
    ref.PaymentReleased = true
    out, _ := json.Marshal(ref)
    if err := ctx.GetStub().PutState(milestoneRefKey(tenderID, milestoneID), out); err != nil {
        return err
    }
    _ = ctx.GetStub().SetEvent("MilestoneApproved", out)
    _ = ctx.GetStub().SetEvent("PaymentReleased", out)
    return nil
}

func (s *SmartContract) assetExists(ctx contractapi.TransactionContextInterface, key string) (bool, error) {
    data, err := ctx.GetStub().GetState(key)
    if err != nil {
        return false, err
    }
    return data != nil, nil
}

// GetBidRef returns the public bid reference
func (s *SmartContract) GetBidRef(ctx contractapi.TransactionContextInterface, tenderID, bidID string) (*BidRef, error) {
    data, err := ctx.GetStub().GetState(bidRefKey(tenderID, bidID))
    if err != nil {
        return nil, err
    }
    if data == nil {
        return nil, fmt.Errorf("bid %s not found for tender %s", bidID, tenderID)
    }
    var r BidRef
    if err := json.Unmarshal(data, &r); err != nil {
        return nil, err
    }
    return &r, nil
}

// ListTenders returns all tenders
func (s *SmartContract) ListTenders(ctx contractapi.TransactionContextInterface) ([]*Tender, error) {
    iter, err := ctx.GetStub().GetStateByRange("TENDER_", "TENDER_~")
    if err != nil {
        return nil, err
    }
    defer iter.Close()
    var out []*Tender
    for iter.HasNext() {
        kv, err := iter.Next()
        if err != nil {
            return nil, err
        }
        var t Tender
        if err := json.Unmarshal(kv.Value, &t); err == nil {
            out = append(out, &t)
        }
    }
    return out, nil
}

// GetTenderHistory returns history of tender mutations
func (s *SmartContract) GetTenderHistory(ctx contractapi.TransactionContextInterface, tenderID string) ([]string, error) {
    iter, err := ctx.GetStub().GetHistoryForKey(tenderKey(tenderID))
    if err != nil {
        return nil, err
    }
    defer iter.Close()
    var out []string
    for iter.HasNext() {
        r, err := iter.Next()
        if err != nil {
            return nil, err
        }
        out = append(out, string(r.Value))
    }
    return out, nil
}

// RejectMilestone updates status to REJECTED
func (s *SmartContract) RejectMilestone(ctx contractapi.TransactionContextInterface, tenderID, milestoneID, reason string) error {
    data, err := ctx.GetStub().GetState(milestoneRefKey(tenderID, milestoneID))
    if err != nil {
        return err
    }
    if data == nil {
        return fmt.Errorf("milestone not found")
    }
    var ref MilestoneRef
    if err := json.Unmarshal(data, &ref); err != nil {
        return err
    }
    ref.Status = "REJECTED"
    // preserve PaymentReleased=false
    out, _ := json.Marshal(ref)
    if err := ctx.GetStub().PutState(milestoneRefKey(tenderID, milestoneID), out); err != nil {
        return err
    }
    _ = ctx.GetStub().SetEvent("MilestoneRejected", out)
    return nil
}

func (s *SmartContract) Init(ctx contractapi.TransactionContextInterface) error { return nil }

// Enhanced functions for comprehensive RFQ support

// assetExists checks if an asset exists on the ledger
func (s *EnhancedSmartContract) assetExists(ctx contractapi.TransactionContextInterface, key string) (bool, error) {
    asset, err := ctx.GetStub().GetState(key)
    if err != nil {
        return false, err
    }
    return asset != nil, nil
}

// ListBidsPublic retrieves public bid references for a tender
func (s *EnhancedSmartContract) ListBidsPublic(ctx contractapi.TransactionContextInterface, tenderID string) ([]*BidRef, error) {
    iter, err := ctx.GetStub().GetStateByRange("BIDREF_"+tenderID+"_", "BIDREF_"+tenderID+"_~")
    if err != nil {
        return nil, err
    }
    defer iter.Close()
    var out []*BidRef
    for iter.HasNext() {
        kv, err := iter.Next()
        if err != nil {
            return nil, err
        }
        var r BidRef
        if err := json.Unmarshal(kv.Value, &r); err == nil {
            out = append(out, &r)
        }
    }
    return out, nil
}

// ListEvaluations retrieves all evaluations for a tender
func (s *EnhancedSmartContract) ListEvaluations(ctx contractapi.TransactionContextInterface, tenderID string) ([]*Evaluation, error) {
    iter, err := ctx.GetStub().GetStateByRange("EVAL_"+tenderID+"_", "EVAL_"+tenderID+"_~")
    if err != nil {
        return nil, err
    }
    defer iter.Close()
    var out []*Evaluation
    for iter.HasNext() {
        kv, err := iter.Next()
        if err != nil {
            return nil, err
        }
        var eval Evaluation
        if err := json.Unmarshal(kv.Value, &eval); err == nil {
            out = append(out, &eval)
        }
    }
    return out, nil
}

// AwardTender awards a tender to a specific bid
func (s *EnhancedSmartContract) AwardTender(ctx contractapi.TransactionContextInterface, tenderID, bidID string) error {
    // Get the tender
    bytes, err := ctx.GetStub().GetState(tenderKey(tenderID))
    if err != nil {
        return err
    }
    if bytes == nil {
        return fmt.Errorf("tender %s not found", tenderID)
    }

    var tender EnhancedTender
    if err := json.Unmarshal(bytes, &tender); err != nil {
        return err
    }

    if tender.Status != "CLOSED" {
        return fmt.Errorf("tender must be closed before awarding")
    }

    // Verify the bid exists
    bidExists, err := s.assetExists(ctx, bidRefKey(tenderID, bidID))
    if err != nil {
        return err
    }
    if !bidExists {
        return fmt.Errorf("bid %s not found for tender %s", bidID, tenderID)
    }

    // Update tender status and award
    txTime, err := s.getTxTime(ctx)
    if err != nil {
        return err
    }
    tender.Status = "AWARDED"
    tender.AwardedBidID = bidID
    tender.UpdatedAt = txTime.Format(time.RFC3339)

    // Store updated tender
    updatedBytes, _ := json.Marshal(tender)
    if err := ctx.GetStub().PutState(tenderKey(tenderID), updatedBytes); err != nil {
        return err
    }

    // Emit event
    eventData := map[string]interface{}{
        "tenderId": tenderID,
        "bidId":    bidID,
        "status":   "AWARDED",
        "awardedAt": tender.UpdatedAt,
    }
    eventBytes, _ := json.Marshal(eventData)
    _ = ctx.GetStub().SetEvent("TenderAwarded", eventBytes)

    return nil
}

// getTxTime returns the transaction timestamp for deterministic operations across peers
func (s *EnhancedSmartContract) getTxTime(ctx contractapi.TransactionContextInterface) (time.Time, error) {
    ts, err := ctx.GetStub().GetTxTimestamp()
    if err != nil || ts == nil {
        return time.Time{}, fmt.Errorf("failed to get tx timestamp: %v", err)
    }
    return time.Unix(ts.Seconds, int64(ts.Nanos)).UTC(), nil
}

// CreateEnhancedTender creates a comprehensive RFQ with all required fields
func (s *EnhancedSmartContract) CreateEnhancedTender(ctx contractapi.TransactionContextInterface, tenderJSON string) error {
	var tender EnhancedTender
	if err := json.Unmarshal([]byte(tenderJSON), &tender); err != nil {
		return fmt.Errorf("invalid tender JSON: %v", err)
	}

	// Validate required fields
	if err := s.validateEnhancedTender(&tender); err != nil {
		return fmt.Errorf("tender validation failed: %v", err)
	}

	// Check if tender already exists
    exists, err := s.assetExists(ctx, tenderKey(tender.ID))
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("tender %s already exists", tender.ID)
	}

    // Set system fields (deterministic tx time)
    txTime, err := s.getTxTime(ctx)
    if err != nil {
        return err
    }
    now := txTime.Format(time.RFC3339)
	tender.CreatedAt = now
	tender.UpdatedAt = now
	tender.Version = 1
	if tender.Status == "" {
		tender.Status = "DRAFT"
	}

	// Store tender
	bytes, _ := json.Marshal(tender)
	if err := ctx.GetStub().PutState(tenderKey(tender.ID), bytes); err != nil {
		return err
	}

	// Emit event
	eventData := map[string]interface{}{
		"tenderId":    tender.ID,
		"status":      tender.Status,
		"createdAt":   tender.CreatedAt,
		"owner":       tender.OwnerDetails.OrganizationName,
		"description": tender.ProjectScope.Description,
	}
	eventBytes, _ := json.Marshal(eventData)
	_ = ctx.GetStub().SetEvent("EnhancedRFQCreated", eventBytes)

	return nil
}

// validateEnhancedTender performs comprehensive validation
func (s *EnhancedSmartContract) validateEnhancedTender(tender *EnhancedTender) error {
	if tender.ID == "" {
		return fmt.Errorf("tender ID is required")
	}
	if tender.ProjectScope.Description == "" {
		return fmt.Errorf("project description is required")
	}
	if tender.Deadlines.BidSubmissionDeadline == "" {
		return fmt.Errorf("bid submission deadline is required")
	}
	if tender.OwnerDetails.OrganizationName == "" {
		return fmt.Errorf("owner organization name is required")
	}

	// Validate deadlines
	if err := s.validateDeadlines(&tender.Deadlines); err != nil {
		return fmt.Errorf("deadline validation failed: %v", err)
	}

	// Validate evaluation criteria
	if err := s.validateEvaluationCriteria(tender.EvaluationCriteria); err != nil {
		return fmt.Errorf("evaluation criteria validation failed: %v", err)
	}

	return nil
}

func (s *EnhancedSmartContract) validateDeadlines(deadlines *TenderDeadlines) error {
	// Validate bid submission deadline
	if deadlines.BidSubmissionDeadline != "" {
		if _, err := time.Parse(time.RFC3339, deadlines.BidSubmissionDeadline); err != nil {
			return fmt.Errorf("invalid bid submission deadline format: %v", err)
		}
	}

	// Validate project dates
	if deadlines.ProjectStartDate != "" {
		if _, err := time.Parse(time.RFC3339, deadlines.ProjectStartDate); err != nil {
			return fmt.Errorf("invalid project start date format: %v", err)
		}
	}

	if deadlines.ProjectEndDate != "" {
		if _, err := time.Parse(time.RFC3339, deadlines.ProjectEndDate); err != nil {
			return fmt.Errorf("invalid project end date format: %v", err)
		}
	}

	// Validate milestone deadlines
	for _, milestone := range deadlines.MilestoneDeadlines {
		if _, err := time.Parse(time.RFC3339, milestone.Deadline); err != nil {
			return fmt.Errorf("invalid milestone deadline format for %s: %v", milestone.Name, err)
		}
	}

	return nil
}

func (s *EnhancedSmartContract) validateEvaluationCriteria(criteria []EvalCriterion) error {
	if len(criteria) == 0 {
		return fmt.Errorf("at least one evaluation criterion is required")
	}

	totalWeight := 0.0
	for _, criterion := range criteria {
		if criterion.Name == "" {
			return fmt.Errorf("criterion name is required")
		}
		if criterion.Weight < 0 || criterion.Weight > 100 {
			return fmt.Errorf("criterion weight must be between 0 and 100")
		}
		totalWeight += criterion.Weight
	}

	// Allow some tolerance for rounding errors
	if math.Abs(totalWeight-100.0) > 0.01 {
		return fmt.Errorf("total evaluation criteria weight must equal 100, got %.2f", totalWeight)
	}

	return nil
}

// PublishTender publishes a draft tender to make it open for bids
func (s *EnhancedSmartContract) PublishTender(ctx contractapi.TransactionContextInterface, tenderID string) error {
	// Get the tender
	bytes, err := ctx.GetStub().GetState(tenderKey(tenderID))
	if err != nil {
		return err
	}
	if bytes == nil {
		return fmt.Errorf("tender %s not found", tenderID)
	}

	var tender EnhancedTender
	if err := json.Unmarshal(bytes, &tender); err != nil {
		return err
	}

	// Validate tender can be published
	txTime, err := s.getTxTime(ctx)
	if err != nil {
		return err
	}
	if err := s.validateTenderForPublishing(&tender, txTime); err != nil {
		return err
	}

	// Update status and timestamps
	tender.Status = "OPEN"
	tender.UpdatedAt = txTime.Format(time.RFC3339)
	if tender.Deadlines.RFQIssueDate == "" {
		tender.Deadlines.RFQIssueDate = txTime.Format(time.RFC3339)
	}

	// Store updated tender
	updatedBytes, _ := json.Marshal(tender)
	if err := ctx.GetStub().PutState(tenderKey(tenderID), updatedBytes); err != nil {
		return err
	}

	// Emit event
	eventData := map[string]interface{}{
		"tenderId": tenderID,
		"status":   "OPEN",
		"publishedAt": tender.UpdatedAt,
	}
	eventBytes, _ := json.Marshal(eventData)
	_ = ctx.GetStub().SetEvent("TenderPublished", eventBytes)

	return nil
}

func (s *EnhancedSmartContract) validateTenderForPublishing(tender *EnhancedTender, now time.Time) error {
	if tender.Status != "DRAFT" {
		return fmt.Errorf("only draft tenders can be published")
	}

	// Check if bid submission deadline is in the future
	if tender.Deadlines.BidSubmissionDeadline != "" {
		deadline, err := time.Parse(time.RFC3339, tender.Deadlines.BidSubmissionDeadline)
		if err != nil {
			return fmt.Errorf("invalid bid submission deadline: %v", err)
		}
		if deadline.Before(now) {
			return fmt.Errorf("bid submission deadline must be in the future")
		}
	}

	return nil
}

// SubmitEnhancedBid submits a comprehensive bid with technical and financial proposals
func (s *EnhancedSmartContract) SubmitEnhancedBid(ctx contractapi.TransactionContextInterface, tenderID, bidID string) error {
	// Get the tender
	bytes, err := ctx.GetStub().GetState(tenderKey(tenderID))
	if err != nil {
		return err
	}
	if bytes == nil {
		return fmt.Errorf("tender %s not found", tenderID)
	}

	var tender EnhancedTender
	if err := json.Unmarshal(bytes, &tender); err != nil {
		return err
	}

	// Validate submission window
	txTime, err := s.getTxTime(ctx)
	if err != nil {
		return err
	}
	if err := s.validateSubmissionWindow(&tender, txTime); err != nil {
		return err
	}

	// Get transient data
	transient, err := ctx.GetStub().GetTransient()
	if err != nil {
		return fmt.Errorf("failed to get transient: %v", err)
	}

	bidBytes, ok := transient["bid"]
	if !ok {
		return fmt.Errorf("transient map must contain 'bid'")
	}

	var bid EnhancedBidPrivate
	if err := json.Unmarshal(bidBytes, &bid); err != nil {
		return fmt.Errorf("invalid bid JSON: %v", err)
	}

	// Validate bid
	if err := s.validateEnhancedBid(&bid, &tender); err != nil {
		return fmt.Errorf("bid validation failed: %v", err)
	}

	// Check if bid already exists
	exists, err := s.assetExists(ctx, bidRefKey(tenderID, bidID))
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("bid %s already exists for tender %s", bidID, tenderID)
	}

	// Set submission timestamp
	bid.SubmittedAt = txTime.Format(time.RFC3339)

	// Store private bid data
	if err := ctx.GetStub().PutPrivateData(privateCollectionName, bidPrivKey(tenderID, bidID), bidBytes); err != nil {
		return fmt.Errorf("failed to store private bid: %v", err)
	}

	// Create and store public bid reference
	hash := sha256.Sum256(bidBytes)
	hashHex := hex.EncodeToString(hash[:])

	ref := BidRef{
		TenderID:     tenderID,
		BidID:        bidID,
		ContractorID: bid.ContractorID,
		BidHash:      hashHex,
	}
	refBytes, _ := json.Marshal(ref)
	if err := ctx.GetStub().PutState(bidRefKey(tenderID, bidID), refBytes); err != nil {
		return err
	}

	// Emit event
	eventData := map[string]interface{}{
		"tenderId": tenderID,
		"bidId":    bidID,
		"contractorId": bid.ContractorID,
		"submittedAt": bid.SubmittedAt,
	}
	eventBytes, _ := json.Marshal(eventData)
	_ = ctx.GetStub().SetEvent("EnhancedBidSubmitted", eventBytes)

	return nil
}

func (s *EnhancedSmartContract) validateSubmissionWindow(tender *EnhancedTender, now time.Time) error {
	if tender.Status != "OPEN" {
		return fmt.Errorf("tender is not open for bids")
	}

	if tender.Deadlines.BidSubmissionDeadline != "" {
		deadline, err := time.Parse(time.RFC3339, tender.Deadlines.BidSubmissionDeadline)
		if err != nil {
			return fmt.Errorf("invalid bid submission deadline: %v", err)
		}
		if now.After(deadline) {
			return fmt.Errorf("bid submission deadline has passed")
		}
	}

	return nil
}

func (s *EnhancedSmartContract) validateEnhancedBid(bid *EnhancedBidPrivate, tender *EnhancedTender) error {
	if bid.TenderID == "" || bid.BidID == "" || bid.ContractorID == "" {
		return fmt.Errorf("tender ID, bid ID, and contractor ID are required")
	}

	if bid.TotalAmount <= 0 {
		return fmt.Errorf("total amount must be positive")
	}

	if bid.Currency == "" {
		return fmt.Errorf("currency is required")
	}

	// Validate technical proposal
	if bid.TechnicalProposal.Methodology == "" {
		return fmt.Errorf("technical methodology is required")
	}

	// Validate financial proposal
	if len(bid.FinancialProposal.BreakdownByPhase) == 0 {
		return fmt.Errorf("financial breakdown by phase is required")
	}

	// Validate compliance checklist
	if len(bid.ComplianceChecklist) == 0 {
		return fmt.Errorf("compliance checklist is required")
	}

	return nil
}

// GetEnhancedTender retrieves a comprehensive tender
func (s *EnhancedSmartContract) GetEnhancedTender(ctx contractapi.TransactionContextInterface, tenderID string) (*EnhancedTender, error) {
	bytes, err := ctx.GetStub().GetState(tenderKey(tenderID))
	if err != nil {
		return nil, err
	}
	if bytes == nil {
		return nil, fmt.Errorf("tender %s not found", tenderID)
	}

	var tender EnhancedTender
	if err := json.Unmarshal(bytes, &tender); err != nil {
		return nil, err
	}

	return &tender, nil
}

// GetEnhancedBidPrivate retrieves private bid data
func (s *EnhancedSmartContract) GetEnhancedBidPrivate(ctx contractapi.TransactionContextInterface, tenderID, bidID string) (*EnhancedBidPrivate, error) {
	data, err := ctx.GetStub().GetPrivateData(privateCollectionName, bidPrivKey(tenderID, bidID))
	if err != nil {
		return nil, err
	}
	if data == nil {
		return nil, fmt.Errorf("private bid not found")
	}

	var bid EnhancedBidPrivate
	if err := json.Unmarshal(data, &bid); err != nil {
		return nil, err
	}

	return &bid, nil
}

// EvaluateBids performs automated bid evaluation based on criteria
func (s *EnhancedSmartContract) EvaluateBids(ctx contractapi.TransactionContextInterface, tenderID string) error {
	// Get the tender
	tender, err := s.GetEnhancedTender(ctx, tenderID)
	if err != nil {
		return err
	}

	if tender.Status != "CLOSED" {
		return fmt.Errorf("tender must be closed before evaluation")
	}

	// Get all bids
	bids, err := s.ListBidsPublic(ctx, tenderID)
	if err != nil {
		return err
	}

	if len(bids) == 0 {
		return fmt.Errorf("no bids to evaluate")
	}

	// Evaluate each bid
	for _, bidRef := range bids {
		bid, err := s.GetEnhancedBidPrivate(ctx, tenderID, bidRef.BidID)
		if err != nil {
			continue // Skip bids that can't be retrieved
		}

		// Calculate score based on evaluation criteria
		score := s.calculateBidScore(bid, tender.EvaluationCriteria)

		// Record evaluation
		eval := Evaluation{
			TenderID: tenderID,
			BidID:    bidRef.BidID,
			Score:    score,
			Notes:    "Automated evaluation based on criteria",
		}

		evalBytes, _ := json.Marshal(eval)
		if err := ctx.GetStub().PutState(evalKey(tenderID, bidRef.BidID), evalBytes); err != nil {
			return err
		}

		// Emit evaluation event
		eventData := map[string]interface{}{
			"tenderId": tenderID,
			"bidId":    bidRef.BidID,
			"score":    score,
		}
		eventBytes, _ := json.Marshal(eventData)
		_ = ctx.GetStub().SetEvent("BidEvaluated", eventBytes)
	}

	return nil
}

func (s *EnhancedSmartContract) calculateBidScore(bid *EnhancedBidPrivate, criteria []EvalCriterion) float64 {
	totalScore := 0.0

	for _, criterion := range criteria {
		var criterionScore float64

		switch criterion.Type {
		case "QUANTITATIVE":
			// For price-based criteria, lower is better
			if criterion.Name == "Price" {
				// Normalize price score (lower price = higher score)
				criterionScore = 100.0 - (bid.TotalAmount / 1000000.0 * 10.0) // Simple normalization
				if criterionScore < 0 {
					criterionScore = 0
				}
			} else {
				criterionScore = 75.0 // Default score for other quantitative criteria
			}
		case "QUALITATIVE":
			// For qualitative criteria, check compliance
			if compliant, exists := bid.ComplianceChecklist[criterion.Name]; exists && compliant {
				criterionScore = 100.0
			} else {
				criterionScore = 50.0
			}
		case "PASS_FAIL":
			if compliant, exists := bid.ComplianceChecklist[criterion.Name]; exists && compliant {
				criterionScore = 100.0
			} else {
				criterionScore = 0.0
			}
		default:
			criterionScore = 50.0
		}

		totalScore += criterionScore * (criterion.Weight / 100.0)
	}

	return totalScore
}

// GetTenderStatistics provides comprehensive tender statistics
func (s *EnhancedSmartContract) GetTenderStatistics(ctx contractapi.TransactionContextInterface, tenderID string) (string, error) {
	tender, err := s.GetEnhancedTender(ctx, tenderID)
	if err != nil {
		return "", err
	}

	bids, err := s.ListBidsPublic(ctx, tenderID)
	if err != nil {
		return "", err
	}

	// Calculate statistics
	stats := map[string]interface{}{
		"tenderId":           tenderID,
		"status":             tender.Status,
		"totalBids":          len(bids),
		"projectDescription": tender.ProjectScope.Description,
		"owner":              tender.OwnerDetails.OrganizationName,
		"createdAt":          tender.CreatedAt,
		"updatedAt":          tender.UpdatedAt,
	}

	// Add bid statistics if available
	if len(bids) > 0 {
		var totalAmount float64
		var amounts []float64

		for _, bidRef := range bids {
			if bid, err := s.GetEnhancedBidPrivate(ctx, tenderID, bidRef.BidID); err == nil {
				totalAmount += bid.TotalAmount
				amounts = append(amounts, bid.TotalAmount)
			}
		}

		if len(amounts) > 0 {
			// Calculate min, max, average
			min := amounts[0]
			max := amounts[0]
			for _, amount := range amounts {
				if amount < min {
					min = amount
				}
				if amount > max {
					max = amount
				}
			}
			avg := totalAmount / float64(len(amounts))

			stats["bidStatistics"] = map[string]interface{}{
				"totalAmount": totalAmount,
				"averageBid":  avg,
				"lowestBid":   min,
				"highestBid":  max,
				"currency":    tender.ProjectScope.Budget.Currency,
			}
		}
	}

	statsBytes, _ := json.MarshalIndent(stats, "", "  ")
	return string(statsBytes), nil
}

// CloseTenderEnhanced closes a tender with enhanced validation
func (s *EnhancedSmartContract) CloseTenderEnhanced(ctx contractapi.TransactionContextInterface, tenderID string) error {
	tender, err := s.GetEnhancedTender(ctx, tenderID)
	if err != nil {
		return err
	}

	if tender.Status != "OPEN" {
		return fmt.Errorf("only open tenders can be closed")
	}

	txTime, err := s.getTxTime(ctx)
	if err != nil {
		return err
	}

	// Update status
	tender.Status = "CLOSED"
	tender.UpdatedAt = txTime.Format(time.RFC3339)

	// Store updated tender
	bytes, _ := json.Marshal(tender)
	if err := ctx.GetStub().PutState(tenderKey(tenderID), bytes); err != nil {
		return err
	}

	// Emit event
	eventData := map[string]interface{}{
		"tenderId": tenderID,
		"status":   "CLOSED",
		"closedAt": tender.UpdatedAt,
	}
	eventBytes, _ := json.Marshal(eventData)
	_ = ctx.GetStub().SetEvent("TenderClosed", eventBytes)

	return nil
}

// GetTendersByStatus retrieves tenders by status (for API compatibility)
func (s *EnhancedSmartContract) GetTendersByStatus(ctx contractapi.TransactionContextInterface, status string) (string, error) {
	// For now, return empty array - this would need proper implementation
	return "[]", nil
}

// AwardBestBid automatically awards the tender to the best bid
func (s *EnhancedSmartContract) AwardBestBid(ctx contractapi.TransactionContextInterface, tenderID string) error {
	tender, err := s.GetEnhancedTender(ctx, tenderID)
	if err != nil {
		return err
	}

	if tender.Status != "CLOSED" {
		return fmt.Errorf("tender must be closed before awarding")
	}

	// Get all evaluations
	evaluations, err := s.ListEvaluations(ctx, tenderID)
	if err != nil {
		return err
	}

	if len(evaluations) == 0 {
		return fmt.Errorf("no evaluations found for tender")
	}

	// Find the best bid
	var bestBid *Evaluation
	bestScore := -1.0

	for _, eval := range evaluations {
		if eval.Score > bestScore {
			bestScore = eval.Score
			bestBid = eval
		}
	}

	if bestBid == nil {
		return fmt.Errorf("no valid evaluations found")
	}

	// Award the tender
	return s.AwardTender(ctx, tenderID, bestBid.BidID)
}

func main() {
    // Register both the basic and enhanced contracts to allow gradual migration
    cc, err := contractapi.NewChaincode(new(SmartContract), new(EnhancedSmartContract))
    if err != nil {
        panic(err)
    }
    if err := cc.Start(); err != nil {
        panic(err)
    }
}
