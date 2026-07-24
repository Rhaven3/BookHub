import { Routes } from '@angular/router';
import { IMAGE_ROUTES } from './features/image/image.routes';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { AUTHOR_ROUTES } from './features/author/author.routes';

export const routes: Routes = [
  { path: 'image', component: MainLayout, children: IMAGE_ROUTES },
  { path: 'author', component: MainLayout, children: AUTHOR_ROUTES },
  { path: '', redirectTo: '/image', pathMatch: 'full' },
];
