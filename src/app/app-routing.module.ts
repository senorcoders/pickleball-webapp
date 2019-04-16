import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashBoardComponent } from './dash-board/dash-board.component';
import { AuthGuardService } from './auth-guard.service';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: "login", component: LoginComponent, pathMatch: 'full' },
  { path: "dashboard", component: DashBoardComponent, canActivate: [AuthGuardService] },
  { path: "users", component: UsersComponent, canActivate: [AuthGuardService] },
  { path: '**', redirectTo: '/users', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
