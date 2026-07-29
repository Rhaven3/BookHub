import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ENVIRONMENT } from '../../../environments/environment';
import { Pageable } from '../../../shared/interfaces/pageable';
import { ApiResponse } from '../../../shared/interfaces/apiResponse';
import { Page } from '../../../shared/interfaces/page';

import { Editor } from '../editor.interface';

@Injectable({
  providedIn: 'root',
})
export class EditorService {
  private http = inject(HttpClient);
  private baseUrl = ENVIRONMENT.apiUrl;

  refreshTrigger = signal(0);

  triggerRefresh(): void {
    this.refreshTrigger.update((v) => v + 1);
  }

  getEditors(pageable: Pageable): Observable<Page<Editor>> {
    return this.http.get<Page<Editor>>(
      `${this.baseUrl}/editor?page=${pageable.page}&size=${pageable.size}`
    );
  }

  getEditorById(id: number): Observable<Editor> {
    return this.http.get<Editor>(`${this.baseUrl}/editor/${id}`);
  }

  createEditor(editor: Editor): Observable<Editor> {
    return this.http.post<Editor>(`${this.baseUrl}/editor`, editor);
  }

  updateEditor(id: number, editor: Editor): Observable<Editor> {
    return this.http.put<Editor>(`${this.baseUrl}/editor/${id}`, editor);
  }

  deleteEditor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/editor/${id}`);
  }
}
