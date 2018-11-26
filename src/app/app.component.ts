import { Component,NgZone } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
declare var google:any;
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
  	type:any='all';
  	markers:any=[];
  	radius:number=100;
  	query:string;
  	condition:boolean;
  	constructor(private zone: NgZone) {
  	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(position => {
			this.lat=position.coords.latitude
			this.lng=position.coords.longitude
			//this.markers.push({lat:position.coords.latitude,lng:position.coords.longitude})
        },)
  	}
  }
  //Method to be invoked everytime we receive a new instance 
  //of the address object from the onSelect event emitter.
  setAddress(addrObj) {
    this.zone.run(() =>{
    	this.addr=addrObj
    	this.addrKeys=Object.keys(addrObj)
    	this.lat=addrObj.geometry.lat;
    	this.lng=addrObj.geometry.lng;
    });
  }
  clickMap(event){
  	this.lat=event.coords.lat
  	this.lng=event.coords.lng
  	// this.markers[0]={
  	// 	lat:event.coords.lat,
  	// 	lng:event.coords.lng
  	// }
  }
  changeType(e){
  	this.type=e
  }
  search(condition,query){
  	this.condition=condition;
  	this.query=query
    var defaultBounds = new google.maps.LatLng(this.lat, this.lng);
    var options

    if(condition){
    	options={
    		location:defaultBounds,
	    	radius:this.radius,
	    	name:query
    	}
    }
    else{
    	options={
	    	location:defaultBounds,
	    	radius:this.radius,
	    	type:['rv_park']
	   	};
    }
    let service = new google.maps.places.PlacesService(document.getElementById('map'));
    
		service.nearbySearch(options,(results,status, pagination)=>{
			console.log(results)
			pagination.nextPage();
			if (status == google.maps.places.PlacesServiceStatus.OK) {
			    for (let result of results) {
			    	this.zone.run(() => {
			    		this.markers.push({
			      	lat:result.geometry.location.lat(),
			      	lng:result.geometry.location.lng()
			      })
			    	})
			    }
				
			  }
			else if(status=="ZERO_RESULTS"){
				if(condition){
					window.alert('No '+this.query+' found')
				}else{
					window.alert('No RV Park found')
				}
			}
			else{
				window.alert('Something wrong happened try again')
			}
		});
	
  }
  setRadius(e){
  	this.radius=e
  	//this.search(this.condition,this.query);
  }
}
