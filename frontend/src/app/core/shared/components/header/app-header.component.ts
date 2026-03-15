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
    <mat-toolbar class="app-toolbar">
      <span class="app-title">
        <span class="title-accent">webapp</span>boilerplate
      </span>

      <div class="nav-divider-left"></div>

      <!-- Future business menus would go here -->
      <!-- Example:
      @if (authService.currentUser()) {
        <button mat-button [matMenuTriggerFor]="projectsMenu" class="nav-menu-btn">
          Projects
          <mat-icon class="chevron">keyboard_arrow_down</mat-icon>
        </button>
        <mat-menu #projectsMenu="matMenu" class="nav-dropdown">
          <button mat-menu-item (click)="router.navigate(['/projects'])">
            All projects
          </button>
        </mat-menu>
      }
      -->

      <!-- Admin menu (ADMIN role only) -->
      @if (authService.hasRole('ADMIN')) {
        <button mat-button [matMenuTriggerFor]="adminMenu" class="nav-menu-btn">
          Admin
          <mat-icon class="chevron">keyboard_arrow_down</mat-icon>
        </button>
        <mat-menu #adminMenu="matMenu" class="nav-dropdown">
          <button mat-menu-item (click)="router.navigate(['/admin/users'])">
            <mat-icon>group</mat-icon>
            <span>Users</span>
          </button>
        </mat-menu>
      }

      <span class="spacer"></span>

      <div class="nav-divider"></div>

      <!-- User menu -->
      <button mat-button [matMenuTriggerFor]="userMenu" class="user-pill" title="User menu">
        <mat-icon class="user-avatar-icon">account_circle</mat-icon>
        <span class="username-chip">{{ authService.currentUser()?.username }}</span>
        <mat-icon class="chevron">keyboard_arrow_down</mat-icon>
      </button>
      <mat-menu #userMenu="matMenu" class="nav-dropdown">
        <div class="user-menu-header">
          <div class="user-role-badge">{{ authService.currentUser()?.roles?.join(', ') }}</div>
          <span class="username-label">{{ authService.currentUser()?.username }}</span>
        </div>
        <mat-divider />
        <button mat-menu-item (click)="router.navigate(['/me/change-password'])">
          <mat-icon>lock_outline</mat-icon>
          <span>Change password</span>
        </button>
        <mat-divider />
        <button mat-menu-item class="logout-item" (click)="authService.logout()">
          <mat-icon>logout</mat-icon>
          <span>Sign out</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .app-toolbar {
      background: linear-gradient(135deg, #1a237e 0%, #283593 60%, #3949ab 100%);
      color: white;
      height: 60px;
      padding: 0 24px;
      box-shadow: 0 2px 8px rgba(26, 35, 126, 0.35);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .spacer { flex: 1; }

    .app-title {
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: 0.03em;
      color: white;
    }

    .title-accent {
      color: #90caf9;
    }

    /* Nav menu buttons */
    .nav-menu-btn {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: 0.875rem;
      font-weight: 500;
      letter-spacing: 0.02em;
      border-radius: 6px;
      padding: 0 10px;
      height: 36px;
      transition: background 0.15s ease, color 0.15s ease;
    }

    /* Force white text on Material button — override theme */
    .nav-menu-btn,
    .nav-menu-btn .mdc-button__label,
    .nav-menu-btn mat-icon {
      color: rgba(255, 255, 255, 0.9) !important;
    }

    .nav-menu-btn:hover {
      background: rgba(255, 255, 255, 0.12) !important;
    }

    .nav-menu-btn:hover,
    .nav-menu-btn:hover .mdc-button__label,
    .nav-menu-btn:hover mat-icon {
      color: white !important;
    }

    .nav-menu-btn .chevron {
      font-size: 18px;
      width: 18px;
      height: 18px;
      opacity: 0.75;
      transition: transform 0.2s ease;
    }

    /* Thin separator right after the title */
    .nav-divider-left {
      width: 1px;
      height: 22px;
      background: rgba(255, 255, 255, 0.2);
      margin: 0 16px 0 20px;
    }

    /* Divider between nav items and user pill */
    .nav-divider {
      width: 1px;
      height: 24px;
      background: rgba(255, 255, 255, 0.2);
      margin: 0 12px;
    }

    /* User pill button */
    .user-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 0 12px 0 8px;
      height: 36px;
      font-size: 0.875rem;
      font-weight: 500;
      transition: background 0.15s ease;
    }

    .user-pill,
    .user-pill .mdc-button__label,
    .user-pill mat-icon {
      color: white !important;
    }

    .user-pill:hover {
      background: rgba(255, 255, 255, 0.18) !important;
    }

    .user-avatar-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
      opacity: 0.9;
    }

    .username-chip {
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .user-pill .chevron {
      font-size: 16px;
      width: 16px;
      height: 16px;
      opacity: 0.65;
    }

    /* Dropdown menu content */
    .user-menu-header {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 12px 16px;
      cursor: default;
      pointer-events: none;
    }

    .user-role-badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #1a237e;
      background: #e8eaf6;
      border-radius: 4px;
      padding: 2px 6px;
      width: fit-content;
      margin-bottom: 2px;
    }

    .username-label {
      font-weight: 600;
      font-size: 0.95rem;
      color: rgba(0, 0, 0, 0.85);
    }

    ::ng-deep .logout-item {
      color: #c62828 !important;
    }

    ::ng-deep .logout-item mat-icon {
      color: #c62828 !important;
    }
  `]
})
export class AppHeaderComponent {
  readonly authService = inject(AuthService);
  readonly router = inject(Router);
}
