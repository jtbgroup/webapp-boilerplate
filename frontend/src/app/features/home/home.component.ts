import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `
    <div class="home-container">
      <div class="welcome-card">
        <div class="welcome-icon">👋</div>
        <h1 class="welcome-title">
          Hello, <span class="username">{{ authService.currentUser()?.username }}</span>
        </h1>
        <p class="welcome-subtitle">Welcome back to your dashboard</p>
        <div class="roles-container">
          @for (role of authService.currentUser()?.roles; track role) {
            <div class="role-badge">
              <span class="role-dot"></span>
              {{ role }}
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [\`
    .home-container {
      display: flex;
      align-items: flex-start;
      padding: 48px 0 0;
    }

    .welcome-card {
      background: white;
      border-radius: 16px;
      padding: 40px 48px;
      box-shadow: 0 4px 24px rgba(26, 35, 126, 0.08);
      border: 1px solid rgba(26, 35, 126, 0.06);
      min-width: 340px;
    }

    .welcome-icon {
      font-size: 2.5rem;
      margin-bottom: 12px;
    }

    .welcome-title {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0 0 8px;
      color: #1a1a2e;
    }

    .username {
      color: #3949ab;
    }

    .welcome-subtitle {
      color: #6b7280;
      margin: 0 0 20px;
      font-size: 0.95rem;
    }

    .roles-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .role-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #e8eaf6;
      color: #1a237e;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: 6px 12px;
      border-radius: 20px;
    }

    .role-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #3949ab;
    }
  \`]
})
export class HomeComponent {
  readonly authService = inject(AuthService);
}