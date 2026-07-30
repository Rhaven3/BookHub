export interface NotificationDto {
  id: number;
  message: string;
  type: string;
  date: string;
  isRead: boolean;
  userId: number;
}

export interface NotificationCreateDTO {
  message: string;
  type: string;
}

export interface NotificationReadDTO {
  id: number;
  isRead: boolean;
}
