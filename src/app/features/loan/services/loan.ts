import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Loan, LoanResponse } from '../loan.interface';
import { ENVIRONMENT } from '../../../environments/environment';
import { ApiResponse } from '../../../shared/interfaces/apiResponse';
import { Page } from '../../../shared/interfaces/page';
import { Pageable } from '../../../shared/interfaces/pageable';

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

  getLoans(pageable: Pageable): Observable<Page<LoanResponse>> {
    return this.http
      .get<ApiResponse<Page<LoanResponse>>>(
        `${this.baseUrl}/loans?page=${pageable.page}&size=${pageable.size}`,
      )
  }

  markAsReturned(id: number): Observable<Loan> {
    return this.http
      .put<ApiResponse<Loan>>(`${this.baseUrl}/loans/${id}/return`, {})
      .pipe(map((response) => response.data));
  }
}
