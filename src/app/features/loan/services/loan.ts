import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loan } from '../loan.interface';
import { ENVIRONMENT } from '../../../environments/environment';

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
}
