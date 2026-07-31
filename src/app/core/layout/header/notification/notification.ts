import { Component } from '@angular/core';
import { NotificationService } from './service/notification-service';
import { NotificationDto } from './interface/notification-dto';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notification',
  imports: [DatePipe, AsyncPipe],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class Notification {
  protected notifications$;

  constructor(private notificationService: NotificationService) {
    this.notifications$ = this.notificationService.notifications$;
  }

  onNotificationClick(notif: NotificationDto): void {
    if (!notif.isRead && notif.id) {
      this.notificationService.setReadNotification({ id: notif.id, isRead: true }).subscribe(() => {
        this.notificationService.markAsRead(notif);
      });
    }
  }

  get unreadCount(): number {
    return this.notificationService.unreadCount;
  }

  onDeleteClick(event: Event, notif: NotificationDto): void {
    event.stopPropagation(); // empêche de déclencher onNotificationClick en même temps

    if (!notif.id) return;

    this.notificationService.deleteNotification(notif.id).subscribe(() => {
      this.notificationService.removeNotification(notif.id!);
    });
  }
}
