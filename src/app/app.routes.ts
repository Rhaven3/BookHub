import { Routes } from '@angular/router';
import { IMAGE_ROUTES } from './features/image/image.routes';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { authGuard } from './core/guards/auth/auth-guard';
import { PROFILE_ROUTES } from './features/account/account.routes';
import { AUTHOR_ROUTES } from './features/author/author.routes';
import { BOOK_ROUTES } from './features/book/book.routes';
import { RESERVATION_ROUTES } from './features/reservation/reservation.route';
import { DASHBOARD_ROUTES } from './features/dashboard/dashboard.routes';
import { adminGuard } from './core/guards/admin/admin-guard';
import { LOAN_ROUTES } from './features/loan/loan.routes';

export const routes: Routes = [
  { path: 'auth', component: MainLayout, children: AUTH_ROUTES },
  { path: 'catalogue', component: MainLayout, children: BOOK_ROUTES, canActivate: [authGuard] },
  { path: 'reservations', component: MainLayout, children: RESERVATION_ROUTES, canActivate: [authGuard] },
  { path: 'account', component: MainLayout, children: PROFILE_ROUTES, canActivate: [authGuard] },
  { path: 'image', component: MainLayout, children: IMAGE_ROUTES, canActivate: [authGuard] },
  { path: 'dashboard', component: MainLayout, children: DASHBOARD_ROUTES, canActivate: [authGuard, adminGuard] },

  { path: 'auth', component: MainLayout, children: AUTH_ROUTES },
  { path: 'author', component: MainLayout, children: AUTHOR_ROUTES, canActivate: [authGuard] },
  { path: '', redirectTo: '/catalogue', pathMatch: 'full' },

  { path: 'book', component: MainLayout, children: BOOK_ROUTES, canActivate: [authGuard] },
  { path: 'loans', component: MainLayout, children: LOAN_ROUTES, canActivate: [authGuard] },
  { path: '', redirectTo: '/book', pathMatch: 'full' },
];
