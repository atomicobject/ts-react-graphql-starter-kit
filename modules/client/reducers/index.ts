import {State} from '../state';
import {Action} from 'redux';

const defaultState : State = {
  lastNumber: 0,
  currentGuess: []
}

import {flow} from 'lodash';
export function rootReducer(state:State=defaultState, action: Action): State {
  const guess = state.currentGuess.length + 1;
  return flow(
    State.lastNumber.set(guess),
    State.currentGuess.set([...state.currentGuess, guess])
  )(state);
}