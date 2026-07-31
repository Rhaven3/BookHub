import { Routes } from '@angular/router';
import { MyLoans } from './page/my-loans/my-loans';

export const LOAN_ROUTES: Routes = [
  { path: '', component: MyLoans, title: 'Mes Emprunts' },
]
