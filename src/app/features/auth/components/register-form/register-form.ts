import { Component, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RegisterRequest } from '../../auth.interface';
import { FormInput } from '../../../../shared/components/form-input/form-input';
import { AddressAutocomplete } from '../../../../shared/components/address-autocomplete/address-autocomplete';
import { AddressSuggestion } from '../../../../shared/interfaces/address-suggestion.interface';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, RouterLink, FormInput, AddressAutocomplete],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  loading = input(false);
  errorMessage = input<string | null>(null);
  submitForm = output<RegisterRequest>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ' -]+$/)]],
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ' -]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: this.fb.group({
        street: ['', [Validators.required]],
        city: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ' -]+$/)]],
        postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
        country: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ' -]+$/)]],
      }),
    });
  }
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitForm.emit(this.form.value as RegisterRequest);
  }
  setFieldError(field: string, message: string): void {
    const control = this.form.get(field);
    if (control) {
      control.setErrors({ ...control.errors, serverError: message });
      control.markAsTouched();
    }
  }
  onAddressSelected(suggestion: AddressSuggestion): void {
    this.form.get('address')?.patchValue({
      city: suggestion.city,
      postalCode: suggestion.postalCode,
      country: suggestion.country,
    });
  }
}
