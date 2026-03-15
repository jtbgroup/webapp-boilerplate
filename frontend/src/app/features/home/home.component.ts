import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `
    <h2>Welcome, {{ authService.currentUser()?.username }}</h2>
    <p>Role: {{ authService.currentUser()?.role }}</p>
  `,
  styles: [`
    h2 { margin-top: 0; }
  `]
})
export class HomeComponent {
  readonly authService = inject(AuthService);
}
