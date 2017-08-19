import {Component, OnInit } from '@angular/core';
import { RestService } from '../service/rest.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  user: User;
  status: number;
  text: string;

  constructor(private restService: RestService) {
  }

  ngOnInit() {
  }

  sendLoginData() {
    this.email = (<HTMLInputElement>document.getElementById('inEmail')).value;
    this.password = (<HTMLInputElement>document.getElementById('inPassword')).value;
    this.restService.login(this.email, this.password).subscribe((posts) => {
        console.log(posts);
        this.user = posts;
    }, (err: any) => {
      console.log(err.status);
      console.log(err.toString());
      this.status = err.status;
      if (err.status === 404) {
        this.text = 'Email oder Passwort falsch!';
      }else {
        this.text = 'Fehler!';
      }
    });
  }

}

interface User {
  avatar_link: string;
  e_mail: string;
  id: number;
  name: string;
  passwort: string;
}
