# AI Prompt Library for Software Testing

## Core Principle

> **AI output quality = Prompt clarity × Context richness × Constraint precision**

A weak prompt gives generic results.  
A strong prompt produces **test-ready artifacts**.

## Testing Activities prompts
This library provides reusable prompts to support the full testing lifecycle:
Requirement → Test Design → Test Cases


### 1. Requirement Analysis Prompts
Use requirement analysis prompts to turn user stories, acceptance criteria, and design docs into structured testable requirements. Focus on clarifying scope, identifying hidden assumptions, and mapping functional/non-functional expectations before test design.

#### 1.1 Extract & Structure Requirements
- Ask AI to parse user stories and acceptance criteria into discrete requirement items (feature, behavior, data rules, preconditions, postconditions).
- Include:
  - Actor and goal (who, what, why)
  - Inputs, outputs, and constraints
  - Acceptance criteria and business rules
- Output format: bullet list or table with columns: Requirement ID, Description, Type (Functional/Non-functional), Priority.

#### 1.2 Multi-Source Requirement Consolidation (ADO + Wiki + Figma)
- Provide AI with multi-source context from tickets, wiki notes, and UI artifacts.
- Ask for consolidated requirements and candidate gaps (mismatches between text and UI).
- Include source traceability (e.g., ADO ID, wiki page, wireframe ref).
- Output format: consolidated requirement table with source references and confidence notes.

#### 1.3 Gap & Risk Detection
- Use AI to detect requirement gaps, ambiguities, contradictions, and high-risk assumptions.
- Typical prompts:
  - “List missing user flows or edge conditions from this user story.”
  - “Identify business and technical risks in this requirement.”
- Output format: risk table/matrix with columns: Risk, Cause, Impact, Mitigation.

### 2. Effective Test Design Prompting


#### 2.1 Common Pitfalls
- Jumping straight into writing test cases without proper analysis  
- Missing critical coverage such as edge cases, risks, and negative scenarios  

#### 2.2 Best Practices
- Start with thorough test design to identify scenarios, risks, and coverage  
- Then create high-quality test cases based on the design  
- Ensure both positive and negative flows are included


#### 2.3 Prompt Design Framework

When writing prompts, always consider:

- **Role** → Who is the AI acting as?
- **Context** → What system / feature?
- **Task** → What do you want?
- **Constraints** → Format, rules, limits
- **Depth** → Level of detail required

👉 **Formula:**
[Role] + [Task] + [Context] + [Constraints] + [Output Format]


#### 2.4 Technique-Based Test Design Prompting Styles


##### a. Role-Based Prompting

**Purpose:** Simulate domain expertise

**When to use:**
- Functional testing
- Domain-heavy systems (Finance, ERP, Healthcare)

**Why it works:**
AI adapts tone, logic, and assumptions based on the assigned role.

**Example:**

You are a Senior Test Engineer specializing in test design for web applications.

Design test scenarios for the login functionality of a web application.

Requirements:
- Apply the following test design techniques:
  • Equivalence Partitioning  
  • Boundary Value Analysis  
- Minimize the number of test designs while ensuring maximum coverage
- Focus on input validation for email and password fields

Output in table format with the following columns:
- Test Design ID
- Title
- Description
- Test Technique
- Input Partition / Boundary Condition


**Advanced Tip:**
- Add **priority / severity**
- Add **test type** (positive, negative, boundary)

---

##### b. Scenario-Based Prompting

**Purpose:** Validate end-to-end business flows

**When to use:**
- E2E testing
- UAT preparation
- Business-critical journeys

**Why it works:**
AI understands workflows better than isolated features

**Example:**
You are a Senior Test Engineer specializing in end-to-end test design for e-commerce systems.
Design optimized test scenarios for the following user journey:
Login → Search product → Add to cart → Apply discount code → Checkout

Step 1: Break down the following user journey into key steps:
Login → Search → Add to Cart → Apply Discount → Checkout

Step 2: Identify risks and possible failure points at each step.

Step 3: Design a minimal set of test scenarios that covers:
- Happy path
- Failure scenarios
- Edge cases

Constraints:
- Avoid duplicate scenarios
- Ensure full end-to-end coverage

Output format:
Test Design ID | Title | Description | Scenario Type | Flow Step | Risk Covered

### 3. Test Case Generation Prompts


#### 3.1 Standard Test Case Generation (From Test Design)


You are a Senior Test Engineer. Given the following test design:
[Insert Test Design]

Your task is to convert the test design into detailed, executable test cases.

Instructions:
1. Break the test design into atomic scenarios (each with a single clear objective)
2. Generate one or more test cases per scenario
3. Ensure full coverage including:
   - Valid inputs (happy path)
   - Invalid inputs (negative scenarios)
   - Boundary conditions (edge cases)
4. For each test case, include:
   - Preconditions
   - Test steps (clear, step-by-step, one action per step)
   - Expected result (specific and verifiable)
   - Test data (concrete values)
5. Avoid duplicate or overlapping test cases

Output format:
Test Case ID | Title | Preconditions | Steps | Expected Result | Test Data

