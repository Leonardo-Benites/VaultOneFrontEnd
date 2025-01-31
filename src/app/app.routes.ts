import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { EventsComponent } from './pages/events/events.component';
import { UsersComponent } from './pages/users/users.component';
import { HomeComponent } from './pages/home/home.component'; 
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'events', component: EventsComponent},
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent },  
  { path: '**', redirectTo: 'login' },
];

// export const routes: Routes = [
//   { path: 'login', component: LoginComponent },
//   { path: 'events', component: EventsComponent, canActivate: [AuthGuard] },
//   { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
//   { path: 'home', component: HomeComponent },  // Home route
//   { path: '', redirectTo: 'home', pathMatch: 'full' },  // Redirect to home by default
//   { path: '**', redirectTo: 'home' },  // Catch-all route to redirect any invalid URL to home
// ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

