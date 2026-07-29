import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FlashMessageService {
  message = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  show(text: string, type: 'success' | 'error', duration = 4000) {
    this.message.set({ type, text });
    setTimeout(() => this.message.set(null), duration);
  }
  success(text: string) {
    this.show(text, 'success');
  }
  error(text: string) {
    this.show(text, 'error');
  }
}
