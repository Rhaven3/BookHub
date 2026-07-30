import { Component, effect, inject, OnInit, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTable } from '../../../shared/components/data-table/data-table';
import { ColumnDirective } from '../../../shared/components/data-table/data-table-column.directive';
import { TableColumn } from '../../../shared/components/data-table/data-table.interface';
import { AdminUpdateUserRequest, AdminUser } from '../admin.interface';
import { UserListService } from './service/user-list.service';
import { SearchInput } from '../../../shared/components/search-input/search-input';
import { Modal } from '../../../shared/components/modal/modal';
import { EditForm } from '../../../shared/components/edit-form/edit-form';
import { UpdateProfileRequest } from '../../account/account.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../../shared/interfaces/apiResponse';
import { RegisterForm } from '../../../shared/components/register-form/register-form';
import { RegisterRequest } from '../../auth/auth.interface';
import { Auth } from '../../auth/service/auth';

@Component({
  selector: 'app-user-list-page',
  standalone: true,
  imports: [RouterLink, DataTable, ColumnDirective, SearchInput, EditForm, RegisterForm, Modal],
  templateUrl: './user-list-page.html',
  styleUrl: './user-list-page.css',
})
export class UserListPage implements OnInit {
  private adminService = inject(UserListService);
  private authService = inject(Auth);
  searchTerm = signal('');
  private editForm = viewChild.required(EditForm);
  private registerForm = viewChild.required(RegisterForm);

  columns: TableColumn<AdminUser>[] = [
    { key: 'lastName', label: 'Nom', sortable: true, width: '15%' },
    { key: 'firstName', label: 'Prénom', sortable: true, width: '15%' },
    { key: 'email', label: 'Email', sortable: true, width: '27.5%' },
    { key: 'phone', label: 'Téléphone', width: '12.5%' },
    { key: 'role', label: 'Rôle', sortable: true, width: '12.5%' },
    { key: 'actions', label: 'Actions', width: '17.5%' },
  ];

  users = signal<AdminUser[]>([]);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  isEditModalOpen = signal(false);
  isCreateModalOpen = signal(false);

  userToCreate = signal<UpdateProfileRequest | null>(null);
  userToEdit = signal<AdminUser | null>(null);

  trackByUserId = (user: AdminUser) => user.id;

  ngOnInit(): void {
    this.loading.set(true);
    this.adminService.loadUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
  private searchEffect = effect(() => {
    const term = this.searchTerm();

    if (term !== '') {
      console.log('La recherche a changé :', term);
    }
  });

  onCreate(): void {
    this.registerForm().resetForm();
    this.isCreateModalOpen.set(true);
  }
  onEdit(user: AdminUser): void {
    this.userToEdit.set(user);
    this.isEditModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
  }
  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.userToEdit.set(null);
  }

  onDelete(user: AdminUser): void {
    console.log('Supprimer', user.id);
  }

  onEditSubmit(user: AdminUpdateUserRequest): void {
    const targetUser = this.userToEdit();
    if (!targetUser) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    this.adminService.submit(targetUser.id, user).subscribe({
      next: (updatedUser) => {
        this.users.update((currentUsers) =>
          currentUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
        );
        this.loading.set(false);
        this.closeEditModal();
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

  onCreateSubmit(request: RegisterRequest): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.register(request).subscribe({
      next: (newUser) => {
        this.users.update((currentUsers) => [...currentUsers, newUser]);
        this.loading.set(false);
        this.closeCreateModal();
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
