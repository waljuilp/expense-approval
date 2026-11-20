# REQ-001 Release Approval

## Release information

| Field | Value |
|---|---|
| Requirement | REQ-001 |
| Version / Commit | `[ENTER COMMIT SHA OR VERSION]` |
| Target environment | `[TEST / STAGING / PRODUCTION]` |
| Planned release date | `[YYYY-MM-DD]` |
| Approver | `[NAME]` |
| Approval date | `[YYYY-MM-DD HH:MM]` |

---

## Quality Gate

**Quality Gate decision:**  
`[QUALITY_GATE_PASSED / QUALITY_GATE_FAILED / QUALITY_GATE_BLOCKED]`

**Quality Gate report:**  
`quality/REQ-001-quality-gate.md`

**Residual risk:**  
`[LOW / MEDIUM / HIGH]`

---

## Evidence reviewed

Confirm the evidence reviewed before making the release decision.

- [ ] Requirement reviewed: `requirements/REQ-001.md`
- [ ] Architecture reviewed: `architecture/REQ-001-design.md`
- [ ] Implementation reviewed where necessary
- [ ] Test report reviewed: `test-results/REQ-001-test-report.md`
- [ ] Quality Gate reviewed: `quality/REQ-001-quality-gate.md`
- [ ] All acceptance criteria have passed
- [ ] No unresolved Critical or High severity defects
- [ ] Residual risk is understood and acceptable

---

## Critical boundary evidence

For REQ-001, confirm the approval threshold evidence.

| Amount | Expected behavior | Test result |
|---:|---|---|
| €999.99 | Manager approval NOT required | `[PASS / FAIL]` |
| €1,000.00 | Manager approval NOT required | `[PASS / FAIL]` |
| €1,000.01 | Manager approval required | `[PASS / FAIL]` |

- [ ] Boundary evidence reviewed and accepted

---

## Business and operational readiness

- [ ] Release timing is acceptable
- [ ] Operational readiness confirmed
- [ ] Customer/business impact understood
- [ ] Known limitations reviewed
- [ ] Deployment risk understood
- [ ] Rollback/recovery approach is understood
- [ ] No other known condition prevents deployment

---

## Known issues / accepted risks

**Known issues:**

`[NONE / DESCRIBE KNOWN ISSUES]`

**Accepted residual risks:**

`[NONE / DESCRIBE ACCEPTED RISKS]`

**Additional comments:**

`[OPTIONAL COMMENTS]`

---

# Human Release Decision

Select **exactly one**:

- [ ] `RELEASE_APPROVED`
- [ ] `RELEASE_REJECTED`
- [ ] `RELEASE_DEFERRED`

## Decision rationale

`[EXPLAIN THE REASON FOR THE DECISION]`

---

## Human confirmation

By approving this release, I confirm that I have reviewed the available requirement, architecture, test and Quality Gate evidence and accept the documented residual risk.

**Approver:** `[NAME]`

**Date:** `[YYYY-MM-DD HH:MM]`

**Decision:** `[RELEASE_APPROVED / RELEASE_REJECTED / RELEASE_DEFERRED]`

---

## Audit trail

`GitHub Issue → Requirement → Architecture → Implementation → Testing → Quality Gate → Human Release Approval → Deployment`

**Important:** Human Release Approval authorizes deployment. It does not itself deploy the software.