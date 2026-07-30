import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { input, output } from '@angular/core';
import { FormInput } from '../../../../../shared/components/form-input/form-input';
import {
  MultiSelect,
  SelectOption,
} from '../../../../../shared/components/multi-select/multi-select';
import { BookService } from '../../../../book/services/book';
import { AuthorService } from '../../../../author/services/author';
import { CategoryService } from '../../../../category/services/category';
import { EditorService } from '../../../../editor/services/editor';
import { Author } from '../../../../author/author.interface';
import { Category } from '../../../../category/category.interface';
import { Editor } from '../../../../editor/editor.interface';
import { ImageInterface } from '../../../../image/image.interface';
import { BookRequest } from '../../../../book/book-request.interface';
import { FormAddImage, PendingImage } from '../../../../image/components/form-add-image/form-add-image';

@Component({
  selector: 'app-book-form',
  imports: [ReactiveFormsModule, RouterLink, FormInput, MultiSelect, FormAddImage, FormAddImage],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css',
})
export class BookForm {
  private bookService = inject(BookService);
  private authorService = inject(AuthorService);
  private categoryService = inject(CategoryService);
  private editorService = inject(EditorService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  cancelRoute = input<string | null>('/book');
  cancel = output<void>();

  bookId?: number;
  isEditMode = false;

  // Listes disponibles pour la sélection
  availableCategories = signal<Category[]>([]);
  availableEditors = signal<Editor[]>([]);
  availableAuthors = signal<Author[]>([]);

  authorOptions = computed<SelectOption[]>(() =>
    this.availableAuthors().map((a) => ({
      id: a.id!,
      label: `${a.firstName} ${a.lastName}`,
    })),
  );

  // Sélections courantes
  selectedAuthorIds = signal<number[]>([]);
  selectedCategoryIds = signal<number[]>([]);

  // Nouveaux auteurs saisis mais pas encore créés en base
  pendingNewAuthors = signal<{ firstName: string; lastName: string }[]>([]);
  pendingAuthorLabels = computed(() =>
    this.pendingNewAuthors().map((a) => `${a.firstName} ${a.lastName}`),
  );

  // Images déjà associées au livre (mode édition uniquement) — celles
  // décochées/retirées ne seront plus dans keepImageIds au submit
  existingImages = signal<ImageInterface[]>([]);

  // Nouvelles images sélectionnées mais pas encore uploadées (fichier + nom)
  pendingImages = signal<PendingImage[]>([]);

  submitError = signal<string | null>(null);

  bookForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(2000)],
    }),
    publishDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    language: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    isbn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^(97(8|9))?\d{9}(\d|X)$/)],
    }),
    editorId: new FormControl<number | null>(null, { validators: [Validators.required] }),
  });

  ngOnInit(): void {
    this.authorService.getAuthors({ page: 0, size: 200 }).subscribe({
      next: (page) => this.availableAuthors.set(page.content),
      error: (err) => console.error(err),
    });

    this.categoryService.getCategories({ page: 0, size: 200 }).subscribe({
      next: (page) => this.availableCategories.set(page.content),
      error: (err) => console.error(err),
    });

    this.editorService.getEditors({ page: 0, size: 200 }).subscribe({
      next: (page) => this.availableEditors.set(page.content),
      error: (err) => console.error(err),
    });

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.bookId = Number(id);
      this.isEditMode = true;
      this.bookService.getBookById(this.bookId).subscribe({
        next: (book) => {
          this.bookForm.patchValue({
            title: book.title,
            description: book.description,
            publishDate: book.publishDate,
            language: book.language,
            isbn: book.isbn,
            editorId: book.editor?.id ?? null,
          });
          this.selectedAuthorIds.set(
            book.authors.map((a) => a.id).filter((x): x is number => x !== undefined),
          );
          this.selectedCategoryIds.set(book.categories.map((c) => c.id));
          this.existingImages.set(book.images ?? []);
        },
        error: (err) => console.error(err),
      });
    }
  }

  toggleCategory(id: number): void {
    this.selectedCategoryIds.update((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
    );
  }

  onCreateAuthorInline(term: string): void {
    const [firstName, ...rest] = term.split(' ');
    const lastName = rest.join(' ') || firstName;
    this.pendingNewAuthors.update((list) => [...list, { firstName, lastName }]);
  }

  onRemovePendingAuthor(index: number): void {
    this.pendingNewAuthors.update((list) => list.filter((_, i) => i !== index));
  }

  onImageAdded(image: PendingImage): void {
    this.pendingImages.update((list) => [...list, image]);
  }

  removePendingImage(index: number): void {
    this.pendingImages.update((list) => list.filter((_, i) => i !== index));
  }

  removeExistingImage(id: number): void {
    this.existingImages.update((list) => list.filter((img) => img.id !== id));
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onSubmit(): void {
    this.submitError.set(null);

    const hasAnyAuthor = this.selectedAuthorIds().length > 0 || this.pendingNewAuthors().length > 0;

    if (this.bookForm.invalid || !hasAnyAuthor || this.selectedCategoryIds().length === 0) {
      this.bookForm.markAllAsTouched();
      this.submitError.set('Sélectionne au moins un auteur et une catégorie.');
      return;
    }

    const raw = this.bookForm.getRawValue();
    const book: BookRequest = {
      title: raw.title,
      description: raw.description,
      publishDate: raw.publishDate,
      language: raw.language,
      isbn: raw.isbn,
      editorId: raw.editorId as number,
      authorIds: this.selectedAuthorIds(),
      newAuthors: this.pendingNewAuthors(),
      categoryIds: this.selectedCategoryIds(),
      keepImageIds: this.existingImages()
        .map((img) => img.id)
        .filter((id): id is number => id !== undefined),
      newImageNames: this.pendingImages().map((img) => img.name),
    };
    const formData = new FormData();
    formData.append('book', new Blob([JSON.stringify(book)], { type: 'application/json' }));
    this.pendingImages().forEach((img) => formData.append('files', img.file));

    const request$ =
      this.isEditMode && this.bookId
        ? this.bookService.updateBook(this.bookId, formData)
        : this.bookService.createBook(formData);

    request$.subscribe({
      next: () => {
        this.bookService.triggerRefresh();
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        this.submitError.set("Une erreur est survenue lors de l'enregistrement.");
      },
    });
  }

  setFieldError(field: string, message: string): void {
    const control = this.bookForm.get(field);
    if (control) {
      control.setErrors({ ...control.errors, serverError: message });
      control.markAsTouched();
    }
  }
}
