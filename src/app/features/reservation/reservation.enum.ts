export enum ReservationStatus {
  WAITING = 'WAITING',
  AVAILABLE = 'AVAILABLE',
  CANCELED = 'CANCELED',
}

export const ReservationStatusLabel: Record<ReservationStatus, string> = {
  [ReservationStatus.WAITING]: 'En attente',
  [ReservationStatus.AVAILABLE]: 'Disponible',
  [ReservationStatus.CANCELED]: 'Annulée',
};
