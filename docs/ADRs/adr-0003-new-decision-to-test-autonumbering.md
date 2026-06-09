---
title: "ADR-0003: New Decision to test autonumbering"
status: "Proposed"
date: "2026-06-09"
authors: "Kriss Sulikowski"
tags: ["architecture", "decision", "autonumbering", "adr"]
supersedes: ""
superseded_by: ""
---

# ADR-0003: New Decision to test autonumbering

## Status

**Proposed** | Accepted | Rejected | Superseded | Deprecated

## ADR Approval Process

- **APR-001**: Document owner validates completeness and naming-rule compliance.
- **APR-002**: Stakeholder review confirms the decision supports repository documentation standards.
- **APR-003**: Upon approval, status is changed from Proposed to Accepted.

## Context

- **CTX-001**: Autonumbering was configured recently and needs verification in a real ADR creation flow.
- **CTX-002**: The repository uses a preferred sequential ADR naming convention when sequence is discoverable.
- **CTX-003**: Verification should ensure the next monotonically increasing identifier is applied correctly.

## Decision

- **DEC-001**: Autonumbering should be used for ADR filenames when sequential ADR files exist.
- **DEC-002**: The generated file should use the next computed sequence value in the form `adr-NNNN-[slug].md`.

## Consequences

### Positive

- **POS-001**: Maintains a predictable and sortable ADR history.
- **POS-002**: Improves discoverability for people and tools that rely on numeric ADR identifiers.
- **POS-003**: Reduces ambiguity compared to multiple timestamp filename variants.

### Negative

- **NEG-001**: Requires sequence discovery logic before save operations.
- **NEG-002**: Can lead to contention if multiple ADRs are created concurrently without coordination.
- **NEG-003**: Needs governance to avoid accidental gaps or duplicate numbers.

## Alternatives Considered

### DateTime stamp

- **ALT-001**: **Description**: Name ADR files with a date or date-time prefix.
- **ALT-002**: **Rejection Reason**: Rejected because it is less efficient for strict sequential tracking and review workflows.

## Implementation Notes

- **IMP-001**: Existing sequential ADR files were detected (`0001` and `0002`), so the next valid number is `0003`.
- **IMP-002**: The ADR is saved in the canonical path `docs/ADRs/` with a title-aligned slug.
- **IMP-003**: Front matter date is set to 2026-06-09 and status is present as required.

## References

- **REF-001**: docs/ADRs/adr-template.md
- **REF-002**: .github/prompts/write-adr.prompt.md
- **REF-003**: .github/instructions/docs.instructions.md

<!-- © Capgemini 2025 -->