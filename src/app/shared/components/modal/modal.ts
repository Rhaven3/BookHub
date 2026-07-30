import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  isOpen = input(false);
  title = input('');
  closeModal = output<void>();

  onBackdropClick(): void {
    this.closeModal.emit();
  }

  onContentClick(event: Event): void {
    event.stopPropagation(); // empêche le clic dans la modale de la fermer
  }
}
