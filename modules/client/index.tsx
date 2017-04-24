import * as React from 'react';
import {ConnectedRouter} from 'react-router-redux';
import { Route,Link} from 'react-router-dom'

import {RedBox} from './components/red-box';
import {GuessingGame} from './components/guessing-game';
import {History} from 'history';

function Home() {
  return <div>
    <div>Home</div>
    <Link to="/foo">Go</Link>
  </div>;
}

function Foo() {
  return <div>
    <div>Foo</div>
    <Link to="/">Go Home</Link>
  </div>;
}

class App extends React.Component<{},{}> {
  render() {
    return <div>
      <RedBox> {this.props.children}</RedBox>
      <GuessingGame>{this.props.children}</GuessingGame>
    </div>
    
  }
}

export default function Root(props: {history: History}) {
  return <ConnectedRouter history={props.history}>
    <App>
      <Route exact path="/" component={Home} />
      <Route path="/foo" component={Foo} />
    </App>
  </ConnectedRouter>;
}