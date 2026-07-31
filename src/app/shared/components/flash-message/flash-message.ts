import { Component, inject } from '@angular/core';
import { FlashMessageService } from '../../../core/services/flashMessage/flash-message-service';

@Component({
  selector: 'app-flash-message',
  imports: [],
  templateUrl: './flash-message.html',
  styleUrl: './flash-message.css',
})
export class FlashMessage {
  protected flashService = inject(FlashMessageService);
}
