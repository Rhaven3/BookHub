/** Configuration d'une colonne du DataTable générique */
export interface TableColumn<T> {
  /** Clé technique de la colonne — doit matcher le `appColumn` du <ng-template> correspondant,
   *  et correspondre à une propriété de T si `sortable` est activé */
  key: string;

  /** Libellé affiché dans l'en-tête de colonne */
  label: string;

  /** Si vrai, un clic sur l'en-tête trie les données selon cette colonne */
  sortable?: boolean;

  /** Taille de la colonne **/
  width?: string;
}
