import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { getDb } from "./db";
import { bookPayloadSchema, borrowPayloadSchema, listBooksQuerySchema, loansQuerySchema } from "./validation";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

interface BookRow {
  id: number;
  title: string;
  author: string;
  isbn: string;
  published_year: number | null;
  total_copies: number;
  available_copies: number;
  is_archived: number;
  created_at: string;
  updated_at: string;
}

interface LoanRow {
  id: number;
  book_id: number;
  book_title: string;
  borrower_id: number;
  borrower_name: string;
  borrower_email: string;
  borrowed_at: string;
  due_date: string;
  returned_at: string | null;
  status: "ACTIVE" | "RETURNED";
}

const mapBook = (row: BookRow) => ({
  id: row.id,
  title: row.title,
  author: row.author,
  isbn: row.isbn,
  publishedYear: row.published_year,
  totalCopies: row.total_copies,
  availableCopies: row.available_copies,
  isArchived: Boolean(row.is_archived),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapLoan = (row: LoanRow) => ({
  id: row.id,
  bookId: row.book_id,
  bookTitle: row.book_title,
  borrowerId: row.borrower_id,
  borrowerName: row.borrower_name,
  borrowerEmail: row.borrower_email,
  borrowedAt: row.borrowed_at,
  dueDate: row.due_date,
  returnedAt: row.returned_at,
  status: row.status,
  isOverdue: row.status === "ACTIVE" && new Date(row.due_date) < new Date(),
});

const isSqliteDuplicateError = (error: unknown) =>
  error instanceof Error
  && "code" in error
  && typeof (error as { code?: string }).code === "string"
  && (error as { code?: string }).code?.startsWith("SQLITE_CONSTRAINT");

app.get("/api/v1/health", async (_req, res, next) => {
  try {
    const db = await getDb();
    const row = await db.get<{ ok: number }>("SELECT 1 AS ok");
    res.json({ status: "ok", db: row?.ok === 1 ? "connected" : "unknown" });
  } catch (error) {
    next(error);
  }
});

app.get("/api/v1/books", async (req, res, next) => {
  try {
    const db = await getDb();
    const query = listBooksQuerySchema.parse(req.query);
    const offset = (query.page - 1) * query.pageSize;

    const whereParts: string[] = ["is_archived = 0"];
    const values: Array<string | number> = [];

    if (query.search) {
      whereParts.push("(title LIKE ? OR author LIKE ? OR isbn LIKE ?)");
      const search = `%${query.search}%`;
      values.push(search, search, search);
    }

    if (query.availableOnly) {
      whereParts.push("available_copies > 0");
    }

    const where = whereParts.join(" AND ");

    const countRow = await db.get<{ total: number }>(
      `SELECT COUNT(*) AS total FROM books WHERE ${where}`,
      ...values,
    );

    const rows = await db.all<BookRow[]>(
      `SELECT * FROM books WHERE ${where} ORDER BY title LIMIT ? OFFSET ?`,
      [...values, query.pageSize, offset],
    );

    res.json({
      page: query.page,
      pageSize: query.pageSize,
      total: Number(countRow?.total ?? 0),
      data: rows.map(mapBook),
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/v1/books/:id", async (req, res, next) => {
  try {
    const db = await getDb();
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ message: "Invalid book id." });
      return;
    }

    const rows = await db.all<BookRow[]>(
      "SELECT * FROM books WHERE id = ? AND is_archived = 0 LIMIT 1",
      [id],
    );

    if (!rows.length) {
      res.status(404).json({ message: "Book not found." });
      return;
    }

    res.json(mapBook(rows[0]));
  } catch (error) {
    next(error);
  }
});

app.post("/api/v1/books", async (req, res, next) => {
  try {
    const db = await getDb();
    const payload = bookPayloadSchema.parse(req.body);

    const result = await db.run(
      "INSERT INTO books (title, author, isbn, published_year, total_copies, available_copies) VALUES (?, ?, ?, ?, ?, ?)",
      [payload.title, payload.author, payload.isbn, payload.publishedYear ?? null, payload.totalCopies, payload.totalCopies],
    );

    const rows = await db.all<BookRow[]>("SELECT * FROM books WHERE id = ?", [result.lastID]);
    res.status(201).json(mapBook(rows[0]));
  } catch (error) {
    next(error);
  }
});

app.put("/api/v1/books/:id", async (req, res, next) => {
  try {
    const db = await getDb();
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ message: "Invalid book id." });
      return;
    }

    const payload = bookPayloadSchema.parse(req.body);

    const existingRows = await db.all<BookRow[]>(
      "SELECT * FROM books WHERE id = ? AND is_archived = 0 LIMIT 1",
      [id],
    );

    if (!existingRows.length) {
      res.status(404).json({ message: "Book not found." });
      return;
    }

    const existing = existingRows[0];
    const borrowedCopies = existing.total_copies - existing.available_copies;
    if (payload.totalCopies < borrowedCopies) {
      res.status(400).json({ message: "totalCopies cannot be less than currently borrowed copies." });
      return;
    }

    const newAvailable = payload.totalCopies - borrowedCopies;

    await db.run(
      "UPDATE books SET title = ?, author = ?, isbn = ?, published_year = ?, total_copies = ?, available_copies = ? WHERE id = ?",
      [
        payload.title,
        payload.author,
        payload.isbn,
        payload.publishedYear ?? null,
        payload.totalCopies,
        newAvailable,
        id,
      ],
    );

    const rows = await db.all<BookRow[]>("SELECT * FROM books WHERE id = ?", [id]);
    res.json(mapBook(rows[0]));
  } catch (error) {
    next(error);
  }
});

app.delete("/api/v1/books/:id", async (req, res, next) => {
  try {
    const db = await getDb();
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ message: "Invalid book id." });
      return;
    }

    const result = await db.run(
      "UPDATE books SET is_archived = 1 WHERE id = ? AND is_archived = 0",
      [id],
    );

    if (!result.changes) {
      res.status(404).json({ message: "Book not found." });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.get("/api/v1/loans", async (req, res, next) => {
  try {
    const db = await getDb();
    const query = loansQuerySchema.parse(req.query);
    const whereParts: string[] = [];
    const params: Array<string | number> = [];

    if (query.status) {
      whereParts.push("l.status = ?");
      params.push(query.status);
    }

    if (query.overdueOnly) {
      whereParts.push("l.status = 'ACTIVE' AND l.due_date < date('now')");
    }

    const whereClause = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";

    const rows = await db.all<LoanRow[]>(
      `SELECT l.id, l.book_id, b.title AS book_title, l.borrower_id, br.name AS borrower_name,
              br.email AS borrower_email, l.borrowed_at, l.due_date, l.returned_at, l.status
       FROM loans l
       INNER JOIN books b ON b.id = l.book_id
       INNER JOIN borrowers br ON br.id = l.borrower_id
       ${whereClause}
       ORDER BY l.borrowed_at DESC`,
      ...params,
    );

    res.json(rows.map(mapLoan));
  } catch (error) {
    next(error);
  }
});

app.post("/api/v1/loans/borrow", async (req, res, next) => {
  try {
    const db = await getDb();
    const payload = borrowPayloadSchema.parse(req.body);
    await db.exec("BEGIN IMMEDIATE TRANSACTION");

    const bookRows = await db.all<BookRow[]>(
      "SELECT * FROM books WHERE id = ? AND is_archived = 0 LIMIT 1",
      [payload.bookId],
    );

    if (!bookRows.length) {
      await db.exec("ROLLBACK");
      res.status(404).json({ message: "Book not found." });
      return;
    }

    const book = bookRows[0];
    if (book.available_copies <= 0) {
      await db.exec("ROLLBACK");
      res.status(400).json({ message: "No copies available for borrowing." });
      return;
    }

    const borrower = await db.get<{ id: number }>("SELECT id FROM borrowers WHERE email = ? LIMIT 1", payload.borrowerEmail);

    let borrowerId: number;
    if (!borrower?.id) {
      const borrowerInsert = await db.run(
        "INSERT INTO borrowers (name, email) VALUES (?, ?)",
        [payload.borrowerName, payload.borrowerEmail],
      );
      borrowerId = Number(borrowerInsert.lastID);
    } else {
      borrowerId = Number(borrower.id);
      await db.run("UPDATE borrowers SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [payload.borrowerName, borrowerId]);
    }

    const activeLoanRows = await db.all<{ id: number }[]>(
      "SELECT id FROM loans WHERE book_id = ? AND borrower_id = ? AND status = 'ACTIVE' LIMIT 1",
      [payload.bookId, borrowerId],
    );

    if (activeLoanRows.length) {
      await db.exec("ROLLBACK");
      res.status(409).json({ message: "Borrower already has an active loan for this book." });
      return;
    }

    const dueDate = payload.dueDate ?? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const loanInsert = await db.run(
      "INSERT INTO loans (book_id, borrower_id, due_date, status) VALUES (?, ?, ?, 'ACTIVE')",
      [payload.bookId, borrowerId, dueDate],
    );

    await db.run("UPDATE books SET available_copies = available_copies - 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [payload.bookId]);

    await db.exec("COMMIT");

    const loanRows = await db.all<LoanRow[]>(
      `SELECT l.id, l.book_id, b.title AS book_title, l.borrower_id, br.name AS borrower_name,
              br.email AS borrower_email, l.borrowed_at, l.due_date, l.returned_at, l.status
       FROM loans l
       INNER JOIN books b ON b.id = l.book_id
       INNER JOIN borrowers br ON br.id = l.borrower_id
       WHERE l.id = ?`,
      [loanInsert.lastID],
    );

    res.status(201).json(mapLoan(loanRows[0]));
  } catch (error) {
    try {
      const db = await getDb();
      await db.exec("ROLLBACK");
    } catch {
      // Ignore rollback failures after transaction is already closed.
    }
    next(error);
  }
});

app.post("/api/v1/loans/:id/return", async (req, res, next) => {
  try {
    const db = await getDb();
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ message: "Invalid loan id." });
      return;
    }

    await db.exec("BEGIN IMMEDIATE TRANSACTION");

    const loanRows = await db.all<{ id: number; book_id: number; status: "ACTIVE" | "RETURNED" }[]>(
      "SELECT id, book_id, status FROM loans WHERE id = ? LIMIT 1",
      [id],
    );

    if (!loanRows.length) {
      await db.exec("ROLLBACK");
      res.status(404).json({ message: "Loan not found." });
      return;
    }

    const loan = loanRows[0];

    if (loan.status !== "ACTIVE") {
      await db.exec("ROLLBACK");
      res.status(409).json({ message: "Loan is already returned." });
      return;
    }

    await db.run(
      "UPDATE loans SET status = 'RETURNED', returned_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [id],
    );
    await db.run("UPDATE books SET available_copies = available_copies + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [loan.book_id]);

    await db.exec("COMMIT");

    const rows = await db.all<LoanRow[]>(
      `SELECT l.id, l.book_id, b.title AS book_title, l.borrower_id, br.name AS borrower_name,
              br.email AS borrower_email, l.borrowed_at, l.due_date, l.returned_at, l.status
       FROM loans l
       INNER JOIN books b ON b.id = l.book_id
       INNER JOIN borrowers br ON br.id = l.borrower_id
       WHERE l.id = ?`,
      [id],
    );

    res.json(mapLoan(rows[0]));
  } catch (error) {
    try {
      const db = await getDb();
      await db.exec("ROLLBACK");
    } catch {
      // Ignore rollback failures after transaction is already closed.
    }
    next(error);
  }
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ message: "Validation error", issues: error.issues });
    return;
  }

  if (isSqliteDuplicateError(error)) {
    res.status(409).json({ message: "Duplicate value conflicts with existing data." });
    return;
  }

  console.error(error);
  res.status(500).json({ message: "Internal server error." });
});

app.listen(port, () => {
  console.log(`Library API listening on port ${port}`);
});
