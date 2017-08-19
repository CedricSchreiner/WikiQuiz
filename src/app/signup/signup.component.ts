import {Component, OnInit } from '@angular/core';
import { RestService } from '../service/rest.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  name: string;
  e_mail: string;
  password: string;

  constructor(private restService: RestService) {
  }

  ngOnInit() {
  }

  sendSignUpData() {
    this.name = (<HTMLInputElement>document.getElementById('inName')).value;
    this.e_mail = (<HTMLInputElement>document.getElementById('inEmail')).value;
    this.password = (<HTMLInputElement>document.getElementById('inPassword')).value;
    this.restService.signup(this.name, this.e_mail, this.password).subscribe((posts) => {
      console.log(posts);
    }, (err: any) => {
      console.log(err.status);
      if (err.status === 500) {
        console.log('Vorhanden');
      }else {
        console.log('FEHLER!');
      }
    });
  }
}
