import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import {StateProps, DispatchProps, GuessingGame as GuessingGameComponent} from '../components/guessing-game'
import {Guess, GuessResult, State} from '../state'
import {makeGuessAction} from '../actions'

function mapStateToProps(state: State): StateProps {
  return {
    currentGuess: State.guessSequence(state),
    lastGuess: State.lastGuess(state),
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>): DispatchProps {
  return {
    onGuess: (n: number) => dispatch(makeGuessAction(n)),
  }
}

export const GuessingGame = connect(
  mapStateToProps,
  mapDispatchToProps
)(GuessingGameComponent)