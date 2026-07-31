import { Component, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../service/auth';
import { RegisterForm } from '../../../../shared/components/register-form/register-form';
import { RegisterRequest } from '../../auth.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../../../shared/interfaces/apiResponse';

@Component({
  selector: 'app-register-page',
  imports: [RegisterForm],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  errorMessage = signal<string | null>(null);
  loading = signal(false);
  private registerForm = viewChild.required(RegisterForm);

  constructor(
    private authService: Auth,
    private router: Router,
  ) {}

  onRegister(dto: RegisterRequest): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.register(dto).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/auth/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        const apiError = err.error as ApiResponse<null>;
        if (err.status === 409) {
          this.registerForm().setFieldError('email', apiError.message);
        } else {
          this.errorMessage.set(apiError?.message ?? 'Une erreur est survenue.');
        }
      },
    });
  }
}
