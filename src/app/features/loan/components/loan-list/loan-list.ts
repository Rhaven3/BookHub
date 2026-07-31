import { Component, inject, signal } from '@angular/core';
import { LoanService } from '../../services/loan';
import { ImageService } from '../../../image/service/image-service';
import { FlashMessageService } from '../../../../core/services/flashMessage/flash-message-service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoanStatusLabel } from '../../loan.enum';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-loan-list',
  imports: [DatePipe, RouterLink, FormsModule],
  templateUrl: './loan-list.html',
  styleUrl: './loan-list.css',
})
export class LoanList {
  private loanService = inject(LoanService);
  private imageService = inject(ImageService);
  private flashMessageService = inject(FlashMessageService);
  private refreshTrigger = signal(0);
  protected readonly LoanStatusLabel = LoanStatusLabel;

  selectedStatus = signal('');
  selectedDate = signal('');

  refresh(): void {
    this.refreshTrigger.update((value) => value + 1);
  }

  loans = toSignal(
    toObservable(this.refreshTrigger).pipe(
      switchMap(() =>
        this.loanService
          .getLoans({ page: 0, size: 10 }, this.selectedStatus(), this.selectedDate())
          .pipe(
            map((response) => response.content),
            catchError(() => {
              this.flashMessageService.error('Erreur de chargement ');
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
}
