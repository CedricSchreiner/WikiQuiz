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
      }else {
        this.text = 'Fehler!';
      }
    });
  }

}
