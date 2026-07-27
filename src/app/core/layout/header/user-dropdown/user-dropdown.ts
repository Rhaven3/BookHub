import { Component, input, output } from '@angular/core';
import { CurrentUser } from '../../../../features/auth/auth.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-dropdown.html',
  styleUrl: './user-dropdown.css',
})
export class UserDropdown {
  user = input<CurrentUser | null>(null);
  logout = output<void>();
}
