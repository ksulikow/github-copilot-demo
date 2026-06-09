export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number | null;
  totalCopies: number;
  availableCopies: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookListResponse {
  page: number;
  pageSize: number;
  total: number;
  data: Book[];
}

export interface Loan {
  id: number;
  bookId: number;
  bookTitle: string;
  borrowerId: number;
  borrowerName: string;
  borrowerEmail: string;
  borrowedAt: string;
  dueDate: string;
  returnedAt: string | null;
  status: 'ACTIVE' | 'RETURNED';
  isOverdue: boolean;
}

export interface BookPayload {
  title: string;
  author: string;
  isbn: string;
  publishedYear: number | null;
  totalCopies: number;
}

export interface BorrowPayload {
  bookId: number;
  borrowerName: string;
  borrowerEmail: string;
  dueDate?: string;
}
