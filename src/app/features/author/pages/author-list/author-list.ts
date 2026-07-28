import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { AuthorService } from '../../services/author';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-author-list',
  imports: [],
  templateUrl: './author-list.html',
  styleUrl: './author-list.css',
})
export class AuthorList {
  private service = inject(AuthorService);
  private router = inject(Router);

  currentPage = signal(0);
  pageSize = signal(10);

  constructor() {
    effect(() => {
      console.log('AUTHORS RESPONSE :', this.authors());
    });
  }

  authors = toSignal(
    combineLatest([
      toObservable(this.currentPage),
      toObservable(this.pageSize),
      toObservable(this.service.refreshTrigger),
    ]).pipe(switchMap(([page, size]) => this.service.getAuthors({ page, size }))),
  );

  displayAuthors = computed(() => this.authors()?.content ?? []);

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
}
