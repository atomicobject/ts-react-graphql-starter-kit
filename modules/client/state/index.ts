import {Lens} from '../../helpers';
import {strEnum} from '../../helpers';

export interface State {
  readonly lastGuess?: Guess
  readonly guessSequence: number[],
}

export namespace State {
  export const lastGuess = Lens.from<State>().prop('lastGuess');
  export const guessSequence = Lens.from<State>().prop('guessSequence');
}

export const GuessResult = strEnum(["CORRECT", "INCORRECT"]);
export type GuessResult = keyof typeof GuessResult;
export interface Guess {status: GuessResult, value: number};
