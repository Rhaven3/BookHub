import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Loan, LoanResponse } from '../loan.interface';
import { ENVIRONMENT } from '../../../environments/environment';
import { ApiResponse } from '../../../shared/interfaces/apiResponse';
import { Pageable } from '../../../shared/interfaces/pageable';
import { Page } from '../../../shared/interfaces/page';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private http = inject(HttpClient);
  private baseUrl = ENVIRONMENT.apiUrl;

  createLoan(bookId: number): Observable<Loan> {
    return this.http
      .post<ApiResponse<Loan>>(`${this.baseUrl}/loans`, { bookId })
      .pipe(map((response) => response.data));
  }

  getAllLoans(pageable: Pageable): Observable<Page<LoanResponse>> {
    return this.http.get<Page<LoanResponse>>(
      `${this.baseUrl}/loans?page=${pageable.page}&size=${pageable.size}`,
    );
  }
  getAllLoansDelayed(pageable: Pageable): Observable<Page<LoanResponse>> {
    return this.http.get<Page<LoanResponse>>(
      `${this.baseUrl}/loans/all-delay?page=${pageable.page}&size=${pageable.size}`,
    );
  }
  markAsReturned(id: number): Observable<Loan> {
    return this.http
      .put<ApiResponse<Loan>>(`${this.baseUrl}/loans/${id}/return`, {})
      .pipe(map((response) => response.data));
  }

  getLoans(pageable: Pageable, status?: string, date?: string): Observable<Page<Loan>> {
    let params = new HttpParams().set('page', pageable.page).set('size', pageable.size);

    if (status) {
      params = params.set('status', status);
    }

    if (date) {
      params = params.set('date', date);
    }

    return this.http.get<Page<Loan>>(`${this.baseUrl}/loans/me`, { params });
  }

  cancelLoan(id: number): Observable<Loan> {
    return this.http.delete<Loan>(`${this.baseUrl}/loans/${id}`);
  }
}
