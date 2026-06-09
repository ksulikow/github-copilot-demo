---
title: "ADR-20260609: New ADR to test the prompt"
status: "Proposed"
date: "2026-06-09"
authors: "Kriss Sulikowski"
tags: ["architecture", "decision", "copilot", "prompting"]
supersedes: ""
superseded_by: ""
---

# ADR-20260609: New ADR to test the prompt

## Status

**Proposed** | Accepted | Rejected | Superseded | Deprecated

## ADR Approval Process

- **APR-001**: Document owner reviews technical completeness and clarity.
- **APR-002**: Relevant stakeholders validate alignment with learning goals.
- **APR-003**: Upon approval, status is updated from Proposed to Accepted.

## Context

- **CTX-001**: This ADR supports a demo for prompts in the repository.
- **CTX-002**: The goal is to validate a repeatable process for generating ADRs with structured inputs.
- **CTX-003**: The decision should be easy to parse by tools and easy to read by humans.

## Decision

- **DEC-001**: Adopt Copilot-assisted ADR authoring as the primary method for this prompt demo.
- **DEC-002**: Use the repository ADR template and enforce required input validation before generation.
- **DEC-003**: Save ADRs in docs/ADRs with validated naming conventions and complete front matter.

## Consequences

### Positive

- **POS-001**: Improves consistency of ADR structure across prompt-generated outputs.
- **POS-002**: Reduces effort needed to produce draft architecture decisions during demos.
- **POS-003**: Increases traceability by requiring explicit context, decision, alternatives, and stakeholders.

### Negative

- **NEG-001**: Introduces process overhead when gathering complete inputs before writing.
- **NEG-002**: May produce generic outcomes if users provide minimal detail.
- **NEG-003**: Requires ongoing maintenance of prompt instructions and templates.

## Alternatives Considered

### Testing

- **ALT-001**: **Description**: Validate the demo by relying on generic testing activities without creating a formal ADR.
- **ALT-002**: **Rejection Reason**: Rejected as too expensive for this demo scope and less effective for documenting architectural rationale.

## Implementation Notes

- **IMP-001**: Use decision title "New ADR to test the prompt" to derive branch and file slug.
- **IMP-002**: Apply timestamp-based filename fallback because no sequential ADR files were found.
- **IMP-003**: Keep status as Proposed until explicit reviewer approval is recorded.

## References

- **REF-001**: docs/ADRs/adr-template.md
- **REF-002**: .github/prompts/write-adr.prompt.md
- **REF-003**: .github/instructions/docs.instructions.md

<!-- © Capgemini 2025 -->