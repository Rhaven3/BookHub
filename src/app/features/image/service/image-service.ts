import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/interfaces/apiResponse';
import { ImageInterface } from '../image.interface';
import { inject, Injectable, signal } from '@angular/core';
import { ENVIRONMENT } from '../../../environments/environment';
import { Pageable } from '../../../shared/interfaces/pageable';
import { Page } from '../../../shared/interfaces/page';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private http = inject(HttpClient);
  private baseUrl = ENVIRONMENT.apiUrl;

  refreshTrigger = signal(0); // ← nouveau

  triggerRefresh(): void {
    this.refreshTrigger.update((v) => v + 1);
  }

  getImageUrl(path: string): string {
    const filename = path.replace('./uploads/', '');
    return `${this.baseUrl}/images/download/${filename}`;
  }

  getAllImage(pageable: Pageable): Observable<ApiResponse<Page<ImageInterface>>> {
    return this.http.get<ApiResponse<Page<ImageInterface>>>(
      `${this.baseUrl}/images?page=${pageable.page}&size=${pageable.size}`,
    );
  }

  addImage(name: string, file: File): Observable<ApiResponse<ImageInterface>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);

    return this.http.post<ApiResponse<ImageInterface>>(`${this.baseUrl}/images/upload`, formData);
  }

  deleteImage(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/images/${id}`);
  }

  searchImageByName(name: string, pageable: Pageable): Observable<ApiResponse<Page<ImageInterface>>> {
    return this.http.get<ApiResponse<Page<ImageInterface>>>(
      `${this.baseUrl}/images/search?name=${name}&page=${pageable.page}&size=${pageable.size}`,
    );
  }
}

