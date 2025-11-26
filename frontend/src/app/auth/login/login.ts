import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.error = '';

    if (!this.username.trim()) {
      this.error = 'Username cannot be empty';
      return;
    }

    if (!this.password.trim()) {
      this.error = 'Password cannot be empty';
      return;
    }

    this.auth.login(this.username, this.password).subscribe({
      next: user => {
        alert('Logged in as ' + user.username);
        this.router.navigate(['/']);
      },
      error: (err) => {
        if (err.error && err.error.detail) {
          this.error = err.error.detail;
        } else {
          this.error = 'Login failed';
        }
      }
    });
  }
}
