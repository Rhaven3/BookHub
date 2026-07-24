import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImageService } from '../../service/image-service';

@Component({
  selector: 'app-form-add-image',
  imports: [ReactiveFormsModule],
  templateUrl: './form-add-image.html',
  styleUrl: './form-add-image.css',
})
export class FormAddImage {

  private service = inject(ImageService);

  imageForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  selectedFile: File | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    if (!this.selectedFile) return;

    this.service.addImage(this.imageForm.value.name!, this.selectedFile).subscribe({
      next: (res) => {
        console.log('Uploadé:', res);
        this.imageForm.reset();
        this.selectedFile = null;
        res.data.path;
        this.service.triggerRefresh();
      },
      error: (err) => console.error('Erreur:', err),
    });
  }
}
