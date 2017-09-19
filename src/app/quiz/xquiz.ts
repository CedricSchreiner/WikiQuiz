import { Injectable } from '@angular/core';
import { RestService } from '../service/rest.service';

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
  private fragenArray: Frage[];
  private tmpFragenArray: Frage[];
  private running: boolean;

  /*Variables for Settings*/
  private blinkingTimes: number; /*default 3 times*/
  private anzahlFragen: number;
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
    this.anzahlFragen = anzahlFragen;
    this.arrayFragenPointer = 0;
    this.numberOfQuestionsToLoad = 5;
    this.blinkIntervall = 500;
    this.running = false;
    this.timeInMs = 1600;

    /*initialize questionarray*/
    await this.updateTableBeta().then();
  }

  public async startQuiz() {
    this.running = true;
    await this.updateTableBeta().then();
    console.log('start');
    return this.nextQuestion();
  }

  public async selectedAnswer(selectedButtonNumber: number) {
    console.log('Solution: ' + this.fragenArray[this.arrayFragenPointer].SolutionNumber);
    console.log('Auswahl:' + selectedButtonNumber);
    if (Number(this.fragenArray[this.arrayFragenPointer].SolutionNumber) !== selectedButtonNumber) {
      await this.wrongAnswer(selectedButtonNumber);
    } else {
      await this.rightAnswer();
    }
  }

  public nextQuestion(): Frage {
    this.arrayFragenPointer++;
    return this.fragenArray[this.arrayFragenPointer];
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  calculatePoints(anzahlrichtigeAntworten: number, verbrauchteZeit: number): number {
    const fragenPunkte = 3250 / this.anzahlFragen * (this.anzahlFragen - anzahlrichtigeAntworten);
    const zeitPunkte = 1750 / 1600 / this.anzahlFragen;
    return Math.round(5000 - fragenPunkte - zeitPunkte * verbrauchteZeit);
  }

  /*Private Section*/
  private async updateTable() {
    let tableInitialStart = false;
    this.tableFilled = false;
    while (!this.tableFilled) {
      if (!tableInitialStart || (tableInitialStart && this.tableLoadFailure))  {
        this.fragenArray = await this.loadQuestionTable1();
        tableInitialStart = true;
      }
      await this.delay(100);
    }
  }

  private async updateTableBeta() {
    ///let tableInitialStart = false;
    this.tableFilled = false;

    await this.test().then(res => this.fragenArray = res);
  }

  private async loadQuestionTable1() {
    let returnArray: Array<Frage>;
    this.tableLoadFailure = false;

    await this.restService.getQuestions(this.numberOfQuestionsToLoad, 1).subscribe((fragen) => {
      this.tableFilled = true;
      return returnArray = fragen;
    }, () => {
      this.tableLoadFailure = true;
    });
    return returnArray;
  }

  private async test() {
    let returnArray: Array<Frage>;
    returnArray = await this.restService.getQuestionsBeta(this.numberOfQuestionsToLoad, 1);
    return returnArray;
  }

  private async rightAnswer() {
    this.setButtonColor(Number(this.fragenArray[this.arrayFragenPointer].SolutionNumber), this.rightAnswerColor);
    await this.delay(this.blinkIntervall * 2 * (this.blinkingTimes - 1));
    this.setButtonColor(Number(this.fragenArray[this.arrayFragenPointer].SolutionNumber), this.defaultButtonColor);
  }

  private async wrongAnswer(selectedButton: number) {
    this.setButtonColor(selectedButton, this.wrongAnswerColor);
    for (let i = 0; i < this.blinkingTimes; i++) {
      this.setButtonColor(Number(this.fragenArray[this.arrayFragenPointer].SolutionNumber), this.rightAnswerColor);
      await this.delay(this.blinkIntervall);
      this.setButtonColor(Number(this.fragenArray[this.arrayFragenPointer].SolutionNumber), this.defaultButtonColor);
      await this.delay(this.blinkIntervall);
    }
    this.setButtonColor(selectedButton, this.defaultButtonColor);
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
    while (this.running) {
      ///this.timerdiv.style.width = String((this.timeLeft * 0.0625)) + '%';
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
