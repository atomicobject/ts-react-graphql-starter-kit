import {SagaIterator} from 'redux-saga';
import {call, put, takeLatest, take, spawn, fork} from 'redux-saga/effects';
import {delay} from 'redux-saga'
import {ActionTypes,
        GuessSubmittedAction, 
        goodGuessOccurred, 
        badGuessOccurred, 
        gameWon} from '../actions'

export async function foo(x:number) : Promise<string> {
  console.log("called me")
  return "Howdy!";
}

export function* callAFunctionSaga() : SagaIterator {
  const x: string = yield call(foo, 3);
  yield call(delay, 100);
  yield put({type: 'gotResult', value: x});
}

export function* gameSaga() : SagaIterator {
  const rightAnswer = [2,3,1];
  let guessedRight = false;  
  while(!guessedRight) {
    let currentGuess = 0; 
    for(; currentGuess < rightAnswer.length; currentGuess++) {
      const guess: GuessSubmittedAction = yield take(ActionTypes.GUESS_SUBMITTED);
      if (guess.value === rightAnswer[currentGuess]) {
        yield put(goodGuessOccurred(guess.value));
      } else {
        yield put(badGuessOccurred(guess.value));
        break;;
      } 
    }
    if (currentGuess === rightAnswer.length) {
      yield put(gameWon(rightAnswer));
    }

    // wait for another guess.
    // if guessed wrong, put(bad guess) restart loop;
    // if guesed right, put(good guess!)

    // wait for another guess.
    // if guessed wrong, put(bad guess) restart loop;
    // if guesed right, put(good guess!)

    // guessedRight = true;
  }
}

export function* rootSaga() : SagaIterator {
  yield fork(gameSaga);
}