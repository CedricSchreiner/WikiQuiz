import { Component, OnInit} from '@angular/core';
import {RestService} from '../service/rest.service';
import { isUserloggedIn } from '../static-functions/static.function';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
punkte: string;
rightQuest: string;
anzFragen: string;
starLogoLink: string;
isUserLoggesIn = true;
userPlayedGame = true;
constructor(private restService: RestService) {
}

ngOnInit() {
  if (!isUserloggedIn()) {
    this.isUserLoggesIn = false;
    this.link('');
  }else if (sessionStorage.getItem('points') !== null) {
    this.punkte = sessionStorage.getItem('points');
    this.selectStarAmount(Number(this.punkte));
    this.rightQuest = sessionStorage.getItem('rightAnswers');
    this.anzFragen = sessionStorage.getItem('numberOfQuestions');
    sessionStorage.removeItem('points');
    sessionStorage.removeItem('rightAnswers');
    sessionStorage.removeItem('numberOfQuestions');
    this.updateStatistics();
  } else {
    this.userPlayedGame = false;
    this.link('menu');
  }
}

  selectStarAmount(points: number) {
    if (points < 200) {
      this.starLogoLink = '../../assets/5_Star_Rating_System_0_stars_T.png';
    } else if (points < 1000) {
      this.starLogoLink = '../../assets/5_Star_Rating_System_1_stars_T.png';
    } else if (points < 2000) {
      this.starLogoLink = '../../assets/5_Star_Rating_System_2_stars_T.png';
    } else if (points < 3000) {
      this.starLogoLink = '../../assets/5_Star_Rating_System_3_stars_T.png';
    } else if (points < 4000) {
      this.starLogoLink = '../../assets/5_Star_Rating_System_4_stars_T.png';
    } else if (points <= 5000) {
      this.starLogoLink = '../../assets/5_Star_Rating_System_5_stars_T.png';
    }
  }

  start(whichOne: string) {
    switch (whichOne) {
      case '1':
        window.location.href = '/menu';
        break;
      case '2':
        /*sessionStorage.setItem('anzahlFragen', this.anzFragen.toString());*/
        window.location.href = '/game';
        break;
    }
  }

  updateStatistics() {
    this.restService.updateStatistic(
      sessionStorage.getItem('gamemode'),
      sessionStorage.getItem('id'),
      this.anzFragen,
      this.rightQuest,
      this.punkte
    ).subscribe((posts) => {
      console.log(posts);
    }, (err: any) => {
      console.log(err.status);
      if (err.status === 500) {
        console.log('Vorhanden');
      } else {
        console.log('FEHLER!');
      }
    });
  }

  link(linkToGo: string) {
    window.location.href = linkToGo;
  }
}
