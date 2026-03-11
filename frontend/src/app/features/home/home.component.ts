import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary">
      <span>webappboilerplate</span>
      <span class="spacer"></span>
      <span class="username">{{ authService.currentUser()?.username }}</span>
      <button mat-icon-button (click)="authService.logout()" title="Logout">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>

    <div class="content">
      <h2>Welcome, {{ authService.currentUser()?.username }}</h2>
      <p>Role: {{ authService.currentUser()?.role }}</p>
    </div>
  `,
  styles: [`
    .spacer { flex: 1; }
    .username { margin-right: 8px; font-size: 0.9rem; }
    .content { padding: 32px; }
  `]
})
export class HomeComponent {
  constructor(public authService: AuthService) {}
}
