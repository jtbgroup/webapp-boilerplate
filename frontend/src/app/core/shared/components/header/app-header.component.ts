import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  template: `
    <mat-toolbar color="primary">
      <span class="app-title">webappboilerplate</span>
      <span class="spacer"></span>

      <!-- Admin menu (ADMIN role only) -->
      @if (authService.currentUser()?.role === 'ADMIN') {
        <button mat-button [matMenuTriggerFor]="adminMenu" class="nav-menu-btn">
          <mat-icon>admin_panel_settings</mat-icon>
          Admin
          <mat-icon class="chevron">arrow_drop_down</mat-icon>
        </button>
        <mat-menu #adminMenu="matMenu">
          <button mat-menu-item (click)="router.navigate(['/admin/users'])">
            <mat-icon>group</mat-icon>
            Users
          </button>
        </mat-menu>
      }

      <!-- User menu -->
      <button mat-icon-button [matMenuTriggerFor]="userMenu" class="user-menu-btn" title="User menu">
        <mat-icon>account_circle</mat-icon>
      </button>
      <mat-menu #userMenu="matMenu">
        <div class="user-menu-header" mat-menu-item disabled>
          <mat-icon>person</mat-icon>
          <span class="username-label">{{ authService.currentUser()?.username }}</span>
        </div>
        <mat-divider />
        <button mat-menu-item (click)="router.navigate(['/me/change-password'])">
          <mat-icon>lock</mat-icon>
          Change password
        </button>
        <mat-divider />
        <button mat-menu-item (click)="authService.logout()">
          <mat-icon>logout</mat-icon>
          Logout
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .spacer { flex: 1; }

    .app-title {
      font-size: 1.1rem;
      font-weight: 600;
      letter-spacing: 0.02em;
    }

    .nav-menu-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-right: 4px;
    }

    .nav-menu-btn mat-icon.chevron {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .user-menu-btn {
      margin-left: 4px;
    }

    .user-menu-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      opacity: 1 !important;
      cursor: default;
    }

    .username-label {
      font-weight: 500;
      font-size: 0.9rem;
    }
  `]
})
export class AppHeaderComponent {
  readonly authService = inject(AuthService);
  readonly router = inject(Router);
}