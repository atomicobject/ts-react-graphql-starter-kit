import { RouterState } from "react-router-redux";
import { Lens } from "@atomic-object/lenses";

export enum PopularityMode {
  PERCENTAGE = "PERCENTAGE",
  VOTE_COUNT = "VOTE_COUNT"
}

interface State {
  readonly router: RouterState;
  readonly popularityMode: PopularityMode;
}
export type Type = State;

export const popularityMode = Lens.from<State>().prop("popularityMode");

export const DEFAULT: State = {
  router: undefined as any, // provided at startup
  popularityMode: PopularityMode.PERCENTAGE
};
