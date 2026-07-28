import { Routes } from '@angular/router';
import { AuthorList } from './pages/author-list/author-list';
import { AuthorForm } from './components/author-form/author-form';

export const AUTHOR_ROUTES: Routes = [
  { path: '', component: AuthorList },
  { path: 'create', component: AuthorForm },
  { path: 'edit/:id', component: AuthorForm, },
];
