import {SagaIterator} from 'redux-saga';
import {call} from 'redux-saga/effects';

export function foo(x:number) : string {
  return null as any;
}

export function* callAFunctionSaga() : SagaIterator {
  const x : string = yield call(foo, 3);
}

export function* rootSaga() : SagaIterator {
}