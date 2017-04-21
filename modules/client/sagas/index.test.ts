import {foo, callAFunctionSaga} from './index'
import {call, put} from 'redux-saga/effects';
import {delay} from 'redux-saga';

describe("a saga", () => {
  it('adds 1 + 4 to equal 3 in TScript', () => {
    let generator = callAFunctionSaga();
    let nextEffect;

    nextEffect = generator.next();

    expect(nextEffect.value).toEqual(call(foo, 3))
    nextEffect = generator.next("asdf")

    expect(nextEffect.value).toEqual(call(delay, 100));
    nextEffect = generator.next()

    expect(nextEffect.value).toEqual(put({type: 'gotResult', value: 'asdf'}));

    expect(generator.next().done).toBeTruthy();
  });
})