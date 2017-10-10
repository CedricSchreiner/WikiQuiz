import { Injectable } from '@angular/core';
import { RestService } from '../service/rest.service';
import { Observable } from 'rxjs/Observable';
import {QuizService} from './quiz_game';

@Injectable()
export class TimeQuizService extends QuizService {
  private spentTime: number;
  private answeredQuestions: number;
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
   * @param {HTMLDivElement} timer
   * @returns {Promise<Observable<boolean>>}
   */
  public async initializeGame(buttonA: HTMLButtonElement, buttonB: HTMLButtonElement, buttonC: HTMLButtonElement,
                              buttonD: HTMLButtonElement, button: HTMLButtonElement, timer: HTMLDivElement) {
    const observer =  await super.initialize(buttonA, buttonB, buttonC, buttonD, button, timer).then();
    this.spentTime = 0;
    this.answeredQuestions = 0;
    this.setTime(3000);
    this.timeIntervall = 100;
    return observer;
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
    return this.rightAnswers * 100;
  }

  /*Private Section*/

  /**
   * Wenn der User eine richtige Antwort ausgewaehlt hat, werden die Buttons entsprechend gefaerbt.
   * @returns {Promise<void>}
   */
  protected async rightAnswer() {
    await super.rightAnswer().then();
  }

  /**
   * Wenn der User eine falsche Antwort ausgewaehlt hat, werden die Buttons entsprechend gefaerbt.
   * @param {number} selectedButton
   * @returns {Promise<void>}
   */
  protected async wrongAnswer(selectedButton: number) {
    this.timeInMs -= 100;
    await super.wrongAnswer(selectedButton).then();
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
      if (this.timeLeft <= 0) {
        this.gameFinished = true;
        this.running = false;
        this.button.click();
      }
    }
  }

  /*Getter*/
  public getNumberAnsweredQuestions(): number {
    return this.answeredQuestions;
  }

  public getNumberOfRightAnswers(): number {
    return this.rightAnswers;
  }

}
