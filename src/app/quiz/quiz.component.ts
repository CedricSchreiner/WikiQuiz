import { Component, OnInit } from '@angular/core';
import { SurvivalQuizService } from './survivalQuiz';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  test: boolean;
  frage: Frage;
  richtigeAntworten: number;

  constructor(private survivalQuiz: SurvivalQuizService) {
  }
  async ngOnInit() {
    if (sessionStorage.length > 0) {
      this.test = true;
      this.richtigeAntworten = 0;
      await this.survivalQuiz.startQuiz();
      this.frage = this.survivalQuiz.getQuestion();
      console.log(this.frage);
    }
  }

  nextQuestion(buttonNumber: number): any {
    if (buttonNumber === Number(this.frage.SolutionNumber)) {
      this.richtigeAntworten++;
    }
    this.frage = this.survivalQuiz.getQuestion();
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
