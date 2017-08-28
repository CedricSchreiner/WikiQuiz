import { Injectable } from '@angular/core';

@Injectable()
export class FiftyFiftyJokerService {
  jokersLeft: number;

  deleteAnswers(solutionNumber: number) {

  }

  setJokerCount(jokerCount: number) {
    this.jokersLeft = jokerCount;
  }

  isJokerLeft() {
    return (this.jokersLeft !== 0);
  }
}
