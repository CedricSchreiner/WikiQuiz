import { Component, OnInit } from '@angular/core';

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
  avatarLinkString: string;

  ngOnInit() {
    this.avatarLinkString = './assets/' + sessionStorage.getItem('link');
    sessionStorage.getItem('username');
    if (sessionStorage.length > 0) {
      this.test = true;
      this.email = sessionStorage.getItem('email');
      this.id = Number.parseInt(sessionStorage.getItem('id'));
      this.password = sessionStorage.getItem('password');
      this.name = sessionStorage.getItem('username');
      this.link = sessionStorage.getItem('link');
    }
  }
}
