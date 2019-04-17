import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  public user: any = null;

  public formUser = new FormGroup({
    fullName: new FormControl("", Validators.required),
    email: new FormControl("", [Validators.required, Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]),
    password: new FormControl("", Validators.required),
    passwordRepeat: new FormControl("", Validators.required),
    birthDay: new FormControl("", Validators.required),
    gender: new FormControl('', Validators.required)
  });
  public realtor = false;

  constructor(public modalService: NgbActiveModal, private http: HttpClient) { }

  ngOnInit() {
    if (this.user !== null) {
      let user = {
        fullName: this.user.fullName,
        email: this.user.email,
        password: this.user.password,
        birthDay: moment(this.user.birthDay).format("YYYY/MM/DD"),
        gender: this.user.gender
      };
      this.formUser.patchValue(user);
    }
  }

  public close() {
    this.modalService.close();
  }

  public async createUser() {
    try {
      let values = this.formUser.value;
      if (values.password !== values.passwordRepeat) {
        alert("Password not mached");
        return false;
      }
      let user = {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        birthDay: moment(values.birthDay, "YYYY/MM/DD").toISOString(),
        gender: values.gender
      };
      console.log(user);
      if (this.user === null)
        await this.http.post("/signup", user).toPromise();
      else
        await this.http.patch("/user/"+ this.user.id, user).toPromise();
      this.close();
    } catch (error) {
      console.error(error);
      alert("Email is already in use")
    }
  }

}
