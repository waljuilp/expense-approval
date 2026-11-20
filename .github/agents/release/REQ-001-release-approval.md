# REQ-001 Human Release Approval

## Requirement

REQ-001

## Purpose

This document records the final human decision to release or reject the implementation.

Human Release Approval is the final control point in the Agentic Software Factory.

AI agents may:

- define requirements
- design the solution
- implement the change
- execute tests
- evaluate quality evidence

AI agents MUST NOT make the final production release decision.

The final decision belongs to an authorized human approver.

---

# Preconditions

Before making the release decision, verify that:

- requirements/REQ-001.md exists
- architecture/REQ-001-design.md exists
- test-results/REQ-001-test-report.md exists
- quality/REQ-001-quality-gate.md exists
- Quality Agent decision is `QUALITY_GATE_PASSED`

If the Quality Gate decision is:

`QUALITY_GATE_FAILED`

or

`QUALITY_GATE_BLOCKED`

the release MUST NOT be approved.

---

# Evidence reviewed

The human approver should review at minimum:

## Requirement

`requirements/REQ-001.md`

Confirm that the implemented functionality corresponds to the intended business requirement.

## Architecture

`architecture/REQ-001-design.md`

Confirm that there are no significant unresolved architecture concerns.

## Test evidence

`test-results/REQ-001-test-report.md`

Confirm that:

- acceptance criteria were tested
- required boundary tests passed
- regression testing was performed
- no blocking defects remain

For REQ-001, explicitly verify evidence for:

- 999.99
- 1000.00
- 1000.01

## Quality Gate

`quality/REQ-001-quality-gate.md`

Required decision:

`QUALITY_GATE_PASSED`

Review the documented residual risk.

---

# Business release review

The human approver must consider factors that automated Quality Gates may not fully understand.

Examples include:

- business timing
- operational readiness
- customer impact
- deployment risk
- known limitations
- organizational dependencies
- compliance implications
- acceptable residual risk

A technically successful Quality Gate does not automatically require release.

---

# Release decision

Select exactly one:

`RELEASE_APPROVED`

or

`RELEASE_REJECTED`

or

`RELEASE_DEFERRED`

## RELEASE_APPROVED

Use when:

- Quality Gate passed
- evidence has been reviewed
- residual risk is acceptable
- business and operational conditions support release

## RELEASE_REJECTED

Use when:

- the human approver does not accept the residual risk
- a significant concern exists despite the Quality Gate result
- new information makes the release unsafe or inappropriate

## RELEASE_DEFERRED

Use when:

- the implementation is technically ready
- release should happen later
- operational, business or scheduling conditions prevent immediate release

---

# Approval record

**Requirement:** REQ-001

**Quality Gate:** [record decision]

**Release decision:** [record decision]

**Approver:** [record approver]

**Date:** [record date]

**Residual risk accepted:** YES / NO

## Decision rationale

Record the reason for the decision.

The rationale should reference relevant evidence or business considerations rather than simply stating that the release looks acceptable.

---

# Example

**Requirement:** REQ-001

**Quality Gate:** QUALITY_GATE_PASSED

**Release decision:** RELEASE_APPROVED

**Approver:** Ilpo Waljus

**Date:** 2026-11-20

**Residual risk accepted:** YES

## Decision rationale

All acceptance criteria passed.

Boundary values 999.99, 1000.00 and 1000.01 were successfully verified.

No blocking defects were identified.

The Quality Gate classified residual risk as LOW.

The available evidence is sufficient to approve the change for release.

---

# Audit trail

The release decision must remain traceable to the complete evidence chain:

GitHub Issue
→ Requirement
→ Architecture
→ Implementation
→ Test Evidence
→ Quality Gate
→ Human Release Approval
→ Deployment

The approval record must not be overwritten by an AI agent after the human decision has been recorded.

---

# Separation of responsibilities

Requirements Agent
→ defines WHAT must be built

Architecture Agent
→ defines HOW it should be built

Developer Agent
→ implements the change

Test Agent
→ independently verifies the implementation

Quality Agent
→ evaluates the complete evidence chain

Human Approver
→ accepts or rejects the release risk

Deployment mechanism
→ performs the actual deployment

Human Release Approval authorizes deployment.

It does not itself deploy the software.