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

  selectAnswer(selectedAnswer: number): boolean {
    this.guessesLeft--;
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
      if (this.guessesLeft === 0) {
        this.setAnswerButtonColor();
        this.jokersLeft--;
        return false;
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
      this.jokersLeft--;
      this.guessesLeft = -1;
      this.active = false;
      return false;
    }
  }

  setJokerCount(jokerCount: number) {
    this.jokersLeft = jokerCount;
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

  resetButtons(color: string) {
    this.buttonA.style.backgroundColor = color;
    this.buttonB.style.backgroundColor = color;
    this.buttonC.style.backgroundColor = color;
    this.buttonD.style.backgroundColor = color;
  }

  setAnswer(solutionNumber: number) {
    this.solutionNumber = solutionNumber;
  }

  getGuessLeft(): number {
    return this.guessesLeft;
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
    console.log('Joker left: ' + this.jokersLeft);
    return (Number(this.jokersLeft) !== 0);
  }
}
