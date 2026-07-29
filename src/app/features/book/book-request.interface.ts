export interface BookRequest {
  title: string;
  description: string;
  publishDate: string;
  language: string;
  isbn: string;
  available: boolean;
  editorId: number;

  authorIds: number[];
  categoryIds: number[];
  imageIds: number[];
}
