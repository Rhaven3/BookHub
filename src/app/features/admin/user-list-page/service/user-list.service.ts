import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { inject, Injectable, signal } from '@angular/core';
import { ENVIRONMENT } from '../../../../environments/environment';
import { AdminUpdateUserRequest, AdminUser } from '../../admin.interface';
import { ApiResponse } from '../../../../shared/interfaces/apiResponse';
import { UpdateProfileRequest } from '../../../account/account.interface';
import { CurrentUser } from '../../../auth/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class UserListService {
  private http = inject(HttpClient);
  private baseUrl = ENVIRONMENT.apiUrl;

  loadUsers(): Observable<AdminUser[]> {
    return this.http
      .get<ApiResponse<AdminUser[]>>(`${this.baseUrl}/auth/users`)
      .pipe(map((response) => response.data));
  }
  submit(id: number, user: AdminUpdateUserRequest): Observable<AdminUser> {
    return this.http
      .put<ApiResponse<AdminUser>>(`${this.baseUrl}/admin/user/update/${id}`, user)
      .pipe(map((response) => response.data));
  }
}
