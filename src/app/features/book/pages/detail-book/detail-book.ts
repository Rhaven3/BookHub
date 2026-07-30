import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookService } from '../../services/book';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, map, switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ImageService } from '../../../image/service/image-service';
import { Book } from '../../book.interface';
import { LoanService } from '../../../loan/services/loan';
import { FlashMessageService } from '../../../../core/services/flashMessage/flash-message-service';
import { ReservationService } from '../../../reservation/service/reservation-service';
import { Pageable } from '../../../../shared/interfaces/pageable';

@Component({
  selector: 'app-detail-book',
  imports: [RouterLink, DatePipe],
  templateUrl: './detail-book.html',
  styleUrl: './detail-book.css',
})
export class DetailBook {
  private bookService = inject(BookService);
  private imageService = inject(ImageService);
  private loanService = inject(LoanService);
  private reservationService = inject(ReservationService);
  private flashMessage = inject(FlashMessageService);
  //private ratingService = inject(RatingService);
  private route = inject(ActivatedRoute);
  private refreshTrigger = signal(0);

  private bookId$ = this.route.paramMap.pipe(map((params) => Number(params.get('id') ?? 0)));

  bookSelected = toSignal(
    toObservable(this.refreshTrigger).pipe(
      switchMap(() =>
        this.bookId$.pipe(
          switchMap((id) => this.bookService.getBookById(id).pipe(map((res) => res.data))),
        ),
      ),
    ),
  );

  bookByEditor = toSignal(
    this.bookId$.pipe(
      switchMap((id) => this.bookService.getBookById(id)),
      switchMap((res) =>
        this.bookService.getBooksByEditor(res.data.editor.id, { page: 0, size: 5 }),
      ),
      map((res) => res.data.content),
    ),
    { initialValue: [] },
  );

  bookByCategory = toSignal(
    toObservable(this.bookSelected).pipe(
      filter((book) => !!book?.categories?.length),
      switchMap((book) =>
        this.bookService.getBooksByCategory(book!.categories[0].id, { page: 0, size: 5 }),
      ),
      map((res) =>
        res.data.content.filter((otherBook) => otherBook.id !== this.bookSelected()?.id),
      ),
    ),
    { initialValue: [] },
  );

  getImageUrl(path: string): string {
    return this.imageService.getImageUrl(path);
  }

  borrow(book: Book): void {
    if (book.id == null) {
      this.flashMessage.error("Impossible d'emprunter ce livre.");
      return;
    }

    this.loanService.createLoan(book.id).subscribe({
      next: () => {
        this.flashMessage.success('Livre emprunté avec succès');
        this.refreshTrigger.update((v) => v + 1);
      },
      error: (err) => {
        console.error(err);
        this.flashMessage.error("Erreur lors de l'emprunt");
      },
    });
  }

  reserve(book: Book): void {
    if (book.id == null) {
      this.flashMessage.error('Impossible de réserver ce livre.');
      return;
    }

    this.reservationService.createReservation(book.id).subscribe({
      next: () => {
        this.flashMessage.success('Réservation demandée');
      },
      error: (err) => {
        console.error(err);
        this.flashMessage.error('Erreur lors de la réservation.');
      },
    });
  }
}
