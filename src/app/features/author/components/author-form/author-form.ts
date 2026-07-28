import { Component, inject } from '@angular/core';
import { AuthorService } from '../../services/author';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-author-form',
  imports: [ReactiveFormsModule],
  templateUrl: './author-form.html',
  styleUrl: './author-form.css',
})
export class AuthorForm {
  private service = inject(AuthorService);
  private router = inject(Router);

  authorForm = new FormGroup({
    fname: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lname: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  onSubmit(): void {
    if (this.authorForm.invalid) {
      return;
    }

    this.service.createAuthor(this.authorForm.getRawValue()).subscribe({
      next: () => {
        this.service.triggerRefresh();
        this.router.navigate(['/author']);
      },
      error: (err) => console.error(err),
    });
  }
}
