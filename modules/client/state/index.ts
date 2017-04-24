import {Lens} from '../../helpers';
import {strEnum} from '../../helpers';

export interface State {
  readonly currentGuess: number[],
  readonly lastGuess?: number
}

export namespace State {
  export const lastGuess = Lens.from<State>().prop('lastGuess');
  export const currentGuess = Lens.from<State>().prop('currentGuess');
}

export const GuessResult = strEnum(["CORRECT", "INCORRECT"]);
export type GuessResult = keyof typeof GuessResult;
export interface Guess {status: GuessResult, value: number};
