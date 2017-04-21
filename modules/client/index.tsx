import * as React from 'react';
import { BrowserRouter as Router, Route,Link} from 'react-router-dom'

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
      {this.props.children}
      textdfkgdl;fy
    </div>;
    
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