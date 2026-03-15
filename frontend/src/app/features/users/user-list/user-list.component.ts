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
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
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