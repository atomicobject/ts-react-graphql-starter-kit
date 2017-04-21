import * as React from 'react';
import { BrowserRouter as Router, Route,Link} from 'react-router-dom'

import {RedBox} from './components/red-box';

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
    return <RedBox>{this.props.children}</RedBox>;
  }
}

export default function Root() {
  return <Router>
    <App>
      <Route exact path="/" component={Home} />
      <Route path="/foo" component={Foo} />
    </App>
  </Router>;
}