import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import {StateProps, DispatchProps, GuessingGame as GuessingGameComponent} from '../components/guessing-game'
import {Guess, GuessResult} from '../state'

function mapStateToProps(state: any): StateProps {
  return {
    currentGuess: [2],
    lastGuess: {status: GuessResult.CORRECT, value: 2}
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>): DispatchProps {
  return {
    onGuess: (n: number) => alert(`Component guess is ${n}`),
  }
}

export const GuessingGame = connect(
  mapStateToProps,
  mapDispatchToProps
)(GuessingGameComponent)