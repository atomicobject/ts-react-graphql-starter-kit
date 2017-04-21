import {foo, callAFunctionSaga} from './index'
import {call} from 'redux-saga/effects';

it('adds 1 + 4 to equal 3 in TScript', ()=> {
  let generator = callAFunctionSaga();

  expect(generator.next().value).toEqual(call(foo, 3))
});