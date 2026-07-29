import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-book-list-preview',
  standalone : true,
  imports: [RouterLink],
  templateUrl: './book-list-preview.html',
  styleUrl: './book-list-preview.css',
})
export class BookListPreview {}
