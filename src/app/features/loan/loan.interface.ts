import { Book } from '../book/book.interface';
import { AdminUser } from '../admin/admin.interface';

export interface Loan {
  id: number;

  book : Book;
  userId: number;

  loanDate: string;
  expectedReturnDate: string;
  actualReturnDate: string | null;

  status: string;
  delay: number;
}

export interface LoanResponse {
  id: number;
  book: Book;
  user: AdminUser;
  loanDate: string;
  expectedReturnDate: string;
  actualReturnDate: string | null;
  status: string;
  delay: number;
}
