import * as State from "../state";
import { ActionTypeKeys, ActionTypes } from "client/actions";

export type Reducer = (
  state: State.Type | undefined,
  action: ActionTypes
) => State.Type;

export const rootReducer: Reducer = (state = State.DEFAULT, action) => {
  switch (action.type) {
    case ActionTypeKeys.SET_POPULARITY:
      return State.popularityMode.set(state, action.popularityMode);

    default:
      return state;
  }
};
