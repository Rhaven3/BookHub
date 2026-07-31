import { Book } from '../book/book.interface';
import { AdminUser } from '../admin/admin.interface';

export interface RatingInterface {
  id: number;
  note: number;
  commentary: string;
  date: string;
  status: RatingEnum;
  book: Book;
  user: AdminUser;
}

export enum RatingEnum {
  PUBLISH = 'PUBLISH',
  CANCELED = 'CANCELED',
}
