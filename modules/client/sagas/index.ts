import { SagaIterator } from "redux-saga";
import { call, put, take, fork, select } from "redux-saga/effects";

// tslint chokes on this and thinks it's unused for some reason
// tslint:disable-next-line no-unused-variable
import { AnswerQuery } from "../graphql-types";

import {
  ActionTypeKeys,
  GuessSubmittedAction,
  answerChanged,
  goodGuessOccurred,
  badGuessOccurred,
  gameWon
} from "../actions";

import * as State from "../state";
import * as GameState from "../state/game-state";

import { graphqlClient } from "../graphql-client";

export async function fetchAnswers(): Promise<AnswerQuery["answer"]> {
  const result = await graphqlClient.query<AnswerQuery>({
    query: require("./Answer.graphql"),
    fetchPolicy: "network-only"
  });

  return result.data.answer;
}

export function* gameSaga(): SagaIterator {
  const getAnswer = State.gameState.comp(GameState.answerSequence);
  while (true) {
    let guessedRight = false;
    const newAnswer: AnswerQuery["answer"] = yield call(fetchAnswers);
    yield put(answerChanged(newAnswer));

    while (!guessedRight) {
      let currentGuess = 0;

      const rightAnswer: number[] = yield select<State.Type>(getAnswer);
      for (; currentGuess < rightAnswer.length; currentGuess++) {
        const guess: GuessSubmittedAction = yield take(
          ActionTypeKeys.GUESS_SUBMITTED
        );
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
