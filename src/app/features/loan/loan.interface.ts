import { AdminUser } from '../admin/admin.interface';
import { Book } from '../book/book.interface';

export interface Loan {
  id: number;
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
