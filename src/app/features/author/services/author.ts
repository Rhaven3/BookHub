import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ENVIRONMENT } from '../../../environments/environment';
import { Pageable } from '../../../shared/interfaces/pageable';
import { ApiResponse } from '../../../shared/interfaces/apiResponse';
import { Page } from '../../../shared/interfaces/page';
import { Author } from '../author.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private http = inject(HttpClient);
  private baseUrl = ENVIRONMENT.apiUrl;

  refreshTrigger = signal(0); // ← nouveau

  triggerRefresh(): void {
    this.refreshTrigger.update((v) => v + 1);
  }

  getAuthors(pageable: Pageable): Observable<Page<Author>> {
    return this.http.get<Page<Author>>(
      `${this.baseUrl}/author?page=${pageable.page}&size=${pageable.size}`,
    );
  }

  createAuthor(author: Author): Observable<Author> {
    return this.http.post<Author>(`${this.baseUrl}/author`, author);
  }
}
