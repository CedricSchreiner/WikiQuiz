import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
punkte: string;
rightQuest: string;
anzFragen: string;

ngOnInit() {
  this.punkte = sessionStorage.getItem('points');
  this.rightQuest = sessionStorage.getItem('rightAnswers');
  this.anzFragen = sessionStorage.getItem('numberOfQuestions');
  }
  start(whichOne: string) {
    switch (whichOne) {
      case '1':
        sessionStorage.removeItem('points');
        sessionStorage.removeItem('rightAnswers');
        sessionStorage.removeItem('numberOfQuestions');
        sessionStorage.removeItem('gamemode');
        window.location.href = '/menu';
        break;
      case '2':
        sessionStorage.setItem('anzahlFragen', this.anzFragen.toString());
        window.location.href = '/game';
        break;
    }
  }
}
