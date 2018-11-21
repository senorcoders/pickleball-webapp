import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Http, HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GooglePlacesDirective } from './directives/google-places.directive';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    AppComponent,
    GooglePlacesDirective
  ],
  imports: [
    BrowserModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
     AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC6ecF25LKJaY3HpKH0iztKDDRgO60W10A'
    })
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
