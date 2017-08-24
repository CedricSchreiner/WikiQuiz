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
  /**
   * 1 = Survival Quiz
   * 2 = xQuiz
   */
  gameArray = ['1', '2'];

  constructor(private survivalQuiz: SurvivalQuizService) {
  }

  async ngOnInit() {
    if (sessionStorage.length > 0) {
      switch (sessionStorage.getItem('gamemode')) {
        case '1': this.test = true;
                  this.richtigeAntworten = 0;
                  await this.survivalQuiz.startQuiz();
                  this.frage = this.survivalQuiz.getQuestion();
                  break;
      }
    }
  }

  start(game: number) {
    switch (game) {
      case 1: console.log('');
    }
  }

  nextQuestion(buttonNumber: number): any {
    if (buttonNumber === Number(this.frage.SolutionNumber)) {
      this.richtigeAntworten++;
    }else {
      this.survivalQuiz.reduceLives();
      if (this.survivalQuiz.isFinished()) {
        sessionStorage.removeItem('gamemode');
        window.location.href = 'menu';
      }
    }
    this.frage = this.survivalQuiz.getQuestion();
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
