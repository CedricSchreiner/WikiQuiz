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
    console.log(this.guessesLeft);

    console.log('Antwort: ' + this.solutionNumber);
    console.log('Auswahl: ' + selectedAnswer);
    if (this.guessesLeft === 0) {
      this.jokersLeft--;
      this.active = false;
      this.guessesLeft = 2;
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

  setAnswer(solutionNumber: number) {
    this.solutionNumber = solutionNumber;
  }

  /**
   * Set Status of joker active/inactive
   * default: inactive
   */
  setStatus(status: boolean) {
    this.active = status;
  }

  isJokerLeft() {
    return (this.jokersLeft !== 0);
  }
}
