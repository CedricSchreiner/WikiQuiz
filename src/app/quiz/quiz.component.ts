import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  test: boolean;
  ngOnInit() {
    if (sessionStorage.length > 0) {
      this.test = true;
    }
  }
}
