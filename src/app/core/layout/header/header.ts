import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../features/auth/service/auth';
import { UserDropdown } from './user-dropdown/user-dropdown';
import { Notification } from './notification/notification';

@Component({
  selector: 'app-header',
  imports: [RouterLink, UserDropdown, Notification, Notification],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private authService = inject(Auth);

  isAuthenticated = this.authService.isAuthenticated;
  user = this.authService.user;

  logout(): void {
    this.authService.logout();
  }
}
