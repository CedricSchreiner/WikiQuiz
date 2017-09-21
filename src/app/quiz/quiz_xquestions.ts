import { Injectable } from '@angular/core';
import { RestService } from '../service/rest.service';
import { Observable } from 'rxjs/Observable';
import { QuizService} from './quiz_game';

@Injectable()
export class XQuizService extends QuizService {
  private numberOfQuestions: number;
  private spentTime: number;
  private answeredQuestions: number;
  /*------------------------------------------------------------------------------------------------------------------*/
  /*Public Section*/
  constructor(public restService: RestService) {
    super(restService);
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
   * @param {number} anzahlFragen
   * @param {HTMLDivElement} timer
   * @returns {Promise<Observable<boolean>>}
   */
  public async initializeGame(buttonA: HTMLButtonElement, buttonB: HTMLButtonElement, buttonC: HTMLButtonElement,
                 buttonD: HTMLButtonElement, button: HTMLButtonElement, anzahlFragen: number, timer: HTMLDivElement) {
    this.numberOfQuestions = anzahlFragen;
    this.spentTime = 0;
    this.answeredQuestions = 0;
    return await super.initialize(buttonA, buttonB, buttonC, buttonD, button, timer).then();
  }

  /**
   * Startet das Spiel und gibt die erste Frage zurueck.
   * @returns {Promise<Frage>} erste Frage aus dem Antwortenarray
   */
  public async startQuiz() {
    return super.startQuiz();
  }

  /**
   * dem Spiel wird die auswahl des Users übergeben. Danach wird ueberprueft ob die Auswahl richtig oder falsch ist
   * @param {number} selectedButtonNumber
   * @returns {Promise<void>}
   */
  public async selectedAnswer(selectedButtonNumber: number) {
    this.answeredQuestions++;
    if (this.answeredQuestions === this.numberOfQuestions) {
      this.gameFinished = true;
    }
    this.running = false;
    if (Number(this.questionArray[this.arrayFragenPointer].SolutionNumber) !== selectedButtonNumber) {
      await this.wrongAnswer(selectedButtonNumber);
    } else {
      await this.rightAnswer();
    }
    this.running = true;
    this.timer().then();
    return this.nextQuestion();
  }

  /**
   * Wird am Ende des Spiel aufgerufen. Berechnet die Punkte die der Spieler erreicht hat.
   * @returns {number}
   */
  public calculatePoints(): number {
    const questionPoints = 3250 / this.numberOfQuestions * (this.numberOfQuestions - this.rightAnswers);
    console.log(questionPoints);
    const timePoints = 1750 / 1600 / this.numberOfQuestions;
    console.log(timePoints);
    return Math.round(5000 - questionPoints - timePoints * this.spentTime);
  }

  /*Private Section*/

  /**
   * Wenn der User eine richtige Antwort ausgewaehlt hat, werden die Buttons entsprechend gefaerbt.
   * @returns {Promise<void>}
   */
  protected async rightAnswer() {
    this.addTime(true);
    await super.rightAnswer().then();
  }

  /**
   * Wenn der User eine falsche Antwort ausgewaehlt hat, werden die Buttons entsprechend gefaerbt.
   * @param {number} selectedButton
   * @returns {Promise<void>}
   */
  protected async wrongAnswer(selectedButton: number) {
    this.addTime(false);
    await super.wrongAnswer(selectedButton).then();
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

  /*Getter*/

  public getNumberOfRightAnswers(): number {
    return this.rightAnswers;
  }

  public supportJoker(): boolean {
    return this.jokerSupport;
  }

  public getNumberOfAnsweredQuestions() {
    return this.answeredQuestions;
  }

  public getSpentTime() {
    return this.spentTime;
  }
}
