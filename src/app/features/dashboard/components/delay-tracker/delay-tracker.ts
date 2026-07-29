import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-delay-tracker',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './delay-tracker.html',
  styleUrl: './delay-tracker.css',
})
export class DelayTracker {}
