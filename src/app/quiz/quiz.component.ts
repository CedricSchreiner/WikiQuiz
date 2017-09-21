import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SurvivalQuizService } from './quiz_survival';
import { XQuizService } from './quiz_xquestions';
import { Observable } from 'rxjs/Observable';
import { TimeQuizService } from './quiz_time';
import {isNullOrUndefined} from 'util';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})

export class QuizComponent implements OnInit, AfterViewInit, OnDestroy {
  public frage: Frage;
  public gamemodeForJoker: boolean;
  public avatarLinkString: string;
  public jokerDisabled = false;
  public deactivateSpecialJoker = false;
  public deactivateFiftyFiftyJoker = false;
  public gameStarted = true;
  private forceFullLeave = true;
  private gameFinished: Observable<boolean>;
  private jokerDisabledObserver: Observable<boolean>;
  private gamemode: string;


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

    if (this.gamemode.includes('xquiz')) {
      await this.xquiz.initializeGame(buttonA, buttonB, buttonC, buttonD, button,
        Number(sessionStorage.getItem('anzahlFragen')), timerDiv).then( res => this.gameFinished = res);
      this.xquiz.startQuiz().then(res => this.frage = res);
      this.gamemodeForJoker = this.xquiz.supportJoker();
    } else if (this.gamemode === 'survival') {
      await this.survivalQuiz.initializeGame(buttonA, buttonB, buttonC, buttonD, button,
        timerDiv).then(res => this.gameFinished = res);
      this.survivalQuiz.startQuiz().then(res => this.frage = res);
      this.gamemodeForJoker = this.survivalQuiz.supportJoker();
    } else if (this.gamemode === 'time') {
      await this.timequiz.initializeGame(buttonA, buttonB, buttonC, buttonD, button,
        timerDiv).then(res => this.gameFinished = res);
      this.timequiz.startQuiz().then(res => this.frage = res);
      this.gamemodeForJoker = this.timequiz.supportJoker();
    }
  }

  async ngOnInit() {
    this.gamemode = sessionStorage.getItem('gamemode');
    if (isNullOrUndefined(this.gamemode)) {
      this.gameStarted = false;
      this.link('menu');
    }

    this.avatarLinkString = './assets/' + sessionStorage.getItem('link'); // fuer den Avatar
  }

  public async nextQuestion(selectedButtonNumber: number) {
    if (this.gamemode.includes('xquiz')) {
      await this.xquiz.selectedAnswer(selectedButtonNumber).then(res => this.frage = res);
    } else if (this.gamemode === 'survival') {
      await this.survivalQuiz.selectedAnswer(selectedButtonNumber).then(res => this.frage = res);
    } else if (this.gamemode === 'time') {
      await this.timequiz.selectedAnswer(selectedButtonNumber).then(res => this.frage = res);
    }

    if (this.jokerDisabled) {
      this.jokerDisabledObserver.subscribe((data) => {
        if (!data) {
          this.jokerDisabled = false;
        }
      });
    }
    this.gameFinished.subscribe((data) => {
      if (data) {
        this.frage = null;
        this.showResult();
      }
    });
  }

  public activateJoker(selectedjoker: number) {
    console.log('Active:' + this.jokerDisabled);
    if (!this.jokerDisabled) {
      switch (sessionStorage.getItem('gamemode')) {
        case 'survival':
          this.jokerDisabledObserver = this.survivalQuiz.joker(selectedjoker);
          this.jokerDisabledObserver.subscribe( (data) => this.jokerDisabled = data);
          break;

      }
    }
  }

  private showResult() {
    if (this.gamemode.includes('xquiz')) {
      sessionStorage.setItem('rightAnswers', this.xquiz.getNumberOfRightAnswers().toString());
      sessionStorage.setItem('numberOfQuestions', sessionStorage.getItem('anzahlFragen'));
    } else if (this.gamemode === 'survival') {
      sessionStorage.setItem('numberOfQuestions', String(this.survivalQuiz.getNumberOfRightAnswers() + 3));
      sessionStorage.setItem('rightAnswers', this.survivalQuiz.getNumberOfRightAnswers().toString());
    } else if (this.gamemode === 'time') {
      sessionStorage.setItem('numberOfQuestions', this.timequiz.getNumberAnsweredQuestions().toString());
      sessionStorage.setItem('rightAnswers', this.timequiz.getNumberOfRightAnswers().toString());
    }

    sessionStorage.setItem('points', this.calcPoints().toString());
    this.forceFullLeave = false;
    this.link('result');
  }

  private calcPoints(): number {
    if (this.gamemode.includes('xquiz')) {
      return this.xquiz.calculatePoints();
    } else if (this.gamemode === 'survival') {
      return this.survivalQuiz.calculatePoints();
    } else if (this.gamemode === 'time') {
      return this.timequiz.calculatePoints();
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

