import {State} from '../state';
import {Action} from 'redux';
import {Arrays} from '../../helpers';
import {ActionTypes} from '../actions';
import {GuessResult} from '../state';

const defaultState : State = {
  answerSequence: [1,2,3],
  gameWon: false,
  lastGuess: undefined,
  guessSequence: [],
}

import {flow} from 'lodash';
export function gameReducer(state: State, action: ActionTypes) {
  switch (action.type) {

  case ActionTypes.ANSWER_CHANGED:
    return flow(
      State.answerSequence.set(action.answer),
    )(state)

  case ActionTypes.GOOD_GUESS_OCCURRED:
    return flow(
      State.gameWon.set(false),
      State.lastGuess.set({status: GuessResult.CORRECT, value: action.value}),
      State.guessSequence.update(a => Arrays.push(a, action.value))
    )(state)
  
  case ActionTypes.BAD_GUESS_OCCURRED:
    return flow(
      State.gameWon.set(false),
      State.lastGuess.set({status: GuessResult.INCORRECT, value: action.value}),
      State.guessSequence.set([])
    )(state)
  
  case ActionTypes.GAME_WON:
    return flow(
      State.gameWon.set(true),
      State.lastGuess.set(undefined),
      State.guessSequence.set([])
    )(state)
  
  default: 
    return state;
  } 
}

export function rootReducer(state: State=defaultState, action: Action): State {
  return gameReducer(state, <Action>action);
}