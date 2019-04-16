import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateUserComponent } from '../create-user/create-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public selectView = "list";
  public users = [];
  public count = 0;
  public countList = 0;
  public countArr = [];
  public skip = 0;

  constructor(
    public http: HttpClient, public router: Router,
    private modalCtrl: NgbModal
  ) { }

  ngOnInit() {
    this.getUsers(0);
  }

  public getUsers(skip) {
    this.getUsersExec(skip);
    return false;
  }

  public async getUsersExec(skip) {
    skip *= 20;
    this.skip = skip;
    let count = await this.http.get(`/user-count`).toPromise() as any;
    this.count = count.count;
    // this.count = 20;
    this.countList = this.count / 20;
    if (this.countList % 1 !== 0) {
      this.countList = Math.trunc(this.countList);
      this.countList += 1;
    }

    this.countArr = [];
    for (let i = 0; i < this.countList; i++) {
      this.countArr.push(i);
    }
    this.users = await this.http.get(`/user?sort=createdAt DESC&limit=20&skip=${skip}`).toPromise() as any;
    this.users = this.users.map(it => {
      it.createdAt = new Date(it.createdAt);
      return it;
    });
  }

  public isSelectCount(skip) {

    return this.skip === (skip *= 20);
  }

  public backPag() {
    let i = this.countArr.find(it => {
      return this.isSelectCount(it);
    });
    i -= 1;
    this.getUsers(i);
    return false;
  }

  public nextPag() {
    let i = this.countArr.find(it => {
      return this.isSelectCount(it);
    });
    i += 1;
    this.getUsers(i);
    return false;
  }

  public createUser(e) {
    e.preventDefault();
    this.createUserExec();
    return false;
  }

  private createUserExec() {
    const modalRef = this.modalCtrl.open(CreateUserComponent);

    modalRef.result.then((result) => {
      console.log(result);
      let i = this.countArr.find(it => {
        return this.isSelectCount(it);
      });
      this.getUsers(i);
    }).catch((error) => {
      console.log(error);
    });
  }

  public updatePassword(e, user) {
    e.preventDefault();
    this.updatePasswordExec(user);
    return false;
  }

  private updatePasswordExec(user) {
    // const modalRef = this.modalCtrl.open(UpdatePasswordComponent);
    // modalRef.componentInstance.user = user;
    // modalRef.result.then((result) => {
    //   console.log(result);
    // }).catch((error) => {
    //   console.log(error);
    // });
  }

  public logout() {
    localStorage.clear();
    // console.log(localStorage.getItem("token"));
    this.router.navigate(["login"]);
    return false;
  }

}
