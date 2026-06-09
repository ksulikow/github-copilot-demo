import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Book, BookListResponse, BookPayload, BorrowPayload, Loan } from './models';

@Injectable({
  providedIn: 'root',
})
export class LibraryApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/v1';

  getBooks(search = '', availableOnly = false): Observable<BookListResponse> {
    let params = new HttpParams().set('page', 1).set('pageSize', 20);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    if (availableOnly) {
      params = params.set('availableOnly', true);
    }

    return this.http.get<BookListResponse>(`${this.baseUrl}/books`, { params });
  }

  createBook(payload: BookPayload): Observable<Book> {
    return this.http.post<Book>(`${this.baseUrl}/books`, payload);
  }

  updateBook(id: number, payload: BookPayload): Observable<Book> {
    return this.http.put<Book>(`${this.baseUrl}/books/${id}`, payload);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/books/${id}`);
  }

  listLoans(activeOnly = false): Observable<Loan[]> {
    let params = new HttpParams();
    if (activeOnly) {
      params = params.set('status', 'ACTIVE');
    }
    return this.http.get<Loan[]>(`${this.baseUrl}/loans`, { params });
  }

  borrowBook(payload: BorrowPayload): Observable<Loan> {
    return this.http.post<Loan>(`${this.baseUrl}/loans/borrow`, payload);
  }

  returnLoan(loanId: number): Observable<Loan> {
    return this.http.post<Loan>(`${this.baseUrl}/loans/${loanId}/return`, {});
  }
}
