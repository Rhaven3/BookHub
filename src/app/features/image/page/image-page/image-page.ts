import { Component } from '@angular/core';
import { FormAddImage } from '../../components/form-add-image/form-add-image';

@Component({
  selector: 'app-image-page',
  imports: [FormAddImage],
  templateUrl: './image-page.html',
  styleUrl: './image-page.css',
})
export class ImagePage {}
