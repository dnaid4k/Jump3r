import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private api = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.api}/admin/users`);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.api}/admin/delete-user/${id}`);
  }
}
