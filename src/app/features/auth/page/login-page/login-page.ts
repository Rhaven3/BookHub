import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../service/auth';
import { LoginForm } from '../../components/login-form/login-form';
import { LoginRequest } from '../../auth.interface';

@Component({
  selector: 'app-login-page',
  imports: [LoginForm],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  constructor(
    private authService: Auth,
    private router: Router,
  ) {}

  onLogin(credentials: LoginRequest): void {
    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Identifiants incorrects.');
      },
    });
  }
}
