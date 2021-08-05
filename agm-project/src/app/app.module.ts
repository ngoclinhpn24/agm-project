import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AgmCoreModule } from '@agm/core';
import {HttpClientModule} from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { UserloginComponent } from './userlogin/userlogin.component';
import { MainpageComponent } from './mainpage/mainpage.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UserloginComponent,
    MainpageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA2zmfFiqBqvwBMOqEGlEzWqmSRAPaX3kM',
      libraries: ['places','drawing', 'geometry', 'visualization']
    }),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
