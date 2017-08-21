import {Component, OnInit } from '@angular/core';
import { RestService } from '../service/rest.service';
import { User } from '../user/user.component';
///import * as global from '../user/user.component';

/// a <= kann später entfernt werden!

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  name: string; ///a
  password: string; ///a
  status: number;
  id: number; ///a
  text: string;
  test: boolean; ///a
  link: string; ///a
  ///user: User;

  constructor(private restService: RestService) {
    this.test = false;
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
          this.test = true; ///a
          this.email = User.user.e_mail;
          this.id = User.user.id; ///a
          this.password = User.user.passwort; ///a
          this.name = User.user.name; ///a
          this.link = User.user.avatar_link; ///a
          sessionStorage.setItem('username', User.user.name);
          sessionStorage.setItem('email', User.user.e_mail);
          sessionStorage.setItem('id', User.user.id.toString());
          sessionStorage.setItem('link', User.user.avatar_link);
          sessionStorage.setItem('password', User.user.passwort);
          window.location.href = 'menu';
        }, (err: any) => {
          this.status = err.status;
          if (err.status === 404) {
            this.text = 'Email oder Passwort falsch!';
          }else if (err.status === 0) {
            this.text = 'Keine Verbindung zum Server!';
          }else {
            this.text = 'Fehler';
          }
        });
      }else {
        this.status = 404;
        this.text = 'Länge 8-20, min 1 Großbuchstabe, min 1 Zahl, min 1 Sonderzeichen';
      }
    } else {
      this.status = 404;
      this.text = 'Falsche Email';
    }
  }

}
