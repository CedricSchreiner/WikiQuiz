import {Component, OnInit, AfterViewInit, OnDestroy, DoCheck} from '@angular/core';
import { SurvivalQuizService } from './survivalquiz';
import { XQuizService } from './xquiz';
import {Observable} from 'rxjs/Observable';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})

export class QuizComponent implements OnInit, AfterViewInit, OnDestroy, DoCheck {
  public frage: Frage;
  public gamemodeForJoker: boolean;
  public avatarLinkString: string;
  private numberOfQuestions = 0;
  private numberOfQuestionsSurvival = 0;
  private timeLeft: number;
  private spielLauft: boolean;
  public verbrauchteGesamtZeit: number;
  public fiftyFiftyDisabled: boolean;
  public specialJokerDisabled: boolean;
  private jokersUsed = 0;
  public deactivateSpecialJoker = false;
  public deactivateFiftyFiftyJoker = false;
  private forceFullLeave = true;
  private gameFinished: Observable<boolean>;


  constructor(private survivalQuiz: SurvivalQuizService, private xquiz: XQuizService) {
  }

  ngOnDestroy() {
    /*
    if (this.forceFullLeave) {
      sessionStorage.removeItem('gamemode');
      sessionStorage.removeItem('anzahlFragen');
    }
    */
  }

  ngDoCheck() {
  }

  async ngAfterViewInit() {
    ///Get all answer Buttons from html component
    const buttonA = (<HTMLButtonElement>document.getElementById('answerA'));
    const buttonB = (<HTMLButtonElement>document.getElementById('answerB'));
    const buttonC = (<HTMLButtonElement>document.getElementById('answerC'));
    const buttonD = (<HTMLButtonElement>document.getElementById('answerD'));
    const button = (<HTMLButtonElement>document.getElementById('wrong-answer'));
    const timerDiv = (<HTMLDivElement> document.getElementById('timer-status-bar'));

    switch (sessionStorage.getItem('gamemode')) {
      case 'xquiz':     await this.xquiz.initializeGame(buttonA, buttonB, buttonC, buttonD, button,
                          Number(sessionStorage.getItem('anzahlFragen')), timerDiv).then( res => this.gameFinished = res);
                        this.xquiz.startQuiz().then(res => this.frage = res);
                        break;
      case 'survival':  await this.survivalQuiz.initializeGame(buttonA, buttonB, buttonC, buttonD, button,
                          timerDiv).then(res => this.gameFinished = res);
                        this.survivalQuiz.startQuiz().then(res => this.frage = res);
                        break;
    }
  }

  async ngOnInit() {
    this.avatarLinkString = './assets/' + sessionStorage.getItem('link'); // fuer den Avatar
  }

  async nextQuestion(selectedButtonNumber: number) {
    let finished = false;
    switch (sessionStorage.getItem('gamemode')) {
      case 'xquiz':
        await this.xquiz.selectedAnswer(selectedButtonNumber);
        this.frage = this.xquiz.nextQuestion();
        break;
      case 'survival':
        await this.survivalQuiz.selectedAnswer(selectedButtonNumber);
        this.frage = this.survivalQuiz.nextQuestion();
        break;
    }
    this.gameFinished.subscribe((data) => {
      finished = data;
    });
    if (finished) {
      this.frage = null;
      this.showResultXquiz();
    }
  }

  showResultSurvival() {
    sessionStorage.setItem('rightAnswers', '2');
    sessionStorage.setItem('numberOfQuestions', this.numberOfQuestionsSurvival.toString());
    ///sessionStorage.setItem('points', this.calcPoints().toString());
    this.forceFullLeave = false;
    this.link('result');
  }

  showResultXquiz() {
    switch (sessionStorage.getItem('gamemode')) {
      case 'xquiz': sessionStorage.setItem('rightAnswers', this.xquiz.getNumberOfRightAnswers().toString());
                    sessionStorage.setItem('numberOfQuestions', sessionStorage.getItem('anzahlFragen'));
                    break;
      case 'survival': sessionStorage.setItem('rightAnswers', this.survivalQuiz.getNumberOfRightAnswers().toString());
    }

    sessionStorage.setItem('points', this.calcPoints().toString());
    this.forceFullLeave = false;
    this.link('result');
  }
  calcPoints(): number {
    switch (sessionStorage.getItem('gamemode')) {
      case 'xquiz'   : return this.xquiz.calculatePoints();
      case 'survival': return this.survivalQuiz.calculatePoints(1, 1, 1);
    }
  }
  /**
   1: 50/50 Joker
   2: anderer Joker
   */


  async timer() {
    const timerDiv = (<HTMLDivElement> document.getElementById('timer-status-bar'));
    this.timeLeft = 1600;
    while (this.spielLauft) {
      await this.delay(10);
      timerDiv.style.width = String((this.timeLeft * 0.0625)) + '%';
      this.timeLeft--;
      if (this.timeLeft === 0) {
        console.log('fertig');
      }
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

