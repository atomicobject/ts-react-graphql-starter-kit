import * as React from "react";
import * as ReactDom from "react-dom";
// import createSagaMiddleware from "redux-saga";

// import App from "./components/app";

// import { Provider } from "react-redux";
// import { createStore, applyMiddleware, compose } from "redux";

// import sagas from "./sagas/index";
// import { updateState } from "../src/reducers";

import '../modules/client/styles/main.scss';

// const sagaMiddleware = createSagaMiddleware();
// const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const enhancer = composeEnhancers(
//   applyMiddleware(sagaMiddleware)
// );

// let store = createStore(
//   updateState,
//   enhancer
// );

// sagaMiddleware.run(sagas as any);

ReactDom.render(
  /*<Provider store={store}>
     <App />
  </Provider>,*/
  <div>Hasdlfkjsa askdjf lasdkfjl asdkfj lasd ljkjkllo!</div>,
  document.getElementById("msl-app"),
);
