import { Routes } from '@angular/router';
import { Dashboard } from './dashboard';
import { UserListPage } from '../admin/user-list-page/user-list-page';

export const DASHBOARD_ROUTES: Routes = [
  { path: '', component: Dashboard, title: 'Dashboard' },
  { path: 'list-user', component: UserListPage, title: 'List User' },
];
