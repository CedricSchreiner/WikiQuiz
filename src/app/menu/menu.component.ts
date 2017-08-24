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
  mainMenudiv: HTMLDivElement;
  mainMenudiv2: HTMLDivElement;
  mainMenudiv3: HTMLDivElement;
  mainMenudiv4: HTMLDivElement;
  mainMenudiv5: HTMLDivElement;

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
  GameModeMenu() {
    this.mainMenudiv = (<HTMLDivElement>document.getElementById('mainMenu'));
    this.mainMenudiv.style.display = 'none';
    this.GameModeMenuShow();
  }
  GameModeMenuShow() {
    this.mainMenudiv2 = (<HTMLDivElement>document.getElementById('mainMenu2'));
    this.mainMenudiv2.style.visibility = 'visible';
  }
  XQuizSelection() {
    this.mainMenudiv3 = (<HTMLDivElement>document.getElementById('mainMenu2'));
    this.mainMenudiv3.style.display = 'none';
    this.mainMenudiv4 = (<HTMLDivElement>document.getElementById('mainMenu3'));
    this.mainMenudiv4.style.visibility = 'visible';
  }
  
}
