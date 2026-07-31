import { Component, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthorService } from '../../../../author/services/author';
import { FormInput } from '../../../../../shared/components/form-input/form-input';

@Component({
  selector: 'app-author-form',
  imports: [ReactiveFormsModule, RouterLink, FormInput],
  templateUrl: './author-form.html',
  styleUrl: './author-form.css',
})
export class AuthorForm {
  private service = inject(AuthorService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = input(false);
  errorMessage = input<string | null>(null);

  cancelRoute = input<string | null>('/author');
  cancel = output<void>();

  authorId?: number;
  isEditMode = false;

  authorForm = new FormGroup({
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ' -]+$/)],
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ' -]+$/)],
    }),
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.authorId = Number(id);
      this.isEditMode = true;
      this.service.getAuthorById(this.authorId).subscribe({
        next: (author) => {
          this.authorForm.patchValue({
            firstName: author.firstName,
            lastName: author.lastName,
          });
        },
        error: (err) => console.error(err),
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onSubmit(): void {
    if (this.authorForm.invalid) {
      this.authorForm.markAllAsTouched();
      return;
    }

    const author = this.authorForm.getRawValue();

    if (this.isEditMode && this.authorId) {
      this.service.updateAuthor(this.authorId, author).subscribe({
        next: () => {
          this.service.triggerRefresh();
          this.router.navigate(['/author']);
        },
        error: (err) => console.error(err),
      });
    } else {
      this.service.createAuthor(author).subscribe({
        next: () => {
          this.service.triggerRefresh();
          this.router.navigate(['/author']);
        },
        error: (err) => console.error(err),
      });
    }
  }

  setFieldError(field: string, message: string): void {
    const control = this.authorForm.get(field);
    if (control) {
      control.setErrors({ ...control.errors, serverError: message });
      control.markAsTouched();
    }
  }
}
