import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTable } from '../../../shared/components/data-table/data-table';
import { ColumnDirective } from '../../../shared/components/data-table/data-table-column.directive';
import { TableColumn } from '../../../shared/components/data-table/data-table.interface';
import { SearchInput } from '../../../shared/components/search-input/search-input';
import { Loan } from '../../loan/loan.interface';
import { LoanService } from '../../loan/services/loan';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../../shared/interfaces/apiResponse';

@Component({
  selector: 'app-loan-list-page',
  standalone: true,
  imports: [RouterLink, DataTable, ColumnDirective, SearchInput],
  templateUrl: './loan-list-page.html',
  styleUrl: './loan-list-page.css',
})
export class LoanListPage {
  private loanService = inject(LoanService);

  searchTerm = signal('');

  columns: TableColumn<Loan>[] = [
    { key: 'bookTitle', label: 'Livre', sortable: true, width: '22%' },
    { key: 'userName', label: 'Emprunteur', sortable: true, width: '18%' },
    { key: 'loanDate', label: 'Date emprunt', sortable: true, width: '15%' },
    { key: 'expectedReturnDate', label: 'Retour prévu', sortable: true, width: '15%' },
    { key: 'status', label: 'Statut', width: '13%' },
    { key: 'actions', label: 'Actions', width: '17%' },
  ];

  // DataTable a besoin de clés plates pour trier (book.title, user.firstName
  // ne sont pas directement accessibles) — on aplatit les données ici, en
  // gardant les objets d'origine dans `raw` pour l'affichage des templates.
  loans = signal<(Loan & { bookTitle: string; userName: string })[]>([]);

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  trackByLoanId = (loan: Loan) => loan.id;

  ngOnInit(): void {
    this.loadLoans();
  }

  private loadLoans(): void {
    this.loading.set(true);
    this.loanService.getLoans({ page: 0, size: 200 }).subscribe({
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

  onMarkReturned(loan: Loan): void {
    this.loanService.markAsReturned(loan.id).subscribe({
      next: (updated) => {
        this.loans.update((list) =>
          list.map((l) =>
            l.id === updated.id ? { ...updated, bookTitle: l.bookTitle, userName: l.userName } : l,
          ),
        );
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ApiResponse<null>;
        this.errorMessage.set(apiError?.message ?? 'Une erreur est survenue.');
      },
    });
  }

  onNotify(loan: Loan): void {

  }
}
