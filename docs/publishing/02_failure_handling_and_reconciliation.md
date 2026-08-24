# 02 - Failure Handling, Credits & State Reconciliation

## 1. Zero-Risk Failure Safety
If the publication pipeline encounters an error at any stage (network drop, deployment timeout, verification failure):
- **Zero Credits Consumed**: The user's payment / publishing credit remains untouched.
- **Draft Preservation**: The working Draft Invite remains completely intact with all changes preserved.
- **User-Facing Clarity**: Shows a clean, reassuring notice:
  > *"We couldn’t publish your Invite right now. Your publish credit was not consumed. Please try again."*

---

## 2. Background Reconciliation for Uncertain States
In edge cases where a payment completes but webhook confirmation is delayed:
- Background reconciliation tasks poll and verify transaction status.
- Once payment is confirmed, the publication pipeline automatically resumes and finalizes the live microsite.
- If payment fails, the transaction is marked aborted and no credits are deducted.

---

## 3. Idempotent Publication Operations
- All publication endpoints are strictly idempotent.
- Rapid duplicate clicks on "Publish" or repeated network requests can never trigger multiple charges or duplicate URL allocations for the same Invite.

---

## 4. Diagnostic Audit Trail
The system internally logs structured diagnostic records for every attempt:
- Invite ID & User ID
- Attempt Timestamp & Correlation ID
- Provisioned URL Target
- Health-check Verification Result
- Entitlement Consumption Status
