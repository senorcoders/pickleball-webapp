import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Http, HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GooglePlacesDirective } from './directives/google-places.directive';
import { AgmCoreModule } from '@agm/core';
import { RecoveryPasswordComponent } from './recovery-password/recovery-password.component';
import {Routes,RouterModule} from '@angular/router';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes=[
  {path:'', component:HomeComponent},
  {path:'recovery/:code', component:RecoveryPasswordComponent},
];
@NgModule({
  declarations: [
    AppComponent,
    GooglePlacesDirective,
    RecoveryPasswordComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
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
