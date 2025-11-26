import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ScoreRow {
  id: number;
  nickname: string;
  points: number;
  level: number;
}

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private api = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  getTop(level: number, limit = 5): Observable<ScoreRow[]> {
    return this.http.get<ScoreRow[]>(
      `${this.api}/leaderboard?level=${level}&limit=${limit}`
    );
  }
}
