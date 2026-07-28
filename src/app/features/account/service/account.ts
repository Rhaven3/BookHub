// account/service/account.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UpdateProfileRequest } from '../account.interface';
import { CurrentUser } from '../../auth/auth.interface';
import { ApiResponse } from '../../../shared/interfaces/apiResponse'; // adapte le chemin si besoin

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/auth'; // adapte selon ton backend

  updateProfile(request: UpdateProfileRequest): Observable<CurrentUser> {
    return this.http
      .put<ApiResponse<CurrentUser>>(`${this.baseUrl}/update`, request)
      .pipe(map((response) => response.data));
  }
}
