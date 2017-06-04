import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import {Props, GuessingGame as GuessingGameComponent} from '../components/guessing-game'
import {State, GameState} from '../state'
import {assertAssignable} from '../../helpers';

import {guessSubmitted} from '../actions'
import flow from 'lodash-es/flow';

type StateProps = Pick<Props, 'showCongratulations'|'currentGuess'|'lastGuess'>
type DispatchProps = Pick<Props, 'onGuess'>
type OwnProps = {}
assertAssignable<Props, StateProps & DispatchProps>();

function mapStateToProps(state: State, ownProps: OwnProps): StateProps {
  const gameState = State.gameState(state);
  return {
    showCongratulations: GameState.gameWon(gameState),
    currentGuess: GameState.guessSequence(gameState),
    lastGuess: GameState.lastGuess(gameState),
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>, ownProps: OwnProps): DispatchProps {
  return {
    onGuess: (n: number) => dispatch(guessSubmitted(n)),
  }
}

export const GuessingGame = connect(
  mapStateToProps,
  mapDispatchToProps
)<OwnProps>(GuessingGameComponent)