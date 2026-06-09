# Plan: Library Books Web App

Build a full-stack single-page library management app using Angular (frontend), Node.js + Express + TypeScript (backend), and local SQLite (SQL persistence). Scope includes book catalog CRUD plus borrow/return workflows and availability tracking, with no authentication in v1.

## Steps

1. Phase 1: Project bootstrap and architecture baseline
2. Define mono-repo layout with separate backend and frontend apps and shared API contract notes. Backend and frontend setup can run in parallel after folder structure is agreed.
3. Initialize backend Node.js TypeScript service with Express, validation, ORM/query layer, and environment configuration for local SQLite.
4. Initialize Angular SPA with routing, HTTP client integration, and app-wide state/service structure for books and circulation views.
5. Create initial architecture decision and implementation notes aligned with repository documentation standards.
6. Phase 2: Data model and REST contract
7. Design SQL schema for books, borrowers, loans, and audit timestamps; define constraints, indexes, and status logic. This blocks API implementation.
8. Create migration/seed strategy for local setup (sample books and borrowers for demo/testing).
9. Define REST API endpoints and request/response shapes for books CRUD, search/filter/pagination, borrow, return, and loan history.
10. Add input validation and standardized error response schema; define business rules (no borrow when unavailable, no duplicate active loan per borrower/book pair).
11. Phase 3: Backend implementation
12. Implement DB connection/pool and repositories/services for books and loans.
13. Implement controllers/routes for:
14. Books: create, list with filters, get by id, update, delete (soft delete preferred for referential integrity)
15. Circulation: borrow book, return book, list active loans, list overdue (if due date policy included)
16. Implement transactional operations for borrow/return to keep inventory and loan rows consistent.
17. Add centralized error handling, request logging, and health endpoint.
18. Phase 4: Frontend SPA implementation
19. Build pages/components: dashboard, books list, book form (create/edit), book detail, active loans, borrow/return dialogs.
20. Implement Angular services for API communication and typed models matching backend contracts.
21. Add reactive forms with client-side validation and clear server error display.
22. Implement filtering, sorting, pagination UX for catalog and loan lists.
23. Add basic responsive layout and accessibility checks.
24. Phase 5: Quality, testing, and developer workflow
25. Backend tests: unit tests for business rules and integration tests for API routes with test database.
26. Frontend tests: component and service tests for key flows (create/edit/borrow/return/search).
27. Add end-to-end smoke scenarios for core user journeys.
28. Add scripts for local run, test, lint, and DB migration/seed orchestration.
29. Verify coverage against repository policy and update docs for setup/run/troubleshooting.
30. Phase 6: Documentation and handoff
31. Add concise README sections: prerequisites, local SQLite setup, environment variables, startup commands, API overview, and known limitations.
32. Add ADR describing chosen architecture and trade-offs (Angular + Express + SQLite, no auth in v1, transaction strategy).
33. Capture future backlog: auth/roles, reservation queue, fines, notifications, reporting.

## Relevant files

- c:/Users/KRSULIKO/source/repos/ksulikow/github-copilot-demo/.github/copilot-instructions.md — enforce branch, commit, PR, and quality policy decisions
- c:/Users/KRSULIKO/source/repos/ksulikow/github-copilot-demo/.github/instructions/backend.instructions.md — backend coding and architecture conventions
- c:/Users/KRSULIKO/source/repos/ksulikow/github-copilot-demo/.github/instructions/frontend.instructions.md — frontend quality and accessibility conventions
- c:/Users/KRSULIKO/source/repos/ksulikow/github-copilot-demo/.github/instructions/docs.instructions.md — documentation structure and style
- c:/Users/KRSULIKO/source/repos/ksulikow/github-copilot-demo/docs/ADRs/adr-template.md — ADR structure for architecture decision
- c:/Users/KRSULIKO/source/repos/ksulikow/github-copilot-demo/README.md — top-level setup and usage documentation updates
- New app subtree to create: /library-app/backend and /library-app/frontend

## Verification

1. Backend validation
2. Run lint/typecheck/test for backend; verify API responses for success and failure cases.
3. Validate transactional correctness with concurrent borrow attempts.
4. Frontend validation
5. Run lint/test/build for Angular app and manually verify CRUD + borrow/return workflows.
6. Confirm responsive behavior on desktop and mobile widths.
7. Integration validation
8. Start both apps with local SQLite and run end-to-end smoke tests for: create book, borrow book, return book, search/filter.
9. Confirm DB state transitions are correct after each operation.
10. Documentation and policy validation
11. Ensure setup docs allow a clean machine to run the app.
12. Run repository policy/coverage scripts where applicable.

## Decisions

- Confirmed stack: Node.js + Express + TypeScript backend, Angular SPA frontend.
- Confirmed persistence: local SQLite file.
- Confirmed v1 security scope: no authentication.
- Confirmed feature scope: include borrow/return workflows and availability tracking.
- Included scope: book catalog + circulation core.
- Excluded scope (v1): multi-branch libraries, fines/payments, notifications, external integrations.

## Further Considerations

1. Borrowing policy detail to finalize before implementation: fixed loan duration (for example 14 days) vs configurable duration stored per loan.
2. Data retention strategy: hard delete books vs soft delete with archival status (recommended soft delete).
3. API versioning choice: start with /api/v1 from day one (recommended) to prevent early breaking changes.
