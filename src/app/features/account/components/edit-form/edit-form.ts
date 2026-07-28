import { Component, input, output, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CurrentUser } from '../../../auth/auth.interface';
import { UpdateProfileRequest } from '../../account.interface';
import { FormInput } from '../../../../shared/components/form-input/form-input';

@Component({
  selector: 'app-edit-form',
  imports: [ReactiveFormsModule, RouterLink, FormInput],
  templateUrl: './edit-form.html',
  styleUrl: './edit-form.css',
})
export class EditForm {
  initialValue = input<CurrentUser | null>(null);
  loading = input(false);
  errorMessage = input<string | null>(null);
  submitForm = output<UpdateProfileRequest>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ' -]+$/)]],
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ' -]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      address: this.fb.group({
        street: ['', [Validators.required]],
        city: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ' -]+$/)]],
        postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
        country: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ' -]+$/)]],
      }),
    });

    effect(() => {
      const value = this.initialValue();
      if (value) {
        this.form.patchValue({
          lastName: value.lastName,
          firstName: value.firstName,
          email: value.email,
          phone: value.phone,
          address: value.addressDTO,
        });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitForm.emit(this.form.value as UpdateProfileRequest);
  }
  setFieldError(field: string, message: string): void {
    const control = this.form.get(field);
    if (control) {
      control.setErrors({ ...control.errors, serverError: message });
      control.markAsTouched();
    }
  }

  
}
