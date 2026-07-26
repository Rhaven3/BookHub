import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginRequest } from '../../auth.interface';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  // @Input : "prop" reçue du parent, via le property binding dans le template du parent :
  // <app-login-form [loading]="isLoading()" [errorMessage]="errorMessage()" />
  // Angular fait le lien automatiquement : quand isLoading() change dans LoginPage,
  // Angular réassigne this.loading ici et re-render ce composant avec la nouvelle valeur.
  // Ce composant est "dumb"/présentationnel : il ne sait pas QUAND il est en chargement
  // ou en erreur, c'est le parent (LoginPage) qui pilote l'appel HTTP et lui dit quoi afficher.
  @Input() loading = false;
  @Input() errorMessage: string | null = null;

  // @Output : le miroir de @Input, dans l'autre sens. EventEmitter est basé sur RxJS (proche d'un Subject) :
  // .emit(valeur) déclenche l'événement, et le parent l'écoute via l'event binding dans son template :
  // <app-login-form (submitForm)="onLogin($event)" />
  // $event correspond ici exactement à la valeur passée à .emit(...) plus bas (un LoginRequest).
  // Ce composant ne fait jamais lui-même this.authService.login(...) : il remonte juste "voilà ce que
  // l'utilisateur a saisi", et laisse le parent décider quoi en faire (appel API, navigation, etc.)
  @Output() submitForm = new EventEmitter<LoginRequest>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    // FormBuilder.group() construit un FormGroup : chaque clé est un FormControl avec sa valeur initiale et ses validators
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      // markAllAsTouched() force l'affichage des messages d'erreur sur tous les champs,
      // même ceux que l'utilisateur n'a jamais cliqués (sinon les erreurs resteraient cachées)
      this.form.markAllAsTouched();
      return;
    }
    // form.value a la forme { email, password } → correspond à LoginRequest
    this.submitForm.emit(this.form.value as LoginRequest);
  }

  // Getters pratiques pour accéder aux FormControl depuis le template (email?.invalid, email?.touched, etc.)
  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }
}
