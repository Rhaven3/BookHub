import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../features/auth/service/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Le queryParams returnUrl permet de garder la route sur laquelle un user a essayé d'accéder
  // Et dont il devait être connecté pour y accéder pour faire une redirection dessus après login
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
