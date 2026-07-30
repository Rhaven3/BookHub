import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookService } from '../../services/book';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ImageService } from '../../../image/service/image-service';

@Component({
  selector: 'app-detail-book',
  imports: [RouterLink, DatePipe],
  templateUrl: './detail-book.html',
  styleUrl: './detail-book.css',
})
export class DetailBook {
  private bookService = inject(BookService);
  private imageService = inject(ImageService);
  private route = inject(ActivatedRoute);

  private id$ = this.route.paramMap.pipe(map((params) => Number(params.get('id') ?? 0)));

  book = toSignal(
    this.id$.pipe(
      switchMap((id) =>
        this.bookService.getBookById(id))
      )
  );

  getImageUrl(path: string): string {
    return this.imageService.getImageUrl(path);
  }
}
