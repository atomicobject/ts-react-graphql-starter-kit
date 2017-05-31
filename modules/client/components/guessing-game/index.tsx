import * as React from 'react';
import partial from 'lodash-es/partial';
import {Guess, GuessResult} from '../../state'

require('./styles.scss');

export interface StateProps {
  showCongratulations: boolean,
  currentGuess: number[],
  lastGuess?: Guess, 
}

export interface DispatchProps {
  onGuess: (n: number) => void,
}

export interface Props extends StateProps, DispatchProps{ }

function presentLastGuess(guess: Guess) {
  const correctnessDescription = guess.status === GuessResult.CORRECT ? "RIGHT" : "WRONG"
  return <p> {guess.value} was {correctnessDescription} </p>
}

export class GuessingGame extends React.Component<Props,{}> {
  render() {
    const onGuess = this.props.onGuess;
    const lastGuessDisplay = this.props.lastGuess ? presentLastGuess(this.props.lastGuess) : <p>No guess yet</p>;
    const congratsDisplay = this.props.showCongratulations ? 
      <h1>Congratulations! You won!</h1> :
      "";
        
    return <div className="guessing-game">
        {congratsDisplay}

        <h2> Take a guess! </h2>

        <div className="guessing-game-buttons">
          <button className="btn guess" onClick={partial(onGuess, 1)}> 1 </button>
          <button className="btn guess" onClick={partial(onGuess, 2)}> 2 </button>
          <button className="btn guess" onClick={partial(onGuess, 3)}> 3 </button>
        </div>

        {lastGuessDisplay}        
        <p> Current guess is: {this.props.currentGuess.join(", ")}</p>
        {this.props.children}
    </div>
  }
}