import { Book } from '../book/book.interface';

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
