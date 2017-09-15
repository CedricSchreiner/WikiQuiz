import {Component, OnInit } from '@angular/core';
import { RestService } from '../service/rest.service';
import { User } from '../user/user.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  status: number;
  text: string;

  constructor(private restService: RestService) {
  }

  ngOnInit() {
  }

  sendLoginData() {
    this.email = (<HTMLInputElement>document.getElementById('inEmail')).value;
    this.password = (<HTMLInputElement>document.getElementById('inPassword')).value;
    const regexEmail = new RegExp('.+@.+.\\..+');
    const regexAllowedEmailChars = new RegExp('^([1-zA-Z0-1@.\\s]{1,255})$');
    const regexPasswordSpecialCharachter = new RegExp('.*[\\W].*');
    const regexPasswordContainsCapital = new RegExp('.*[A-Z]+.*');
    const regexPasswordContainsNumber = new RegExp('.*[0-9].*');
    if (regexEmail.test(this.email) && regexAllowedEmailChars.test(this.email)) {
      if (this.password.length >= 8 && this.password.length <= 20 &&
        regexPasswordSpecialCharachter.test(this.password) &&
        regexPasswordContainsCapital.test(this.password) &&
        regexPasswordContainsNumber.test(this.password)) {
        this.restService.login(this.email, this.password).subscribe((posts) => {
          console.log(posts);
          User.user = posts;
          sessionStorage.setItem('username', User.user.name);
          sessionStorage.setItem('email', User.user.e_mail);
          sessionStorage.setItem('id', User.user.id.toString());
          sessionStorage.setItem('link', User.user.avatar_link);
          sessionStorage.setItem('password', this.password);
          window.location.href = 'menu';
        }, (err: any) => {
          this.status = err.status;
          if (err.status === 404) {
            this.text = 'Email or password incorrect!';
          }else if (err.status === 0) {
            this.text = 'no connection to the server!';
          }else {
            this.text = 'Oops, something went wrong';
          }
        });
      }else {
        this.status = 404;
        this.text = 'Length 8-20, min 1 capital letter, min 1 number, min 1 special character';
      }
    } else {
      this.status = 404;
      this.text = 'Invalid Email';
    }
  }

  checkEnter(event) {
    if (event.keyCode === 13) {
      this.sendLoginData();
    }
  }

  link(linkToGo: string) {
    window.location.href = linkToGo;
  }
}
