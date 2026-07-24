import { Component, computed, inject, Input, signal } from '@angular/core';
import { combineLatest, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ImageService } from '../../service/image-service';
import { NgOptimizedImage } from '@angular/common';
import { Page } from '../../../../shared/interfaces/page';
import { ImageInterface } from '../../image.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-image',
  imports: [NgOptimizedImage, FormsModule],
  templateUrl: './list-image.html',
  styleUrl: './list-image.css',
})
export class ListImage {
  private service = inject(ImageService);

  searchValue = '';
  currentPage = signal(0);
  pageSize = signal(12);

  searchResults = signal<ImageInterface[]>([]);

  images = toSignal(
    combineLatest([
      toObservable(this.currentPage),
      toObservable(this.pageSize),
      toObservable(this.service.refreshTrigger),
    ]).pipe(switchMap(([page, size]) => this.service.getAllImage({ page, size }))),
  );

  displayImages = computed(() => this.searchResults() ?? this.images()?.data.content ?? []);

  getImageUrl(path: string): string {
    return this.service.getImageUrl(path);
  }

  deleteImage(id: number | undefined): void {
    if (!id) return;

    this.service.deleteImage(id).subscribe({
      next: () => {
        console.log('Image supprimée avec succès');
        this.service.triggerRefresh();
      },
      error: (err) => console.error("Erreur lors de la suppression de l'image:", err),
    });
  }

  searchImageByName(name: string): void {
    this.service
      .searchImageByName(name, {
        page: this.currentPage(),
        size: this.pageSize(),
      })
      .subscribe({
        next: (res) => {
          this.searchResults.set(res.data.content);
        },
        error: (err) => console.error(err),
      });
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
  }

  changePageSize(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(0);
  }
}
