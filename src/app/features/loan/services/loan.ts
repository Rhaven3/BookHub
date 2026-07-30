import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENVIRONMENT } from '../../../environments/environment';
import { Pageable } from '../../../shared/interfaces/pageable';
import { ApiResponse } from '../../../shared/interfaces/apiResponse';
import { Page } from '../../../shared/interfaces/page';
import { Loan } from '../loan.interface';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private http = inject(HttpClient);
  private baseUrl = ENVIRONMENT.apiUrl;

  createLoan(bookId: number): Observable<Loan> {
    return this.http.post<Loan>(`${this.baseUrl}/loans`, {
      bookId: bookId,
    });
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
