import { Author } from '../author/author.interface';
import { Category } from '../category/category.interface';
import { Editor } from '../editor/editor.interface';
import { ImageInterface } from '../image/image.interface';

export interface Book {
  id: number;

  title: string;
  description: string;
  publishDate: string;

  language: string;
  isbn: string;

  available: boolean;
  owned: boolean;

  authors: Author[];
  categories: Category[];
  editor: Editor;
  images: ImageInterface[];
}
