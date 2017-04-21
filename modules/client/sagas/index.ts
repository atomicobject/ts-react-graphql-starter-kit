import {SagaIterator} from 'redux-saga';
import {call} from 'redux-saga/effects';

function foo(x:number) : string {
  return null as any;
}

export function* rootSaga() : SagaIterator {
  const x : string = yield call(foo, 3)
}