import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/interfaces/apiResponse';
import { ImageInterface } from '../image.interface';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '../../../environments/environment';
import { Pageable } from '../../../shared/interfaces/pageable';
import { Page } from '../../../shared/interfaces/page';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private http = inject(HttpClient);
  private baseUrl = ENVIRONMENT.apiUrl;

  addImage(name: string, file: File): Observable<ApiResponse<ImageInterface>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);

    return this.http.post<ApiResponse<ImageInterface>>(`${this.baseUrl}/images/upload`, formData);
  }

  // getAllImage(pageable : Pageable) : Observable<ApiResponse<Page<ImageInterface>>>{
  //   return
  // }
}

