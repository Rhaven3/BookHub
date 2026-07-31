import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ImageService } from '../../../image/service/image-service';
import { BookService } from '../../../book/services/book';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Book } from '../../../book/book.interface';

@Component({
  selector: 'app-book-list-preview',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './book-list-preview.html',
  styleUrl: './book-list-preview.css',
})
export class BookListPreview {
  private imageService = inject(ImageService);
  // private bookService = inject(BookService);
  //
  // allBooks = toSignal(
  //   this.bookService.getBooks({ page: 0, size: 3 }).pipe(
  //     map((response) => response.data.content)
  //   ),
  //   { initialValue: [] },
  // );
  //
  books = input.required<Book[]>();

  getImageUrl(path: string): string {
    return this.imageService.getImageUrl(path);
  }


}
