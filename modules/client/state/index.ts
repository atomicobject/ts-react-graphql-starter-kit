import {Lens} from '../../helpers';

export interface State {
  readonly currentGuess: number[],
  readonly lastNumber?: number
}

export namespace State {
  export const lastNumber = Lens.from<State>().prop('lastNumber');
  export const currentGuess = Lens.from<State>().prop('currentGuess');
}