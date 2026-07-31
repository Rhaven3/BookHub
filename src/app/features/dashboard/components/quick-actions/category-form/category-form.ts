import { Component, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormInput } from '../../../../../shared/components/form-input/form-input';
import { CategoryService } from '../../../../category/services/category';
import { CategoryRequest } from '../../../../category/category.interface';

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule, RouterLink, FormInput],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm {
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  submitForm = output<CategoryRequest>();

  loading = input(false);
  errorMessage = input<string | null>(null);

  cancelRoute = input<string | null>('/category');
  cancel = output<void>();

  categoryId?: number;
  isEditMode = false;

  categoryForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ' -]+$/)],
    }),
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.categoryId = Number(id);
      this.isEditMode = true;
      this.categoryService.getCategoryById(this.categoryId).subscribe({
        next: (category) => {
          this.categoryForm.patchValue({
            name: category.name,
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
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const category = this.categoryForm.getRawValue();

    if (this.isEditMode && this.categoryId) {
      this.categoryService.updateCategory(this.categoryId, category).subscribe({
        next: (updated) => {
          this.categoryService.triggerRefresh();
          this.submitForm.emit(updated);
        },
        error: (err) => console.error(err),
      });
    } else {
      this.categoryService.createCategory(category).subscribe({
        next: (created) => {
          this.categoryService.triggerRefresh();
          this.submitForm.emit(created);
        },
        error: (err) => console.error(err),
      });
    }
  }
  setFieldError(field: string, message: string): void {
    const control = this.categoryForm.get(field);
    if (control) {
      control.setErrors({ ...control.errors, serverError: message });
      control.markAsTouched();
    }
  }
}

