import { Component, Input, Output, EventEmitter, inject, OnDestroy, signal } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { AddressSuggestion } from '../../interfaces/address-suggestion.interface';
import { AddressGeocodingService } from '../../services/addres-geocoding';

@Component({
  selector: 'app-address-autocomplete',
  standalone: true,
  imports: [],
  templateUrl: './address-autocomplete.html',
  styleUrl: './address-autocomplete.css',
})
export class AddressAutocomplete implements OnDestroy {
  @Input() label = 'Adresse';
  @Input() placeholder = 'Commencez à taper une adresse...';
  @Input() autocomplete = 'off';
  @Input() requiredMessage = 'Ce champ est requis.';

  @Output() addressSelected = new EventEmitter<AddressSuggestion>();

  value = '';
  disabled = false;

  // Signals plutôt que propriétés simples — garantit le re-render
  // même si l'app tourne en zoneless change detection.
  suggestions = signal<AddressSuggestion[]>([]);
  isOpen = signal(false);
  isLoading = signal(false);

  private geocodingService = inject(AddressGeocodingService);
  private ngControl = inject(NgControl, { optional: true, self: true });

  private inputChanges = new Subject<string>();
  private destroy$ = new Subject<void>();

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    this.inputChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          this.isLoading.set(true);
          return this.geocodingService.search(query);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((results) => {
        this.suggestions.set(results);
        this.isLoading.set(false);
        this.isOpen.set(results.length > 0);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get control() {
    return this.ngControl?.control ?? null;
  }

  get invalid(): boolean {
    return !!this.control?.invalid && !!this.control?.touched;
  }

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
    this.inputChanges.next(this.value);
  }

  onFocus(): void {
    if (this.suggestions().length > 0) {
      this.isOpen.set(true);
    }
  }

  onBlur(): void {
    setTimeout(() => {
      this.isOpen.set(false);
      this.onTouched();
    }, 150);
  }

  selectSuggestion(suggestion: AddressSuggestion): void {
    this.value = suggestion.street;
    this.onChange(this.value);
    this.isOpen.set(false);
    this.suggestions.set([]);
    this.addressSelected.emit(suggestion);
  }
}
