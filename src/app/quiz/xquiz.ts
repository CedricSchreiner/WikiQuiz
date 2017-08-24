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

  constructor(public restService: RestService) {
  }

  async startQuiz(anzahlFragen: number) {
    this.beantworteteFragen = 0;
    this.anzahlFragen = anzahlFragen;
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

  isFinished () {
    console.log(this.beantworteteFragen);
    console.log(this.anzahlFragen);
    return (this.beantworteteFragen === this.anzahlFragen);
  }

  getQuestion() {
    this.beantworteteFragen++;
    if (this.beantworteteFragen <= this.anzahlFragen) {
      if (this.fragenPointer < 4) {
        this.fragenPointer++;
        return this.fragenArrayInUse[this.fragenPointer];
      } else {
        console.log('Alte Fragen leer neue laden');
        this.fragenPointer = 0;
        this.fragenArrayInUse = this.fragenArrayLadeFragen;
        this.updateTable();
        this.tableFilled = false;
        console.log(this.fragenArrayInUse);
        console.log('Neue Fragen werden angezeigt');
        return this.fragenArrayInUse[this.fragenPointer];
      }
    }
  }

  loadQuestionTable1() {
    console.log('Tabelle 1 wird geladen');
    this.tableLoadFailure = false;
    this.restService.getQuestions(5, 1).subscribe((fragen) => {
      this.fragenArrayLadeFragen = fragen;
      this.tableFilled = true;
      console.log('Tabelle 1 geladen');
    }, () => {
      console.log('Fehler beim laden der Tabelle');
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
