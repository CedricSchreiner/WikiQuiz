import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SurvivalQuizService } from './survivalquiz';
import { XQuizService } from './xquiz';
import { Observable } from 'rxjs/Observable';
import { TimeQuizService } from './timequiz';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})

export class QuizComponent implements OnInit, AfterViewInit, OnDestroy {
  public frage: Frage;
  public gamemodeForJoker: boolean;
  public avatarLinkString: string;
  public verbrauchteGesamtZeit: number;
  public fiftyFiftyDisabled: boolean;
  public specialJokerDisabled: boolean;
  public deactivateSpecialJoker = false;
  public deactivateFiftyFiftyJoker = false;
  private forceFullLeave = true;
  private gameFinished: Observable<boolean>;


  constructor(private survivalQuiz: SurvivalQuizService, private xquiz: XQuizService, private timequiz: TimeQuizService) {
  }

  ngOnDestroy() {
    /*
    if (this.forceFullLeave) {
      sessionStorage.removeItem('gamemode');
      sessionStorage.removeItem('anzahlFragen');
    }
    */
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
                        this.gamemodeForJoker = this.xquiz.supportJoker();
                        break;
      case 'survival':  await this.survivalQuiz.initializeGame(buttonA, buttonB, buttonC, buttonD, button,
                          timerDiv).then(res => this.gameFinished = res);
                        this.survivalQuiz.startQuiz().then(res => this.frage = res);
                        this.gamemodeForJoker = this.survivalQuiz.supportJoker();
                        break;
      case 'time':      await this.timequiz.initializeGame(buttonA, buttonB, buttonC, buttonD, button,
                          timerDiv).then(res => this.gameFinished = res);
                        this.timequiz.startQuiz().then(res => this.frage = res);
                        this.gamemodeForJoker = this.timequiz.supportJoker();
                        break;
    }
  }

  async ngOnInit() {
    this.avatarLinkString = './assets/' + sessionStorage.getItem('link'); // fuer den Avatar
  }

  public async nextQuestion(selectedButtonNumber: number) {
    switch (sessionStorage.getItem('gamemode')) {
      case 'xquiz':
        await this.xquiz.selectedAnswer(selectedButtonNumber).then(res => this.frage = res);
        break;
      case 'survival':
        await this.survivalQuiz.selectedAnswer(selectedButtonNumber).then(res => this.frage = res);
        break;
      case 'time':
        await this.timequiz.selectedAnswer(selectedButtonNumber).then(res => this.frage = res);
        break;
    }
    this.gameFinished.subscribe((data) => {
      if (data) {
        this.frage = null;
        this.showResult();
      }
    });
  }

  public activateJoker(selectedjoker: number) {
    console.log('pressed');
    switch (sessionStorage.getItem('gamemode')) {
      case 'survival': this.survivalQuiz.activateJoker(selectedjoker);
                       break;
    }
  }

  private showResult() {
    switch (sessionStorage.getItem('gamemode')) {
      case 'xquiz':    sessionStorage.setItem('rightAnswers', this.xquiz.getNumberOfRightAnswers().toString());
                       sessionStorage.setItem('numberOfQuestions', sessionStorage.getItem('anzahlFragen'));
                       break;
      case 'survival': sessionStorage.setItem('rightAnswers', this.survivalQuiz.getNumberOfRightAnswers().toString());
                       break;
      case 'time':     sessionStorage.setItem('numberOfQuestions', this.timequiz.getNumberAnsweredQuestions().toString());
                       sessionStorage.setItem('rightAnswers', this.timequiz.getNumberOfRightAnswers().toString());
                       break;
    }

    sessionStorage.setItem('points', this.calcPoints().toString());
    this.forceFullLeave = false;
    this.link('result');
  }

  private calcPoints(): number {
    switch (sessionStorage.getItem('gamemode')) {
      case 'xquiz'   : return this.xquiz.calculatePoints();
      case 'survival': return this.survivalQuiz.calculatePoints(1, 1, 1);
      case 'time'    : return this.timequiz.calculatePoints();
    }
  }

  public link(linkToGo: string) {
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

