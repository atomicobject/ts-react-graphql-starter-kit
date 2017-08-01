import * as State from "../state";

import { Action } from "redux";
import { Lens } from "@atomic-object/lenses";
import { Arrays } from "@atomic-object/lenses/arrays";
import { ActionTypeKeys, ActionTypes } from "../actions";

const defaultState: State.Type = {
  gameState: {
    answerSequence: [1, 2, 3],
    gameWon: false,
    lastGuess: undefined,
    guessSequence: []
  },
  router: undefined as any, // provided at startup
  apollo: undefined as any // provided at startup
};

import flow from "lodash-es/flow";
import { GuessResult } from "../state/types";
import * as GameState from "../state/game-state";
export function gameReducer(
  state: GameState.Type,
  action: ActionTypes
): GameState.Type {
  switch (action.type) {
    case ActionTypeKeys.ANSWER_CHANGED:
      return flow(GameState.answerSequence.set(action.answer))(state);

    case ActionTypeKeys.GOOD_GUESS_OCCURRED:
      return flow(
        GameState.gameWon.set(false),
        GameState.lastGuess.set({
          status: GuessResult.CORRECT,
          value: action.value
        }),
        GameState.guessSequence.update(a => Arrays.push(a, action.value))
      )(state);

    case ActionTypeKeys.BAD_GUESS_OCCURRED:
      return flow(
        GameState.gameWon.set(false),
        GameState.lastGuess.set({
          status: GuessResult.INCORRECT,
          value: action.value
        }),
        GameState.guessSequence.set([])
      )(state);

    case ActionTypeKeys.GAME_WON:
      return flow(
        GameState.gameWon.set(true),
        GameState.lastGuess.set(undefined),
        GameState.guessSequence.set([])
      )(state);

    default:
      return state;
  }
}

function targetReducer<T, U>(
  reducer: (arg: U, action: any) => U,
  lens: Lens<T, U>
): (arg: T, action: any) => T {
  return (arg: T, action: any) => lens.set(arg, reducer(lens.get(arg), action));
}

const stateGameReducer = targetReducer(gameReducer, State.gameState);
export function rootReducer(
  state: State.Type = defaultState,
  action: Action
): State.Type {
  return stateGameReducer(state, <Action>action);
}
