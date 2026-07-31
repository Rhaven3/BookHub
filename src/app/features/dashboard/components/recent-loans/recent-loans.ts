import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recent-loans',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './recent-loans.html',
  styleUrl: './recent-loans.css',
})
export class RecentLoans {}
