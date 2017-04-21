import * as React from 'react';
import {ConnectedRouter} from 'react-router-redux';
import { Route,Link} from 'react-router-dom'

import {RedBox} from './components/red-box';
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
    return <RedBox>{this.props.children}
      {this.props.children}
    </RedBox>;
    
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