import { Injectable } from '@angular/core';
import { RestService } from '../service/rest.service';

@Injectable()
export class SurvivalQuizService {
  fragenArray: Frage[];
  frage: Frage;
  fragenPointer: number;
  constructor(private restService) {
    this.fragenPointer = 0;
  }

  startQuiz() {
    this.restService.getQuestions(20, 1).subscribe((fragen) => {
      this.fragenArray = fragen;
      console.log(fragen);
      this.frage = this.fragenArray[this.fragenPointer];
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
