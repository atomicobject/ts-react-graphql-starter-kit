import * as State from "../state";
import { ActionTypes } from "client/actions";

export type Reducer = (
  state: State.Type | undefined,
  action: ActionTypes
) => State.Type;

export const rootReducer: Reducer = (state = State.DEFAULT, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
