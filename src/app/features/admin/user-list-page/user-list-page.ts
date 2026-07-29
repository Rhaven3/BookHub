import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTable } from '../../../shared/components/data-table/data-table';
import { ColumnDirective } from '../../../shared/components/data-table/data-table-column.directive';
import { TableColumn } from '../../../shared/components/data-table/data-table.interface';
import { AdminUser } from '../admin.interface';
import { UserListService } from './service/user-list.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { SearchInput } from '../../../shared/components/search-input/search-input';

@Component({
  selector: 'app-user-list-page',
  standalone: true,
  imports: [RouterLink, DataTable, ColumnDirective, SearchInput],
  templateUrl: './user-list-page.html',
  styleUrl: './user-list-page.css',
})
export class UserListPage implements OnInit {
  private adminService = inject(UserListService);
  searchTerm = signal('');

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

  onEdit(user: AdminUser): void {
    console.log('Modifier', user.id);
  }

  onDelete(user: AdminUser): void {
    console.log('Supprimer', user.id);
  }
}
