import {SagaIterator} from 'redux-saga';
import {call, put} from 'redux-saga/effects';
import {delay} from 'redux-saga'

export async function foo(x:number) : Promise<string> {
  console.log("called me")
  return "Howdy!";
}

export function* callAFunctionSaga() : SagaIterator {
  const x: string = yield call(foo, 3);
  yield call(delay, 100);
  yield put({type: 'gotResult', value: x});
}

export function* rootSaga() : SagaIterator {
}