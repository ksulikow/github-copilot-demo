---
title: "ADR-0004: new ADR demo"
status: "Proposed"
date: "2026-06-09"
authors: "Kriss Sulikowski"
tags: ["architecture", "decision", "adr", "demo"]
supersedes: ""
superseded_by: ""
---

# ADR-0004: new ADR demo

## Status

**Proposed** | Accepted | Rejected | Superseded | Deprecated

## ADR Approval Process

- **APR-001**: Document owner validates structure, numbering, and template compliance.
- **APR-002**: Stakeholder review confirms decision clarity and rationale completeness.
- **APR-003**: Status changes from Proposed to Accepted after approval.

## Context

- **CTX-001**: A new demo ADR is required to test the next sequential number.
- **CTX-002**: The process must verify that the prompt generates and saves the ADR correctly.

## Decision

- **DEC-001**: Use this internal ADR to validate that the end-to-end ADR workflow works as expected.
- **DEC-002**: Keep sequential naming as the primary convention when existing numeric ADRs are present.

## Consequences

### Positive

- **POS-001**: Confirms sequential ADR numbering continues correctly.
- **POS-002**: Verifies prompt-driven ADR generation and save rules in a real run.
- **POS-003**: Increases confidence in repeatable documentation workflows.

### Negative

- **NEG-001**: Adds a process-focused ADR that is not tied to product architecture change.
- **NEG-002**: Requires additional review effort for validation-oriented documentation.

## Alternatives Considered

### No testing

- **ALT-001**: **Description**: Skip ADR testing and assume the workflow works without validation.
- **ALT-002**: **Rejection Reason**: Rejected because confidence in workflow correctness would remain low.

## Implementation Notes

- **IMP-001**: Existing sequential ADR files were detected, so the next valid identifier is `0004`.
- **IMP-002**: The file is saved in the canonical ADR path with a title-matching slug.
- **IMP-003**: Front matter includes required `date` and `status` fields.

## References

- **REF-001**: docs/ADRs/adr-template.md
- **REF-002**: .github/prompts/write-adr.prompt.md

<!-- © Capgemini 2025 -->