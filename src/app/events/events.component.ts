import { Component, OnInit } from '@angular/core';
import { CreateEventComponent } from '../create-event/create-event.component';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  public selectView = "list";
  public events = [];
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
    let count = await this.http.get(`/event-count`).toPromise() as any;
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
    this.events = await this.http.get(`/event?sort=createdAt DESC&limit=20&skip=${skip}`).toPromise() as any;
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

  public toUsers(e){
    e.preventDefault();
    this.router.navigate(["users"]);
    return false;
  }

  public createEvent(e) {
    e.preventDefault();
    this.createEventExec();
    return false;
  }

  private createEventExec() {
    const modalRef = this.modalCtrl.open(CreateEventComponent);
    
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

  // public editUser(e, user) {
  //   e.preventDefault();
  //   this.editUserExec(user);
  //   return false;
  // }

  // private editUserExec(user) {
  //   const modalRef = this.modalCtrl.open(CreateEventComponent);
  //   modalRef.componentInstance.user = user;
  //   modalRef.result.then((result) => {
  //     console.log(result);
  //   }).catch((error) => {
  //     console.log(error);
  //   });
  // }

  public logout() {
    localStorage.clear();
    // console.log(localStorage.getItem("token"));
    this.router.navigate(["login"]);
    return false;
  }
}
