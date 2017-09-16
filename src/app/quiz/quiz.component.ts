import { Component, OnInit } from '@angular/core';
import { SurvivalQuizService } from './survivalquiz';
import { XQuizService } from './xquiz';
import { FiftyFiftyJokerService} from './fifty_fifty_joker';


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
  howmany: number;
  timeLeft: number;
  spielLauft: boolean;
  sumTimeLeft: number;
  verbrauchteGesamtZeit: number;

  /**
   * 1 = Survival Quiz
   * 2 = xQuiz 10/30/50 Fragen
   */

  constructor(private survivalQuiz: SurvivalQuizService, private xquiz: XQuizService,
              private fiftyJoker: FiftyFiftyJokerService) {
  }
  async ngOnInit() {
    ///Initial all Jokers and set the count how often they are available
    this.fiftyJoker.setJokerCount(1);

    this.sumTimeLeft = 0;
    this.howmany = 0;
    this.verbrauchteGesamtZeit = 0;
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
      this.spielLauft = true;
      this.timer();
    }
  }
  async nextQuestion(buttonNumber: number) {
    this.spielLauft = false;
    if (buttonNumber !== -1) {
      this.button = this.getButton(buttonNumber);
      if (buttonNumber === Number(this.frage.SolutionNumber)) {
        this.verbrauchteGesamtZeit += 1600 - this.timeLeft;
        this.richtigeAntworten++;
        this.button.style.backgroundColor = '#01DF01';
        this.changeDisableStatus(true);
        await this.delay(2500);
        this.changeDisableStatus(false);
        this.button.style.backgroundColor = '#0d87cf';
        this.sumTimeLeft += this.timeLeft;
      } else {
        this.verbrauchteGesamtZeit += 1600;
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
    }else {
      this.verbrauchteGesamtZeit += 1600;
      this.buttonRightSolution = this.getButton(Number(this.frage.SolutionNumber));
      this.changeDisableStatus(true);
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
                console.log('next');
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
    this.timeLeft = 1600;
    this.spielLauft = true;
    this.timer();
    this.buttonA.style.backgroundColor = '#0d87cf';
    this.buttonB.style.backgroundColor = '#0d87cf';
    this.buttonC.style.backgroundColor = '#0d87cf';
    this.buttonD.style.backgroundColor = '#0d87cf';
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
    switch (sessionStorage.getItem('gamemode')) {
      case 'xquiz'   : return this.xquiz.calculatePoints(this.richtigeAntworten, this.verbrauchteGesamtZeit);
    }
  }
  /**
   1: 50/50 Joker
   2: anderer Joker
   */
  activateJoker(joker: string) {
    let wrongAnswers: number[];
    switch (joker) {
      case '1' :  if (this.fiftyJoker.isJokerLeft()) {
                    console.log('Antwort:' + this.frage.SolutionNumber);
                    wrongAnswers = this.fiftyJoker.deleteAnswers(this.frage.SolutionNumber);
                    console.log('1: ' + wrongAnswers[0]);
                    console.log('2: ' + wrongAnswers[1]);
                    if (wrongAnswers[0] === 0 || wrongAnswers[1] === 0) {
                      this.buttonA.style.backgroundColor = '#c0c1c4';
                      this.buttonA.disabled = true;
                    }
                    if (wrongAnswers[0] === 1 || wrongAnswers[1] === 1) {
                      this.buttonB.style.backgroundColor = '#c0c1c4';
                      this.buttonB.disabled = true;
                    }
                    if (wrongAnswers[0] === 2 || wrongAnswers[1] === 2) {
                      this.buttonC.style.backgroundColor = '#c0c1c4';
                      this.buttonC.disabled = true;
                    }
                    if (wrongAnswers[0] === 3 || wrongAnswers[1] === 3) {
                      this.buttonD.style.backgroundColor = '#c0c1c4';
                      this.buttonD.disabled = true;
                    }
                  }
                  break;
    }
  }

  async timer() {
    const timerDiv = (<HTMLDivElement> document.getElementById('timer-status-bar'));
    this.timeLeft = 1600;
    while (this.spielLauft) {
      await this.delay(10);
      timerDiv.style.width = String((this.timeLeft * 0.0625)) + '%';
      this.timeLeft--;
      if (this.timeLeft === 0) {
        console.log('fertig');
        this.nextQuestion(-1);
      }
    }
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

