import { Component, input, output, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CurrentUser } from '../../../auth/auth.interface';
import { UpdateProfileRequest } from '../../account.interface';

@Component({
  selector: 'app-edit-form',
  imports: [ReactiveFormsModule, RouterLink],
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
      phone: ['', [Validators.required]],
      address: this.fb.group({
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        postalCode: ['', [Validators.required]],
        country: ['', [Validators.required]],
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
  blockNumbers(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/[0-9]/g, '');
    if (cleaned !== input.value) {
      input.value = cleaned;
      this.form.get('firstName')?.setValue(cleaned, { emitEvent: false });
    }
  }
  get firstName() {
    return this.form.get('firstName');
  }
  get lastName() {
    return this.form.get('lastName');
  }
  get email() {
    return this.form.get('email');
  }
  get phone() {
    return this.form.get('phone');
  }
  get street() {
    return this.form.get('address')?.get('street');
  }
  get postalCode() {
    return this.form.get('address')?.get('postalCode');
  }
  get city() {
    return this.form.get('address')?.get('city');
  }
  get country() {
    return this.form.get('address')?.get('country');
  }
}
