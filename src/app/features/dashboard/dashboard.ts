import { Component } from '@angular/core';
import { KpiBar } from './components/kpi-bar/kpi-bar';
import { QuickActions } from './components/quick-actions/quick-actions';
import { DelayTracker } from './components/delay-tracker/delay-tracker';
import { BookListPreview } from './components/book-list-preview/book-list-preview';
import { RecentLoans } from './components/recent-loans/recent-loans';
import { UserManagement } from './components/user-management/user-management';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [KpiBar, QuickActions, DelayTracker, BookListPreview, UserManagement, RecentLoans],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
