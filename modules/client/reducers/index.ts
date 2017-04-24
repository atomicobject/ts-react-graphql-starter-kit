import {State} from '../state';
import {Action} from 'redux';
import {Arrays} from '../../helpers';

const defaultState : State = {
  lastGuess: 0,
  currentGuess: []
}

import {flow} from 'lodash';
export function addNewEntry(state:State) {
  // Add 1 to the current 'guess' length to derive a number
  const guess = State.currentGuess(state).length + 1;

  // Update the lastNumber and currentGuess and return the updated
  // copy.
  return flow(
    State.lastGuess.set(guess),
    State.currentGuess.update(a => Arrays.push(a, guess))
  )(state);
}

export function rootReducer(state:State=defaultState, action: Action): State {
  return addNewEntry(state);
}