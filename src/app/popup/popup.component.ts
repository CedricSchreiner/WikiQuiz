import { Component, OnInit} from '@angular/core';
import {RestService} from '../service/rest.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
punkte: string;
rightQuest: string;
anzFragen: string;
constructor(private restService: RestService) {
}

ngOnInit() {
  this.punkte = sessionStorage.getItem('points');
  this.rightQuest = sessionStorage.getItem('rightAnswers');
  this.anzFragen = sessionStorage.getItem('numberOfQuestions');
  }
  start(whichOne: string) {
    switch (whichOne) {
      case '1':
        this.updateStatistics();
        window.location.href = '/menu';
        break;
      case '2':
        this.updateStatistics();
        /*sessionStorage.setItem('anzahlFragen', this.anzFragen.toString());*/
        window.location.href = '/game';
        break;
    }
  }
  updateStatistics() {
  this.restService.updateStatistic(
    sessionStorage.getItem('gamemode'),
    sessionStorage.getItem('id'),
    sessionStorage.getItem('numberOfQuestions'),
    sessionStorage.getItem('rightAnswers'),
    sessionStorage.getItem('points')
    );
  }
}
