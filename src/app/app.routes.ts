import { Routes } from '@angular/router';
import { IMAGE_ROUTES } from './features/image/image.routes';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: 'image', component: MainLayout, children: IMAGE_ROUTES, canActivate: [authGuard] },
  { path: 'auth', component: MainLayout, children: AUTH_ROUTES },
  { path: '', redirectTo: '/image', pathMatch: 'full' },
];
