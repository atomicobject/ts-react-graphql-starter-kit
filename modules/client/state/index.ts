import {Lens} from '../../helpers';
import {strEnum} from '../../helpers';

export interface State {
  readonly gameWon: boolean,
  readonly lastGuess?: Guess,
  readonly guessSequence: number[],
  // readonly winningNumbers: number[]
}

export namespace State {
  export const gameWon = Lens.from<State>().prop('gameWon');
  export const lastGuess = Lens.from<State>().prop('lastGuess');
  export const guessSequence = Lens.from<State>().prop('guessSequence');
  // export const  winningNumbers = ...
}

export const GuessResult = strEnum(["CORRECT", "INCORRECT"]);
export type GuessResult = keyof typeof GuessResult;
export interface Guess {status: GuessResult, value: number};
