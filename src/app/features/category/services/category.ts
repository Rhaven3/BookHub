import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ENVIRONMENT } from '../../../environments/environment';
import { Pageable } from '../../../shared/interfaces/pageable';
import { Page } from '../../../shared/interfaces/page';

import { Category } from '../category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private baseUrl = ENVIRONMENT.apiUrl;

  refreshTrigger = signal(0);

  triggerRefresh(): void {
    this.refreshTrigger.update((v) => v + 1);
  }

  getCategories(pageable: Pageable): Observable<Page<Category>> {
    return this.http.get<Page<Category>>(
      `${this.baseUrl}/category?page=${pageable.page}&size=${pageable.size}`
    );
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/category/${id}`);
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/category`, category);
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/category/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/category/${id}`);
  }
}
