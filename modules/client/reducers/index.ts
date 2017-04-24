import {State} from '../state';
import {Action} from 'redux';
import {Arrays} from '../../helpers';
import {ActionTypes} from '../actions';

const defaultState : State = {
  lastGuess: undefined,
  guessSequence: [],
}

import {flow} from 'lodash';
export function gameReducer(state: State, action: ActionTypes) {
  switch (action.type) {
  case ActionTypes.USER_GUESS:
    return flow(
      State.lastGuess.set(undefined),
      State.guessSequence.update(a => Arrays.push(a, action.value))
    )(state)
  
  default: 
    return state;
  } 
}

export function rootReducer(state: State=defaultState, action: Action): State {
  return gameReducer(state, <Action>action);
}