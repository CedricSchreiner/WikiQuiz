import { Injectable } from '@angular/core';
import { RestService } from '../service/rest.service';

@Injectable()
export class SurvivalQuizService {
  private fragenArrayInUse: Frage[];
  private fragenArrayLadeFragen: Frage[];
  private fragenPointer: number;
  private tableFilled: boolean;
  private tableLoadFailure: boolean;
  private lives: number;

  constructor(public restService: RestService) {
  }

  async startQuiz() {
    let tableInitialStart = false;
    this.lives = 3;
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
      this.fragenArrayInUse = this.fragenArrayLadeFragen;
      this.updateTable();
      this.tableFilled = false;
      console.log(this.fragenArrayInUse);
      console.log('Neue Fragen werden angezeigt');
      return this.fragenArrayInUse[this.fragenPointer];
    }
  }

  calculatePoints(anzahlrichtigeAntworten: number, verbrauchteZeit: number, anzahlerBenutzerJoker: number): number {
    const jokerPoints = anzahlerBenutzerJoker * 100;
    const zeitPunkte = ((1600 * (anzahlrichtigeAntworten + 3)) - verbrauchteZeit) * 0.0625;
    const antwortenPunkte = anzahlrichtigeAntworten * 150;
    return zeitPunkte + antwortenPunkte - jokerPoints;
  }

  loadQuestionTable1() {
    console.log('Tabelle 1 wird geladen');
    this.tableLoadFailure = false;
    this.restService.getQuestions(10, 1).subscribe((fragen) => {
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
