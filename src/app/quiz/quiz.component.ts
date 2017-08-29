import { Component, OnInit } from '@angular/core';
import { SurvivalQuizService } from './survivalquiz';
import { XQuizService } from './xquiz';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})

export class QuizComponent implements OnInit {
  test: boolean;
  frage: Frage;
  avatarLinkString: string;
  richtigeAntworten: number;
  statusFrage: string;
  buttonA: HTMLDivElement;
  buttonB: HTMLDivElement;
  buttonC: HTMLDivElement;
  buttonD: HTMLDivElement;
  button: HTMLDivElement;
  buttonRightSolution: HTMLDivElement;

  /**
   * 1 = Survival Quiz
   * 2 = xQuiz 10/30/50 Fragen
   */

  constructor(private survivalQuiz: SurvivalQuizService, private xquiz: XQuizService) {
  }

  async ngOnInit() {
    if (sessionStorage.length > 0) {
      this.test = true;
      this.richtigeAntworten = 0;
      this.avatarLinkString = './assets/' + sessionStorage.getItem('link'); // fuer den Avatar
      switch (sessionStorage.getItem('gamemode')) {
        case '1': await this.survivalQuiz.startQuiz();
                  this.frage = this.survivalQuiz.getQuestion();
                  break;
        case '2': await this.xquiz.startQuiz(Number(sessionStorage.getItem('anzahlFragen')));
                  this.frage = this.xquiz.getQuestion();
                  break;
      }
    }
  }

  async nextQuestion(buttonNumber: number) {
    this.button = this.getButton(buttonNumber);
    if (buttonNumber === Number(this.frage.SolutionNumber)) {
      this.richtigeAntworten++;
      /*============================================
          Frage richtig
       =============================================
       */
      this.button.style.backgroundColor = '#01DF01';
      this.button.style.backgroundColor = '#0d87cf';
      await this.delay(2500); ///Uebergabe in Millisekunden
      this.statusFrage = 'richtig';
      console.log(this.statusFrage);
    } else {
      /*
      ==============================================
          Frage falsch
      ==============================================
       */
      this.buttonRightSolution = this.getButton(this.frage.SolutionNumber);
      this.button.style.backgroundColor = '#FF0000';
      this.buttonRightSolution.style.backgroundColor = '#01DF01';
      await this.delay(500);
      this.buttonRightSolution.style.backgroundColor = '#0d87cf';
      await this.delay(500);
      this.buttonRightSolution.style.backgroundColor = '#01DF01';
      await this.delay(500);
      this.buttonRightSolution.style.backgroundColor = '#0d87cf';
      await this.delay(500);
      this.buttonRightSolution.style.backgroundColor = '#01DF01';
      await this.delay(500);
      this.buttonRightSolution.style.backgroundColor = '#0d87cf';
      this.statusFrage = 'falsch';
      console.log(this.statusFrage);
    }

    switch (sessionStorage.getItem('gamemode')) {
      case '1': if (buttonNumber !== Number(this.frage.SolutionNumber)) {
                  this.survivalQuiz.reduceLives();
                  if (this.survivalQuiz.isFinished()) {
                    sessionStorage.removeItem('gamemode');
                    /*<===============================================>*/
                    /*Hier kann das Statistik Fenster aufgerufen werden*/
                    /*<===============================================>*/
                    window.location.href = 'menu';
                  }
                }
                this.frage = this.survivalQuiz.getQuestion();
                break;
      case '2': if (this.xquiz.isFinished()) {
                  sessionStorage.removeItem('gamemode');
                  sessionStorage.removeItem('anzahlFragen');
                  /*<===============================================>*/
                  /*Hier kann das Statistik Fenster aufgerufen werden*/
                  /*<===============================================>*/
                  window.location.href = 'menu';
                }
                this.frage = this.xquiz.getQuestion();
                break;
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getButton(buttonNumber: number) {
    this.buttonA = (<HTMLDivElement>document.getElementById('answerA'));
    this.buttonB = (<HTMLDivElement>document.getElementById('answerB'));
    this.buttonC = (<HTMLDivElement>document.getElementById('answerC'));
    this.buttonD = (<HTMLDivElement>document.getElementById('answerD'));
    if (buttonNumber === 0) {
      return this.buttonA;
    }
    if (buttonNumber === 1) {
      return this.buttonB;
    }
    if (buttonNumber === 2) {
      return this.buttonC;
    }
    if (buttonNumber === 3) {
      return this.buttonD;
    }
  }

  link(linkToGo: string) {
    window.location.href = linkToGo;
  }
}
interface Frage {
  Verbalization: string;
  Option0: string;
  Option1: string;
  Option2: string;
  Option3: string;
  Solution: string;
  SolutionNumber: number;
}

