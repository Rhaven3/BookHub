import { ReservationStatus } from './reservation.enum';
import { AdminUser } from '../admin/admin.interface';
import { Book } from '../book/book.interface';

export interface Reservation {
  id: number;
  registrationDate: string;
  reservationLimitDate: string;
  status: ReservationStatus;
  user: AdminUser;
  book: Book;
}
