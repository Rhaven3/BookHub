import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTable } from '../../../shared/components/data-table/data-table';
import { ColumnDirective } from '../../../shared/components/data-table/data-table-column.directive';
import { TableColumn } from '../../../shared/components/data-table/data-table.interface';
import { SearchInput } from '../../../shared/components/search-input/search-input';
import { Modal } from '../../../shared/components/modal/modal';
import { Book } from '../../book/book.interface';
import { BookService } from '../../book/services/book';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../../shared/interfaces/apiResponse';

@Component({
  selector: 'app-book-list-page',
  standalone: true,
  imports: [RouterLink, DataTable, ColumnDirective, SearchInput, Modal],
  templateUrl: './book-list-page.html',
  styleUrl: './book-list-page.css',
})
export class BookListPage {
  private bookService = inject(BookService);

  searchTerm = signal('');

  columns: TableColumn<Book>[] = [
    { key: 'title', label: 'Titre', sortable: true, width: '25%' },
    { key: 'isbn', label: 'ISBN', sortable: true, width: '15%' },
    { key: 'language', label: 'Langue', width: '10%' },
    { key: 'available', label: 'Disponible', width: '15%' },
    { key: 'owned', label: 'Possédé', width: '15%' },
    { key: 'actions', label: 'Actions', width: '20%' },
  ];

  books = signal<Book[]>([]);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  isDeleteModalOpen = signal(false);
  bookToDelete = signal<Book | null>(null);

  trackByBookId = (book: Book) => book.id;

  ngOnInit(): void {
    this.loadBooks();
  }

  private loadBooks(): void {
    this.loading.set(true);
    this.bookService.getListBooks({ page: 0, size: 200 }).subscribe({
      next: (page) => {
        this.books.set(page.content);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onDelete(book: Book): void {
    this.bookToDelete.set(book);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.bookToDelete.set(null);
  }

  confirmDelete(): void {
    const book = this.bookToDelete();
    if (!book) return;

    this.bookService.deleteBook(book.id).subscribe({
      next: () => {
        this.books.update((list) => list.filter((b) => b.id !== book.id));
        this.closeDeleteModal();
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ApiResponse<null>;
        this.errorMessage.set(
          apiError?.message ?? 'Une erreur est survenue lors de la suppression.',
        );
        this.closeDeleteModal();
      },
    });
  }
}
