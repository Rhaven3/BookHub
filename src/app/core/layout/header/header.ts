import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../features/auth/service/auth';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
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