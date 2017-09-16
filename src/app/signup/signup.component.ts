import {Component, OnInit } from '@angular/core';
import { RestService } from '../service/rest.service';
import {isUserloggedIn} from '../static-functions/static.function';

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
  isUserLoggesIn: boolean;

  constructor(private restService: RestService) {
  }

  ngOnInit() {
    this.isUserLoggesIn = true;
    if (!isUserloggedIn()) {
      this.isUserLoggesIn = false;
      this.link('');
    }
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
            this.errMsg = 'Sign up succesfull!';
            this.link('');
          }, (err: any) => {
            console.log(err.status);
            if (err.status === 500) {
              console.log('Already exist');
            } else {
              console.log('Error!');
            }
          });
        } else {
          this.errMsg = 'Length 8-20, min 1 capital letter, min 1 number, min 1 special character';
        }
      } else {
        this.errMsg = 'invalid Email';
      }
    } else {
      this.errMsg = 'Username: min length 2 characters';
    }
  }
  checkEnter(event) {
    if (event.keyCode === 13) {
      this.sendSignUpData();
    }
  }

  link(linkToGo: string) {
    window.location.href = linkToGo;
  }
}
