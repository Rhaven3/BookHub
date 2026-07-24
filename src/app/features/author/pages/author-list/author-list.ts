import { Component, OnInit } from '@angular/core';
import { Author } from '../../models/author';
import { AuthorService } from '../../services/author';

@Component({
  selector: 'app-author-list',
  imports: [],
  templateUrl: './author-list.html',
  styleUrl: './author-list.css',
})
export class AuthorList implements OnInit {
  authors: Author[] = [
    { id: 1, firstName: 'Jules', name: 'Verne' },
    { id: 2, firstName: 'Victor', name: 'Hugo' },
  ];

  constructor(private authorService: AuthorService) {}

  ngOnInit(): void {
    // À réactiver lorsque l'auth JWT sera intégrée
    //this.authorService.getAuthors().subscribe((data) => {this.authors = data;});
  }
}
