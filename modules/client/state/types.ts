export enum GuessResult {
  CORRECT = "CORRECT",
  INCORRECT = "INCORRECT"
}
export interface Guess { status: GuessResult; value: number }
