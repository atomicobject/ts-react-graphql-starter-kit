interface ActionBuilder<T> {
  (): () => T;
  <K1 extends keyof T>(k1: K1): (v1: T[K1]) => T;
  <K1 extends keyof T, K2 extends keyof T>(k1: K1, k2: K2): (
    v1: T[K1],
    v2: T[K2]
  ) => T;
  <K1 extends keyof T, K2 extends keyof T, K3 extends keyof T>(
    k1: K1,
    k2: K2,
    k3: K3
  ): (v1: T[K1], v2: T[K2], v3: T[K3]) => T;
}

export enum ActionTypeKeys {
  ANSWER_CHANGED = "ANSWER_CHANGED",
  GUESS_SUBMITTED = "GUESS_SUBMITTED",
  GOOD_GUESS_OCCURRED = "GOOD_GUESS_OCCURRED",
  BAD_GUESS_OCCURRED = "BAD_GUESS_OCCURRED",
  GAME_WON = "GAME_WON",
  OTHER_ACTION = "fake"
}

export type ActionTypes =
  | AnswerChangedAction
  | GuessSubmittedAction
  | GoodGuessOccurredAction
  | BadGuessOccurredAction
  | GameWonAction
  | OtherAction;

/** Creates an action builder for a given action type which arguments that are mapped to the properties of the action.
 * 
 * Example usage:
 *  actionBuilder<SomeAction>(ActionTypes.SOME_ACTION)('prop1', 'prop2')
 * returns an action builder that requires two arguments and returns a SomeAction.
 * 
 * This function is curried to work around limitations in typescript. It takes a type argument and a string type key,
 * and returns a function that makes the action-builder given a set of props which must be populated.
 */
export function actionBuilder<T extends { type: ActionTypeKeys }>(
  s: T["type"]
): ActionBuilder<T> {
  return (...keys: (keyof T)[]) => {
    return (...values: any[]) => {
      const action = <any>{ type: s };
      for (let i = 0, l = keys.length; i < l; i++) {
        action[keys[i]] = values[i];
      }
      return action as T;
    };
  };
}

export type AnswerChangedAction = {
  readonly type: ActionTypeKeys.ANSWER_CHANGED;
  readonly answer: number[];
};
export const answerChanged = actionBuilder<AnswerChangedAction>(
  ActionTypeKeys.ANSWER_CHANGED
)("answer");

export type GuessSubmittedAction = {
  readonly type: ActionTypeKeys.GUESS_SUBMITTED;
  readonly value: number;
};
export const guessSubmitted = actionBuilder<GuessSubmittedAction>(
  ActionTypeKeys.GUESS_SUBMITTED
)("value");

export type GoodGuessOccurredAction = {
  readonly type: ActionTypeKeys.GOOD_GUESS_OCCURRED;
  readonly value: number;
};

export const goodGuessOccurred = actionBuilder<GoodGuessOccurredAction>(
  ActionTypeKeys.GOOD_GUESS_OCCURRED
)("value");

export type BadGuessOccurredAction = {
  readonly type: ActionTypeKeys.BAD_GUESS_OCCURRED;
  readonly value: number;
};

export const badGuessOccurred = actionBuilder<BadGuessOccurredAction>(
  ActionTypeKeys.BAD_GUESS_OCCURRED
)("value");

export type GameWonAction = {
  readonly type: ActionTypeKeys.GAME_WON;
  readonly correctAnswer: number[];
};

export const gameWon = actionBuilder<GameWonAction>(ActionTypeKeys.GAME_WON)(
  "correctAnswer"
);

export type OtherAction = {
  readonly type: ActionTypeKeys.OTHER_ACTION;
};
