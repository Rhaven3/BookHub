import { Component, inject } from '@angular/core';
import { Auth } from '../../../auth/service/auth';

@Component({
  selector: 'app-profile-page',
  imports: [],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage {
  private authService = inject(Auth);

  user = this.authService.user;
}
