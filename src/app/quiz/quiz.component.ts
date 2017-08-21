import { Component, OnInit } from '@angular/core';
import {RestService} from '../service/rest.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  test: boolean;
  fragenArray: Frage[];
  fragenPointer: number;

  constructor(private restService: RestService){
  }
  ngOnInit() {
    if (sessionStorage.length > 0) {
      this.test = true;
      this.fragenPointer = 0;
      this.restService.getQuestions(4, 1).subscribe((fragen) => {
        this.fragenArray = fragen;
        console.log(fragen);
      });
    }
  }

  nextQuestion() {

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
