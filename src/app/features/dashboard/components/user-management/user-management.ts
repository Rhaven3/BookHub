import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement {}
