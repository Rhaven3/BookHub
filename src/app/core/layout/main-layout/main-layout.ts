import { Component } from '@angular/core';
import { Footer } from '../footer/footer';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { FlashMessage } from '../../../shared/components/flash-message/flash-message';

@Component({
  selector: 'app-main-layout',
  imports: [Footer, RouterOutlet, Header, FlashMessage],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {}
