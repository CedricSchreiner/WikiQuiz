import { RestService } from '../service/rest.service';
import { Observable } from 'rxjs/Observable';

export class QuizService {
  protected buttonA: HTMLButtonElement;
  protected buttonB: HTMLButtonElement;
  protected buttonC: HTMLButtonElement;
  protected buttonD: HTMLButtonElement;
  protected questionArray: Frage[];
  protected tmpQuestionArray: Frage[];
  protected running: boolean;
  protected gameFinishedObserver: Observable<boolean>;
  protected gameFinished: boolean;
  protected rightAnswers: number;
  protected timeLeft: number;
  /*Variables for Settings*/
  protected blinkingTimes: number; /*default 3 times*/
  protected arrayFragenPointer: number;
  protected numberOfQuestionsToLoad: number; /*default 5*/
  protected blinkIntervall: number; /*default 500ms*/
  protected timeInMs: number; /*default 1600ms*/
  protected jokerSupport: boolean; /*default false (Not supported in this gamemode)*/
  protected timeIntervall: number; /*default 10ms*/

  /*private variables*/
  private timerDivAdd: number; /*berechnet wie viel nach einem Tick vom Timer(%) abgezogen wird*/
  private wrongAnswerColor = '#FF0000';
  private rightAnswerColor = '#01DF01';
  private defaultButtonColor = '#0d87cf';
  private button: HTMLButtonElement; /*Only Used when time is up*/
  private timerdiv: HTMLDivElement;

  /*------------------------------------------------------------------------------------------------------------------*/
  /*Public Section*/
  constructor(public restService: RestService) {
  }

  /**
   * Setzt alle Parameter die im Spielmodus gebraucht werden. Als Parameter erhaelt die Funktion alle noetigen
   * HTML Komponenten.
   * Beim initialisieren wird auch zum ersten mal die Tabelle der Fragen geladen.
   * @param {HTMLButtonElement} buttonA
   * @param {HTMLButtonElement} buttonB
   * @param {HTMLButtonElement} buttonC
   * @param {HTMLButtonElement} buttonD
   * @param {HTMLButtonElement} button
   * @param {HTMLDivElement} timer
   * @returns {Promise<Observable<boolean>>}
   */
  public async initialize(buttonA: HTMLButtonElement, buttonB: HTMLButtonElement, buttonC: HTMLButtonElement,
                              buttonD: HTMLButtonElement, button: HTMLButtonElement, timer: HTMLDivElement) {
    this.buttonA = buttonA;
    this.buttonB = buttonB;
    this.buttonC = buttonC;
    this.buttonD = buttonD;
    this.button = button;
    this.timerdiv = timer;
    this.blinkingTimes = 3;
    this.arrayFragenPointer = -1;
    this.numberOfQuestionsToLoad = 5;
    this.blinkIntervall = 500;
    this.running = false;
    this.timeInMs = 1600;
    this.gameFinished = false;
    this.rightAnswers = 0;
    this.jokerSupport = false;
    this.timeIntervall = 10;
    this.timerDivAdd = 100 / this.timeInMs;

    /*initialize questionarray*/
    await this.loadQuestions().then(res => this.questionArray = res);
    this.loadQuestions().then(res => this.tmpQuestionArray = res);
    this.gameFinishedObserver = Observable.create((observer) => {
      observer.next(this.gameFinished);
    });
    return this.gameFinishedObserver;
  }

  /**
   * Startet das Spiel und gibt die erste Frage zurueck.
   * @returns {Promise<Frage>} erste Frage aus dem Antwortenarray
   */
  protected async startQuiz() {
    this.running = true;
    this.timer().then();
    return this.nextQuestion();
  }

  /**
   * Gibt die naechte Frage im Array zurueck
   * @returns {Frage}
   */
  protected nextQuestion(): Frage {
    this.arrayFragenPointer++;
    if (this.arrayFragenPointer === this.numberOfQuestionsToLoad - 1) {
      this.questionArray = this.tmpQuestionArray;
      this.loadQuestions().then(res => this.tmpQuestionArray = res);
      this.arrayFragenPointer = 0;
    }
    return this.questionArray[this.arrayFragenPointer];
  }

  /**
   * Laedt eine bestimme Anzahl an neuen Fragen fuer das Spiel.
   * @returns {Promise<Array<Frage>>}
   */

  protected async loadQuestions() {
    let errorLoadingQuestions: boolean;
    let returnArray: Array<Frage>;
    do {
      errorLoadingQuestions = false;
      returnArray = await this.restService.getQuestionsBeta(this.numberOfQuestionsToLoad, 1)
        .then().catch(() => {
          errorLoadingQuestions = true;
        });
    } while (errorLoadingQuestions);
    return returnArray;
  }

  protected delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Timer der bestimmt wie lange der Spieler Zeit hat eine Frage zu beantworten.
   * @returns {Promise<void>}
   */
  protected async timer() {
    this.timeLeft = this.timeInMs;
    while (this.running === true) {
      await this.delay(this.timeIntervall).then();
      this.timerdiv.style.width = String((this.timeLeft * this.timerDivAdd)) + '%';
      this.timeLeft--;
      if (this.timeLeft === 0) {
        this.running = false;
        this.button.click();
      }
    }
  }

  /**
   * Wenn der User eine richtige Antwort ausgewaehlt hat, werden die Buttons entsprechend gefaerbt.
   * @returns {Promise<void>}
   */
  protected async rightAnswer() {
    this.rightAnswers++;
    this.buttonStatus(false);
    this.setButtonColor(Number(this.questionArray[this.arrayFragenPointer].SolutionNumber), this.rightAnswerColor);
    await this.delay(this.blinkIntervall * 2 * (this.blinkingTimes - 1));
    this.setButtonColor(Number(this.questionArray[this.arrayFragenPointer].SolutionNumber), this.defaultButtonColor);
    this.buttonStatus(true);
  }

  /**
   * Wenn der User eine falsche Antwort ausgewaehlt hat, werden die Buttons entsprechend gefaerbt.
   * @param {number} selectedButton
   * @returns {Promise<void>}
   */
  protected async wrongAnswer(selectedButton: number) {
    this.buttonStatus(false);
    this.setButtonColor(selectedButton, this.wrongAnswerColor);
    for (let i = 0; i < this.blinkingTimes; i++) {
      this.setButtonColor(Number(this.questionArray[this.arrayFragenPointer].SolutionNumber), this.rightAnswerColor);
      await this.delay(this.blinkIntervall);
      this.setButtonColor(Number(this.questionArray[this.arrayFragenPointer].SolutionNumber), this.defaultButtonColor);
      await this.delay(this.blinkIntervall);
    }
    this.setButtonColor(selectedButton, this.defaultButtonColor);
    this.buttonStatus(true);
  }

  /**
   * Kann einen einzelnen Button in einer gewuenschten Farbe darstellen.
   * @param {number} selectedButton
   * @param {string} color
   */
  protected setButtonColor(selectedButton: number, color: string) {
    switch (selectedButton) {
      case 0: this.buttonA.style.backgroundColor = color;
        break;
      case 1: this.buttonB.style.backgroundColor = color;
        break;
      case 2: this.buttonC.style.backgroundColor = color;
        break;
      case 3: this.buttonD.style.backgroundColor = color;
        break;
    }
  }

  /**
   * Aktiviert/Deaktiert die Buttons.
   * @param {boolean} active
   */
  protected buttonStatus(active: boolean) {
    this.buttonA.disabled = !active;
    this.buttonB.disabled = !active;
    this.buttonC.disabled = !active;
    this.buttonD.disabled = !active;
  }

  /*Setting functions*/

  public setWrongAnswerColor(color: string) {
    this.wrongAnswerColor = color;
  }

  public setRightAnswerColor(color: string) {
    this.rightAnswerColor = color;
  }

  public setDefaultButtonColor(color: string) {
    this.defaultButtonColor = color;
  }

  public setnumberOfQuestionsToLoad(questionsToLoad: number) {
    this.numberOfQuestionsToLoad = questionsToLoad;
  }

  public setBlinkIntervall(intervall: number) {
    this.blinkIntervall = intervall;
  }

  public setTime(time: number) {
    this.timeInMs = time;
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
