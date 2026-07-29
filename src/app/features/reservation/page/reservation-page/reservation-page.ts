import { Component } from '@angular/core';
import { ListReservation } from '../../components/list-reservation/list-reservation';

@Component({
  selector: 'app-reservation-page',
  imports: [ListReservation],
  templateUrl: './reservation-page.html',
  styleUrl: './reservation-page.css',
})
export class ReservationPage {}
