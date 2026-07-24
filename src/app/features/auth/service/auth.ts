import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { inject, Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse } from '../../../shared/interfaces/apiResponse';
import { AuthResponse, CurrentUser, LoginRequest, RegisterRequest } from '../auth.interface';
import { ENVIRONMENT } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = ENVIRONMENT.apiUrl;

  private tokenSignal = signal<string | null>(this.getStoredToken());
  private userSignal = signal<CurrentUser | null>(this.getStoredUser());

  readonly token = this.tokenSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.tokenSignal() !== null);
  readonly isAdmin = computed(() => this.userSignal()?.role === 'ADMIN');

  login(dto: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/login`, dto)
      .pipe(tap((response) => this.setSession(response)));
  }

  register(dto: RegisterRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/auth/register`, dto);
  }

  logout(): void {
    this.http.post(`${this.baseUrl}/auth/logout`, {}).subscribe({
      complete: () => this.clearSession(),
      error: () => this.clearSession(),
    });
  }

  private setSession(response: AuthResponse): void {
    localStorage.setItem('token', response.accessToken);
    localStorage.setItem('user', JSON.stringify({ email: response.email, role: response.role }));
    this.tokenSignal.set(response.accessToken);
    this.userSignal.set({ email: response.email, role: response.role });
  }

  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  private getStoredToken(): string | null {
    return localStorage.getItem('token');
  }

  private getStoredUser(): CurrentUser | null {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }
}
