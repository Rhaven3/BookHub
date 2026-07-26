import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../service/auth';
import { RegisterForm } from '../../components/register-form/register-form';
import { RegisterRequest } from '../../auth.interface';

@Component({
  selector: 'app-register-page',
  imports: [RegisterForm],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  constructor(
    private authService: Auth,
    private router: Router,
  ) {}

  onRegister(dto: RegisterRequest): void {
    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.authService.register(dto).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message ?? "Une erreur est survenue lors de l'inscription.");
      },
    });
  }
}