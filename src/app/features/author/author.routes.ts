import { Routes } from '@angular/router';

export const AUTHOR_ROUTES: Routes = [
  {
    path: 'list',
    loadComponent: () => import('./pages/author-list/author-list').then((c) => c.AuthorList),
  },
];
