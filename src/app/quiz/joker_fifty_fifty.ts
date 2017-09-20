import { Injectable } from '@angular/core';

@Injectable()
export class FiftyFiftyJokerService {
  private jokersLeft: number;
  private buttonA: HTMLButtonElement;
  private buttonB: HTMLButtonElement;
  private buttonC: HTMLButtonElement;
  private buttonD: HTMLButtonElement;

  disableWrongAnswers(solutionNumber: number, bA: HTMLButtonElement, bB: HTMLButtonElement, bC: HTMLButtonElement, bD: HTMLButtonElement) {
    this.buttonA = bA;
    this.buttonB = bB;
    this.buttonC = bC;
    this.buttonD = bD;
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
      this.buttonA.disabled = true;
      this.buttonA.style.backgroundColor = '#c0c1c4';
    }
    if (deleteAnswer1 === 1 || deleteAnswer2 === 1) {
      this.buttonB.disabled = true;
      this.buttonB.style.backgroundColor = '#c0c1c4';
    }
    if (deleteAnswer1 === 2 || deleteAnswer2 === 2) {
      this.buttonC.disabled = true;
      this.buttonC.style.backgroundColor = '#c0c1c4';
    }
    if (deleteAnswer1 === 3 || deleteAnswer2 === 3) {
      this.buttonD.disabled = true;
      this.buttonD.style.backgroundColor = '#c0c1c4';
    }
  }

  resetButtons(color: string) {
    this.buttonA.style.backgroundColor = color;
    this.buttonB.style.backgroundColor = color;
    this.buttonC.style.backgroundColor = color;
    this.buttonD.style.backgroundColor = color;
  }

  whenJokerActive(): boolean {
    return false;
  }

  setJokerCount(jokerCount: number) {
    this.jokersLeft = jokerCount;
  }

  isJokerLeft(): boolean {
    return (this.jokersLeft !== 0);
  }
}
