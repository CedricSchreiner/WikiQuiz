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
  errMsg: string;

  constructor(private restService: RestService) {
  }

  ngOnInit() {
  }

  sendSignUpData() {
    this.name = (<HTMLInputElement>document.getElementById('inName')).value;
    this.e_mail = (<HTMLInputElement>document.getElementById('inEmail')).value;
    this.password = (<HTMLInputElement>document.getElementById('inPassword')).value;
    const regexEmail = new RegExp('.+@.+.\\..+');
    const regexAllowedEmailChars = new RegExp('^([1-zA-Z0-1@.\\s]{1,255})$');
    const regexPasswordSpecialCharachter = new RegExp('.*[\\W].*');
    const regexPasswordContainsCapital = new RegExp('.*[A-Z]+.*');
    const regexPasswordContainsNumber = new RegExp('.*[0-9].*');
    if (this.name.length >= 2) {
      if (regexEmail.test(this.e_mail) && regexAllowedEmailChars.test(this.e_mail)) {
        if (this.password.length >= 8 && this.password.length <= 20 &&
          regexPasswordSpecialCharachter.test(this.password) &&
          regexPasswordContainsCapital.test(this.password) &&
          regexPasswordContainsNumber.test(this.password)) {
          this.restService.signup(this.name, this.e_mail, this.password).subscribe((posts) => {
            console.log(posts);
          }, (err: any) => {
            console.log(err.status);
            if (err.status === 500) {
              console.log('Vorhanden');
            } else {
              console.log('FEHLER!');
            }
          });
        } else {
          this.errMsg = 'Password: Länge 8-20, min 1 Großbuchstabe, min 1 Zahl, min 1 Sonderzeichen';
        }
      } else {
        this.errMsg = 'Ungültige Email';
      }
    } else {
      this.errMsg = 'Der Username muss mindestens 2 Zeichen lang sein';
    }
  }
}
