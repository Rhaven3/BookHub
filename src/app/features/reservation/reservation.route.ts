import { Routes } from '@angular/router';
import { ReservationPage } from './page/reservation-page/reservation-page';

export const RESERVATION_ROUTES: Routes = [
  { path: '', component: ReservationPage, title: 'reservation' },
];
