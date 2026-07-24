import { Routes } from '@angular/router';
import { LoginPage } from './page/login-page/login-page';
import { RegisterPage } from './page/register-page/register-page';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginPage, title: 'Connexion' },
  { path: 'register', component: RegisterPage, title: 'Inscription' },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
