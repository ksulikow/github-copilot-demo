# Library App

Single-page library management application with:

- Angular SPA frontend
- Node.js + Express + TypeScript REST API backend
- Local SQLite database persistence

## Features

- Book catalog CRUD
- Search and availability filtering
- Borrow books with borrower details and due date
- Return books and automatic availability updates
- Active and returned loan tracking

## Prerequisites

- Node.js 20+ (LTS recommended)

## Project Structure

- `library-app/backend`: REST API and database scripts
- `library-app/frontend`: Angular single-page application

## Backend Setup

1. Go to backend:
```bash
cd library-app/backend
```
2. Copy environment file:
```bash
copy .env.example .env
```
3. Optional: update `DB_FILE` in `.env` if you want the database file in a different location.
4. Initialize database schema and seed data:
```bash
npm run db:init
```
5. Start API in development mode:
```bash
npm run dev
```

Backend runs at `http://localhost:3000`.

## Frontend Setup

1. Go to frontend:
```bash
cd library-app/frontend
```
2. Start Angular dev server:
```bash
npm start
```

Frontend runs at `http://localhost:4200`.

## Useful Commands

### Backend

```bash
npm run typecheck
npm run build
npm run start
```

### Frontend

```bash
npm run build
npm test
```

## API Endpoints

- `GET /api/v1/health`
- `GET /api/v1/books`
- `GET /api/v1/books/:id`
- `POST /api/v1/books`
- `PUT /api/v1/books/:id`
- `DELETE /api/v1/books/:id`
- `GET /api/v1/loans`
- `POST /api/v1/loans/borrow`
- `POST /api/v1/loans/:id/return`

## Notes

- CORS is enabled for local development.
- Books are soft deleted (archived).
- Borrow and return flows run in SQL transactions to keep inventory state consistent.
- SQLite database file defaults to `library-app/backend/data/library.db`.
