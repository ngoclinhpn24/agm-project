import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router} from '@angular/router';

@Component({
  selector: 'app-userlogin',
  templateUrl: './userlogin.component.html',
  styleUrls: ['./userlogin.component.css']
})
export class UserloginComponent implements OnInit {

  formdata:any;
  model: any = {};
  formcontrol = true;

  constructor(private router: Router) { }

  // clickButton(){
  //   alert("Login Successful");
  //   this.router.navigate(['app-mainpage'])
  // }

  onClickSubmit(data:any){
    console.log(data.username);
    alert("Login Successful");
    this.router.navigate(['app-mainpage'])
  }

  ngOnInit(): void {
    this.formdata = new FormGroup({
      username: new FormControl( "", Validators.compose([
          Validators.required,
          Validators.minLength(6)
      ])),

      passwd: new FormControl("")
    });
  }

}
