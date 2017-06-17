import { GameState, State } from "../state";
import { Action } from "redux";
import { Lens } from "@atomic-object/lenses";
import { Arrays } from "@atomic-object/lenses/arrays";
import { ActionTypes } from "../actions";
import { GuessResult } from "../state";

const defaultState: State = {
  gameState: {
    answerSequence: [1, 2, 3],
    gameWon: false,
    lastGuess: undefined,
    guessSequence: []
  },
  router: undefined, // provided at startup
  apollo: undefined // provided at startup
} as any;

import flow from "lodash-es/flow";
export function gameReducer(state: GameState, action: ActionTypes): GameState {
  switch (action.type) {
    case ActionTypes.ANSWER_CHANGED:
      return flow(GameState.answerSequence.set(action.answer))(state);

    case ActionTypes.GOOD_GUESS_OCCURRED:
      return flow(
        GameState.gameWon.set(false),
        GameState.lastGuess.set({
          status: GuessResult.CORRECT,
          value: action.value
        }),
        GameState.guessSequence.update(a => Arrays.push(a, action.value))
      )(state);

    case ActionTypes.BAD_GUESS_OCCURRED:
      return flow(
        GameState.gameWon.set(false),
        GameState.lastGuess.set({
          status: GuessResult.INCORRECT,
          value: action.value
        }),
        GameState.guessSequence.set([])
      )(state);

    case ActionTypes.GAME_WON:
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
  state: State = defaultState,
  action: Action
): State {
  return stateGameReducer(state, <Action>action);
}
