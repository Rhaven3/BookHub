import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../../auth/service/auth';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap } from 'rxjs';
import { ReservationService } from '../../../reservation/service/reservation-service';
import { ImageService } from '../../../image/service/image-service';
import { FlashMessageService } from '../../../../core/services/flashMessage/flash-message-service';
import { DatePipe } from '@angular/common';
import { ReservationStatus } from '../../../reservation/reservation.enum';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  imports: [DatePipe, RouterLink],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage {
  private authService = inject(Auth);
  private reservationService = inject(ReservationService);
  private flashMessageService = inject(FlashMessageService);
  private refreshTrigger = signal(0);

  user = this.authService.user;

  reservations = toSignal(
    toObservable(this.refreshTrigger).pipe(
      switchMap(() =>
        this.reservationService.getReservations({ page: 0, size: 10 }).pipe(
          map((response) =>
            response.data.content.filter((reservation) => {
              const limitDate = new Date(reservation.reservationLimitDate);
              const now = new Date();

              return reservation.status !== ReservationStatus.CANCELED && limitDate > now;
            }),
          ),
          catchError(() => {
            this.flashMessageService.error('Erreur lors du chargement des réservations.');
            return of([]);
          }),
        ),
      ),
    ),
    { initialValue: [] },
  );
}
