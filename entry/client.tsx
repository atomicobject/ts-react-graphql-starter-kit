import * as React from "react";
import * as ReactDom from "react-dom";
import createSagaMiddleware from "redux-saga";

import App from "../modules/client";

import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";

import { rootSaga } from "../modules/client/sagas";
import { rootReducer } from "../modules/client/reducers";

import '../modules/client/styles/main.scss';

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(
  applyMiddleware(sagaMiddleware)
);

let store = createStore(
  rootReducer,
  enhancer
);

sagaMiddleware.run(rootSaga);

ReactDom.render(
  <Provider store={store}>
     <App />
  </Provider>,
  document.getElementById("msl-app"),
);
