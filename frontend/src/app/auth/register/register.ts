import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  error = '';
  ok = false;

  constructor(private auth: AuthService) {}

  register() {
    this.error = '';
    this.ok = false;

    if (!this.username.trim()) {
      this.error = 'Username cannot be empty';
      return;
    }

    if (!this.email.trim() || !this.email.includes('@')) {
      this.error = 'Invalid email address';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }

    this.auth.register(this.username, this.email, this.password).subscribe({
      next: () => {
        this.ok = true;
      },
      error: (err) => {
        if (err.error && err.error.detail) {
          this.error = err.error.detail;
        } else {
          this.error = 'Registration failed';
        }
      }
    });
  }
}
