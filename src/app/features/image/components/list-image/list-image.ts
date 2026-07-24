import { Component, inject, signal } from '@angular/core';
import { combineLatest, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ImageService } from '../../service/image-service';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-list-image',
  imports: [NgOptimizedImage],
  templateUrl: './list-image.html',
  styleUrl: './list-image.css',
})
export class ListImage {
  private service = inject(ImageService);

  currentPage = signal(0);
  pageSize = signal(12);

  images = toSignal(
    combineLatest([toObservable(this.currentPage), toObservable(this.pageSize)]).pipe(
      switchMap(([page, size]) => this.service.getAllImage({ page, size })),
    ),
  );

  getImageUrl(path: string): string {
    return this.service.getImageUrl(path);
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
  }

  changePageSize(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(0);
  }
}
