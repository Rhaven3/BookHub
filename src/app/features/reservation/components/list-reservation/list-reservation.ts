import { Component, effect, inject, signal } from '@angular/core';
import { ReservationService } from '../../service/reservation-service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ImageService } from '../../../image/service/image-service';
import { DatePipe } from '@angular/common';
import { FlashMessageService } from '../../../../core/services/flashMessage/flash-message-service';
import { ReservationStatusLabel } from '../../reservation.enum';

@Component({
  selector: 'app-list-reservation',
  imports: [RouterLink, DatePipe],
  templateUrl: './list-reservation.html',
  styleUrl: './list-reservation.css',
})
export class ListReservation {
  private reservationService = inject(ReservationService);
  private imageService = inject(ImageService);
  private flashMessageService = inject(FlashMessageService);
  private refreshTrigger = signal(0);
  protected readonly ReservationStatusLabel = ReservationStatusLabel;

  reservations = toSignal(
    toObservable(this.refreshTrigger).pipe(
      switchMap(() =>
        this.reservationService.getReservations({ page: 0, size: 10 }).pipe(
          map((response) => response.data.content),
          catchError(() => {
            this.flashMessageService.error('Erreur lors du chargement des réservations.');
            return of([]);
          }),
        ),
      ),
    ),
    { initialValue: [] },
  );

  getImageUrl(path: string): string {
    return this.imageService.getImageUrl(path);
  }

  constructor() {
    effect(() => {
      console.log('Réservations mises à jour :', this.reservations());
    });
  }

  cancelRes(id: number) {
    this.reservationService
      .cancelReservation(id)
      .pipe(
        tap(() => {
          this.flashMessageService.success('Annulation validée avec succès.');
          this.refreshTrigger.update((v) => v + 1);
        }),
        catchError(() => {
          this.flashMessageService.error("Erreur lors de l'annulation de la réservation.");
          return of(undefined);
        }),
      )
      .subscribe();
  }
}
