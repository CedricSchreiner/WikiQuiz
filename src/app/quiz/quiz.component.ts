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
  private buttonA: HTMLButtonElement;
  private buttonB: HTMLButtonElement;
  private buttonC: HTMLButtonElement;
  private buttonD: HTMLButtonElement;
  private button: HTMLButtonElement;
  private buttonRightSolution: HTMLButtonElement;
  private numberOfQuestions: number;
  private timeLeft: number;
  private spielLauft: boolean;
  private sumTimeLeft: number;
  public verbrauchteGesamtZeit: number;
  private isUserLoggesIn: boolean;
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
    this.buttonA = (<HTMLButtonElement>document.getElementById('answerA'));
    this.buttonB = (<HTMLButtonElement>document.getElementById('answerB'));
    this.buttonC = (<HTMLButtonElement>document.getElementById('answerC'));
    this.buttonD = (<HTMLButtonElement>document.getElementById('answerD'));

    this.specialJoker.setButtons(this.buttonA, this.buttonB, this.buttonC, this.buttonD);
  }

  async ngOnInit() {
    this.isUserLoggesIn = true;
    if (!isUserloggedIn()) {
      this.isUserLoggesIn = false;
      this.link('');
    }
    this.fiftyFiftyDisabled = false;
    this.specialJokerDisabled = false;
    ///Set the count how often the Jokers are available
    this.fiftyJoker.setJokerCount(1);
    this.specialJoker.setJokerCount(1);

    ///Set all needed parameters 0
    this.sumTimeLeft = 0;
    this.verbrauchteGesamtZeit = 0;

    if (sessionStorage.length > 0) {
      this.richtigeAntworten = 0;
      this.avatarLinkString = './assets/' + sessionStorage.getItem('link'); // fuer den Avatar
      switch (sessionStorage.getItem('gamemode')) {
        case 'survival': await this.survivalQuiz.startQuiz();
                  this.frage = this.survivalQuiz.getQuestion();
                  this.gamemodeForJoker = true;
                  break;
        case 'xquiz': await this.xquiz.startQuiz(Number(sessionStorage.getItem('anzahlFragen')));
                      ///sessionStorage.removeItem('anzahlFragen');
                      this.frage = this.xquiz.getQuestion();
                      this.gamemodeForJoker = false;
                      break;
      }
      this.specialJoker.setAnswer(this.frage.SolutionNumber);
      this.spielLauft = true;
      this.timer();
    }
  }
  async nextQuestion(buttonNumber: number) {
    if (!this.specialJoker.isJokerActive()) {
      this.spielLauft = false;
      this.specialJokerDisabled = false;
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
      } else {
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
        case 'survival':
          if (buttonNumber !== Number(this.frage.SolutionNumber)) {
            this.survivalQuiz.reduceLives();
            if (this.survivalQuiz.isFinished()) {
              this.showResultSurvival();
            }
          }
          this.frage = this.survivalQuiz.getQuestion();
          break;
        case 'xquiz':
          if (this.xquiz.isFinished()) {
            this.showResultXquiz();
          }
          this.frage = this.xquiz.getQuestion();
          break;
      }
      this.specialJoker.setAnswer(this.frage.SolutionNumber);
      this.timeLeft = 1600;
      this.spielLauft = true;
      this.timer();
      this.buttonA.style.backgroundColor = '#0d87cf';
      this.buttonB.style.backgroundColor = '#0d87cf';
      this.buttonC.style.backgroundColor = '#0d87cf';
      this.buttonD.style.backgroundColor = '#0d87cf';
    } else {
      if (!this.specialJoker.deleteAnswers(buttonNumber)) {
        this.survivalQuiz.reduceLives();
        if (this.survivalQuiz.isFinished()) {
          this.showResultSurvival();
        }
        this.spielLauft = false;
        this.verbrauchteGesamtZeit += 1600;
        this.specialJoker.reduceUseges();
        this.disableSpecialJoker();
        this.changeDisableStatus(true);
        await this.delay(1500);
        this.timeLeft = 1600;
        this.spielLauft = true;
        this.timer();
        this.setButtonColors('#0d87cf');
        this.frage = this.survivalQuiz.getQuestion(); ///<------------------------------ survival Quiz
        this.specialJoker.setAnswer(this.frage.SolutionNumber);
        this.fiftyFiftyDisabled = false;
        this.changeDisableStatus(false);
      } else if (this.specialJoker.getGuessesLeft() === 0) {
        this.spielLauft = false;
        this.specialJoker.reduceUseges();
        this.disableSpecialJoker();
        this.richtigeAntworten++;
        this.specialJoker.setAnswerButtonColor();
        this.specialJoker.setStatus(false);
        this.changeDisableStatus(true);
        this.verbrauchteGesamtZeit += 1600 - this.timeLeft;
        await this.delay(1500);
        this.timeLeft = 1600;
        this.spielLauft = true;
        this.timer();
        this.frage = this.survivalQuiz.getQuestion(); ///<------------------------------ survival Quiz
        this.specialJoker.setAnswer(this.frage.SolutionNumber);
        this.setButtonColors('#0d87cf');
        this.fiftyFiftyDisabled = false;
        this.changeDisableStatus(false);
      }
    }
  }

  disableSpecialJoker() {
    if (!this.specialJoker.isJokerLeft()) {
      this.deactivateSpecialJoker = true;
    }
  }

  disableFiftyFiftyJoker() {
    if (!this.fiftyJoker.isJokerLeft()) {
      this.deactivateFiftyFiftyJoker = true;
    }
  }

  setButtonColors(color: string) {
    this.buttonA.style.backgroundColor = color;
    this.buttonB.style.backgroundColor = color;
    this.buttonC.style.backgroundColor = color;
    this.buttonD.style.backgroundColor = color;
  }

  showResultSurvival() {
    sessionStorage.setItem('rightAnswers', this.richtigeAntworten.toString());
    sessionStorage.setItem('numberOfQuestions', this.richtigeAntworten.toString());
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
  activateJoker(joker: number) {
    let wrongAnswers: number[];
    switch (joker) {
      case 1 :  if (this.fiftyJoker.isJokerLeft()) {
                  this.jokersUsed++;
                  this.specialJokerDisabled = true;
                  wrongAnswers = this.fiftyJoker.deleteAnswers(this.frage.SolutionNumber);
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
                  this.disableFiftyFiftyJoker();
                }
                break;
      case 2 :  if (this.specialJoker.isJokerLeft()) {
                  this.jokersUsed++;
                  this.fiftyFiftyDisabled = true;
                  this.specialJoker.setStatus(true);
                }
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

