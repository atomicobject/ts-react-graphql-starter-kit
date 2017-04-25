import {strEnum} from '../../helpers'

export const ActionTypes = strEnum([
  'GUESS_SUBMITTED',
  'GOOD_GUESS_OCCURRED',
  'BAD_GUESS_OCCURRED',
  'GAME_WON',
])

export type ActionTypes = 
  GuessSubmittedAction
  | GoodGuessOccurredAction
  | BadGuessOccurredAction
  | GameWonAction
  | OtherAction;

export type GuessSubmittedAction = {
  readonly type: typeof ActionTypes.GUESS_SUBMITTED,
  readonly value: number,
}

export function guessSubmitted(guess: number): GuessSubmittedAction {
  return { type: ActionTypes.GUESS_SUBMITTED, value: guess }
}

export type GoodGuessOccurredAction = {
  readonly type: typeof ActionTypes.GOOD_GUESS_OCCURRED, 
  readonly value: number, 
}

export function goodGuessOccurred(guess: number): GoodGuessOccurredAction {
  return { type: ActionTypes.GOOD_GUESS_OCCURRED, value: guess }
}

export type BadGuessOccurredAction = {
  readonly type: typeof ActionTypes.BAD_GUESS_OCCURRED, 
  readonly value: number, 
}

export function badGuessOccurred(guess: number): BadGuessOccurredAction {
  return { type: ActionTypes.BAD_GUESS_OCCURRED, value: guess }
}

export type GameWonAction = {
  readonly type: typeof ActionTypes.GAME_WON, 
  readonly correctAnswer: number[], 
}

export function gameWon(correctAnswer: number[]) {
  return { type: ActionTypes.GAME_WON, correctAnswer }
}

export type OtherAction = {
  readonly type: 'ignore me this is a fake type'
}