import {State} from '../state';
import {Action} from 'redux';

const defaultState : State = {
  currentGuess: []
}

export function rootReducer(state:State=defaultState, action: Action): State {
  const guess = state.currentGuess.length + 1;
  return {
    ...state,
    lastNumber: guess,
    currentGuess: [
      ...state.currentGuess,
      guess
    ]
  }
}