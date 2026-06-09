---
title: "ADR-0001: Sequential naming bootstrap"
status: "Proposed"
date: "2026-06-09"
authors: "Kriss Sulikowski"
tags: ["architecture", "decision", "copilot", "prompting"]
supersedes: ""
superseded_by: ""
---

# ADR-0001: Sequential naming bootstrap

## Status

**Proposed** | Accepted | Rejected | Superseded | Deprecated

## Context

- **CTX-001**: The ADR directory currently has timestamp-based ADR files and no sequentially numbered ADRs.
- **CTX-002**: A numbered baseline is needed to verify monotonic sequence generation in future ADR creation.
- **CTX-003**: The team wants a deterministic naming pattern to improve indexing and discovery.

## Decision

- **DEC-001**: Introduce `adr-0001-sequential-naming-bootstrap.md` as the initial sequential ADR entry.
- **DEC-002**: Treat this file as the numbering baseline for subsequent ADR sequence checks.

## Consequences

### Positive

- **POS-001**: Enables direct validation of next-number computation (`0002`, `0003`, and onward).
- **POS-002**: Improves consistency for tools that parse ADR identifiers.

### Negative

- **NEG-001**: Adds one process-only ADR that is not tied to a product architecture change.
- **NEG-002**: Requires team agreement on keeping both timestamp and sequential files in history.

## Alternatives Considered

### Continue with timestamp-only ADR naming

- **ALT-001**: **Description**: Keep generating ADRs only with date-based filenames.
- **ALT-002**: **Rejection Reason**: Rejected because it does not validate sequential increment behavior.

## Implementation Notes

- **IMP-001**: Keep this ADR in `docs/ADRs/` to preserve canonical location.
- **IMP-002**: Use four-digit numbering format to match repository prompt rules.

## References

- **REF-001**: docs/ADRs/adr-template.md
- **REF-002**: .github/prompts/write-adr.prompt.md

<!-- © Capgemini 2025 -->