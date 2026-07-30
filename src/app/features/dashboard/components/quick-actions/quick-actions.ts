import { Component, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Modal } from '../../../../shared/components/modal/modal';
import { AuthorForm } from './author-form/author-form';
import { Category } from '../../../category/category.interface';
import { CategoryService } from '../../../category/services/category';
import { CategoryForm } from './category-form/category-form';
import { RegisterForm } from '../../../../shared/components/register-form/register-form';
import { RegisterRequest } from '../../../auth/auth.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../../../shared/interfaces/apiResponse';
import { Auth } from '../../../auth/service/auth';
import { BookForm } from '../../../admin/book-form-page/component/book-form/book-form';

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [RouterLink, Modal, AuthorForm, CategoryForm, RegisterForm, BookForm],
  templateUrl: './quick-actions.html',
  styleUrl: './quick-actions.css',
})
export class QuickActions {
  private categoryService = inject(CategoryService);
  private authService = inject(Auth);
  private categoryForm = viewChild.required(CategoryForm);
  private registerForm = viewChild.required(RegisterForm);
  private bookForm = viewChild.required(BookForm);

  loading = signal(false);
  errorMessage = signal<string | null>(null);
  isEditBook = signal(false);

  isCreateAuthorModalOpen = signal(false);
  isCreateCategoryModalOpen = signal(false);
  isCreateUserModalOpen = signal(false);
  isCreateBookModalOpen = signal(false);

  // Auteur
  onCreateAuthor(): void {
    this.isCreateAuthorModalOpen.set(true);
  }
  closeCreateAuthorModal(): void {
    this.isCreateAuthorModalOpen.set(false);
  }

  // Catégorie
  onCreateCategory(): void {
    this.isCreateCategoryModalOpen.set(true);
  }
  closeCreateCategoryModal(): void {
    this.isCreateCategoryModalOpen.set(false);
  }

  // User
  onCreateUser(): void {
    this.isCreateUserModalOpen.set(true);
  }
  closeCreateUserModal(): void {
    this.isCreateUserModalOpen.set(false);
  }

  // Livre
  onCreateBook(): void {
    this.isEditBook.set(false);
    this.isCreateBookModalOpen.set(true);
  }

  closeCreateBookModal(): void {
    this.isCreateBookModalOpen.set(false);
  }

  onCreateUserSubmit(request: RegisterRequest): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.register(request).subscribe({
      next: () => {
        this.loading.set(false);
        this.closeCreateUserModal();
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
