import { RouterState } from "react-router-redux";

interface State {
  readonly router: RouterState;
}
export type Type = State;

export const DEFAULT: State = {
  router: undefined as any // provided at startup
};
