import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService, AdminUser } from '../services/admin.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit {
  users: AdminUser[] = [];
  error = '';
  loading = true;

  constructor(
    private adminService: AdminService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    if (!this.auth.isAdmin()) {
      this.error = 'Not authorized';
      this.loading = false;
      return;
    }

    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = '';

    this.adminService.getUsers().subscribe({
      next: users => {
        this.users = users;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Cannot load users';
        this.loading = false;
      }
    });
  }

  deleteUser(id: number) {
    if (!confirm('Delete this user?')) {
      return;
    }

    this.adminService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
      },
      error: () => {
        alert('Delete failed');
      }
    });
  }
}
