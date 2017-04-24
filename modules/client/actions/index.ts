import {strEnum} from '../../helpers'

export const ActionTypes = strEnum([
  'USER_GUESS',
])

export type ActionTypes = 
  GuessAction
  | OtherAction;

export type GuessAction = {
  readonly type: typeof ActionTypes.USER_GUESS, 
  readonly value: number, 
}

export function makeGuessAction(guess: number): GuessAction {
  return { type: ActionTypes.USER_GUESS, value: guess }
}

export type OtherAction = {
  readonly type: 'ignore me this is a fake type'
}