import { SagaIterator } from 'redux-saga';
import { call, put, take, fork, select } from 'redux-saga/effects';
import { delay } from 'redux-saga'
import {AnswerQuery} from '../graphql-types'
import {
  ActionTypes,
  GuessSubmittedAction,
  answerChanged,
  goodGuessOccurred,
  badGuessOccurred,
  gameWon
} from '../actions'
import { State,GameState } from '../state'

import { graphqlClient } from '../graphql-client';
import gql from 'graphql-tag';

import { Answer } from '../../graphql/types';

export async function foo(x: number): Promise<string> {
  console.log("called me")
  return "Howdy!";
}

export function* callAFunctionSaga(): SagaIterator {
  const x: string = yield call(foo, 3);
  yield call(delay, 100);
  yield put({ type: 'gotResult', value: x });
}

export async function fetchAnswers(): Promise<number[]> {
  const result = await graphqlClient.query<AnswerQuery>({
    query: require('./Answer.graphql'),
    fetchPolicy: "network-only"
  });

  return result.data.answer;
}

export function* gameSaga(): SagaIterator {
  const getAnswer = State.gameState.comp(GameState.answerSequence)
  while (true) {
    let guessedRight = false;
    const newAnswer: Answer = yield call(fetchAnswers)
    yield put(answerChanged(newAnswer))

    while (!guessedRight) {
      let currentGuess = 0;

      const rightAnswer: Answer = yield select<State>(getAnswer);
      for (; currentGuess < rightAnswer.length; currentGuess++) {
        const guess: GuessSubmittedAction = yield take(ActionTypes.GUESS_SUBMITTED);
        if (guess.value === rightAnswer[currentGuess]) {
          yield put(goodGuessOccurred(guess.value));
        } else {
          yield put(badGuessOccurred(guess.value));
          break;
        }
      }
      if (currentGuess === rightAnswer.length) {
        yield put(gameWon(rightAnswer));
        guessedRight = true;
      }
    }
  }
}

export function* rootSaga(): SagaIterator {
  yield fork(gameSaga);
}