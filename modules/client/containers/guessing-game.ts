import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import {Props, GuessingGame as GuessingGameComponent} from '../components/guessing-game'
import {State, GameState} from '../state'
import {assertAssignable} from '../../helpers';

import {guessSubmitted} from '../actions'
import flow from 'lodash-es/flow';

type StateProps = Pick<Props, 'showCongratulations'|'currentGuess'|'lastGuess'>
type DispatchProps = Pick<Props, 'onGuess'>
assertAssignable<Props, StateProps & DispatchProps>();

function mapStateToProps(state: GameState): StateProps {
  return {
    showCongratulations: GameState.gameWon(state),
    currentGuess: GameState.guessSequence(state),
    lastGuess: GameState.lastGuess(state),
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>): DispatchProps {
  return {
    onGuess: (n: number) => dispatch(guessSubmitted(n)),
  }
}

export const GuessingGame = connect(
  flow(State.gameState,mapStateToProps),
  mapDispatchToProps
)(GuessingGameComponent)