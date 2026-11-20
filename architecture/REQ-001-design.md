# REQ-001 technical design

## Scope and design decision

Apply the threshold when a valid expense is submitted. Automatically approve
expenses at or below €1,000; mark expenses above €1,000 as awaiting manager
approval. Automatic approval is permitted, rather than mandated, by REQ-001;
this design chooses it to provide a complete, simple flow.

The existing application has no accounts, roles or trusted server. The
manager-approval action is therefore a **workflow convention**, not an
enforced authorization control: anyone with access to the page or its local
storage can approve or modify an expense. The design assumes that a manager
operates that action. It cannot guarantee that a manager actually reviewed
the expense; do not represent it as a secure approval system. Authentication,
backend enforcement and audit trails are outside REQ-001's stated scope.

## Existing implementation

- `index.html` supplies the form, status filters and summary.
- `app.js` validates input, creates every expense as `SUBMITTED`, saves the
  list in `localStorage`, renders statuses and handles approve/reject/delete.
- `styles.css` styles the status badges. There is no existing automated test
  suite or test runner.

## Proposed changes

### State and business logic

- Keep the existing expense shape, storage key and euro-valued `amount`. Add
  `PENDING_MANAGER_APPROVAL` to the possible `status` values; no separate
  approval flag is needed.
- In the submit handler, after the existing validation, use the direct
  comparison `amount > 1000`: select `PENDING_MANAGER_APPROVAL` when true,
  otherwise `APPROVED`. Compare the entered amount, not a rounded display
  value. The existing number field accepts positive amounts in cent steps.
- For a pending-manager expense, expose a clearly labelled **Manager approve**
  action that changes its status to `APPROVED`; retain rejection to `REJECTED`
  and deletion. Handle the new status in both rendering and the delegated
  click handler. No approval action may automatically transition it on submit.
- Keep the existing save-before-render behavior: if storage fails, report the
  error and leave in-memory state, form and displayed status unchanged.
- Preserve existing validation, categories, notes, deletion, filters and
  approved-total calculation. An automatically approved expense is included
  in that total immediately after successful saving.

### Existing data

- Keep existing approved and rejected records unchanged; do not retrospectively
  approve or reopen them. For existing `SUBMITTED` records, retain low-value
  records as submitted; treat records over €1,000 as
  `PENDING_MANAGER_APPROVAL` on load. Apply this after the existing mapping of
  legacy lowercase statuses. This prevents an old high-value submission from
  appearing as an ordinary submission.
- Perform this normalization in memory without writing during load. The next
  successful mutation persists the normalized data through the existing save
  path; reloading before then deterministically normalizes it again. Preserve
  every other field. Do not silently classify malformed saved amounts as
  low-value: surface a load error using the existing storage-error path and
  disable changes, without overwriting stored data.

### UI

- In `renderItem`, show `PENDING_MANAGER_APPROVAL` as **Pending manager
  approval**, with a matching pending badge style in `styles.css`. Keep other
  status labels and controls intact.
- Keep the existing **Submitted** filter and submitted count meaningful for
  both legacy `SUBMITTED` and `PENDING_MANAGER_APPROVAL` expenses. The
  **Approved** and **Rejected** filters continue to match their own statuses.
- Preserve the current responsive layout and accessible native buttons.
  Update `index.html` only if needed for clear filter or summary wording.

## Acceptance criteria and verification

Use focused browser tests against the actual form and persisted list, including
a reload. Clear or isolate test storage; do not overwrite real user data.

| Criterion | Planned implementation | Test |
| --- | --- | --- |
| AC-001 | `amount > 1000` is false at €999.99; save as `APPROVED`. | Submit €999.99; verify approved status, no pending-manager status, and persistence after reload. |
| AC-002 | The comparison is strictly greater than, not greater than or equal to. | Submit €1,000.00; verify the same approved outcome and persistence. |
| AC-003 | €1,000.01 selects `PENDING_MANAGER_APPROVAL` and is not automatically approved. | Submit €1,000.01; verify pending status, no approved total contribution, and persistence after reload. |
| AC-004 | Render the pending-manager status with explicit text and provide a manager-labelled approval action. | Verify the visible pending label after submission and reload; activate Manager approve and verify `APPROVED`. |

Also test zero, negative and missing amounts, blank or whitespace-only
descriptions, and cent-step validation; verify no expense is created.
Test rejection and deletion of a pending-manager expense, submitted filtering
and count, approved total, and failed storage writes. Seed legacy submitted
expenses on both sides of the threshold plus approved/rejected expenses;
verify normalization, preservation and reload behavior, including legacy
lowercase statuses. Verify malformed saved amounts produce an explicit error
without data loss.

## Risks and limitations

- **Authorization:** the manager action is not restricted or independently
  verifiable. Real enforcement requires trusted identity and server-side
  authorization, which are outside this design.
- **Stored history:** previously approved high-value expenses remain approved;
  no retroactive manager review is implied.
- **Currency precision:** compare the entered valid euro value directly against
  `1000`; never compare formatted strings or round before the threshold test.
- **Storage:** browser storage is local to the browser and can fail or be
  modified; preserve the existing explicit error handling and avoid overwrites
  on invalid data.

## Architecture decision

**Decision:** READY_FOR_IMPLEMENTATION

**Reason:** The requirement is sufficiently defined, the affected components have been identified, and there are no blocking architecture questions.
