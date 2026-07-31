export interface BookRequest {
  title: string;
  description: string;
  publishDate: string;
  language: string;
  isbn: string;
  editorId: number;

  authorIds: number[];
  newAuthors: AuthorRequest[];

  categoryIds: number[];

  keepImageIds: number[];
  newImageNames: string[];
}

export interface AuthorRequest {
  firstName: string;
  lastName: string;
}
