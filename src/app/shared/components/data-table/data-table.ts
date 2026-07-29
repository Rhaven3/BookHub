import {
  Component,
  input,
  signal,
  computed,
  effect,
  contentChildren,
  AfterContentInit,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TableColumn } from './data-table.interface';
import { ColumnDirective } from './data-table-column.directive';

/**
 * Tableau générique réutilisable, avec tri + pagination client-side réactifs,
 * et colonnes entièrement personnalisables via projection de contenu.
 *
 * Le composant ne connaît jamais le contenu réel des cellules (texte, badge,
 * boutons) — il gère uniquement l'ordre des colonnes, le tri, la pagination,
 * et délègue l'affichage de chaque cellule au template fourni par la page
 * consommatrice (via appColumn).
 *
 * Usage :
 *   <app-data-table [data]="users" [columns]="columns" [trackBy]="trackByUserId" [pageSize]="10">
 *     <ng-template appColumn="lastName" let-user>{{ user.lastName }}</ng-template>
 *   </app-data-table>
 */
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTable<T> implements AfterContentInit {
  // DATA DU TABLEAU
  /** Le tableau de données brutes à afficher (non trié, non paginé) */
  data = input.required<T[]>();

  // Les types correspondant à une colonne
  /** Configuration des colonnes : clé technique, libellé affiché, triable ou non, largeur de colonne */
  columns = input.required<TableColumn<T>[]>();

  // Pagination
  /** Nombre de lignes affichées par page (10 par défaut) */
  pageSize = input(10);

  /** Fonction d'identification unique par ligne via champ `id`.
   *  Utilisée par @for(... track ...) pour qu'Angular ne recrée pas
   *  inutilement les <tr> quand seul l'ordre change (tri/pagination). */
  trackBy = input<(item: T) => unknown>((item: T) => (item as { id?: unknown }).id);

  // Récupère tous les <ng-template appColumn="..."> projetés par la page
  // consommatrice à l'intérieur de <app-data-table>...</app-data-table>.
  columnTemplates = contentChildren(ColumnDirective);

  /** Clé de la colonne actuellement triée (null = aucun tri appliqué) */
  sortKey = signal<string | null>(null);

  /** Sens du tri courant */
  sortDirection = signal<'asc' | 'desc'>('asc');

  /** Page actuellement affichée (indexée à partir de 1) */
  currentPage = signal(1);

  // Associe chaque clé de colonne (ex: "lastName") au TemplateRef correspondant,
  // rempli une fois dans ngAfterContentInit(). Permet un accès O(1) dans le
  // template via getTemplate(key), plutôt que de reparcourir la liste à chaque render.
  private templateMap = new Map<string, TemplateRef<unknown>>();

  /**
   * Données triées selon sortKey/sortDirection.
   * Recalculé automatiquement (grâce à computed()) dès que data(), sortKey()
   * ou sortDirection() changent. Ne mute jamais le tableau d'origine ([...rows]).
   */
  sortedData = computed(() => {
    const key = this.sortKey();
    const direction = this.sortDirection();
    const rows = this.data();

    // Aucun tri actif : on retourne les données telles quelles
    if (!key) return rows;

    return [...rows].sort((a, b) => {
      // Cast nécessaire pour accéder dynamiquement à une propriété par son
      // nom (string) — TypeScript ne peut pas garantir statiquement que T
      // possède cette clé, mais on sait qu'elle vient de la config columns.
      const valA = (a as Record<string, unknown>)[key];
      const valB = (b as Record<string, unknown>)[key];

      // Valeurs manquantes : on ne les fait pas remonter/descendre arbitrairement
      if (valA == null || valB == null) return 0;
      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  });

  /** Nombre total de pages, basé sur les données triées et la taille de page.
   *  Toujours au moins 1, même si data() est vide, pour éviter une pagination
   *  du style "Page 1 sur 0". */
  totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.sortedData().length / this.pageSize()));
  });

  /** Portion de sortedData() correspondant à la page actuelle uniquement —
   *  c'est cette liste, et uniquement elle, qui doit être affichée dans le tbody. */
  pagedData = computed(() => {
    const page = this.currentPage();
    const size = this.pageSize();
    const start = (page - 1) * size;
    return this.sortedData().slice(start, start + size);
  });

  constructor() {
    // Revient à la page 1 si les données changent ou si un tri est appliqué —
    // évite de rester bloqué sur une page qui n'existe plus après filtrage/tri.
    // effect() se relance automatiquement à chaque fois qu'un des signaux lus
    // à l'intérieur (data, sortKey, sortDirection) change de valeur.
    effect(() => {
      this.data();
      this.sortKey();
      this.sortDirection();
      this.currentPage.set(1);
    });
  }

  // Une fois que le contenu projeté (les <ng-template appColumn>) est
  // disponible, on construit la map clé → template pour un accès rapide
  // depuis le HTML (getTemplate()).
  ngAfterContentInit(): void {
    this.columnTemplates().forEach((col) => {
      this.templateMap.set(col.columnKey, col.templateRef);
    });
  }

  /** Retourne le template à utiliser pour afficher le contenu d'une colonne donnée,
   *  ou null si aucun <ng-template appColumn="..."> ne correspond (rien n'est rendu). */
  getTemplate(key: string): TemplateRef<unknown> | null {
    return this.templateMap.get(key) ?? null;
  }

  /** Appelé au clic sur un en-tête de colonne.
   *  - Si la colonne n'est pas triable, ne fait rien.
   *  - Si on clique sur la colonne déjà triée, inverse le sens (asc ↔ desc).
   *  - Sinon, active le tri sur cette nouvelle colonne, en commençant par asc. */
  onSort(column: TableColumn<T>): void {
    if (!column.sortable) return;

    if (this.sortKey() === column.key) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(column.key);
      this.sortDirection.set('asc');
    }
  }

  /** Change de page, en ignorant les valeurs hors bornes (< 1 ou > totalPages). */
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
  }

  previousPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }
}
