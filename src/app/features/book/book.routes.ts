import { Routes } from '@angular/router';
import { Catalog } from './pages/catalog/catalog';
import { DetailBook } from './pages/detail-book/detail-book';

export const BOOK_ROUTES: Routes = [
  {
    path: '',
    component: Catalog,
  },
  { path: 'book', component: DetailBook , title : "Page detail d'un livre"},
];
