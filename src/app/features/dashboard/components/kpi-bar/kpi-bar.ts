import { Component, input } from '@angular/core';
import { Book } from '../../../book/book.interface';

@Component({
  selector: 'app-kpi-bar',
  standalone: true,
  imports: [],
  templateUrl: './kpi-bar.html',
  styleUrl: './kpi-bar.css',
})
export class KpiBar {
  totalBooks = input.required<number>();
}
