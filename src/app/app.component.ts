import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.isLogged() === true) {
      this.router.navigate(["users"]);
    } else {
      this.router.navigate(["login"]);
    }
  }

}
