import {State} from '../state';
import {Action} from 'redux';
import {derive} from '../../helpers'

import {Lens} from '../../helpers/lenses'

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

let lastNumber = Lens.from<State>().prop('lastNumber');
let currentGuess = Lens.from<State>().prop('currentGuess');
export function rootReducer2(state:State=defaultState, action: Action): State {
  const guess = state.currentGuess.length + 1;
  let newState = lastNumber.set(state, guess);
  newState = currentGuess.set(state, [...state.currentGuess, guess]);
  return newState;
}

import {partialRight, flow} from 'lodash';
export function rootReducer(state:State=defaultState, action: Action): State {
  const guess = state.currentGuess.length + 1;
  return flow(
    partialRight(lastNumber.set, guess),
    partialRight(currentGuess.set, [...state.currentGuess, guess])
  )(state);
}