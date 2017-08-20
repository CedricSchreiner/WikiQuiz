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
  user: User;

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
        this.user.user = posts;
        ///window.location.href = 'menu';
        this.test = true; ///a
        this.email = this.user.user.e_mail; ///a
        this.id = this.user.user.id; ///a
        this.password = this.user.user.passwort; ///a
        this.name = this.user.user.name; ///a
        this.link = this.user.user.avatar_link; ///a
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
