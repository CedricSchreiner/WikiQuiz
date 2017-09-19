import { Injectable } from '@angular/core';

@Injectable()
export class FiftyFiftyJokerService {
  private jokersLeft: number;

  deleteAnswers(solutionNumber: number, bA: HTMLButtonElement, bB: HTMLButtonElement, bC: HTMLButtonElement, bD: HTMLButtonElement) {
    let deleteAnswer1 = null;
    let deleteAnswer2 = null;
    do {
      ///deleteAnswer1 = Math.floor(Math.random() * 4) + 1;
      deleteAnswer1 = Math.floor(Math.random() * (3 + 1));
    }while (deleteAnswer1 === Number(solutionNumber));

    do {
      deleteAnswer2 = Math.floor(Math.random() * (3 + 1));
    }while (deleteAnswer2 === Number(solutionNumber) || deleteAnswer2 === deleteAnswer1);
    this.jokersLeft--;

    if (deleteAnswer1 === 0 || deleteAnswer2 === 0) {
      bA.disabled = true;
      bA.style.backgroundColor = '#c0c1c4';
    }
    if (deleteAnswer1 === 1 || deleteAnswer2 === 1) {
      bB.disabled = true;
      bB.style.backgroundColor = '#c0c1c4';
    }
    if (deleteAnswer1 === 2 || deleteAnswer2 === 2) {
      bC.disabled = true;
      bC.style.backgroundColor = '#c0c1c4';
    }
    if (deleteAnswer1 === 3 || deleteAnswer2 === 3) {
      bD.disabled = true;
      bD.style.backgroundColor = '#c0c1c4';
    }
  }

  setJokerCount(jokerCount: number) {
    this.jokersLeft = jokerCount;
  }

  isJokerLeft(): boolean {
    return (this.jokersLeft !== 0);
  }
}
