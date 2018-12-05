import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl,Validators,FormBuilder} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8'})
};
@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.scss']
})
export class RecoveryPasswordComponent implements OnInit {
	recovery:FormGroup;
	code:any;
  constructor(private fb:FormBuilder,private route: ActivatedRoute,private http:HttpClient) { }

  ngOnInit() {
  	this.code= this.route.snapshot.params['code'];
  	console.log(this.code)
  	this.recovery=this.fb.group({
  		password:['',Validators.required]
  	})
  }
  sendPassword(){
  	let data={
  		code:this.code,
  		password:this.recovery.get('password').value
  	}
  	console.log(data)
  	this.http.put('http://138.68.19.227:8781/forgot-password/validate',data,httpOptions).subscribe(
  		result=>{
  			alert(result)
  			console.log(result)
  		},
  		e=>{
  			alert(e)
  			console.log(e)
  		}
  	)
  }

}
