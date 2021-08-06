import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-userlogin',
  templateUrl: './userlogin.component.html',
  styleUrls: ['./userlogin.component.css']
})
export class UserloginComponent implements OnInit {

  constructor(private router: Router) { }

  clickButton(){
    alert("Login Successful");
    this.router.navigate(['app-mainpage'])
  }

  ngOnInit(): void {
  }

}
