import { Component } from '@angular/core';
import { BookForm } from './component/book-form/book-form';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-book-form-page',
  imports: [BookForm, RouterLink],
  templateUrl: './book-form-page.html',
  styleUrl: './book-form-page.css',
})
export class BookFormPage {}
