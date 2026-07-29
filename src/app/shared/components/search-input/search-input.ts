import { Component, input, output, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

/**
 * Champ de recherche générique et réutilisable — n'importe où un filtre texte
 * est nécessaire (tableau, liste, etc.), pas seulement dans DataTable.
 *
 * Usage :
 *   <app-search-input placeholder="Rechercher un adhérent..." (searchChange)="onSearch($event)" />
 */
@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [],
  templateUrl: './search-input.html',
  styleUrl: './search-input.css',
})
export class SearchInput implements OnDestroy {
  placeholder = input('Rechercher...');

  /** Émet la valeur de recherche 250ms après la dernière frappe (pas à chaque caractère) */
  searchChange = output<string>();

  value = '';

  private inputChanges = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor() {
    this.inputChanges
      .pipe(debounceTime(250), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term) => this.searchChange.emit(term));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.inputChanges.next(this.value);
  }

  clear(): void {
    this.value = '';
    this.inputChanges.next('');
  }
}
