import * as React from "react";
import { routerMiddleware, routerReducer } from "react-router-redux";
import { Route } from "react-router-dom";

import { History } from "history";
import { AppShell } from "client/components/app";
import { HomePage } from "client/pages/home";
import { AddSnackPage } from "client/pages/add-snack";
import { Switch } from "react-router";
import { ApolloClient } from "apollo-client";
import { applyMiddleware, createStore, compose } from "redux";
import { rootReducer, Reducer } from "./reducers";
import { rootSaga } from "./sagas";
import createSagaMiddleware from "redux-saga";
import * as State from "./state";
import compact from "lodash-es/compact";

/** Build the core app store with middlewares and reducer. Used to bootstrap the app to run and to test. */
export function buildCore(args: {
  apollo: ApolloClient<any>;
  routing?: { history: History };
  decorateReducer?: (reducer: Reducer) => Reducer;
  initState?: (state: State.Type) => State.Type;
}) {
  const { routing, decorateReducer, initState } = args;

  const sagaMiddleware = createSagaMiddleware();
  const composeEnhancers =
    ((window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ as typeof compose) ||
    compose;

  const middlewares = compact([
    sagaMiddleware,

    // Support disabling routing in tests/storybook stories
    routing ? routerMiddleware(routing.history) : undefined
  ]);

  const enhancer = composeEnhancers(applyMiddleware(...middlewares));

  function enhancedReducer(s: any, e: any): State.Type {
    let state = rootReducer(s, e);
    return {
      ...state,
      router: routerReducer(s && s.router, e)
    };
  }

  const reducer = decorateReducer
    ? decorateReducer(enhancedReducer)
    : enhancedReducer;

  let state = reducer(undefined as any, { type: "@@INIT" } as any);
  if (initState) state = initState(state);

  const store = createStore(reducer, state, enhancer);

  sagaMiddleware.run(rootSaga);

  return {
    store,
    reducer: enhancedReducer
  };
}

export function App(props: {}) {
  return (
    <AppShell>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/add-snack" component={AddSnackPage} />
      </Switch>
    </AppShell>
  );
}
