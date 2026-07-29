
import { ReservationStatus } from './reservation.enum';

export interface Reservation {
  id: number;
  registrationDate: string;
  reservationLimitDate: string;
  status: ReservationStatus;
  user: User;
  book: Book;
}
