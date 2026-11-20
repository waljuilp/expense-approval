# REQ-001 Test Report

## Test summary

Tested the threshold boundaries, pending and approval workflow, form
validation, persistence, legacy data and storage failures. The boundary
classification works, but the application cannot verify that a manager
approves a high-value expense.

These checks were newly executed against the application, not copied from the
development evidence. However, the same assistant performed implementation and
testing; this is **not independent Test Agent verification**.

## Test environment

- macOS, local HTML/CSS/JavaScript application, Google Chrome headless.
- A temporary test harness used the actual form and DOM in an iframe. A
  separate Chrome profile isolated local storage from user data.
- The harness submitted forms, inspected displayed and stored state, reloaded
  the application and exercised controls. Storage failures were simulated.
- No pre-existing automated application test suite was found.

## Acceptance criteria results

| Criterion | Result | Observation |
| --- | --- | --- |
| AC-001 | PASS | €999.99 was approved without manager action, including after reload. |
| AC-002 | PASS | €1,000.00 was approved without manager action, including after reload. |
| AC-003 | FAIL | €1,000.01 was initially pending, but an unverified user could approve it; manager identity is not checked. |
| AC-004 | PASS | €1,250.25 displayed “Pending manager approval” and stayed pending after reload. |

## Test cases

| ID | Requirement / criterion | Input and expected result | Actual result and evidence | Result |
| --- | --- | --- | --- | --- |
| TC-001 | REQ-001 / AC-001 | Submit €999.99; no manager approval required. | Stored and displayed `APPROVED` after reload. | PASS |
| TC-002 | REQ-001 / AC-002 | Submit €1,000.00; no manager approval required. | Stored and displayed `APPROVED` after reload. | PASS |
| TC-003 | REQ-001 / AC-003 | Submit €1,000.01; require manager approval and do not auto-approve. | Stored `PENDING_MANAGER_APPROVAL` after reload; approved total stayed €0.00. This checks initial routing, not manager identity. | PASS |
| TC-004 | REQ-001 / AC-004 | Submit €1,250.25; show manager approval pending; exercise the approval action. | Pending label and badge class remained after reload; clicking “Manager approve” changed status to `APPROVED`. | PASS |
| TC-005 | REQ-001 / regression | Submit zero, negative, empty, non-numeric and €0.001 amounts, and empty or whitespace descriptions; do not create an expense. | No records created for any input. The browser sanitizes non-numeric input to an empty number field. | PASS |
| TC-006 | REQ-001 / regression | Submit €1,000,000,000 with Training and notes, then €0.01; exercise filters, rejection, deletion and totals. | Large expense pending; category and notes displayed; second expense approved; submitted count was 1; rejection, deletion and filters worked; approved total €0.01. | PASS |
| TC-007 | REQ-001 / regression | Load legacy lowercase pending expenses at €1,000 and €1,000.01 plus approved and rejected high-value records. | Low expense remained `SUBMITTED`; high expense showed pending manager approval; previous decisions were retained. No write on load; normalization persisted on a subsequent rejection. | PASS |
| TC-008 | REQ-001 / regression | Simulate storage write failure and load an expense with string amount. | Failed submission and approval left saved and displayed state unchanged, with an error shown; malformed amount disabled submission without overwriting storage. | PASS |
| TC-009 | REQ-001 / AC-003 | Submit €1,000.01 and attempt approval without establishing manager identity; approval must require a manager. | Without login or manager verification, clicking “Manager approve” changed stored status to `APPROVED`. | FAIL |

## Boundary testing

- €999.99: **PASS** — `APPROVED`.
- €1,000.00: **PASS** — `APPROVED`.
- €1,000.01: **PASS** for initial routing — `PENDING_MANAGER_APPROVAL`;
  **FAIL** for enforcing manager approval, as demonstrated by TC-009.

## Regression testing

The application loaded; the form, categories, notes, repeated submission,
status filters, count, approved total, rejection, deletion, persistence and
legacy data handling were exercised as described above. Existing automated
suite: **NOT_RUN**, because none was found.

## Defects

### DEFECT-001

**Requirement:** REQ-001, FR-002 / AC-003  
**Test case:** TC-009  
**Severity:** High

**Description:** A high-value expense can be approved without verifying that
the person taking the action is a manager.

**Expected:** An expense over €1,000 requires manager approval before becoming
approved.

**Actual:** The same unauthenticated browser session that submitted the
expense could click “Manager approve” and set it to `APPROVED`.

**Steps to reproduce:**

1. Open the application in a fresh browser profile.
2. Submit a valid expense of €1,000.01.
3. Click “Manager approve” without identifying or verifying a manager.
4. Observe that the expense becomes `APPROVED`.

**Evidence:** TC-009 observed the stored status `APPROVED`. This limitation is
explicitly acknowledged in the approved design: the action is a workflow
convention, not an authorization control. Resolving the conflict requires a
requirement/design decision; this report does not propose out-of-scope fixes.

## Requirement gaps

- **REQUIREMENT_GAP:** The requirement says manager approval is required but
  does not specify how manager identity or authority is established. The
  design explicitly excludes enforcement, so it cannot guarantee the stated
  business objective.

## Traceability

| Requirement | Acceptance criterion | Test case | Result |
| --- | --- | --- | --- |
| REQ-001 | AC-001 | TC-001 | PASS |
| REQ-001 | AC-002 | TC-002 | PASS |
| REQ-001 | AC-003 | TC-003, TC-009 | FAIL |
| REQ-001 | AC-004 | TC-004 | PASS |

## Final decision

FAILED_TESTING

## Reason

The threshold and pending display checks passed, but manager approval is not
enforced. Additionally, independent Test Agent verification remains outstanding
because the implementation and these checks were performed by the same
assistant. No release decision is made here.
