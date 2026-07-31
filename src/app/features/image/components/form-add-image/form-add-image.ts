import { Component, output, ElementRef, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormInput } from '../../../../shared/components/form-input/form-input';

export interface PendingImage {
  name: string;
  file: File;
}

@Component({
  selector: 'app-form-add-image',
  imports: [ReactiveFormsModule],
  templateUrl: './form-add-image.html',
  styleUrl: './form-add-image.css',
})
export class FormAddImage {
  added = output<PendingImage>();

  private fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  imageForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  selectedFile: File | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onAdd(): void {
    console.log('je passe ici !! ')
    if (!this.selectedFile || this.imageForm.invalid) {
      this.imageForm.markAllAsTouched();
      return;
    }

    this.added.emit({
      name: this.imageForm.value.name!,
      file: this.selectedFile,
    });

    this.imageForm.reset();
    this.selectedFile = null;

    // Vide réellement l'input file affiché (reset() du FormGroup ne suffit pas)
    const inputEl = this.fileInput()?.nativeElement;
    if (inputEl) {
      inputEl.value = '';
    }
  }
}
