import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationService } from './features/notification/service/notification-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('BookHub');
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.notificationService.connect(token);
      this.notificationService
        .getAllMeNotification()
        .subscribe((notifs) => this.notificationService.setInitialNotifications(notifs.data));
    }
  }
}
