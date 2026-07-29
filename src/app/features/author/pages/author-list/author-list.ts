import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { AuthorService } from '../../services/author';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { Author } from '../../author.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-author-list',
  imports: [FormsModule],
  templateUrl: './author-list.html',
  styleUrl: './author-list.css',
})
export class AuthorList {
  private service = inject(AuthorService);
  private router = inject(Router);

  currentPage = signal(0);
  pageSize = signal(10);
  searchValue = '';

  authors = toSignal(
    combineLatest([
      toObservable(this.currentPage),
      toObservable(this.pageSize),
      toObservable(this.service.refreshTrigger),
    ]).pipe(switchMap(([page, size]) => this.service.getAuthors({ page, size }))),
  );

  searchResults = signal<Author[]>([]);

  displayAuthors = computed(() =>
    this.searchResults().length > 0 ? this.searchResults() : (this.authors()?.content ?? []),
  );

  goToPage(page: number) {
    this.currentPage.set(page);
  }

  changePageSize(size: number) {
    this.pageSize.set(size);
    this.currentPage.set(0);
  }

  createAuthor(): void {
    this.router.navigate(['/author/create']);
  }

  searchAuthors(name: string): void {
    if (!name.trim()) {
      this.searchResults.set([]);
      return;
    }

    this.service.search(name, { page: this.currentPage(), size: this.pageSize() }).subscribe({
      next: (page) => {
        this.searchResults.set(page.content);
      },
      error: (err) => console.error(err),
    });
  }

  editAuthor(id: number): void {
    this.router.navigate(['/author/edit', id]);
  }

  deleteAuthor(id: number): void {
    this.service.deleteAuthor(id).subscribe({
      next: () => {
        this.service.triggerRefresh();
      },
      error: (err) => {
        console.error('Erreur suppression auteur', err);
      },
    });
  }
}
