import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BrowseComponent } from './components/browse/browse.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LandingComponent } from './components/landing/landing.component';
import { PlayerComponent } from './components/player/player.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent, canActivate: [guestGuard] },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'browse', component: BrowseComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'watch/:id', component: PlayerComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
