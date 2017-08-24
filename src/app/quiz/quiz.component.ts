import { Component, OnInit } from '@angular/core';
import { RestService } from '../service/rest.service';
import { SurvivalQuizService } from './survivalQuiz';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  test: boolean;
  fragenArray: Frage[];
  fragenPointer: number;
  frage: Frage;
  richtigeAntworten: number;

  constructor(private restService: RestService, private survivalQuiz: SurvivalQuizService) {
  }
  ngOnInit() {
    if (sessionStorage.length > 0) {
      this.test = true;
      this.richtigeAntworten = 0;
      this.fragenPointer = 0;
      this.restService.getQuestions(4, 1).subscribe((fragen) => {
        this.fragenArray = fragen;
        console.log(fragen);
        this.frage = this.fragenArray[this.fragenPointer];
      });
    }
  }

  nextQuestion(buttonNumber: number): any {
    console.log(this.frage.SolutionNumber);
    console.log(buttonNumber);
    if (buttonNumber === Number(this.frage.SolutionNumber)) {
      this.richtigeAntworten++;
    }
    this.fragenPointer++;
    this.frage = this.fragenArray[this.fragenPointer];
  }

  logout() {
    sessionStorage.clear();
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
