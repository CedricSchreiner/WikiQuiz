import { Injectable } from '@angular/core';
import { RestService } from '../service/rest.service';

@Injectable()
export class SurvivalQuizService {
  fragenArrayInUse: Frage[];
  fragenArrayT1: Frage[];
  fragenPointer: number;
  t1: boolean;
  tableLoadFailure: boolean;
  lives: number;
  constructor(public restService: RestService) {
  }

  async startQuiz() {
    let tableInitialStart = false;
    this.lives = 3;
    while (!this.t1) {
      if (!tableInitialStart || (tableInitialStart && this.tableLoadFailure))  {
        this.loadQuestionTable1();
        tableInitialStart = true;
      }
      await this.delay(100);
    }
    this.updateTable();
    this.t1 = false;
    this.fragenArrayInUse = this.fragenArrayT1;
    console.log(this.fragenArrayInUse);
    this.fragenPointer = -1;
    this.updateTable();
    this.t1 = false;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async updateTable() {
    let tableInitialStart = false;
    while (!this.t1) {
      if (!tableInitialStart || (tableInitialStart && this.tableLoadFailure))  {
        this.loadQuestionTable1();
        tableInitialStart = true;
      }
      await this.delay(100);
    }
  }

  reduceLives() {
    this.lives--;
  }

  isFinished () {
    return (this.lives === 0);
  }

  getQuestion() {
    if (this.fragenPointer < 9) {
      this.fragenPointer++;
      return this.fragenArrayInUse[this.fragenPointer];
    } else {
      console.log('Alte Fragen leer neue laden');
      this.fragenPointer = 0;
      this.fragenArrayInUse = this.fragenArrayT1;
      this.updateTable();
      this.t1 = false;
      console.log(this.fragenArrayInUse);
      console.log('Neue Fragen werden angezeigt');
      return this.fragenArrayInUse[this.fragenPointer];
    }
  }

  loadQuestionTable1() {
    console.log('Tabelle 1 wird geladen');
    this.tableLoadFailure = false;
    this.restService.getQuestions(10, 1).subscribe((fragen) => {
      this.fragenArrayT1 = fragen;
      this.t1 = true;
      console.log('Tabelle 1 geladen');
    }, (err: any) => {
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
