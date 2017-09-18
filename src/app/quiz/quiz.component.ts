import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SurvivalQuizService } from './survivalquiz';
import { XQuizService } from './xquiz';
import { FiftyFiftyJokerService} from './fifty_fifty_joker';
import { SpecialJokerService } from './spezial_joker';
import { isUserloggedIn } from '../static-functions/static.function';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})

export class QuizComponent implements OnInit, AfterViewInit, OnDestroy {
  public frage: Frage;
  public gamemodeForJoker: boolean;
  public avatarLinkString: string;
  public richtigeAntworten: number;
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




  constructor(private survivalQuiz: SurvivalQuizService, private xquiz: XQuizService,
              private fiftyJoker: FiftyFiftyJokerService, private specialJoker: SpecialJokerService) {
  }

  ngOnDestroy() {
    if (this.forceFullLeave) {
      sessionStorage.removeItem('gamemode');
      sessionStorage.removeItem('anzahlFragen');
    }
  }

  ngAfterViewInit() {
    ///Get all answer Buttons from html component
    const buttonA = (<HTMLButtonElement>document.getElementById('answerA'));
    const buttonB = (<HTMLButtonElement>document.getElementById('answerB'));
    const buttonC = (<HTMLButtonElement>document.getElementById('answerC'));
    const buttonD = (<HTMLButtonElement>document.getElementById('answerD'));

    switch (sessionStorage.getItem('gamemode')) {
      case 'xquiz': this.xquiz.initializeGame(buttonA, buttonB, buttonC, buttonD, Number(sessionStorage.getItem('anzahlFragen')));
                    this.xquiz.startQuiz();
    }
  }

  async ngOnInit() {

  }

  nextQuestion(selectedButtonNumber: number) {
    switch (sessionStorage.getItem('gamemode')) {
      case 'xquiz':
    }
  }


  showResultSurvival() {
    sessionStorage.setItem('rightAnswers', this.richtigeAntworten.toString());
    sessionStorage.setItem('numberOfQuestions', this.numberOfQuestionsSurvival.toString());
    sessionStorage.setItem('points', this.calcPoints().toString());
    this.forceFullLeave = false;
    this.link('result');
  }
  showResultXquiz() {
    this.numberOfQuestions = this.xquiz.anzahlFragen;
    sessionStorage.setItem('rightAnswers', this.richtigeAntworten.toString());
    sessionStorage.setItem('numberOfQuestions', this.numberOfQuestions.toString());
    sessionStorage.setItem('points', this.calcPoints().toString());
    this.forceFullLeave = false;
    this.link('result');
  }
  calcPoints(): number {
    switch (sessionStorage.getItem('gamemode')) {
      case 'xquiz'   : return this.xquiz.calculatePoints(this.richtigeAntworten, this.verbrauchteGesamtZeit);
      case 'survival': return this.survivalQuiz.calculatePoints(this.richtigeAntworten, this.verbrauchteGesamtZeit,
                                                                this.jokersUsed);
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

