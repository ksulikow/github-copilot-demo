INSERT INTO books (title, author, isbn, published_year, total_copies, available_copies)
VALUES
  ('Clean Code', 'Robert C. Martin', '9780132350884', 2008, 3, 3),
  ('Domain-Driven Design', 'Eric Evans', '9780321125217', 2003, 2, 2),
  ('The Pragmatic Programmer', 'Andrew Hunt', '9780135957059', 2019, 4, 4)
ON CONFLICT(isbn) DO UPDATE SET
  title = excluded.title,
  author = excluded.author,
  published_year = excluded.published_year,
  total_copies = excluded.total_copies,
  available_copies = excluded.available_copies;

INSERT INTO borrowers (name, email)
VALUES
  ('Alice Reader', 'alice@example.com'),
  ('Bob Borrower', 'bob@example.com')
ON CONFLICT(email) DO UPDATE SET
  name = excluded.name;
