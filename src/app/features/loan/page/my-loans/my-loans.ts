import { Component} from '@angular/core';
import { LoanList } from '../../components/loan-list/loan-list';
@Component({
  selector: 'app-my-loans',
  imports: [LoanList],
  templateUrl: './my-loans.html',
  styleUrl: './my-loans.css',
})
export class MyLoans {
}
