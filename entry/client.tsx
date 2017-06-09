import * as React from "react";
import * as ReactDom from "react-dom";
import createSagaMiddleware from "redux-saga";

import App from "../modules/client";

import { createStore, applyMiddleware, compose, combineReducers } from "redux";

import { rootSaga } from "../modules/client/sagas";
import { rootReducer } from "../modules/client/reducers";
import { State } from "../modules/client/state";

require('../modules/client/styles/main.scss');

import { routerReducer, routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory';

import gql from 'graphql-tag';

import {graphqlClient} from '../modules/client/graphql-client'
import {ApolloProvider, createApolloReducer} from 'react-apollo';

const history = createHistory()

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ as typeof compose
      || compose;

const enhancer = composeEnhancers(
  applyMiddleware(
    sagaMiddleware,
    routerMiddleware(history),
    graphqlClient.middleware()
  )
);

const apolloReducer = graphqlClient.reducer();
function enhancedReducer(s:any, e:any): State {
  let state = rootReducer(s,e);
  return {...state, 
    router: routerReducer(s && s.router, e),
    apollo: apolloReducer(s && s.apollo, e)
  };
}

let store = createStore(
  enhancedReducer,
  enhancer,
);

sagaMiddleware.run(rootSaga);

ReactDom.render(
  <ApolloProvider client={graphqlClient} store={store}>
     <App history={history} />
  </ApolloProvider>,
  document.getElementById("msl-app"),
);
