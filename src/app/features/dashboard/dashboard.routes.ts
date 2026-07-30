import { Routes } from '@angular/router';
import { Dashboard } from './dashboard';
import { UserListPage } from '../admin/user-list-page/user-list-page';
import { BookFormPage } from '../admin/book-form-page/book-form-page';
import { BookListPage } from '../admin/book-list-page/book-list-page';
import { LoanListPage } from '../admin/loan-list-page/loan-list-page';

export const DASHBOARD_ROUTES: Routes = [
  { path: '', component: Dashboard, title: 'Dashboard' },
  { path: 'list-user', component: UserListPage, title: 'List User' },
  { path: 'list-book', component: BookListPage, title: 'List Book' },
  { path: 'list-loan', component: LoanListPage, title: 'List Loan' },
  { path: 'book-add', component: BookFormPage, title: 'Ajouter un livre' },
];
