import { Component, Input, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Composant d'input générique et réutilisable, compatible avec Angular Reactive Forms.
 *
 * Grâce à l'auto-connexion sur NgControl (voir constructeur), il peut être utilisé
 * exactement comme un <input> natif avec formControlName :
 *
 *   <app-form-input formControlName="email" label="Email" type="email" />
 *
 * Il gère automatiquement :
 * - l'affichage du label et du champ
 * - l'affichage des messages d'erreur (requis, pattern, email, ou erreur serveur)
 * - un filtrage optionnel de la saisie (lettres uniquement / chiffres uniquement)
 */
@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [],
  templateUrl: './form-input.html',
  styleUrl: './form-input.css',
})
export class FormInput {
  @Input() label = '';

  /** Type HTML natif de l'input (text, email, tel, password, etc.) */
  @Input() type: string = 'text';

  @Input() placeholder = '';

  @Input() autocomplete = 'off';

  @Input() maxLength: number | null = null;
  /**
   * Filtrage appliqué en temps réel à la saisie :
   * - 'letters' : n'autorise que les lettres (avec accents), espaces, tirets, apostrophes
   * - 'numbers' : n'autorise que les chiffres
   * - 'none'    : aucun filtrage (comportement par défaut)
   */
  @Input() filter: 'letters' | 'numbers' | 'none' = 'none';

  /** Message affiché si le champ est vide alors qu'il est requis (Validators.required) */
  @Input() requiredMessage = 'Ce champ est requis.';

  /** Message affiché si la valeur ne respecte pas le pattern défini (Validators.pattern) */
  @Input() patternMessage = 'Format invalide.';

  /** Valeur actuelle du champ, synchronisée avec le FormControl parent */
  value = '';

  disabled = false;

  // Callbacks fournis par Angular Forms via registerOnChange/registerOnTouched.
  // Ils permettent de notifier le FormControl parent des changements de valeur
  // et de l'état "touched". Valeurs par défaut no-op tant qu'Angular ne les a pas branchées.
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  // Récupère le NgControl (directive formControlName/formControl) posé sur ce composant.
  // { optional: true, self: true } évite une erreur si le composant est utilisé
  // sans formControlName, et cible uniquement l'instance présente sur cet élément
  // (pas celle d'un parent), pour éviter les conflits d'injection circulaire.
  private ngControl = inject(NgControl, { optional: true, self: true });

  constructor() {
    // Si une directive formControlName/formControl est présente sur ce composant,
    // on l'informe que CE composant doit servir de "ControlValueAccessor" :
    // c'est ce qui permet à formControlName de lire/écrire la valeur via
    // writeValue/registerOnChange/registerOnTouched ci-dessous, comme s'il
    // s'agissait d'un <input> natif.
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  /** Appelé par Angular Forms quand le FormControl change de valeur depuis l'extérieur
   *  (ex: form.patchValue(...), form.reset()) — on met à jour l'affichage en conséquence. */
  writeValue(value: string): void {
    this.value = value ?? '';
  }

  /** Angular Forms enregistre ici la fonction à appeler à chaque frappe utilisateur,
   *  pour répercuter la nouvelle valeur dans le FormControl. */
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  /** Angular Forms enregistre ici la fonction à appeler quand le champ perd le focus,
   *  pour marquer le FormControl comme "touched" (utile pour l'affichage des erreurs). */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /** Appelé par Angular Forms quand le FormControl est activé/désactivé
   *  (ex: form.get('email')?.disable()). */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /** Raccourci vers le FormControl réel porté par ce champ (utilisé pour lire invalid/errors). */
  get control() {
    return this.ngControl?.control ?? null;
  }

  /** Vrai si le champ est invalide ET a déjà été touché — évite d'afficher
   *  une erreur avant même que l'utilisateur n'ait interagi avec le champ. */
  get invalid(): boolean {
    return !!this.control?.invalid && !!this.control?.touched;
  }

  /**
   * Détermine le message d'erreur à afficher, par ordre de priorité :
   * 1. Erreur serveur injectée manuellement via setFieldError() (ex: email déjà pris)
   * 2. Champ requis non rempli
   * 3. Pattern (regex) non respecté
   * 4. Email au mauvais format
   * 5. Message générique en dernier recours
   */
  get errorMessage(): string | null {
    const errors = this.control?.errors;
    if (!errors) return null;

    if (errors['serverError']) return errors['serverError'];
    if (errors['required']) return this.requiredMessage;
    if (errors['pattern']) return this.patternMessage;
    if (errors['minlength']) return this.patternMessage;
    if (errors['mismatch']) return this.patternMessage;
    if (errors['email']) return 'Adresse email invalide.';

    return 'Champ invalide.';
  }

  /**
   * Déclenché à chaque frappe dans le champ.
   * Applique le filtrage configuré (lettres/chiffres uniquement) directement
   * sur la valeur affichée, puis notifie le FormControl parent via onChange.
   */
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let cleaned = input.value;

    if (this.filter === 'letters') {
      // Supprime tout ce qui n'est pas une lettre (avec accents), espace, tiret ou apostrophe
      cleaned = cleaned.replace(/[^a-zA-ZÀ-ÿ' -]/g, '');
    } else if (this.filter === 'numbers') {
      // Supprime tout ce qui n'est pas un chiffre
      cleaned = cleaned.replace(/[^0-9]/g, '');
    }

    // Si le filtrage a modifié la valeur, on corrige l'affichage dans le DOM
    // (sinon le caractère refusé resterait visible un instant avant correction)
    if (cleaned !== input.value) {
      input.value = cleaned;
    }

    this.value = cleaned;
    this.onChange(cleaned);
  }

  /** Déclenché quand le champ perd le focus — marque le FormControl comme "touched",
   *  ce qui déclenche l'affichage des erreurs de validation dans le template. */
  onBlur(): void {
    this.onTouched();
  }

 }
