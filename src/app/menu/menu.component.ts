import { Component, OnInit } from '@angular/core';
import { User } from '../user/user.component';
///import * as global from '../user/user.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  email: string;
  name: string; ///a
  password: string; ///a
  status: number;
  id: number; ///a
  text: string;
  test: boolean; ///a
  link: string; ///a

  ngOnInit() {
    console.log('Menu initialisiert');
    ///this.test = true; ///a
    /**
    if (this.test) {
      this.email = this.user.user.e_mail; ///a
      this.id = this.user.user.id; ///a
      this.password = this.user.user.passwort; ///a
      this.name = this.user.user.name; ///a
      this.link = this.user.user.avatar_link; ///a
    }
     */
    }
}
