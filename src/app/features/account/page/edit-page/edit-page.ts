import { Component, inject, signal, viewChild } from '@angular/core';
  import { Router } from '@angular/router';
import { Auth } from '../../../auth/service/auth';
import { UpdateProfileRequest } from '../../account.interface';
import { EditForm } from '../../components/edit-form/edit-form';
import { AccountService } from '../../service/account';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../../../shared/interfaces/apiResponse';

@Component({
  selector: 'app-edit-page',
  imports: [EditForm],
  templateUrl: './edit-page.html',
  styleUrl: './edit-page.css',
})
export class EditPage {
  private authService = inject(Auth);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private editForm = viewChild.required(EditForm);

  user = this.authService.user;
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  onSubmit(request: UpdateProfileRequest): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.accountService.updateProfile(request).subscribe({
      next: (updatedUser) => {
        this.authService.setUser(updatedUser);
        this.loading.set(false);
        this.router.navigate(['/account/']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        const apiError = err.error as ApiResponse<null>;
        if (err.status === 409) {
          this.editForm().setFieldError('email', apiError.message);
        } else {
          this.errorMessage.set(apiError?.message ?? 'Une erreur est survenue.');
        }
      },
    });
  }
}



