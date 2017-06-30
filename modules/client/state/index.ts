import { Lens } from "@atomic-object/lenses";

import { RouterState } from "react-router-redux";
import { Store as ApolloStore } from "apollo-client/store";
import * as GameState from "./game-state";

export interface Type {
  gameState: GameState.Type;
  router: RouterState;
  apollo: ApolloStore;
}

export const gameState = Lens.from<Type>().prop("gameState");
