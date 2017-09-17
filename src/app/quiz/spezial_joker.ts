import { Injectable } from '@angular/core';

@Injectable()
export class SpecialJokerService {
  private jokersLeft: number;
  private active = false;
  private buttonA: HTMLButtonElement;
  private buttonB: HTMLButtonElement;
  private buttonC: HTMLButtonElement;
  private buttonD: HTMLButtonElement;
  private solutionNumber: number;
  private guessesLeft = 2;

  deleteAnswers(selectedAnswer: number): boolean {
    this.guessesLeft--;
    if (this.guessesLeft === 0) {
      this.jokersLeft--;
    }
    if (Number(selectedAnswer) !== Number(this.solutionNumber)) {
      switch (selectedAnswer) {
        case 0: this.buttonA.style.backgroundColor = '#c0c1c4';
                break;
        case 1: this.buttonB.style.backgroundColor = '#c0c1c4';
                break;
        case 2: this.buttonC.style.backgroundColor = '#c0c1c4';
                break;
        case 3: this.buttonD.style.backgroundColor = '#c0c1c4';
                break;
      }
      return true;
    }else {
      switch (selectedAnswer) {
        case 0: this.buttonA.style.backgroundColor = '#FF0000';
          break;
        case 1: this.buttonB.style.backgroundColor = '#FF0000';
          break;
        case 2: this.buttonC.style.backgroundColor = '#FF0000';
          break;
        case 3: this.buttonD.style.backgroundColor = '#FF0000';
          break;
      }
      this.guessesLeft = 2;
      this.active = false;
      return false;
    }
  }

  getGuessesLeft(): number {
    return this.guessesLeft;
  }

  setJokerCount(jokerCount: number) {
    this.jokersLeft = jokerCount;
  }

  isJokerActive(): boolean {
    return this.active;
  }

  setButtons(buttonA: HTMLButtonElement, buttonB: HTMLButtonElement, buttonC: HTMLButtonElement, buttonD: HTMLButtonElement) {
    this.buttonA = buttonA;
    this.buttonB = buttonB;
    this.buttonC = buttonC;
    this.buttonD = buttonD;
  }

  setAnswerButtonColor() {
    switch (Number(this.solutionNumber)) {
      case 0: this.buttonA.style.backgroundColor = '#01DF01';
              break;
      case 1: this.buttonB.style.backgroundColor = '#01DF01';
              break;
      case 2: this.buttonC.style.backgroundColor = '#01DF01';
              break;
      case 3: this.buttonD.style.backgroundColor = '#01DF01';
              break;
    }
  }

  setAnswer(solutionNumber: number) {
    this.solutionNumber = solutionNumber;
  }

  /**
   * Set Status of joker active/inactive
   * default: inactive
   */
  setStatus(status: boolean) {
    if (status) {
      this.guessesLeft = 2;
    }
    this.active = status;
  }

  isJokerLeft() {
    return (this.jokersLeft !== 0);
  }
}
