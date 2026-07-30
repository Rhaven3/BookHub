import { inject, Injectable } from '@angular/core';
import { Pageable } from '../../../shared/interfaces/pageable';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/interfaces/apiResponse';
import { Page } from '../../../shared/interfaces/page';
import { Book } from '../../book/book.interface';
import { HttpClient } from '@angular/common/http';
import { ENVIRONMENT } from '../../../environments/environment';
import { RatingInterface } from '../rating.interface';

@Injectable({
  providedIn: 'root',
})
export class RatingService {

  private http = inject(HttpClient);
  private baseUrl = ENVIRONMENT.apiUrl;

  getRatingByBook(bookId: number, pageable: Pageable): Observable<ApiResponse<Page<RatingInterface>>> {
    return this.http.get<ApiResponse<Page<RatingInterface>>>(
      `${this.baseUrl}/rating/book/${bookId}?page=${pageable.page}&size=${pageable.size}`,
    );
  }
}
