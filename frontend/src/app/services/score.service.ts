import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScoreService {
  private api = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  saveScore(nickname: string, points: number, level: number): Observable<any> {
    return this.http.post(`${this.api}/score`, {
      nickname,
      points,
      level
    });
  }
}
