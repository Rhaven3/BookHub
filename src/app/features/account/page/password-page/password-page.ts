import { Component, signal, viewChild } from '@angular/core';
import { PasswordForm } from '../../components/password-form/password-form';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../../../shared/interfaces/apiResponse';
import { ChangePasswordRequest } from '../../account.interface';
import { AccountService } from '../../service/account';

@Component({
  selector: 'app-password-page',
  imports: [PasswordForm],
  templateUrl: './password-page.html',
  styleUrl: './password-page.css',
})
export class PasswordPage {
  errorMessage = signal<string | null>(null);
  loading = signal(false);
  private changePasswordForm = viewChild.required(PasswordForm);

  constructor(
    private accountService: AccountService,
    private router: Router,
  ) {}

  onChangePassword(dto: ChangePasswordRequest): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.accountService.changePassword(dto).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/account/']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        const apiError = err.error as ApiResponse<null>;

        if (err.status === 400) {
          this.changePasswordForm().setFieldError('currentPassword', apiError.message);
        } else {
          this.errorMessage.set(apiError?.message ?? 'Une erreur est survenue.');
        }
      },
    });
  }
}
