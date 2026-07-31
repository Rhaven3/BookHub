import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth } from './features/auth/service/auth';
import { NotificationService } from './core/layout/header/notification/service/notification-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('BookHub');
  private notificationService = inject(NotificationService);
  private authService = inject(Auth)
  private readonly token = this.authService.token();

  ngOnInit(): void {
    if (this.token) {
      this.notificationService.connect(this.token);
      this.notificationService
        .getAllMeNotification()
        .subscribe((notifs) => this.notificationService.setInitialNotifications(notifs));
    }
  }
}
