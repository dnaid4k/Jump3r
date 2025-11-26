import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

export interface AuthUser {
  token: string;
  username: string;
  is_admin: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://127.0.0.1:8000';
  private userSubject = new BehaviorSubject<AuthUser | null>(this.loadUser());

  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http
      .post<AuthUser>(`${this.api}/login`, { username, password })
      .pipe(tap(user => this.saveUser(user)));
  }

  register(username: string, email: string, password: string) {
    return this.http.post(`${this.api}/register`, {
      username,
      email,
      password
    });
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  isAdmin(): boolean {
    return this.userSubject.value?.is_admin === true;
  }

  getCurrentUser(): AuthUser | null {
    return this.userSubject.value;
  }

  getToken(): string | null {
    return this.userSubject.value?.token ?? null;
  }


  private loadUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem('user');
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }

  private saveUser(user: AuthUser) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }
}
