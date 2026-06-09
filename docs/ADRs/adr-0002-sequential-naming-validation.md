---
title: "ADR-0002: Sequential naming validation"
status: "Proposed"
date: "2026-06-09"
authors: "Kriss Sulikowski"
tags: ["architecture", "decision", "copilot", "prompting"]
supersedes: "adr-0001-sequential-naming-bootstrap.md"
superseded_by: ""
---

# ADR-0002: Sequential naming validation

## Status

**Proposed** | Accepted | Rejected | Superseded | Deprecated

## Context

- **CTX-001**: `ADR-0001` establishes a sequential baseline for naming.
- **CTX-002**: A follow-up ADR is needed to verify that next-number derivation increments to `0002`.

## Decision

- **DEC-001**: Create `adr-0002-sequential-naming-validation.md` as the next sequential ADR.
- **DEC-002**: Use this result as proof that sequential numbering can now be computed from existing files.

## Consequences

### Positive

- **POS-001**: Confirms monotonic sequence behavior in the ADR workflow.
- **POS-002**: Reduces ambiguity when deciding between sequential and timestamp naming.

### Negative

- **NEG-001**: Adds a second process-focused ADR used primarily for workflow verification.
- **NEG-002**: Requires maintainers to keep naming guidance clear to avoid mixed conventions.

## Alternatives Considered

### Generate another timestamped ADR

- **ALT-001**: **Description**: Create a second ADR with date-based naming only.
- **ALT-002**: **Rejection Reason**: Rejected because it would not validate sequential increment behavior.

## Implementation Notes

- **IMP-001**: Keep numbering contiguous and four digits (`0001`, `0002`).
- **IMP-002**: Future ADR creation should now prefer `adr-NNNN-*.md` when sequence is discoverable.

## References

- **REF-001**: docs/ADRs/adr-template.md
- **REF-002**: docs/ADRs/adr-0001-sequential-naming-bootstrap.md
- **REF-003**: .github/prompts/write-adr.prompt.md

<!-- © Capgemini 2025 -->