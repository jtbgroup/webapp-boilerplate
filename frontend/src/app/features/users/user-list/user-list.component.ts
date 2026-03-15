import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserService, UserManagementDto } from '../../../core/services/user.service';

const ALL_ROLES = ['ADMIN', 'PROJECT_MANAGER'];

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  template: `
    <div class="toolbar">
      <h2>Users</h2>
      <button mat-flat-button color="primary" (click)="startCreate()">New user</button>
    </div>

    @if (formVisible) {
    <div class="form-wrapper">
      <h3>{{ editingUser ? 'Edit user' : 'Create user' }}</h3>
      <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline">
          <mat-label>Username</mat-label>
          <input matInput formControlName="username" [readonly]="!!editingUser" required />
        </mat-form-field>

        @if (!editingUser) {
          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" required />
          </mat-form-field>
        }

        <mat-form-field appearance="outline">
          <mat-label>Roles</mat-label>
          <mat-select formControlName="roles" multiple required>
            @for (role of availableRoles; track role) {
              <mat-option [value]="role">{{ role }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-slide-toggle formControlName="enabled">Enabled</mat-slide-toggle>

        <div class="actions">
          <button mat-stroked-button type="button" (click)="cancel()">Cancel</button>
          <button mat-flat-button color="primary" type="submit" [disabled]="userForm.invalid">
            {{ editingUser ? 'Save' : 'Create' }}
          </button>
        </div>
      </form>
      @if (error) {
        <div class="error">{{ error }}</div>
      }
    </div>
    }

    @if (users?.length) {
    <table mat-table [dataSource]="users" class="user-table">
      <ng-container matColumnDef="username">
        <th mat-header-cell *matHeaderCellDef>Username</th>
        <td mat-cell *matCellDef="let user">{{ user.username }}</td>
      </ng-container>

      <ng-container matColumnDef="roles">
        <th mat-header-cell *matHeaderCellDef>Roles</th>
        <td mat-cell *matCellDef="let user">
          @for (role of user.roles; track role) {
            <span class="role-chip">{{ role }}</span>
          }
        </td>
      </ng-container>

      <ng-container matColumnDef="enabled">
        <th mat-header-cell *matHeaderCellDef>Status</th>
        <td mat-cell *matCellDef="let user">{{ user.enabled ? 'Enabled' : 'Disabled' }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let user">
          <button mat-icon-button (click)="edit(user)" title="Edit">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="disable(user)" [disabled]="!user.enabled" title="Disable">
            <mat-icon>block</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
    }

    @if (!users?.length) {
      <div class="empty">No users found.</div>
    }
  `,
  styles: [
    `
      .toolbar { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
      .form-wrapper { border: 1px solid rgba(0, 0, 0, 0.08); padding: 16px; margin-bottom: 24px; border-radius: 8px; }
      .actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
      .user-table { width: 100%; margin-top: 16px; }
      .empty { padding: 24px; text-align: center; color: rgba(0, 0, 0, 0.6); }
      .error { color: #c62828; margin-top: 8px; }
      .role-chip {
        display: inline-block;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.04em;
        background: #e8eaf6;
        color: #1a237e;
        border-radius: 4px;
        padding: 2px 7px;
        margin-right: 4px;
      }
    `
  ]
})
export class UserListComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);

  readonly availableRoles = ALL_ROLES;

  users: UserManagementDto[] = [];
  displayedColumns = ['username', 'roles', 'enabled', 'actions'];

  userForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    roles: this.fb.control<string[]>([], Validators.required),
    enabled: [true],
  });

  editingUser: UserManagementDto | null = null;
  formVisible = false;
  error: string | null = null;

  ngOnInit() {
    this.reload();
  }

  startCreate() {
    this.editingUser = null;
    this.error = null;
    this.formVisible = true;
    this.userForm.reset({ roles: [], enabled: true });
    this.userForm.get('password')?.setValidators([Validators.required]);
    this.userForm.get('password')?.updateValueAndValidity();
  }

  edit(user: UserManagementDto) {
    this.editingUser = user;
    this.error = null;
    this.formVisible = true;
    this.userForm.reset({
      username: user.username,
      password: '',
      roles: [...user.roles],
      enabled: user.enabled,
    });
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
  }

  cancel() {
    this.formVisible = false;
    this.editingUser = null;
    this.error = null;
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    const { username, password, roles, enabled } = this.userForm.value;

    if (this.editingUser) {
      this.userService.updateUser(this.editingUser.id, {
        roles: roles ?? [],
        enabled: enabled ?? false,
      }).subscribe({
        next: () => { this.reload(); this.cancel(); },
        error: () => { this.error = 'Unable to update user'; }
      });
      return;
    }

    this.userService.createUser({
      username: username ?? '',
      password: password ?? '',
      roles: roles ?? [],
      enabled: enabled ?? true,
    }).subscribe({
      next: () => { this.reload(); this.cancel(); },
      error: () => { this.error = 'Unable to create user'; }
    });
  }

  disable(user: UserManagementDto) {
    this.userService.disableUser(user.id).subscribe({
      next: () => this.reload(),
      error: () => (this.error = 'Unable to disable user'),
    });
  }

  private reload() {
    this.userService.listUsers().subscribe({
      next: users => (this.users = users),
      error: () => (this.error = 'Unable to load users'),
    });
  }
}
