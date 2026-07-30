import { Component, computed, input, output, signal } from '@angular/core';
export interface SelectOption {
  id: number;
  label: string;
}

@Component({
  selector: 'app-multi-select',
  imports: [],
  templateUrl: './multi-select.html',
  styleUrl: './multi-select.css',
})
export class MultiSelect {
  options = input.required<SelectOption[]>();
  selectedIds = input.required<number[]>();
  placeholder = input('Rechercher...');
  allowCreate = input(false);

  selectionChange = output<number[]>();
  createRequested = output<string>();
  pendingLabels = input<string[]>([]);
  removePending = output<number>();

  searchTerm = signal('');
  isOpen = signal(false);

  filteredOptions = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const available = this.options().filter((o) => !this.selectedIds().includes(o.id));

    if (!term) return available;
    return available.filter((o) => o.label.toLowerCase().includes(term));
  });

  /** Vrai si la recherche ne correspond à rien d'existant — condition d'affichage de "Créer ..." */
  showCreateOption = computed(() => {
    const term = this.searchTerm().trim();
    return this.allowCreate() && term.length > 0 && this.filteredOptions().length === 0;
  });

  selectedOptions = computed(() => {
    return this.options().filter((o) => this.selectedIds().includes(o.id));
  });

  onInput(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
    this.isOpen.set(true);
  }

  onFocus(): void {
    this.isOpen.set(true);
  }

  onBlur(): void {
    setTimeout(() => this.isOpen.set(false), 150);
  }

  select(option: SelectOption): void {
    this.selectionChange.emit([...this.selectedIds(), option.id]);
    this.searchTerm.set('');
  }

  remove(id: number): void {
    this.selectionChange.emit(this.selectedIds().filter((x) => x !== id));
  }

  onCreateClick(): void {
    this.createRequested.emit(this.searchTerm().trim());
    this.searchTerm.set('');
    this.isOpen.set(false);
  }
}
