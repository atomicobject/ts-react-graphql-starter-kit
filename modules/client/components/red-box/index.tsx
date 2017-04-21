import * as React from 'react';

require('./styles.scss');

export class RedBox extends React.Component<{},{}> {
  render() {
    return <div className="red-box">{this.props.children}</div>
  }
}