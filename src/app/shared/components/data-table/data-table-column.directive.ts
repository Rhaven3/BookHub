import { Directive, Input, TemplateRef } from '@angular/core';

/**
 * À poser sur un <ng-template> à l'intérieur de <app-data-table> pour définir
 * comment afficher le contenu d'une colonne précise :
 *
 *   <ng-template appColumn="role" let-user>
 *     <span class="badge-dark">{{ user.role }}</span>
 *   </ng-template>
 *
 * La valeur de `appColumn` doit correspondre au `key` de la colonne dans la config
 * passée à [columns] du DataTable.
 */
@Directive({
  selector: 'ng-template[appColumn]',
  standalone: true,
})
export class ColumnDirective {
  @Input('appColumn') columnKey!: string;

  constructor(public templateRef: TemplateRef<unknown>) {}
}
