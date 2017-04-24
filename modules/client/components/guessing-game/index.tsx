import * as React from 'react';
import {strEnum} from '../../../helpers';
import {partial} from 'lodash';

require('./styles.scss');

const GuessResult = strEnum(["CORRECT", "INCORRECT"]);
type GuessResult = keyof typeof GuessResult;
interface Guess {status: GuessResult, value: number};

export interface Props {
  currentGuess: number[],
  lastGuess?: Guess, 
  onGuess: (n: number) => void,
}

function presentLastGuess(guess: Guess) {
  const correctnessDescription = guess.status === GuessResult.CORRECT ? "RIGHT" : "WRONG"
  return <p> {guess.value} was {correctnessDescription} </p>
}

export class GuessingGame extends React.Component<Props,{}> {
  render() {
    const onGuess = this.props.onGuess;
    const lastGuess = this.props.lastGuess;
    const lastGuessDisplay = this.props.lastGuess ? presentLastGuess(this.props.lastGuess) : <p>No guess yet</p>;
    return <div className="blue-box">
        <p> Take a guess! </p>
        <button onClick={partial(onGuess, 1)}> 1 </button>
        <button onClick={partial(onGuess, 2)}> 2 </button>
        <button onClick={partial(onGuess, 3)}> 3 </button>
        {lastGuessDisplay}        
        <p> Current guess is: {this.props.currentGuess.join(", ")}</p>
        {this.props.children}
    </div>
  }
}