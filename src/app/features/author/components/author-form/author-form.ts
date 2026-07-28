import { Component, inject } from '@angular/core';
import { AuthorService } from '../../services/author';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-author-form',
  imports: [ReactiveFormsModule],
  templateUrl: './author-form.html',
  styleUrl: './author-form.css',
})
export class AuthorForm {
  private service = inject(AuthorService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  authorId?: number;
  isEditMode = false;

  authorForm = new FormGroup({
    fname: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lname: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.authorId = Number(id);
      this.isEditMode = true;
      this.service.getAuthorById(this.authorId).subscribe({
        next: (author) => {
          this.authorForm.patchValue({
            fname: author.fname,
            lname: author.lname,
          });
        },
        error: (err) => console.error(err),
      });
    }

  }

  onSubmit(): void {
    if (this.authorForm.invalid) {
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
}
