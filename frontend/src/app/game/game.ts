import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LeaderboardService } from '../services/leaderboard.service';
import { ScoreService } from '../services/score.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './game.html',
  styleUrls: ['./game.css']
})
export class GameComponent implements AfterViewInit, OnInit {
  @ViewChild('gameCanvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D | null;

  gameStarted = false;
  difficulty = 1;
  score = 0;
  playerY = 0;
  playerVel = 0;
  gravity = 0.3;

  obstacles: { x: number; letter: string }[] = [];
  alphabet = '';

  topL1: any[] = [];
  topL2: any[] = [];

  isLoggedIn = false;
  isAdmin = false;
  username: string | null = null;

  private rafId: number | null = null;
  private gameOver = false;

  constructor(
    private leaderboardService: LeaderboardService,
    private scoreService: ScoreService,
    private auth: AuthService
  ) {}

  ngAfterViewInit() {
    this.ctx = null;
  }

  ngOnInit() {
    this.fetchLeaderboard();

    this.auth.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.username = user?.username ?? null;
      this.isAdmin = user?.is_admin ?? false;
    });
  }

  fetchLeaderboard() {
    this.leaderboardService.getTop(1).subscribe(rows => (this.topL1 = rows));
    this.leaderboardService.getTop(2).subscribe(rows => (this.topL2 = rows));
  }

  logout() {
    this.auth.logout();
    this.gameStarted = false;
    alert('Logged out');
  }

  private startLoop() {
    if (this.rafId) return;
    this.rafId = requestAnimationFrame(() => this.loop());
  }

  private stopLoop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  loop() {
    if (this.gameOver) return;
    this.update();
    this.draw();
    this.rafId = requestAnimationFrame(() => this.loop());
  }

  update() {
    this.playerVel += this.gravity;
    this.playerY += this.playerVel;

    if (this.playerY > 0) {
      this.playerY = 0;
      this.playerVel = 0;
    }

    const speed = 2;
    for (let i = 0; i < this.obstacles.length; i++) {
      this.obstacles[i].x -= speed;
    }

    const first = this.obstacles[0];
    if (first && !this.gameOver) {
      const playerLeft = 50;
      const playerRight = 50 + 20;
      const obsLeft = first.x;
      const obsRight = first.x + 20;
      const overlapping = obsLeft < playerRight && obsRight > playerLeft;

      if (overlapping && this.playerY === 0) {
        this.gameOver = true;
        this.stopLoop();
        setTimeout(() => this.onGameOver(), 10);
      }
    }

    if (first && first.x < -40) {
      this.obstacles.shift();
      this.score++;
    }

    const last = this.obstacles[this.obstacles.length - 1];
    if (!last || last.x < 400) {
      if (this.alphabet.length > 0) {
        const randomLetter =
          this.alphabet[Math.floor(Math.random() * this.alphabet.length)];
        this.obstacles.push({ x: 800, letter: randomLetter });
      }
    }
  }

  draw() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, 800, 300);

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('          Score: ' + this.score, 20, 32);

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 250, 800, 2);

    ctx.fillStyle = 'black';
    ctx.fillRect(50, 230 + this.playerY, 20, 20);

    ctx.font = '20px Arial';
    ctx.textAlign = 'center';

    for (let o of this.obstacles) {
      ctx.fillStyle = 'blue';
      ctx.fillRect(o.x, 230, 20, 20);
      ctx.fillStyle = 'black';
      ctx.fillText(o.letter.toUpperCase(), o.x + 10, 225);
    }
  }

  jump() {
    if (this.playerY === 0) {
      this.playerVel = -10;
    }
  }

  private onGameOver() {
    if (this.auth.isLoggedIn()) {
      const user = this.auth.getCurrentUser();
      if (!user) return;

      this.scoreService
        .saveScore(user.username, this.score, this.difficulty)
        .subscribe({
          next: result => {
            if (result.updated) {
              alert(`✨New High Score! ${this.score}`);
            } else if (result.created) {
              alert(`✨Score saved! ${this.score}`);
            } else {
              alert(
                `Your score ${this.score} is lower than your best.`
              );
            }
            this.resetToMenu();
          },
          error: () => {
            alert('Failed to save score');
            this.resetToMenu();
          }
        });
    } else {
      const send = confirm(
        `GAME OVER\nScore: ${this.score}\nSend to leaderboard?`
      );
      if (send) {
        const name = prompt('Your name? (optional)', 'anon') ?? 'anon';
        this.scoreService
          .saveScore(name, this.score, this.difficulty)
          .subscribe({
            next: () => this.resetToMenu(),
            error: () => {
              alert('Failed to save score');
              this.resetToMenu();
            }
          });
      } else {
        this.resetToMenu();
      }
    }
  }

  private resetToMenu() {
    this.stopLoop();
    this.gameOver = false;
    this.gameStarted = false;
    this.alphabet = '';
    this.obstacles = [];
    this.score = 0;
    this.playerY = 0;
    this.playerVel = 0;
    this.rafId = null;
    this.fetchLeaderboard();
  }

  startGame(level: number) {
    this.stopLoop();
    this.gameOver = false;
    this.gameStarted = true;
    this.score = 0;
    this.playerY = 0;
    this.playerVel = 0;
    this.obstacles = [];

    this.difficulty = level;
    if (level === 1) {
      this.alphabet = 'abcdefghijklmnopqrstuvwxyz';
    } else {
      this.alphabet = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*(';
    }

    setTimeout(() => {
      if (this.canvasRef && this.canvasRef.nativeElement) {
        this.ctx = this.canvasRef.nativeElement.getContext('2d');
      } else {
        this.ctx = null;
      }

      if (this.alphabet.length > 0) {
        const randomLetter =
          this.alphabet[Math.floor(Math.random() * this.alphabet.length)];
        this.obstacles.push({ x: 800, letter: randomLetter });
      }

      this.startLoop();
    }, 0);
  }

  @HostListener('document:keydown', ['$event'])
  handleKey(ev: KeyboardEvent) {
    if (this.gameOver) return;
    if (!this.gameStarted) return;
    if (this.obstacles.length === 0) return;
    const first = this.obstacles[0];
    if (ev.key.toLowerCase() === first.letter) {
      this.jump();
    }
  }
}
