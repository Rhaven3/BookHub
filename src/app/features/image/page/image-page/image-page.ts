import { Component } from '@angular/core';
import { FormAddImage } from '../../components/form-add-image/form-add-image';
import { ListImage } from '../../components/list-image/list-image';

@Component({
  selector: 'app-image-page',
  imports: [FormAddImage, ListImage],
  templateUrl: './image-page.html',
  styleUrl: './image-page.css',
})
export class ImagePage {}
