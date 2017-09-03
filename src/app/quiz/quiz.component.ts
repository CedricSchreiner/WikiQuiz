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
  buttonA: HTMLButtonElement;
  buttonB: HTMLButtonElement;
  buttonC: HTMLButtonElement;
  buttonD: HTMLButtonElement;
  button: HTMLButtonElement;
  buttonRightSolution: HTMLButtonElement;
  numberOfQuestions: number;
  resultSet: number;
  howmany: number;

  /**
   * 1 = Survival Quiz
   * 2 = xQuiz 10/30/50 Fragen
   */

  constructor(private survivalQuiz: SurvivalQuizService, private xquiz: XQuizService) {
  }
  async ngOnInit() {
    this.howmany = 0;
    this.buttonA = (<HTMLButtonElement>document.getElementById('answerA'));
    this.buttonB = (<HTMLButtonElement>document.getElementById('answerB'));
    this.buttonC = (<HTMLButtonElement>document.getElementById('answerC'));
    this.buttonD = (<HTMLButtonElement>document.getElementById('answerD'));
    if (sessionStorage.length > 0) {
      this.test = true;
      this.richtigeAntworten = 0;
      this.avatarLinkString = './assets/' + sessionStorage.getItem('link'); // fuer den Avatar
      switch (sessionStorage.getItem('gamemode')) {
        case '1': await this.survivalQuiz.startQuiz();
                  this.frage = this.survivalQuiz.getQuestion();
                  break;
        case 'xquiz': await this.xquiz.startQuiz(Number(sessionStorage.getItem('anzahlFragen')));
                  this.frage = this.xquiz.getQuestion();
                  break;
      }
    }
  }
  async nextQuestion(buttonNumber: number) {
    this.button = this.getButton(buttonNumber);
    if (buttonNumber === Number(this.frage.SolutionNumber)) {
      this.richtigeAntworten++;
      this.button.style.backgroundColor = '#01DF01';
      this.changeDisableStatus(true);
      await this.delay(2500);
      this.changeDisableStatus(false);
      this.button.style.backgroundColor = '#0d87cf';
    } else {
      this.buttonRightSolution = this.getButton(Number(this.frage.SolutionNumber));
      this.changeDisableStatus(true);
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
      this.button.style.backgroundColor = '#0d87cf';
      this.changeDisableStatus(false);
    }

    switch (sessionStorage.getItem('gamemode')) {
      case '1': if (buttonNumber !== Number(this.frage.SolutionNumber)) {
                  this.survivalQuiz.reduceLives();
                  if (this.survivalQuiz.isFinished()) {
                    /*<===============================================>*/
                    /*Hier kann das Statistik Fenster aufgerufen werden*/
                    /*<===============================================>*/
                    /*window.location.href = 'menu';*/
                    this.showResultSurvival();
                  }
                }
                this.frage = this.survivalQuiz.getQuestion();
                break;
      case 'xquiz': if (this.xquiz.isFinished()) {
                  /*<===============================================>*/
                  /*Hier kann das Statistik Fenster aufgerufen werden*/
                  /*<===============================================>*/
                  this.showResultXquiz();
                  sessionStorage.removeItem('anzahlFragen');
                }
                this.frage = this.xquiz.getQuestion();
                break;
    }
    this.howmany ++;
  }
  showResultSurvival() {
    sessionStorage.setItem('rightAnswers', this.richtigeAntworten.toString());
    sessionStorage.setItem('numberOfQuestions', this.howmany.toString());
    sessionStorage.setItem('points', this.calcPoints().toString());
    window.location.href = 'result';
  }
  showResultXquiz() {
    this.numberOfQuestions = this.xquiz.anzahlFragen;
    sessionStorage.setItem('rightAnswers', this.richtigeAntworten.toString());
    sessionStorage.setItem('numberOfQuestions', this.numberOfQuestions.toString());
    sessionStorage.setItem('points', this.calcPoints().toString());
    window.location.href = 'result';
  }
  calcPoints() {
    return this.resultSet = (this.richtigeAntworten * 100 );
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getButton(buttonNumber: number) {
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

  changeDisableStatus(disabled: boolean) {
    this.buttonA.disabled = disabled;
    this.buttonB.disabled = disabled;
    this.buttonC.disabled = disabled;
    this.buttonD.disabled = disabled;
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

