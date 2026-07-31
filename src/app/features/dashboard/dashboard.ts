import { Component, computed, effect, inject } from '@angular/core';
import { KpiBar } from './components/kpi-bar/kpi-bar';
import { QuickActions } from './components/quick-actions/quick-actions';
import { DelayTracker } from './components/delay-tracker/delay-tracker';
import { BookListPreview } from './components/book-list-preview/book-list-preview';
import { RecentLoans } from './components/recent-loans/recent-loans';
import { UserManagement } from './components/user-management/user-management';
import { ImageService } from '../image/service/image-service';
import { BookService } from '../book/services/book';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Book } from '../book/book.interface';
import { LoanService } from '../loan/services/loan';
import { Loan } from '../loan/loan.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [KpiBar, QuickActions, DelayTracker, BookListPreview, UserManagement, RecentLoans],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private imageService = inject(ImageService);
  private bookService = inject(BookService);
  private loanService = inject(LoanService);

  allBooks = toSignal(
    this.bookService.getBooks({ page: 0, size: 100 }).pipe(map((response) => response.data)),
    {
      initialValue: {
        content: [] as Book[],
        totalElements: 0,
        totalPages: 0,
        number: 0,
        size: 0,
        first: true,
        last: true,
        empty: true,
      },
    },
  );

  totalBooks = computed(() => this.allBooks().totalElements);

  getImageUrl(path: string): string {
    return this.imageService.getImageUrl(path);
  }
}
