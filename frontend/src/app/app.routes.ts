import { Routes } from '@angular/router';
import { GameComponent } from './game/game';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { AdminComponent } from './admin/admin';

export const routes: Routes = [
  { path: '', component: GameComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];