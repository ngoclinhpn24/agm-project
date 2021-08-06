import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyserviceService } from './myservice.service';

import { AgmCoreModule } from '@agm/core';
import {HttpClientModule} from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { UserloginComponent } from './userlogin/userlogin.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { RouterModule, Routes } from '@angular/router';
import { TableDataComponent } from './table-data/table-data.component';

const appRoutes: Routes = [
  {
     path: '',
     component: UserloginComponent
  },
  {
     path: 'app-mainpage',
     component: MainpageComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UserloginComponent,
    MainpageComponent,
    TableDataComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA2zmfFiqBqvwBMOqEGlEzWqmSRAPaX3kM',
      libraries: ['places','drawing', 'geometry', 'visualization']
    }),
    HttpClientModule,

    RouterModule.forRoot(appRoutes),
  ],
  providers: [MyserviceService],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
