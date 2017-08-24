import { Injectable } from '@angular/core';
import { RestService } from '../service/rest.service';

@Injectable()
export class SurvivalQuizService {
  fragenArrayInUse: Frage[];
  fragenArrayT1: Frage[];
  fragenPointer: number;
  t1: boolean;
  constructor(public restService: RestService) {
  }

  async startQuiz() {
    while (!this.t1) {
      this.loadQuestionTable1();
      console.log('2');
      await this.delay(1000);
    }
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
    while (!this.t1) {
      this.loadQuestionTable1();
      console.log('1');
      await this.delay(1000);
    }
  }

  isFinished () {
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
    this.restService.getQuestions(10, 1).subscribe((fragen) => {
      this.fragenArrayT1 = fragen;
      this.t1 = true;
      console.log('Tabelle 1 geladen');
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
