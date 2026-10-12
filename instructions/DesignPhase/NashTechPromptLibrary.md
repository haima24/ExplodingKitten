# NashTech Prompt & Instruction Library
## AI-Assisted Technical Proposal Generation

---

# PART A: FOUNDATION & CRITICAL RULES

## A.1 Role Definition Prompt
> **USE THIS AT THE START OF EVERY SESSION**

```
You are a NashTech Technical Analyst (TA) specializing in creating 
client-facing technical proposals following NashTech standards.

Your responsibilities:
- Analyze RFP documents and extract requirements
- Design solution architectures with clear justifications
- Generate technical proposal content for Sections 2-7
- Create professional architecture diagrams
- Ensure compliance with NashTech template standards

CRITICAL COMPLIANCE RULES you must always follow:
1. NEVER delete numbered sections - use "N/A" if not applicable
2. NEVER invent numeric values - only use client-provided numbers
3. Source all requirements with inline citations: (Source: RFP §X.X, p.Y)
4. Use plain, concise English - avoid marketing fluff
5. Ensure consistency across Scope ↔ Architecture ↔ NFRs ↔ Testing
```

## A.2 Document Upload Instruction

```
I am uploading the following documents for analysis:

1. [filename.pdf] - Main RFP document
2. [appendix_a.xlsx] - Business requirements workbook
3. [appendix_b.pdf] - Workflow illustrations
4. [existing_system.docx] - Current system documentation

Please:
1. Confirm receipt of all documents
2. Create a document inventory with file types and key contents
3. Identify any missing or incomplete information
4. Note any documents requiring special processing (large Excel files)
```

---

# PART B: RFP ANALYSIS PROMPTS

## B.1 Master RFP Analysis

```
TA Complete Requirements Analysis: [PROJECT NAME]

Analyze all uploaded RFP documents and produce:

## 1. DOCUMENT INVENTORY
List all documents with:
- File name and type
- Page count / sheet count
- Primary content category
- Processing notes (e.g., "large file - process in batches")

## 2. REQUIREMENTS EXTRACTION
Extract and categorize ALL requirements into:

### Functional Requirements
| ID | Requirement | Priority | Source | TA Section |
|----|-------------|----------|--------|------------|
| FR-001 | [requirement text] | [H/M/L] | RFP §X.X, p.Y | Section 2 |

### Non-Functional Requirements  
| ID | Category | Requirement | Metric | Source |
|----|----------|-------------|--------|--------|
| NFR-001 | Performance | [requirement] | [specific metric] | RFP §X.X |

### Integration Requirements
| ID | External System | Integration Type | Data Flow | Source |
|----|-----------------|------------------|-----------|--------|

### Security & Compliance Requirements
| ID | Requirement | Standard/Regulation | Source |
|----|-------------|---------------------|--------|

## 3. GAP ANALYSIS
Identify missing information requiring client clarification:
| Gap ID | Missing Information | Impact | Clarification Question |
|--------|---------------------|--------|------------------------|

## 4. REQUIREMENTS TRACEABILITY MATRIX
Map each requirement to the TA section where it will be addressed.

## 5. RISK INDICATORS
Flag any requirements that pose implementation risks.
```

## B.2 Excel Requirements Processing

```
TA Excel Analysis: @[filename.xlsx]

Process this Excel workbook systematically:

## Step 1: File Assessment
- List all worksheet names
- Identify worksheet with requirements data
- Note any formatting issues or merged cells

## Step 2: Requirements Extraction
For each relevant worksheet:
- Extract column headers
- Map columns to requirement categories
- Extract all rows with data validation

## Step 3: Data Quality Check
- Flag incomplete rows
- Identify ambiguous requirements
- Note any conflicting information

## Step 4: Output Format
Present extracted requirements in structured tables with:
- Requirement ID (generate if not provided)
- Requirement text
- Category (Functional/NFR/Integration)
- Priority (if specified)
- Source reference (Sheet name, Row number)

If timeout occurs, process worksheets one at a time.
```

## B.3 User & Stakeholder Analysis

```
Analyze the RFP documents and identify:

## 1. USER ROLES
| Role | Description | Primary Functions | Access Level |
|------|-------------|-------------------|--------------|

## 2. USER VOLUMES
| User Type | Expected Count | Concurrent Users | Source |
|-----------|----------------|------------------|--------|
Note: Only include numbers explicitly stated in documents.
Mark "TBD" for any unspecified volumes.

## 3. USER JOURNEYS
For each primary user role, map the key workflows:
- [Role]: [Journey 1] → [Journey 2] → [Journey N]

## 4. ACCESS CONTROL REQUIREMENTS
| Role | Create | Read | Update | Delete | Approve |
|------|--------|------|--------|--------|---------|

Extract all information from: (Source: [document reference])
```

## B.4 Integration Analysis

```
Analyze integration requirements from the RFP:

## 1. EXTERNAL SYSTEMS INVENTORY
| System Name | Type | Vendor | Current Status | Source |
|-------------|------|--------|----------------|--------|
Example: Oracle JD Edwards | ERP | Oracle | Existing | RFP p.4

## 2. INTEGRATION PATTERNS
For each integration point:
| System | Direction | Data Type | Frequency | Protocol | Source |
|--------|-----------|-----------|-----------|----------|--------|

## 3. DATA MAPPING REQUIREMENTS
| Source Field | Target Field | Transformation | Validation |
|--------------|--------------|----------------|------------|

## 4. INTEGRATION RISKS
| Risk | Impact | Mitigation Approach |
|------|--------|---------------------|

Only document integrations explicitly mentioned in RFP materials.
```

---

# PART C: ARCHITECTURE DESIGN PROMPTS

## C.1 Master Architecture Generation

```
Create a professional architecture diagram for [PROJECT NAME]

## PREPARATION
1. Read /mnt/project/general-architecture-diagram-guidelines.md
2. Reference /mnt/project/azure_icons.xlsx for Azure service icons
3. Use /mnt/project/sample_drawio.txt as XML format reference

## REQUIREMENTS FROM RFP
[List key requirements that drive architecture decisions]

## ARCHITECTURE SPECIFICATIONS

### User Layer (Top of Diagram)
- User Type 1: [role and access pattern]
- User Type 2: [role and access pattern]

### Security & Entry Layer
- Load Balancer/WAF: [specifications]
- Authentication: [method - SSO/OAuth/etc.]

### Application Layer (Multi-zone)
- Frontend: [technology, deployment]
- Backend Services: [microservices list]
- API Gateway: [if applicable]

### Data Layer
- Primary Database: [type, HA configuration]
- Cache: [if applicable]
- File Storage: [if applicable]

### Integration Layer
- External System 1: [integration method]
- External System 2: [integration method]

## OUTPUT REQUIREMENTS
1. Generate draw.io compatible XML
2. Use official Azure icons from azure_icons.xlsx
3. Include color-coded legend:
   - Orange (#FF6B35): In-scope/New components
   - Blue (#74B9FF): Existing systems
   - Green (#00B894): Third-party services
4. Label all data flows with protocols
5. Show security boundaries clearly
6. Separate NT scope from client scope visually
```

## C.2 Component Descriptions

```
Generate detailed component descriptions for Section 2.1:

Based on the architecture diagram, describe each component:

## FORMAT FOR EACH COMPONENT

**[Component Name]**
- Purpose: [What it does in 1-2 sentences]
- Technology: [Specific technology/service]
- Deployment: [How/where deployed]
- Scaling: [Scaling approach if applicable]
- Integration: [What it connects to]

## REQUIRED SECTIONS

### User Layer
[Describe each user type and their entry point]

### Load Balancing Layer
[Describe traffic management approach]

### Application Layer
[Describe each service/component]

### Data Layer  
[Describe storage components]

### Integration Layer
[Describe external connections]

### Security Controls
[Describe security measures at each layer]

## JUSTIFICATION
End with: "This architecture is proposed because [link to specific client requirements]"

Source all requirements: (Source: RFP §X.X, p.Y)
```

## C.3 Alternative Solutions

```
Generate Section 7: Alternative Solutions

## OPTION A: [Primary Recommended Solution]
Already documented in Section 2.

## OPTION B: [Alternative Approach]

### Architecture Overview
[Brief description of alternative approach]

### Key Differences from Option A
| Aspect | Option A | Option B |
|--------|----------|----------|
| Deployment | [approach] | [approach] |
| Technology | [stack] | [stack] |
| Cost | [relative] | [relative] |

### Pros
- [Advantage 1]
- [Advantage 2]

### Cons
- [Disadvantage 1]
- [Disadvantage 2]

### When to Consider
[Scenarios where Option B would be preferred]

## RECOMMENDATION
Option A is recommended because [specific reasons linked to client context].

If no meaningful alternatives exist, state:
"N/A - The proposed architecture in Section 2 represents the optimal 
approach for the stated requirements."
```

---

# PART D: SECTION GENERATION PROMPTS

## D.1 Section 2: Proposed Architecture

```
Generate Section 2: Proposed Architecture for [PROJECT NAME]

## 2.1 High Level Architecture

### Architecture Diagram
[Reference the generated draw.io diagram]

### Component Descriptions
[Use the component description format]

### Architecture Justification
Link the architecture to client requirements:
- Requirement 1 (Source: RFP §X.X) → Addressed by [component]
- Requirement 2 (Source: RFP §X.X) → Addressed by [component]

### Authentication Method
Specify the authentication approach:
- Method: [SSO/OAuth 2.0/SAML/etc.]
- Identity Provider: [specify]
- MFA: [Yes/No and approach]

### Scope Separation
Clearly identify:
- NT Scope (Orange in diagram): [list components]
- Client Scope (Blue in diagram): [list components]
- Third-Party (Green in diagram): [list components]

DO NOT include generic architecture descriptions.
All content must be specific to this project.
```

## D.2 Section 3: Deployment Model

```
Generate Section 3: Deployment Model for [PROJECT NAME]

## 3.1 System Environments

### Development Environment
- Purpose: [describe]
- Infrastructure: NT's infrastructure
- Access: Development team only

### Test Environment  
- Purpose: [describe]
- Infrastructure: NT's infrastructure
- Access: QA team

### UAT Environment
- Purpose: [describe]
- Infrastructure: Client's infrastructure
- Access: Client stakeholders + NT support

### Production Environment
- Purpose: [describe]
- Infrastructure: Client's infrastructure
- Access: End users

## 3.2 Deployment Responsibilities Matrix

| Environment | Server Owner | Setup & Configure | Deploy | Troubleshoot |
|-------------|--------------|-------------------|--------|--------------|
| Development | NT | NT | NT | NT |
| Test | NT | NT | NT | NT |
| UAT | Client | Client | Client (NT support) | Client (NT support) |
| Production | Client | Client | Client | Client |

Note: Client is responsible for all cloud service costs.

## 3.3 CI/CD Pipeline
[Describe pipeline stages and triggers]
```

## D.3 Section 4: Technology Selection

```
Generate Section 4: Technology Selection for [PROJECT NAME]

For EACH technology in the architecture, provide:

## 4.X [Technology Name]

**Selection**: [Technology name and version]

**Business Justification**:
[Technology] is selected because it directly addresses:
- [Client requirement 1] (Source: RFP §X.X)
- [Client requirement 2] (Source: RFP §X.X)

**Benefits for [Client Name]**:
- Benefit 1: [How it helps achieve client's goal]
- Benefit 2: [How it helps achieve client's goal]

---

RULES:
- If technology is requested by client, state: "Requested by client"
- NO marketing language ("industry-leading", "cutting-edge")
- Each benefit must link to specific client context
- Include version numbers where applicable
```

## D.4 Section 5: Non-Functional Requirements

```
Generate Section 5: Non-functional Considerations for [PROJECT NAME]

## 5.1 Exception Handling
[Standard best practices]

## 5.2 Availability
- Target: [ONLY if specified in RFP, otherwise "TBD"]
- Approach: [Multi-zone deployment, failover strategy]

## 5.3 Scalability
- Approach: [Horizontal/vertical scaling strategy]
IMPORTANT: Do not specify numbers unless provided by client.

## 5.4 Performance

### 5.4.1 Volumetrics
| Metric | Value | Source |
|--------|-------|--------|
| Total Users | [from RFP or TBD] | RFP §X.X |
| CCU | [from RFP or TBD] | RFP §X.X |

### 5.4.2 Performance Requirements
[ONLY include metrics explicitly stated in RFP]

### 5.4.3 NT Proposed Performance Solution
[Optimization techniques without specific number commitments]

## 5.5 Security
Apply NT Security Level [X].
- Perimeter Defence: [approach]
- Identity & Access Management: [approach]  
- Platform Security: [approach]
- Information Security: [encryption, data protection]

## 5.6 Data Protection
[GDPR/local regulations as applicable]

## 5.7 Logging
[Approach and tools]

## 5.8 Audit Logging
Data entities requiring audit trail:
- [Entity 1]: [actions to track]

## 5.9 Software and Licenses
| Software | License Type | Responsible Party |
|----------|--------------|-------------------|
```

## D.5 Section 6: Testing Approach

```
Generate Section 6: Testing Approach for [PROJECT NAME]

## Overview
[Brief testing strategy description]

## 6.1 Test Environment

### Desktop/Laptop Testing
| Browser | Version | OS |
|---------|---------|-----|
| Chrome | Latest stable | Windows Pro (latest) |
| Edge | Latest stable | Windows Pro (latest) |

### Mobile Testing
| Device | Browser | OS |
|--------|---------|-----|

## 6.2 Testing Scope

### Functional Testing
- [Key functional areas]

### Non-Functional Testing
- Performance Testing: [approach]
- Security Testing: Based on OWASP Top 10

### Out of Scope
- [Excluded testing with justification]

## 6.3 Testing Outcomes
[Expected outcomes]

## 6.4 Testing Documentation
- Test Strategy document
- Test Cases/Scripts
- Test Execution Report
- Defect Report
```

---

# PART F: QUALITY ASSURANCE PROMPTS

## F.1 Compliance Validation

```
Review the generated Technical Proposal for NashTech compliance.

## CHECKLIST VALIDATION

### Template Compliance
☐ All sections 2-7 present
☐ No blue guidance text remaining
☐ N/A used for non-applicable sections (not deleted)
☐ Correct heading hierarchy

### Content Compliance
☐ No invented numeric values
☐ All metrics have source citations
☐ Plain English (no marketing language)
☐ Client-specific content (no generic templates)

### Cross-Section Consistency
☐ All Scope items appear in Architecture
☐ All Architecture components in Technology Selection
☐ All NFRs have corresponding Testing approach
☐ Technology stack matches Deployment model

## OUTPUT FORMAT
For each check:
- PASS: [brief confirmation]
- FAIL: [specific issue and location]
-  WARNING: [potential concern]

## REMEDIATION
For each FAIL, provide:
1. What needs to be fixed
2. Where it's located
3. Suggested correction
```

## F.2 Source Citation Audit

```
Audit all numeric values and requirements in the proposal.

## SCAN FOR
1. Performance metrics (response times, throughput)
2. User volumes (total users, concurrent users)
3. Storage sizes (database, file storage)
4. Availability targets (uptime percentages)
5. Timeline constraints (deadlines, durations)

## FOR EACH VALUE FOUND
| Value | Location | Citation Present | Source Valid |
|-------|----------|------------------|--------------|

## ISSUES TO FLAG
- Values without citations → MUST ADD or mark TBD
- Citations to non-existent sources → MUST VERIFY
- Values that contradict source → MUST CORRECT
```

## F.3 Architecture Diagram Validation

```
Validate the architecture diagram against requirements.

## STRUCTURAL CHECKS
☐ Users at top of diagram
☐ Load balancer as entry point
☐ Multi-zone/HA deployment shown
☐ Security boundaries clearly marked
☐ Data flow arrows with protocols
☐ Legend with 3 color categories present

## CONTENT CHECKS
☐ All required components from RFP included
☐ All integrations from requirements shown
☐ NT scope vs Client scope clearly separated
☐ Technology labels on all components

## CONSISTENCY CHECKS
☐ All diagram components appear in Section 2 descriptions
☐ All diagram components appear in Section 4 Technology Selection
☐ Integration points match Section 5 Integration requirements
```

---

# PART H: GITHUB COPILOT INSTRUCTIONS

## H.1 Terraform Infrastructure

```javascript
// Terraform configuration for [PROJECT NAME] infrastructure
// Requirements:
// - Azure Kubernetes Service with 3 node pools
// - Azure SQL Database with geo-replication
// - Azure Key Vault for secrets management
// - Virtual Network with proper subnets
// - Application Gateway with WAF

// Resource Group
resource "azurerm_resource_group" "main" {
  // Copilot completes...
}
```

## H.2 Kubernetes Deployment

```yaml
# Kubernetes deployment for [SERVICE NAME]
# Requirements:
# - 3 replicas for high availability
# - Resource limits: 512Mi memory, 500m CPU
# - Readiness probe on /health endpoint
# - Liveness probe on /health endpoint
# - Environment variables from ConfigMap

apiVersion: apps/v1
kind: Deployment
metadata:
  name: [service-name]
spec:
  # Copilot completes...
```

## H.3 Azure DevOps Pipeline

```yaml
# Azure DevOps Pipeline for [PROJECT NAME]
# Stages: Build → Test → Security Scan → Deploy

trigger:
  branches:
    include:
      - main
      - develop

stages:
  - stage: Build
    jobs:
      - job: BuildJob
        steps:
          # Copilot completes...
```

---

# QUICK REFERENCE

## Command Triggers

| Task | Prompt Start |
|------|--------------|
| Full RFP Analysis | `TA Complete Requirements Analysis: [project]` |
| Excel Processing | `TA Excel Analysis: @[filename.xlsx]` |
| Architecture Diagram | `Create architecture diagram for [project] following guidelines` |
| Section Generation | `Generate Section [X] for [project]` |
| Compliance Check | `Review proposal for NashTech compliance` |
| Citation Audit | `Audit all numeric values in the proposal` |

## Color Coding

| Color | Hex | Usage |
|-------|-----|-------|
| 🟠 Orange | #FF6B35 | In-scope (NT delivery) |
| 🔵 Blue | #74B9FF | Existing systems |
| 🟢 Green | #00B894 | Third-party services |
| 🟡 Yellow | #FDCB6E | Security controls |
| 🟣 Purple | #A29BFE | Data storage |

## Citation Formats

- **RFP**: `(Source: RFP §[section], p.[page])`
- **Appendix A**: `(Source: Appendix A, [Sheet], Row [X])`
- **Appendix B**: `(Source: Appendix B, p.[page])`
- **Meeting**: `(Source: Client meeting, [date])`
- **Email**: `(Source: Email from [person], [date])`

---

*Version 1.0 | November 2025 | NashTech Vietnam*
