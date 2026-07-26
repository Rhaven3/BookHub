import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../../service/auth';
import { LoginForm } from '../../components/login-form/login-form';
import { LoginRequest } from '../../auth.interface';
// Contient le sélecteur, les imports d'autres composants, un template et un fichier style
@Component({
  selector: 'app-login-page',
  imports: [LoginForm],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  // Le signal permet de stocker un état réactif et déclencher un re-render/re-calcul quand il change
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  constructor(
    private authService: Auth,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  // Fonction pour la connexion
  onLogin(credentials: LoginRequest): void {
    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
        // Dans le cas où quelqu'un utilise une URL existante mais dont on a besoin d'être connecté pour
        // y accéder, on met l'url de la route en question en param et elle sert ici à faire un redirect
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Identifiants incorrects.');
      },
    });
  }
}
