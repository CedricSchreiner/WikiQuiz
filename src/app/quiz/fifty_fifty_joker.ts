import { Injectable } from '@angular/core';

@Injectable()
export class FiftyFiftyJokerService {
  deleteAnswers(solutionNumber: number) {
    console.log(solutionNumber);
    let deleteAnswer1 = null;
    let deleteAnswer2 = null;
    do {
      console.log(deleteAnswer1 === solutionNumber);
      deleteAnswer1 = Math.floor(Math.random() * 4) + 1;
    }while (deleteAnswer1 === Number(solutionNumber));

    do {
      console.log(deleteAnswer1 === solutionNumber);
      deleteAnswer2 = Math.floor(Math.random() * 4) + 1;
    }while (deleteAnswer2 === Number(solutionNumber) || deleteAnswer2 === deleteAnswer1);
  }
}
