import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { LibraryApiService } from './library-api.service';
import { Book, BookPayload, Loan } from './models';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly api = inject(LibraryApiService);
  private readonly fb = inject(FormBuilder);

  protected books: Book[] = [];
  protected loans: Loan[] = [];
  protected loading = false;
  protected activeOnly = true;
  protected availableOnly = false;
  protected search = '';
  protected errorMessage = '';
  protected successMessage = '';
  protected editingBookId: number | null = null;

  protected readonly bookForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    author: ['', [Validators.required, Validators.maxLength(255)]],
    isbn: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]],
    publishedYear: [null as number | null],
    totalCopies: [1, [Validators.required, Validators.min(0)]],
  });

  protected readonly borrowForm = this.fb.group({
    bookId: [0, [Validators.required, Validators.min(1)]],
    borrowerName: ['', [Validators.required, Validators.maxLength(255)]],
    borrowerEmail: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    dueDate: [''],
  });

  ngOnInit(): void {
    this.reloadAll();
  }

  protected reloadAll(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.api
      .getBooks(this.search, this.availableOnly)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (booksResponse) => {
          this.books = booksResponse.data;
          this.loadLoans();
        },
        error: (error) => {
          this.errorMessage = error.error?.message ?? 'Failed to load books.';
        },
      });
  }

  protected loadLoans(): void {
    this.api.listLoans(this.activeOnly).subscribe({
      next: (loans) => {
        this.loans = loans;
      },
      error: (error) => {
        this.errorMessage = error.error?.message ?? 'Failed to load loans.';
      },
    });
  }

  protected applyFilters(searchInput: string): void {
    this.search = searchInput;
    this.reloadAll();
  }

  protected toggleAvailabilityOnly(): void {
    this.availableOnly = !this.availableOnly;
    this.reloadAll();
  }

  protected toggleActiveLoansOnly(): void {
    this.activeOnly = !this.activeOnly;
    this.loadLoans();
  }

  protected selectBookForBorrowing(bookId: number): void {
    this.borrowForm.patchValue({ bookId });
  }

  protected startEdit(book: Book): void {
    this.editingBookId = book.id;
    this.bookForm.patchValue({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publishedYear: book.publishedYear,
      totalCopies: book.totalCopies,
    });
  }

  protected cancelEdit(): void {
    this.editingBookId = null;
    this.bookForm.reset({ totalCopies: 1, publishedYear: null });
  }

  protected saveBook(): void {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    const payload = this.bookForm.getRawValue() as BookPayload;
    this.errorMessage = '';

    const request$ = this.editingBookId
      ? this.api.updateBook(this.editingBookId, payload)
      : this.api.createBook(payload);

    request$.subscribe({
      next: () => {
        this.successMessage = this.editingBookId ? 'Book updated.' : 'Book created.';
        this.cancelEdit();
        this.reloadAll();
      },
      error: (error) => {
        this.errorMessage = error.error?.message ?? 'Failed to save book.';
      },
    });
  }

  protected archiveBook(id: number): void {
    this.errorMessage = '';
    this.api.deleteBook(id).subscribe({
      next: () => {
        this.successMessage = 'Book archived.';
        this.reloadAll();
      },
      error: (error) => {
        this.errorMessage = error.error?.message ?? 'Failed to archive book.';
      },
    });
  }

  protected borrowBook(): void {
    if (this.borrowForm.invalid) {
      this.borrowForm.markAllAsTouched();
      return;
    }

    const values = this.borrowForm.getRawValue();
    const payload = {
      bookId: Number(values.bookId),
      borrowerName: values.borrowerName ?? '',
      borrowerEmail: values.borrowerEmail ?? '',
      dueDate: values.dueDate || undefined,
    };

    this.api.borrowBook(payload).subscribe({
      next: () => {
        this.successMessage = 'Book borrowed successfully.';
        this.borrowForm.reset({ bookId: 0, borrowerName: '', borrowerEmail: '', dueDate: '' });
        this.reloadAll();
      },
      error: (error) => {
        this.errorMessage = error.error?.message ?? 'Borrow request failed.';
      },
    });
  }

  protected returnLoan(loanId: number): void {
    this.api.returnLoan(loanId).subscribe({
      next: () => {
        this.successMessage = 'Book returned successfully.';
        this.reloadAll();
      },
      error: (error) => {
        this.errorMessage = error.error?.message ?? 'Return request failed.';
      },
    });
  }
}
