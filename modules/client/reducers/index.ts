import {State} from '../state';
import {Action} from 'redux';
import {update} from '../../helpers'

const defaultState : State = {
  lastNumber: 0,
  currentGuess: []
}

export function rootReducer(state:State=defaultState, action: Action): State {
  const guess = state.currentGuess.length + 1;
  return update(state)
    .with('lastNumber', guess)
    .with('currentGuess', [...state.currentGuess, guess])
    .valueOf();
}