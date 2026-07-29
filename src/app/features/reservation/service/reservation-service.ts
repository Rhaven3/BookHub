import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENVIRONMENT } from '../../../environments/environment';
import { Pageable } from '../../../shared/interfaces/pageable';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/interfaces/apiResponse';
import { Reservation } from '../reservation';
import { Page } from "../../../shared/interfaces/page";

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private http = inject(HttpClient);
  private baseUrl = ENVIRONMENT.apiUrl;

  getReservations(pageable: Pageable): Observable<ApiResponse<Page<Reservation>>> {
    return this.http.get<ApiResponse<Page<Reservation>>>(
      `${this.baseUrl}/reservations/me?page=${pageable.page}&size=${pageable.size}`,
    );
  }

  cancelReservation(id: number): Observable<ApiResponse<Reservation>> {
    return this.http.delete<ApiResponse<Reservation>>(
      `${this.baseUrl}/reservations/${id}`,
    );
  }
}
