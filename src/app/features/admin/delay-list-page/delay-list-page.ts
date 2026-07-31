import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTable } from '../../../shared/components/data-table/data-table';
import { ColumnDirective } from '../../../shared/components/data-table/data-table-column.directive';
import { TableColumn } from '../../../shared/components/data-table/data-table.interface';
import { SearchInput } from '../../../shared/components/search-input/search-input';
import { LoanResponse } from '../../loan/loan.interface';
import { LoanService } from '../../loan/services/loan';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../../shared/interfaces/apiResponse';

@Component({
  selector: 'app-delay-list-page',
  standalone: true,
  imports: [RouterLink, DataTable, ColumnDirective, SearchInput],
  templateUrl: './delay-list-page.html',
  styleUrl: './delay-list-page.css',
})
export class DelayListPage {
  private loanService = inject(LoanService);

  searchTerm = signal('');

  columns: TableColumn<LoanResponse>[] = [
    { key: 'userName', label: 'Emprunteur', sortable: true, width: '20%' },
    { key: 'bookTitle', label: 'Livre', sortable: true, width: '25%' },
    { key: 'expectedReturnDate', label: 'Retour prévu', sortable: true, width: '15%' },
    { key: 'delay', label: 'Retard', sortable: true, width: '15%' },
    { key: 'actions', label: 'Actions', width: '25%' },
  ];

  loans = signal<(LoanResponse & { bookTitle: string; userName: string })[]>([]);

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  trackByLoanId = (loan: LoanResponse) => loan.id;

  ngOnInit(): void {
    this.loadDelayedLoans();
  }

  private loadDelayedLoans(): void {
    this.loading.set(true);
    this.loanService.getAllLoansDelayed({ page: 0, size: 200 }).subscribe({
      next: (page) => {
        this.loans.set(
          page.content.map((loan) => ({
            ...loan,
            bookTitle: loan.book?.title ?? '',
            userName: `${loan.user?.firstName ?? ''} ${loan.user?.lastName ?? ''}`.trim(),
          })),
        );
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onMarkReturned(loan: LoanResponse): void {
    this.loanService.markAsReturned(loan.id).subscribe({
      next: () => {
        // L'emprunt n'est plus en retard une fois rendu, on le retire de cette liste
        this.loans.update((list) => list.filter((l) => l.id !== loan.id));
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ApiResponse<null>;
        this.errorMessage.set(apiError?.message ?? 'Une erreur est survenue.');
      },
    });
  }

  onNotify(loan: LoanResponse): void {
    // TODO (autre lot) : envoyer une notification/email à l'adhérent en retard.
    console.log('À implémenter : notifier', loan.id);
  }
}
