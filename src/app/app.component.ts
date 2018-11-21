import { Component,NgZone } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
	showMap:boolean=false;
	lat: number = 11.2600445;
  	lng: number = -85.8857705;
  public addrKeys: string[];
  public addr: object;

  //Method to be invoked everytime we receive a new instance 
  //of the address object from the onSelect event emitter.
  setAddress(addrObj) {
    //We are wrapping this in a zone method to reflect the changes
    //to the object in the DOM.
    this.zone.run(() => {
      this.addr = addrObj;
      this.addrKeys = Object.keys(addrObj);
    });
  }
  clickMap(event){
  	this.lat=event.coords.lat;
  	this.lng=event.coords.lng;
  }
  constructor(private zone: NgZone) {
  	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(position => {
			this.lat=position.coords.latitude
			this.lng=position.coords.longitude
        },)
  	}
  }
}
