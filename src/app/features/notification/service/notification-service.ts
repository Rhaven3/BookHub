import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENVIRONMENT } from '../../../environments/environment';
import { ApiResponse } from '../../../shared/interfaces/apiResponse';
import {
  NotificationCreateDTO,
  NotificationDto,
  NotificationReadDTO,
} from '../interface/notification-dto';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private http = inject(HttpClient);
  private baseUrl = ENVIRONMENT.apiUrl;
  private client: Client | null = null;

  // état réactif exposé aux composants
  private notificationsSubject = new BehaviorSubject<NotificationDto[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private connectedSubject = new BehaviorSubject<boolean>(false);
  connected$ = this.connectedSubject.asObservable();

  connect(token: string): void {
    if (this.client?.active) return; // déjà connecté, on évite les doublons

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${this.baseUrl}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000, // reconnexion auto toutes les 5s si coupure
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: () => {}, // mettre console.log en dev si besoin
    });

    this.client.onConnect = () => {
      this.connectedSubject.next(true);

      // notifications personnelles
      this.client!.subscribe('/user/queue/notifications', (message: IMessage) => {
        this.handleIncoming(message);
      });

      // notifications broadcast
      this.client!.subscribe('/topic/notifications', (message: IMessage) => {
        this.handleIncoming(message);
      });
    };

    this.client.onDisconnect = () => {
      this.connectedSubject.next(false);
    };

    this.client.onStompError = (frame) => {
      console.error('Erreur STOMP :', frame.headers['message'], frame.body);
    };

    this.client.activate();
  }

  private handleIncoming(message: IMessage): void {
    const notif: NotificationDto = JSON.parse(message.body);
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([notif, ...current]);
  }

  disconnect(): void {
    this.client?.deactivate();
    this.connectedSubject.next(false);
  }

  markAsRead(notif: NotificationDto): void {
    const updated = this.notificationsSubject.value.map((n) =>
      n.id === notif.id ? { ...n, read: true } : n,
    );
    this.notificationsSubject.next(updated);
  }

  get unreadCount(): number {
    return this.notificationsSubject.value.filter((n) => !n.isRead).length;
  }

  setInitialNotifications(notifs: NotificationDto[]): void {
    this.notificationsSubject.next(notifs);
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  getAllMeNotification() {
    return this.http.get<ApiResponse<NotificationDto[]>>(`${this.baseUrl}/notifications/me`);
  }

  getNotificationById(id: number) {
    return this.http.get<ApiResponse<NotificationDto>>(`${this.baseUrl}/notifications/${id}`);
  }

  addNotification(notification: NotificationCreateDTO) {
    return this.http.post<ApiResponse<NotificationDto>>(
      `${this.baseUrl}/notifications`,
      notification,
    );
  }

  setReadNotification(notification: NotificationReadDTO) {
    return this.http.patch<ApiResponse<NotificationDto>>(
      `${this.baseUrl}/notifications/${notification.id}`,
      notification,
    );
  }

  deleteNotification(id: number) {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/notifications/${id}`);
  }
}
