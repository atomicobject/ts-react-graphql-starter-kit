import * as React from 'react';
import {ConnectedRouter} from 'react-router-redux';
import { Route,Link} from 'react-router-dom'

import {RedBox} from './components/red-box';
import {GuessingGame, Props as GameProps} from './components/guessing-game';
import {History} from 'history';

function Home() {
  return <div>
    <div>Home</div>
    <Link to="/foo">Go</Link>
    <Link to="/game">Game</Link>
  </div>;
}

function Foo() {
  return <div>
    <div>Foo</div>
    <Link to="/">Go Home</Link>
  </div>;
}

function Game() {
  const props: GameProps = {
    currentGuess: [1, 3],
    lastGuess: {status: "CORRECT", value: 2},
    onGuess: (n: number) => alert(`hello ${n}`),
  }
  return <div>
    <GuessingGame {...props}></GuessingGame>
    <Link to="/">Go Home</Link>
  </div>;
}

class App extends React.Component<{},{}> {
  render() {
    return <div>
      <RedBox> {this.props.children}</RedBox>
    </div>
    
  }
}

export default function Root(props: {history: History}) {
  return <ConnectedRouter history={props.history}>
    <App>
      <Route exact path="/" component={Home} />
      <Route path="/foo" component={Foo} />
      <Route path="/game" component={Game} />
    </App>
  </ConnectedRouter>;
}