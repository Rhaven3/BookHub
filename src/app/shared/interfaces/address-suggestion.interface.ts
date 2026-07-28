/** Suggestion d'adresse retournée par le service de géocodage */
export interface AddressSuggestion {
  /** Libellé complet affiché dans la liste déroulante (ex: "12 Rue de la Paix 75002 Paris") */
  label: string;

  /** Numéro + nom de rue seul (correspond au champ "street" du formulaire) */
  street: string;

  /** Code postal */
  postalCode: string;

  /** Ville */
  city: string;

  /** Pays — l'API Adresse ne couvrant que la France, on le fixe en dur côté service */
  country: string;
}
