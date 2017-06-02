import * as React from 'react';

require('./styles.scss');

export interface Props {
}

export class RedBox extends React.Component<Props,{}> {
  render() {
    return <div className="red-box">{this.props.children}</div>
  }
}