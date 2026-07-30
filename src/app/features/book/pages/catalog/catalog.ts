import { BookFilter } from '../../components/book-filter/book-filter';
import { Component, inject, signal } from '@angular/core';
import { BookService } from '../../services/book';
import { AuthorService } from '../../../author/services/author';
import { CategoryService } from '../../../category/services/category';
import { EditorService } from '../../../editor/services/editor';
import { Book } from '../../book.interface';
import { Category } from '../../../category/category.interface';
import { Author } from '../../../author/author.interface';
import { Editor } from '../../../editor/editor.interface';
import { LoanService } from '../../../loan/services/loan';

@Component({
  selector: 'app-catalog',
  imports: [BookFilter],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {
  private bookService = inject(BookService);
  private authorService = inject(AuthorService);
  private categoryService = inject(CategoryService);
  private editorService = inject(EditorService);

  books = signal<Book[]>([]);

  authors = signal<Author[]>([]);
  categories = signal<Category[]>([]);
  editors = signal<Editor[]>([]);

  currentPage = 0;
  pageSize = 12;

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadFilters();
  }

  loadBooks(): void {
    this.bookService
      .filterBooks(null, null, null, null, {
        page: this.currentPage,
        size: this.pageSize,
      })
      .subscribe({
        next: (response) => {
          this.books.set(response.data.content);
        },
        error: (err) => console.error(err),
      });
  }

  loadFilters(): void {
    this.authorService.getAuthors({ page: 0, size: 100 }).subscribe((res) => {
      this.authors.set(res.content);
    });

    this.categoryService.getCategories({ page: 0, size: 100 }).subscribe((res) => {
      this.categories.set(res.content);
    });

    this.editorService.getEditors({ page: 0, size: 100 }).subscribe((res) => {
      this.editors.set(res.content);
    });
  }

  filterBooks(filters: {
    word: string | null;
    authorId: number | null;
    categoryId: number | null;
    editorId: number | null;
  }): void {
    this.bookService
      .filterBooks(filters.word, filters.authorId, filters.categoryId, filters.editorId, {
        page: 0,
        size: this.pageSize,
      })
      .subscribe({
        next: (response) => {
          this.books.set(response.data.content);
        },
        error: (err) => console.error(err),
      });
  }

  borrow(book: Book): void {
    this.loanService.createLoan(book.id).subscribe({
      next: () => {
        console.log('Livre emprunté avec succès');

        // mettre à jour le signal
        this.books.update((books) =>
          books.map((b) => (b.id === book.id ? { ...b, available: false } : b)),
        );
      },
      error: (err) => {
        console.error('Erreur lors de l’emprunt', err);
      },
    });
  }

  reserve(book: Book): void {
    console.log('Réservation demandée', book.id);
    // appel ReservationService
  }
}
