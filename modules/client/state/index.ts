import { Lens } from "@atomic-object/lenses";
import { Query } from "../../graphql/schema-types";

import { RouterState } from "react-router-redux";
import { Store as ApolloStore } from "apollo-client/store";

export interface GameState {
  readonly gameWon: boolean;
  readonly lastGuess?: Guess;
  readonly guessSequence: number[];
  readonly answerSequence: Query["answer"];
}

export interface State {
  gameState: GameState;
  router: RouterState;
  apollo: ApolloStore;
}

export namespace GameState {
  export const gameWon = Lens.from<GameState>().prop("gameWon");
  export const lastGuess = Lens.from<GameState>().prop("lastGuess");
  export const guessSequence = Lens.from<GameState>().prop("guessSequence");
  export const answerSequence = Lens.from<GameState>().prop("answerSequence");
}

export namespace State {
  export const gameState = Lens.from<State>().prop("gameState");
}

export enum GuessResult {
  CORRECT = "CORRECT",
  INCORRECT = "INCORRECT"
}
export interface Guess { status: GuessResult; value: number }
