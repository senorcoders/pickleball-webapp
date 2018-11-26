import { Directive, ElementRef, OnInit, Output, EventEmitter, Input,HostListener } from '@angular/core';

declare var google:any;

@Directive({
  selector: '[google-place]'
})
export class GooglePlacesDirective implements OnInit {
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  @Input() lat: number;
  @Input() lng: number;
  //@Input() types: string;
  @HostListener('click') click(e) {
    this.run()
  }
  private element: HTMLInputElement;

  constructor(elRef: ElementRef) {
    //elRef will get a reference to the element where
    //the directive is placed
    this.element = elRef.nativeElement;
  }

  getFormattedAddress(place) {
    //@params: place - Google Autocomplete place object
    //@returns: location_obj - An address object in human readable format
    let location_obj = {};
    location_obj['address']=place.formatted_address;
    location_obj['phone']=place.formatted_phone_number;
    location_obj['geometry']={'lat':place.geometry.location.lat(),'lng':place.geometry.location.lng()}
    location_obj['name']=place.name;
    location_obj['website']=place.website;
    // for (let i in place.address_components) {
    //   let item = place.address_components[i];
      
    //   location_obj['formatted_address'] = place.formatted_address;
    //   if(item['types'].indexOf("locality") > -1) {
    //     location_obj['locality'] = item['long_name']
    //   } else if (item['types'].indexOf("administrative_area_level_1") > -1) {
    //     location_obj['admin_area_l1'] = item['short_name']
    //   } else if (item['types'].indexOf("street_number") > -1) {
    //     location_obj['street_number'] = item['short_name']
    //   } else if (item['types'].indexOf("route") > -1) {
    //     location_obj['route'] = item['long_name']
    //   } else if (item['types'].indexOf("country") > -1) {
    //     location_obj['country'] = item['long_name']
    //   } else if (item['types'].indexOf("postal_code") > -1) {
    //     location_obj['postal_code'] = item['short_name']
    //   }
     
    // }
    return location_obj;
  }

  ngOnInit() {
    this.run()
  }
  run(){
    var autocomplete;
    // var defaultBounds = new google.maps.LatLngBounds(
    //   new google.maps.LatLng(this.lat, this.lng)
    //   //new google.maps.LatLng(51.5073509, -0.12775829999998223)
    // );
    var options = {
      types:['geocode']
    };
    autocomplete = new google.maps.places.Autocomplete(this.element,options);
    //Event listener to monitor place changes in the input
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
    //Emit the new address object for the updated place
    this.onSelect.emit(this.getFormattedAddress(autocomplete.getPlace()));
    });
  }
}