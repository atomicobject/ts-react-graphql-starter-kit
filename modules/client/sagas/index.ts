import {SagaIterator} from 'redux-saga';
import {call, put} from 'redux-saga/effects';
import {delay} from 'redux-saga'

export function foo(x:number) : string {
  return null as any;
}

export function* callAFunctionSaga() : SagaIterator {
  const x: string = yield call(foo, 3);
  yield call(delay, 100);
  yield put({type: 'gotResult', value: x});
}

export function* rootSaga() : SagaIterator {
}