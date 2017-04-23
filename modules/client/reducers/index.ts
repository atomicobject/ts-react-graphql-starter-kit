import {State} from '../state';
import {Action} from 'redux';
import {derive} from '../../helpers'

const defaultState : State = {
  lastNumber: 0,
  currentGuess: []
}

export function rootReducer1(state:State=defaultState, action: Action): State {
  const guess = state.currentGuess.length + 1;
  return derive(state)
    .with('lastNumber', guess)
    .with('currentGuess', [...state.currentGuess, guess])
    .valueOf();
}

export function rootReducer2(state:State=defaultState, action: Action): State {
  const guess = state.currentGuess.length + 1;
  let newState = State.lastNumber.set(state, guess);
  newState = State.currentGuess.set(state, [...state.currentGuess, guess]);
  return newState;
}

import {flow} from 'lodash';
export function rootReducer(state:State=defaultState, action: Action): State {
  const guess = state.currentGuess.length + 1;
  return flow(
    State.lastNumber.set(guess),
    State.currentGuess.set([...state.currentGuess, guess])
  )(state);
}