import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../auth.service';
declare var google:any;

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {

  public event: any = null;
  public locationText = "";
  public locationCoords = [];
  public formEvent = new FormGroup({
    name: new FormControl("", Validators.required),
    partner: new FormControl("", Validators.nullValidator),
    type: new FormControl("", Validators.required),
    description: new FormControl("", Validators.nullValidator),
    location: new FormControl("", Validators.required),
    date: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required),
    matchTimes: new FormControl('', Validators.nullValidator),
    travelInfo: new FormControl('', Validators.nullValidator),
    eventStats: new FormControl('', Validators.nullValidator),
  });
  public imgs = [
    { url: "./assets/imgs/camera-default.png", file: new File([], "") },
    { url: "./assets/imgs/camera-default.png", file: new File([], "") },
    { url: "./assets/imgs/camera-default.png", file: new File([], "") }
  ];;

  constructor(
    public modalService: NgbActiveModal, 
    private http: HttpClient,
    public domSanitizationService: DomSanitizer
    ) { }

  ngOnInit() {
    this.assingLocationFind();
  }

  public assingLocationFind(){
    let input = function () { return document.querySelector("#location-event"); };
    if(input === null){
      setTimeout(this.assingLocationFind.bind(this), 400);
    }
    let autocomplete = new google.maps.places.Autocomplete(input());
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      var address = (input() as any).value;
      this.getCoords(address);
    });
  }

  private getCoords(address: string) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (res, status) => {

      if (Object.prototype.toString.call(res) === "[object Array]") {
        if (res.length === 0) return;
        res = res[0];
      }

      if (res.geometry) {
        this.locationText = address;
        this.locationCoords = [res.geometry.location.lng(), res.geometry.location.lat()]
      }
    });
  }

  public async changePhoto(ind) {
    let b64 = await new Promise(this.pickFileBrowserDataUrl.bind(this));
    let blob = this.b64toBlob(b64, "image/jpeg");
    let file = this.blobToFile(blob, "image");
    let url = URL.createObjectURL(file);
    this.imgs[ind] = { url, file };
  }

  private pickFileBrowserDataUrl(resolve, reject) {

    try {

      let pick = document.createElement("input");
      pick.setAttribute("type", "file");
      pick.setAttribute("accept", "image/*");

      document.body.appendChild(pick);

      let handleFile = function (e: any) {

        var files = e.target.files, f = files[0];
        console.log(files);
        var reader = new FileReader();

        reader.onload = function (e) {

          let target: any = e.target;
          let data = target.result;
          resolve(data);
          document.body.removeChild(pick);
        };

        reader.readAsDataURL(f);
      }

      pick.addEventListener('change', handleFile, false);

      pick.click();
    }
    catch (e) {
      reject(e);
    }

  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
  }

  public b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  public close() {
    this.modalService.close();
  }

  public async save() {
    try {
      let user = AuthService.getUser();
      let values = this.formEvent.value;
      let event: any = {
        name: values.name,
        description: values.description,
        date: moment(values.date, "YYYY/MM/DD").toDate().getTime(),
        time: moment(values.time, "HH:mm").toDate().getTime(),
        partner: values.partner,
        players: [],
        courts: [],
        matchTimes: values.matchTimes,
        travelInfo: values.travelInfo,
        eventStats: values.eventStats,
        locationCoords: this.locationCoords,
        locationText: this.locationText,
        type: values.type,
        user: user.id
      };
      let e = await this.http.post("/event-courts", { event }).toPromise();
      await this.sendImages(e);
      this.close();
    }
    catch (e) {
      console.error(e);
      alert("error")
    }
  }

  public async sendImages(event) {
    try {
      let data = new FormData();
      for (let img of this.imgs) {
        data.append("images", img.file);
      }
      let t = await this.http.post("/event-images/" + event.id, data).toPromise();
    }
    catch (e) {
      console.error(e);
    }
  }

}
