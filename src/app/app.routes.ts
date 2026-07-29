import { Routes } from '@angular/router';
import { IMAGE_ROUTES } from './features/image/image.routes';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { authGuard } from './core/guards/auth/auth-guard';
import { PROFILE_ROUTES } from './features/account/account.routes';
import { DASHBOARD_ROUTES } from './features/dashboard/dashboard.routes';
import { adminGuard } from './core/guards/admin/admin-guard';

export const routes: Routes = [
  { path: 'image', component: MainLayout, children: IMAGE_ROUTES, canActivate: [authGuard] },
  { path: 'account', component: MainLayout, children: PROFILE_ROUTES, canActivate: [authGuard] },
  { path: 'dashboard', component: MainLayout, children: DASHBOARD_ROUTES, canActivate: [authGuard, adminGuard] },
  { path: 'auth', component: MainLayout, children: AUTH_ROUTES },
  { path: '', redirectTo: '/image', pathMatch: 'full' },
];
