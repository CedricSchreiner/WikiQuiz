import { Injectable } from '@angular/core';
import { RestService } from '../service/rest.service';

@Injectable()
export class XQuizService {
  fragenArrayInUse: Frage[];
  fragenArrayLadeFragen: Frage[];
  fragenPointer: number;
  tableFilled: boolean;
  tableLoadFailure: boolean;
  anzahlFragen: number;
  beantworteteFragen: number;

  ///neu angelegte Variablen die gebraucht werden
  private buttonA: HTMLButtonElement;
  private buttonB: HTMLButtonElement;
  private buttonC: HTMLButtonElement;
  private buttonD: HTMLButtonElement;
  private wrongAnswerColor = '#FF0000';
  private rightAnswerColor = '#01DF01';
  private defaultButtonColor = '';

  /*Variables for Settings*/
  private blinkingTimes: number; ///default 3 times

  constructor(public restService: RestService) {
  }

  initializeGame(buttonA: HTMLButtonElement, buttonB: HTMLButtonElement, buttonC: HTMLButtonElement, buttonD: HTMLButtonElement, anzahlFragen: number) {
    this.buttonA = buttonA;
    this.buttonB = buttonB;
    this.buttonC = buttonC;
    this.buttonD = buttonD;
    this.blinkingTimes = 3;
  }

  async startQuiz() {
    let tableInitialStart = false;
    while (!this.tableFilled) {
      if (!tableInitialStart || (tableInitialStart && this.tableLoadFailure))  {
        this.loadQuestionTable1();
        tableInitialStart = true;
      }
      await this.delay(100);
    }
    this.fragenArrayInUse = this.fragenArrayLadeFragen;
    console.log(this.fragenArrayInUse);
    this.fragenPointer = -1;
    this.updateTable();
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  calculatePoints(anzahlrichtigeAntworten: number, verbrauchteZeit: number): number {
    const fragenPunkte = 3250 / this.anzahlFragen * (this.anzahlFragen - anzahlrichtigeAntworten);
    const zeitPunkte = 1750 / 1600 / this.anzahlFragen;
    return Math.round(5000 - fragenPunkte - zeitPunkte * verbrauchteZeit);
  }

  async updateTable() {
    let tableInitialStart = false;
    this.tableFilled = false;
    while (!this.tableFilled) {
      if (!tableInitialStart || (tableInitialStart && this.tableLoadFailure))  {
        this.loadQuestionTable1();
        tableInitialStart = true;
      }
      await this.delay(100);
    }
  }

  loadQuestionTable1() {
    console.log('Table 1 is loading');
    this.tableLoadFailure = false;
    this.restService.getQuestions(5, 1).subscribe((fragen) => {
      this.fragenArrayLadeFragen = fragen;
      this.tableFilled = true;
      console.log('Table 1 loaded');
    }, () => {
      console.log('load Table Error');
      this.tableLoadFailure = true;
    });
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
