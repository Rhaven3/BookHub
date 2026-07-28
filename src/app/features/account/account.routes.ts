import { Routes } from '@angular/router';
import { ProfilePage } from './page/profile-page/profile-page';
import { EditPage } from './page/edit-page/edit-page';
import { PasswordPage } from './page/password-page/password-page';

export const PROFILE_ROUTES: Routes = [
  { path: '', component: ProfilePage, title: 'Profil' },
  { path: 'edit', component: EditPage, title: 'Profil Edit' },
  { path: 'change-password', component: PasswordPage, title: 'Changer le mot de passe' },
];
