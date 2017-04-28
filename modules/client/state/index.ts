import {Lens} from '../../helpers';
import {strEnum} from '../../helpers';
import {Answer} from '../../graphql/types';

export interface GameState {
  readonly gameWon: boolean,
  readonly lastGuess?: Guess,
  readonly guessSequence: number[],
  readonly answerSequence: Answer,
}

export interface State {
  gameState: GameState;
}

export namespace GameState {
  export const gameWon = Lens.from<GameState>().prop('gameWon');
  export const lastGuess = Lens.from<GameState>().prop('lastGuess');
  export const guessSequence = Lens.from<GameState>().prop('guessSequence');
  export const answerSequence = Lens.from<GameState>().prop('answerSequence');
}

export namespace State {
  export const gameState = Lens.from<State>().prop('gameState');
}

export const GuessResult = strEnum(["CORRECT", "INCORRECT"]);
export type GuessResult = keyof typeof GuessResult;
export interface Guess {status: GuessResult, value: number};
