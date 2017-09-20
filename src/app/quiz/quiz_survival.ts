import { Injectable } from '@angular/core';
import { RestService } from '../service/rest.service';
import { Observable } from 'rxjs/Observable';
import { FiftyFiftyJokerService } from './joker_fifty_fifty';
import { SpecialJokerService} from './joker_special';

@Injectable()
export class SurvivalQuizService {
  private buttonA: HTMLButtonElement;
  private buttonB: HTMLButtonElement;
  private buttonC: HTMLButtonElement;
  private buttonD: HTMLButtonElement;
  private button: HTMLButtonElement; /*Only Used when time is up*/
  private timerdiv: HTMLDivElement;
  private wrongAnswerColor = '#FF0000';
  private rightAnswerColor = '#01DF01';
  private defaultButtonColor = '#0d87cf';
  private questionArray: Frage[];
  private tmpQuestionArray: Frage[];
  private running: boolean;
  private gameFinishedObserver: Observable<boolean>;
  private gameFinished: boolean;
  private answeredQuestions: number;
  private rightAnswers: number;
  private spentTime: number;
  private timeLeft: number;
  private jokerActive: boolean; /*Indicated if a joker is active*/
  private selectedJoker: number;

  /*Variables for Settings*/
  private blinkingTimes: number; /*default 3 times*/
  private arrayFragenPointer: number;
  private numberOfQuestionsToLoad: number; /*default 5*/
  private blinkIntervall: number; /*default 500ms*/
  private timeInMs: number; /*default 1600ms*/
  private lives: number; /*default 3*/
  private jokerSupport: boolean; /*default true*/

  constructor(private restService: RestService, private fJoker: FiftyFiftyJokerService, private sJoker: SpecialJokerService) {
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
  public async initializeGame(buttonA: HTMLButtonElement, buttonB: HTMLButtonElement, buttonC: HTMLButtonElement,
                              buttonD: HTMLButtonElement, button: HTMLButtonElement, timer: HTMLDivElement) {
    /*initialize important variables*/
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
    this.answeredQuestions = 0;
    this.rightAnswers = 0;
    this.spentTime = 0;
    this.lives = 3;
    this.jokerSupport = true;
    this.selectedJoker =  0;
    this.fJoker.setJokerCount(2);
    this.sJoker.setJokerCount(2);
    this.sJoker.setButtons(buttonA, buttonB, buttonC, buttonD);

    /*initialize questionarray*/
    await this.loadQuestions().then(res => this.questionArray = res);
    console.log(this.questionArray); /*<--REMOVE*/
    this.loadQuestions().then(res => this.tmpQuestionArray = res);
    this.gameFinishedObserver = Observable.create((observer) => {
      observer.next(this.gameFinished);
    });
    return this.gameFinishedObserver;
  }


  public async startQuiz() {
    this.running = true;
    this.timer().then();
    return this.nextQuestion();
  }

  /**
   * dem Spiel wird die auswahl des Users übergeben. Danach wird ueberprueft ob die Auswahl richtig oder falsch ist
   * @param {number} selectedButtonNumber
   * @returns {Promise<void>}
   */
  public async selectedAnswer(selectedButtonNumber: number) {
    if (!this.jokerActive) {
      this.answeredQuestions++;
      this.running = false;
      if (Number(this.questionArray[this.arrayFragenPointer].SolutionNumber) !== selectedButtonNumber) {
        await this.wrongAnswer(selectedButtonNumber);
      } else {
        await this.rightAnswer();
      }
      if (this.lives === 0) {
        this.gameFinished = true;
      }
      this.running = true;
      this.timer().then();
      return this.nextQuestion();
    } else {
      this.whenJokerActive(this.selectedJoker, selectedButtonNumber);
        switch (this.selectedJoker) {
          case 1: if (!this.jokerActive) {
                    const frage = await this.selectedAnswer(selectedButtonNumber);
                    this.fJoker.resetButtons(this.defaultButtonColor);
                    return frage;
                  }
                  break;
          case 2: if (!this.jokerActive) {
                    if (this.sJoker.getGuessLeft() === 0) {
                      const frage = await this.selectedAnswer(Number(this.questionArray[this.arrayFragenPointer].SolutionNumber));
                      this.sJoker.resetButtons(this.defaultButtonColor);
                      return frage;
                    } else {
                      this.lives--;
                      this.buttonStatus(false);
                      this.setButtonColor(selectedButtonNumber, this.wrongAnswerColor);
                      await this.delay(this.blinkIntervall * 2 * (this.blinkingTimes - 1));
                      const frage = this.nextQuestion();
                      this.sJoker.resetButtons(this.defaultButtonColor);
                      this.buttonStatus(true);
                      return frage;
                    }
                  } else {
                    return this.questionArray[this.arrayFragenPointer];
                  }
        }
    }
  }

  public joker(joker: number): Observable<boolean> {
    this.selectedJoker = joker;
    this.jokerActive = false;
    switch (joker) {
      case 1: if (this.fJoker.isJokerLeft()) {
                this.fJoker.disableWrongAnswers(Number(this.questionArray[this.arrayFragenPointer].SolutionNumber), this.buttonA,
                  this.buttonB, this.buttonC, this.buttonD);
                this.jokerActive = true;
              }
              break;
      case 2: if (this.sJoker.isJokerLeft()) {
                this.sJoker.setStatus(true);
                this.sJoker.setAnswer(this.questionArray[this.arrayFragenPointer].SolutionNumber);
                this.jokerActive = true;
              }
              break;
    }
    return Observable.create((observer) => {
      observer.next(this.jokerActive);
    });
  }

  private whenJokerActive(joker: number, selectedAnswer: number) {
    switch (joker) {
      case 1: if (this.jokerActive) {
                this.jokerActive = this.fJoker.whenJokerActive();
              }
              break;
      case 2: if (this.jokerActive) {
                this.jokerActive = this.sJoker.selectAnswer(selectedAnswer);
              }
    }
  }

  /**
   * Gibt die naechte Frage im Array zurueck
   * @returns {Frage}
   */
  public nextQuestion(): Frage {
    this.arrayFragenPointer++;
    if (this.arrayFragenPointer === this.numberOfQuestionsToLoad - 1) {
      this.questionArray = this.tmpQuestionArray;
      this.loadQuestions().then(res => this.tmpQuestionArray = res);
      this.arrayFragenPointer = 0;
    }
    return this.questionArray[this.arrayFragenPointer];
  }

  /**
   * Wird am Ende des Spiel aufgerufen. Berechnet die Punkte die der Spieler erreicht hat.
   * @returns {number}
   */
  public calculatePoints(anzahlrichtigeAntworten: number, verbrauchteZeit: number, anzahlerBenutzerJoker: number): number {
    const jokerPoints = anzahlerBenutzerJoker * 100;
    const zeitPunkte = ((1600 * (anzahlrichtigeAntworten + 3)) - verbrauchteZeit) * 0.0625;
    const antwortenPunkte = anzahlrichtigeAntworten * 150;
    return Math.round(zeitPunkte + antwortenPunkte - jokerPoints);
  }

  /*Private Section*/
  /**
   * Laedt eine bestimme Anzahl an neuen Fragen fuer das Spiel.
   * @returns {Promise<Array<Frage>>}
   */
  private async loadQuestions() {
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

  /**
   * Wenn der User eine richtige Antwort ausgewaehlt hat, werden die Buttons entsprechend gefaerbt.
   * @returns {Promise<void>}
   */
  private async rightAnswer() {
    this.rightAnswers++;
    this.buttonStatus(false);
    this.addTime(true);
    this.setButtonColor(Number(this.questionArray[this.arrayFragenPointer].SolutionNumber), this.rightAnswerColor);
    await this.delay(this.blinkIntervall * 2 * (this.blinkingTimes - 1));
    this.setButtonColor(Number(this.questionArray[this.arrayFragenPointer].SolutionNumber), this.defaultButtonColor);
    this.buttonStatus(true);
  }

  /**
   * De/A-ktiviert die Joker
   */
  private setJokerStatus(activate: boolean) {
    if (activate) {
    }
  }
  /**
   * Aktiviert/Deaktiert die Buttons.
   * @param {boolean} active
   */
  private buttonStatus(active: boolean) {
    this.buttonA.disabled = !active;
    this.buttonB.disabled = !active;
    this.buttonC.disabled = !active;
    this.buttonD.disabled = !active;
  }

  /**
   * Wenn der User eine falsche Antwort ausgewaehlt hat, werden die Buttons entsprechend gefaerbt.
   * @param {number} selectedButton
   * @returns {Promise<void>}
   */
  private async wrongAnswer(selectedButton: number) {
    this.lives--;
    this.buttonStatus(false);
    this.addTime(false);
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
  private setButtonColor(selectedButton: number, color: string) {
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
   * Addiert die verbrauchte Zeit auf die bereits verbrauchte Zeit.
   * @param {boolean} questionRight
   */
  private addTime(questionRight: boolean) {
    if (questionRight) {
      this.spentTime += this.timeInMs - this.timeLeft;
    } else {
      this.spentTime += 1600;
    }
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Timer der bestimmt wie lange der Spieler Zeit hat eine Frage zu beantworten.
   * @returns {Promise<void>}
   */
  private async timer() {
    this.timeLeft = this.timeInMs;
    while (this.running === true) {
      await this.delay(10).then();
      this.timerdiv.style.width = String((this.timeLeft * 0.0625)) + '%';
      this.timeLeft--;
      if (this.timeLeft === 0) {
        this.running = false;
        this.button.click();
      }
    }
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

  public setLives(lives: number) {
    this.lives = lives;
  }

  /*Getter*/

  public getNumberOfRightAnswers(): number {
    return this.rightAnswers;
  }

  public supportJoker(): boolean {
    return this.jokerSupport;
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
