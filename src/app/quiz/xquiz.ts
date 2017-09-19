import { Injectable } from '@angular/core';
import { RestService } from '../service/rest.service';
import {Observable} from "rxjs/Observable";

@Injectable()
export class XQuizService {
  tableFilled: boolean;
  tableLoadFailure: boolean;
  beantworteteFragen: number;

  /*neu angelegte Variablen die gebraucht werden*/
  private buttonA: HTMLButtonElement;
  private buttonB: HTMLButtonElement;
  private buttonC: HTMLButtonElement;
  private buttonD: HTMLButtonElement;
  private timerdiv: HTMLDivElement;
  private wrongAnswerColor = '#FF0000';
  private rightAnswerColor = '#01DF01';
  private defaultButtonColor = '#0d87cf';
  private questionArray: Frage[];
  private tmpQuestionArray: Frage[];
  private running: boolean;
  private gameFinished: Observable<boolean>;

  /*Variables for Settings*/
  private blinkingTimes: number; /*default 3 times*/
  private numberOfQuestions: number;
  private arrayFragenPointer: number;
  private numberOfQuestionsToLoad: number; /*default 5*/
  private blinkIntervall: number; /*default 500ms*/
  private timeInMs: number; /*default 1600ms*/

  /*------------------------------------------------------------------------------------------------------------------*/
  /*Public Section*/
  constructor(public restService: RestService) {
  }

  public async initializeGame(buttonA: HTMLButtonElement, buttonB: HTMLButtonElement, buttonC: HTMLButtonElement,
                 buttonD: HTMLButtonElement, anzahlFragen: number, timer: HTMLDivElement) {
    /*initialize important variables*/
    this.buttonA = buttonA;
    this.buttonB = buttonB;
    this.buttonC = buttonC;
    this.buttonD = buttonD;
    this.timerdiv = timer;
    this.blinkingTimes = 3;
    this.numberOfQuestions = anzahlFragen;
    this.arrayFragenPointer = -1;
    this.numberOfQuestionsToLoad = 5;
    this.blinkIntervall = 500;
    this.running = false;
    this.timeInMs = 1600;

    /*initialize questionarray*/
    await this.updateTableBeta().then(res => this.questionArray = res);
    console.log(this.questionArray);
    this.updateTableBeta().then(res => this.tmpQuestionArray = res);
    return
  }

  public async startQuiz() {
    this.running = true;
    ///this.updateTableBeta(this.tmpFragenArray).then();
    console.log('start');
    this.timer().then();
    return this.nextQuestion();
  }

  public async selectedAnswer(selectedButtonNumber: number) {
    this.running = false;
    if (Number(this.questionArray[this.arrayFragenPointer].SolutionNumber) !== selectedButtonNumber) {
      await this.wrongAnswer(selectedButtonNumber);
    } else {
      await this.rightAnswer();
    }
    this.running = true;
    this.timer().then();
  }

  public nextQuestion(): Frage {
    this.arrayFragenPointer++;
    if (this.arrayFragenPointer === this.numberOfQuestionsToLoad - 1) {
      this.questionArray = this.tmpQuestionArray;
      this.updateTableBeta().then(res => this.tmpQuestionArray = res);
      this.arrayFragenPointer = 0;
    }
    return this.questionArray[this.arrayFragenPointer];
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  calculatePoints(anzahlrichtigeAntworten: number, verbrauchteZeit: number): number {
    const fragenPunkte = 3250 / this.numberOfQuestions * (this.numberOfQuestions - anzahlrichtigeAntworten);
    const zeitPunkte = 1750 / 1600 / this.numberOfQuestions;
    return Math.round(5000 - fragenPunkte - zeitPunkte * verbrauchteZeit);
  }

  private async updateTableBeta() {
    this.tableFilled = false;
    let tableToLoad: Frage[];
    await this.loadQuestions().then(res => tableToLoad = res);
    return tableToLoad;
  }

  private async loadQuestions() {
    let returnArray: Array<Frage>;
    returnArray = await this.restService.getQuestionsBeta(this.numberOfQuestionsToLoad, 1);
    return returnArray;
  }

  private async rightAnswer() {
    this.buttonStatus(false);
    this.setButtonColor(Number(this.questionArray[this.arrayFragenPointer].SolutionNumber), this.rightAnswerColor);
    await this.delay(this.blinkIntervall * 2 * (this.blinkingTimes - 1));
    this.setButtonColor(Number(this.questionArray[this.arrayFragenPointer].SolutionNumber), this.defaultButtonColor);
    this.buttonStatus(true);
  }

  private buttonStatus(active: boolean) {
    this.buttonA.disabled = !active;
    this.buttonB.disabled = !active;
    this.buttonC.disabled = !active;
    this.buttonD.disabled = !active;
  }

  private async wrongAnswer(selectedButton: number) {
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

  private async timer() {
    let timeLeft: number;
    timeLeft = this.timeInMs;
    while (this.running === true) {
      await this.delay(10).then();
      this.timerdiv.style.width = String((timeLeft * 0.0625)) + '%';
      timeLeft--;
      if (timeLeft === 0) {
        this.wrongAnswer(-1).then();
        this.running = false;
      }
      console.log(timeLeft);
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
