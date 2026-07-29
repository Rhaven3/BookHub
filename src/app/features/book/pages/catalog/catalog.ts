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
}
