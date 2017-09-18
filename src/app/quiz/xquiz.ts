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
  private wrongAnswerColor = '#FF0000';
  private rightAnswerColor = '#01DF01';
  private defaultButtonColor = '#0d87cf';
  private fragenArray: Frage[];
  private tmpFragenArray: Frage[];
  private answerA: Answer;

  /*Variables for Settings*/
  private blinkingTimes: number; /*default 3 times*/
  private anzahlFragen: number;
  private arrayFragenPointer: number;
  private numberOfQuestionsToLoad: number; /*default 5*/
  private blinkIntervall: number; /*default 500ms*/

  /*------------------------------------------------------------------------------------------------------------------*/
  /*Public Section*/
  constructor(public restService: RestService) {
  }

  public async initializeGame(buttonA: HTMLButtonElement, buttonB: HTMLButtonElement, buttonC: HTMLButtonElement,
                 buttonD: HTMLButtonElement, anzahlFragen: number, answerA: Answer) {
    /*initialize important variables*/
    this.buttonA = buttonA;
    this.buttonB = buttonB;
    this.buttonC = buttonC;
    this.buttonD = buttonD;
    this.blinkingTimes = 3;
    this.anzahlFragen = anzahlFragen;
    this.arrayFragenPointer = 0;
    this.answerA = answerA;
    this.numberOfQuestionsToLoad = 5;
    this.blinkIntervall = 500;

    /*initialize questionarray*/
    await this.updateTable().then();
  }

  public startQuiz(): Frage {
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
        await this.loadQuestionTable1();
        tableInitialStart = true;
      }
      await this.delay(100);
    }
  }

  private async loadQuestionTable1() {
    this.tableLoadFailure = false;
    this.restService.getQuestions(this.numberOfQuestionsToLoad, 1).subscribe((fragen) => {
      this.fragenArray = fragen;
      this.tableFilled = true;
    }, () => {
      this.tableLoadFailure = true;
    });
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

  private time() {

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

interface Answer {
  answer: string;
}
