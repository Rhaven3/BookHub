import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ENVIRONMENT } from '../../../environments/environment';

import { Pageable } from '../../../shared/interfaces/pageable';
import { ApiResponse } from '../../../shared/interfaces/apiResponse';
import { Page } from '../../../shared/interfaces/page';

import { Book } from '../book.interface';
import { BookRequest } from '../book-request.interface';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private http = inject(HttpClient);
  private baseUrl = ENVIRONMENT.apiUrl;

  refreshTrigger = signal(0);

  triggerRefresh(): void {
    this.refreshTrigger.update((v) => v + 1);
  }

  // CRUD
  getBooks(pageable: Pageable): Observable<ApiResponse<Page<Book>>> {
    return this.http.get<ApiResponse<Page<Book>>>(
      `${this.baseUrl}/book?page=${pageable.page}&size=${pageable.size}`,
    );
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/book/${id}`);
  }

  createBook(book: BookRequest): Observable<Book> {
    return this.http.post<Book>(`${this.baseUrl}/book`, book);
  }

  updateBook(id: number, book: BookRequest): Observable<Book> {
    return this.http.put<Book>(`${this.baseUrl}/book/${id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/book/${id}`);
  }

  // Recherche
  searchBooks(word: string, pageable: Pageable): Observable<ApiResponse<Page<Book>>> {
    return this.http.get<ApiResponse<Page<Book>>>(
      `${this.baseUrl}/book/search?je-cherche=${word}&page=${pageable.page}&size=${pageable.size}`,
    );
  }

  getBookByTitle(title: string): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/book/search/title?titre=${title}`);
  }

  getBookByIsbn(isbn: string): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/book/search/isbn?isbn=${isbn}`);
  }

  // Filtres
  getBooksByAvailable(available: boolean, pageable: Pageable): Observable<ApiResponse<Page<Book>>> {
    return this.http.get<ApiResponse<Page<Book>>>(
      `${this.baseUrl}/book/available?dispo=${available}&page=${pageable.page}&size=${pageable.size}`,
    );
  }

  getBooksByAuthor(authorId: number, pageable: Pageable): Observable<ApiResponse<Page<Book>>> {
    return this.http.get<ApiResponse<Page<Book>>>(
      `${this.baseUrl}/book/authors/${authorId}?page=${pageable.page}&size=${pageable.size}`,
    );
  }

  getBooksByCategory(categoryId: number, pageable: Pageable): Observable<ApiResponse<Page<Book>>> {
    return this.http.get<ApiResponse<Page<Book>>>(
      `${this.baseUrl}/book/category/${categoryId}?page=${pageable.page}&size=${pageable.size}`,
    );
  }

  getBooksByEditor(editorId: number, pageable: Pageable): Observable<ApiResponse<Page<Book>>> {
    return this.http.get<ApiResponse<Page<Book>>>(
      `${this.baseUrl}/book/editors/${editorId}?page=${pageable.page}&size=${pageable.size}`,
    );
  }

  filterBooks(
    authorId: number | null,
    categoryId: number | null,
    editorId: number | null,
    pageable: Pageable,
  ): Observable<ApiResponse<Page<Book>>> {
    let params = new HttpParams().set('page', pageable.page).set('size', pageable.size);

    if (authorId !== null) {
      params = params.set('authorId', authorId);
    }

    if (categoryId !== null) {
      params = params.set('categoryId', categoryId);
    }

    if (editorId !== null) {
      params = params.set('editorId', editorId);
    }

    return this.http.get<ApiResponse<Page<Book>>>(`${this.baseUrl}/book/filter`, { params });
  }
}
