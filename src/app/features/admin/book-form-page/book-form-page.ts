import { Component } from '@angular/core';
import { BookForm } from './component/book-form/book-form';

@Component({
  selector: 'app-book-form-page',
  imports: [BookForm],
  templateUrl: './book-form-page.html',
  styleUrl: './book-form-page.css',
})
export class BookFormPage {}
