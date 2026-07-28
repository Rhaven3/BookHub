import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { Auth } from '../../features/auth/service/auth';

const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

function withAuth(req: HttpRequest<unknown>, token: string | null) {
  return req.clone({
    withCredentials: true,
    ...(token ? { setHeaders: { Authorization: `Bearer ${token}` } } : {}),
  });
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) => req.url.includes(endpoint));

  return next(withAuth(req, authService.token())).pipe(
    catchError((error: unknown) => {
      if (isAuthEndpoint || !(error instanceof HttpErrorResponse) || error.status !== 401) {
        return throwError(() => error);
      }

      return authService.refresh().pipe(
        switchMap(() => next(withAuth(req, authService.token()))),
        catchError((refreshError: unknown) => {
          authService.logout();
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
