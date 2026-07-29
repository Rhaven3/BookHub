import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Author } from '../../../author/author.interface';
import { Category } from '../../../category/category.interface';
import { Editor } from '../../../editor/editor.interface';

@Component({
  selector: 'app-book-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './book-filter.html',
  styleUrl: './book-filter.css',
})
export class BookFilter {
  @Input() authors: Author[] = [];
  @Input() categories: Category[] = [];
  @Input() editors: Editor[] = [];

  @Output() filterChange = new EventEmitter<{
    authorId: number | null;
    categoryId: number | null;
    editorId: number | null;
  }>();

  selectedAuthor: number | null = null;
  selectedCategory: number | null = null;
  selectedEditor: number | null = null;

  onFilterChange(): void {
    this.filterChange.emit({
      authorId: this.selectedAuthor,
      categoryId: this.selectedCategory,
      editorId: this.selectedEditor,
    });
  }
}
