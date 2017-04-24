import * as React from 'react';

require('./styles.scss');

export class GuessingGame extends React.Component<{},{}> {
  render() {
    return <div className="blue-box">
        {this.props.children}
        <button> boop </button>
        <button> boop </button>
        <button> boop </button>
    </div>
  }
}