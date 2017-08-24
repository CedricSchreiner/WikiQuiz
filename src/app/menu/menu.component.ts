import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  email: string;
  status: number;
  text: string;
  test: boolean; ///a
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

  start(gamemode: string, anzahlFragen: string) {
    sessionStorage.setItem('gamemode', gamemode);
    if (gamemode !== '1') {
      sessionStorage.setItem('anzahlFragen', anzahlFragen);
    }
    window.location.href = 'game';
  }

  logout() {
    sessionStorage.clear();
  }
}
