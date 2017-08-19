import {Component, OnInit } from '@angular/core';
import { RestService } from '../service/rest.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  name: string;
  email: string;
  password: string;

  constructor(private restService: RestService) {
  }

  ngOnInit() {
  }

  sendSignUpData() {
    this.name = (<HTMLInputElement>document.getElementById('inName')).value;
    this.email = (<HTMLInputElement>document.getElementById('inEmail')).value;
    this.password = (<HTMLInputElement>document.getElementById('inPassword')).value;
  }

}
