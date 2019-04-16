import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, public router:Router) { }

  public isLogged() {
    let user = localStorage.getItem("user");
    if (user !== null && user !== undefined)
      return true;

    return false;
  }

  public async login(email, password) {
    try{
      let login = await this.http.put("/login", { email: email, password: password }).toPromise();
      localStorage.setItem("user", JSON.stringify(login));
      this.router.navigate(["users"]);
    }
    catch(e){
      console.error(e);
      window.alert("wrong email or password");
    }
  }

  public logout(){
    localStorage.removeItem("user");
    this.router.navigate(["login"]);
  }

  public static getToken() {
    let user = localStorage.getItem("user") as any;
    if (user !== null && user !== undefined)
      return JSON.parse(user)["token"];
    return "";
  }
}
