import { Routes } from '@angular/router';
import { IMAGE_ROUTES } from './features/image/image.routes';
import { MainLayout } from './core/layout/main-layout/main-layout';

export const routes: Routes = [
  { path: 'image', component: MainLayout, children: IMAGE_ROUTES },
  { path: '', redirectTo: '/image', pathMatch: 'full' },
];
