import * as React from "react";
import { ConnectedRouter } from "react-router-redux";
import { Route, Link } from "react-router-dom";

import { RedBox } from "./components/red-box";
import { GuessingGame } from "./containers/guessing-game";
import { History } from "history";

function Home() {
  return (
    <div>
      <div>Home</div>
      <Link to="/game">Game</Link>
    </div>
  );
}

function Game() {
  return (
    <div>
      <GuessingGame />
      <Link to="/">Go Home</Link>
    </div>
  );
}

class App extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <RedBox> {this.props.children}</RedBox>
      </div>
    );
  }
}

export default function Root(props: { history: History }) {
  return (
    <ConnectedRouter history={props.history}>
      <App>
        <Route exact path="/" component={Home} />
        <Route path="/game" component={Game} />
      </App>
    </ConnectedRouter>
  );
}
