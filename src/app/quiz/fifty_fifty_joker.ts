import { Injectable } from '@angular/core';

@Injectable()
export class FiftyFiftyJokerService {
  private jokersLeft: number;

  deleteAnswers(solutionNumber: number): number[] {
    let deleteAnswer1 = null;
    let deleteAnswer2 = null;
    let deleteAnswers: number[];
    do {
      ///deleteAnswer1 = Math.floor(Math.random() * 4) + 1;
      deleteAnswer1 = Math.floor(Math.random() * (3 + 1));
    }while (deleteAnswer1 === Number(solutionNumber));

    do {
      deleteAnswer2 = Math.floor(Math.random() * (3 + 1));
    }while (deleteAnswer2 === Number(solutionNumber) || deleteAnswer2 === deleteAnswer1);
    deleteAnswers = [deleteAnswer1, deleteAnswer2];
    this.jokersLeft--;
    return deleteAnswers;
  }

  setJokerCount(jokerCount: number) {
    this.jokersLeft = jokerCount;
  }

  isJokerLeft(): boolean {
    return (this.jokersLeft !== 0);
  }
}
